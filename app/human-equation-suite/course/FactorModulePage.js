'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import HumanEquationNav from '../../components/HumanEquationNav';
import { addFactorImpact, createEvidenceEvent, saveEvidenceEvent } from '../dashboard/evidenceModel';
import { saveCourseEvidence } from './courseModel';

const tendencyProfiles = {
  decisive: {
    title: 'Decisive stabilizer',
    protects: 'order, speed, and visible containment when uncertainty rises',
    narrows: 'interpretive patience and context gathering under emotional heat',
    othersExperience: 'clarity and command, sometimes before they feel heard',
    trustSignal: 'leadership is present and willing to decide',
    hiddenRisk: 'urgency compression can become certainty inflation',
    drift: 'over-directing without enough relational and contextual calibration',
    recovery: 'Add one context question and one dignity statement before final direction.',
  },
  contextual: {
    title: 'Context attuner',
    protects: 'human dignity, relational accuracy, and de-escalation quality',
    narrows: 'decision speed and closure clarity when stakes are high',
    othersExperience: 'careful listening and emotional steadiness',
    trustSignal: 'people matter, not only policy outcomes',
    hiddenRisk: 'relational pacing may drift into unclear boundaries',
    drift: 'over-empathizing without enough directional clarity and timing',
    recovery: 'Pair empathy with explicit boundary, owner, and timeline.',
  },
  reflective: {
    title: 'Interpretive calibrator',
    protects: 'decision quality, fairness, and cognitive discipline',
    narrows: 'momentum and confidence signaling in urgent windows',
    othersExperience: 'thoughtful process and reduced snap judgment',
    trustSignal: 'leadership takes accuracy and fairness seriously',
    hiddenRisk: 'analysis delay can feel like absence under pressure',
    drift: 'over-processing when people need a near-term directional call',
    recovery: 'Name an interim action while continuing inquiry.',
  },
  delegative: {
    title: 'System distributor',
    protects: 'shared ownership, team development, and sustainable execution',
    narrows: 'direct leader presence in emotionally charged moments',
    othersExperience: 'distributed support and role clarity when done well',
    trustSignal: 'the system can hold, not just one person',
    hiddenRisk: 'delegation without containment can read as distance',
    drift: 'handoff without enough framing, follow-up, or visible accountability',
    recovery: 'Delegate with explicit criteria, check-back point, and relational follow-through.',
  },
};

export default function FactorModulePage({ module }) {
  const { factorId: factorKey, title, quote, teachingBlocks, interactions, reflectionPrompts, recoveryRehearsal, pressureShift, moduleTrains } = module;
  const [answers, setAnswers] = useState({});
  const [notes, setNotes] = useState({});
  const [done, setDone] = useState(false);
  const ready = Object.keys(answers).length >= interactions.length && Object.values(notes).filter(Boolean).length >= 4;

  const tally = useMemo(() => {
    const counts = { decisive: 0, contextual: 0, reflective: 0, delegative: 0 };
    interactions.forEach((q, idx) => {
      const choice = answers[idx];
      if (choice === undefined) return;
      counts[q.options[choice]?.signal || 'reflective'] += 1;
    });
    return counts;
  }, [answers, interactions]);

  const dominantKey = useMemo(() => Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] || 'reflective', [tally]);
  const profile = tendencyProfiles[dominantKey];
  const recoveryMove = `${recoveryRehearsal?.duringPressure || ''} ${profile.recovery}`.trim();
  const evidenceSummary = `${title}: ${profile.title}; drift=${profile.drift}; recovery=${recoveryMove}`;

  const completeModule = () => {
    const completedAt = new Date().toISOString();
    saveCourseEvidence((current) => ({
      ...current,
      interactionEvidence: { ...current.interactionEvidence, [factorKey]: answers },
      reflections: { ...current.reflections, [factorKey]: notes },
      growthSignals: [...(current.growthSignals || []), `${title}: ${profile.title}`],
      timelineEvents: [...(current.timelineEvents || []), { label: `${title} module completed`, timestamp: completedAt }],
      factorEvidence: {
        ...current.factorEvidence,
        [factorKey]: { factorId: factorKey, factorTitle: title, completed: true, dominantTendency: profile.title, driftToWatch: profile.drift, recoveryMove, reflectionResponses: notes, interactionChoices: answers, completedAt, evidenceSummary },
      },
    }));
    saveEvidenceEvent(createEvidenceEvent({ sourceType: 'course_reflection', sourceId: `${factorKey}-${Date.now()}`, sourceLabel: `${title} Module`, evidenceType: 'eight_factors_course', summary: evidenceSummary, factorImpacts: [addFactorImpact(factorKey, 0.75, 0.72, 'positive', 'Course calibration evidence')] }));
    setDone(true);
  };

  return <main className="section section-light"><div className="container"><HumanEquationNav />
    <section className='hes-awareness-hero top-space-sm'><p className='eyebrow'>8 Factors Course</p><h1>{title}</h1><h2>{quote}</h2><p><strong>Pressure shift:</strong> {pressureShift}</p><p><strong>What this module trains:</strong> {moduleTrains}</p><p><strong>Current read:</strong> {Object.keys(answers).length ? `${profile.title} pattern emerging from your interaction choices.` : 'No final pattern yet — begin the micro-pressure sequence.'}</p></section>
    <section className='top-space-sm card'><h2>Teaching section</h2>{teachingBlocks.map((b) => <article key={b.heading} className='top-space-sm'><h3>{b.heading}</h3><p>{b.body}</p></article>)}</section>
    <section className='top-space-sm card'><h2>Interaction moments</h2>{interactions.map((q,idx)=><article key={idx} className='top-space-sm'><h3>{q.prompt}</h3><div className='button-grid'>{q.options.map((o,i)=><button key={o.label} className={`button ${answers[idx]===i?'primary':'secondary'}`} onClick={()=>setAnswers((p)=>({...p,[idx]:i}))}>{o.label}</button>)}</div>{answers[idx]!==undefined&&<p><strong>Feedback:</strong> {q.options[answers[idx]].feedback} <em>Pattern effect: this choice strengthens your {tendencyProfiles[q.options[answers[idx]].signal || 'reflective'].title.toLowerCase()} tendency.</em></p>}</article>)}</section>
    <section className='top-space-sm card'><h2>Reflection calibration (before debrief)</h2>{reflectionPrompts.map((r,idx)=><label key={idx} className='hes-reflect-field'><span>{r}</span><textarea rows={3} value={notes[idx]||''} onChange={(e)=>setNotes((p)=>({...p,[idx]:e.target.value}))} /></label>)}</section>
    <section className='top-space-sm card'><h2>Recovery rehearsal</h2><p><strong>Before pressure:</strong> {recoveryRehearsal.beforePressure}</p><p><strong>During pressure:</strong> {recoveryRehearsal.duringPressure}</p><p><strong>After pressure:</strong> {recoveryRehearsal.afterPressure}</p><p><strong>Language shift:</strong> {recoveryRehearsal.languageShift}</p><p><strong>60-second reset:</strong> {recoveryRehearsal.reset60}</p><p><strong>What others need from you:</strong> {recoveryRehearsal.othersNeed}</p></section>
    <section className='top-space-sm card'><h2>Guided pattern read / debrief</h2><p><strong>Dominant tendency:</strong> {profile.title}</p><p><strong>What you are protecting:</strong> {profile.protects}</p><p><strong>What pressure narrows:</strong> {profile.narrows}</p><p><strong>What others likely experience:</strong> {profile.othersExperience}</p><p><strong>Trust signal you are sending:</strong> {profile.trustSignal}</p><p><strong>Hidden risk to watch:</strong> {profile.hiddenRisk}</p><p><strong>Drift to watch:</strong> {profile.drift}</p><p><strong>Recovery pattern that matters most now:</strong> {recoveryMove}</p><div className='button-row'><button className='button primary' disabled={!ready||done} onClick={completeModule}>{done?'Module Synced':'Complete Module + Sync Dashboard Evidence'}</button><Link className='button secondary' href='/human-equation-suite/course'>Back to Course</Link></div></section>
  </div></main>;
}
