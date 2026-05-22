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
  });

  const mediaRecorderRef = useRef(null);
  const recordingStartTimeRef = useRef(0);
  const mediaStreamRef = useRef(null);
  const recordingSpeakerRef = useRef(null);
  const audioChunksRef = useRef([]);
  const activeAudioRef = useRef(null);
  const stopResolveRef = useRef(null);
  const stopRejectRef = useRef(null);

  const statusClass = status.toLowerCase().replace(/\s+/g, '-');

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setTurns(parsed.turns || []);
      setLesson(parsed.lesson || null);
      setSourceLanguage(parsed.sourceLanguage || 'English');
      setTargetLanguage(parsed.targetLanguage || 'Spanish');
    } catch {
      // no-op: ignore bad localStorage payload
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ turns, lesson, sourceLanguage, targetLanguage }),
    );
  }, [turns, lesson, sourceLanguage, targetLanguage]);

  useEffect(() => {
    return () => {
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state === 'recording') {
        recorder.stop();
      }
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      audioChunksRef.current = [];
      activeAudioRef.current?.pause();
    };
  }, []);

  const selectedPairId = useMemo(() => {
    const match = LANGUAGE_PAIRS.find(
      (pair) =>
        (pair.source === sourceLanguage && pair.target === targetLanguage) ||
        (pair.target === sourceLanguage && pair.source === targetLanguage),
    );
    return match?.id || 'custom';
  }, [sourceLanguage, targetLanguage]);

  const cleanupRecording = useCallback((nextStatus = 'Ready') => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === 'recording') {
      console.log('[translate] cleanup stopping active recorder');
      recorder.stop();
    }
    mediaRecorderRef.current = null;
    recordingSpeakerRef.current = null;
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      console.log('[translate] tracks stopped');
    }
    mediaStreamRef.current = null;
    audioChunksRef.current = [];
    console.log('[translate] chunks cleared');
    stopResolveRef.current = null;
    stopRejectRef.current = null;
    setActiveSpeaker(null);
    setIsProcessing(false);
    setStatus(nextStatus);
  }, []);

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

  const startRecording = useCallback(async (speaker) => {
    console.log('[translate] recording start requested', { speaker });
    if (mediaRecorderRef.current?.state === 'recording' || isProcessing) {
      console.log('[translate] recorder state on start', mediaRecorderRef.current?.state || 'none');
      return;
    }
    setError('');
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mimeCandidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
      const mimeType = mimeCandidates.find((type) => MediaRecorder.isTypeSupported(type)) || '';
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recordingSpeakerRef.current = speaker;
      recordingStartTimeRef.current = Date.now();
      const selectedRecorderMimeType = recorder.mimeType || mimeType || 'default';
      console.log('[translate] recorder state on start', recorder.state);
      console.log('[translate] recording started', { speaker, mimeType: selectedRecorderMimeType });
      setDebugInfo((prev) => ({ ...prev, recorderMimeType: selectedRecorderMimeType, transcript: '' }));
      recorder.ondataavailable = (event) => {
        console.log('[translate] chunk received', { size: event.data?.size || 0, type: event.data?.type || 'unknown' });
        if (event.data?.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('[translate] chunks buffered', { count: audioChunksRef.current.length });
        }
      };
      recorder.onstop = async () => {
        console.log('[translate] onstop fired');
        const speakerFromRef = recordingSpeakerRef.current;
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });
        const blobType = audioBlob.type || recorder.mimeType || 'audio/webm';
        const recordingDurationMs = Date.now() - recordingStartTimeRef.current;
        console.log('[translate] blob size/type', { size: audioBlob.size, type: blobType });
        try {
          if (audioBlob.size === 0) {
            throw new Error('No speech detected. Please try again.');
          }
          const audioFile = new File([audioBlob], 'recording.webm', { type: audioBlob.type || blobType });
          setDebugInfo((prev) => ({
            ...prev,
            blobType,
            blobSize: audioBlob.size,
            fileSize: audioFile.size,
            recordingDurationMs,
          }));
          console.log('[translate] upload beginning');
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          formData.append('sourceLanguage', sourceLanguage);
          formData.append('targetLanguage', targetLanguage);
          formData.append('speaker', speakerFromRef);
          const response = await fetch('/api/translate-turn', { method: 'POST', body: formData });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Translation failed.');
          }
          if (!data?.transcript?.trim()) {
            throw new Error('No speech detected. Please try again.');
          }
          console.log('[translate] upload finished', { transcriptLength: data.transcript.length });
          setDebugInfo((prev) => ({ ...prev, transcript: data.transcript }));
          setStatus('Speaking translation');
          const nextTurn = { id: crypto.randomUUID(), ...data };
          setTurns((prev) => [...prev, nextTurn]);
          if (data.audioBase64) {
            await playTranslationAudio(data.audioBase64, nextTurn.id);
          }
          setStatus('Ready');
          stopResolveRef.current?.();
        } catch (err) {
          console.error('[translate] upload error', err);
          setError(err?.message || 'Something went wrong while translating.');
          setStatus('Ready');
          stopRejectRef.current?.(err);
        } finally {
          audioChunksRef.current = [];
          console.log('[translate] chunks cleared');
          mediaRecorderRef.current = null;
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            console.log('[translate] tracks stopped');
          }
          mediaStreamRef.current = null;
          setActiveSpeaker(null);
          recordingSpeakerRef.current = null;
          setIsProcessing(false);
        }
      };
      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setActiveSpeaker(speaker);
      setStatus('Recording');
    } catch {
      setStatus('Error');
      setError('Microphone permission is needed to translate speech.');
    }
  }, [isProcessing, playTranslationAudio, sourceLanguage, targetLanguage]);

  const stopRecording = useCallback(async () => {
    const recorder = mediaRecorderRef.current;
    console.log('[translate] stop requested');
    console.log('[translate] recorder state on stop request', recorder?.state || 'none');
    if (!recorder || recorder.state !== 'recording') return;

    setIsProcessing(true);
    setStatus('Translating');

    const recordingMs = Date.now() - recordingStartTimeRef.current;
    if (recordingMs < 500) {
      await new Promise((resolve) => setTimeout(resolve, 500 - recordingMs));
    }

    const done = new Promise((resolve, reject) => {
      stopResolveRef.current = resolve;
      stopRejectRef.current = reject;
      recorder.stop();
    });

    await done;
  }, []);

  const handlePressStart = (speaker) => {
    if (!isProcessing) startRecording(speaker);
  };

  const handlePressEnd = () => {
    stopRecording();
  };

  const toggleSpeaker = (speaker) => {
    if (isProcessing) return;
    const isActive = activeSpeaker === speaker && mediaRecorderRef.current?.state === 'recording';
    if (isActive) {
      handlePressEnd();
    } else {
      handlePressStart(speaker);
    }
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turns, learningLanguage: targetLanguage }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not create lesson.');
      }
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
    cleanupRecording('Ready');
    setTurns([]);
    setLesson(null);
    setError('');
    setStatus('Ready');
    setBlockedAudioTurnId(null);
  };

  return (
    <section className={`${styles.wrapper} section`}>
      <div className={`container ${styles.container}`}>
        <h1>Translate</h1>
        <p className={styles.subtitle}>Speak. Translate. Learn.</p>

        <div className={styles.toolbar}>
          <select
            id="translate-language-pair"
            name="translateLanguagePair"
            className={styles.select}
            value={selectedPairId}
            onChange={(event) => onSelectPair(event.target.value)}
          >
            {LANGUAGE_PAIRS.map((pair) => (
              <option key={pair.id} value={pair.id}>
                {pair.label}
              </option>
            ))}
          </select>
          <button type="button" className={`button secondary ${styles.swapButton}`} onClick={swapLanguages}>
            Swap ({sourceLanguage} → {targetLanguage})
          </button>
        </div>

        <div className={`${styles.state} ${styles[statusClass] || ''}`}>
          <span>{status === 'Recording' ? 'Listening…' : status}</span>
          {activeSpeaker && <strong>{activeSpeaker === 'me' ? 'I’m Speaking' : 'They’re Speaking'}</strong>}
          {status === 'Recording' && <span className={styles.pulse} aria-hidden />}
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.feed}>
          {turns.map((turn) => (
            <article className={styles.turnCard} key={turn.id}>
              <h3>{turn.speaker === 'me' ? 'You' : 'Other Person'}</h3>
              <p><strong>{turn.sourceLanguage}:</strong> {turn.transcript}</p>
              <p><strong>{turn.targetLanguage}:</strong> {turn.translation}</p>
              {turn.audioBase64 ? (
                <button
                  type="button"
                  className={`button secondary ${styles.playButton}`}
                  onClick={() => playTranslationAudio(turn.audioBase64, turn.id)}
                >
                  {blockedAudioTurnId === turn.id ? 'Play Translation' : 'Replay Translation'}
                </button>
              ) : null}
            </article>
          ))}
          {!turns.length ? <p className={styles.empty}>Conversation turns will appear here.</p> : null}
        </div>

        <div className={styles.actionsRow}>
          <button type="button" className="button secondary" onClick={clearConversation}>
            Clear Conversation
          </button>
          <button type="button" className="button secondary" onClick={() => cleanupRecording('Ready')}>
            Force Stop Mic
          </button>
          <button type="button" className="button primary" onClick={createLesson} disabled={!turns.length || isProcessing}>
            Create Lesson From This Conversation
          </button>
        </div>

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


        <section className={styles.debugPanel}>
          <h3>Recorder Debug (temporary)</h3>
          <ul>
            <li><strong>MIME type:</strong> {debugInfo.recorderMimeType || 'n/a'}</li>
            <li><strong>Blob type:</strong> {debugInfo.blobType || 'n/a'}</li>
            <li><strong>Blob size:</strong> {debugInfo.blobSize} bytes</li>
            <li><strong>File size:</strong> {debugInfo.fileSize} bytes</li>
            <li><strong>Duration:</strong> {debugInfo.recordingDurationMs} ms</li>
            <li><strong>Transcript:</strong> {debugInfo.transcript || 'n/a'}</li>
          </ul>
        </section>

        <div className={styles.speakerDock}>
          <div className={styles.speakerRow}>
            {[
              { key: 'me', label: 'I’m Speaking' },
              { key: 'them', label: 'They’re Speaking' },
            ].map((speaker) => (
              <button
                key={speaker.key}
                type="button"
                className={`${styles.speakButton} ${activeSpeaker === speaker.key ? styles.active : ''}`}
                onMouseDown={() => handlePressStart(speaker.key)}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                onTouchStart={() => handlePressStart(speaker.key)}
                onTouchEnd={handlePressEnd}
                onClick={() => toggleSpeaker(speaker.key)}
                disabled={isProcessing}
              >
                <span>{speaker.label}</span>
                {activeSpeaker === speaker.key ? <small>Listening… Tap to stop</small> : <small>Tap to start or hold to talk</small>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
