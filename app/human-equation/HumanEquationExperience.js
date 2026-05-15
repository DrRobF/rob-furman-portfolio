'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './human-equation.module.css';
import { briefings, callTimingBriefings, setupOptions } from './data/mockScenario';

const stages = ['intro', 'setup', 'incoming', 'active', 'report'];

const randomFrom = (items = []) => items[Math.floor(Math.random() * items.length)];

export default function HumanEquationExperience() {
  const [stage, setStage] = useState('intro');
  const [callStartedAt, setCallStartedAt] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [privateNotes, setPrivateNotes] = useState('');
  const [callStatus, setCallStatus] = useState('Not connected');
  const [emotionalTemperature, setEmotionalTemperature] = useState('Escalated');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcriptLines, setTranscriptLines] = useState([]);
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
  const [canRetryConnection, setCanRetryConnection] = useState(false);
  const [retryAttempted, setRetryAttempted] = useState(false);
  const [rtcDiagnostics, setRtcDiagnostics] = useState({
    micStreamStatus: 'missing',
    audioTrackCount: 0,
    firstTrackEnabled: 'n/a',
    firstTrackMuted: 'n/a',
    peerConnectionState: 'new',
    iceConnectionState: 'new',
    dataChannelState: 'closed',
    realtimeSessionStatus: 'not_started',
    realtimeApiVersion: 'v1/realtime/calls (GA)',
    sessionConfigModel: 'gpt-realtime',
    realtimeEndpointUsed: 'https://api.openai.com/v1/realtime/calls',
    sdpOfferCreated: false,
    sdpAnswerReceived: false,
    peerConnectionCreated: false,
    dataChannelOpen: false,
    realtimeSessionStarted: false,
    iceServersConfigured: false,
    iceCandidateTypes: 'none',
    selectedCandidatePair: 'unavailable',
    connectionFailureReason: 'none',
  });
  const [debugInfo, setDebugInfo] = useState({ selectedCards: null, simulationPrompt: '', promptPreview: '', promptSource: 'unknown', fallbackReason: null, dataCounts: { parentArchetypes: 0, issueCards: 0 } });
  const [showDebugPanel, setShowDebugPanel] = useState(false);

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

  const waitForIceGatheringComplete = (pc) => new Promise((resolve) => {
    if (pc.iceGatheringState === 'complete') {
      resolve();
      return;
    }
    const checkState = () => {
      if (pc.iceGatheringState === 'complete') {
        pc.removeEventListener('icegatheringstatechange', checkState);
        resolve();
      }
    };
    pc.addEventListener('icegatheringstatechange', checkState);
  });

  const parseIceCandidateTypes = (candidateString = '') => {
    if (!candidateString) return [];
    const match = candidateString.match(/ typ ([a-zA-Z0-9]+)/);
    return match?.[1] ? [match[1]] : [];
  };

  const beginCall = async (attemptNumber = 0) => {
    console.log('HUMAN_EQUATION_BEGIN_CALL');
    setCallStartedAt(Date.now());
    setTranscriptLines([]);
    setDebugInfo({ selectedCards: null, simulationPrompt: '', promptPreview: '', promptSource: 'unknown', fallbackReason: null, dataCounts: { parentArchetypes: 0, issueCards: 0 } });
    setShowDebugPanel(false);
    setCallStatus('Connecting…');
    setEmotionalTemperature('Escalated');
    setStage('active');
    setSessionError('');
    setCanRetryConnection(false);
    setRetryAttempted(attemptNumber > 0);
    setRtcDiagnostics((prev) => ({
      ...prev,
      peerConnectionCreated: false,
      dataChannelOpen: false,
      realtimeSessionStarted: false,
      realtimeSessionStatus: 'not_started',
      realtimeApiVersion: 'v1/realtime/calls (GA)',
      sessionConfigModel: 'gpt-realtime',
      realtimeEndpointUsed: 'https://api.openai.com/v1/realtime/calls',
      sdpOfferCreated: false,
      sdpAnswerReceived: false,
      localDescriptionType: 'none',
      remoteDescriptionType: 'none',
      iceGatheringState: 'new',
      iceCandidatesCount: 0,
      sdpAnswerStartsWithV0: false,
      setRemoteDescriptionSuccess: false,
      setRemoteDescriptionError: '',
      iceServersConfigured: false,
      iceCandidateTypes: 'none',
      selectedCandidatePair: 'unavailable',
      connectionFailureReason: 'none',
    }));

    try {
      const pcConfig = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' },
        ],
        iceCandidatePoolSize: 10,
      };
      const pc = new RTCPeerConnection(pcConfig);
      pcRef.current = pc;
      setRtcDiagnostics((prev) => ({ ...prev, peerConnectionCreated: true, realtimeSessionStatus: 'peer_connection_created', iceServersConfigured: true }));
      let iceCandidatesCount = 0;
      const candidateTypes = new Set();
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          iceCandidatesCount += 1;
          parseIceCandidateTypes(event.candidate.candidate).forEach((type) => candidateTypes.add(type));
        }
        setRtcDiagnostics((prev) => ({ ...prev, iceCandidatesCount, iceGatheringState: pc.iceGatheringState, iceCandidateTypes: Array.from(candidateTypes).join('/') || 'none' }));
      };
      pc.onconnectionstatechange = async () => {
        let selectedCandidatePair = 'unavailable';
        if (pc.connectionState === 'failed') {
          try {
            const stats = await pc.getStats();
            let selectedPair = null;
            stats.forEach((report) => {
              if (report.type === 'transport' && report.selectedCandidatePairId && stats.get(report.selectedCandidatePairId)) {
                selectedPair = stats.get(report.selectedCandidatePairId);
              }
              if (!selectedPair && report.type === 'candidate-pair' && report.selected) selectedPair = report;
            });
            if (selectedPair) {
              selectedCandidatePair = `${selectedPair.localCandidateId || 'local?'} -> ${selectedPair.remoteCandidateId || 'remote?'}`;
            }
          } catch {
            selectedCandidatePair = 'unavailable';
          }
        }
        setRtcDiagnostics((prev) => ({ ...prev, peerConnectionState: pc.connectionState, iceConnectionState: pc.iceConnectionState, selectedCandidatePair }));
        if (pc.connectionState === 'failed') {
          setRtcDiagnostics((prev) => ({ ...prev, connectionFailureReason: `connectionState=failed; iceConnectionState=${pc.iceConnectionState}` }));
          teardownCall();
          setCanRetryConnection(attemptNumber === 0);
          if (attemptNumber === 0) setCallStatus('Connection failed. Retry available.');
        }
      };
      pc.oniceconnectionstatechange = () => setRtcDiagnostics((prev) => ({ ...prev, peerConnectionState: pc.connectionState, iceConnectionState: pc.iceConnectionState }));
      pc.onicegatheringstatechange = () => setRtcDiagnostics((prev) => ({ ...prev, iceGatheringState: pc.iceGatheringState }));
      pc.ondatachannel = (event) => setRtcDiagnostics((prev) => ({ ...prev, dataChannelState: event.channel?.readyState || prev.dataChannelState }));

      const audioEl = new Audio();
      audioEl.autoplay = true;
      audioElRef.current = audioEl;
      pc.ontrack = (e) => { audioEl.srcObject = e.streams[0]; };
      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;
      setRtcDiagnostics((prev) => ({ ...prev, dataChannelState: dc.readyState }));
      dc.onopen = () => {
        setCallStatus('Live call connected');
        setRtcDiagnostics((prev) => ({ ...prev, dataChannelState: dc.readyState, dataChannelOpen: true, realtimeSessionStatus: 'realtime_connected' }));
      };
      dc.onclose = () => setRtcDiagnostics((prev) => ({ ...prev, dataChannelState: 'closed' }));
      dc.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'response.audio.delta' || message.type === 'output_audio_buffer.started') setIsSpeaking(true);
        if (message.type === 'output_audio_buffer.stopped') setIsSpeaking(false);
      };

      const stream = await ensureMicStream();
      micStreamRef.current = stream;
      const audioTracks = stream.getAudioTracks();
      if (!audioTracks.length) throw new Error('Microphone is not connected to the call. Check browser permission or try headphones.');
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await waitForIceGatheringComplete(pc);
      setRtcDiagnostics((prev) => ({ ...prev, sdpOfferCreated: Boolean(offer?.sdp), realtimeSessionStatus: 'offer_created', localDescriptionType: pc.localDescription?.type || 'none', iceGatheringState: pc.iceGatheringState, iceCandidatesCount }));

      const tokenRes = await fetch('/api/human-equation/realtime-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setup, offerSdp: pc.localDescription?.sdp || offer.sdp }),
      });
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) throw new Error(tokenData?.error || 'Failed to create realtime call session.');

      const simulationPrompt = tokenData?.simulationPrompt || '';
      setDebugInfo({
        selectedCards: tokenData?.selectedCards || null,
        simulationPrompt,
        promptPreview: tokenData?.promptPreview || simulationPrompt,
        promptSource: tokenData?.promptSource || 'unknown',
        fallbackReason: tokenData?.fallbackReason || null,
        dataCounts: tokenData?.dataCounts || { parentArchetypes: 0, issueCards: 0 },
      });

      const answerSdp = typeof tokenData?.answerSdp === 'string'
        ? tokenData.answerSdp
        : tokenData?.answer?.sdp;
      if (!answerSdp) throw new Error('Realtime SDP exchange failed (missing answer SDP).');
      const sdpAnswerStartsWithV0 = answerSdp.trim().startsWith('v=0');
      setRtcDiagnostics((prev) => ({ ...prev, sdpAnswerReceived: true, realtimeSessionStatus: 'answer_received', sdpAnswerStartsWithV0 }));

      try {
        await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
        setRtcDiagnostics((prev) => ({
          ...prev,
          realtimeSessionStarted: true,
          realtimeSessionStatus: 'realtime_session_started',
          remoteDescriptionType: pc.remoteDescription?.type || 'none',
          setRemoteDescriptionSuccess: true,
          setRemoteDescriptionError: '',
        }));
      } catch (remoteDescriptionError) {
        setRtcDiagnostics((prev) => ({
          ...prev,
          setRemoteDescriptionSuccess: false,
          setRemoteDescriptionError: remoteDescriptionError.message,
        }));
        throw remoteDescriptionError;
      }

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
    } catch (error) {
      setRtcDiagnostics((prev) => ({ ...prev, realtimeSessionStatus: 'failed' }));
      setSessionError(`Realtime session failed to start: ${error.message}`);
      if (error?.name === 'NotAllowedError') setMicPermission('denied');
      if (error?.name === 'NotAllowedError' || /Microphone is not connected/.test(error?.message || '')) setMicError('Microphone is not connected to the call. Check browser permission or try headphones.');
      setCallStatus(`Connection failed: ${error.message}`);
      teardownCall();
    }
  };

  const retryConnection = async () => {
    await beginCall(1);
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
    teardownCall();
    setStage('report');
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
  const selectedTimingBriefing = callTimingBriefings[setup.callTiming];

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
              <p><strong>Realtime endpoint used:</strong> {rtcDiagnostics.realtimeEndpointUsed}</p>
              <p><strong>SessionConfig model:</strong> {rtcDiagnostics.sessionConfigModel}</p>
              <p><strong>Realtime API version:</strong> {rtcDiagnostics.realtimeApiVersion}</p>
              <p><strong>SDP offer created:</strong> {rtcDiagnostics.sdpOfferCreated ? 'true' : 'false'}</p>
              <p><strong>SDP answer received:</strong> {rtcDiagnostics.sdpAnswerReceived ? 'true' : 'false'}</p>
              <p><strong>Local description type:</strong> {rtcDiagnostics.localDescriptionType}</p>
              <p><strong>Remote description type:</strong> {rtcDiagnostics.remoteDescriptionType}</p>
              <p><strong>ICE gathering state:</strong> {rtcDiagnostics.iceGatheringState}</p>
              <p><strong>ICE servers configured:</strong> {rtcDiagnostics.iceServersConfigured ? 'yes' : 'no'}</p>
              <p><strong>ICE candidates count:</strong> {rtcDiagnostics.iceCandidatesCount}</p>
              <p><strong>ICE candidate types:</strong> {rtcDiagnostics.iceCandidateTypes}</p>
              <p><strong>Selected candidate pair:</strong> {rtcDiagnostics.selectedCandidatePair}</p>
              <p><strong>Connection failure reason:</strong> {rtcDiagnostics.connectionFailureReason}</p>
              <p><strong>SDP answer starts with v=0:</strong> {rtcDiagnostics.sdpAnswerStartsWithV0 ? 'true' : 'false'}</p>
              <p><strong>setRemoteDescription success:</strong> {rtcDiagnostics.setRemoteDescriptionSuccess ? 'true' : 'false'}</p>
              <p><strong>setRemoteDescription error:</strong> {rtcDiagnostics.setRemoteDescriptionError || 'None'}</p>
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
            {canRetryConnection && !retryAttempted && (
              <button type="button" className={styles.secondaryAction} onClick={retryConnection}>Retry Connection</button>
            )}
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
                <p><strong>Prompt source:</strong> {debugInfo.promptSource}</p>
                <p><strong>Prompt builder error:</strong> {debugInfo.fallbackReason || 'None'}</p>
                {debugInfo.promptSource !== 'json' && (
                  <p className={styles.debugWarning}><strong>WARNING:</strong> Realtime session is not using generated JSON prompt.</p>
                )}
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
            <div className={styles.reportGrid}>
              <section>
                <h3>Emotional pressure moments</h3>
                <ul>
                  <li>Parent opened escalated and distrustful about school communication speed.</li>
                  <li>Moments of interruption raised emotional intensity before recovery.</li>
                </ul>
              </section>
              <section>
                <h3>Coaching highlights</h3>
                <ul>
                  <li>You can reinforce empathy before process details.</li>
                  <li>Use concise checkpoints for follow-up communication.</li>
                </ul>
              </section>
            </div>
            <section className={styles.transcriptBlock}>
              <h3>Full transcript</h3>
              {transcriptLines.length === 0 ? (
                <p>No transcript captured.</p>
              ) : (
                transcriptLines.map((line, idx) => (
                  <article key={`${line.speaker}-${idx}`} className={styles.lineItem}>
                    <div className={styles.lineMeta}><strong>{line.speaker}</strong></div>
                    <p>{line.text}</p>
                  </article>
                ))
              )}
            </section>
            <button className={styles.cta} onClick={() => setStage('intro')}>Run Simulation Again</button>
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
