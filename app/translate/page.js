'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './translate.module.css';

const LANGUAGE_PAIRS = [
  { id: 'en-es', source: 'English', target: 'Spanish', label: 'English ↔ Spanish' },
  { id: 'en-pt', source: 'English', target: 'Portuguese', label: 'English ↔ Portuguese' },
  { id: 'en-ht', source: 'English', target: 'Haitian Creole', label: 'English ↔ Haitian Creole' },
];

const STORAGE_KEY = 'translate-page-state-v1';

export default function TranslatePage() {
  const [sourceLanguage, setSourceLanguage] = useState('English');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [turns, setTurns] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [status, setStatus] = useState('Ready');
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [blockedAudioTurnId, setBlockedAudioTurnId] = useState(null);
  const [debugInfo, setDebugInfo] = useState({
    recorderMimeType: '',
    blobType: '',
    blobSize: 0,
    fileSize: 0,
    recordingDurationMs: 0,
    transcript: '',
    chunkCount: 0,
    lastApiErrorStep: '',
    lastApiErrorDetail: '',
    lastApiErrorTranscript: '',
    audioSizeWarning: '',
    micInputLevel: 0,
    micLevelWarning: '',
  });

  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const activeSpeakerRef = useRef(null);
  const activeAudioRef = useRef(null);
  const recordingStartTimeRef = useRef(0);
  const isForceStoppingRef = useRef(false);
  const isCleaningUpRef = useRef(false);
  const isUploadingRef = useRef(false);
  const requestDataIntervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micMeterAnimationRef = useRef(null);
  const micStreamSourceRef = useRef(null);

  const statusClass = status.toLowerCase().replace(/\s+/g, '-');

  const clearRequestTimer = useCallback(() => {
    if (requestDataIntervalRef.current) {
      clearInterval(requestDataIntervalRef.current);
      requestDataIntervalRef.current = null;
    }
  }, []);

  const stopMicMeter = useCallback(() => {
    if (micMeterAnimationRef.current) {
      cancelAnimationFrame(micMeterAnimationRef.current);
      micMeterAnimationRef.current = null;
    }
    if (micStreamSourceRef.current) {
      micStreamSourceRef.current.disconnect();
      micStreamSourceRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setDebugInfo((prev) => ({ ...prev, micInputLevel: 0, micLevelWarning: '' }));
  }, []);

  const startMicMeter = useCallback(async (stream) => {
    stopMicMeter();
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audioContext = new AudioContextClass();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
    audioContextRef.current = audioContext;
    micStreamSourceRef.current = source;
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteTimeDomainData(dataArray);
      let sumSquares = 0;
      for (let i = 0; i < dataArray.length; i += 1) {
        const normalized = (dataArray[i] - 128) / 128;
        sumSquares += normalized * normalized;
      }
      const rms = Math.sqrt(sumSquares / dataArray.length);
      const level = Math.min(100, Math.round(rms * 280));
      setDebugInfo((prev) => ({
        ...prev,
        micInputLevel: level,
        micLevelWarning: status === 'Recording' && level < 8 ? 'Microphone input appears very low.' : '',
      }));
      micMeterAnimationRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, [status, stopMicMeter]);

  const fullCleanup = useCallback((nextStatus = 'Ready', options = { forceStop: false }) => {
    if (options.forceStop) isForceStoppingRef.current = true;
    isCleaningUpRef.current = true;
    clearRequestTimer();

    const recorder = recorderRef.current;
    if (recorder && recorder.state === 'recording') recorder.stop();

    streamRef.current?.getTracks().forEach((track) => track.stop());
    stopMicMeter();
    chunksRef.current = [];
    recorderRef.current = null;
    streamRef.current = null;
    activeSpeakerRef.current = null;
    setActiveSpeaker(null);
    setIsProcessing(false);
    setStatus(nextStatus);
    setDebugInfo((prev) => ({ ...prev, chunkCount: 0 }));

    setTimeout(() => {
      isForceStoppingRef.current = false;
      isCleaningUpRef.current = false;
    }, 150);
  }, [clearRequestTimer, stopMicMeter]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setTurns(parsed.turns || []);
      setLesson(parsed.lesson || null);
      setSourceLanguage(parsed.sourceLanguage || 'English');
      setTargetLanguage(parsed.targetLanguage || 'Spanish');
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ turns, lesson, sourceLanguage, targetLanguage }));
  }, [turns, lesson, sourceLanguage, targetLanguage]);

  useEffect(() => () => {
    isForceStoppingRef.current = true;
    isCleaningUpRef.current = true;
    clearRequestTimer();
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    stopMicMeter();
    chunksRef.current = [];
    recorderRef.current = null;
    streamRef.current = null;
    activeAudioRef.current?.pause();
  }, [clearRequestTimer, stopMicMeter]);

  const selectedPairId = useMemo(() => {
    const match = LANGUAGE_PAIRS.find((pair) =>
      (pair.source === sourceLanguage && pair.target === targetLanguage) ||
      (pair.target === sourceLanguage && pair.source === targetLanguage));
    return match?.id || 'custom';
  }, [sourceLanguage, targetLanguage]);

  const playTranslationAudio = useCallback(async (audioBase64, turnId = null) => {
    const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
    activeAudioRef.current = audio;
    try {
      await audio.play();
      setBlockedAudioTurnId(null);
    } catch {
      if (turnId) setBlockedAudioTurnId(turnId);
    }
  }, []);

  const startRecording = useCallback(async (speaker, origin = 'click-toggle') => {
    console.log('[translate] startRecording called', {
      origin,
      speaker,
      status,
      recorderState: recorderRef.current?.state || 'none',
      hasStream: Boolean(streamRef.current),
    });

    if (
      isForceStoppingRef.current ||
      isCleaningUpRef.current ||
      isUploadingRef.current ||
      recorderRef.current ||
      streamRef.current ||
      ['Recording', 'Processing', 'Translating', 'Speaking translation'].includes(status)
    ) return;

    setError('');
    try {
      chunksRef.current = [];
      setDebugInfo((prev) => ({
        ...prev,
        chunkCount: 0,
        transcript: '',
        lastApiErrorStep: '',
        lastApiErrorDetail: '',
        lastApiErrorTranscript: '',
        audioSizeWarning: '',
        micInputLevel: 0,
        micLevelWarning: '',
      }));
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      await startMicMeter(stream);

      const mimeCandidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
      const mimeType = mimeCandidates.find((type) => MediaRecorder.isTypeSupported(type)) || '';
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recorderRef.current = recorder;
      activeSpeakerRef.current = speaker;
      recordingStartTimeRef.current = Date.now();

      const selectedRecorderMimeType = recorder.mimeType || mimeType || 'default';
      setDebugInfo((prev) => ({ ...prev, recorderMimeType: selectedRecorderMimeType }));

      recorder.ondataavailable = (event) => {
        if (isForceStoppingRef.current || isCleaningUpRef.current) return;
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
          console.log('[translate] chunk received', { count: chunksRef.current.length, size: event.data.size });
          setDebugInfo((prev) => ({ ...prev, chunkCount: chunksRef.current.length }));
        }
      };

      recorder.onstop = async () => {
        console.log('[translate] onstop fired');
        clearRequestTimer();

        if (isForceStoppingRef.current || isCleaningUpRef.current) {
          chunksRef.current = [];
          streamRef.current?.getTracks().forEach((track) => track.stop());
          recorderRef.current = null;
          streamRef.current = null;
          activeSpeakerRef.current = null;
          setActiveSpeaker(null);
          setIsProcessing(false);
          setStatus('Ready');
          return;
        }

        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const blobType = blob.type || recorder.mimeType || 'audio/webm';
        const recordingDurationMs = Date.now() - recordingStartTimeRef.current;

        if (blob.size <= 0) {
          setError('No speech detected. Please try again.');
          fullCleanup('Ready');
          return;
        }

        try {
          isUploadingRef.current = true;
          setIsProcessing(true);
          setStatus('Translating');
          const audioFile = new File([blob], 'recording.webm', { type: blobType });
          const audioSizeWarning =
            recordingDurationMs > 2000 && blob.size < 10000
              ? 'Audio file is unusually small. Microphone may not be capturing clearly.'
              : '';
          if (audioSizeWarning) {
            console.warn('[translate] small audio blob warning', { blobSize: blob.size, recordingDurationMs });
          }
          setDebugInfo((prev) => ({ ...prev, blobType, blobSize: blob.size, fileSize: audioFile.size, recordingDurationMs, audioSizeWarning }));

          const formData = new FormData();
          formData.append('audio', blob, 'recording.webm');
          formData.append('sourceLanguage', sourceLanguage);
          formData.append('targetLanguage', targetLanguage);
          formData.append('speaker', activeSpeakerRef.current);

          const response = await fetch('/api/translate-turn', { method: 'POST', body: formData });
          const data = await response.json();
          if (!response.ok) {
            console.error('[translate] API error', { status: response.status, data });
            setDebugInfo((prev) => ({
              ...prev,
              lastApiErrorStep: data?.step || 'unknown',
              lastApiErrorDetail: data?.detail || data?.error || 'Unknown error',
              lastApiErrorTranscript: data?.transcript || '',
              transcript: data?.transcript || prev.transcript,
            }));
            throw new Error(data?.detail || data?.error || 'Translation failed.');
          }

          if (!data?.transcript?.trim()) throw new Error('No speech detected. Please try again.');

          setDebugInfo((prev) => ({ ...prev, transcript: data.transcript }));
          const nextTurn = { id: crypto.randomUUID(), ...data };
          setTurns((prev) => [...prev, nextTurn]);
          setStatus('Speaking translation');
          if (data.audioBase64) await playTranslationAudio(data.audioBase64, nextTurn.id);
          setStatus('Ready');
        } catch (err) {
          setError(err?.message || 'Something went wrong while translating.');
          setStatus('Ready');
        } finally {
          isUploadingRef.current = false;
          fullCleanup('Ready');
        }
      };

      recorder.start();
      setActiveSpeaker(speaker);
      setStatus('Recording');
    } catch {
      fullCleanup('Error');
      setError('Microphone permission is needed to translate speech.');
    }
  }, [clearRequestTimer, fullCleanup, playTranslationAudio, sourceLanguage, startMicMeter, status, targetLanguage]);

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder?.state === 'recording') recorder.stop();
  }, []);

  const toggleSpeaker = (speaker) => {
    if (isProcessing || isUploadingRef.current) return;
    const isActive = activeSpeaker === speaker && recorderRef.current?.state === 'recording';
    if (isActive) stopRecording();
    else startRecording(speaker, 'speaker-button-click');
  };

  const onSelectPair = (id) => {
    const pair = LANGUAGE_PAIRS.find((entry) => entry.id === id);
    if (!pair) return;
    setSourceLanguage(pair.source);
    setTargetLanguage(pair.target);
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  const createLesson = async () => {
    if (!turns.length || isProcessing) return;
    setIsProcessing(true);
    setError('');
    setStatus('Translating');
    try {
      const response = await fetch('/api/translate-lesson', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turns, learningLanguage: targetLanguage }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not create lesson.');
      setLesson(data);
      setStatus('Ready');
    } catch (err) {
      setStatus('Error');
      setError(err.message || 'Could not create lesson.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearConversation = () => {
    fullCleanup('Ready', { forceStop: true });
    setTurns([]);
    setLesson(null);
    setError('');
    setBlockedAudioTurnId(null);
    setDebugInfo((prev) => ({ ...prev, lastApiErrorStep: '', lastApiErrorDetail: '', lastApiErrorTranscript: '', transcript: '' }));
  };

  return (<section className={`${styles.wrapper} section`}><div className={`container ${styles.container}`}>
    <h1>Translate</h1><p className={styles.subtitle}>Speak. Translate. Learn.</p>
    <div className={styles.toolbar}><select id="translate-language-pair" name="translateLanguagePair" className={styles.select} value={selectedPairId} onChange={(event) => onSelectPair(event.target.value)}>{LANGUAGE_PAIRS.map((pair) => <option key={pair.id} value={pair.id}>{pair.label}</option>)}</select><button type="button" className={`button secondary ${styles.swapButton}`} onClick={swapLanguages}>Swap ({sourceLanguage} → {targetLanguage})</button></div>
    <div className={`${styles.state} ${styles[statusClass] || ''}`}><span>{status === 'Recording' ? 'Listening…' : status}</span>{activeSpeaker && <strong>{activeSpeaker === 'me' ? 'I’m Speaking' : 'They’re Speaking'}</strong>}{status === 'Recording' && <span className={styles.pulse} aria-hidden />}</div>
    {error ? <p className={styles.error}>{error}</p> : null}
    <div className={styles.feed}>{turns.map((turn) => <article className={styles.turnCard} key={turn.id}><h3>{turn.speaker === 'me' ? 'You' : 'Other Person'}</h3><p><strong>{turn.sourceLanguage}:</strong> {turn.transcript}</p><p><strong>{turn.targetLanguage}:</strong> {turn.translation}</p>{turn.audioBase64 ? <button type="button" className={`button secondary ${styles.playButton}`} onClick={() => playTranslationAudio(turn.audioBase64, turn.id)}>{blockedAudioTurnId === turn.id ? 'Play Translation' : 'Replay Translation'}</button> : null}</article>)}{!turns.length ? <p className={styles.empty}>Conversation turns will appear here.</p> : null}</div>
    <div className={styles.actionsRow}><button type="button" className="button secondary" onClick={clearConversation}>Clear Conversation</button><button type="button" className="button secondary" onClick={() => fullCleanup('Ready', { forceStop: true })}>Force Stop Mic</button><button type="button" className="button primary" onClick={createLesson} disabled={!turns.length || isProcessing}>Create Lesson From This Conversation</button></div>
    {lesson ? (
          <section className={styles.lessonPanel}>
            <h2>Conversation Lesson</h2>
            <h3>Words from this conversation</h3>
            <ul>{lesson.vocabulary?.map((item, index) => <li key={`${item.word}-${index}`}>{item.word} — {item.meaning} ({item.example})</li>)}</ul>
            <h3>Useful phrases</h3>
            <ul>{lesson.phrases?.map((item, index) => <li key={`${item.phrase}-${index}`}>{item.phrase} — {item.meaning}</li>)}</ul>
            <h3>Sentence pattern</h3>
            <p>{lesson.pattern}</p>
            <h3>Mini practice</h3>
            <ul>{lesson.practice?.map((item, index) => <li key={`practice-${index}`}>{item}</li>)}</ul>
            <h3>Quick quiz</h3>
            <ul>{lesson.quiz?.map((item, index) => <li key={`quiz-${index}`}>{item.question} — {item.answer}</li>)}</ul>
            <h3>Review next time</h3>
            <ul>{lesson.reviewNextTime?.map((item, index) => <li key={`review-${index}`}>{item}</li>)}</ul>
          </section>
        ) : null}
    <section className={styles.debugPanel}><h3>Recorder Debug (temporary)</h3><ul><li><strong>Current status:</strong> {status}</li><li><strong>Active speaker:</strong> {activeSpeaker || 'n/a'}</li><li><strong>Recorder state:</strong> {recorderRef.current?.state || 'none'}</li><li><strong>Stream active:</strong> {streamRef.current ? 'true' : 'false'}</li><li><strong>MIME type:</strong> {debugInfo.recorderMimeType || 'n/a'}</li><li><strong>Blob type:</strong> {debugInfo.blobType || 'n/a'}</li><li><strong>Blob size:</strong> {debugInfo.blobSize} bytes</li><li><strong>File size:</strong> {debugInfo.fileSize} bytes</li><li><strong>Duration:</strong> {debugInfo.recordingDurationMs} ms</li><li><strong>Chunk count:</strong> {debugInfo.chunkCount}</li><li><strong>Live mic input level:</strong> {debugInfo.micInputLevel || 0}/100<div className={styles.micMeter}><div className={styles.micMeterFill} style={{ width: `${debugInfo.micInputLevel || 0}%` }} /></div>{debugInfo.micLevelWarning ? <div className={styles.micMeterWarning}>{debugInfo.micLevelWarning}</div> : null}</li><li><strong>Transcript:</strong> {debugInfo.transcript || debugInfo.lastApiErrorTranscript || 'n/a'}</li><li><strong>Last API error step:</strong> {debugInfo.lastApiErrorStep || 'n/a'}</li><li><strong>Last API error detail:</strong> {debugInfo.lastApiErrorDetail || 'n/a'}</li><li><strong>Last API error transcript:</strong> {debugInfo.lastApiErrorTranscript || 'n/a'}</li><li><strong>Audio warning:</strong> {debugInfo.audioSizeWarning || 'n/a'}</li></ul></section>
    <div className={styles.speakerDock}><div className={styles.speakerRow}>{[{ key: 'me', label: 'I’m Speaking' }, { key: 'them', label: 'They’re Speaking' }].map((speaker) => <button key={speaker.key} id={`speaker-${speaker.key}`} name={`speaker-${speaker.key}`} type="button" className={`${styles.speakButton} ${activeSpeaker === speaker.key ? styles.active : ''}`} onClick={() => toggleSpeaker(speaker.key)} disabled={isProcessing}><span>{speaker.label}</span>{activeSpeaker === speaker.key ? <small>Listening… Click to stop</small> : <small>Click to start</small>}</button>)}</div></div>
  </div></section>);
}
