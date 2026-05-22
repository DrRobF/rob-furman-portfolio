'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import HumanEquationNav from '../../components/HumanEquationNav';
import { dimensionDefinitions, factorPsychologyDefinitions } from './profileData';
import { EVIDENCE_EVENTS_STORAGE_KEY, calculateFactorProfile, getEvidenceTimeline, getNextRecommendedSimulation, resetLeadershipProfile } from './evidenceModel';

const title = (sourceType) => ({ diagnostic: 'Diagnostic', urban_sim: 'Urban Sim', parent_call: 'Parent Call', leadership_sim: 'Leadership Sim', observation_lab: 'Observation', course_reflection: 'Reflection' }[sourceType] || sourceType);

export default function HumanEquationDashboardPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setEvents(JSON.parse(window.localStorage.getItem(EVIDENCE_EVENTS_STORAGE_KEY) || '[]'));
  }, []);

  const factorProfiles = useMemo(() => Object.fromEntries(dimensionDefinitions.map((d) => [d.key, calculateFactorProfile(events, d.key)])), [events]);
  const timeline = useMemo(() => getEvidenceTimeline(events), [events]);
  const strongest = [...dimensionDefinitions].map((d) => ({ label: d.label, ...factorProfiles[d.key] })).filter((x) => x.score).sort((a,b)=>b.score-a.score).slice(0,3);
  const limited = [...dimensionDefinitions].map((d) => ({ label: d.label, ...factorProfiles[d.key] })).filter((x) => !x.score || x.totalEvidenceEvents < 2).slice(0,3);

  return <section className="section section-light"><div className="container"><LanguageSwitcher /><HumanEquationNav />
    <div className="hes-app-layout top-space-sm"><aside className="hes-command-sidebar"><h3>Growth Center</h3>
      <button className="button secondary" onClick={() => {
        if (!window.confirm('Start fresh clears your leadership evidence profile so you can rebuild it from new diagnostic and simulation data. Continue?')) return;
        resetLeadershipProfile();
        setEvents([]);
      }}>Start Fresh Profile</button>
      <p>Start fresh clears your leadership evidence profile so you can rebuild it from new diagnostic and simulation data.</p>
      <p><strong>Next recommended simulation:</strong> {getNextRecommendedSimulation(events)}</p>
    </aside>
    <main className="hes-main-content">
      <article className="card"><h1>Evidence-based Leadership Dashboard</h1><p>Signals are uneven by design and only move when evidence exists.</p></article>
      <article className="card"><h2>The 8 Factors</h2><div className="hes-factor-grid compact">{dimensionDefinitions.map(({ key, label }) => {
        const p = factorProfiles[key];
        const factor = factorPsychologyDefinitions[key];
        return <article key={key} className="hes-factor-panel compact"><h3>{label}</h3>
          {!p.score ? <><p><strong>No evidence yet</strong></p><p>Complete simulations that touch this factor.</p></> : <><p><strong>{p.score.toFixed(2)} / 5</strong> · {p.maturityLevel}</p><p>{p.currentRead}</p></>}
          <p>Evidence events: {p.totalEvidenceEvents} · Weighted evidence: {p.weightedEvidence}</p>
          <p>Confidence: {(p.averageConfidence * 100).toFixed(0)}% · +Markers: {p.positiveMarkers} · Risk: {p.riskMarkers}</p>
          <p>Sources: {p.sourceTypes.length ? p.sourceTypes.map(title).join(' · ') : 'None yet'}</p>
          <p>Last updated: {p.latestUpdatedAt ? new Date(p.latestUpdatedAt).toLocaleString('en-US') : 'Not yet'}</p>
          <p><strong>Current read:</strong> {factor.shortDefinition}</p>
        </article>;
      })}</div></article>

      <article className="card"><h2>Evidence Timeline</h2>{timeline.length === 0 ? <p>No evidence captured yet. Complete the diagnostic or a simulation to begin building your profile.</p> : <div className="hes-timeline">{timeline.map((event) => <article key={event.id}><h4>{event.sourceLabel}</h4><p>{new Date(event.timestamp).toLocaleString('en-US')} · {title(event.sourceType)} · {event.evidenceType}</p><p>Factors: {event.factorImpacts.map((x)=>x.factorId).join(', ')}</p><p>{event.summary}</p><p>Weight: {event.weight} · Avg confidence: {(event.factorImpacts.reduce((s,i)=>s+(i.confidence||0),0)/Math.max(1,event.factorImpacts.length)).toFixed(2)}</p></article>)}</div>}</article>

      <article className="card"><h2>Executive Report</h2><p>This report becomes more precise as more simulations and artifacts are completed.</p>
        <p><strong>Evidence used:</strong> {events.length} event(s).</p>
        <p><strong>Profile confidence:</strong> {events.length < 4 ? 'Early read — Current evidence is not yet broad enough for a stable profile.' : events.length < 10 ? 'Developing pattern' : 'Supported pattern'} </p>
        <p><strong>Strongest supported factors:</strong> {strongest.length ? strongest.map((s) => s.label).join(', ') : 'Not enough evidence yet'}</p>
        <p><strong>Factors with limited evidence:</strong> {limited.length ? limited.map((s) => s.label).join(', ') : 'None'}</p>
        <p><strong>Active pressure risks:</strong> {dimensionDefinitions.filter((d)=>factorProfiles[d.key].riskMarkers>factorProfiles[d.key].positiveMarkers).map((d)=>d.label).join(', ') || 'None currently dominant'}</p>
        <p><strong>Best next simulation:</strong> {getNextRecommendedSimulation(events)}</p>
        <p><strong>Recommended next practice:</strong> Add parent call and leadership simulation artifacts to improve interpersonal and systems evidence depth.</p>
      </article>

      <article className="card"><h2>Framework Course Placeholder</h2><Link className="button secondary" href="/human-equation-suite/learn">Preview Placeholder</Link></article>
    </main></div></div></section>;
}
