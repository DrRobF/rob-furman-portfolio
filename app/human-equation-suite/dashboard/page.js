'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import HumanEquationNav from '../../components/HumanEquationNav';
import { dimensionDefinitions, factorPsychologyDefinitions } from './profileData';
import { EVIDENCE_EVENTS_STORAGE_KEY, calculateFactorProfile, getEvidenceTimeline, getNextRecommendedSimulation, resetLeadershipProfile } from './evidenceModel';

const title = (sourceType) => ({ diagnostic: 'Diagnostic', urban_sim: 'Urban Sim', parent_call: 'Parent Call', leadership_sim: 'Leadership Sim', observation_lab: 'Observation', course_reflection: 'Reflection', written_artifact: 'Written Artifact', artifact: 'Artifact' }[sourceType] || sourceType);

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

const confidenceLabel = (eventCount) => (eventCount < 4 ? 'Early read' : eventCount < 10 ? 'Developing' : 'Supported');

export default function HumanEquationDashboardPage() {
  const [events, setEvents] = useState([]);
  const [activeReport, setActiveReport] = useState('distortions');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setEvents(JSON.parse(window.localStorage.getItem(EVIDENCE_EVENTS_STORAGE_KEY) || '[]'));
  }, []);

  const factorProfiles = useMemo(() => Object.fromEntries(dimensionDefinitions.map((d) => [d.key, calculateFactorProfile(events, d.key)])), [events]);
  const timeline = useMemo(() => getEvidenceTimeline(events), [events]);

  const scoredFactors = useMemo(() => [...dimensionDefinitions].map((d) => ({ ...d, ...factorProfiles[d.key] })), [factorProfiles]);
  const strongest = scoredFactors.filter((x) => x.score).sort((a, b) => b.score - a.score)[0];
  const activeDistortion = scoredFactors.filter((x) => x.riskMarkers > x.positiveMarkers).sort((a, b) => (b.riskMarkers - b.positiveMarkers) - (a.riskMarkers - a.positiveMarkers))[0];
  const growthTension = scoredFactors.filter((x) => x.totalEvidenceEvents > 0).sort((a, b) => a.totalEvidenceEvents - b.totalEvidenceEvents)[0];
  const recommendedRecovery = scoredFactors.filter((x) => x.riskMarkers > 0).sort((a, b) => b.riskMarkers - a.riskMarkers)[0];
  const confidence = confidenceLabel(events.length);
  const hasRadarData = scoredFactors.filter((f) => f.score !== null).length >= 3;

  const renderReportPanel = () => {
    if (activeReport === 'timeline') {
      return <article className="card hes-report-card hes-active-report"><h2>Evidence Timeline</h2>{timeline.length === 0 ? <p>No evidence captured yet. Complete the diagnostic or a simulation to begin building your profile.</p> : <div className="hes-timeline">{timeline.map((event) => <article key={event.id}><div className="node">•</div><h4>{event.sourceLabel}</h4><p>{new Date(event.timestamp).toLocaleString('en-US')} · {title(event.sourceType)} · {event.evidenceType === 'diagnostic_self_report' ? 'Self-report baseline' : 'Behavioral evidence'}</p><p>Factors: {event.factorImpacts.map((x) => x.factorId).join(', ')}</p><p>{event.summary}</p></article>)}</div>}</article>;
    }
    if (activeReport === 'recovery') {
      return <article className="card hes-report-card hes-active-report"><h2>Recovery Practices</h2><div className="hes-ladder"><p><strong>Recommended next simulation:</strong> {getNextRecommendedSimulation(events)}</p><p><strong>Primary recovery move:</strong> {recommendedRecovery ? `Build micro-recovery routines for ${recommendedRecovery.label}.` : 'Early read — more evidence needed.'}</p><p><strong>Signal hygiene:</strong> Label diagnostic inputs as self-report baseline; treat simulation artifacts as behavioral evidence.</p></div></article>;
    }
    if (activeReport === 'executive') {
      return <article className="card hes-report-card hes-active-report"><h2>Executive Pressure Report</h2><div className="hes-exec-grid"><article><h4>Profile confidence</h4><p>{confidence} {events.length < 4 ? '— Current evidence is not yet broad enough for a stable behavioral profile.' : '— Pattern is strengthening with accumulated events.'}</p></article><article><h4>Strongest supported factors</h4><p>{strongest ? strongest.label : 'No dominant pattern yet.'}</p></article><article><h4>Evidence mix</h4><p>Self-report baseline: {events.filter((e) => e.sourceType === 'diagnostic').length} · Behavioral evidence: {events.filter((e) => e.sourceType !== 'diagnostic').length}</p></article><article><h4>Next evidence target</h4><p>Add parent call and leadership artifacts to strengthen interpersonal and systems evidence depth.</p></article></div></article>;
    }
    return <article className="card hes-report-card hes-active-report"><h2>Pressure Distortions</h2><div className="hes-trigger-map">{scoredFactors.map((factor) => <span key={factor.key} style={{ '--w': `${Math.min(100, 25 + (factor.riskMarkers * 12))}%` }}>{factor.label}: {factor.riskMarkers > factor.positiveMarkers ? 'Pressure risk active' : 'No dominant distortion yet'}</span>)}</div></article>;
  };

  return <section className="section section-light"><div className="container"><LanguageSwitcher /><HumanEquationNav />
    <div className="hes-app-layout top-space-sm"><aside className="hes-command-sidebar"><h3>Progression Flow</h3>
      <div className="hes-stepper">{stepDefinitions.map((step, index) => {
        const isDone = index < 2 || (index === 2 && events.length >= 2);
        const isCurrent = index === 3;
        return <article key={step.key} className={`hes-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}><div className="node">{isDone ? '✓' : index + 1}</div><div><header><h4>{step.label}</h4><span className={`badge ${isDone ? 'badge-green' : isCurrent ? 'badge-blue' : 'badge-gray'}`}>{isDone ? 'Complete' : isCurrent ? 'Active' : 'Upcoming'}</span></header><p>{step.description}</p></div></article>;
      })}</div>
      <div><h3>Growth Center</h3><div className="hes-report-selector">{reportTabs.map((tab) => <button key={tab.key} className={`button ${activeReport === tab.key ? '' : 'secondary'}`} onClick={() => setActiveReport(tab.key)}>{tab.label}</button>)}</div></div>
      <button className="button secondary" onClick={() => {
        if (!window.confirm('Start fresh clears your leadership evidence profile so you can rebuild it from new diagnostic and simulation data. Continue?')) return;
        resetLeadershipProfile();
        setEvents([]);
      }}>Start Fresh Profile</button>
      <p><strong>Next recommended simulation:</strong> {getNextRecommendedSimulation(events)}</p>
    </aside>
    <main className="hes-main-content">
      <article className="card hes-hero-profile"><div className="hes-hero-shell"><div><p className="eyebrow">Executive Pressure Profile</p><h1>This is how your leadership psychology behaves under pressure.</h1><p>Leadership style explains how you prefer to lead. Leadership psychology shows what pressure does to perception, regulation, trust, and judgment.</p><p><strong>Current profile confidence: {confidence}.</strong></p><p>{hasRadarData ? 'Radar reflects current evidence-weighted factor scores.' : 'Early read — more evidence needed.'}</p></div>
      <div className="hes-mini-radar"><svg viewBox="0 0 220 220" aria-label="Leadership factor radar"><circle cx="110" cy="110" r="90" /><circle cx="110" cy="110" r="65" /><circle cx="110" cy="110" r="40" />
      <polygon points={dimensionDefinitions.map((factor, i) => {
        const angle = (Math.PI * 2 * i / dimensionDefinitions.length) - Math.PI / 2;
        const val = factorProfiles[factor.key]?.score;
        const radius = hasRadarData && val ? (val / 5) * 85 : 26;
        const x = 110 + Math.cos(angle) * radius;
        const y = 110 + Math.sin(angle) * radius;
        return `${x},${y}`;
      }).join(' ')} style={!hasRadarData ? { opacity: 0.35 } : undefined} /></svg><p>{hasRadarData ? 'Evidence-calibrated factor radar' : 'Early read — more evidence needed.'}</p></div></div></article>

      <div className="hes-insights-row">
        <article className="hes-insight-card stabilizer"><h3>Strongest stabilizer</h3><p>{strongest ? strongest.label : 'Early read — more evidence needed.'}</p></article>
        <article className="hes-insight-card distortion"><h3>Active pressure distortion</h3><p>{activeDistortion ? activeDistortion.label : 'No dominant pattern yet.'}</p></article>
        <article className="hes-insight-card tension"><h3>Current growth tension</h3><p>{growthTension ? `${growthTension.label} has the thinnest support.` : 'More evidence needed.'}</p></article>
        <article className="hes-insight-card recovery"><h3>Recommended recovery move</h3><p>{recommendedRecovery ? `Stabilize ${recommendedRecovery.label} with brief reset routines.` : 'Early read — more evidence needed.'}</p></article>
      </div>

      {renderReportPanel()}

      <article className="card"><h2>The 8 Factors</h2><div className="hes-factor-grid compact">{dimensionDefinitions.map(({ key, label }) => {
        const p = factorProfiles[key];
        const factor = factorPsychologyDefinitions[key];
        const sourceLabel = p.sourceTypes.length ? p.sourceTypes.map((s) => s === 'diagnostic' ? 'Self-report baseline' : title(s)).join(' · ') : 'None yet';
        return <article key={key} className="hes-factor-panel compact"><h3>{label}</h3>
          {!p.score ? <><p><strong>No evidence yet</strong></p><p>More behavioral data needed.</p></> : <><p><strong>{p.score.toFixed(2)} / 5</strong></p><p><span className="badge badge-blue">{p.maturityLevel}</span></p></>}
          <p><strong>Sources:</strong> {sourceLabel}</p>
          <p><strong>Evidence count:</strong> {p.totalEvidenceEvents} · <strong>Last updated:</strong> {p.latestUpdatedAt ? new Date(p.latestUpdatedAt).toLocaleString('en-US') : 'Not yet'}</p>
          <p><strong>Current read:</strong> {p.totalEvidenceEvents <= 1 ? 'Early read — more behavioral data needed.' : p.currentRead}</p>
          <p><strong>Pressure risk:</strong> {p.riskMarkers > p.positiveMarkers ? 'Emerging pressure risk' : 'No dominant pressure risk yet'}</p>
          <p><strong>Recovery move:</strong> {p.riskMarkers ? 'Pause-label-reframe before next high-stakes interaction.' : 'Maintain current stabilizing routine.'}</p>
          <details><summary>View deeper analysis</summary><p>{factor.shortDefinition}</p><p>Confidence: {(p.averageConfidence * 100).toFixed(0)}% · Weighted evidence: {p.weightedEvidence}</p></details>
        </article>;
      })}</div></article>

      <article className="card"><h2>Framework Course</h2><Link className="button secondary" href="/human-equation-suite/learn">Preview Placeholder</Link></article>
    </main></div></div></section>;
}
