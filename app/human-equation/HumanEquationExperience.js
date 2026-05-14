'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './human-equation.module.css';
import { briefings, callerProfiles, report, setupOptions, transcript } from './data/mockScenario';

const stages = ['intro', 'setup', 'incoming', 'active', 'report'];

export default function HumanEquationExperience() {
  const [stage, setStage] = useState('intro');
  const [callStartedAt, setCallStartedAt] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [privateNotes, setPrivateNotes] = useState('');
  const [setup, setSetup] = useState({
    role: setupOptions.roles[1],
    gradeBand: setupOptions.gradeBands[1],
    callType: setupOptions.callTypes[0],
    scenarioType: setupOptions.scenarioTypes[0],
    intensity: setupOptions.intensities[1],
  });

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

  const nextStage = () => {
    const currentIndex = stages.indexOf(stage);
    setStage(stages[Math.min(currentIndex + 1, stages.length - 1)]);
  };

  const beginCall = () => {
    setCallStartedAt(Date.now());
    setStage('active');
  };

  const setField = (key, value) => setSetup((prev) => ({ ...prev, [key]: value }));
  const isUnexpectedCall = setup.callType === setupOptions.callTypes[0];

  return (
    <section className={styles.shell}>
      <div className={styles.content}>
        {stage === 'intro' && (
          <div className={styles.panel}>
            <p className={styles.eyebrow}>The Human Equation</p>
            <h1>Practice the conversations that determine trust.</h1>
            <p className={styles.lead}>
              A voice-first leadership simulator for difficult parent and school conversations. Rehearse how you
              respond under pressure before the real call happens.
            </p>
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
            <div className={styles.setupGrid}>
              <Selector label="Role" options={setupOptions.roles} value={setup.role} onSelect={(value) => setField('role', value)} />
              <Selector label="Grade Band" options={setupOptions.gradeBands} value={setup.gradeBand} onSelect={(value) => setField('gradeBand', value)} />
              <Selector label="Call Type" options={setupOptions.callTypes} value={setup.callType} onSelect={(value) => setField('callType', value)} />
              <Selector label="Scenario Type" options={setupOptions.scenarioTypes} value={setup.scenarioType} onSelect={(value) => setField('scenarioType', value)} />
              <Selector label="Parent Intensity" options={setupOptions.intensities} value={setup.intensity} onSelect={(value) => setField('intensity', value)} />
            </div>
            <div className={styles.briefingCard}>
              <h3>Pre-Call Briefing</h3>
              {isUnexpectedCall ? <p>{briefings.limited}</p> : <>
                <p><strong>Known facts</strong></p><ul>{briefings.full.knownFacts.map((item) => <li key={item}>{item}</li>)}</ul>
                <p><strong>Teacher/staff report</strong></p><ul>{briefings.full.staffReport.map((item) => <li key={item}>{item}</li>)}</ul>
                <p><strong>Student statements</strong></p><ul>{briefings.full.studentStatements.map((item) => <li key={item}>{item}</li>)}</ul>
                <p><strong>What is still unclear</strong></p><ul>{briefings.full.unclear.map((item) => <li key={item}>{item}</li>)}</ul>
                <p><strong>Leadership challenge:</strong> {briefings.full.leadershipChallenge}</p>
              </>}
            </div>
            <button className={styles.cta} onClick={nextStage}>Proceed to Incoming Call</button>
          </div>
        )}

        {stage === 'incoming' && (
          <div className={styles.panelCentered}>
            <p className={styles.eyebrow}>Incoming Call</p>
            <div className={styles.callOrb} />
            <h2>{callerProfiles[setup.intensity]}</h2>
            <p className={styles.subtle}>{setup.scenarioType} • {setup.gradeBand} • {setup.role}</p>
            <button className={styles.cta} onClick={beginCall}>Answer and Begin</button>
          </div>
        )}

        {stage === 'active' && (
          <div className={styles.callLayout}>
            <div className={styles.callHeader}><p className={styles.eyebrow}>Live Voice Simulation</p><div className={styles.timer}>{callDuration}</div></div>
            <h2>{callerProfiles[setup.intensity]}</h2>
            <p className={styles.subtle}>Emotional temperature: <strong>{setup.intensity}</strong></p>
            <div className={styles.waveform} aria-hidden />
            <label className={styles.notesLabel}>Private Notes (not shared)</label>
            <textarea className={styles.notes} placeholder="Capture key facts, commitments, and follow-up actions..." value={privateNotes} onChange={(e) => setPrivateNotes(e.target.value)} />
            <button className={styles.endCall} onClick={() => setStage('report')}>End Call</button>
          </div>
        )}

        {stage === 'report' && (
          <div className={styles.panel}>
            <p className={styles.eyebrow}>Post-Call Coaching Report</p>
            <h2>Transcript and Leadership Debrief</h2>
            <p className={styles.subtle}>Full transcript appears after the call ends.</p>
            <div className={styles.reportGrid}>
              <section><h3>Emotional pressure moments</h3><ul>{report.pressureMoments.map((m) => <li key={m}>{m}</li>)}</ul></section>
              <section><h3>Coaching highlights</h3><ul>{report.coachingHighlights.map((m) => <li key={m}>{m}</li>)}</ul></section>
              <section><h3>Leadership strengths</h3><ul>{report.leadershipStrengths.map((m) => <li key={m}>{m}</li>)}</ul></section>
              <section><h3>Growth areas</h3><ul>{report.growthAreas.map((m) => <li key={m}>{m}</li>)}</ul></section>
            </div>
            <section className={styles.transcriptBlock}><h3>Full transcript</h3>{transcript.map((line) => <article key={`${line.time}-${line.speaker}`} className={styles.lineItem}><div className={styles.lineMeta}><strong>{line.speaker}</strong><span>{line.tone}</span><time>{line.time}</time></div><p>{line.line}</p></article>)}</section>
            <p><strong>Next practice recommendation:</strong> {report.nextPracticeRecommendation}</p>
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
