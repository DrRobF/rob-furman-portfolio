'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './translate.module.css';

const LANGUAGE_PAIRS = [
  { id: 'en-es', source: 'English', target: 'Spanish', label: 'English ↔ Spanish' },
  { id: 'en-pt', source: 'English', target: 'Portuguese', label: 'English ↔ Portuguese' },
  { id: 'en-ht', source: 'English', target: 'Haitian Creole', label: 'English ↔ Haitian Creole' },
];

const STORAGE_KEY = 'translate-page-state-v1';
const LEARNING_BANK_KEY = 'translate-learning-bank-v1';

const STATUS_COPY = { Recording: 'Listening…', Translating: 'Translating…', 'Speaking translation': 'Preparing voice…', Ready: 'Ready' };

const emptyLesson = { phrases: [], quickReplies: [], practice: [], quiz: [], reviewLater: [], sayThisNext: [] };

export default function TranslatePage() {
  const [sourceLanguage, setSourceLanguage] = useState('English');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [turns, setTurns] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [phraseBank, setPhraseBank] = useState([]);
  const [reviewFeedback, setReviewFeedback] = useState({});
  const [showLearningLibrary, setShowLearningLibrary] = useState(false);
  const [status, setStatus] = useState('Ready');
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [blockedAudioTurnId, setBlockedAudioTurnId] = useState(null);
  const [playedTurnIds, setPlayedTurnIds] = useState({});
  const [audioLoadingTurnIds, setAudioLoadingTurnIds] = useState({});
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [revealedPractice, setRevealedPractice] = useState({});
  const [revealedQuiz, setRevealedQuiz] = useState({});
  const [revealedReview, setRevealedReview] = useState({});
  const [debugInfo, setDebugInfo] = useState({ micInputLevel: 0 });
  const recorderRef = useRef(null); const streamRef = useRef(null); const chunksRef = useRef([]); const activeSpeakerRef = useRef(null); const activeAudioRef = useRef(null); const recordingStartTimeRef = useRef(0); const isForceStoppingRef = useRef(false); const isCleaningUpRef = useRef(false); const isUploadingRef = useRef(false); const requestDataIntervalRef = useRef(null); const audioContextRef = useRef(null); const analyserRef = useRef(null); const micMeterAnimationRef = useRef(null); const micStreamSourceRef = useRef(null); const feedRef = useRef(null);
  const statusClass = status.toLowerCase().replace(/\s+/g, '-'); const statusLabel = STATUS_COPY[status] || status;
  const clearRequestTimer = useCallback(() => { if (requestDataIntervalRef.current) { clearInterval(requestDataIntervalRef.current); requestDataIntervalRef.current = null; } }, []);
  const stopMicMeter = useCallback(() => { if (micMeterAnimationRef.current) cancelAnimationFrame(micMeterAnimationRef.current); if (micStreamSourceRef.current) micStreamSourceRef.current.disconnect(); if (analyserRef.current) analyserRef.current.disconnect(); if (audioContextRef.current) audioContextRef.current.close().catch(() => {}); setDebugInfo((prev) => ({ ...prev, micInputLevel: 0 })); }, []);
  const startMicMeter = useCallback(async (stream) => { stopMicMeter(); const AudioContextClass = window.AudioContext || window.webkitAudioContext; if (!AudioContextClass) return; const audioContext = new AudioContextClass(); const source = audioContext.createMediaStreamSource(stream); const analyser = audioContext.createAnalyser(); analyser.fftSize = 1024; source.connect(analyser); audioContextRef.current = audioContext; micStreamSourceRef.current = source; analyserRef.current = analyser; const dataArray = new Uint8Array(analyser.frequencyBinCount); const tick = () => { analyser.getByteTimeDomainData(dataArray); let sumSquares = 0; for (let i = 0; i < dataArray.length; i += 1) { const normalized = (dataArray[i] - 128) / 128; sumSquares += normalized * normalized; } const rms = Math.sqrt(sumSquares / dataArray.length); setDebugInfo((prev) => ({ ...prev, micInputLevel: Math.min(100, Math.round(rms * 280)) })); micMeterAnimationRef.current = requestAnimationFrame(tick); }; tick(); }, [stopMicMeter]);
  const fullCleanup = useCallback((nextStatus = 'Ready', options = { forceStop: false }) => { if (options.forceStop) isForceStoppingRef.current = true; isCleaningUpRef.current = true; clearRequestTimer(); const recorder = recorderRef.current; if (recorder && recorder.state === 'recording') recorder.stop(); streamRef.current?.getTracks().forEach((track) => track.stop()); stopMicMeter(); chunksRef.current = []; recorderRef.current = null; streamRef.current = null; activeSpeakerRef.current = null; setActiveSpeaker(null); setIsProcessing(false); setStatus(nextStatus); setTimeout(() => { isForceStoppingRef.current = false; isCleaningUpRef.current = false; }, 150); }, [clearRequestTimer, stopMicMeter]);

  useEffect(() => { const raw = localStorage.getItem(STORAGE_KEY); if (raw) { try { const parsed = JSON.parse(raw); setTurns(parsed.turns || []); setLesson(parsed.lesson || null); setSourceLanguage(parsed.sourceLanguage || 'English'); setTargetLanguage(parsed.targetLanguage || 'Spanish'); } catch {} } const savedBank = localStorage.getItem(LEARNING_BANK_KEY); if (savedBank) { try { setPhraseBank(JSON.parse(savedBank)); } catch {} } }, []);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ turns, lesson, sourceLanguage, targetLanguage })); }, [turns, lesson, sourceLanguage, targetLanguage]);
  useEffect(() => { localStorage.setItem(LEARNING_BANK_KEY, JSON.stringify(phraseBank)); }, [phraseBank]);

  const selectedPairId = useMemo(() => (LANGUAGE_PAIRS.find((pair) => (pair.source === sourceLanguage && pair.target === targetLanguage) || (pair.target === sourceLanguage && pair.source === targetLanguage))?.id || 'custom'), [sourceLanguage, targetLanguage]);
  const playTranslationAudio = useCallback(async (audioBase64, turnId = null) => { const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`); activeAudioRef.current?.pause(); activeAudioRef.current = audio; if (turnId) setAudioLoadingTurnIds((prev) => ({ ...prev, [turnId]: true })); try { await new Promise((resolve) => { if (audio.readyState >= 2) resolve(); audio.addEventListener('canplaythrough', resolve, { once: true }); }); if (turnId) setAudioLoadingTurnIds((prev) => ({ ...prev, [turnId]: false })); await audio.play(); setBlockedAudioTurnId(null); if (turnId) setPlayedTurnIds((prev) => ({ ...prev, [turnId]: true })); } catch { if (turnId) setAudioLoadingTurnIds((prev) => ({ ...prev, [turnId]: false })); if (turnId) setBlockedAudioTurnId(turnId); } }, []);
  const mergeIntoPhraseBank = useCallback((lessonData, language) => {
    const entries = [];
    const add = (learningText, englishMeaning) => { if (learningText?.trim() && englishMeaning?.trim()) entries.push({ learningText: learningText.trim(), englishMeaning: englishMeaning.trim(), language }); };
    (lessonData.phrases || []).forEach((p) => add(p.learningText, p.englishMeaning));
    (lessonData.quickReplies || []).forEach((p) => add(p.learningText, p.englishMeaning));
    (lessonData.reviewLater || []).forEach((p) => add(p.learningText, p.englishMeaning));
    (lessonData.sayThisNext || []).forEach((p) => add(p.learningText, p.englishMeaning));
    setPhraseBank((prev) => { const now = new Date().toISOString(); const map = new Map(prev.map((item) => [`${item.language}|${item.learningText.toLowerCase()}`, item])); entries.forEach((entry) => { const k = `${entry.language}|${entry.learningText.toLowerCase()}`; const existing = map.get(k); if (existing) map.set(k, { ...existing, englishMeaning: entry.englishMeaning || existing.englishMeaning, timesSeen: (existing.timesSeen || 0) + 1, lastSeenAt: now, source: 'lesson' }); else map.set(k, { ...entry, timesSeen: 1, lastSeenAt: now, source: 'lesson' }); }); return Array.from(map.values()); });
  }, []);

  const startRecording = useCallback(async (speaker) => { if (isForceStoppingRef.current || isCleaningUpRef.current || isUploadingRef.current || recorderRef.current || streamRef.current || ['Recording', 'Processing', 'Translating', 'Speaking translation'].includes(status)) return; setError(''); try { chunksRef.current = []; const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); streamRef.current = stream; await startMicMeter(stream); const mimeCandidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']; const mimeType = mimeCandidates.find((type) => MediaRecorder.isTypeSupported(type)) || ''; const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream); recorderRef.current = recorder; activeSpeakerRef.current = speaker; recordingStartTimeRef.current = Date.now(); recorder.ondataavailable = (event) => { if (!isForceStoppingRef.current && !isCleaningUpRef.current && event.data && event.data.size > 0) chunksRef.current.push(event.data); };
      recorder.onstop = async () => { clearRequestTimer(); if (isForceStoppingRef.current || isCleaningUpRef.current) { fullCleanup('Ready'); return; } const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' }); if (blob.size <= 0) { setError('No speech detected. Please try again.'); fullCleanup('Ready'); return; } try { isUploadingRef.current = true; setIsProcessing(true); setStatus('Translating'); const formData = new FormData(); formData.append('audio', blob, 'recording.webm'); formData.append('sourceLanguage', sourceLanguage); formData.append('targetLanguage', targetLanguage); formData.append('speaker', activeSpeakerRef.current); const response = await fetch('/api/translate-turn', { method: 'POST', body: formData }); const data = await response.json(); if (!response.ok) throw new Error(data?.detail || data?.error || 'Translation failed.'); if (!data?.transcript?.trim()) throw new Error('No speech detected. Please try again.'); const nextTurn = { id: crypto.randomUUID(), ...data }; setTurns((prev) => [...prev, nextTurn]); requestAnimationFrame(() => feedRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })); setStatus('Speaking translation'); if (data.audioBase64) await playTranslationAudio(data.audioBase64, nextTurn.id); setStatus('Ready'); } catch (err) { setError(err?.message || 'Something went wrong while translating.'); setStatus('Ready'); } finally { isUploadingRef.current = false; fullCleanup('Ready'); } };
      recorder.start(250); clearRequestTimer(); requestDataIntervalRef.current = setInterval(() => { if (recorder.state === 'recording') recorder.requestData(); }, 250); setActiveSpeaker(speaker); setStatus('Recording'); } catch { fullCleanup('Ready'); setError('Microphone permission is needed to translate speech.'); } }, [clearRequestTimer, fullCleanup, playTranslationAudio, sourceLanguage, startMicMeter, status, targetLanguage]);

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state !== 'recording') return;
    const recordingDuration = Date.now() - recordingStartTimeRef.current;
    const stopNow = () => {
      try { recorder.requestData(); } catch {}
      recorder.stop();
    };
    if (recordingDuration < 300) {
      setTimeout(stopNow, 300 - recordingDuration);
      return;
    }
    stopNow();
  }, []);
  const toggleSpeaker = (speaker) => { if (!isProcessing && !isUploadingRef.current) { const isActive = activeSpeaker === speaker && recorderRef.current?.state === 'recording'; if (isActive) stopRecording(); else startRecording(speaker); } };
  const onSelectPair = (id) => { const pair = LANGUAGE_PAIRS.find((entry) => entry.id === id); if (pair) { setSourceLanguage(pair.source); setTargetLanguage(pair.target); } };
  const swapLanguages = () => { setSourceLanguage(targetLanguage); setTargetLanguage(sourceLanguage); };

  const createLesson = async () => { if (!turns.length || isProcessing) return; setIsProcessing(true); setIsCreatingLesson(true); setError(''); setStatus('Translating'); try { const response = await fetch('/api/translate-lesson', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ turns, learningLanguage: targetLanguage }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Could not create lesson.'); const normalized = { ...emptyLesson, ...data }; setLesson(normalized); mergeIntoPhraseBank(normalized, targetLanguage); setStatus('Ready'); } catch (err) { setStatus('Ready'); setError(`Lesson creation failed: ${err.message || 'Could not create lesson.'}`); } finally { setIsCreatingLesson(false); setIsProcessing(false); } };

  const clearConversation = () => { fullCleanup('Ready', { forceStop: true }); setTurns([]); setLesson(null); setError(''); setBlockedAudioTurnId(null); setPlayedTurnIds({}); setAudioLoadingTurnIds({}); localStorage.setItem(STORAGE_KEY, JSON.stringify({ turns: [], lesson: null, sourceLanguage, targetLanguage })); };
  const clearLearningLibrary = () => { if (window.confirm('Clear saved learning phrases and review progress?')) { setPhraseBank([]); setLesson(null); setRevealedPractice({}); setRevealedQuiz({}); setRevealedReview({}); setReviewFeedback({}); localStorage.removeItem(LEARNING_BANK_KEY); } };

  const reviewItems = useMemo(() => {
    const sorted = [...phraseBank].sort((a, b) => (a.timesSeen || 0) - (b.timesSeen || 0));
    const newer = [...phraseBank].sort((a, b) => new Date(b.lastSeenAt) - new Date(a.lastSeenAt));
    const mixed = [...sorted.slice(0, 3), ...newer.slice(0, 3)].filter((item, index, arr) => index === arr.findIndex((x) => x.learningText === item.learningText && x.language === item.language));
    return mixed.slice(0, 6);
  }, [phraseBank]);

  return <section className={`${styles.wrapper} section`}><div className={`${styles.container} container`}><div className={styles.hero}><h1>Translate</h1><p className={styles.subtitle}>Private voice translation, tuned for real conversations.</p></div>
    <div className={styles.toolbar}><div className={styles.selectWrap}><label htmlFor="languagePair">Language pair</label><select id="languagePair" className={styles.select} value={selectedPairId} onChange={(event) => onSelectPair(event.target.value)}>{LANGUAGE_PAIRS.map((pair) => <option key={pair.id} value={pair.id}>{pair.label}</option>)}</select></div><button type="button" className={`button secondary ${styles.swapButton}`} onClick={swapLanguages}>Swap · {sourceLanguage} → {targetLanguage}</button></div>
    <div className={`${styles.state} ${styles[statusClass] || ''}`}><span>{statusLabel}</span>{activeSpeaker && <strong>{activeSpeaker === 'me' ? 'Listening to you…' : 'Listening to partner…'}</strong>}</div>
    {error ? <p className={styles.error}>{error}</p> : null}
    <div className={styles.feed} ref={feedRef}>{turns.map((turn) => <article className={styles.turnCard} key={turn.id}><header><h3>{turn.speaker === 'me' ? 'You' : 'Partner'}</h3><span>{turn.sourceLanguage} → {turn.targetLanguage}</span></header><div className={styles.turnBody}><div><label>Original</label><p>{turn.transcript}</p></div><div><label>Translation</label><p>{turn.translation}</p></div></div>{turn.audioBase64 ? <div className={styles.playButtonWrap}><button type="button" className={`button secondary ${styles.playButton} ${!playedTurnIds[turn.id] ? styles.playPulse : ''}`} onClick={() => playTranslationAudio(turn.audioBase64, turn.id)} disabled={Boolean(audioLoadingTurnIds[turn.id])}>{playedTurnIds[turn.id] ? 'Replay Translation' : 'Play Translation'}</button>{blockedAudioTurnId === turn.id ? <p className={styles.audioPrep}>Tap play again if audio was blocked by the browser.</p> : null}</div> : null}</article>)}{!turns.length ? <p className={styles.empty}>Your translated conversation will appear here.</p> : null}</div>
    <div className={styles.actionsRow}><button type="button" className={styles.clearButton} onClick={clearConversation}>Clear Conversation</button><button type="button" className={`button secondary ${styles.utilityButton}`} onClick={createLesson} disabled={!turns.length || isProcessing}>{isCreatingLesson ? 'Building lesson…' : 'Create Lesson'}</button><button type="button" className={`button tertiary ${styles.utilityButton}`} onClick={() => setShowLearningLibrary((prev) => !prev)}>{showLearningLibrary ? 'Hide Learning Library' : 'Learning Library'}</button></div>
    <section className={styles.debugToggleRow}><button type="button" className={styles.debugToggle} onClick={() => setShowDebug((prev) => !prev)}>{showDebug ? 'Hide Debug' : 'Show Debug'}</button></section>
    {showDebug ? <section className={styles.debugPanel}><h3>Recorder Debug</h3><p>Mic level: {debugInfo.micInputLevel}/100</p><button type="button" className="button secondary" onClick={() => fullCleanup('Ready', { forceStop: true })}>Force Stop Mic</button></section> : null}
    <div className={styles.speakerDock}><div className={styles.speakerRow}>{[{ key: 'me', label: 'I’m Speaking' }, { key: 'them', label: 'They’re Speaking' }].map((speaker) => { const isActive = activeSpeaker === speaker.key; const isBusy = isProcessing && !isActive; const subtext = isActive ? 'Listening… tap to stop' : isBusy ? 'Translating…' : 'Tap to start'; return <button key={speaker.key} type="button" className={`${styles.speakButton} ${speaker.key === 'me' ? styles.speakMe : styles.speakThem} ${isActive ? styles.active : ''}`} onClick={() => toggleSpeaker(speaker.key)} disabled={isProcessing && !isActive}><span>{speaker.label}</span><small>{subtext}</small></button>; })}</div></div>
    {showLearningLibrary ? <section className={styles.lessonPanel}><h2>Learning Library</h2>
      {lesson ? <div className={styles.lessonGrid}>
        {lesson.phrases?.length ? <article><h3>Practical Phrases</h3><ul>{lesson.phrases.map((item, i) => <li key={`ph-${i}`}><strong>{item.learningText}</strong><p>{item.englishMeaning}</p>{item.pronunciationHint ? <small>{item.pronunciationHint}</small> : null}</li>)}</ul></article> : null}
        {lesson.quickReplies?.length ? <article><h3>Quick Replies</h3><ul>{lesson.quickReplies.map((item, i) => <li key={`qr-${i}`}><strong>{item.learningText}</strong><p>{item.englishMeaning}</p><small>{item.whenToUse}</small></li>)}</ul></article> : null}
        {lesson.practice?.length ? <article><h3>Practice</h3><ul>{lesson.practice.map((item, i) => <li key={`pr-${i}`}><p>{item.promptEnglish}</p><button type="button" className="button tertiary" onClick={() => setRevealedPractice((prev) => ({ ...prev, [i]: !prev[i] }))}>{revealedPractice[i] ? 'Hide answer' : 'Show answer'}</button>{revealedPractice[i] ? <small>{item.answerLearningLanguage}</small> : null}</li>)}</ul></article> : null}
        {lesson.quiz?.length ? <article><h3>Quiz</h3><ul>{lesson.quiz.map((item, i) => <li key={`qz-${i}`}><p>{item.questionEnglish}</p>{item.hint ? <small>Hint: {item.hint}</small> : null}<button type="button" className="button tertiary" onClick={() => setRevealedQuiz((prev) => ({ ...prev, [i]: !prev[i] }))}>{revealedQuiz[i] ? 'Hide answer' : 'Show answer'}</button>{revealedQuiz[i] ? <small>{item.answerLearningLanguage}</small> : null}</li>)}</ul></article> : null}
      </div> : <p className={styles.empty}>Generate a lesson to populate your learning library.</p>}
      <article className={styles.reviewBlock}><h3>Review Practice</h3>{reviewItems.length ? <ul>{reviewItems.map((item, i) => <li key={`${item.language}-${item.learningText}`}><p>{item.englishMeaning}</p><button type="button" className="button tertiary" onClick={() => setRevealedReview((prev) => ({ ...prev, [i]: !prev[i] }))}>{revealedReview[i] ? 'Hide answer' : 'Show answer'}</button>{revealedReview[i] ? <small>{item.learningText}</small> : null}<div className={styles.reviewActions}><button type="button" className="button secondary" onClick={() => setReviewFeedback((prev) => ({ ...prev, [i]: 'knew' }))}>I knew it</button><button type="button" className="button secondary" onClick={() => setReviewFeedback((prev) => ({ ...prev, [i]: 'again' }))}>Review again</button></div>{reviewFeedback[i] ? <small>{reviewFeedback[i] === 'knew' ? 'Great. Reinforced.' : 'Saved for another pass.'}</small> : null}</li>)}</ul> : <p className={styles.empty}>Phrase bank is empty.</p>}</article>
      <article className={styles.reviewBlock}><h3>Saved Phrase Bank ({phraseBank.length})</h3><ul>{phraseBank.slice().reverse().slice(0, 24).map((item, i) => <li key={`bank-${i}`}><strong>{item.learningText}</strong><p>{item.englishMeaning}</p><small>{item.language} · Seen {item.timesSeen}x</small></li>)}</ul></article>
      <button type="button" className="button secondary" onClick={clearLearningLibrary}>Clear Learning Library</button>
    </section> : null}
  </div></section>;
}
