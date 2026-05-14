'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './human-equation.module.css';
import { briefings, callerProfiles, setupOptions } from './data/mockScenario';

const stages = ['intro', 'setup', 'incoming', 'active', 'report'];

const PARENT_SYSTEM_PROMPT = `You are a middle school parent on a live phone call with a school leader. Your child says they were punched during a school conflict today.

Behavior rules:
- Start emotionally escalated, protective, and distrustful.
- Initially believe your child's version completely.
- If interrupted, become sharper and more upset.
- If the school leader demonstrates calm leadership (validation, clear process, concrete next steps), gradually stabilize.
- Sound like a real parent in a stressful moment: short bursts, occasional pauses, clarifying questions, emotional shifts.
- Stay psychologically realistic and grounded. Never become theatrical.
- Keep responses concise for spoken phone conversation (1-3 short paragraphs).
- Focus only on this incident and immediate parent concerns: safety, accountability, communication, and trust.

Conversation goal:
By the end, if handled well, you are still protective but more regulated and willing to continue with the school's next steps.`;

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
  });

  const pcRef = useRef(null);
  const micStreamRef = useRef(null);
  const audioElRef = useRef(null);
  const dcRef = useRef(null);

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
  };

  const beginCall = async () => {
    setCallStartedAt(Date.now());
    setTranscriptLines([]);
    setCallStatus('Connecting…');
    setEmotionalTemperature('Escalated');
    setStage('active');

    try {
      const tokenRes = await fetch('/api/human-equation/realtime-session', { method: 'POST' });
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

      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;
      dc.onopen = () => {
        setCallStatus('Live call connected');
        dc.send(
          JSON.stringify({
            type: 'session.update',
            session: {
              instructions: PARENT_SYSTEM_PROMPT,
              modalities: ['audio', 'text'],
              input_audio_transcription: { model: 'gpt-4o-mini-transcribe' },
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

        if (message.type === 'conversation.item.input_audio_transcription.completed') {
          setTranscriptLines((prev) => [...prev, { speaker: 'You', text: message.transcript || '' }]);
        }
        if (message.type === 'response.audio_transcript.done') {
          setTranscriptLines((prev) => [...prev, { speaker: 'Parent', text: message.transcript || '' }]);
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

  return <section className={styles.shell}><div className={styles.content}>{/* existing jsx shortened */}
{stage === 'intro' && <div className={styles.panel}><p className={styles.eyebrow}>The Human Equation</p><h1>Practice the conversations that determine trust.</h1><p className={styles.lead}>A voice-first leadership simulator for difficult parent and school conversations. Rehearse how you respond under pressure before the real call happens.</p><div className={styles.valueGrid}><article><h3>Stay calm under pressure</h3></article><article><h3>Practice real parent dynamics</h3></article><article><h3>Review your transcript and coaching report afterward</h3></article></div><button className={styles.cta} onClick={nextStage}>Set Up Simulation</button></div>}
{stage === 'setup' && <div className={styles.panel}><p className={styles.eyebrow}>Simulation Setup</p><h2>Configure your leadership call</h2><div className={styles.setupGrid}><Selector label="Role" options={setupOptions.roles} value={setup.role} onSelect={(value) => setField('role', value)} /><Selector label="Grade Band" options={setupOptions.gradeBands} value={setup.gradeBand} onSelect={(value) => setField('gradeBand', value)} /><Selector label="Call Type" options={setupOptions.callTypes} value={setup.callType} onSelect={(value) => setField('callType', value)} /><Selector label="Scenario Type" options={setupOptions.scenarioTypes} value={setup.scenarioType} onSelect={(value) => setField('scenarioType', value)} /><Selector label="Parent Intensity" options={setupOptions.intensities} value={setup.intensity} onSelect={(value) => setField('intensity', value)} /></div><div className={styles.briefingCard}><h3>Pre-Call Briefing</h3>{isUnexpectedCall ? <p>{briefings.limited}</p> : <><p><strong>Known facts</strong></p><ul>{briefings.full.knownFacts.map((item) => <li key={item}>{item}</li>)}</ul><p><strong>Teacher/staff report</strong></p><ul>{briefings.full.staffReport.map((item) => <li key={item}>{item}</li>)}</ul><p><strong>Student statements</strong></p><ul>{briefings.full.studentStatements.map((item) => <li key={item}>{item}</li>)}</ul><p><strong>What is still unclear</strong></p><ul>{briefings.full.unclear.map((item) => <li key={item}>{item}</li>)}</ul><p><strong>Leadership challenge:</strong> {briefings.full.leadershipChallenge}</p></>}</div><button className={styles.cta} onClick={nextStage}>Proceed to Incoming Call</button></div>}
{stage === 'incoming' && <div className={styles.panelCentered}><p className={styles.eyebrow}>Incoming Call</p><div className={styles.callOrb} /><h2>Parent Caller: Ms. Rodriguez (Grade 7)</h2><p className={styles.subtle}>Child reportedly punched during lunch transition • Middle School</p><button className={styles.cta} onClick={beginCall}>Answer and Begin</button></div>}
{stage === 'active' && <div className={styles.callLayout}><div className={styles.callHeader}><p className={styles.eyebrow}>Live Voice Simulation</p><div className={styles.timer}>{callDuration}</div></div><h2>Ms. Rodriguez — Parent Caller</h2><p className={styles.subtle}>Emotional temperature: <strong>{emotionalTemperature}</strong> • {callStatus}</p><div className={`${styles.waveform} ${isSpeaking ? styles.waveformActive : ''}`} aria-hidden /><label className={styles.notesLabel}>Private Notes (not shared)</label><textarea className={styles.notes} placeholder="Capture key facts, commitments, and follow-up actions..." value={privateNotes} onChange={(e) => setPrivateNotes(e.target.value)} /><button className={styles.endCall} onClick={endCall}>End Call</button></div>}
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
