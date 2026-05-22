'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import HumanEquationNav from '../../components/HumanEquationNav';
import { DASHBOARD_PROFILE_STORAGE_KEY, DIAGNOSTIC_RESULT_STORAGE_KEY, blendUrbanEvidenceIntoProfile, createEmptyMasterProfile, createInterpretation, dimensionDefinitions, factorPsychologyDefinitions, toMasterProfileFromDiagnostic } from './profileData';
import { URBAN_REPORT_STORAGE_KEY } from './urbanEvidence';

const toSourceChips = (weights = {}) => Object.entries(weights).filter(([, value]) => value > 0).map(([source]) => source === 'diagnostic' ? 'Diagnostic' : source === 'urbanSim' ? 'Urban' : source === 'parentCall' ? 'Parent Call' : source === 'leadershipSim' ? 'Leadership Sim' : source === 'observationLab' ? 'Observation' : source).slice(0, 3);
const statusLabel = (score) => score >= 4.1 ? 'Strong' : score >= 3.3 ? 'Stable' : score >= 2.6 ? 'Forming' : 'Fragile';
const meterClass = (score) => score >= 4 ? 'is-strong' : score >= 3 ? 'is-mid' : 'is-risk';

export default function HumanEquationDashboardPage() {
  const [profile, setProfile] = useState(createEmptyMasterProfile());

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
  const interpretation = profile.interpretation || {};
  const focusTitle = interpretation.mostFragileCapacity || growthEdge?.label || 'Trust Construction under urgency';
  const points = dimensionDefinitions.map(({ key }, idx) => {
    const d = profile.dimensions[key];
    const score = Number.isFinite(d?.blendedCompositeScore) ? d.blendedCompositeScore : 2.5;
    const angle = ((Math.PI * 2) / dimensionDefinitions.length) * idx - Math.PI / 2;
    const r = 50 + (score / 5) * 45;
    return `${100 + Math.cos(angle) * r},${100 + Math.sin(angle) * r}`;
  }).join(' ');

  return <section className="section section-light"><div className="container"><LanguageSwitcher /><HumanEquationNav />
    <div className="hes-app-layout top-space-sm">
      <aside className="hes-command-sidebar">
        <h3>Progression</h3>
        <div className="hes-stepper">
          {[{ t: 'Learn the 8 Factors', s: 'Completed', d: 'Framework foundation', c: 'done' }, { t: 'Leadership Diagnostic', s: 'Completed', d: 'Baseline pressure profile', c: 'done' }, { t: 'Practice Lab', s: 'Current', d: 'Simulations active', c: 'current' }, { t: 'Growth Center', s: 'Available', d: 'Track recovery over time', c: 'available' }].map((step, i) => <article className={`hes-step ${step.c}`} key={step.t}><div className="node">{step.c === 'done' ? '✓' : i + 1}</div><div><header><h4>{step.t}</h4><span className={`status-badge is-${step.c}`}>{step.s}</span></header><p>{step.d}</p></div></article>)}
        </div>
        <section><h3>Growth Center</h3><div className="quick-actions"><Link href="#" className="button secondary">Pressure Distortions</Link><Link href="#" className="button secondary">Recovery Practices</Link><Link href="#" className="button secondary">Evidence Timeline</Link><Link href="#" className="button secondary">Executive Reports</Link></div></section>
      </aside>
      <main className="hes-main-content">
        <article className="card hes-hero-profile hes-hero-shell"><div><p className="eyebrow">Executive Pressure Profile</p><h1>This is how your leadership psychology behaves under pressure.</h1><p>Leadership style explains how you prefer to lead. Leadership psychology shows what pressure does to perception, regulation, trust, and judgment.</p><p>{interpretation.summary}</p></div><div className="hes-mini-radar"><svg viewBox="0 0 200 200" role="img" aria-label="8 factor radar"><circle cx="100" cy="100" r="92"/><circle cx="100" cy="100" r="64"/><circle cx="100" cy="100" r="36"/><polygon points={points} /></svg><p><strong>Profile confidence:</strong> {Math.round((profile?.interpretation?.confidenceLevels?.blended || 0.74) * 100)}%</p></div></article>

        <section className="hes-insights-row">
          <article className="hes-insight-card stabilizer"><h3>Strongest stabilizer</h3><p>{interpretation.strongestCapacity || strongest?.label || 'Signal emerging'}</p></article>
          <article className="hes-insight-card distortion"><h3>Active pressure distortion</h3><p>{interpretation.pressureIdentity || 'Controller'} — {interpretation.trustUnderStress}</p></article>
          <article className="hes-insight-card tension"><h3>Current growth tension</h3><p>{focusTitle}</p></article>
          <article className="hes-insight-card recovery"><h3>Recommended recovery move</h3><p>{interpretation.recommendedCoachingFocus}</p></article>
        </section>

        <article className="card"><h2>The 8 Factors of Leadership Psychology</h2><div className="hes-factor-grid compact">{dimensionDefinitions.map(({ key }) => { const d = profile.dimensions[key]; const factor = factorPsychologyDefinitions[key]; const score = Number.isFinite(d?.blendedCompositeScore) ? d.blendedCompositeScore : null; return <article key={key} className="hes-factor-panel compact"><header><h3>{factor.title}</h3><span className="score-pill">{score ? `${score.toFixed(1)} / 5 · ${statusLabel(score)}` : 'Pending'}</span></header><div className="hes-mini-meter"><span className={meterClass(score || 0)} style={{ width: `${((score || 0) / 5) * 100}%` }} /></div><p>{factor.whatItMeasures}</p><p><strong>Pressure risk:</strong> {factor.pressureDistortion}</p><p><strong>Recovery move:</strong> {factor.recoveryPractice}</p><div className="source-chips">{toSourceChips(d?.evidenceWeights).length ? toSourceChips(d.evidenceWeights).map((chip) => <span key={chip}>{chip}</span>) : <span>Awaiting simulation evidence</span>}</div><details><summary>View deeper analysis</summary><p>{factor.currentInterpretation}</p><p>{factor.growthTrajectory}</p><p>{factor.evidenceLanguage}</p></details></article>; })}</div></article>

        <article className="card"><h2>Framework Course Placeholder</h2><div className="hes-compact-progress"><article className="card"><span className="status-badge is-available">Coming Soon</span><h3>Learn the 8 Factors</h3><p>Framework course module will launch here. Use the dashboard and practice lab for now.</p><Link className="button secondary" href="/human-equation-suite/learn">Preview Placeholder</Link></article></div></article>
      </main>
    </div>
  </div></section>;
}
