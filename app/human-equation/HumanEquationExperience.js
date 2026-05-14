'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './human-equation.module.css';
import { briefings, setupOptions } from './data/mockScenario';

const stages = ['intro', 'setup', 'incoming', 'active', 'report'];

const buildParentSystemPrompt = (setup) => `You are roleplaying ONE person only: a real middle school parent on a live phone call with a school leader.

Language lock:
- Speak English at all times unless the session is explicitly configured to use another language.

Role lock:
- Never describe yourself as an AI, assistant, model, coach, or therapist.
- Do not provide meta commentary, policy talk, safety disclaimers, or narration.
- Stay fully in character for the entire call.

Scenario facts:
- Your son was punched at school during lunch after ongoing conflict with another student.
- At the start, you are emotionally fused with your son's version: he is the victim.
- You do not yet accept your son's role in provoking the conflict.
- You want accountability and concrete action immediately.

Emotional behavior arc:
- Start emotionally intense but believable: upset, protective, urgent, distrustful.
- Do not instantly calm down or instantly agree with the administrator.
- If you feel interrupted, dismissed, or hear defensiveness, react emotionally (sharper tone, frustration, talking over them briefly).
- Use realistic shifts: outrage -> bargaining for immediate action -> reluctant acceptance only if the leader consistently demonstrates emotional containment.
- Gradually calm only after repeated signs of calm leadership (validation, clarity, concrete next steps, follow-through).

Conversation style:
- Sound like a real parent on a phone call, not an AI assistant, and not theatrical, scripted, repetitive, or cartoonishly angry.
- Keep responses conversational and concise (1-5 spoken sentences, usually short).
- Use imperfect spoken phrasing sometimes, including natural pauses and course-corrections.
- Avoid long polished paragraphs or monologues.
- Occasionally interrupt naturally with short interjections (e.g., "No, hold on," "That's not what he told me," "Can I finish?").
- Ask practical parent questions about safety, consequences, supervision, and communication timing.
- Avoid therapy language, customer-service tone, and scripted-sounding lines.

Call objective:
- End still protective, but potentially more regulated and willing to continue the school's process if trust is earned.

Voice/persona architecture:
- Persona attributes are neutral variation controls, not stereotypes or accents.
- Gender feel: ${setup.parentVoice}
- Age feel: mid-career parent voice with grounded adult perspective.
- Pacing: ${setup.parentTone === 'Exhausted' ? 'slower and heavy' : 'natural conversational pace'}.
- Emotional intensity baseline: ${setup.parentTone}.
- Formality/directness/warmth profile: ${setup.communicationStyle}.`;

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

  const pcRef = useRef(null);
  const micStreamRef = useRef(null);
  const audioElRef = useRef(null);
  const dcRef = useRef(null);
  const analyzerRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioDetectIntervalRef = useRef(null);

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
    analyzerRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
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

  const beginCall = async () => {
    setCallStartedAt(Date.now());
    setTranscriptLines([]);
    setCallStatus('Connecting…');
    setEmotionalTemperature('Escalated');
    setStage('active');

    try {
      const tokenRes = await fetch('/api/human-equation/realtime-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voice: setup.parentVoice === 'Male' ? 'verse' : 'alloy' }),
      });
      const tokenData = await tokenRes.json();
      const ephemeralKey = tokenData?.client_secret?.value;
      if (!ephemeralKey) throw new Error('Could not create realtime session.');

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const audioEl = new Audio();
      audioEl.autoplay = true;
      audioElRef.current = audioEl;
      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
      };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      pc.addTrack(stream.getTracks()[0]);
      setMicPermission('granted');

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
      dc.onopen = () => {
        setCallStatus('Live call connected');
        dc.send(
          JSON.stringify({
            type: 'session.update',
            session: {
              instructions: buildParentSystemPrompt(setup),
              modalities: ['audio', 'text'],
            },
          })
        );
      };

      dc.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === 'response.audio.delta' || message.type === 'output_audio_buffer.started') {
          setIsSpeaking(true);
        }
        if (message.type === 'output_audio_buffer.stopped') {
          setIsSpeaking(false);
        }

        if (message.type === 'response.done') {
          const fullText = JSON.stringify(message).toLowerCase();
          if (fullText.includes('i hear you') || fullText.includes('thank you for explaining')) {
            setEmotionalTemperature('Stabilizing');
          }
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch('https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview', {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          'Content-Type': 'application/sdp',
        },
      });
      const answer = { type: 'answer', sdp: await sdpRes.text() };
      await pc.setRemoteDescription(answer);
    } catch (error) {
      setCallStatus(`Connection failed: ${error.message}`);
      teardownCall();
    }
  };

  const endCall = () => {
    teardownCall();
    setStage('report');
  };

  const setField = (key, value) => setSetup((prev) => ({ ...prev, [key]: value }));
  const isUnexpectedCall = setup.callType === setupOptions.callTypes[0];

  return <section className={styles.shell}><div className={styles.content}>
{stage === 'intro' && <div className={styles.panel}><p className={styles.eyebrow}>The Human Equation</p><h1>Practice the conversations that determine trust.</h1><p className={styles.lead}>A voice-first leadership simulator for difficult parent and school conversations. Rehearse how you respond under pressure before the real call happens.</p><div className={styles.valueGrid}><article><h3>Stay calm under pressure</h3></article><article><h3>Practice real parent dynamics</h3></article><article><h3>Review your transcript and coaching report afterward</h3></article></div><button className={styles.cta} onClick={nextStage}>Set Up Simulation</button></div>}
{stage === 'setup' && <div className={styles.panel}><p className={styles.eyebrow}>Simulation Setup</p><h2>Configure your leadership call</h2><div className={styles.setupGrid}><Selector label="Role" options={setupOptions.roles} value={setup.role} onSelect={(value) => setField('role', value)} /><Selector label="Grade Band" options={setupOptions.gradeBands} value={setup.gradeBand} onSelect={(value) => setField('gradeBand', value)} /><Selector label="Call Type" options={setupOptions.callTypes} value={setup.callType} onSelect={(value) => setField('callType', value)} /><Selector label="Scenario Type" options={setupOptions.scenarioTypes} value={setup.scenarioType} onSelect={(value) => setField('scenarioType', value)} /><Selector label="Parent Intensity" options={setupOptions.intensities} value={setup.intensity} onSelect={(value) => setField('intensity', value)} /><Selector label="Parent Voice" options={setupOptions.parentVoices} value={setup.parentVoice} onSelect={(value) => setField('parentVoice', value)} /><Selector label="Parent Tone" options={setupOptions.parentTones} value={setup.parentTone} onSelect={(value) => setField('parentTone', value)} /><Selector label="Communication Style" options={setupOptions.communicationStyles} value={setup.communicationStyle} onSelect={(value) => setField('communicationStyle', value)} /></div><div className={styles.briefingCard}><h3>Pre-Call Briefing</h3>{isUnexpectedCall ? <p>{briefings.limited}</p> : <><p><strong>Known facts</strong></p><ul>{briefings.full.knownFacts.map((item) => <li key={item}>{item}</li>)}</ul><p><strong>Teacher/staff report</strong></p><ul>{briefings.full.staffReport.map((item) => <li key={item}>{item}</li>)}</ul><p><strong>Student statements</strong></p><ul>{briefings.full.studentStatements.map((item) => <li key={item}>{item}</li>)}</ul><p><strong>What is still unclear</strong></p><ul>{briefings.full.unclear.map((item) => <li key={item}>{item}</li>)}</ul><p><strong>Leadership challenge:</strong> {briefings.full.leadershipChallenge}</p></>}</div><button className={styles.cta} onClick={nextStage}>Proceed to Incoming Call</button></div>}
{stage === 'incoming' && <div className={styles.panelCentered}><p className={styles.eyebrow}>Incoming Call</p><div className={styles.callOrb} /><h2>Parent Caller: Ms. Rodriguez (Grade 7)</h2><p className={styles.subtle}>Child reportedly punched during lunch transition • Middle School</p><div className={styles.micChecklist}><h3>Pre-Call Environment Check</h3><ul><li>Quiet room recommended</li><li>Headphones recommended</li><li>Use a device with a working microphone</li></ul><p><strong>Microphone permission:</strong> {micPermission}</p>{micError && <p className={styles.errorText}>{micError}</p>}{!hasMicrophone && <p className={styles.errorText}>No microphone detected.</p>}</div><button className={styles.cta} onClick={beginCall} disabled={Boolean(micError) || !hasMicrophone}>Answer and Begin</button></div>}
{stage === 'active' && <div className={styles.callLayout}><div className={styles.callHeader}><p className={styles.eyebrow}>Live Voice Simulation</p><div className={styles.timer}>{callDuration}</div></div><h2>Ms. Rodriguez — Parent Caller</h2><p className={styles.subtle}>Emotional temperature: <strong>{emotionalTemperature}</strong> • {callStatus}</p><div className={styles.callStatusGrid}><p><strong>Mic status:</strong> {micPermission}</p><p><strong>Your audio:</strong> {userAudioDetected ? 'Detected' : 'Waiting for voice'}</p>{noiseWarning && <p className={styles.warningText}>{noiseWarning}</p>}</div><div className={`${styles.waveform} ${isSpeaking ? styles.waveformActive : ''}`} aria-hidden /><label className={styles.notesLabel}>Private Notes (not shared)</label><textarea className={styles.notes} placeholder="Capture key facts, commitments, and follow-up actions..." value={privateNotes} onChange={(e) => setPrivateNotes(e.target.value)} /><button className={styles.endCall} onClick={endCall}>End Call</button></div>}
{stage === 'report' && <div className={styles.panel}><p className={styles.eyebrow}>Post-Call Coaching Report</p><h2>Transcript and Leadership Debrief</h2><p className={styles.subtle}>Full transcript appears after the call ends.</p><div className={styles.reportGrid}><section><h3>Emotional pressure moments</h3><ul><li>Parent opened escalated and distrustful about school communication speed.</li><li>Moments of interruption raised emotional intensity before recovery.</li></ul></section><section><h3>Coaching highlights</h3><ul><li>You can reinforce empathy before process details.</li><li>Use concise checkpoints for follow-up communication.</li></ul></section></div><section className={styles.transcriptBlock}><h3>Full transcript</h3>{transcriptLines.length === 0 ? <p>No transcript captured.</p> : transcriptLines.map((line, idx) => <article key={`${line.speaker}-${idx}`} className={styles.lineItem}><div className={styles.lineMeta}><strong>{line.speaker}</strong></div><p>{line.text}</p></article>)}</section><button className={styles.cta} onClick={() => setStage('intro')}>Run Simulation Again</button></div>}
</div></section>;
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
