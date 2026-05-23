'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './translate.module.css';

const LANGUAGE_PAIRS = [
  { id: 'en-es', source: 'English', target: 'Spanish', label: 'English ↔ Spanish' },
  { id: 'en-pt', source: 'English', target: 'Portuguese', label: 'English ↔ Portuguese' },
  { id: 'en-ht', source: 'English', target: 'Haitian Creole', label: 'English ↔ Haitian Creole' },
];

const STORAGE_KEY = 'translate-page-state-v1';

const STATUS_COPY = {
  Recording: 'Listening…',
  Translating: 'Translating…',
  'Speaking translation': 'Preparing voice…',
  Ready: 'Ready',
};

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
  const [playedTurnIds, setPlayedTurnIds] = useState({});
  const [audioLoadingTurnIds, setAudioLoadingTurnIds] = useState({});
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState({ recorderMimeType: '', blobType: '', blobSize: 0, fileSize: 0, recordingDurationMs: 0, transcript: '', chunkCount: 0, lastApiErrorStep: '', lastApiErrorDetail: '', lastApiErrorTranscript: '', audioSizeWarning: '', micInputLevel: 0, micLevelWarning: '' });

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
  const feedRef = useRef(null);

  const statusClass = status.toLowerCase().replace(/\s+/g, '-');
  const statusLabel = STATUS_COPY[status] || status;

  const clearRequestTimer = useCallback(() => {
    if (requestDataIntervalRef.current) {
      clearInterval(requestDataIntervalRef.current);
      requestDataIntervalRef.current = null;
    }
  }, []);

  const stopMicMeter = useCallback(() => { if (micMeterAnimationRef.current) cancelAnimationFrame(micMeterAnimationRef.current); if (micStreamSourceRef.current) micStreamSourceRef.current.disconnect(); if (analyserRef.current) analyserRef.current.disconnect(); if (audioContextRef.current) audioContextRef.current.close().catch(() => {}); micMeterAnimationRef.current = null; micStreamSourceRef.current = null; analyserRef.current = null; audioContextRef.current = null; setDebugInfo((prev) => ({ ...prev, micInputLevel: 0, micLevelWarning: '' })); }, []);

  const startMicMeter = useCallback(async (stream) => {
    stopMicMeter(); const AudioContextClass = window.AudioContext || window.webkitAudioContext; if (!AudioContextClass) return;
    const audioContext = new AudioContextClass(); const source = audioContext.createMediaStreamSource(stream); const analyser = audioContext.createAnalyser(); analyser.fftSize = 1024; source.connect(analyser);
    audioContextRef.current = audioContext; micStreamSourceRef.current = source; analyserRef.current = analyser;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => { analyser.getByteTimeDomainData(dataArray); let sumSquares = 0; for (let i = 0; i < dataArray.length; i += 1) { const normalized = (dataArray[i] - 128) / 128; sumSquares += normalized * normalized; } const rms = Math.sqrt(sumSquares / dataArray.length); const level = Math.min(100, Math.round(rms * 280)); setDebugInfo((prev) => ({ ...prev, micInputLevel: level, micLevelWarning: status === 'Recording' && level < 8 ? 'Microphone input appears very low.' : '' })); micMeterAnimationRef.current = requestAnimationFrame(tick); };
    tick();
  }, [status, stopMicMeter]);

  const fullCleanup = useCallback((nextStatus = 'Ready', options = { forceStop: false }) => {
    if (options.forceStop) isForceStoppingRef.current = true; isCleaningUpRef.current = true; clearRequestTimer(); const recorder = recorderRef.current; if (recorder && recorder.state === 'recording') recorder.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop()); stopMicMeter(); chunksRef.current = []; recorderRef.current = null; streamRef.current = null; activeSpeakerRef.current = null; setActiveSpeaker(null); setIsProcessing(false); setStatus(nextStatus); setDebugInfo((prev) => ({ ...prev, chunkCount: 0 }));
    setTimeout(() => { isForceStoppingRef.current = false; isCleaningUpRef.current = false; }, 150);
  }, [clearRequestTimer, stopMicMeter]);

  useEffect(() => { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return; try { const parsed = JSON.parse(raw); setTurns(parsed.turns || []); setLesson(parsed.lesson || null); setSourceLanguage(parsed.sourceLanguage || 'English'); setTargetLanguage(parsed.targetLanguage || 'Spanish'); } catch {} }, []);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ turns, lesson, sourceLanguage, targetLanguage })); }, [turns, lesson, sourceLanguage, targetLanguage]);
  useEffect(() => () => { isForceStoppingRef.current = true; isCleaningUpRef.current = true; clearRequestTimer(); if (recorderRef.current?.state === 'recording') recorderRef.current.stop(); streamRef.current?.getTracks().forEach((track) => track.stop()); stopMicMeter(); chunksRef.current = []; recorderRef.current = null; streamRef.current = null; activeAudioRef.current?.pause(); }, [clearRequestTimer, stopMicMeter]);

  const selectedPairId = useMemo(() => (LANGUAGE_PAIRS.find((pair) => (pair.source === sourceLanguage && pair.target === targetLanguage) || (pair.target === sourceLanguage && pair.source === targetLanguage))?.id || 'custom'), [sourceLanguage, targetLanguage]);
  const playTranslationAudio = useCallback(async (audioBase64, turnId = null) => { const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`); activeAudioRef.current?.pause(); activeAudioRef.current = audio; if (turnId) setAudioLoadingTurnIds((prev) => ({ ...prev, [turnId]: true })); try { await new Promise((resolve) => { if (audio.readyState >= 2) resolve(); audio.addEventListener('canplaythrough', resolve, { once: true }); }); if (turnId) setAudioLoadingTurnIds((prev) => ({ ...prev, [turnId]: false })); await audio.play(); setBlockedAudioTurnId(null); if (turnId) setPlayedTurnIds((prev) => ({ ...prev, [turnId]: true })); } catch { if (turnId) setAudioLoadingTurnIds((prev) => ({ ...prev, [turnId]: false })); if (turnId) setBlockedAudioTurnId(turnId); } }, []);

  const startRecording = useCallback(async (speaker) => {
    if (isForceStoppingRef.current || isCleaningUpRef.current || isUploadingRef.current || recorderRef.current || streamRef.current || ['Recording', 'Processing', 'Translating', 'Speaking translation'].includes(status)) return;
    setError('');
    try {
      chunksRef.current = []; setDebugInfo((prev) => ({ ...prev, chunkCount: 0, transcript: '', lastApiErrorStep: '', lastApiErrorDetail: '', lastApiErrorTranscript: '', audioSizeWarning: '', micInputLevel: 0, micLevelWarning: '' }));
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); streamRef.current = stream; await startMicMeter(stream);
      const mimeCandidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']; const mimeType = mimeCandidates.find((type) => MediaRecorder.isTypeSupported(type)) || ''; const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recorderRef.current = recorder; activeSpeakerRef.current = speaker; recordingStartTimeRef.current = Date.now(); setDebugInfo((prev) => ({ ...prev, recorderMimeType: recorder.mimeType || mimeType || 'default' }));
      recorder.ondataavailable = (event) => { if (!isForceStoppingRef.current && !isCleaningUpRef.current && event.data && event.data.size > 0) { chunksRef.current.push(event.data); setDebugInfo((prev) => ({ ...prev, chunkCount: chunksRef.current.length })); } };
      recorder.onstop = async () => {
        clearRequestTimer();
        if (isForceStoppingRef.current || isCleaningUpRef.current) { chunksRef.current = []; streamRef.current?.getTracks().forEach((track) => track.stop()); recorderRef.current = null; streamRef.current = null; activeSpeakerRef.current = null; setActiveSpeaker(null); setIsProcessing(false); setStatus('Ready'); return; }
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' }); const blobType = blob.type || recorder.mimeType || 'audio/webm'; const recordingDurationMs = Date.now() - recordingStartTimeRef.current;
        if (blob.size <= 0) { setError('No speech detected. Please try again.'); fullCleanup('Ready'); return; }
        try {
          isUploadingRef.current = true; setIsProcessing(true); setStatus('Translating');
          const audioFile = new File([blob], 'recording.webm', { type: blobType });
          setDebugInfo((prev) => ({ ...prev, blobType, blobSize: blob.size, fileSize: audioFile.size, recordingDurationMs, audioSizeWarning: recordingDurationMs > 2000 && blob.size < 10000 ? 'Audio file is unusually small. Microphone may not be capturing clearly.' : '' }));
          const formData = new FormData(); formData.append('audio', blob, 'recording.webm'); formData.append('sourceLanguage', sourceLanguage); formData.append('targetLanguage', targetLanguage); formData.append('speaker', activeSpeakerRef.current);
          const response = await fetch('/api/translate-turn', { method: 'POST', body: formData }); const data = await response.json();
          if (!response.ok) { setDebugInfo((prev) => ({ ...prev, lastApiErrorStep: data?.step || 'unknown', lastApiErrorDetail: data?.detail || data?.error || 'Unknown error', lastApiErrorTranscript: data?.transcript || '', transcript: data?.transcript || prev.transcript })); throw new Error(data?.detail || data?.error || 'Translation failed.'); }
          if (!data?.transcript?.trim()) throw new Error('No speech detected. Please try again.');
          setDebugInfo((prev) => ({ ...prev, transcript: data.transcript })); const nextTurn = { id: crypto.randomUUID(), ...data }; setTurns((prev) => [...prev, nextTurn]);
          requestAnimationFrame(() => feedRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
          setStatus('Speaking translation'); if (data.audioBase64) await playTranslationAudio(data.audioBase64, nextTurn.id); setStatus('Ready');
        } catch (err) { setError(err?.message || 'Something went wrong while translating.'); setStatus('Ready'); } finally { isUploadingRef.current = false; fullCleanup('Ready'); }
      };
      recorder.start(); setActiveSpeaker(speaker); setStatus('Recording');
    } catch { fullCleanup('Ready'); setError('Microphone permission is needed to translate speech.'); }
  }, [clearRequestTimer, fullCleanup, playTranslationAudio, sourceLanguage, startMicMeter, status, targetLanguage]);

  const stopRecording = useCallback(() => { if (recorderRef.current?.state === 'recording') recorderRef.current.stop(); }, []);
  const toggleSpeaker = (speaker) => { if (!isProcessing && !isUploadingRef.current) { const isActive = activeSpeaker === speaker && recorderRef.current?.state === 'recording'; if (isActive) stopRecording(); else startRecording(speaker); } };
  const onSelectPair = (id) => { const pair = LANGUAGE_PAIRS.find((entry) => entry.id === id); if (pair) { setSourceLanguage(pair.source); setTargetLanguage(pair.target); } };
  const swapLanguages = () => { setSourceLanguage(targetLanguage); setTargetLanguage(sourceLanguage); };

  const createLesson = async () => { if (!turns.length || isProcessing) return; setIsProcessing(true); setIsCreatingLesson(true); setError(''); setStatus('Translating…'); try { const response = await fetch('/api/translate-lesson', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ turns, learningLanguage: targetLanguage }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Could not create lesson.'); setLesson(data); setStatus('Ready'); } catch (err) { setStatus('Ready'); setError(`Lesson creation failed: ${err.message || 'Could not create lesson.'}`); } finally { setIsCreatingLesson(false); setIsProcessing(false); } };

  const clearConversation = () => { fullCleanup('Ready', { forceStop: true }); setTurns([]); setLesson(null); setError(''); setBlockedAudioTurnId(null); setPlayedTurnIds({}); setAudioLoadingTurnIds({}); localStorage.removeItem(STORAGE_KEY); };

  return <section className={`${styles.wrapper} section`}><div className={`${styles.container} container`}><div className={styles.hero}><h1>Translate</h1><p className={styles.subtitle}>Speak naturally. Get an instant bridge. Build confidence turn by turn.</p></div>
    <div className={styles.toolbar}><select id="translate-language-pair" className={styles.select} value={selectedPairId} onChange={(event) => onSelectPair(event.target.value)}>{LANGUAGE_PAIRS.map((pair) => <option key={pair.id} value={pair.id}>{pair.label}</option>)}</select><button type="button" className={`button secondary ${styles.swapButton}`} onClick={swapLanguages}>Swap · {sourceLanguage} → {targetLanguage}</button></div>
    <div className={`${styles.state} ${styles[statusClass] || ''}`}><span>{statusLabel}</span>{activeSpeaker && <strong>{activeSpeaker === 'me' ? 'You are speaking' : 'Partner is speaking'}</strong>}{(status === 'Recording' || status === 'Translating') && <span className={styles.pulse} aria-hidden />}</div>
    {error ? <p className={styles.error}>{error}</p> : null}
    <div className={styles.feed} ref={feedRef}>{turns.map((turn) => <article className={styles.turnCard} key={turn.id}><header><h3>{turn.speaker === 'me' ? 'You' : 'Partner'}</h3><span>{turn.sourceLanguage} → {turn.targetLanguage}</span></header><div className={styles.turnBody}><div><label>Original</label><p>{turn.transcript}</p></div><div><label>Translation</label><p>{turn.translation}</p></div></div>{turn.audioBase64 ? <div className={styles.playButtonWrap}>{audioLoadingTurnIds[turn.id] ? <p className={styles.audioPrep}>Preparing voice…</p> : null}<button type="button" className={`button secondary ${styles.playButton} ${!playedTurnIds[turn.id] ? styles.playPulse : ''}`} onClick={() => playTranslationAudio(turn.audioBase64, turn.id)} disabled={Boolean(audioLoadingTurnIds[turn.id])}><span aria-hidden>🔊</span><span>{playedTurnIds[turn.id] ? 'Replay Translation' : 'Play Translation'}</span></button>{blockedAudioTurnId === turn.id ? <p className={styles.audioPrep}>Tap play again if audio was blocked by the browser.</p> : null}</div> : null}</article>)}{!turns.length ? <p className={styles.empty}>Conversation turns will appear here.</p> : null}</div>
    <div className={styles.actionsRow}><button type="button" className={`button secondary ${styles.clearButton}`} onClick={clearConversation}>Clear Conversation</button><button type="button" className="button primary" onClick={createLesson} disabled={!turns.length || isProcessing}>{isCreatingLesson ? 'Building lesson…' : 'Create Lesson'}</button></div>
    {lesson ? <section className={styles.lessonPanel}><h2>Conversation Companion</h2><div className={styles.lessonGrid}>
      <article><h3>Useful Phrases From This Conversation</h3><ul>{lesson.usefulPhrases?.map((item, i) => <li key={`up-${i}`}><strong>{item.phrase}</strong>{item.pronunciation ? <span> · {item.pronunciation}</span> : null}<p>{item.meaning}</p></li>)}</ul></article>
      <article><h3>Quick Replies You Could Use</h3><ul>{lesson.quickReplies?.map((item, i) => <li key={`qr-${i}`}>{item}</li>)}</ul></article>
      <article><h3>Mini Practice</h3><ul>{lesson.miniPractice?.map((item, i) => <li key={`mp-${i}`}>{item}</li>)}</ul></article>
      <article><h3>Quick Quiz</h3><ul>{lesson.quickQuiz?.map((item, i) => <li key={`qq-${i}`}><p>{item.prompt}</p><small>{item.answer}</small></li>)}</ul></article>
      <article><h3>Review Later</h3><ul>{lesson.reviewLater?.map((item, i) => <li key={`rl-${i}`}>{item}</li>)}</ul></article>
      {lesson.sayThisNext?.length ? <article><h3>Say This Next</h3><ul>{lesson.sayThisNext.map((item, i) => <li key={`stn-${i}`}>{item}</li>)}</ul></article> : null}
    </div></section> : null}
    <section className={styles.debugToggleRow}><button type="button" className="button tertiary" onClick={() => setShowDebug((prev) => !prev)}>{showDebug ? 'Hide Debug' : 'Show Debug'}</button></section>
    {showDebug ? <section className={styles.debugPanel}><h3>Recorder Debug</h3><ul><li><strong>Status:</strong> {status}</li><li><strong>Recorder state:</strong> {recorderRef.current?.state || 'none'}</li><li><strong>Stream active:</strong> {streamRef.current ? 'true' : 'false'}</li><li><strong>Blob size:</strong> {debugInfo.blobSize} bytes</li><li><strong>Duration:</strong> {debugInfo.recordingDurationMs} ms</li><li><strong>Transcript:</strong> {debugInfo.transcript || debugInfo.lastApiErrorTranscript || 'n/a'}</li><li><strong>Mic input level:</strong> {debugInfo.micInputLevel || 0}/100<div className={styles.micMeter}><div className={styles.micMeterFill} style={{ width: `${debugInfo.micInputLevel || 0}%` }} /></div></li></ul><button type="button" className="button secondary" onClick={() => fullCleanup('Ready', { forceStop: true })}>Force Stop Mic</button></section> : null}
    <div className={styles.speakerDock}><div className={styles.speakerRow}>{[{ key: 'me', label: 'I’m Speaking' }, { key: 'them', label: 'They’re Speaking' }].map((speaker) => <button key={speaker.key} type="button" className={`${styles.speakButton} ${activeSpeaker === speaker.key ? styles.active : ''}`} onClick={() => toggleSpeaker(speaker.key)} disabled={isProcessing}><span>{speaker.label}</span>{activeSpeaker === speaker.key ? <small>Tap again to stop</small> : <small>Tap to start</small>}</button>)}</div></div>
  </div></section>;
}
