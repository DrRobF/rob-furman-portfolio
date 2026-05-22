'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import HumanEquationNav from '../../components/HumanEquationNav';
import { DASHBOARD_PROFILE_STORAGE_KEY, DIAGNOSTIC_RESULT_STORAGE_KEY, blendUrbanEvidenceIntoProfile, createEmptyMasterProfile, createInterpretation, dimensionDefinitions, factorPsychologyDefinitions, toMasterProfileFromDiagnostic } from './profileData';
import { URBAN_REPORT_STORAGE_KEY } from './urbanEvidence';

const reportTabs = [
  { key: 'diagnostic', label: 'Diagnostic Report', sourceKey: 'diagnostic' },
  { key: 'parent-call', label: 'Parent Call Report', sourceKey: 'parentCall' },
  { key: 'leadership-simulation', label: 'Leadership Simulation Report', sourceKey: 'leadershipSim' },
  { key: 'urban', label: 'Urban Student Report', sourceKey: 'urbanSim' },
  { key: 'observation-lab', label: 'Observation Lab', sourceKey: 'observationLab' },
];

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
        <section><h3>Progression</h3><ul><li>1. Learn the 8 Factors</li><li>Build the language of leadership psychology before entering the simulations.</li><li>2. Leadership Diagnostic</li><li>Establish your baseline pressure profile.</li><li>3. Practice Lab</li><li>Stress-test your leadership psychology in realistic human scenarios.</li><li>4. Growth Center</li><li>Track distortions, recovery patterns, evidence, and growth over time.</li></ul></section>
        <section><h3>Growth Center</h3><ul><li>Pressure Distortions</li><li>Recovery Practices</li><li>Evidence Timeline</li><li>Executive Reports</li></ul></section>
      </aside>
      <main className="hes-main-content">
        <article className="card hes-hero-profile"><p className="eyebrow">Executive Pressure Profile</p><h1>This is how your leadership psychology behaves under pressure.</h1><p>Leadership style explains how you prefer to lead. Leadership psychology shows what pressure does to your perception, regulation, trust, and judgment when the situation becomes human, urgent, and unclear.</p><p>{interpretation.summary}</p><div className="hes-hero-grid"><div><h3>Strongest stabilizer</h3><p>{interpretation.strongestCapacity || strongest?.label || 'Signal emerging'}</p></div><div><h3>Active pressure distortion</h3><p>{interpretation.pressureIdentity || 'Controller'} — {interpretation.trustUnderStress}</p></div><div><h3>Current growth tension</h3><p>{focusTitle}</p></div><div><h3>Recommended recovery move</h3><p>{interpretation.recommendedCoachingFocus}</p></div></div></article>
        <article className="card"><h2>The 8 Factors of Leadership Psychology</h2><div className="hes-factor-grid">{dimensionDefinitions.map(({ key }) => { const d = profile.dimensions[key]; const factor = factorPsychologyDefinitions[key]; return <article key={key} className="hes-factor-panel"><header><h3>{factor.title}</h3><span className="score-pill">{Number.isFinite(d.blendedCompositeScore) ? `${d.blendedCompositeScore.toFixed(1)} / 5` : 'Pending'}</span></header><p><strong>What this factor reveals:</strong> {factor.whatItMeasures}</p><p><strong>Under pressure, this can distort as…</strong> {factor.pressureDistortion}</p><p><strong>What strong functioning looks like:</strong> {factor.healthyFunctioning}</p><p><strong>Recovery move:</strong> {factor.recoveryPractice}</p><p><strong>Evidence currently seen:</strong> {factor.evidenceLanguage} {toSourceChips(d.evidenceWeights).join(', ') || 'Awaiting simulation evidence'}.</p><p><strong>Growth direction:</strong> {factor.growthTrajectory}</p><p><strong>Current interpretation:</strong> {factor.currentInterpretation}</p></article>; })}</div></article>
        <article className="card"><h2>Locked Progression</h2><div className="card-grid"><article className="card"><h3>Learn the 8 Factors</h3><p>Build the language of leadership psychology before entering the simulations.</p><Link className="button primary" href="/human-equation-suite/learn">Start Learning Course</Link></article><article className="card"><h3>Leadership Diagnostic</h3><p>Establish your baseline pressure profile.</p><Link className="button secondary" href="/human-equation-suite/diagnostic">Launch Diagnostic</Link></article><article className="card"><h3>Practice Lab</h3><p>Stress-test your leadership psychology in realistic human scenarios.</p><Link className="button secondary" href="/simulations">Enter Practice Lab</Link></article><article className="card"><h3>Growth Center</h3><p>Track distortions, recovery patterns, evidence, and growth over time.</p><Link className="button secondary" href="/human-equation-suite/dashboard">Open Growth Center</Link></article></div></article>
      </main>
    </div>
  </div></section>;
}
