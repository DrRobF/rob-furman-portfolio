'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import HumanEquationNav from '../../components/HumanEquationNav';
import { DASHBOARD_PROFILE_STORAGE_KEY, DIAGNOSTIC_RESULT_STORAGE_KEY, blendUrbanEvidenceIntoProfile, createEmptyMasterProfile, createInterpretation, deriveEvidenceMaturity, dimensionDefinitions, evidenceCalibratedLanguage, factorPsychologyDefinitions, toMasterProfileFromDiagnostic } from './profileData';
import { URBAN_REPORT_STORAGE_KEY } from './urbanEvidence';

const toSourceChips = (weights = {}) => Object.entries(weights).filter(([, value]) => value > 0).map(([source]) => source === 'diagnostic' ? 'Diagnostic' : source === 'urbanSim' ? 'Urban' : source === 'parentCall' ? 'Parent Call' : source === 'leadershipSim' ? 'Leadership Sim' : source === 'observationLab' ? 'Observation' : source).slice(0, 3);
const statusLabel = (score) => score >= 4.1 ? 'Strong signal' : score >= 3.3 ? 'Steady signal' : score >= 2.6 ? 'Emerging signal' : 'Early signal';

const growthReports = [
  { id: 'distortions', label: 'Pressure Distortions' },
  { id: 'recovery', label: 'Recovery Practices' },
  { id: 'timeline', label: 'Evidence Timeline' },
  { id: 'executive', label: 'Executive Report' }
];

export default function HumanEquationDashboardPage() {
  const [profile, setProfile] = useState(createEmptyMasterProfile());
  const [activeReport, setActiveReport] = useState('distortions');
  const reportPanelRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const rawDiagnostic = window.localStorage.getItem(DIAGNOSTIC_RESULT_STORAGE_KEY);
    const rawUrbanReport = window.localStorage.getItem(URBAN_REPORT_STORAGE_KEY);
    const cached = window.localStorage.getItem(DASHBOARD_PROFILE_STORAGE_KEY);
    if (cached) {
      try {
        let parsed = JSON.parse(cached);
        if (rawUrbanReport) parsed = blendUrbanEvidenceIntoProfile(parsed, JSON.parse(rawUrbanReport));
        parsed.interpretation = createInterpretation(parsed, JSON.parse(rawDiagnostic || 'null'), JSON.parse(rawUrbanReport || 'null'));
        setProfile(parsed);
        window.localStorage.setItem(DASHBOARD_PROFILE_STORAGE_KEY, JSON.stringify(parsed));
        return;
      } catch {}
    }
    if (!rawDiagnostic) return;
    try {
      const built = toMasterProfileFromDiagnostic(JSON.parse(rawDiagnostic));
      built.interpretation = createInterpretation(built, JSON.parse(rawDiagnostic), JSON.parse(rawUrbanReport || 'null'));
      setProfile(built);
      window.localStorage.setItem(DASHBOARD_PROFILE_STORAGE_KEY, JSON.stringify(built));
    } catch {}
  }, []);

  const sorted = useMemo(() => Object.values(profile.dimensions).filter((d) => Number.isFinite(d.blendedCompositeScore)).sort((a, b) => b.blendedCompositeScore - a.blendedCompositeScore), [profile]);
  const strongest = sorted[0];
  const growthEdge = sorted[sorted.length - 1];
  const fastestGrowing = sorted[Math.max(0, Math.floor(sorted.length / 2))];
  const pressureDistortion = sorted.find((factor) => factor.blendedCompositeScore < 3) || growthEdge;
  const interpretation = profile.interpretation || {};

  const keySignals = {
    strongest: strongest?.key,
    tension: growthEdge?.key,
    distortion: pressureDistortion?.key,
    momentum: fastestGrowing?.key
  };

  const factorState = (score) => score >= 4.1 ? 'stabilizing' : score >= 3.3 ? 'emerging' : score >= 2.6 ? 'tension' : 'distortion';
  const factorIcon = (state) => state === 'stabilizing' ? '🛡️' : state === 'emerging' ? '🚀' : state === 'tension' ? '⚡' : '⚠️';

  const humanizeCopy = (value = '') => value
    .replace(/interpretation narrowing/gi, 'you may start seeing fewer options')
    .replace(/pressure reliability/gi, 'how steady this factor stays under stress')
    .replace(/recovery interruption points/gi, 'where you can stop the pattern before it takes over')
    .replace(/hyper-logistics/gi, 'getting stuck in tasks while missing the human issue')
    .replace(/re-open stakeholder data before execution/gi, 'check what you may be assuming before you act')
    .replace(/leadership capacity signal/gi, 'what this reveals about you under pressure')
    .replace(/factor movement indicators/gi, 'where your pattern is changing')
    .replace(/evidence confidence/gi, 'how much evidence we have')
    .replace(/signal maturity/gi, 'how developed this pattern looks so far');

  const focusTitle = interpretation.mostFragileCapacity || growthEdge?.label || 'Trust Construction under urgency';
  const points = dimensionDefinitions.map(({ key }, idx) => {
    const d = profile.dimensions[key];
    const score = Number.isFinite(d?.blendedCompositeScore) ? d.blendedCompositeScore : 2.5;
    const angle = ((Math.PI * 2) / dimensionDefinitions.length) * idx - Math.PI / 2;
    const r = 50 + (score / 5) * 45;
    return `${100 + Math.cos(angle) * r},${100 + Math.sin(angle) * r}`;
  }).join(' ');

  const reportPanel = {
    distortions: <article className="card hes-report-card"><h2>What pressure may be doing to your judgment</h2><p className="lead">Across available simulations, this is an evidence-calibrated read that updates as more data is captured.</p><div className="hes-report-grid"><section><h3>Current read</h3><p>{interpretation.trustUnderStress || 'Early read: more simulations needed.'}</p><p><strong>Maturity:</strong> {deriveEvidenceMaturity(pressureDistortion).maturityLabel}</p><p><strong>Sources:</strong> {toSourceChips(pressureDistortion?.evidenceWeights).join(' · ') || 'More evidence needed.'}</p><h4>Likely drift</h4><p>{deriveEvidenceMaturity(pressureDistortion).evidenceCount >= 3 ? 'A developing pattern appears when urgency rises and interpretation speed outruns inquiry.' : 'Early read: more simulations needed.'}</p></section><section><h3>Recovery interrupt points</h3><ul className="clean-list"><li>Pause and relabel threat signal before deciding.</li><li>Name what is known, unknown, and still needs checking.</li><li>Use one clear trust statement before next action.</li></ul></section></div></article>,
    recovery: <article className="card hes-report-card"><h2>Recovery Practices Report</h2><p className="lead">Recommendations are linked to observed patterns and soften when evidence is limited.</p><div className="hes-report-grid"><section><h3>Suggested practice</h3><p>{deriveEvidenceMaturity(growthEdge).evidenceCount < 3 ? 'Suggested practice only: more evidence is needed before calling this a stable risk pattern.' : 'Current evidence is becoming more consistent; practice these routines across future simulations.'}</p><ol className="hes-ladder"><li><strong>Stabilize physiology:</strong> 90-second pacing reset.</li><li><strong>Re-anchor evidence:</strong> list facts, unknowns, next check.</li><li><strong>Repair communication:</strong> transparent next step and timing.</li></ol></section><section><h3>Best next move</h3><p>{interpretation.recommendedCoachingFocus}</p></section></div></article>,
    timeline: <article className="card hes-report-card"><h2>Evidence Timeline</h2><p className="lead">Completed simulations, dates, and what changed.</p><div className="hes-timeline">{(profile.simulationHistory?.length ? profile.simulationHistory : [{ source: 'No evidence captured yet', completedAt: null, status: 'pending' }]).map((event, i) => <article key={`${event.source}-${i}`}><div className="node">{i + 1}</div><div><h4>{event.source}</h4><p>{event.completedAt ? `Completed: ${new Date(event.completedAt).toLocaleDateString('en-US')}` : 'Complete a simulation to add evidence.'}</p><p>{event.status === 'completed' ? 'Observed markers captured and linked to factor updates.' : 'This section will update as more behavioral data is collected.'}</p></div></article>)}</div></article>,
    executive: <article className="card hes-report-card printable-report"><h2>Executive Report</h2><p>This report becomes more precise as more simulations are completed.</p><div className="hes-exec-grid"><article><h3>Executive summary</h3><p>{interpretation.summary}</p></article><article><h3>Top strengths</h3><p>{interpretation.strongestCapacity || strongest?.label}</p></article><article><h3>Pressure risks</h3><p>{interpretation.pressureIdentity || 'More evidence needed.'}</p></article></div><div className="button-row top-space-sm"><button className="button secondary" onClick={() => window.print()}>Print Executive Report</button></div></article>
  };

  return <section className="section section-light"><div className="container"><LanguageSwitcher /><HumanEquationNav />
    <div className="hes-app-layout top-space-sm">
      <aside className="hes-command-sidebar">
        <h3>Progression</h3>
        <div className="hes-stepper">
          {[{ t: 'Learn the 8 Factors', s: 'Completed', d: 'Framework foundation', c: 'done' }, { t: 'Leadership Diagnostic', s: 'Completed', d: 'Baseline pressure profile', c: 'done' }, { t: 'Practice Lab', s: 'Current', d: 'Simulations active', c: 'current' }, { t: 'Growth Center', s: 'Available', d: 'Track recovery over time', c: 'available' }].map((step, i) => <article className={`hes-step ${step.c}`} key={step.t}><div className="node">{step.c === 'done' ? '✓' : i + 1}</div><div><header><h4>{step.t}</h4><span className={`status-badge is-${step.c}`}>{step.s}</span></header><p>{step.d}</p></div></article>)}
        </div>
        <section><h3>Growth Center</h3><div className="quick-actions">{growthReports.map((report) => <button key={report.id} className={`button secondary ${activeReport === report.id ? 'is-active' : ''}`} onClick={() => {
              setActiveReport(report.id);
              requestAnimationFrame(() => {
                reportPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                reportPanelRef.current?.focus({ preventScroll: true });
              });
            }}>{report.label}</button>)}</div></section>
      </aside>
      <main className="hes-main-content">
        <article className="card hes-hero-profile hes-hero-shell"><div><p className="eyebrow">Executive summary</p><h1>Your profile updates as evidence accumulates across simulations.</h1><p>This is an adaptive behavioral evidence engine. Interpretations are calibrated to the amount and quality of available evidence.</p><p>{interpretation.summary}</p></div><div className="hes-mini-radar"><svg viewBox="0 0 200 200" role="img" aria-label="8 factor radar"><circle cx="100" cy="100" r="92"/><circle cx="100" cy="100" r="64"/><circle cx="100" cy="100" r="36"/><polygon points={points} /></svg><p><strong>Profile confidence:</strong> {Math.round((profile?.interpretation?.confidenceLevels?.blended || 0.74) * 100)}%</p></div></article>

        <section className="hes-insights-row">
          <article className="hes-insight-card stabilizer"><h3>Strongest stabilizer</h3><p>{interpretation.strongestCapacity || strongest?.label || 'Signal emerging'}</p></article>
          <article className="hes-insight-card distortion"><h3>Active pressure distortion</h3><p>{interpretation.pressureIdentity || 'Controller'} — {interpretation.trustUnderStress}</p></article>
          <article className="hes-insight-card tension"><h3>Current growth tension</h3><p>{focusTitle}</p></article>
          <article className="hes-insight-card recovery"><h3>Recommended recovery move</h3><p>{interpretation.recommendedCoachingFocus}</p></article>
        </section>

        <section ref={reportPanelRef} tabIndex={-1} aria-live="polite" className="hes-active-report"><p className="eyebrow">Growth Center report</p>{reportPanel[activeReport]}</section>

        <article className="card"><h2>The 8 Factors of Leadership Psychology</h2><div className="hes-factor-grid compact">{dimensionDefinitions.map(({ key }) => { const d = profile.dimensions[key]; const factor = factorPsychologyDefinitions[key]; const score = Number.isFinite(d?.blendedCompositeScore) ? d.blendedCompositeScore : null; const state = factorState(score || 0); const evidenceConfidence = Math.min(100, Math.round(((score || 0) / 5) * 70 + 24)); const isPriority = Object.values(keySignals).includes(key); return <article key={key} className={`hes-factor-panel compact state-${state} ${isPriority ? 'is-priority' : ''}`}><header><h3>{factorIcon(state)} {factor.title}</h3><span className="score-pill">{score ? `${score.toFixed(1)} / 5 · ${statusLabel(score)}` : 'Pending'}</span></header><div className="hes-signal-bar"><span style={{ width: `${((score || 0) / 5) * 100}%` }} /></div><div className="hes-metrics"><div><label>Evidence maturity</label><strong>{deriveEvidenceMaturity(d).maturityLabel}</strong></div><div><label>Evidence sources</label><strong>{deriveEvidenceMaturity(d).sourceCount} sources</strong></div><div><label>Observed markers</label><strong>{deriveEvidenceMaturity(d).observedMarkerCount} markers</strong></div><div><label>Last updated</label><strong>{deriveEvidenceMaturity(d).latestEvidenceDate ? new Date(deriveEvidenceMaturity(d).latestEvidenceDate).toLocaleDateString('en-US') : 'More evidence needed'}</strong></div></div><p>{humanizeCopy(factor.shortDefinition)}</p><p><strong>Current read:</strong> {evidenceCalibratedLanguage[deriveEvidenceMaturity(d).maturityLabel]?.intro} {humanizeCopy(factor.currentInterpretation)}</p><p><strong>Pressure risk:</strong> {deriveEvidenceMaturity(d).evidenceCount >= 3 ? humanizeCopy(factor.pressureDistortion) : 'More evidence needed.'}</p><p><strong>Recovery move:</strong> {humanizeCopy(factor.recoveryPractice)}</p><p><strong>Evidence note:</strong> {evidenceCalibratedLanguage[deriveEvidenceMaturity(d).maturityLabel]?.note}</p><div className="source-chips">{toSourceChips(d?.evidenceWeights).length ? toSourceChips(d.evidenceWeights).map((chip) => <span key={chip}>{chip}</span>) : <span>More evidence needed.</span>}</div><details><summary>View deeper analysis</summary><p>{humanizeCopy(factor.currentInterpretation)}</p><p>{humanizeCopy(factor.growthTrajectory)}</p><p>{humanizeCopy(factor.evidenceLanguage)}</p></details></article>; })}</div></article>


        <article className="card"><h2>Framework Course Placeholder</h2><div className="hes-compact-progress"><article className="card"><span className="status-badge is-available">Coming Soon</span><h3>Learn the 8 Factors</h3><p>Framework course module will launch here. Use the dashboard and practice lab for now.</p><Link className="button secondary" href="/human-equation-suite/learn">Preview Placeholder</Link></article></div></article>
      </main>
    </div>
  </div></section>;
}
