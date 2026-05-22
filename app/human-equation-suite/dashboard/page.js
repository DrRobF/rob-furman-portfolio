'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import HumanEquationNav from '../../components/HumanEquationNav';
import { DASHBOARD_PROFILE_STORAGE_KEY, DIAGNOSTIC_RESULT_STORAGE_KEY, blendUrbanEvidenceIntoProfile, createEmptyMasterProfile, createInterpretation, dimensionDefinitions, toMasterProfileFromDiagnostic } from './profileData';
import { DEV_PROFILE_PRESETS } from './devProfiles';
import { URBAN_REPORT_STORAGE_KEY } from './urbanEvidence';

const tabs = [
  { key: 'master', label: 'Master Profile' }, { key: 'diagnostic', label: 'Diagnostic Report' }, { key: 'parent-call', label: 'Parent Call Report' }, { key: 'leadership-simulation', label: 'Leadership Simulation Report' }, { key: 'urban', label: 'Urban Student Report' }, { key: 'observation-lab', label: 'Observation Lab' },
];
const layerKey = (index) => index < 3 ? 'foundational' : index < 5 ? 'applied' : 'organizational';
const layerMeta = { foundational: { cls: 'dim-foundational', color: '#2563eb' }, applied: { cls: 'dim-applied', color: '#0f766e' }, organizational: { cls: 'dim-organizational', color: '#7c3aed' } };
const confidenceLabel = (v) => v ? v.replaceAll('_', ' ').replace(/^./, (c) => c.toUpperCase()) : 'Needs evidence';
const toSourceChips = (weights = {}) => Object.entries(weights).filter(([, value]) => value > 0).map(([source]) => source === 'diagnostic' ? 'Diagnostic' : source === 'urbanSim' ? 'Urban' : source === 'parentCall' ? 'Parent Call' : source === 'leadershipSim' ? 'Leadership Sim' : source === 'observationLab' ? 'Observation' : source).slice(0, 3);

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

  const loadDevProfile = (profileKey) => {
    setSelectedDevProfile(profileKey);
    const preset = DEV_PROFILE_PRESETS.find((item) => item.key === profileKey);
    if (!preset) return;
    const interpreted = { ...preset.profile, interpretation: createInterpretation(preset.profile, diagnostic, urbanReport) };
    setProfile(interpreted);
    if (typeof window !== 'undefined') window.localStorage.setItem(DASHBOARD_PROFILE_STORAGE_KEY, JSON.stringify(interpreted));
  };

  const sorted = useMemo(() => Object.values(profile.dimensions).filter((d) => Number.isFinite(d.blendedCompositeScore)).sort((a, b) => b.blendedCompositeScore - a.blendedCompositeScore), [profile]);
  const strongest = sorted[0];
  const growthEdge = sorted[sorted.length - 1];
  const completedSources = Object.values(profile.evidenceSources).filter((s) => s.status === 'completed').length;
  const interpretation = profile.interpretation || {};

  return <section className="section section-light"><div className="container"><LanguageSwitcher /><HumanEquationNav />
    <div className="hes-dashboard-shell top-space-sm">
      <div className="dashboard-hero">
        <p className="eyebrow">Human Equation Dashboard</p><h1>Leadership Pressure Profile</h1>
        <p className="lead">{interpretation.summary || 'Executive view of leadership capacities, pressure drift, and multi-source evidence.'}</p>
      </div>

      <article className="card leadership-intel-panel top-space-sm">
        <h2>Leadership Intelligence Summary</h2>
        <p>{interpretation.summary}</p>
        <div className="intel-grid">
          <div><h4>Strongest current pattern</h4><p>{interpretation.emergingPattern || strongest?.growthNote}</p></div>
          <div><h4>Most important growth tension</h4><p>{interpretation.keyContradiction || interpretation.mostFragileCapacity}</p></div>
          <div><h4>One clear next action</h4><p>{interpretation.nextBestStep || profile.recommendations?.nextSimulation}</p></div>
        </div>
      </article>

      <div className="hes-kpi-strip top-space-sm">
        <article className="kpi-card kpi-blue"><p>Profile confidence</p><h3>{Math.round(profile.confidenceLevels.blended * 100)}%</h3></article>
        <article className="kpi-card kpi-green"><p>Evidence sources completed</p><h3>{completedSources} / {Object.keys(profile.evidenceSources).length}</h3></article>
        <article className="kpi-card kpi-purple"><p>Strongest capacity</p><h3>{interpretation.strongestCapacity || strongest?.label || 'Awaiting signal'}</h3></article>
        <article className="kpi-card kpi-teal"><p>Most fragile capacity</p><h3>{interpretation.mostFragileCapacity || growthEdge?.label || 'Collect baseline'}</h3></article>
      </div>

      <div className="hes-dimension-grid top-space">
        {dimensionDefinitions.map(({ key, label }, i) => { const d = profile.dimensions[key]; const m = layerMeta[layerKey(i)]; return <article key={key} className={`dimension-tile ${m.cls}`}><header><h3>{label}</h3><span className="score-pill">{Number.isFinite(d.blendedCompositeScore) ? `${d.blendedCompositeScore.toFixed(1)} / 5` : 'Pending'}</span></header><div className="tile-meta"><span className="status-chip">{confidenceLabel(d.confidence)}</span></div><p className="dim-insight">{d.growthNote || 'Signal forming with current evidence.'}</p><div className="source-chips">{toSourceChips(d.evidenceWeights).map((chip) => <span key={chip}>{chip}</span>)}</div><progress max="100" value={d.statusProgress} style={{ accentColor: m.color }} /></article>; })}
      </div>

      <div className="hes-evidence-grid top-space">
        {Object.values(profile.evidenceSources).map((source) => { const completed = source.status === 'completed'; return <article key={source.key} className={`evidence-card ${completed ? 'is-complete' : 'is-pending'}`}><div className="evidence-header"><h3>{source.label}</h3><span className="status-chip">{completed ? 'Completed' : 'Not Started'}</span></div><p>{source.contribution}</p><p><strong>Latest date:</strong> {source.latestUpdate}</p><Link href={source.key === 'urbanSim' && completed ? '/human-equation-suite/dashboard?tab=urban' : source.route} className="button secondary">{completed ? 'View Report' : 'Launch'}</Link></article>; })}
      </div>

      <article className="card top-space">
        <h2>Pressure Distortions & Recovery Practice</h2>
        <div className="card-grid">{(interpretation.pressureIdentityDetails || []).map((item) => <article key={item.name} className="card"><h3>{item.name}</h3><p><strong>Drift pattern:</strong> {item.pattern}</p><p><strong>What it may look like:</strong> {item.looksLike}</p><p><strong>Why it matters:</strong> {item.why}</p><p><strong>What to practice next:</strong> {item.practice}</p></article>)}</div>
      </article>

      <article className="card top-space">
        <h2>Recommended Practice Focus</h2>
        <div className="card-grid">
          <article className="card"><h3>Immediate practice move</h3><p>{interpretation.recommendedCoachingFocus}</p></article>
          <article className="card"><h3>Next simulation to run</h3><p>{profile.recommendations?.nextSimulation || 'Parent Call Rehearsal'}</p></article>
          <article className="card"><h3>Reflection question</h3><p>{interpretation.reflectionQuestion}</p></article>
        </div>
      </article>

      <div className="top-space hes-dashboard-tabs">{tabs.map((tab) => <button key={tab.key} className={`button ${activeTab === tab.key ? 'primary' : 'secondary'}`} onClick={() => setActiveTab(tab.key)}>{tab.label}</button>)}</div>

      <article className="card timeline-panel top-space"><h2>Timeline + Trends</h2><p>{(profile.simulationHistory || []).map((event) => `${event.source} (${event.completedAt ? new Date(event.completedAt).toLocaleDateString('en-US') : 'pending'})`).join(' • ')}</p><p>Future: Parent call rehearsal pending • Future: Leadership simulation pending</p></article>

    </div>
  </div></section>;
}
