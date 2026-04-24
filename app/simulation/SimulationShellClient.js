'use client';

import { useEffect, useMemo, useState } from 'react';

const initialFolders = {
  red: ['Return urgent parent call'],
  orange: ['Prepare follow-up notes'],
  green: ['Review leadership reflection'],
};

const decisionToFolderItem = {
  'Check Voicemail': { bucket: 'red', item: 'Review urgent voicemail' },
  'Open Email': { bucket: 'orange', item: 'Triage unread parent/teacher emails' },
  'Review Mailbox': { bucket: 'green', item: 'Sort physical correspondence' },
};

const totalDecisionWindowSeconds = 120;

function formatTimer(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

export default function SimulationShellClient() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalDecisionWindowSeconds);
  const [folders, setFolders] = useState(initialFolders);
  const [selectedDecision, setSelectedDecision] = useState('');

  useEffect(() => {
    if (!started || timeLeft <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft]);

  const urgencyClass = useMemo(() => {
    if (timeLeft <= 30) return 'critical';
    if (timeLeft <= 60) return 'warning';
    return 'calm';
  }, [timeLeft]);

  const beginSimulation = () => {
    setStarted(true);
    setTimeLeft(totalDecisionWindowSeconds);
  };

  const handleDecision = (decisionLabel) => {
    const mapping = decisionToFolderItem[decisionLabel];
    if (!mapping) return;

    setSelectedDecision(decisionLabel);
    setFolders((prev) => {
      const existing = prev[mapping.bucket];
      if (existing.includes(mapping.item)) {
        return prev;
      }

      return {
        ...prev,
        [mapping.bucket]: [...existing, mapping.item],
      };
    });
  };

  return (
    <div className="simulation-product-shell">
      <div className="simulation-hero-card">
        <p className="eyebrow">Interactive Leadership Simulation</p>
        <h1>A Day in the Life of a School Leader</h1>
        <p className="lead">
          An interactive leadership simulation for future principals, aspiring administrators, and
          education leaders.
        </p>
        <p>
          Step into the rhythm of a real school day. Prioritize urgent issues, write thoughtful
          responses, and see how leadership decisions build across time.
        </p>
        <button className="button primary" onClick={beginSimulation}>
          Begin Simulation
        </button>
      </div>

      <div className="simulation-layout-grid">
        <div className="scenario-column card">
          <div className={`decision-window ${urgencyClass}`}>
            <p className="decision-label">Decision Window</p>
            <p className="decision-time">{formatTimer(timeLeft)}</p>
            <p className="decision-note">You are managing time-sensitive leadership priorities.</p>
          </div>

          <div className="scenario-content">
            <p className="eyebrow">7:30 AM</p>
            <h2>The Day Begins</h2>
            <p>
              The building is quiet for now. Your phone is blinking, your inbox is waiting, and a
              stack of papers is already on your desk. You have a few minutes before the day starts
              moving.
            </p>

            <div className="choices">
              {Object.keys(decisionToFolderItem).map((decision) => (
                <button
                  key={decision}
                  className={`choice ${selectedDecision === decision ? 'active' : ''}`}
                  onClick={() => handleDecision(decision)}
                >
                  {decision}
                </button>
              ))}
            </div>

            <label htmlFor="leadership-response" className="response-label">
              Draft your leadership response or action plan…
            </label>
            <textarea
              id="leadership-response"
              rows={6}
              className="response-input"
              placeholder="Capture your communication strategy, next steps, and who owns each follow-up."
            />

            <div className="button-row">
              <button type="button" className="button secondary">
                Save Response
              </button>
              <button type="button" className="button secondary">
                Ask VIC for Guidance
              </button>
              <button type="button" className="button primary">
                Continue
              </button>
            </div>
          </div>
        </div>

        <aside className="dashboard-column">
          <div className="card dashboard-card">
            <h3>Leadership Dashboard</h3>
            <p className="dashboard-intro">
              Dr. Furman&apos;s Green / Orange / Red prioritization system for daily leadership flow.
            </p>

            <div className="folder-list">
              <article className="folder-card folder-red">
                <h4>Red</h4>
                <p className="folder-subtitle">Must handle before leaving today</p>
                <ul>
                  {folders.red.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="folder-card folder-orange">
                <h4>Orange</h4>
                <p className="folder-subtitle">Handle within the next two days</p>
                <ul>
                  {folders.orange.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="folder-card folder-green">
                <h4>Green</h4>
                <p className="folder-subtitle">Handle within the week</p>
                <ul>
                  {folders.green.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>

          <details className="card vic-panel" open>
            <summary>VIC Leadership Guidance</summary>
            <p>
              VIC will eventually analyze your decisions, communication tone, urgency awareness, and
              next steps.
            </p>
            <p className="vic-note">AI coaching layer coming next.</p>
          </details>
        </aside>
      </div>
    </div>
  );
}
