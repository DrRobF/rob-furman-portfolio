'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import HumanEquationNav from '../../components/HumanEquationNav';
import { dimensionDefinitions, factorPsychologyDefinitions } from './profileData';
import { EVIDENCE_EVENTS_STORAGE_KEY, LEADERSHIP_EVIDENCE_UPDATED_AT_KEY, calculateFactorProfile, getEvidenceTimeline, getNextRecommendedSimulation, resetLeadershipProfile } from './evidenceModel';

const title = (sourceType) => ({ diagnostic: 'Diagnostic', urban_sim: 'Urban Sim', parent_call: 'Parent Call', leadership_sim: 'Leadership Sim', observation_lab: 'Observation', course_reflection: 'Reflection', written_artifact: 'Written Artifact', artifact: 'Artifact' }[sourceType] || sourceType);

const stepDefinitions = [
  { key: 'learn', label: 'Learn the 8 Factors', description: 'Build a shared language for leadership psychology.' },
  { key: 'diagnostic', label: 'Leadership Diagnostic', description: 'Establish self-report baseline and early profile signal.' },
  { key: 'practice', label: 'Practice Lab', description: 'Add behavioral evidence through simulations.' },
  { key: 'growth', label: 'Growth Center', description: 'Translate patterns into recovery and growth moves.' },
];

const reportTabs = [
  { key: 'distortions', label: 'Pressure Distortions' },
  { key: 'recovery', label: 'Recovery Practices' },
  { key: 'timeline', label: 'Evidence Timeline' },
  { key: 'executive', label: 'Executive Reports' },
];

const confidenceLabel = (eventCount) => (eventCount === 0 ? 'No evidence yet' : eventCount === 1 ? 'Baseline signal' : eventCount === 2 ? 'Early profile' : eventCount <= 4 ? 'Developing pattern' : 'Supported pattern');
const trendArrow = (factor) => factor.riskMarkers > factor.positiveMarkers ? '↓' : factor.positiveMarkers > factor.riskMarkers ? '↑' : '→';
const simulationStages = ['NOT STARTED','IN PROGRESS','EVIDENCE CAPTURED','HIGH CONFIDENCE','DRIFT DETECTED','RECOVERY IMPROVING'];
const directUrbanFactors = new Set(['humanAwareness', 'regulationUnderPressure', 'realityAnchoring', 'trustConstruction', 'grayAreaLeadership']);
const factorCoachingCopy = {
  regulationUnderPressure: { see: 'You appear able to stay outwardly steady, but pressure may still speed up interpretation underneath.', drift: 'Looking calm while deciding too quickly.', move: 'Slow the moment before you name the problem.' },
  humanAwareness: { see: 'You are paying attention to the person behind the behavior, not just the behavior itself.', drift: 'Turning a human situation into a task too quickly.', move: 'Ask what the person may be protecting before deciding what they need.' },
  trustConstruction: { see: 'You tend to preserve dignity, but trust will depend on how clearly you name next steps.', drift: 'Soothing before clarifying.', move: 'Say what is known, what is not known, and what happens next.' },
  realityAnchoring: { see: 'You are beginning to separate story from evidence.', drift: 'Mistaking urgency for clarity.', move: 'Name what is known, unknown, and still needs checking.' },
  grayAreaLeadership: { see: 'You can sit with complexity without immediately forcing a clean answer.', drift: 'Waiting too long for certainty.', move: 'Name the competing truths and choose the least harmful next step.' },
  teamSystemsLeadership: { see: 'Mostly baseline evidence so far; future leadership simulations will sharpen how you organize adults, roles, and follow-through.', drift: 'Solving the moment without fixing the pattern.', move: 'Ask what system allowed the problem to repeat.' },
  instructionalAcademicLeadership: { see: 'Mostly baseline evidence so far. The profile needs more live evidence about how you protect learning when the day gets noisy.', drift: 'Letting the crisis fully displace the learning purpose.', move: 'Reconnect the response to what students and teachers need next.' },
  visionChangeLeadership: { see: 'Mostly baseline evidence so far. We need more evidence about how you keep direction visible during uncertainty.', drift: 'Managing the present so tightly that the future disappears.', move: 'Name the destination and the next visible step.' },
};

export default function HumanEquationDashboardPage() {
  const [events, setEvents] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [showMatrixModal, setShowMatrixModal] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const refreshEvents = () => {
      const parsed = JSON.parse(window.localStorage.getItem(EVIDENCE_EVENTS_STORAGE_KEY) || '[]');
      setEvents(parsed);
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[Dashboard] evidence events found:', parsed.length);
        console.debug('[Dashboard] source types found:', [...new Set(parsed.map((e) => e.sourceType))]);
      }
    };
    refreshEvents();
    const onStorage = (event) => {
      if (event.key === EVIDENCE_EVENTS_STORAGE_KEY || event.key === LEADERSHIP_EVIDENCE_UPDATED_AT_KEY) refreshEvents();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);


  const factorProfiles = useMemo(() => Object.fromEntries(dimensionDefinitions.map((d) => [d.key, calculateFactorProfile(events, d.key)])), [events]);
  const timeline = useMemo(() => getEvidenceTimeline(events), [events]);

  const scoredFactors = useMemo(() => [...dimensionDefinitions].map((d) => ({ ...d, ...factorProfiles[d.key] })), [factorProfiles]);
  const strongest = scoredFactors.filter((x) => x.score).sort((a, b) => b.score - a.score)[0];
  const activeDistortion = scoredFactors.filter((x) => x.riskMarkers > x.positiveMarkers).sort((a, b) => (b.riskMarkers - b.positiveMarkers) - (a.riskMarkers - a.positiveMarkers))[0];
  const growthTension = scoredFactors.filter((x) => x.totalEvidenceEvents > 0).sort((a, b) => a.totalEvidenceEvents - b.totalEvidenceEvents)[0];
  const recommendedRecovery = scoredFactors.filter((x) => x.riskMarkers > 0).sort((a, b) => b.riskMarkers - a.riskMarkers)[0];
  const weakest = scoredFactors.filter((x) => x.score).sort((a,b)=>a.score-b.score)[0];
  const confidence = confidenceLabel(events.length);
  const profileStatus = confidence === 'Early profile' ? 'Early profile — useful, but still forming.' : confidence;
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    console.debug('[Dashboard] factor profiles computed:', scoredFactors.map((f) => ({ key: f.key, score: f.score, evidence: f.totalEvidenceEvents })));
  }, [scoredFactors]);


  const radarPoints = useMemo(() => {
    const center = 70;
    const radius = 56;
    const factors = scoredFactors.slice(0, 8);
    return factors.map((f, i) => {
      const angle = (Math.PI * 2 * i) / factors.length - Math.PI / 2;
      const value = ((f.score || 2.2) / 5) * radius;
      return `${(center + Math.cos(angle) * value).toFixed(1)},${(center + Math.sin(angle) * value).toFixed(1)}`;
    }).join(' ');
  }, [scoredFactors]);

  const coachingLens = (factor) => ({
    pressure: `When pressure climbs, ${factor.label.toLowerCase()} can become over-optimized for speed, causing decisions to outrun shared meaning.`,
    others: `Others may experience your leadership as steady, but still feel partially outside your internal reasoning path.`,
    distortion: `Internal distortion risk: urgency can feel like certainty, even when evidence is still mixed.`,
    interrupt: 'Interruption strategy: pause 45 seconds and separate facts, interpretations, and assumptions out loud.',
    repair: 'Relational repair: re-open the loop with “Here is what I decided, what I may have missed, and what I need from you next.”',
    simulation: `Next simulation: ${getNextRecommendedSimulation(events)} to stress-test pacing, clarity, and trust under load.`
  });

  const renderReportPanel = () => {
    if (activeReport === 'timeline') {
      return <article className="card hes-report-card hes-active-report"><h2>Leadership Pattern Evolution</h2><p>May 21 — Diagnostic baseline established.</p><p>May 22 — Urban simulation added emotional-load evidence.</p><p>Future — Parent Call evidence pending.</p>{timeline.length === 0 ? <p>No evidence captured yet. Complete the diagnostic or a simulation to begin building your profile.</p> : <div className="hes-timeline">{timeline.map((event) => <article key={event.id}><div className="node">•</div><h4>{event.sourceLabel}</h4><p>{new Date(event.timestamp).toLocaleString('en-US')} · {event.evidenceType === 'diagnostic_self_report' ? 'Self-report baseline' : 'Behavioral evidence'}</p><p><strong>Factors touched:</strong> {event.factorImpacts.map((x) => x.factorId).join(', ')}</p><p><strong>What it added:</strong> {event.sourceType === 'urban_sim' ? 'Added behavioral evidence around human awareness, regulation, trust, reality anchoring, and gray-area judgment.' : event.sourceType === 'diagnostic' ? 'Created baseline self-perception across all eight factors.' : event.summary}</p></article>)}</div>}</article>;
    }
    if (activeReport === 'recovery') {
      return <article className="card hes-report-card hes-active-report"><h2>Recovery Practices</h2><div className="hes-ladder"><p><strong>Best next move:</strong> Keep slowing the moment before deciding what it means.</p><p><strong>In the moment:</strong> Name what is known, what is not known, and what can wait.</p><p><strong>After the moment:</strong> Close the loop with one clear next step.</p><p><strong>What to practice in the next sim:</strong> {getNextRecommendedSimulation(events)}</p></div></article>;
    }
    if (activeReport === 'executive') {
      return <article className="card hes-report-card hes-active-report"><h2>Executive Briefing Document</h2><div className="hes-exec-grid"><article><h4>1. Current Leadership Signal</h4><p>Strongest pattern: {strongest ? strongest.label : 'Forming'}<br/>Pressure tendency: {activeDistortion ? activeDistortion.label : 'Interpretation narrowing'}<br/>Evidence maturity: {confidence}<br/>Dominant drift: pace outrunning shared meaning.</p></article><article><h4>2. What Others Likely Experience</h4><p>Staff: safe climate, variable strategic clarity.<br/>Parents: warmth, but occasional decisional ambiguity.<br/>Teams: relational trust with delayed alignment.<br/>Crisis context: calm tone with hidden urgency load.</p></article><article><h4>3. Risk Under Escalation</h4><p>Potential narrowing interpretation, premature certainty, over-accommodation, weakened systems language, and pacing mismatch between decision and explanation.</p></article><article><h4>4. Recovery Strategy</h4><p>Pause pattern: 45-second evidence separation.<br/>Language: “Known / Unknown / Next.”<br/>Evidence check: name one disconfirming data point.<br/>Relational repair: close loop within same day.<br/>Pacing intervention: slow meaning assignment, not decision ownership.</p></article><article><h4>5. Best Next Simulation</h4><p>{getNextRecommendedSimulation(events)} is recommended because evidence suggests relational pacing weakens faster than interpretation during urgency spikes.</p></article></div></article>;
    }
    const driftFactor = activeDistortion || scoredFactors.find((f) => f.totalEvidenceEvents > 0);
    const copy = driftFactor ? factorCoachingCopy[driftFactor.key] : null;
    const lens = coachingLens(driftFactor || scoredFactors[0]);
    return <article className="card hes-report-card hes-active-report"><h2>Pressure Distortions</h2><div className="hes-ladder"><p>{lens.pressure}</p><p>{lens.others}</p><p>{lens.distortion}</p><p>{lens.interrupt}</p><p>{lens.repair}</p><p>{lens.simulation}</p></div></article>;
  };

  return <section className="section section-light"><div className="container"><HumanEquationNav />
    <div className="hes-app-layout top-space-sm"><aside className="hes-command-sidebar"><h3>Progression Flow</h3>
      <div className="hes-stepper">{stepDefinitions.map((step, index) => {
        const isDone = index < 2 || (index === 2 && events.length >= 2);
        const isCurrent = index === 3;
        return <article key={step.key} className={`hes-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}><div className="node">{isDone ? '✓' : index + 1}</div><div><header><h4>{step.label}</h4><span className={`badge ${isDone ? 'badge-green' : isCurrent ? 'badge-blue' : 'badge-gray'}`}>{isDone ? 'Complete' : isCurrent ? 'Active' : 'Upcoming'}</span></header><p>{step.description}</p></div></article>;
      })}</div>
      <div><h3>Growth Center</h3><div className="hes-report-selector">{reportTabs.map((tab) => <button key={tab.key} className={`button ${activeReport === tab.key ? 'primary' : 'secondary'}`} onClick={() => setActiveReport(tab.key)} aria-pressed={activeReport === tab.key}>{tab.label}</button>)}</div></div>
      <button className="button secondary" onClick={() => {
        if (!window.confirm('Start fresh clears your leadership evidence profile so you can rebuild it from new diagnostic and simulation data. Continue?')) return;
        resetLeadershipProfile();
        setEvents([]);
      }}>Start Fresh Profile</button>
      <p><strong>Next recommended simulation:</strong> {getNextRecommendedSimulation(events)}</p>
    </aside>
    <main className="hes-main-content">
      <article className="card hes-hero-profile"><div className="hes-hero-shell"><div className="hes-hero-left"><p className="eyebrow">Executive Leadership Intelligence</p><h1>Your pattern is not just what you do — it is what others feel while you do it.</h1><p>This dashboard tracks how pressure changes interpretation, pacing, trust language, and recovery behavior across real evidence moments.</p><p className="hes-confidence-meta">Evidence maturity: {profileStatus}</p></div><div className="hes-hero-right"><div className="hes-mini-radar"><svg viewBox="0 0 140 140" aria-label="Leadership radar"><circle cx="70" cy="70" r="56" /><circle cx="70" cy="70" r="42" /><circle cx="70" cy="70" r="28" /><circle cx="70" cy="70" r="14" /><polygon points={radarPoints} /></svg><small>8-factor signal map</small></div><div className="hes-hero-metrics"><p><strong>Strongest:</strong> {strongest ? strongest.label : 'Emerging signal'}</p><p><strong>Fragile:</strong> {weakest ? weakest.label : 'Pending evidence'}</p><p><strong>Drift alert:</strong> {activeDistortion ? activeDistortion.label : 'Urgency narrowing'}</p><p><strong>Evidence maturity:</strong> {confidence}</p></div></div></div></article>
      <section className="hes-snapshot-shell"><h2>Leadership Signal Snapshot</h2><div className="hes-insights-row">
        <article className="hes-insight-card stabilizer"><h3>Strongest Capacity</h3><h4>{strongest ? strongest.label : 'Emerging signal'}</h4><p>Reads emotional context before reacting.</p></article>
        <article className="hes-insight-card distortion"><h3>Most Fragile Capacity</h3><h4>{weakest ? weakest.label : 'Pending evidence'}</h4><p>Urgency may outpace collaborative explanation.</p></article>
        <article className="hes-insight-card tension"><h3>Current Pressure Drift</h3><h4>{activeDistortion ? activeDistortion.label : 'Urgency narrowing'}</h4><p>Decision speed may compress interpretation range.</p></article>
        <article className="hes-insight-card recovery"><h3>Recommended Recovery Move</h3><h4>{recommendedRecovery ? `Slow ${recommendedRecovery.label}` : 'Slow interpretation'}</h4><p>Pause before assigning meaning.</p></article>
      </div><button className="button secondary" onClick={() => setShowMatrixModal(true)}>View Full Factor Matrix</button></section>

      

      <article className="card"><h2>The 8 Factors</h2><div className="hes-factor-grid compact">{dimensionDefinitions.map(({ key, label }) => {
        const p = factorProfiles[key];
        const factor = factorPsychologyDefinitions[key];
        const sourceLabel = p.sourceTypes.length ? p.sourceTypes.map((s) => s === 'diagnostic' ? 'Self-report baseline' : title(s)).join(' · ') : 'None yet';
        return <article key={key} className="hes-factor-panel compact"><h3>{label}</h3>
          <div className="hes-factor-topline"><span className="hes-score-pill">{p.score ? p.score.toFixed(2) : '—'} / 5</span><span className="badge badge-blue">{p.maturityLevel}</span>{p.riskMarkers > p.positiveMarkers ? <span className="badge badge-amber">Drift risk</span> : <span className="badge badge-green">Stable</span>}</div>
          <div className="hes-meter-block"><label>Current score</label><div className="hes-score-bar"><span style={{ width: `${((p.score || 0) / 5) * 100}%` }} /></div></div>
          
          <div className="hes-factor-header"><span className="badge badge-gray">{p.totalEvidenceEvents} items</span><span className="badge badge-blue">{trendArrow(p)} trend</span></div><p className="hes-factor-signal">{p.totalEvidenceEvents === 0 ? 'No evidence yet.' : factorCoachingCopy[key].see}</p><div className="hes-factor-bottom"><span className="badge badge-amber">Drift: {p.totalEvidenceEvents === 0 ? 'Pending' : factorCoachingCopy[key].drift}</span><span className="badge badge-green">Recovery: {p.totalEvidenceEvents === 0 ? 'Run Diagnostic + Urban Sim' : factorCoachingCopy[key].move}</span></div>
          <div className="hes-mini-bars"><div><small>Baseline evidence</small><div className="hes-score-bar"><span style={{ width: `${p.sourceTypes.includes('diagnostic') ? 100 : 0}%` }} /></div></div><div><small>Simulation evidence</small><div className="hes-score-bar"><span style={{ width: `${Math.min(100, p.totalEvidenceEvents * 22)}%` }} /></div></div><div><small>Blended score</small><div className="hes-confidence-bar"><span style={{ width: `${((p.score || 0) / 5) * 100}%` }} /></div></div></div>
          <details><summary>View deeper analysis</summary><p>{factor.shortDefinition}</p><p>Signal quality: {confidenceLabel(p.totalEvidenceEvents)} · Last updated: {p.latestUpdatedAt ? new Date(p.latestUpdatedAt).toLocaleString('en-US') : 'Not yet'}</p><p><strong>Current read:</strong> {p.currentRead}</p></details>
        </article>;
      })}</div></article>




      {showMatrixModal ? <div className="hes-modal-backdrop" role="dialog" aria-modal="true" aria-label="Full Factor Matrix" onClick={() => setShowMatrixModal(false)}><article className="card hes-modal-panel" onClick={(e) => e.stopPropagation()}><div className="hes-modal-header"><h3>Full Factor Matrix</h3><button className="button secondary" onClick={() => setShowMatrixModal(false)}>Close</button></div><div className="hes-modal-content"><div className="hes-matrix-legend"><span>🔵 Baseline</span><span>🟢 Simulation</span><span>⚪ Composite</span></div><div className="hes-factor-matrix">
      {scoredFactors.map((factor) => {const score=factor.score ?? 0;const baseline=factor.sourceTypes.includes('diagnostic')?Math.min(100,Math.max(20,score/5*100)):0;const simulation=Math.min(100,factor.totalEvidenceEvents*20);const arrow=trendArrow(factor);return <div key={`matrix-${factor.key}`} className="hes-matrix-row"><div className="hes-matrix-label"><span>{factor.label}</span><small>Composite: {factor.score ? factor.score.toFixed(1) : '—'} / 5 {arrow}</small></div><div className="hes-matrix-bars"><div className="hes-score-bar baseline"><span style={{ width: `${baseline}%` }} /></div><div className="hes-score-bar simulation"><span style={{ width: `${simulation}%` }} /></div><div className="hes-score-bar composite"><span style={{ width: `${(score/5)*100}%` }} /></div></div><div className="hes-matrix-values"><strong>{factor.score ? factor.score.toFixed(2) : '—'}</strong><small>{arrow}</small></div></div>;})}
      </div></div></article></div> : null}

      {activeReport ? <div className="hes-modal-backdrop" role="dialog" aria-modal="true" aria-label="Growth Center panel" onClick={() => setActiveReport(null)}><article className="card hes-modal-panel" onClick={(e) => e.stopPropagation()}><div className="hes-modal-header"><h3>{reportTabs.find((tab) => tab.key === activeReport)?.label}</h3><button className="button secondary" onClick={() => setActiveReport(null)}>Close</button></div><div className="hes-modal-content">{renderReportPanel()}</div></article></div> : null}

      <article className="card hes-relational-layer"><h2>How this may feel to others</h2><div className="hes-report-grid"><p>Staff may feel emotionally safe but strategically unclear when urgency compresses explanation.</p><p>Parents may experience warmth without full decisional certainty unless next steps are named explicitly.</p><p>Teams may wait for clarity longer than intended when your internal model advances faster than shared language.</p><p>In crisis, others may experience steadiness externally while urgency rises internally.</p></div></article><article className="card hes-sim-progression"><h2>Simulation Intelligence Progression</h2><div className="hes-flow">{simulationStages.map((stage, idx) => <span key={stage} className={`badge ${idx <= Math.min(5, events.length) ? 'badge-blue' : 'badge-gray'}`}>{stage}</span>)}</div><p>Current recommendation: <strong>{getNextRecommendedSimulation(events)}</strong>.</p></article><article className="card"><h2>Framework Course</h2><Link className="button secondary" href="/human-equation-suite/learn">Preview Placeholder</Link></article>
    </main></div></div></section>;
}
