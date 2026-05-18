'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './human-equation.module.css';
import { briefings, callTimingBriefings, setupOptions } from './data/mockScenario';

const stages = ['intro', 'setup', 'incoming', 'active', 'report'];
const randomFrom = (items = []) => items[Math.floor(Math.random() * items.length)];
const HUMAN_EQUATION_BUILD_VERSION = '2026-05-15 GA-CLEAN-1';

const asText = (value, fallback = 'Unknown') => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
};

export default function HumanEquationExperience() {
  const [stage, setStage] = useState('intro');
  const [callStartedAt, setCallStartedAt] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [privateNotes, setPrivateNotes] = useState('');
  const [callStatus, setCallStatus] = useState('Not connected');
  const [emotionalTemperature, setEmotionalTemperature] = useState('Escalated');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcriptLines, setTranscriptLines] = useState([]);
  const [callEndedAt, setCallEndedAt] = useState(null);
  const [setup, setSetup] = useState({
    role: setupOptions.roles[1],
    gradeBand: setupOptions.gradeBands[1],
    callType: setupOptions.callTypes[0],
    callTiming: setupOptions.callTimings[0],
    scenarioType: setupOptions.scenarioTypes[0],
    intensity: setupOptions.intensities[2],
    parentVoice: setupOptions.parentVoices[1],
    parentTone: setupOptions.parentTones[0],
    communicationStyle: setupOptions.communicationStyles[0],
  });
  const [micPermission, setMicPermission] = useState('Checking…');
  const [micError, setMicError] = useState('');
  const [hasMicrophone, setHasMicrophone] = useState(true);
  const [userAudioDetected, setUserAudioDetected] = useState(false);
  const [noiseWarning, setNoiseWarning] = useState('');
  const [micTestResult, setMicTestResult] = useState('');
  const [micTestVoiceDetected, setMicTestVoiceDetected] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [rtcDiagnostics, setRtcDiagnostics] = useState({
    micStreamStatus: 'missing',
    audioTrackCount: 0,
    firstTrackEnabled: 'n/a',
    firstTrackMuted: 'n/a',
    peerConnectionState: 'new',
    iceConnectionState: 'new',
    dataChannelState: 'closed',
    realtimeSessionStatus: 'not_started',
    peerConnectionCreated: false,
    dataChannelOpen: false,
    realtimeSessionStarted: false,
  });
  const [debugInfo, setDebugInfo] = useState({ selectedCards: null, simulationPrompt: '', promptPreview: '', promptSource: 'unknown', fallbackReason: null, dataCounts: { parentArchetypes: 0, issueCards: 0 }, buildVersion: 'server-realtime-session' });
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [realtimeEventCounts, setRealtimeEventCounts] = useState({});

  const pcRef = useRef(null);
  const micStreamRef = useRef(null);
  const audioElRef = useRef(null);
  const dcRef = useRef(null);
  const analyzerRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioDetectIntervalRef = useRef(null);
  const micTestIntervalRef = useRef(null);
  const micTestAudioContextRef = useRef(null);

  const callDuration = useMemo(() => {
    if (!callStartedAt) return '00:00';
    const seconds = Math.floor((now - callStartedAt) / 1000);
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  }, [callStartedAt, now]);

  const resolvedCallDuration = useMemo(() => {
    if (!callStartedAt) return '00:00';
    const endTime = callEndedAt || now;
    const seconds = Math.max(0, Math.floor((endTime - callStartedAt) / 1000));
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  }, [callEndedAt, callStartedAt, now]);

  useEffect(() => {
    if (stage !== 'active') return undefined;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [stage]);

  const nextStage = () => setStage(stages[Math.min(stages.indexOf(stage) + 1, stages.length - 1)]);

  const teardownCall = () => {
    dcRef.current?.close();
    pcRef.current?.getSenders().forEach((sender) => sender.track?.stop());
    pcRef.current?.close();
    micStreamRef.current?.getTracks().forEach((track) => track.stop());
    pcRef.current = null;
    micStreamRef.current = null;
    dcRef.current = null;
    if (audioElRef.current) audioElRef.current.srcObject = null;
    setCallStatus('Call ended');
    setIsSpeaking(false);
    setUserAudioDetected(false);
    setNoiseWarning('');
    if (audioDetectIntervalRef.current) clearInterval(audioDetectIntervalRef.current);
    if (micTestIntervalRef.current) clearInterval(micTestIntervalRef.current);
    analyzerRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
    micTestAudioContextRef.current?.close();
    micTestAudioContextRef.current = null;
  };

  const mapRealtimeRole = (role) => {
    if (role === 'assistant') return 'parent';
    if (role === 'user') return 'user';
    if (role === 'system') return 'system';
    return 'unknown';
  };

  const extractTranscriptEntries = (message) => {
    const eventType = asText(message?.type, '');
    const timestamp = Date.now();
    const candidates = [];
    const pushEntry = (id, role, text) => {
      const cleanText = typeof text === 'string' ? text.trim() : '';
      if (!cleanText) return;
      candidates.push({
        id: asText(id, `${eventType}-${timestamp}-${candidates.length}`),
        role: mapRealtimeRole(role),
        text: cleanText,
        timestamp,
        eventType,
      });
    };

    const responseOutput = Array.isArray(message?.response?.output) ? message.response.output : [];
    responseOutput.forEach((outputItem, index) => {
      const content = Array.isArray(outputItem?.content) ? outputItem.content : [];
      content.forEach((contentItem, contentIndex) => {
        if (typeof contentItem?.transcript === 'string') {
          pushEntry(outputItem?.id || `${outputItem?.role || 'unknown'}-${index}-${contentIndex}`, outputItem?.role, contentItem.transcript);
        }
        if (typeof contentItem?.text === 'string') {
          pushEntry(outputItem?.id || `${outputItem?.role || 'unknown'}-${index}-${contentIndex}-text`, outputItem?.role, contentItem.text);
        }
      });
    });

    if (eventType === 'conversation.item.input_audio_transcription.completed') {
      pushEntry(message?.item_id || message?.id || 'user-transcription', 'user', message?.transcript);
    }

    if (eventType === 'conversation.item.created') {
      const item = message?.item;
      const content = Array.isArray(item?.content) ? item.content : [];
      content.forEach((contentItem, index) => {
        if (typeof contentItem?.transcript === 'string') pushEntry(item?.id || `item-${index}`, item?.role, contentItem.transcript);
        if (typeof contentItem?.text === 'string') pushEntry(item?.id || `item-text-${index}`, item?.role, contentItem.text);
      });
    }

    return candidates;
  };

  useEffect(() => {
    const assessMicReadiness = async () => {
      try {
        if (!navigator?.mediaDevices?.enumerateDevices) return;
        const devices = await navigator.mediaDevices.enumerateDevices();
        const mics = devices.filter((d) => d.kind === 'audioinput');
        setHasMicrophone(mics.length > 0);
        if (mics.length === 0) {
          setMicError('No microphone found. Connect a mic and refresh before starting the call.');
        }
      } catch {
        setMicPermission('Unknown');
      }
    };

    const trackPermission = async () => {
      if (!navigator.permissions?.query) {
        setMicPermission('Unknown');
        await assessMicReadiness();
        return;
      }
      try {
        const status = await navigator.permissions.query({ name: 'microphone' });
        const apply = () => {
          setMicPermission(status.state);
          if (status.state === 'denied') {
            setMicError('Microphone permission is denied. Enable microphone access in your browser settings.');
          } else if (status.state !== 'denied') {
            setMicError('');
          }
        };
        apply();
        status.onchange = apply;
      } catch {
        setMicPermission('Unknown');
      } finally {
        await assessMicReadiness();
      }
    };

    trackPermission();
  }, []);

  const ensureMicStream = async () => {
    console.log('HUMAN_EQUATION_MIC_REQUEST_START');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioTracks = stream.getAudioTracks();
    console.log('HUMAN_EQUATION_MIC_REQUEST_SUCCESS');
    console.log('HUMAN_EQUATION_AUDIO_TRACKS', {
      count: audioTracks.length,
      enabled: audioTracks[0]?.enabled ?? null,
      muted: audioTracks[0]?.muted ?? null,
    });
    setMicPermission('granted');
    setMicError('');
    setRtcDiagnostics((prev) => ({
      ...prev,
      micStreamStatus: stream.active ? 'active' : 'inactive',
      audioTrackCount: audioTracks.length,
      firstTrackEnabled: String(audioTracks[0]?.enabled ?? 'n/a'),
      firstTrackMuted: String(audioTracks[0]?.muted ?? 'n/a'),
    }));
    return stream;
  };

  const beginCall = async () => {
    console.log('HUMAN_EQUATION_BEGIN_CALL');
    setCallStartedAt(Date.now());
    setTranscriptLines([]);
    setDebugInfo({ selectedCards: null, simulationPrompt: '', promptPreview: '', promptSource: 'unknown', fallbackReason: null, dataCounts: { parentArchetypes: 0, issueCards: 0 }, buildVersion: 'server-realtime-session' });
    setShowDebugPanel(false);
    setRealtimeEventCounts({});
    setCallEndedAt(null);
    setCallStatus('Connecting…');
    setEmotionalTemperature('Escalated');
    setStage('active');
    setSessionError('');
    setRtcDiagnostics((prev) => ({
      ...prev,
        peerConnectionCreated: false,
      dataChannelOpen: false,
      realtimeSessionStarted: false,
      realtimeSessionStatus: 'not_started',
    }));

    try {
      const stream = micStreamRef.current?.active ? micStreamRef.current : await ensureMicStream();
      micStreamRef.current = stream;
      const audioTracks = stream.getAudioTracks();
      if (!audioTracks.length) {
        throw new Error('Microphone is not connected to the call. Check browser permission or try headphones.');
      }

      const pc = new RTCPeerConnection();
      console.log('HUMAN_EQUATION_PEER_CONNECTION_CREATED');
      pcRef.current = pc;
      setRtcDiagnostics((prev) => ({
        ...prev,
        peerConnectionCreated: true,
      }));
      pc.onconnectionstatechange = () => {
        console.log('HUMAN_EQUATION_PEER_CONNECTION_STATE', pc.connectionState);
        setRtcDiagnostics((prev) => ({ ...prev, peerConnectionState: pc.connectionState, iceConnectionState: pc.iceConnectionState }));
      };

      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      audioElRef.current = audioEl;
      pc.ontrack = (e) => {
        console.log('HUMAN_EQUATION_REMOTE_AUDIO_TRACK_RECEIVED');
        audioEl.srcObject = e.streams[0];
      };

      pc.addTrack(audioTracks[0]);

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      audioContextRef.current = audioContext;
      analyzerRef.current = analyser;
      const bins = new Uint8Array(analyser.frequencyBinCount);
      audioDetectIntervalRef.current = setInterval(() => {
        analyser.getByteFrequencyData(bins);
        const avg = bins.reduce((sum, val) => sum + val, 0) / bins.length;
        setUserAudioDetected(avg > 18);
        setNoiseWarning(avg > 48 ? 'Background noise may be interfering. Move to a quieter room if possible.' : '');
      }, 300);

      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;
      setRtcDiagnostics((prev) => ({ ...prev, dataChannelState: dc.readyState, realtimeSessionStatus: 'connecting' }));
      dc.onopen = () => {
        console.log('HUMAN_EQUATION_DATA_CHANNEL_OPEN');
        setCallStatus('Live call connected');
        setRtcDiagnostics((prev) => ({ ...prev, dataChannelState: dc.readyState, dataChannelOpen: true, realtimeSessionStatus: 'connected' }));
        console.log('HUMAN_EQUATION_REALTIME_CONNECTED');
      };

      dc.onmessage = (event) => {
        try {
          const rawPayload = typeof event?.data === 'string' ? event.data : '';
          if (!rawPayload) return;

          let message = null;
          try {
            message = JSON.parse(rawPayload);
          } catch (parseError) {
            console.log('HUMAN_EQUATION_DATA_CHANNEL_PARSE_ERROR', parseError);
            return;
          }

          const eventType = asText(message?.type, '');
          if (!eventType) return;

          setRealtimeEventCounts((prev) => ({
            ...prev,
            [eventType]: (prev[eventType] || 0) + 1,
          }));

          switch (eventType) {
            case 'response.audio.delta':
            case 'output_audio_buffer.started':
              setIsSpeaking(true);
              return;
            case 'output_audio_buffer.stopped':
              setIsSpeaking(false);
              return;
            case 'response.done': {
              const transcriptEntries = extractTranscriptEntries(message);
              if (transcriptEntries.length) {
                setTranscriptLines((prev) => [...prev, ...transcriptEntries]);
              }
              const fullText = rawPayload.toLowerCase();
              if (fullText.includes('i hear you') || fullText.includes('thank you for explaining')) {
                setEmotionalTemperature('Stabilizing');
              }
              return;
            }
            case 'conversation.item.input_audio_transcription.completed':
            case 'conversation.item.created': {
              const transcriptEntries = extractTranscriptEntries(message);
              if (transcriptEntries.length) {
                setTranscriptLines((prev) => [...prev, ...transcriptEntries]);
              }
              return;
            }
            default:
              // Ignore unknown realtime event types so new API events cannot crash the UI.
              return;
          }
        } catch (handlerError) {
          console.log('HUMAN_EQUATION_DATA_CHANNEL_HANDLER_ERROR', handlerError);
        }
      };
      dc.onclose = () => setRtcDiagnostics((prev) => ({ ...prev, dataChannelState: 'closed' }));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log('HUMAN_EQUATION_SDP_OFFER_CREATED');
      const localSdp = offer.sdp;
      if (!localSdp) throw new Error('Local SDP offer is missing.');

      console.log('HUMAN_EQUATION_SDP_REQUEST_START');
      const sdpRes = await fetch('/api/human-equation/realtime-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp',
          'x-simulation-setup': JSON.stringify(setup),
        },
        body: localSdp,
      });
      console.log('HUMAN_EQUATION_SDP_REQUEST_STATUS', sdpRes.status);
      const answerText = await sdpRes.text();
      if (!sdpRes.ok) {
        throw new Error(answerText || `Realtime SDP exchange failed (${sdpRes.status}).`);
      }

      const answer = { type: 'answer', sdp: answerText };
      console.log('HUMAN_EQUATION_SDP_ANSWER_RECEIVED');
      await pc.setRemoteDescription(answer);
      console.log('HUMAN_EQUATION_SET_REMOTE_DESCRIPTION_SUCCESS');
      setRtcDiagnostics((prev) => ({ ...prev, realtimeSessionStarted: true, realtimeSessionStatus: 'started' }));

      setDebugInfo({
        selectedCards: null,
        simulationPrompt: 'Prompt is injected server-side from simulation cards.',
        promptPreview: 'Prompt is injected server-side from simulation cards.',
        promptSource: 'json/card builder',
        fallbackReason: null,
        dataCounts: { parentArchetypes: 0, issueCards: 0 },
        buildVersion: 'server-realtime-session',
      });
    } catch (error) {
      console.log('HUMAN_EQUATION_SESSION_REQUEST_ERROR', error);
      setRtcDiagnostics((prev) => ({ ...prev, realtimeSessionStatus: 'failed' }));
      if (/session|realtime|token/i.test(error?.message || '')) {
        setSessionError(`Realtime session failed to start: ${error.message}`);
      }
      console.log('HUMAN_EQUATION_MIC_REQUEST_ERROR', error);
      if (error?.name === 'NotAllowedError') {
        setMicPermission('denied');
      }
      if (error?.name === 'NotAllowedError' || /Microphone is not connected/.test(error?.message || '')) {
        setMicError('Microphone is not connected to the call. Check browser permission or try headphones.');
      }
      setCallStatus(`Connection failed: ${error.message}`);
      teardownCall();
    }
  };

  const testMicrophone = async () => {
    setMicTestResult('Requesting microphone…');
    setMicTestVoiceDetected(false);
    try {
      const stream = await ensureMicStream();
      micStreamRef.current = stream;
      const audioTracks = stream.getAudioTracks();
      setMicTestResult(`Stream received. Audio tracks: ${audioTracks.length}`);
      if (micTestIntervalRef.current) clearInterval(micTestIntervalRef.current);
      micTestAudioContextRef.current?.close();
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      micTestAudioContextRef.current = audioContext;
      const bins = new Uint8Array(analyser.frequencyBinCount);
      micTestIntervalRef.current = setInterval(() => {
        analyser.getByteFrequencyData(bins);
        const avg = bins.reduce((sum, val) => sum + val, 0) / bins.length;
        setMicTestVoiceDetected(avg > 18);
      }, 250);
    } catch (error) {
      console.log('HUMAN_EQUATION_MIC_REQUEST_ERROR', error);
      setMicTestResult(`Mic test failed: ${error.message}`);
      setMicError('Microphone is not connected to the call. Check browser permission or try headphones.');
    }
  };

  const endCall = () => {
    setCallEndedAt(Date.now());
    teardownCall();
    setStage('report');
  };

  const copyTranscript = async () => {
    const transcriptText = transcriptLines.map((line) => `[${new Date(line.timestamp).toLocaleTimeString()}] (${line.role}) ${line.text}`).join('\n');
    try {
      await navigator.clipboard.writeText(transcriptText);
    } catch (error) {
      console.log('HUMAN_EQUATION_COPY_TRANSCRIPT_ERROR', error);
    }
  };

  const startNewCall = () => {
    setTranscriptLines([]);
    setPrivateNotes('');
    setCallStartedAt(null);
    setCallEndedAt(null);
    setCallStatus('Not connected');
    setEmotionalTemperature('Escalated');
    setStage('setup');
  };

  const setField = (key, value) => setSetup((prev) => ({ ...prev, [key]: value }));

  const randomizeScenario = () => {
    setSetup((prev) => ({
      ...prev,
      role: randomFrom(setupOptions.roles),
      gradeBand: randomFrom(setupOptions.gradeBands),
      callType: randomFrom(setupOptions.callTypes),
      callTiming: randomFrom(setupOptions.callTimings),
      scenarioType: randomFrom(setupOptions.scenarioTypes),
      intensity: randomFrom(setupOptions.intensities),
      parentVoice: randomFrom(setupOptions.parentVoices),
      parentTone: randomFrom(setupOptions.parentTones),
      communicationStyle: randomFrom(setupOptions.communicationStyles),
      scenarioNonce: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    }));
  };

  const regenerateParentProfile = () => {
    setSetup((prev) => ({
      ...prev,
      intensity: randomFrom(setupOptions.intensities),
      parentVoice: randomFrom(setupOptions.parentVoices),
      parentTone: randomFrom(setupOptions.parentTones),
      communicationStyle: randomFrom(setupOptions.communicationStyles),
      parentProfileNonce: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    }));
  };
  const isUnexpectedCall = setup.callType === setupOptions.callTypes[0];
  const selectedTimingBriefing = callTimingBriefings?.[setup.callTiming] ?? {
    summary: 'Context briefing unavailable.',
    goal: 'Clarify the call context and establish next steps.',
    focus: [],
  };

  return (
    <section className={styles.shell}>
      <div className={styles.content}>
        {stage === 'intro' && (
          <div className={styles.panel}>
            <p className={styles.eyebrow}>The Human Equation</p>
            <h1>Practice the conversations that determine trust.</h1>
            <p className={styles.lead}>A voice-first leadership simulator for difficult parent and school conversations. Rehearse how you respond under pressure before the real call happens.</p>
            <div className={styles.valueGrid}>
              <article><h3>Stay calm under pressure</h3></article>
              <article><h3>Practice real parent dynamics</h3></article>
              <article><h3>Review your transcript and coaching report afterward</h3></article>
            </div>
            <button className={styles.cta} onClick={nextStage}>Set Up Simulation</button>
          </div>
        )}
        {stage === 'setup' && (
          <div className={styles.panel}>
            <p className={styles.eyebrow}>Simulation Setup</p>
            <h2>Configure your leadership call</h2>
            <p className={styles.variationNote}>For realistic practice, scenario details may vary each time.</p>
            <div className={styles.setupActions}>
              <button type="button" className={styles.cta} onClick={randomizeScenario}>Generate New Scenario</button>
              <button type="button" className={styles.secondaryAction} onClick={regenerateParentProfile}>Regenerate Parent Profile</button>
            </div>
            <div className={styles.setupGrid}>
              <Selector label="Role" options={setupOptions.roles} value={setup.role} onSelect={(value) => setField('role', value)} />
              <Selector label="Grade Band" options={setupOptions.gradeBands} value={setup.gradeBand} onSelect={(value) => setField('gradeBand', value)} />
              <Selector label="Call Type" options={setupOptions.callTypes} value={setup.callType} onSelect={(value) => setField('callType', value)} />
              <Selector label="Call Timing / Context" options={setupOptions.callTimings} value={setup.callTiming} onSelect={(value) => setField('callTiming', value)} />
              <Selector label="Scenario Type" options={setupOptions.scenarioTypes} value={setup.scenarioType} onSelect={(value) => setField('scenarioType', value)} />
              <Selector label="Parent Intensity" options={setupOptions.intensities} value={setup.intensity} onSelect={(value) => setField('intensity', value)} />
              <Selector label="Parent Voice" options={setupOptions.parentVoices} value={setup.parentVoice} onSelect={(value) => setField('parentVoice', value)} />
              <Selector label="Parent Tone" options={setupOptions.parentTones} value={setup.parentTone} onSelect={(value) => setField('parentTone', value)} />
              <Selector label="Communication Style" options={setupOptions.communicationStyles} value={setup.communicationStyle} onSelect={(value) => setField('communicationStyle', value)} />
            </div>
            <div className={styles.briefingCard}>
              <h3>Pre-Call Briefing</h3>
              <p className={styles.contextLabel}><strong>Call Timing / Context:</strong> {setup.callTiming}</p>
              <p>{selectedTimingBriefing.summary}</p>
              <p><strong>Primary goal:</strong> {selectedTimingBriefing.goal}</p>
              <p><strong>Context focus:</strong></p>
              <ul>{selectedTimingBriefing.focus.map((item) => <li key={item}>{item}</li>)}</ul>
              {isUnexpectedCall ? (
                <p>{briefings.limited}</p>
              ) : (
                <>
                  <p><strong>Known facts</strong></p>
                  <ul>{briefings.full.knownFacts.map((item) => <li key={item}>{item}</li>)}</ul>
                  <p><strong>Teacher/staff report</strong></p>
                  <ul>{briefings.full.staffReport.map((item) => <li key={item}>{item}</li>)}</ul>
                  <p><strong>Student statements</strong></p>
                  <ul>{briefings.full.studentStatements.map((item) => <li key={item}>{item}</li>)}</ul>
                  <p><strong>What is still unclear</strong></p>
                  <ul>{briefings.full.unclear.map((item) => <li key={item}>{item}</li>)}</ul>
                  <p><strong>Leadership challenge:</strong> {briefings.full.leadershipChallenge}</p>
                </>
              )}
            </div>
            <button className={styles.cta} onClick={nextStage}>Proceed to Incoming Call</button>
          </div>
        )}
        {stage === 'incoming' && (
          <div className={styles.panelCentered}>
            <p className={styles.eyebrow}>Incoming Call</p>
            <div className={styles.callOrb} />
            <h2>Parent Caller: {setup.parentVoice === 'Male' ? 'Mr. Carter' : 'Ms. Rodriguez'} ({setup.gradeBand})</h2>
            <p className={styles.subtle}>{setup.scenarioType} • {setup.callType}</p>
            <p className={styles.contextLabel}><strong>Call Timing / Context:</strong> {setup.callTiming}</p>
            <div className={styles.micChecklist}>
              <h3>Pre-Call Environment Check</h3>
              <ul>
                <li>Quiet room recommended</li>
                <li>Headphones recommended</li>
                <li>Use a device with a working microphone</li>
              </ul>
              <p><strong>Microphone permission:</strong> {micPermission}</p>
              {micTestResult && <p><strong>Mic test:</strong> {micTestResult}</p>}
              <p><strong>Voice test:</strong> {micTestVoiceDetected ? 'Voice detected' : 'Waiting for voice'}</p>
              {micError && <p className={styles.errorText}>{micError}</p>}
              {!hasMicrophone && <p className={styles.errorText}>No microphone detected.</p>}
              <button type="button" className={styles.secondaryAction} onClick={testMicrophone}>Test Microphone</button>
            </div>
            <button className={styles.cta} onClick={beginCall} disabled={Boolean(micError) || !hasMicrophone}>Answer and Begin</button>
          </div>
        )}
        {stage === 'active' && (
          <div className={styles.callLayout}>
            <div className={styles.callHeader}>
              <p className={styles.eyebrow}>Live Voice Simulation</p>
              <div className={styles.timer}>{callDuration}</div>
            </div>
            <p className={styles.subtle}><strong>Human Equation Build:</strong> {HUMAN_EQUATION_BUILD_VERSION}</p>
            <h2>Ms. Rodriguez — Parent Caller</h2>
            <p className={styles.subtle}>Emotional temperature: <strong>{emotionalTemperature}</strong> • {callStatus}</p>
            <p className={styles.contextLabel}><strong>Call Timing / Context:</strong> {setup.callTiming}</p>
            <div className={styles.callStatusGrid}>
              <p><strong>Mic status:</strong> {micPermission}</p>
              <p><strong>Mic stream status:</strong> {rtcDiagnostics.micStreamStatus}</p>
              <p><strong>Audio tracks found:</strong> {rtcDiagnostics.audioTrackCount}</p>
              <p><strong>First audio track enabled:</strong> {rtcDiagnostics.firstTrackEnabled}</p>
              <p><strong>First audio track muted:</strong> {rtcDiagnostics.firstTrackMuted}</p>
              <p><strong>WebRTC connection state:</strong> {rtcDiagnostics.peerConnectionState}</p>
              <p><strong>ICE connection state:</strong> {rtcDiagnostics.iceConnectionState}</p>
              <p><strong>Data channel state:</strong> {rtcDiagnostics.dataChannelState}</p>
              <p><strong>Realtime session status:</strong> {rtcDiagnostics.realtimeSessionStatus}</p>
              <p><strong>Realtime session started:</strong> {rtcDiagnostics.realtimeSessionStarted ? 'true' : 'false'}</p>
              <p><strong>Peer connection created:</strong> {rtcDiagnostics.peerConnectionCreated ? 'true' : 'false'}</p>
              <p><strong>Data channel open:</strong> {rtcDiagnostics.dataChannelOpen ? 'true' : 'false'}</p>
              <p><strong>Your audio:</strong> {userAudioDetected ? 'Detected' : 'Waiting for voice'}</p>
              {noiseWarning && <p className={styles.warningText}>{noiseWarning}</p>}
              {micError && <p className={styles.errorText}>{micError}</p>}
              {sessionError && <p className={styles.errorText}>{sessionError}</p>}
            </div>
            <div className={`${styles.waveform} ${isSpeaking ? styles.waveformActive : ''}`} aria-hidden />
            <label className={styles.notesLabel}>Private Notes (not shared)</label>
            <textarea className={styles.notes} placeholder="Capture key facts, commitments, and follow-up actions..." value={privateNotes} onChange={(e) => setPrivateNotes(e.target.value)} />
            <button className={styles.endCall} onClick={endCall}>End Call</button>
            <button type="button" className={styles.debugToggle} onClick={() => setShowDebugPanel((prev) => !prev)}>
              {showDebugPanel ? 'Hide Developer Debug' : 'Show Developer Debug'}
            </button>
            {showDebugPanel && (
              <div className={styles.debugPanel}>
                <h3>Developer Debug Panel</h3>
                <p><strong>Parent archetypes count:</strong> {debugInfo.dataCounts?.parentArchetypes ?? 0}</p>
                <p><strong>Issue cards count:</strong> {debugInfo.dataCounts?.issueCards ?? 0}</p>
                <p><strong>Selected parent archetype:</strong> {debugInfo.selectedCards?.openingArchetype?.name || 'Unknown'}</p>
                <p><strong>Selected issue card:</strong> {debugInfo.selectedCards?.issue?.title || 'Unknown'}</p>
                <p><strong>Generated prompt length:</strong> {debugInfo.simulationPrompt?.length || 0}</p>
                <p><strong>Prompt source:</strong> {asText(debugInfo.promptSource, 'unknown')}</p>
                <p><strong>Build version:</strong> {asText(debugInfo.buildVersion, HUMAN_EQUATION_BUILD_VERSION)}</p>
                <p><strong>Prompt builder error:</strong> {asText(debugInfo.fallbackReason, 'None')}</p>
                {asText(debugInfo.promptSource, 'unknown') !== 'json' && (
                  <p className={styles.debugWarning}><strong>WARNING:</strong> Realtime session is not using generated JSON prompt.</p>
                )}
                <p><strong>Realtime event types seen:</strong> {Object.keys(realtimeEventCounts).length}</p>
                <pre>{JSON.stringify(realtimeEventCounts, null, 2)}</pre>
                <p><strong>Generated prompt (first 1500 chars):</strong></p>
                <pre>{debugInfo.promptPreview || (debugInfo.simulationPrompt ? debugInfo.simulationPrompt.slice(0, 1500) : 'No prompt generated yet.')}</pre>
              </div>
            )}
          </div>
        )}
        {stage === 'report' && (
          <div className={styles.panel}>
            <p className={styles.eyebrow}>Post-Call Coaching Report</p>
            <h2>Transcript and Leadership Debrief</h2>
            <p className={styles.subtle}>Full transcript appears after the call ends.</p>
            <p><strong>Scenario:</strong> {setup.scenarioType || 'Unknown scenario'}</p>
            <p><strong>Parent:</strong> {setup.parentVoice === 'Male' ? 'Mr. Carter' : 'Ms. Rodriguez'}</p>
            <p><strong>Issue:</strong> {setup.callType || 'Unknown issue'}</p>
            <p><strong>Call duration:</strong> {resolvedCallDuration}</p>
            <div className={styles.reportGrid}>
              <section>
                <h3>What went well</h3>
                <ul>
                  <li>You stayed engaged throughout a high-pressure call and maintained response discipline.</li>
                  <li>You can build trust by acknowledging concern before moving into process details.</li>
                </ul>
              </section>
              <section>
                <h3>Possible missed opportunities</h3>
                <ul>
                  <li>You may have opportunities to summarize shared understanding more explicitly.</li>
                  <li>Consider adding one clear timeline checkpoint earlier in the conversation.</li>
                </ul>
              </section>
              <section>
                <h3>Suggested next step</h3>
                <p>Open the next call by naming concern, confirming one fact, and proposing a concrete follow-up window.</p>
              </section>
            </div>
            <section className={styles.transcriptBlock}>
              <h3>Private notes</h3>
              <p>{privateNotes || 'No private notes captured for this call.'}</p>
            </section>
            <section className={styles.transcriptBlock}>
              <h3>Full transcript</h3>
              {transcriptLines.length === 0 ? (
                <p>Transcript was not captured for this call yet, but the live voice session completed.</p>
              ) : (
                transcriptLines.map((line, idx) => (
                  <article key={`${line.id}-${idx}`} className={styles.lineItem}>
                    <div className={styles.lineMeta}><strong>{line.role}</strong> <span>{new Date(line.timestamp).toLocaleTimeString()} • {line.eventType}</span></div>
                    <p>{line.text}</p>
                  </article>
                ))
              )}
            </section>
            <div className={styles.reportActions}>
              <button type="button" className={styles.secondaryAction} onClick={copyTranscript} disabled={transcriptLines.length === 0}>Copy Transcript</button>
              <button className={styles.cta} onClick={startNewCall}>Start New Call</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Selector({ label, options, value, onSelect }) {
  return (
    <div>
      <p className={styles.selectorLabel}>{label}</p>
      <div className={styles.selectorWrap}>
        {options.map((option) => (
          <button key={option} type="button" className={`${styles.selectorBtn} ${option === value ? styles.selected : ''}`} onClick={() => onSelect(option)}>{option}</button>
        ))}
      </div>
    </div>
  );
}
