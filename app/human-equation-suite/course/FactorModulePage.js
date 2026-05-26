'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import HumanEquationNav from '../../components/HumanEquationNav';
import { addFactorImpact, createEvidenceEvent, saveEvidenceEvent } from '../dashboard/evidenceModel';
import { saveCourseEvidence } from './courseModel';

export default function FactorModulePage({ module }) {
  const { factorId: factorKey, title, quote, teachingBlocks, interactions, reflectionPrompts, recoveryRehearsal, pressureShift, moduleTrains } = module;
  const [answers, setAnswers] = useState({});
  const [notes, setNotes] = useState({});
  const [done, setDone] = useState(false);
  const ready = Object.keys(answers).length >= interactions.length && Object.values(notes).filter(Boolean).length >= 4;
  const tendency = useMemo(() => Object.values(answers).filter((x) => x === 1).length >= 2 ? 'Context attuner' : 'Decisive stabilizer', [answers]);
  const drift = tendency === 'Context attuner' ? 'over-empathizing without enough directional clarity' : 'over-directing without enough relational context';
  const recoveryMove = recoveryRehearsal?.duringPressure || 'Pause, name one human signal, one systems signal, and one next-step owner.';
  const evidenceSummary = `${title}: ${tendency}; drift=${drift}; recovery=${recoveryMove}`;

  const completeModule = () => {
    const completedAt = new Date().toISOString();
    saveCourseEvidence((current) => ({
      ...current,
      interactionEvidence: { ...current.interactionEvidence, [factorKey]: answers },
      reflections: { ...current.reflections, [factorKey]: notes },
      growthSignals: [...(current.growthSignals || []), `${title}: ${tendency}`],
      timelineEvents: [...(current.timelineEvents || []), { label: `${title} module completed`, timestamp: completedAt }],
      factorEvidence: {
        ...current.factorEvidence,
        [factorKey]: { factorId: factorKey, factorTitle: title, completed: true, dominantTendency: tendency, driftToWatch: drift, recoveryMove, reflectionResponses: notes, interactionChoices: answers, completedAt, evidenceSummary },
      },
    }));
    saveEvidenceEvent(createEvidenceEvent({
      sourceType: 'course_reflection', sourceId: `${factorKey}-${Date.now()}`, sourceLabel: `${title} Module`, evidenceType: 'eight_factors_course', summary: evidenceSummary,
      factorImpacts: [addFactorImpact(factorKey, 0.75, 0.72, 'positive', 'Course calibration evidence')],
    }));
    setDone(true);
  };

  return <main className="section section-light"><div className="container"><HumanEquationNav />
    <section className='hes-awareness-hero top-space-sm'><p className='eyebrow'>8 Factors Course</p><h1>{title}</h1><h2>{quote}</h2><p><strong>Pressure shift:</strong> {pressureShift}</p><p><strong>What this module trains:</strong> {moduleTrains}</p><p><strong>Current read:</strong> {Object.keys(answers).length ? 'Emerging pattern forming from your choices.' : 'No final pattern yet — begin the micro-pressure sequence.'}</p></section>
    <section className='top-space-sm card'><h2>Teaching section</h2>{teachingBlocks.map((b) => <article key={b.heading} className='top-space-sm'><h3>{b.heading}</h3><p>{b.body}</p></article>)}</section>
    <section className='top-space-sm card'><h2>Interaction moments</h2>{interactions.map((q,idx)=><article key={idx} className='top-space-sm'><h3>{q.prompt}</h3><div className='button-grid'>{q.options.map((o,i)=><button key={o.label} className={`button ${answers[idx]===i?'primary':'secondary'}`} onClick={()=>setAnswers((p)=>({...p,[idx]:i}))}>{o.label}</button>)}</div>{answers[idx]!==undefined&&<p><strong>Feedback:</strong> {q.options[answers[idx]].feedback}</p>}</article>)}</section>
    <section className='top-space-sm card'><h2>Reflection calibration (before debrief)</h2>{reflectionPrompts.map((r,idx)=><label key={idx} className='hes-reflect-field'><span>{r}</span><textarea rows={3} value={notes[idx]||''} onChange={(e)=>setNotes((p)=>({...p,[idx]:e.target.value}))} /></label>)}</section>
    <section className='top-space-sm card'><h2>Recovery rehearsal</h2><p><strong>Before pressure:</strong> {recoveryRehearsal.beforePressure}</p><p><strong>During pressure:</strong> {recoveryRehearsal.duringPressure}</p><p><strong>After pressure:</strong> {recoveryRehearsal.afterPressure}</p><p><strong>Language shift:</strong> {recoveryRehearsal.languageShift}</p><p><strong>60-second reset:</strong> {recoveryRehearsal.reset60}</p><p><strong>What others need from you:</strong> {recoveryRehearsal.othersNeed}</p></section>
    <section className='top-space-sm card'><h2>Guided pattern read / debrief</h2><p><strong>Dominant tendency:</strong> {tendency}</p><p><strong>What it protects:</strong> decision stability and relational coherence under stress.</p><p><strong>What it may cost:</strong> missing either context or pace if unbalanced.</p><p><strong>What staff may experience:</strong> steadiness with varying access to your reasoning.</p><p><strong>What parents may experience:</strong> care and containment, but need explicit criteria and timeline.</p><p><strong>Next growth move:</strong> {recoveryMove}</p><p><strong>Drift to watch:</strong> {drift}</p><div className='button-row'><button className='button primary' disabled={!ready||done} onClick={completeModule}>{done?'Module Synced':'Complete Module + Sync Dashboard Evidence'}</button><Link className='button secondary' href='/human-equation-suite/course'>Back to Course</Link></div></section>
  </div></main>;
}
