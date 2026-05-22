'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import HumanEquationNav from '../../components/HumanEquationNav';
import { DASHBOARD_PROFILE_STORAGE_KEY, DIAGNOSTIC_RESULT_STORAGE_KEY, blendUrbanEvidenceIntoProfile, createEmptyMasterProfile, dimensionDefinitions, toMasterProfileFromDiagnostic } from './profileData';
import { DEV_PROFILE_PRESETS } from './devProfiles';
import { URBAN_REPORT_STORAGE_KEY } from './urbanEvidence';

const tabs = [
  { key: 'master', label: 'Master Profile' }, { key: 'diagnostic', label: 'Diagnostic Report' }, { key: 'parent-call', label: 'Parent Call Report' }, { key: 'leadership-simulation', label: 'Leadership Simulation Report' }, { key: 'urban', label: 'Urban Student Report' }, { key: 'observation-lab', label: 'Observation Lab' },
];
const layerKey = (index) => index < 3 ? 'foundational' : index < 5 ? 'applied' : 'organizational';
const layerMeta = { foundational: { cls: 'dim-foundational', color: '#2563eb' }, applied: { cls: 'dim-applied', color: '#0f766e' }, organizational: { cls: 'dim-organizational', color: '#7c3aed' } };

export default function HumanEquationDashboardPage() {
  const [profile, setProfile] = useState(createEmptyMasterProfile());
  const [diagnostic, setDiagnostic] = useState(null);
  const [urbanReport, setUrbanReport] = useState(null);
  const [activeTab, setActiveTab] = useState('master');
  const [selectedDevProfile, setSelectedDevProfile] = useState('');
  const isDevMode = process.env.NODE_ENV !== 'production';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const requested = new URLSearchParams(window.location.search).get('tab');
    if (requested && tabs.some((tab) => tab.key === requested)) setActiveTab(requested);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const rawDiagnostic = window.localStorage.getItem(DIAGNOSTIC_RESULT_STORAGE_KEY);
    if (rawDiagnostic) { try { setDiagnostic(JSON.parse(rawDiagnostic)); } catch {} }
    const rawUrbanReport = window.localStorage.getItem(URBAN_REPORT_STORAGE_KEY);
    if (rawUrbanReport) { try { setUrbanReport(JSON.parse(rawUrbanReport)); } catch {} }
    const cached = window.localStorage.getItem(DASHBOARD_PROFILE_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (rawUrbanReport) {
          const blended = blendUrbanEvidenceIntoProfile(parsed, JSON.parse(rawUrbanReport));
          setProfile(blended);
          window.localStorage.setItem(DASHBOARD_PROFILE_STORAGE_KEY, JSON.stringify(blended));
          return;
        }
        setProfile(parsed); return;
      } catch {}
    }
    if (!rawDiagnostic) return;
    try {
      const built = toMasterProfileFromDiagnostic(JSON.parse(rawDiagnostic));
      setProfile(built);
      window.localStorage.setItem(DASHBOARD_PROFILE_STORAGE_KEY, JSON.stringify(built));
    } catch {}
  }, []);

  const loadDevProfile = (profileKey) => {
    setSelectedDevProfile(profileKey);
    const preset = DEV_PROFILE_PRESETS.find((item) => item.key === profileKey);
    if (!preset) return;
    setProfile(preset.profile);
    if (typeof window !== 'undefined') window.localStorage.setItem(DASHBOARD_PROFILE_STORAGE_KEY, JSON.stringify(preset.profile));
  };

  const strongest = useMemo(() => Object.values(profile.dimensions).filter((d) => Number.isFinite(d.blendedCompositeScore)).sort((a, b) => b.blendedCompositeScore - a.blendedCompositeScore)[0], [profile]);
  const growthEdge = useMemo(() => Object.values(profile.dimensions).filter((d) => Number.isFinite(d.blendedCompositeScore)).sort((a, b) => a.blendedCompositeScore - b.blendedCompositeScore)[0], [profile]);
  const completedSources = Object.values(profile.evidenceSources).filter((s) => s.status === 'completed').length;

  return <section className="section section-light"><div className="container"><LanguageSwitcher /><HumanEquationNav />
    <div className="hes-dashboard-shell top-space-sm">
      <div className="dashboard-hero">
        <p className="eyebrow">Human Equation Dashboard</p><h1>Leadership Pressure Profile</h1>
        <p className="lead">{profile.interpretation?.summary || 'Executive view of leadership capacities, pressure drift, and multi-source evidence.'}</p>
      </div>

      <div className="hes-kpi-strip">
        <article className="kpi-card kpi-blue"><p>Profile confidence</p><h3>{Math.round(profile.confidenceLevels.baseline * 100)}%</h3></article>
        <article className="kpi-card kpi-green"><p>Evidence sources completed</p><h3>{completedSources} / {Object.keys(profile.evidenceSources).length}</h3></article>
        <article className="kpi-card kpi-purple"><p>Strongest dimension</p><h3>{strongest?.label || 'Awaiting signal'}</h3></article>
        <article className="kpi-card kpi-teal"><p>Growth edge</p><h3>{growthEdge?.label || 'Collect baseline'}</h3></article>
        <article className="kpi-card kpi-rose"><p>Current pressure drift</p><h3>{profile.distortions.emerging[0] || 'Low drift signal'}</h3></article>
        <article className="kpi-card kpi-amber"><p>Recommended next action</p><h3>{profile.recommendations?.nextSimulation || 'Start Parent Call'}</h3></article>
      </div>

      <div className="hes-profile-row top-space">
        <article className="card leadership-snapshot"><h2>Leadership Profile Snapshot</h2><p>{profile.interpretation?.summary || 'Synthesis updates as evidence accumulates.'}</p><p><strong>Strongest pattern:</strong> {strongest?.growthNote || 'No clear pattern yet.'}</p><p><strong>Growth warning:</strong> {profile.distortions.emerging[0] || 'No strong risk pattern yet.'}</p><p><strong>Confidence note:</strong> {profile.interpretation?.confidenceNarrative || 'Confidence rises with more evidence.'}</p></article>
        <article className="card profile-chart"><h2>Visual Profile Chart</h2>{dimensionDefinitions.map(({ key, label }, i) => { const score = profile.dimensions[key]?.blendedCompositeScore || 0; const meta = layerMeta[layerKey(i)]; return <div key={key} className="bar-row"><div className="bar-label">{label}</div><div className="bar-track"><div className={`bar-fill ${meta.cls}`} style={{ width: `${(score / 5) * 100}%` }} /></div><span>{score ? score.toFixed(1) : '—'}</span></div>; })}</article>
      </div>

      <div className="hes-dimension-grid top-space">
        {dimensionDefinitions.map(({ key, label }, i) => { const d = profile.dimensions[key]; const m = layerMeta[layerKey(i)]; return <article key={key} className={`dimension-tile ${m.cls}`}><header><h3>{label}</h3><span className="score-pill">{Number.isFinite(d.blendedCompositeScore) ? `${d.blendedCompositeScore.toFixed(1)} / 5` : 'Pending'}</span></header><div className="tile-meta"><span>{d.confidence.replaceAll('_', ' ')}</span><span>{d.strongestEvidenceSource}</span></div><p>{d.growthNote || 'Signal forming.'}</p><progress max="100" value={d.statusProgress} style={{ accentColor: m.color }} /></article>; })}
      </div>

      <div className="hes-evidence-grid top-space">
        {Object.values(profile.evidenceSources).map((source) => { const completed = source.status === 'completed'; return <article key={source.key} className={`evidence-card ${completed ? 'is-complete' : 'is-pending'}`}><div className="evidence-header"><h3>{source.label}</h3><span className="status-chip">{completed ? 'Completed' : 'Not Started'}</span></div><p><strong>Feeds dimensions:</strong> {source.contribution}</p><p><strong>Latest date:</strong> {source.latestUpdate}</p><Link href={source.key === 'urbanSim' && completed ? '/human-equation-suite/dashboard?tab=urban' : source.route} className="button secondary">{completed ? 'View Report' : 'Launch'}</Link></article>; })}
      </div>

      <div className="top-space-sm hes-dashboard-tabs">{tabs.map((tab) => <button key={tab.key} className={`button ${activeTab === tab.key ? 'primary' : 'secondary'}`} onClick={() => setActiveTab(tab.key)}>{tab.label}</button>)}</div>

      <article className="card timeline-panel top-space-sm"><h2>Timeline + Trends</h2><p>{profile.simulationHistory.map((event) => `${event.source} (${event.completedAt ? new Date(event.completedAt).toLocaleDateString('en-US') : 'pending'})`).join(' • ') || 'No timeline events yet.'}</p><p><strong>Growth notes:</strong> {(profile.growthNotes || []).join(' ') || 'Additional completed sources unlock trend recommendations.'}</p></article>

      {activeTab === 'diagnostic' && <article className="card hes-report-panel top-space-sm"><h2>Diagnostic Report</h2>{!diagnostic ? <><p>Diagnostic not completed yet.</p><Link href="/human-equation-suite/diagnostic" className="button primary">Take Diagnostic</Link></> : <><p><strong>Summary:</strong> {diagnostic.pressureProfileTitle}</p><div className="card-grid"><article className="card"><h3>Dimension Contribution</h3><p>{dimensionDefinitions.map((d) => `${d.label}: ${diagnostic.dimensions?.[d.key]?.composite ?? 'N/A'}`).join(' • ')}</p></article><article className="card"><h3>Distortions</h3><p>{diagnostic.topDistortions?.join(', ') || 'No clear distortion signature yet.'}</p></article><article className="card"><h3>Growth Recommendations</h3><p>{diagnostic.growthEdges?.join(', ') || 'Awaiting clearer growth edge signal.'}</p></article></div></>}</article>}

      {activeTab === 'urban' && <article className="card hes-report-panel top-space-sm"><h2>Urban Student Report</h2>{!urbanReport ? <><p>Urban Student Simulation has not been completed yet.</p><Link href="/day-in-the-life-urban-student" className="button secondary">Launch Urban Student Simulation</Link></> : <><p>{urbanReport.evidenceSummary}</p><div className="card-grid">{dimensionDefinitions.map(({ key, label }) => <article key={key} className="card"><h3>{label}</h3><p>{urbanReport.dimensions?.[key]?.narrative || 'Behavioral evidence still forming.'}</p></article>)}</div></>}</article>}

      {activeTab !== 'master' && activeTab !== 'diagnostic' && activeTab !== 'urban' && <article className="card hes-report-panel top-space-sm"><h2>{tabs.find((t) => t.key === activeTab)?.label}</h2><p>{activeTab === 'parent-call' ? 'No parent call report captured yet.' : activeTab === 'leadership-simulation' ? 'No leadership simulation report captured yet.' : 'No observation lab report captured yet.'}</p><Link href={activeTab === 'parent-call' ? '/human-equation' : activeTab === 'leadership-simulation' ? '/simulation-overview' : '/human-equation-suite/dashboard'} className="button secondary">Launch</Link></article>}

      {isDevMode && <div className="top-space-sm"><label htmlFor="dev-profile"><strong>Load Dev Profile:</strong></label> <select id="dev-profile" value={selectedDevProfile} onChange={(e) => loadDevProfile(e.target.value)}><option value="">Select preset...</option>{DEV_PROFILE_PRESETS.map((preset) => <option key={preset.key} value={preset.key}>{preset.label}</option>)}</select></div>}
    </div>
  </div></section>;
}
