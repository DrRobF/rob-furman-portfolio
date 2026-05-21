'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { DASHBOARD_PROFILE_STORAGE_KEY, DIAGNOSTIC_RESULT_STORAGE_KEY, createEmptyMasterProfile, dimensionDefinitions, toMasterProfileFromDiagnostic } from './profileData';

const confidenceLabel = { high: 'High confidence', moderate: 'Baseline confidence', early: 'Early signal', needs_more_evidence: 'Needs more evidence' };

export default function HumanEquationDashboardPage() {
  const [profile, setProfile] = useState(createEmptyMasterProfile());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cached = window.localStorage.getItem(DASHBOARD_PROFILE_STORAGE_KEY);
    if (cached) {
      try { setProfile(JSON.parse(cached)); return; } catch {}
    }
    const diagnosticRaw = window.localStorage.getItem(DIAGNOSTIC_RESULT_STORAGE_KEY);
    if (!diagnosticRaw) return;
    try {
      const parsed = JSON.parse(diagnosticRaw);
      const built = toMasterProfileFromDiagnostic(parsed);
      setProfile(built);
      window.localStorage.setItem(DASHBOARD_PROFILE_STORAGE_KEY, JSON.stringify(built));
    } catch {}
  }, []);

  const strongest = useMemo(() => Object.values(profile.dimensions).filter((d) => Number.isFinite(d.blendedCompositeScore)).sort((a, b) => b.blendedCompositeScore - a.blendedCompositeScore).slice(0, 2).map((d) => d.label), [profile]);

  return (
    <section className="section section-light">
      <div className="container">
        <LanguageSwitcher />
        <div className="card project-card" style={{ border: '1px solid rgba(10,20,40,0.12)' }}>
          <p className="eyebrow">Human Equation Dashboard</p>
          <h1>Leadership Pressure Profile</h1>
          <p className="lead">A living leadership profile that strengthens as each simulation adds behavioral evidence.</p>
          <div className="card-grid top-space-sm">
            <div className="card"><p><strong>Baseline confidence</strong></p><p>{Math.round(profile.confidenceLevels.baseline * 100)}%</p></div>
            <div className="card"><p><strong>Strongest dimensions</strong></p><p>{strongest.length ? strongest.join(' • ') : 'Awaiting baseline signal'}</p></div>
            <div className="card"><p><strong>Emerging pressure risks</strong></p><p>{profile.distortions.emerging[0] || 'Needs more evidence'}</p></div>
            <div className="card"><p><strong>Last completed simulation</strong></p><p>{profile.simulationHistory.at(-1)?.source ? `${profile.simulationHistory.at(-1).source}` : 'Leadership Diagnostic'}</p></div>
            <div className="card"><p><strong>Next recommended simulation</strong></p><p>{profile.recommendations.nextSimulation}</p></div>
          </div>
          <p className="top-space-sm"><em>Profile evolves as simulations add behavioral evidence.</em></p>
        </div>
      </div>

      <div className="container top-space">
        <h2>8-Dimension Leadership Grid</h2>
        <div className="card-grid top-space-sm">
          {dimensionDefinitions.map((dimension) => {
            const item = profile.dimensions[dimension.key];
            return <article key={dimension.key} className="card project-card equal-card"><h3>{dimension.label}</h3><p>Diagnostic composite score: {Number.isFinite(item.blendedCompositeScore) ? `${item.blendedCompositeScore} / 5` : 'Pending baseline'}</p><p>{Number.isFinite(item.blendedCompositeScore) ? 'Diagnostic baseline' : confidenceLabel[item.confidence]}</p><p>Trend: {Number.isFinite(item.blendedCompositeScore) ? 'Baseline established' : item.trend}</p><p>Strongest evidence source: {Number.isFinite(item.blendedCompositeScore) ? 'Leadership Diagnostic' : item.strongestEvidenceSource}</p><progress max="100" value={item.statusProgress} style={{ width: '100%' }} /></article>;
          })}
        </div>
      </div>

      <div className="container top-space">
        <h2>Evidence Sources</h2>
        <div className="card-grid top-space-sm">
          {Object.values(profile.evidenceSources).map((source) => <article key={source.key} className="card project-card equal-card"><h3>{source.label}</h3><p>Completion status: {source.status.replace('_', ' ')}</p><p>Evidence contribution: {source.contribution}</p><p>Latest update: {source.latestUpdate}</p><Link href={source.route} className="button secondary">{source.key === 'diagnostic' ? (source.status === 'completed' ? 'View Diagnostic / Retake Diagnostic' : 'View Diagnostic / Retake Diagnostic') : (source.status === 'completed' ? 'Open' : 'Launch')}</Link></article>)}
        </div>
      </div>

      <div className="container top-space">
        <h2>Pressure Distortions</h2>
        <div className="card-grid top-space-sm">
          <article className="card"><p className="eyebrow">Emerging under pressure</p><p>{profile.distortions.emerging[0] || 'No clear distortion signature yet.'}</p></article>
          <article className="card"><p className="eyebrow">Mild tendency</p><p>{profile.distortions.mild[0] || 'Mild tendency'}</p></article>
          <article className="card"><p className="eyebrow">Needs simulation confirmation</p><p>{profile.distortions.needsMoreEvidence[0]}</p></article>
        </div>
      </div>

      <div className="container top-space">
        <h2>Growth & Pattern Tracking</h2>
        <p>Patterns become clearer as more simulations are completed.</p>
        <div className="card-grid top-space-sm">
          <article className="card project-card"><h3>Timeline</h3><p>Leadership Diagnostic baseline captured{profile.simulationHistory[0]?.completedAt ? ` (${new Date(profile.simulationHistory[0].completedAt).toLocaleString('en-US')})` : '.'}</p></article>
          <article className="card project-card"><h3>Pattern cards</h3><p>Future cards will track recurring pressure responses, trust moves, and leadership adaptations.</p></article>
          <article className="card project-card"><h3>Profile visualization area</h3><p>Reserved for blended leadership profile visualization (radar/trend layer).</p></article>
        </div>
      </div>
    </section>
  );
}
