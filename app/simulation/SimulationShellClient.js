'use client';

import { useEffect, useMemo, useState } from 'react';

const initialFolders = {
  red: ['Return urgent parent call'],
  orange: ['Prepare follow-up notes'],
  green: ['Review leadership reflection'],
};

const decisionToFolderItem = {
  'Respond immediately': { bucket: 'red', item: 'Draft careful parent response before leaving' },
  'Gather more information': { bucket: 'red', item: 'Gather facts from teacher and records today' },
  'Call the parent': { bucket: 'red', item: 'Call parent before leaving school' },
  'Speak with the teacher first': { bucket: 'red', item: 'Speak with teacher before responding' },
};

const postResponseFolderItems = {
  red: ['Speak with teacher immediately', 'Document parent concern'],
  orange: ['Follow up with parent within 48 hours', 'Review classroom reward practices'],
  green: ['Reflect on equity in recognition systems'],
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
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  const [isVicOpen, setIsVicOpen] = useState(false);

  const hasSelectedDecision = Boolean(selectedDecision);

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

  const addFolderItems = (itemsByBucket) => {
    setFolders((prev) => {
      const next = {
        red: [...prev.red],
        orange: [...prev.orange],
        green: [...prev.green],
      };

      Object.entries(itemsByBucket).forEach(([bucket, items]) => {
        items.forEach((item) => {
          if (!next[bucket].includes(item)) {
            next[bucket].push(item);
          }
        });
      });

      return next;
    });
  };

  const handleDecision = (decisionLabel) => {
    const mapping = decisionToFolderItem[decisionLabel];
    if (!mapping) return;

    setSelectedDecision(decisionLabel);
    addFolderItems({ [mapping.bucket]: [mapping.item] });
  };

  const handleSaveOrContinue = () => {
    addFolderItems(postResponseFolderItems);
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

          <div className={`scenario-content ${hasSelectedDecision ? 'decision-made' : 'pre-decision'}`}>
            {hasSelectedDecision ? (
              <div className="compact-scene-header">
                <p className="eyebrow">4:12 PM — The Email You Cannot Ignore</p>
              </div>
            ) : (
              <>
                <p className="eyebrow">4:12 PM</p>
                <h2>The Email You Cannot Ignore</h2>
              </>
            )}

            <div className={`cinematic-block ${hasSelectedDecision ? 'compact' : ''}`}>
              <p className="cinematic-opening">The building is quieter now, but your day is not over.</p>
              {!hasSelectedDecision ? (
                <>
                  <p className="cinematic-opening">You finally sit down at your desk and open your inbox.</p>
                  <p className="cinematic-opening">One message immediately stands out.</p>
                  <p className="cinematic-opening strong">It is emotional.</p>
                  <p className="cinematic-opening strong">It is angry.</p>
                  <p className="cinematic-opening strong">It is about a child who feels humiliated.</p>
                </>
              ) : null}
            </div>

            <article className="scenario-alert-card">
              <p><strong>Subject:</strong> Concern Regarding My Daughter</p>
              <p><strong>Tone Detected:</strong> Escalation Risk — High</p>
              <p><strong>Leadership Pressure:</strong> Parent trust, student dignity, staff accountability</p>
            </article>

            {!hasSelectedDecision ? (
              <article className="scenario-preview-card">
                <p>
                  A parent believes her daughter was publicly excluded from a class pizza party because
                  of academic performance. The child already receives reading support and now feels
                  embarrassed, ashamed, and less capable than her peers.
                </p>
                <p>
                  The parent is angry, questioning the school&apos;s judgment, and threatening to escalate
                  beyond the building level.
                </p>
              </article>
            ) : null}

            <h3 className="decision-prompt">Before reading the full email, what is your first leadership move?</h3>
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

            {!hasSelectedDecision ? (
              <div className="button-row decision-support-row">
                <button type="button" className="button secondary" onClick={() => setIsVicOpen(true)}>
                  Ask VIC for Guidance
                </button>
              </div>
            ) : null}

            {hasSelectedDecision ? (
              <div className="selected-decision-chip" role="status" aria-live="polite">
                <span className="selected-decision-label">Your first move:</span> {selectedDecision}
              </div>
            ) : null}

            {hasSelectedDecision ? (
              <button
                type="button"
                className="button secondary reveal-email-button"
                onClick={() => setIsEmailVisible((prev) => !prev)}
              >
                {isEmailVisible ? 'Hide Full Email' : 'Reveal Full Email'}
              </button>
            ) : null}

            {hasSelectedDecision && isEmailVisible ? (
              <article className="full-email-card">
                <p className="full-email-greeting">Dear Mr. Principal,</p>
                <p>
                  My daughter Sue was excluded from a class pizza party because of her performance on
                  a spelling pre-test. Sue already struggles with reading, attends remediation, and
                  has been working hard to improve.
                </p>
                <p>
                  This decision left her feeling embarrassed and ashamed. She cried at breakfast
                  saying, “Why can&apos;t I be smart like the other kids?” and “I hate being so stupid.”
                </p>
                <p>
                  This is unacceptable. It shows poor judgment, lack of compassion, and outdated
                  teaching practices.
                </p>
                <p>
                  I expect a response and a plan to ensure this does not happen again. I am prepared
                  to escalate this to the board if necessary.
                </p>
                <p className="full-email-signoff">Sincerely,</p>
                <p className="full-email-signoff">A concerned parent</p>
              </article>
            ) : null}

            {hasSelectedDecision ? (
              <>
                <label htmlFor="leadership-response" className="response-label">
                  Draft your response to this parent…
                </label>
                <textarea
                  id="leadership-response"
                  rows={6}
                  className="response-input"
                  placeholder="Capture your communication strategy, immediate next steps, and your follow-up timeline."
                />

                <div className="button-row">
                  <button type="button" className="button secondary" onClick={handleSaveOrContinue}>
                    Save Response
                  </button>
                  <button type="button" className="button secondary" onClick={() => setIsVicOpen(true)}>
                    Ask VIC for Guidance
                  </button>
                  <button type="button" className="button primary" onClick={handleSaveOrContinue}>
                    Continue
                  </button>
                </div>
              </>
            ) : null}
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

          <details className="card vic-panel" open={isVicOpen} onToggle={(event) => setIsVicOpen(event.currentTarget.open)}>
            <summary>VIC Leadership Guidance</summary>
            <p>
              This is a high-emotion, high-risk parent communication. Do not begin by defending the
              school.
            </p>
            <p className="vic-structure-title">Strong leadership response structure:</p>
            <ol className="vic-structure-list">
              <li>Acknowledge the parent&apos;s concern and the child&apos;s emotional experience.</li>
              <li>Avoid making promises or assigning blame before gathering facts.</li>
              <li>Explain that you will review what happened with the teacher and relevant staff.</li>
              <li>Commit to a clear follow-up timeline.</li>
              <li>Keep the tone calm, respectful, and student-centered.</li>
            </ol>
            <p className="vic-note">
              Leadership Insight: In moments like this, you are not only answering an email. You are
              protecting trust between the school and the family.
            </p>
          </details>
        </aside>
      </div>
    </div>
  );
}
