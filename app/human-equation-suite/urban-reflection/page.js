'use client';

import { useState } from 'react';
import HumanEquationNav from '../../components/HumanEquationNav';
import { DASHBOARD_PROFILE_STORAGE_KEY, blendUrbanEvidenceIntoProfile, createEmptyMasterProfile } from '../dashboard/profileData';
import { buildUrbanSimulationReport, urbanReflectionQuestions, URBAN_REPORT_STORAGE_KEY } from '../dashboard/urbanEvidence';
import { EVIDENCE_EVENTS_STORAGE_KEY, createEvidenceEvent, addFactorImpact, saveEvidenceEvent } from '../dashboard/evidenceModel';

export default function UrbanReflectionOnlyPage() {
  const [answers, setAnswers] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const completeCount = Object.keys(answers).length;
  const isComplete = completeCount === urbanReflectionQuestions.length;

  const handleSubmit = () => {
    if (!isComplete || typeof window === 'undefined') return;
    setIsSaving(true);
    const completedAt = new Date().toISOString();
    const report = buildUrbanSimulationReport({ selectedChoices: {}, cumulativeMetrics: {}, completedAt, completionReason: 'reflection_only', postReflectionAnswers: answers, reflectionQuestions: urbanReflectionQuestions });
    window.localStorage.setItem(URBAN_REPORT_STORAGE_KEY, JSON.stringify(report));
    const existingEvents = JSON.parse(window.localStorage.getItem(EVIDENCE_EVENTS_STORAGE_KEY) || '[]');
    const attemptNumber = existingEvents.filter((event) => event.sourceType === 'urban_sim').length + 1;
    const impacts = Object.entries(report.dimensions || {}).map(([factorId, dim]) => addFactorImpact(factorId, ((dim?.score || 3) - 3) / 2, dim?.confidence || 0.7, (dim?.score || 3) >= 3 ? 'positive' : 'risk', 'Urban simulation behavioral signal'));
    const urbanEvent = createEvidenceEvent({ sourceType: 'urban_sim', sourceId: report.completedAt || 'urban', sourceLabel: `Urban Student Simulation Attempt ${attemptNumber}`, evidenceType: 'behavioral_choice', factorImpacts: impacts, summary: 'Urban Student Simulation completed and behavioral evidence captured.', tags: ['human context', 'ambiguity', 'systems thinking'], weight: 1.0 });
    if (process.env.NODE_ENV !== 'production') {
      console.debug('Creating Urban Sim evidence event');
      console.debug('Urban Sim evidence payload:', urbanEvent);
    }
    const saved = saveEvidenceEvent(urbanEvent);
    if (process.env.NODE_ENV !== 'production') {
      console.debug('Urban Sim saved result:', saved.savedEvent);
      console.debug('Urban Sim evidence count after save:', saved.events.length);
    }
    const existingMaster = window.localStorage.getItem(DASHBOARD_PROFILE_STORAGE_KEY);
    const parsedMaster = existingMaster ? JSON.parse(existingMaster) : createEmptyMasterProfile();
    const blended = blendUrbanEvidenceIntoProfile(parsedMaster, report);
    window.localStorage.setItem(DASHBOARD_PROFILE_STORAGE_KEY, JSON.stringify(blended));
    window.location.assign('/human-equation-suite/dashboard?tab=urban');
  };

  return <main className="section section-light"><div className="container"><HumanEquationNav />
    <article className="card top-space-sm"><h1>Urban Reflection Quiz</h1><p>Use this direct route to test and save Urban reflection evidence without replaying the full simulation.</p><p><strong>Progress:</strong> {completeCount} / {urbanReflectionQuestions.length}</p><div className="button-row"><a className="button secondary" href="/human-equation-suite/urban-student-sim">Run Full Urban Simulation</a><a className="button secondary" href="/human-equation-suite/dashboard?tab=urban">Back to Urban Dashboard Tab</a></div></article>
    {urbanReflectionQuestions.map((q, index) => <article key={q.id} className="card top-space-sm"><h3>{index + 1}. {q.prompt}</h3><div className="button-grid top-space-sm">{q.options.map((option, optionIndex) => <button key={option.text} type="button" className={`button ${answers[q.id] === optionIndex ? 'primary' : 'secondary'}`} onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: optionIndex }))}>{option.text}</button>)}</div></article>)}
    <article className="card top-space-sm"><button type="button" className="button primary" disabled={!isComplete || isSaving} onClick={handleSubmit}>{isSaving ? 'Saving Urban Reflection Evidence...' : 'Save Reflection Evidence'}</button></article>
  </div></main>;
}
