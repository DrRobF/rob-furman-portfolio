'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './human-equation.module.css';
import { report, scenario, transcript } from './data/mockScenario';

const stages = ['intro', 'scenario', 'incoming', 'active', 'report'];

export default function HumanEquationExperience() {
  const [stage, setStage] = useState('intro');
  const [callStartedAt, setCallStartedAt] = useState(null);
  const [now, setNow] = useState(Date.now());

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

  return (
    <section className={styles.shell}>
      <div className={styles.backdrop} />
      <div className={styles.content}>
        {stage === 'intro' && (
          <div className={styles.panel}>
            <p className={styles.eyebrow}>The Human Equation</p>
            <h1>Practice difficult conversations before they happen.</h1>
            <p className={styles.lead}>
              A leadership simulation for educators and school leaders preparing for high-pressure parent
              conversations where emotion and accountability collide.
            </p>
            <button className={styles.cta} onClick={nextStage}>Begin Simulation</button>
          </div>
        )}

        {stage === 'scenario' && (
          <div className={styles.panel}>
            <p className={styles.eyebrow}>Scenario Selection</p>
            <div className={styles.scenarioCard}>
              <h2>{scenario.title}</h2>
              <p className={styles.subtle}>{scenario.subtitle}</p>
              <p>{scenario.description}</p>
              <ul>
                {scenario.context.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className={styles.metaRow}>
                <span>Pressure: {scenario.pressure}</span>
                <span>Mode: Phone call simulation</span>
              </div>
            </div>
            <button className={styles.cta} onClick={nextStage}>Proceed to Incoming Call</button>
          </div>
        )}

        {stage === 'incoming' && (
          <div className={styles.panelCentered}>
            <p className={styles.eyebrow}>Incoming Call</p>
            <div className={styles.callOrb} />
            <h2>Parent / Guardian Calling</h2>
            <p className={styles.subtle}>“I need answers about what happened to my child today.”</p>
            <button className={styles.cta} onClick={beginCall}>Answer and Begin</button>
          </div>
        )}

        {stage === 'active' && (
          <div className={styles.callLayout}>
            <div className={styles.callHeader}>
              <div>
                <p className={styles.eyebrow}>Live Simulation</p>
                <h2>{scenario.title}</h2>
              </div>
              <div className={styles.timer}>{callDuration}</div>
            </div>

            <div className={styles.transcript}>
              {transcript.map((line) => (
                <article key={`${line.time}-${line.speaker}`} className={styles.lineItem}>
                  <div className={styles.lineMeta}>
                    <strong>{line.speaker}</strong>
                    <span>{line.tone}</span>
                    <time>{line.time}</time>
                  </div>
                  <p>{line.line}</p>
                </article>
              ))}
            </div>

            <button className={styles.endCall} onClick={() => setStage('report')}>End Call</button>
          </div>
        )}

        {stage === 'report' && (
          <div className={styles.panel}>
            <p className={styles.eyebrow}>Post-Call Coaching Report</p>
            <h2>Debrief: {scenario.title}</h2>
            <div className={styles.reportGrid}>
              <section>
                <h3>Emotional Containment</h3>
                <p>{report.emotionalContainment}</p>
              </section>
              <section>
                <h3>De-escalation</h3>
                <p>{report.deEscalation}</p>
              </section>
              <section>
                <h3>Clarity</h3>
                <p>{report.clarity}</p>
              </section>
              <section>
                <h3>Next Steps</h3>
                <p>{report.nextSteps}</p>
              </section>
            </div>
            <button className={styles.cta} onClick={() => setStage('intro')}>Run Simulation Again</button>
          </div>
        )}
      </div>
    </section>
  );
}
