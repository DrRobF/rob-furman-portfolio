'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { DASHBOARD_PROFILE_STORAGE_KEY, DIAGNOSTIC_RESULT_STORAGE_KEY, createEmptyMasterProfile, dimensionDefinitions, toMasterProfileFromDiagnostic } from './profileData';
import { DEV_PROFILE_PRESETS } from './devProfiles';

const tabs = [
  { key: 'master', label: 'Master Profile' },
  { key: 'diagnostic', label: 'Diagnostic Report' },
  { key: 'parent-call', label: 'Parent Call Report' },
  { key: 'leadership-simulation', label: 'Leadership Simulation Report' },
  { key: 'urban-student', label: 'Urban Student Report' },
  { key: 'observation-lab', label: 'Observation Lab' },
];
const layerStyles = {
  foundational: { bg: 'rgba(59,130,246,0.08)', border: '4px solid #3b82f6' },
  applied: { bg: 'rgba(20,184,166,0.10)', border: '4px solid #0f766e' },
  organizational: { bg: 'rgba(139,92,246,0.10)', border: '4px solid #7c3aed' },
};
const layerKey = (index) => index < 3 ? 'foundational' : index < 5 ? 'applied' : 'organizational';

export default function HumanEquationDashboardPage() {
  const [profile, setProfile] = useState(createEmptyMasterProfile());
  const [diagnostic, setDiagnostic] = useState(null);
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
    if (rawDiagnostic) {
      try { setDiagnostic(JSON.parse(rawDiagnostic)); } catch {}
    }

    const cached = window.localStorage.getItem(DASHBOARD_PROFILE_STORAGE_KEY);
    if (cached) {
      try { setProfile(JSON.parse(cached)); return; } catch {}
    }
    if (!rawDiagnostic) return;
    try {
      const parsed = JSON.parse(rawDiagnostic);
      const built = toMasterProfileFromDiagnostic(parsed);
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

  const strongest = useMemo(() => Object.values(profile.dimensions).filter((d) => Number.isFinite(d.blendedCompositeScore)).sort((a, b) => b.blendedCompositeScore - a.blendedCompositeScore).slice(0, 2).map((d) => d.label), [profile]);

  return <section className="section section-light"><div className="container"><LanguageSwitcher />
    <div className="card project-card" style={{ border: '1px solid rgba(37,99,235,0.18)', background: 'linear-gradient(120deg, #eef4ff, #f8fafc)' }}>
      <p className="eyebrow">Human Equation Dashboard</p><h1>Leadership Pressure Profile</h1><p className="lead">{profile.interpretation?.summary || 'Central home for all Human Equation reports, diagnostics, and simulation evidence.'}</p>
      {isDevMode && <div className="top-space-sm" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}><label htmlFor="dev-profile"><strong>Load Dev Profile</strong></label><select id="dev-profile" value={selectedDevProfile} onChange={(e) => loadDevProfile(e.target.value)} style={{ padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #93c5fd' }}><option value="">Select preset...</option>{DEV_PROFILE_PRESETS.map((preset) => <option key={preset.key} value={preset.key}>{preset.label}</option>)}</select></div>}
      <div className="card-grid top-space-sm">
        <div className="card"><p><strong>Baseline confidence</strong></p><p>{Math.round(profile.confidenceLevels.baseline * 100)}%</p></div>
        <div className="card"><p><strong>Strongest dimensions</strong></p><p>{strongest.length ? strongest.join(' • ') : 'Awaiting baseline signal'}</p></div>
        <div className="card"><p><strong>Emerging pressure risks</strong></p><p>{profile.distortions.emerging[0] || profile.interpretation?.confidenceNarrative}</p></div>
        <div className="card"><p><strong>Last completed source</strong></p><p>{profile.simulationHistory.at(-1)?.source || 'No reports completed yet'}</p></div>
      </div>
    </div>

    <div className="top-space-sm" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{tabs.map((tab) => <button key={tab.key} className={`button ${activeTab === tab.key ? 'primary' : 'secondary'}`} onClick={() => setActiveTab(tab.key)}>{tab.label}</button>)}</div>

    {activeTab === 'master' && <>
      <div className="top-space"><h2>8-Dimension Leadership Grid</h2><div className="card-grid top-space-sm">{dimensionDefinitions.map((dimension, index) => {
        const item = profile.dimensions[dimension.key];
        const layer = layerStyles[layerKey(index)];
        return <article key={dimension.key} className="card project-card equal-card" style={{ background: layer.bg, borderLeft: layer.border }}><h3>{dimension.label}</h3><p><strong>Baseline</strong> {Number.isFinite(item.baselineDiagnosticScore) ? `${item.baselineDiagnosticScore} / 5` : 'Pending baseline'}</p><p><strong>Simulation</strong> {Number.isFinite(item.simulationEvidenceScore) ? `${item.simulationEvidenceScore} / 5` : 'Pending simulation'}</p><p><strong>Blended</strong> {Number.isFinite(item.blendedCompositeScore) ? `${item.blendedCompositeScore} / 5` : 'Pending blend'}</p><p><strong>Confidence</strong> {item.confidence.replaceAll('_', ' ')}</p><p><strong>Source</strong> {item.strongestEvidenceSource}</p><p><strong>Growth note</strong> {item.growthNote || 'Continue collecting evidence for clearer growth signals.'}</p><progress max="100" value={item.statusProgress} style={{ width: '100%', accentColor: layer.border.split(' ')[2] }} /></article>;
      })}</div></div>

      <div className="top-space"><h2>Evidence Sources</h2><div className="card-grid top-space-sm">{Object.values(profile.evidenceSources).map((source) => {
        const completed = source.status === 'completed';
        return <article key={source.key} className="card project-card equal-card" style={{ opacity: completed ? 1 : 0.82, borderTop: completed ? '4px solid #16a34a' : '4px solid #cbd5e1' }}><h3>{source.label}</h3><p><strong>Status:</strong> {completed ? 'Completed' : 'Not started'}</p><p><strong>Contribution:</strong> {source.contribution}</p><p><strong>Date:</strong> {source.latestUpdate}</p><Link href={source.route} className="button secondary">{completed ? 'View report' : 'Launch'}</Link></article>;
      })}</div></div>

      <div className="top-space"><h2>Pressure Distortions</h2><div className="card-grid top-space-sm"><article className="card" style={{ background: 'rgba(251,191,36,0.12)' }}><p className="eyebrow">Emerging</p><p>{profile.distortions.emerging[0] || 'No clear distortion signature yet.'}</p></article><article className="card" style={{ background: 'rgba(251,113,133,0.10)' }}><p className="eyebrow">Mild tendency</p><p>{profile.distortions.mild[0] || 'Mild tendency'}</p></article><article className="card" style={{ background: 'rgba(251,191,36,0.08)' }}><p className="eyebrow">Needs more evidence</p><p>{profile.distortions.needsMoreEvidence[0] || profile.interpretation?.confidenceNarrative}</p></article></div></div>
    </>}

    {activeTab === 'diagnostic' && <div className="top-space card project-card">{!diagnostic ? <><h2>Diagnostic Report</h2><p>Diagnostic not completed yet.</p><Link href="/human-equation-suite/diagnostic" className="button primary">Take Diagnostic</Link></> : <><h2>{diagnostic.pressureProfileTitle || 'Diagnostic Report'}</h2><p><strong>Date completed:</strong> {diagnostic.completedAt ? new Date(diagnostic.completedAt).toLocaleString('en-US') : 'Unavailable'}</p><p><strong>Leadership Pressure Profile:</strong> {diagnostic.pressureProfileTitle}</p><h3>Framework layer scores</h3><div className="card-grid top-space-sm">{dimensionDefinitions.map(({ key, label }) => <article key={key} className="card"><p><strong>{label}</strong></p><p>Composite: {diagnostic.dimensions?.[key]?.composite ?? 'N/A'} / 5</p></article>)}</div><h3 className="top-space-sm">Pressure distortions</h3><p>{diagnostic.topDistortions?.length ? diagnostic.topDistortions.join(', ') : 'No clear distortion signature yet'}</p><h3 className="top-space-sm">Strengths</h3><p>{diagnostic.topStrengths?.join(', ') || 'Awaiting signal'}</p><h3 className="top-space-sm">Growth edges</h3><p>{diagnostic.growthEdges?.join(', ') || 'Awaiting signal'}</p><h3 className="top-space-sm">Recommended next simulation</h3><p>{diagnostic.recommendedNextStep || 'Parent Call Rehearsal'}</p></>}</div>}

    {activeTab === 'master' && <div className="top-space"><h2>Growth + Timeline</h2><div className="card-grid top-space-sm"><article className="card"><p className="eyebrow">Growth edges</p><p>{(profile.growthEdges || []).join(' • ') || 'Evidence still forming for growth edge detection.'}</p></article><article className="card"><p className="eyebrow">Growth notes</p><p>{(profile.growthNotes || []).join(' ') || 'Collect additional scenario evidence for sharper coaching notes.'}</p></article><article className="card"><p className="eyebrow">Timeline</p><p>{profile.simulationHistory.map((event) => `${event.source} (${event.completedAt ? new Date(event.completedAt).toLocaleDateString('en-US') : 'pending'})`).join(' • ') || 'No timeline events yet.'}</p></article></div></div>}

    {activeTab !== 'master' && activeTab !== 'diagnostic' && <div className="top-space card project-card"><h2>{tabs.find((t) => t.key === activeTab)?.label}</h2><p>{activeTab === 'parent-call' ? 'No parent call report captured yet.' : activeTab === 'leadership-simulation' ? 'No leadership simulation report captured yet.' : activeTab === 'urban-student' ? 'No urban student report captured yet.' : 'No observation lab report captured yet.'}</p><Link href={activeTab === 'parent-call' ? '/human-equation' : activeTab === 'leadership-simulation' ? '/simulation-overview' : activeTab === 'urban-student' ? '/day-in-the-life-urban-student' : '/human-equation-suite/dashboard'} className="button secondary">Launch</Link></div>}
  </div></section>;
}
