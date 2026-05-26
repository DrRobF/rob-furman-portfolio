'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import HumanEquationNav from '../../components/HumanEquationNav';
import { addFactorImpact, createEvidenceEvent, saveEvidenceEvent } from '../dashboard/evidenceModel';
import { readCourseEvidence, saveCourseEvidence } from './courseModel';

export default function FactorModulePage({ factorKey, title, quote, teaching, interactions, reflections, recoveryGuide }) {
  const [answers, setAnswers] = useState({});
  const [notes, setNotes] = useState({});
  const [done, setDone] = useState(false);
  const ready = Object.keys(answers).length >= interactions.length && Object.values(notes).filter(Boolean).length >= 2;
  const tendency = useMemo(() => Object.values(answers).some((x) => x === 1) ? 'Context attuner' : 'Decisive stabilizer', [answers]);
  const drift = tendency === 'Context attuner' ? 'naming care without enough directional clarity' : 'naming decisions without enough relational context';
  const recoveryMove = 'Name one human signal, one systems signal, and one next-step owner before you close the conversation.';
  const score = +(3 + (Object.keys(answers).length * 0.22)).toFixed(2);

  const completeModule = () => {
    const completedAt = new Date().toISOString();
    const evidence = saveCourseEvidence((current) => ({
      ...current,
      interactionEvidence: { ...current.interactionEvidence, [factorKey]: answers },
      reflections: { ...current.reflections, [factorKey]: notes },
      growthSignals: [...(current.growthSignals || []), `${title}: ${tendency}`],
      timelineEvents: [...(current.timelineEvents || []), { label: `${title} module completed`, timestamp: completedAt }],
      factorEvidence: {
        ...current.factorEvidence,
        [factorKey]: { completed: true, score, dominantTendency: tendency, driftToWatch: drift, recoveryMove, reflectionResponses: notes, interactionChoices: answers, completedAt },
      },
    }));
    saveEvidenceEvent(createEvidenceEvent({
      sourceType: 'course_reflection', sourceId: `${factorKey}-${Date.now()}`, sourceLabel: `${title} Module`, evidenceType: 'eight_factors_course', summary: 'Course calibration evidence',
      factorImpacts: [addFactorImpact(factorKey, (score - 3) / 1.8, 0.72, 'positive', 'Course calibration evidence')],
    }));
    setDone(Boolean(evidence));
  };

  return <main className="section section-light"><div className="container"><HumanEquationNav />
    <section className='hes-awareness-hero top-space-sm'><p className='eyebrow'>8 Factors Course</p><h1>{title}</h1><h2>{quote}</h2><p>{teaching}</p></section>
    <section className='top-space-sm card'><h2>Teaching sections</h2><p>{recoveryGuide}</p></section>
    <section className='top-space-sm card'><h2>Micro-pressure interactions</h2>{interactions.map((q,idx)=><article key={idx} className='top-space-sm'><h3>{q.prompt}</h3><div className='button-grid'>{q.options.map((o,i)=><button key={o.label} className={`button ${answers[idx]===i?'primary':'secondary'}`} onClick={()=>setAnswers((p)=>({...p,[idx]:i}))}>{o.label}</button>)}</div>{answers[idx]!==undefined&&<p><strong>Feedback:</strong> {q.options[answers[idx]].feedback}</p>}</article>)}</section>
    <section className='top-space-sm card'><h2>Reflection calibration</h2>{reflections.map((r,idx)=><label key={idx} className='hes-reflect-field'><span>{r}</span><textarea rows={3} value={notes[idx]||''} onChange={(e)=>setNotes((p)=>({...p,[idx]:e.target.value}))} /></label>)}</section>
    <section className='top-space-sm card'><h2>Recovery rehearsal + guided pattern read</h2><p><strong>Dominant tendency:</strong> {tendency}</p><p><strong>Drift to watch:</strong> {drift}</p><p><strong>Recovery move:</strong> {recoveryMove}</p><div className='button-row'><button className='button primary' disabled={!ready||done} onClick={completeModule}>{done?'Module Synced':'Complete Module + Sync Dashboard Evidence'}</button><Link className='button secondary' href='/human-equation-suite/course'>Back to Course</Link></div></section>
  </div></main>;
}
