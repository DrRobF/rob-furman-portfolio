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
  const confidence = confidenceLabel(events.length);
  const profileStatus = confidence === 'Early profile' ? 'Early profile — useful, but still forming.' : confidence;
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    console.debug('[Dashboard] factor profiles computed:', scoredFactors.map((f) => ({ key: f.key, score: f.score, evidence: f.totalEvidenceEvents })));
  }, [scoredFactors]);

  const renderReportPanel = () => {
    if (activeReport === 'timeline') {
      return <article className="card hes-report-card hes-active-report"><h2>Evidence Timeline</h2>{timeline.length === 0 ? <p>No evidence captured yet. Complete the diagnostic or a simulation to begin building your profile.</p> : <div className="hes-timeline">{timeline.map((event) => <article key={event.id}><div className="node">•</div><h4>{event.sourceLabel}</h4><p>{new Date(event.timestamp).toLocaleString('en-US')} · {event.evidenceType === 'diagnostic_self_report' ? 'Self-report baseline' : 'Behavioral evidence'}</p><p><strong>Factors touched:</strong> {event.factorImpacts.map((x) => x.factorId).join(', ')}</p><p><strong>What it added:</strong> {event.sourceType === 'urban_sim' ? 'Added behavioral evidence around human awareness, regulation, trust, reality anchoring, and gray-area judgment.' : event.sourceType === 'diagnostic' ? 'Created baseline self-perception across all eight factors.' : event.summary}</p></article>)}</div>}</article>;
    }
    if (activeReport === 'recovery') {
      return <article className="card hes-report-card hes-active-report"><h2>Recovery Practices</h2><div className="hes-ladder"><p><strong>Best next move:</strong> Keep slowing the moment before deciding what it means.</p><p><strong>In the moment:</strong> Name what is known, what is not known, and what can wait.</p><p><strong>After the moment:</strong> Close the loop with one clear next step.</p><p><strong>What to practice in the next sim:</strong> {getNextRecommendedSimulation(events)}</p></div></article>;
    }
    if (activeReport === 'executive') {
      return <article className="card hes-report-card hes-active-report"><h2>Executive Pressure Report</h2><div className="hes-exec-grid"><article><h4>Profile status</h4><p>{profileStatus}</p></article><article><h4>Evidence used</h4><p>Self-report baseline: Leadership Diagnostic<br />Behavioral evidence: Urban Student Simulation</p></article><article><h4>What this already suggests</h4><p>Your early profile suggests a leader who notices human context and can stay steady in emotionally loaded moments. The strongest early signal is {strongest ? strongest.label : 'still forming'}, and the next best evidence target is how you organize adults, systems, and follow-through under pressure.</p></article><article><h4>Pressure drift to watch</h4><p>No major drift has repeated yet, but the current profile should watch for solving too quickly once urgency rises.</p></article></div></article>;
    }
    const driftFactor = activeDistortion || scoredFactors.find((f) => f.totalEvidenceEvents > 0);
    const copy = driftFactor ? factorCoachingCopy[driftFactor.key] : null;
    return <article className="card hes-report-card hes-active-report"><h2>Pressure Distortions</h2><div className="hes-ladder"><p><strong>Current early read:</strong> This is not a fixed pattern yet. It is the drift most worth watching next.</p><p><strong>Likely drift to watch:</strong> {copy?.drift || 'Solving too quickly once urgency rises.'}</p><p><strong>What could trigger it:</strong> High urgency, emotional ambiguity, and incomplete information.</p><p><strong>How to interrupt it:</strong> {copy?.move || 'Pause, name knowns/unknowns, then decide.'}</p><p><strong>Factors most connected:</strong> {driftFactor?.label || 'Regulation Under Pressure'} + Reality Anchoring + Trust Construction.</p></div></article>;
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
      <article className="card hes-hero-profile"><div className="hes-hero-shell"><div><p className="eyebrow">Executive Pressure Profile</p><h1>This is how your leadership psychology behaves under pressure.</h1><p>Leadership style explains how you prefer to lead. Leadership psychology shows what pressure does to perception, regulation, trust, and judgment.</p><p><strong>Current profile confidence: {confidence}.</strong></p><p>Factor matrix reflects current evidence-weighted factor scores and confidence.</p></div>
      <div className="hes-factor-matrix" role="img" aria-label="Leadership factor matrix with scores">
        <h3>Factor Bar Matrix</h3>
        {scoredFactors.map((factor) => {
          const score = factor.score ?? 0;
          const confidencePct = Math.round((factor.averageConfidence || 0) * 100);
          const sourceLabel = factor.sourceTypes.length ? factor.sourceTypes.map((s) => s === 'diagnostic' ? 'Baseline' : title(s)).join(' · ') : 'No evidence';
          return <div key={`matrix-${factor.key}`} className="hes-matrix-row"><div className="hes-matrix-label"><span>{factor.label}</span><small>{sourceLabel}</small></div><div className="hes-matrix-bars"><div className="hes-score-bar"><span style={{ width: `${(score / 5) * 100}%` }} /></div><div className="hes-confidence-bar"><span style={{ width: `${confidencePct}%` }} /></div></div><div className="hes-matrix-values"><strong>{factor.score ? factor.score.toFixed(2) : '—'}</strong><small>{confidencePct}%</small></div></div>;
        })}
        <p className="hes-matrix-scale">Scale: score 0–5 (top bar), confidence 0–100% (bottom bar)</p>
      </div></div></article>

      <div className="hes-insights-row">
        <article className="hes-insight-card stabilizer"><h3>Current Leadership Pattern</h3><p>{strongest ? strongest.label : 'Early read — more evidence needed.'}</p></article>
        <article className="hes-insight-card distortion"><h3>Pressure Drift</h3><p>{activeDistortion ? activeDistortion.label : 'No dominant pattern yet.'}</p></article>
        <article className="hes-insight-card tension"><h3>Growth Focus</h3><p>{growthTension ? `${growthTension.label} has the thinnest support.` : 'More evidence needed.'}</p></article>
        <article className="hes-insight-card recovery"><h3>Recommended Practice</h3><p>{recommendedRecovery ? `Stabilize ${recommendedRecovery.label} with brief reset routines.` : 'Early read — more evidence needed.'}</p></article>
      </div>

      

      <article className="card"><h2>The 8 Factors</h2><div className="hes-factor-grid compact">{dimensionDefinitions.map(({ key, label }) => {
        const p = factorProfiles[key];
        const factor = factorPsychologyDefinitions[key];
        const sourceLabel = p.sourceTypes.length ? p.sourceTypes.map((s) => s === 'diagnostic' ? 'Self-report baseline' : title(s)).join(' · ') : 'None yet';
        return <article key={key} className="hes-factor-panel compact"><h3>{label}</h3>
          <div className="hes-factor-topline"><span className="hes-score-pill">{p.score ? p.score.toFixed(2) : '—'} / 5</span><span className="badge badge-blue">{p.maturityLevel}</span>{p.riskMarkers > p.positiveMarkers ? <span className="badge badge-amber">Drift risk</span> : <span className="badge badge-green">Stable</span>}</div>
          <div className="hes-meter-block"><label>Current score</label><div className="hes-score-bar"><span style={{ width: `${((p.score || 0) / 5) * 100}%` }} /></div></div>
          <div className="hes-meter-block"><label>Confidence</label><div className="hes-confidence-bar"><span style={{ width: `${Math.round((p.averageConfidence || 0) * 100)}%` }} /></div></div>
          <p><strong>Evidence:</strong> <span className="badge badge-gray">{p.totalEvidenceEvents} items</span> <span className="badge badge-blue">Weighted {p.weightedEvidence}</span></p>
          <p><strong>Sources:</strong> {sourceLabel}</p>
          <p><strong>What we see:</strong> {p.totalEvidenceEvents === 0 ? 'No evidence yet.' : factorCoachingCopy[key].see}</p>
          <p><strong>What to practice:</strong> {p.totalEvidenceEvents === 0 ? 'Complete Diagnostic and Urban Simulation.' : factorCoachingCopy[key].move}</p>
          <div className="hes-mini-bars"><div><small>Baseline evidence</small><div className="hes-score-bar"><span style={{ width: `${p.sourceTypes.includes('diagnostic') ? 100 : 0}%` }} /></div></div><div><small>Simulation evidence</small><div className="hes-score-bar"><span style={{ width: `${Math.min(100, p.totalEvidenceEvents * 22)}%` }} /></div></div><div><small>Blended score</small><div className="hes-confidence-bar"><span style={{ width: `${((p.score || 0) / 5) * 100}%` }} /></div></div></div>
          <details><summary>View deeper analysis</summary><p>{factor.shortDefinition}</p><p>Confidence: {(p.averageConfidence * 100).toFixed(0)}% · Last updated: {p.latestUpdatedAt ? new Date(p.latestUpdatedAt).toLocaleString('en-US') : 'Not yet'}</p><p><strong>Pressure drift to watch:</strong> {p.totalEvidenceEvents === 0 ? 'No evidence yet.' : factorCoachingCopy[key].drift}</p><p><strong>Current read:</strong> {p.currentRead}</p></details>
        </article>;
      })}</div></article>



      {activeReport ? <div className="hes-modal-backdrop" role="dialog" aria-modal="true" aria-label="Growth Center panel" onClick={() => setActiveReport(null)}><article className="card hes-modal-panel" onClick={(e) => e.stopPropagation()}><div className="hes-modal-header"><h3>{reportTabs.find((tab) => tab.key === activeReport)?.label}</h3><button className="button secondary" onClick={() => setActiveReport(null)}>Close</button></div><div className="hes-modal-content">{renderReportPanel()}</div></article></div> : null}

      <article className="card"><h2>Framework Course</h2><Link className="button secondary" href="/human-equation-suite/learn">Preview Placeholder</Link></article>
    </main></div></div></section>;
}
