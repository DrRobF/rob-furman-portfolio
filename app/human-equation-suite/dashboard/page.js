'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import HumanEquationNav from '../../components/HumanEquationNav';
import { DASHBOARD_PROFILE_STORAGE_KEY, DIAGNOSTIC_RESULT_STORAGE_KEY, blendUrbanEvidenceIntoProfile, createEmptyMasterProfile, createInterpretation, dimensionDefinitions, toMasterProfileFromDiagnostic } from './profileData';
import { URBAN_REPORT_STORAGE_KEY } from './urbanEvidence';

const reportTabs = [
  { key: 'diagnostic', label: 'Diagnostic Report', sourceKey: 'diagnostic' },
  { key: 'parent-call', label: 'Parent Call Report', sourceKey: 'parentCall' },
  { key: 'leadership-simulation', label: 'Leadership Simulation Report', sourceKey: 'leadershipSim' },
  { key: 'urban', label: 'Urban Student Report', sourceKey: 'urbanSim' },
  { key: 'observation-lab', label: 'Observation Lab', sourceKey: 'observationLab' },
];

const dimensionInsightMap = {
  regulation: { low: 'Pressure appears to affect pacing and recovery speed.', mid: 'Stability is present, but urgency can still compress response time.', high: 'Current evidence suggests steady emotional pacing under pressure.' },
  awareness: { low: 'Behavior may be interpreted before enough human context is gathered.', mid: 'Context is noticed, but may depend on how clearly emotional cues appear.', high: 'Evidence suggests strong attention to hidden context behind surface behavior.' },
  trust: { low: 'Trust may weaken when urgency pushes decisions faster than relational repair.', mid: 'Relational care is visible, but consistency under pressure needs strengthening.', high: 'Evidence suggests stable attention to dignity, repair, and relational safety.' },
  reality: { low: 'Emotional load may narrow evidence-gathering.', mid: 'Fact-finding is present, but assumptions can still enter under urgency.', high: 'Current evidence suggests strong separation of fact, emotion, and assumption.' },
  grayArea: { low: 'Ambiguity may push decisions toward either rigidity or inconsistency.', mid: 'Context is considered, but fairness needs clearer explanation under pressure.', high: 'Evidence suggests mature navigation of competing truths.' },
  systems: { low: 'Responses may stay individual rather than system-based.', mid: 'System patterns are noticed, but routines may need clearer follow-through.', high: 'Evidence suggests strong awareness of routines, roles, and distributed support.' },
  instructional: { low: 'Instructional implications may remain secondary to behavior or urgency.', mid: 'Academic context is considered, but needs stronger linkage to action.', high: 'Evidence suggests strong connection between leadership moves and learning conditions.' },
  vision: { low: 'Purpose may not yet translate into a clear change pathway.', mid: 'Vision is present, but needs stronger behavioral alignment.', high: 'Evidence suggests clear connection between purpose, trust, and forward movement.' },
};

const getDimensionInsight = (dimensionKey, score) => {
  const map = dimensionInsightMap[dimensionKey];
  if (!map) return 'Signal forming with current evidence.';
  if (!Number.isFinite(score)) return 'Signal forming with current evidence.';
  if (score < 2.5) return map.low;
  if (score < 3.75) return map.mid;
  return map.high;
};

const toSourceChips = (weights = {}) => Object.entries(weights).filter(([, value]) => value > 0).map(([source]) => source === 'diagnostic' ? 'Diagnostic' : source === 'urbanSim' ? 'Urban' : source === 'parentCall' ? 'Parent Call' : source === 'leadershipSim' ? 'Leadership Sim' : source === 'observationLab' ? 'Observation' : source).slice(0, 3);

export default function HumanEquationDashboardPage() {
  const [profile, setProfile] = useState(createEmptyMasterProfile());
  const [urbanReport, setUrbanReport] = useState(null);
  const [activeReport, setActiveReport] = useState('diagnostic');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const requested = new URLSearchParams(window.location.search).get('tab');
    if (requested && reportTabs.some((tab) => tab.key === requested)) setActiveReport(requested);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const rawDiagnostic = window.localStorage.getItem(DIAGNOSTIC_RESULT_STORAGE_KEY);
    const rawUrbanReport = window.localStorage.getItem(URBAN_REPORT_STORAGE_KEY);
    if (rawUrbanReport) { try { setUrbanReport(JSON.parse(rawUrbanReport)); } catch {} }
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
  const interpretation = profile.interpretation || {};
  const focusTitle = interpretation.mostFragileCapacity || growthEdge?.label || 'Trust Construction under urgency';

  const report = reportTabs.find((item) => item.key === activeReport);
  const source = report ? profile.evidenceSources[report.sourceKey] : null;
  const reportExists = source?.status === 'completed' || activeReport === 'urban' && !!urbanReport;

  return <section className="section section-light"><div className="container"><LanguageSwitcher /><HumanEquationNav />
    <div className="hes-app-layout top-space-sm">
      <aside className="hes-command-sidebar">
        <section>
          <h3>Profile</h3>
          <ul>
            <li>Master Dashboard</li><li>Growth Summary</li><li>Pressure Distortions</li><li>Timeline</li>
          </ul>
        </section>
        <section>
          <h3>Evidence Sources</h3>
          {Object.values(profile.evidenceSources).map((s) => {
            const done = s.status === 'completed';
            return <div key={s.key} className="sidebar-source-row"><span className={`dot ${done ? 'done' : ''}`} />{s.label}<Link href={done ? `/human-equation-suite/dashboard?tab=${reportTabs.find((t) => t.sourceKey === s.key)?.key || 'diagnostic'}` : s.route} className="text-link">{done ? 'View Report' : 'Launch'}</Link></div>;
          })}
        </section>
        <section>
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <Link className="button secondary" href="/human-equation-suite/diagnostic">Retake Diagnostic</Link>
            <Link className="button secondary" href="/human-equation">Launch Parent Call</Link>
            <Link className="button secondary" href="/human-equation-suite/urban-reflection">Launch Urban Reflection Quiz</Link>
            <Link className="button secondary" href="/simulation-overview">Launch Leadership Sim</Link>
            <button className="button secondary" type="button" disabled>Generate Executive Report (Soon)</button>
          </div>
        </section>
        <section className="focus-box"><h3>Current Growth Focus</h3><p><strong>Current focus:</strong> {focusTitle}</p><p><strong>Next move:</strong> {interpretation.nextBestStep || 'Parent Call Rehearsal'}</p></section>
      </aside>

      <main className="hes-main-content">
        <article className="card"><p className="eyebrow">Current Leadership Pattern</p><h1>Leadership Pressure Profile</h1><p>{interpretation.summary || 'Executive view of capacities, pressure drift, and evidence integration.'}</p></article>
        <section className="hes-kpi-strip"><article className="kpi-card kpi-blue"><p>Visual Profile Confidence</p><h3>{Math.round(profile.confidenceLevels.blended * 100)}%</h3></article><article className="kpi-card kpi-purple"><p>Strongest Capacity</p><h3>{interpretation.strongestCapacity || strongest?.label || 'Awaiting signal'}</h3></article><article className="kpi-card kpi-amber"><p>Growth Edge</p><h3>{focusTitle}</h3></article></section>

        <article className="card"><h2>Pressure Distortions & Recovery Practice</h2><div className="card-grid">{(interpretation.pressureIdentityDetails || []).map((item) => <article key={item.name} className="card"><h3>{item.name}</h3><p><strong>Drift:</strong> {item.pattern}</p><p><strong>Recovery practice:</strong> {item.practice}</p></article>)}</div></article>

        <article className="card"><h2>Recommended Practice Focus</h2><div className="card-grid"><article className="card"><h3>Immediate move</h3><p>{interpretation.recommendedCoachingFocus}</p></article><article className="card"><h3>Next simulation</h3><p>{profile.recommendations?.nextSimulation || 'Parent Call Rehearsal'}</p></article><article className="card"><h3>Reflection question</h3><p>{interpretation.reflectionQuestion}</p></article></div></article>

        <article className="card"><h2>8-Dimension Profile</h2><div className="hes-dimension-grid">{dimensionDefinitions.map(({ key, label }) => { const d = profile.dimensions[key]; return <article key={key} className="dimension-tile"><header><h3>{label}</h3><span className="score-pill">{Number.isFinite(d.blendedCompositeScore) ? `${d.blendedCompositeScore.toFixed(1)} / 5` : 'Pending'}</span></header><p className="dim-insight">{getDimensionInsight(key, d.blendedCompositeScore)}</p><div className="source-chips">{toSourceChips(d.evidenceWeights).map((chip) => <span key={chip}>{chip}</span>)}</div></article>; })}</div></article>

        <article className="card"><h2>Evidence Summary</h2><div className="hes-evidence-table-wrap"><table className="hes-evidence-table"><thead><tr><th>Source</th><th>Status</th><th>What it contributes</th><th>Last completed</th><th>Action</th></tr></thead><tbody>{Object.values(profile.evidenceSources).map((s) => { const done = s.status === 'completed'; return <tr key={s.key}><td>{s.label}</td><td><span className={`status-badge ${done ? 'is-complete' : 'is-pending'}`}>{done ? 'Completed' : 'Pending'}</span></td><td>{s.contribution}</td><td>{s.latestUpdate || 'Not yet completed'}</td><td><Link href={done ? `/human-equation-suite/dashboard?tab=${reportTabs.find((t) => t.sourceKey === s.key)?.key || 'diagnostic'}` : s.route} className="button secondary">{done ? 'View Report' : 'Launch'}</Link></td></tr>; })}</tbody></table></div></article>

        <article className="card timeline-panel"><h2>Timeline / Trends</h2><p>{(profile.simulationHistory || []).map((event) => `${event.source} (${event.completedAt ? new Date(event.completedAt).toLocaleDateString('en-US') : 'pending'})`).join(' • ') || 'No timeline evidence yet.'}</p></article>

        <article className="card"><h2>Selected Report Detail</h2><div className="hes-report-selector">{reportTabs.map((tab) => <button key={tab.key} className={`button ${activeReport === tab.key ? 'primary' : 'secondary'}`} onClick={() => setActiveReport(tab.key)}>{tab.label}</button>)}</div>{reportExists ? <div className="top-space-sm"><p><strong>{report?.label}:</strong> {source?.contribution || urbanReport?.evidenceSummary}</p>{activeReport === 'urban' && urbanReport ? <p>{urbanReport.evidenceSummary}</p> : null}</div> : <div className="hes-empty-report"><p>No report evidence has been captured yet for {report?.label}.</p><Link href={source?.route || '/human-equation-suite/diagnostic'} className="button secondary">Launch Source</Link></div>}</article>
      </main>
    </div>
  </div></section>;
}
