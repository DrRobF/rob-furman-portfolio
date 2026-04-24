'use client';

import { useEffect, useMemo, useState } from 'react';

const initialFolders = {
  red: ['Return urgent parent call'],
  orange: ['Prepare follow-up notes'],
  green: ['Review leadership reflection'],
};

const decisionToFolderItem = {
  'Send an email response': {
    bucket: 'red',
    item: 'Respond to parent with care and clear timeline',
  },
  'Investigate the situation': { bucket: 'red', item: 'Gather facts from teacher and records today' },
  'Call the parent': {
    bucket: 'red',
    item: 'Prepare for parent contact with facts and boundaries',
  },
  'Address the teacher directly': {
    bucket: 'red',
    item: 'Speak with teacher after reviewing available context',
  },
};

const decisionConsequences = {
  'Send an email response': {
    title: 'Communication First',
    message:
      'You chose to respond before gathering full context. This can be strong if the message simply acknowledges receipt, shows concern, and sets a follow-up timeline. It becomes risky if you explain, defend, blame, or promise outcomes before investigating.',
    takeaway: 'A fast acknowledgment can calm escalation. A full response requires facts.',
  },
  'Investigate the situation': {
    title: 'Process First',
    message:
      'You chose to gather information before responding. This protects accuracy and keeps you from choosing sides too quickly. If the investigation will take more than a short time, send a quick acknowledgment so the parent knows the concern was received.',
    takeaway:
      'Good leaders do not ignore emotion, but they do not let emotion replace process.',
  },
  'Call the parent': {
    title: 'Direct Contact',
    message:
      'You chose live communication. A phone call can build trust, but it can also become time-consuming and emotionally difficult before you have the facts. In many cases, a short acknowledgment email followed by investigation creates better boundaries.',
    takeaway: 'Direct communication is powerful, but timing and preparation matter.',
  },
  'Address the teacher directly': {
    title: 'Internal Action',
    message:
      'You chose to act internally first. Speaking with the teacher may be necessary, but moving too quickly can feel accusatory if you have not reviewed the context. The goal is to gather facts, not assign blame.',
    takeaway: 'Support staff accountability without skipping due process.',
  },
};

const investigationFolderItem = 'Complete investigation before final parent response';

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
  const [firstDecision, setFirstDecision] = useState('');
  const [investigationDecision, setInvestigationDecision] = useState('');
  const [responseDraft, setResponseDraft] = useState('');
  const [hasCompletedFinalStep, setHasCompletedFinalStep] = useState(false);
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  const [isVicOpen, setIsVicOpen] = useState(false);

  const hasSelectedDecision = Boolean(firstDecision);
  const [scene, setScene] = useState('initial');
  const isInvestigationScene = scene === 'investigation';
  const selectedConsequence = hasSelectedDecision ? decisionConsequences[firstDecision] : null;

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
    setScene('initial');
    setFirstDecision('');
    setInvestigationDecision('');
    setResponseDraft('');
    setHasCompletedFinalStep(false);
    setIsEmailVisible(false);
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

    setFirstDecision(decisionLabel);
    addFolderItems({ [mapping.bucket]: [mapping.item] });
  };

  const handleContinueToInvestigation = () => {
    setScene('investigation');
    addFolderItems({ red: [investigationFolderItem] });
    scrollToTop();
  };

  const handleInvestigationContinue = () => {
    if (!investigationDecision || hasCompletedFinalStep) return;
    addFolderItems(postResponseFolderItems);
    setHasCompletedFinalStep(true);
    scrollToTop();
  };

  const showInitialParentResponse = firstDecision === 'Send an email response';
  const showParentResponse = Boolean(investigationDecision);

  const investigationGuidanceCopy = {
    'Discuss the situation with the teacher':
      'You chose to discuss the situation with the teacher before responding. This is appropriate if the goal is to review the classroom practice, support the teacher, and prevent future misunderstandings — not to assign blame.',
    'Respond to the parent':
      'You chose to respond after reviewing the available context. Your response should validate the parent’s concern, clarify the facts without blaming the child, and explain the next steps.',
  };

  const investigationOptions = ['Discuss the situation with the teacher', 'Respond to the parent'];

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
            {!isInvestigationScene ? (
              <>
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

                {!hasSelectedDecision ? (
                  <>
                    <h3 className="decision-prompt">
                      After reviewing the parent&apos;s concern, what is your first leadership move?
                    </h3>
                    <div className="choices">
                      {Object.keys(decisionToFolderItem).map((decision) => (
                        <button
                          key={decision}
                          className={`choice ${firstDecision === decision ? 'active' : ''}`}
                          onClick={() => handleDecision(decision)}
                        >
                          {decision}
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}

                {!hasSelectedDecision ? (
                  <div className="button-row decision-support-row">
                    <button type="button" className="button secondary" onClick={() => setIsVicOpen(true)}>
                      Ask VIC for Guidance
                    </button>
                  </div>
                ) : null}

                {hasSelectedDecision ? (
                  <>
                    <div className="selected-decision-chip" role="status" aria-live="polite">
                      <span className="selected-decision-label">Your first move:</span> {firstDecision}
                    </div>

                    {selectedConsequence ? (
                      <article className="decision-consequence-card" aria-live="polite">
                        <p className="decision-consequence-kicker">Leadership Coaching Lens</p>
                        <p className="decision-consequence-subhead">
                          <span className="decision-consequence-marker" aria-hidden="true">
                            ●
                          </span>
                          Direct coaching based on your first move.
                        </p>
                        <h4>{selectedConsequence.title}</h4>
                        <p>{selectedConsequence.message}</p>
                        <p className="decision-consequence-takeaway">
                          <strong>Leadership takeaway:</strong> {selectedConsequence.takeaway}
                        </p>
                        <p className="decision-consequence-vic-note">
                          VIC guidance will build on this coaching layer by analyzing tone, urgency, and next
                          steps.
                        </p>
                      </article>
                    ) : null}
                  </>
                ) : null}

                {showInitialParentResponse && !isInvestigationScene ? (
                  <>
                    <label htmlFor="leadership-initial-response" className="response-label">
                      Draft your response to this parent…
                    </label>
                    <textarea
                      id="leadership-initial-response"
                      rows={6}
                      className="response-input"
                      placeholder="Capture your acknowledgment, immediate next steps, and follow-up timeline."
                      value={responseDraft}
                      onChange={(event) => setResponseDraft(event.target.value)}
                    />
                  </>
                ) : null}
              </>
            ) : (
              <>
                <div className="compact-scene-header">
                  <p className="eyebrow">4:28 PM</p>
                </div>
                <h2>Gathering the Other Side of the Story</h2>
                <article className="investigation-intro-card">
                  <p>
                    Before giving a full response, you gather context from the teacher and review what happened.
                    The situation is more layered than the parent&apos;s email suggested.
                  </p>
                </article>
                <div className="investigation-evidence-grid">
                  <article className="investigation-card">
                    <h3>Reward Structure</h3>
                    <p>
                      The activity was participation-based, not accuracy-based. Students who attempted the
                      challenge were included in the reward.
                    </p>
                  </article>
                  <article className="investigation-card">
                    <h3>Student Context</h3>
                    <p>
                      Sue was given the opportunity to participate but did not attempt the activity. According to
                      the teacher, she would have been included if she had tried.
                    </p>
                  </article>
                  <article className="investigation-card">
                    <h3>Parent Perspective</h3>
                    <p>
                      The parent&apos;s concern appears to be based on a limited understanding of what occurred
                      during the activity.
                    </p>
                  </article>
                  <article className="investigation-card">
                    <h3>Leadership Consideration</h3>
                    <p>
                      While the structure was designed around participation, the outcome still felt exclusionary
                      to the student, which contributed to the parent&apos;s concern.
                    </p>
                  </article>
                </div>

                <h3 className="decision-prompt">How do you want to proceed?</h3>
                <div className="choices">
                  {investigationOptions.map((option) => (
                    <button
                      key={option}
                      className={`choice ${investigationDecision === option ? 'active' : ''}`}
                      onClick={() => {
                        setInvestigationDecision(option);
                        scrollToTop();
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {investigationDecision ? (
                  <article className="decision-next-step-panel" aria-live="polite">
                    <p className="decision-next-step-kicker">Decision Impact</p>
                    <p>{investigationGuidanceCopy[investigationDecision]}</p>
                  </article>
                ) : null}

                {showParentResponse ? (
                  <>
                    <label htmlFor="leadership-response" className="response-label">
                      Draft your full response to the parent…
                    </label>
                    <textarea
                      id="leadership-response"
                      rows={6}
                      className="response-input"
                      placeholder="Capture your communication strategy, immediate next steps, and your follow-up timeline."
                      value={responseDraft}
                      onChange={(event) => setResponseDraft(event.target.value)}
                    />
                  </>
                ) : null}

                {hasCompletedFinalStep ? (
                  <article className="decision-next-step-panel" aria-live="polite">
                    <p className="decision-next-step-kicker">Next Step</p>
                    <p>Final review placeholder saved. You can proceed to the next simulation module when ready.</p>
                  </article>
                ) : null}
              </>
            )}

            {!isInvestigationScene ? (
              <button
                type="button"
                className="button secondary reveal-email-button"
                onClick={() => setIsEmailVisible((prev) => !prev)}
              >
                {isEmailVisible ? 'Hide Full Email' : 'Reveal Full Email'}
              </button>
            ) : null}

            {isEmailVisible && !isInvestigationScene ? (
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
                <div className="button-row">
                  <button type="button" className="button secondary" onClick={() => setIsVicOpen(true)}>
                    Ask VIC for Guidance
                  </button>
                  <button
                    type="button"
                    className="button primary"
                    onClick={isInvestigationScene ? handleInvestigationContinue : handleContinueToInvestigation}
                  >
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
