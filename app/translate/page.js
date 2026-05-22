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

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recordingSpeakerRef = useRef(null);
  const audioChunksRef = useRef([]);
  const activeAudioRef = useRef(null);

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
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
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

  const getMediaStream = async () => {
    if (mediaStreamRef.current) return mediaStreamRef.current;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamRef.current = stream;
    return stream;
  };

  const blobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

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
    if (mediaRecorderRef.current?.state === 'recording' || isProcessing) return;
    setError('');
    try {
      const stream = await getMediaStream();
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];
      recordingSpeakerRef.current = speaker;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setActiveSpeaker(speaker);
      setStatus('Recording');
    } catch {
      setStatus('Error');
      setError('Microphone permission is needed to translate speech.');
    }
  }, [isProcessing]);

  const stopRecording = useCallback(async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state !== 'recording') return;

    setIsProcessing(true);
    setStatus('Translating');

    const done = new Promise((resolve) => {
      recorder.onstop = resolve;
      recorder.stop();
    });

    await done;

    try {
      const speaker = recordingSpeakerRef.current;
      const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
      const audioBase64 = await blobToBase64(blob);
      const response = await fetch('/api/translate-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64, sourceLanguage, targetLanguage, speaker }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Translation failed.');
      }

      setStatus('Speaking translation');
      const nextTurn = { id: crypto.randomUUID(), ...data };
      setTurns((prev) => [...prev, nextTurn]);

      if (data.audioBase64) {
        await playTranslationAudio(data.audioBase64, nextTurn.id);
      }
      setStatus('Ready');
    } catch (err) {
      setStatus('Error');
      setError(err.message || 'Something went wrong while translating.');
    } finally {
      setActiveSpeaker(null);
      recordingSpeakerRef.current = null;
      mediaRecorderRef.current = null;
      setIsProcessing(false);
    }
  }, [sourceLanguage, targetLanguage, playTranslationAudio]);

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
