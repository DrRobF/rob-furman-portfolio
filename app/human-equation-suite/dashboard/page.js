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

const getDimensionInsight = (key, score) => Number.isFinite(score) ? `Current signal: ${score >= 3.8 ? 'stabilizing strength under pressure' : score >= 3 ? 'forming capacity with inconsistent pressure reliability' : 'active growth edge that distorts under pressure'} in ${key}.` : 'Signal forming with current evidence.';
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
        <section><h3>Progression</h3><ul><li>1. Learn the 8 Factors</li><li>2. Leadership Diagnostic</li><li>3. Practice Lab</li><li>4. Growth Center</li></ul></section>
        <section><h3>Growth Center</h3><ul><li>Pressure Distortions</li><li>Recovery Practices</li><li>Evidence Timeline</li><li>Executive Reports</li></ul></section>
      </aside>
      <main className="hes-main-content">
        <article className="card hes-hero-profile"><p className="eyebrow">Executive Pressure Profile</p><h1>This is who you become under pressure.</h1><p>{interpretation.summary}</p><div className="hes-hero-grid"><div><h3>Strongest stabilizer</h3><p>{interpretation.strongestCapacity || strongest?.label || 'Signal emerging'}</p></div><div><h3>Growth tension</h3><p>{focusTitle}</p></div><div><h3>Distortion tendency</h3><p>{interpretation.pressureIdentity || 'Controller'} — {interpretation.trustUnderStress}</p></div><div><h3>Recommended direction</h3><p>{interpretation.recommendedCoachingFocus}</p></div></div></article>
        <article className="card"><h2>The 8 Factors of Human Leadership</h2><div className="hes-factor-grid">{dimensionDefinitions.map(({ key, label }) => { const d = profile.dimensions[key]; return <article key={key} className="hes-factor-panel"><header><h3>{label}</h3><span className="score-pill">{Number.isFinite(d.blendedCompositeScore) ? `${d.blendedCompositeScore.toFixed(1)} / 5` : 'Pending'}</span></header><p><strong>What this factor measures:</strong> Leadership capacity signal in live human pressure.</p><p><strong>Why it matters:</strong> Failure here distorts trust, clarity, and execution under stress.</p><p><strong>Current interpretation:</strong> {getDimensionInsight(label, d.blendedCompositeScore)}</p><p><strong>Under stress you tend to…</strong> {d.blendedCompositeScore >= 3.6 ? 'stabilize this capacity' : 'lose precision and speed up interpretation'}.</p><p><strong>Recovery practice:</strong> Pause, name emotional load, and verify one additional data point.</p><p><strong>Evidence observed in…</strong> {toSourceChips(d.evidenceWeights).join(', ') || 'Awaiting simulation evidence'}.</p><p><strong>Growth trajectory:</strong> {d.trend || 'Tracking baseline only'}.</p></article>; })}</div></article>
        <article className="card"><h2>Locked Progression</h2><div className="card-grid"><article className="card"><h3>Learn the 8 Factors</h3><p>Required onboarding to decode pressure patterns before diagnostic interpretation unlocks.</p><Link className="button primary" href="/human-equation-suite/learn">Start Learning Course</Link></article><article className="card"><h3>Leadership Diagnostic</h3><p>Unlocks after the framework course and generates your initial pressure profile.</p><Link className="button secondary" href="/human-equation-suite/diagnostic">Launch Diagnostic</Link></article><article className="card"><h3>Practice Lab Simulations</h3><p>Parent Call, Urban Student, Leadership Sim, and Observation Lab deepen evidence quality.</p><Link className="button secondary" href="/simulations">Enter Practice Lab</Link></article></div></article>
      </main>
    </div>
  </div></section>;
}
