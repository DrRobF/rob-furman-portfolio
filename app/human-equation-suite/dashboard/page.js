'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import HumanEquationNav from '../../components/HumanEquationNav';
import HelpSuiteShell from '../../components/help/HelpSuiteShell';
import { dimensionDefinitions, factorPsychologyDefinitions } from './profileData';
import { EVIDENCE_EVENTS_STORAGE_KEY, LEADERSHIP_EVIDENCE_UPDATED_AT_KEY, calculateFactorProfile, getEvidenceTimeline, getNextRecommendedSimulation, resetLeadershipProfile } from './evidenceModel';
import { readCourseEvidence } from '../course/courseModel';

const title = (sourceType) => ({ diagnostic: 'Diagnostic', course_reflection: 'Course', urban_sim: 'Urban Sim', parent_call: 'Parent Call', leadership_sim: 'Leadership Sim', observation_lab: 'Observation', written_artifact: 'Written Artifact', artifact: 'Artifact' }[sourceType] || sourceType);
const timelineTitle = (event) => {
  if (event.sourceType === 'parent_call') return 'Parent Call Rehearsal completed';
  if (event.sourceType === 'leadership_sim') return 'School Leadership Simulation completed';
  return event.sourceLabel || title(event.sourceType);
};

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
const simulationStages = ['Baseline Captured', 'Evidence Added', 'Pattern Detected', 'Recovery Practiced', 'Executive Profile Strengthened'];
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
const factorAbbreviations = { regulationUnderPressure: 'RUP', humanAwareness: 'HA', trustConstruction: 'TC', realityAnchoring: 'RA', grayAreaLeadership: 'GAL', teamSystemsLeadership: 'TSL', instructionalAcademicLeadership: 'IAL', visionChangeLeadership: 'VCL' };
const factorAccentColors = { regulationUnderPressure: '#4da9ff', humanAwareness: '#2ad4c8', trustConstruction: '#ffc165', realityAnchoring: '#ff8a72', grayAreaLeadership: '#a78bfa', teamSystemsLeadership: '#22d3a6', instructionalAcademicLeadership: '#f59e0b', visionChangeLeadership: '#fb7185' };

export default function HumanEquationDashboardPage() {
  const [focusTab, setFocusTab] = useState(null);
  const [events, setEvents] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [courseEvidence, setCourseEvidence] = useState(null);
  const [showMatrixModal, setShowMatrixModal] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setFocusTab(new URLSearchParams(window.location.search).get('tab'));
    const refreshEvents = () => {
      const parsed = JSON.parse(window.localStorage.getItem(EVIDENCE_EVENTS_STORAGE_KEY) || '[]');
      setEvents(parsed);
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[Dashboard] evidence events found:', parsed.length);
        console.debug('[Dashboard] source types found:', [...new Set(parsed.map((e) => e.sourceType))]);
      }
    };
    refreshEvents();
    setCourseEvidence(readCourseEvidence());
    const onStorage = (event) => {
      if (event.key === EVIDENCE_EVENTS_STORAGE_KEY || event.key === LEADERSHIP_EVIDENCE_UPDATED_AT_KEY) refreshEvents();
      if (event.key === 'humanEquationCourseEvidence') setCourseEvidence(readCourseEvidence());
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
    const center = 80;
    const radius = 62;
    const factors = scoredFactors.slice(0, 8);
    return factors.map((f, i) => {
      const angle = (Math.PI * 2 * i) / factors.length - Math.PI / 2;
      const value = ((f.score || 2.2) / 5) * radius;
      return `${(center + Math.cos(angle) * value).toFixed(1)},${(center + Math.sin(angle) * value).toFixed(1)}`;
    }).join(' ');
  }, [scoredFactors]);
  const stageProgress = Math.min(simulationStages.length - 1, events.length);
  const sourceTypesPresent = useMemo(() => new Set(events.map((event) => event.sourceType)), [events]);
  const evidenceSourceStatuses = useMemo(() => [
    { sourceType: 'diagnostic', label: 'Diagnostic', status: sourceTypesPresent.has('diagnostic') ? 'Completed' : 'Not started' },
    { sourceType: 'course_reflection', label: 'Course', status: courseEvidence?.completedFactors === 8 ? 'Completed' : courseEvidence?.completedFactors ? 'In progress' : 'Not started' },
    { sourceType: 'urban_sim', label: 'Urban Sim', status: sourceTypesPresent.has('urban_sim') ? 'Completed' : 'Not started' },
    { sourceType: 'parent_call', label: 'Parent Call', status: sourceTypesPresent.has('parent_call') ? 'Completed' : 'Not started' },
    { sourceType: 'leadership_sim', label: 'Leadership Sim', status: sourceTypesPresent.has('leadership_sim') ? 'Completed' : 'Not started' },
  ], [courseEvidence, sourceTypesPresent]);

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
      return <article className="card hes-report-card hes-active-report"><h2>Evidence Timeline</h2><p><strong>What this pattern means:</strong> The timeline shows how your leadership signal shifts from self-perception to observed behavior under pressure.</p><p><strong>What others may experience:</strong> As evidence grows, your team should feel less surprise and more predictability in how you decide.</p><p><strong>What goes wrong under pressure:</strong> If evidence capture is inconsistent, growth can feel intuitive but remain untestable.</p><p><strong>What to do in the moment:</strong> Log one concrete behavior, one impact on others, and one recovery move within 12 hours of each high-pressure moment.</p><p><strong>Repair language afterward:</strong> “I want to make our process visible. Here is what happened, how I read it, and what I will do differently next cycle.”</p><p><strong>Next simulation recommendation:</strong> {getNextRecommendedSimulation(events)} to fill the biggest evidence gap.</p>{timeline.length === 0 ? <p>No evidence captured yet. Complete the diagnostic or a simulation to begin building your profile.</p> : <div className="hes-timeline">{timeline.map((event) => <article key={event.id}><div className="node">•</div><h4>{timelineTitle(event)}</h4><p>{new Date(event.timestamp).toLocaleString('en-US')} · {event.evidenceType === 'diagnostic_self_report' ? 'Self-report baseline' : 'Behavioral evidence'}</p><p><strong>Factors touched:</strong> {event.factorImpacts.map((x) => x.factorId).join(', ')}</p><p><strong>What it added:</strong> {event.sourceType === 'urban_sim' ? 'Added behavioral evidence around human awareness, regulation, trust, reality anchoring, and gray-area judgment.' : event.sourceType === 'diagnostic' ? 'Created baseline self-perception across all eight factors.' : event.summary}</p></article>)}</div>}</article>;
    }
    if (activeReport === 'recovery') {
      return <article className="card hes-report-card hes-active-report"><h2>Recovery Practices</h2><div className="hes-ladder"><p><strong>What this pattern means:</strong> Your leadership strength is composure; the risk is interpretive compression where internal certainty outruns team comprehension.</p><p><strong>What others may experience:</strong> People may trust your steadiness but still feel late to your reasoning process.</p><p><strong>What goes wrong under pressure:</strong> You can skip collaborative sense-making and move directly to solution language.</p><p><strong>What to do in the moment:</strong> Use a 45-second reset: “Here are the facts, here is my interpretation, here is what we still need to verify.”</p><p><strong>Repair language afterward:</strong> “I moved quickly. Here is what drove my decision, what I may have missed, and what I need from you now.”</p><p><strong>Next simulation recommendation:</strong> {getNextRecommendedSimulation(events)} to practice pace control while maintaining decisive ownership.</p></div></article>;
    }
    if (activeReport === 'executive') {
      return <article className="card hes-report-card hes-active-report"><h2>Executive Briefing Document</h2><div className="hes-exec-grid"><article><h4>1. Current Leadership Signal</h4><p>When urgency rises, your leadership can appear externally steady while shared reasoning becomes less visible. Strongest signal: {strongest ? strongest.label : 'Forming under limited evidence'}. Dominant pressure drift: {activeDistortion ? activeDistortion.label : 'Interpretation narrowing'}.</p></article><article><h4>2. What Others Likely Experience</h4><p>Staff often experience psychological safety first and directional clarity second. Parents experience care and presence, but may need sharper decisional language. Teams perceive confidence, yet can feel downstream from your internal synthesis until you narrate the logic explicitly.</p></article><article><h4>3. Risk Under Escalation</h4><p>The central risk is not volatility; it is compression. Interpretation may close too early, alternative hypotheses may receive less airtime, and follow-through ownership can become narrower than the system requires.</p></article><article><h4>4. Recovery Strategy</h4><p>Keep decisiveness, slow interpretation. Name facts versus assumptions, expose one competing explanation, and assign explicit next actions with owners and time windows. Re-open the loop same-day to protect trust velocity.</p></article><article><h4>5. Best Next Simulation and Why</h4><p>{getNextRecommendedSimulation(events)} is the highest-value next test because it pressures relational clarity, conflict pacing, and shared meaning under live stakes—your critical growth edge at this stage.</p></article><article><h4>6. Evidence Sources Referenced</h4><p>{evidenceSourceStatuses.filter((source) => source.status !== 'Not started').map((source) => source.label).join(' · ') || 'No completed evidence sources yet.'}</p></article></div></article>;
    }
    const driftFactor = activeDistortion || scoredFactors.find((f) => f.totalEvidenceEvents > 0);
    const copy = driftFactor ? factorCoachingCopy[driftFactor.key] : null;
    const lens = coachingLens(driftFactor || scoredFactors[0]);
    return <article className="card hes-report-card hes-active-report"><h2>Pressure Distortions</h2><div className="hes-ladder"><p><strong>What this pattern means:</strong> {lens.pressure}</p><p><strong>What others may experience:</strong> {lens.others}</p><p><strong>What goes wrong under pressure:</strong> {lens.distortion}</p><p><strong>What to do in the moment:</strong> {lens.interrupt}</p><p><strong>Repair language afterward:</strong> {lens.repair}</p><p><strong>Next simulation recommendation:</strong> {lens.simulation}</p></div></article>;
  };

  const growthActions = reportTabs.map((tab) => ({
    key: tab.key,
    label: tab.label,
    active: activeReport === tab.key,
    onClick: () => setActiveReport(tab.key),
  }));

  return <section className="section help-suite-page help-suite-internal help-page-dark"><div className="container"><div className='help-suite-nav-wrap'><HumanEquationNav /></div>
    <HelpSuiteShell currentArea="dashboard" growthActions={growthActions}>
    <main className="hes-main-content top-space-sm">
      <div className="help-dashboard-utility-row"><button className="button secondary" onClick={() => {
        if (!window.confirm('Start fresh clears your leadership evidence profile so you can rebuild it from new diagnostic and simulation data. Continue?')) return;
        resetLeadershipProfile();
        setEvents([]);
      }}>Start Fresh Profile</button><p><strong>Next recommended simulation:</strong> {getNextRecommendedSimulation(events)}</p></div>
      
      {focusTab === 'diagnostic' ? <article className="card help-suite-panel hes-dashboard-focus"><p className="eyebrow">Diagnostic results area</p><h2>Leadership Diagnostic evidence is now connected.</h2><p>Your diagnostic baseline is reflected in the factor cards, source labels, and evidence timeline below. Continue reviewing this dashboard to compare self-perception with future simulation evidence.</p></article> : null}
      <article className="card hes-hero-profile"><div className="hes-hero-shell"><div className="hes-hero-left"><p className="eyebrow">Executive Leadership Intelligence</p><h1>Your pattern is not just what you do — it is what others feel while you do it.</h1><p>This dashboard tracks how pressure changes interpretation, pacing, trust language, and recovery behavior across real evidence moments.</p><p className="hes-confidence-meta">Evidence maturity: {profileStatus}</p></div><div className="hes-hero-right"><div className="hes-mini-radar"><svg viewBox="0 0 160 160" aria-label="Leadership radar"><circle cx="80" cy="80" r="62" /><circle cx="80" cy="80" r="48" /><circle cx="80" cy="80" r="34" /><circle cx="80" cy="80" r="20" /><polygon points={radarPoints} />{scoredFactors.slice(0,8).map((f, i) => { const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2; const value = ((f.score || 2.2) / 5) * 62; const x = 80 + Math.cos(angle) * value; const y = 80 + Math.sin(angle) * value; const lx = 80 + Math.cos(angle) * 72; const ly = 80 + Math.sin(angle) * 72; return <g key={f.key}><circle cx={x} cy={y} r="2.5" className="hes-radar-marker" /><text x={lx} y={ly} className="hes-radar-label">{factorAbbreviations[f.key]}</text></g>;})}<text x="83" y="24" className="hes-radar-scale">5</text><text x="83" y="38" className="hes-radar-scale">4</text><text x="83" y="52" className="hes-radar-scale">3</text><text x="83" y="66" className="hes-radar-scale">2</text><text x="83" y="80" className="hes-radar-scale">1</text></svg><small>8-factor signal map with 1–5 scale and score markers</small></div><div className="hes-hero-metrics"><p><strong>Strongest factor:</strong> {strongest ? strongest.label : 'Emerging signal'}</p><p><strong>Fragile factor:</strong> {weakest ? weakest.label : 'Pending evidence'}</p><p><strong>Drift alert:</strong> {activeDistortion ? activeDistortion.label : 'Urgency narrowing under load'}</p><p><strong>Evidence maturity:</strong> {confidence}</p></div></div></div></article>
      <section className="hes-snapshot-shell"><h2>Leadership Signal Snapshot</h2><div className="hes-insights-row">
        <article className="hes-insight-card stabilizer"><h3>Strongest Capacity</h3><h4>{strongest ? strongest.label : 'Emerging signal'}</h4><p>Reads emotional context before reacting.</p></article>
        <article className="hes-insight-card distortion"><h3>Most Fragile Capacity</h3><h4>{weakest ? weakest.label : 'Pending evidence'}</h4><p>Urgency may outpace collaborative explanation.</p></article>
        <article className="hes-insight-card tension"><h3>Current Pressure Drift</h3><h4>{activeDistortion ? activeDistortion.label : 'Urgency narrowing'}</h4><p>Decision speed may compress interpretation range.</p></article>
        <article className="hes-insight-card recovery"><h3>Recommended Recovery Move</h3><h4>{recommendedRecovery ? `Slow ${recommendedRecovery.label}` : 'Slow interpretation'}</h4><p>Pause before assigning meaning.</p></article>
      </div><button className="button secondary" onClick={() => setShowMatrixModal(true)}>View Full Factor Matrix</button></section>

      

      <article className="card help-suite-panel"><h2>The 8 Factors</h2><div className="hes-factor-grid compact">{dimensionDefinitions.map(({ key, label }) => {
        const p = factorProfiles[key];
        const factor = factorPsychologyDefinitions[key];
        const sourceLabel = p.sourceTypes.length ? p.sourceTypes.map((s) => title(s)).join(' · ') : 'None yet';
        return <article key={key} className="hes-factor-panel compact" style={{ '--factor-accent': factorAccentColors[key] || '#4da9ff' }}><h3>{label}</h3>
          <div className="hes-factor-topline"><span className="hes-score-pill">{p.score ? p.score.toFixed(2) : '—'} / 5</span><span className="badge badge-blue">{p.maturityLevel}</span>{p.riskMarkers > p.positiveMarkers ? <span className="badge badge-amber">Drift risk</span> : <span className="badge badge-green">Stable</span>}</div>
          <div className="hes-meter-block"><label>Current score</label><div className="hes-score-bar"><span style={{ width: `${((p.score || 0) / 5) * 100}%` }} /></div></div>
          
          <div className="hes-factor-header"><span className="badge badge-gray">{p.totalEvidenceEvents} items</span><span className={`badge ${trendArrow(p) === '↓' ? 'badge-amber' : trendArrow(p) === '↑' ? 'badge-green' : 'badge-blue'}`}>{trendArrow(p)} trend</span><span className="badge badge-blue">Sources: {sourceLabel}</span></div><p className="hes-factor-signal">{p.totalEvidenceEvents === 0 ? 'No evidence yet.' : factorCoachingCopy[key].see}</p><div className="hes-factor-bottom"><span className="badge badge-amber">Drift badge: {p.totalEvidenceEvents === 0 ? 'Pending' : factorCoachingCopy[key].drift}</span><span className="badge badge-green">Recovery keyword: {p.totalEvidenceEvents === 0 ? 'Run Diagnostic + Urban Sim' : factorCoachingCopy[key].move}</span></div>
          <div className="hes-mini-bars"><div><small>Baseline evidence</small><div className="hes-score-bar"><span style={{ width: `${p.sourceTypes.includes('diagnostic') ? 100 : 0}%` }} /></div></div><div><small>Simulation evidence</small><div className="hes-score-bar"><span style={{ width: `${Math.min(100, p.totalEvidenceEvents * 22)}%` }} /></div></div><div><small>Blended score</small><div className="hes-confidence-bar"><span style={{ width: `${((p.score || 0) / 5) * 100}%` }} /></div></div></div>
          <details><summary>View deeper analysis</summary><p>{factor.shortDefinition}</p><p>Signal quality: {confidenceLabel(p.totalEvidenceEvents)} · Last updated: {p.latestUpdatedAt ? new Date(p.latestUpdatedAt).toLocaleString('en-US') : 'Not yet'}</p><p><strong>Current read:</strong> {p.currentRead}</p></details>
        </article>;
      })}</div></article>




      {showMatrixModal ? <div className="hes-modal-backdrop" role="dialog" aria-modal="true" aria-label="Full Factor Matrix" onClick={() => setShowMatrixModal(false)}><article className="card hes-modal-panel" onClick={(e) => e.stopPropagation()}><div className="hes-modal-header"><h3>Full Factor Matrix</h3><button className="button secondary" onClick={() => setShowMatrixModal(false)}>Close</button></div><div className="hes-modal-content"><div className="hes-matrix-legend"><span>🔵 Baseline</span><span>🟢 Simulation</span><span>⚪ Composite</span></div><div className="hes-factor-matrix">
      {scoredFactors.map((factor) => {const score=factor.score ?? 0;const baseline=factor.sourceTypes.includes('diagnostic')?Math.min(100,Math.max(20,score/5*100)):0;const simulation=Math.min(100,factor.totalEvidenceEvents*20);const arrow=trendArrow(factor);return <div key={`matrix-${factor.key}`} className="hes-matrix-row"><div className="hes-matrix-label"><span>{factor.label}</span><small>Composite: {factor.score ? factor.score.toFixed(1) : '—'} / 5 {arrow}</small></div><div className="hes-matrix-bars"><div className="hes-score-bar baseline"><span style={{ width: `${baseline}%` }} /></div><div className="hes-score-bar simulation"><span style={{ width: `${simulation}%` }} /></div><div className="hes-score-bar composite"><span style={{ width: `${(score/5)*100}%` }} /></div></div><div className="hes-matrix-values"><strong>{factor.score ? factor.score.toFixed(2) : '—'}</strong><small>{arrow}</small></div></div>;})}
      </div></div></article></div> : null}

      {activeReport ? <div className="hes-modal-backdrop" role="dialog" aria-modal="true" aria-label="Growth Center panel" onClick={() => setActiveReport(null)}><article className="card hes-modal-panel" onClick={(e) => e.stopPropagation()}><div className="hes-modal-header"><h3>{reportTabs.find((tab) => tab.key === activeReport)?.label}</h3><button className="button secondary" onClick={() => setActiveReport(null)}>Close</button></div><div className="hes-modal-content">{renderReportPanel()}</div></article></div> : null}

      <article className="card hes-relational-layer"><h2>How this may feel to others</h2><div className="hes-report-grid"><p><strong>Staff:</strong> Staff may feel protected by your steadiness, but still need clearer visibility into how decisions are being made as conditions change.</p><p><strong>Parents:</strong> Parents may experience genuine care and containment, yet still require explicit timelines and decision criteria to sustain trust under uncertainty.</p><p><strong>Teams:</strong> Teams may admire your composure while feeling they are interpreting your intent indirectly unless you narrate your logic in real time.</p><p><strong>Crisis moments:</strong> In fast escalation, people often feel your calm presence first; they need your reasoning pathway second so urgency does not become confusion.</p></div></article><article className="card hes-sim-progression"><h2>Simulation Intelligence Progression</h2><div className="hes-progression-track">{simulationStages.map((stage, idx) => { const status = idx < stageProgress ? 'complete' : idx === stageProgress ? 'active' : 'pending'; return <div key={stage} className={`hes-progress-step ${status}`}><div className="hes-progress-node">{status === 'complete' ? '✓' : idx + 1}</div><div className="hes-progress-label">{stage}</div>{idx < simulationStages.length - 1 ? <div className="hes-progress-connector" /> : null}</div>; })}</div><p>Current recommendation: <strong>{getNextRecommendedSimulation(events)}</strong>.</p></article>
      <article className="card help-suite-panel"><h2>Evidence source status</h2><div className="button-row">{evidenceSourceStatuses.map((source) => <span key={source.sourceType} className={`badge ${source.status === 'Completed' ? 'badge-green' : source.status === 'In progress' ? 'badge-blue' : 'badge-gray'}`}>{source.label}: {source.status}</span>)}</div></article>
      <article className='card'><h2>8 Factors Course evidence source</h2><p><strong>Status:</strong> {courseEvidence?.completedFactors ? (courseEvidence.completedFactors === 8 ? 'Completed' : 'In progress') : 'Not started'}</p><p><strong>Course progress:</strong> {courseEvidence?.completedFactors || 0}/8 completed</p><p><strong>Latest factor completed:</strong> {courseEvidence?.timelineEvents?.length ? courseEvidence.timelineEvents[courseEvidence.timelineEvents.length - 1].label : 'None yet'}</p><p><strong>Course contribution to dashboard:</strong> Course calibration evidence</p><div className='button-row'><Link className='button primary' href='/human-equation-suite/course'>Continue Course</Link></div></article>
    </main></HelpSuiteShell></div></section>;
}
