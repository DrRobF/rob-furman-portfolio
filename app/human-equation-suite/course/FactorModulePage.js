'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import HumanEquationNav from '../../components/HumanEquationNav';
import { addFactorImpact, createEvidenceEvent, saveEvidenceEvent } from '../dashboard/evidenceModel';
import { factorCatalog, saveCourseEvidence } from './courseModel';

const tendencyProfiles = {
  structureFirst: { title: 'Structure-first leadership', protects: 'consistency, clarity, and procedural fairness', costs: 'people may hear the decision before they feel the reasoning', staffExperience: 'clear boundaries, sometimes with less emotional context', parentExperience: 'predictable process, sometimes reduced personalization', drift: 'certainty can outrun inquiry', recovery: 'Name the concern first, then explain the boundary and next step.' },
  emotionFirst: { title: 'Emotion-first leadership', protects: 'dignity, trust temperature, and relational safety', costs: 'next steps can feel unclear if boundaries are delayed', staffExperience: 'seen and heard, but occasionally unsure what is firm', parentExperience: 'respected and calmer, but still looking for clearer direction', drift: 'care without closure', recovery: 'Pair empathy with clear boundary, owner, and timeline.' },
  delayAvoidance: { title: 'Delay/avoidance pattern', protects: 'short-term de-escalation and risk containment', costs: 'silence can feel like avoidance if follow-up lacks specificity', staffExperience: 'temporary calm, mixed confidence about action', parentExperience: 'less conflict in the moment, more anxiety afterward', drift: 'decisions drift and trust erodes', recovery: 'Set a specific follow-up time and interim action before leaving the moment.' },
  repairFirst: { title: 'Repair-first leadership', protects: 'relationship continuity after strain', costs: 'can be read as soft if accountability language stays vague', staffExperience: 'high relational repair effort with variable closure', parentExperience: 'genuine care plus opportunity to reset trust', drift: 'repair language replaces decision language', recovery: 'Repair, then restate criteria and shared accountability.' },
  systemsFirst: { title: 'Systems-first leadership', protects: 'role clarity, shared ownership, and long-term consistency', costs: 'live human urgency may feel under-addressed', staffExperience: 'predictable handoffs and accountability', parentExperience: 'organized response, occasionally impersonal tone', drift: 'handoff without enough visible principal presence', recovery: 'Keep distributed ownership, while remaining visibly present in pivotal moments.' },
  opticsFirst: { title: 'Optics-first leadership', protects: 'public confidence and immediate message control', costs: 'private trust may weaken if optics lead substance', staffExperience: 'tight messaging pressure', parentExperience: 'clear public signal but concern about authenticity', drift: 'reputation management over relational repair', recovery: 'Align public message with transparent reasoning and private follow-through.' },
  inquiryFirst: { title: 'Inquiry-first leadership', protects: 'accuracy, fairness, and interpretive discipline', costs: 'pace can feel slow in urgent windows', staffExperience: 'fair process and fewer snap calls', parentExperience: 'thorough review with occasional delay frustration', drift: 'analysis without near-term directional call', recovery: 'Name what is known now and what decision will be made by when.' },
};


const signalFeedback = {
  decisive: { protects: 'consistency and visible direction', cost: 'reasoning can feel too fast for some people', others: 'staff and families may feel clear on boundaries but less clear on voice', pattern: 'structure-first' },
  contextual: { protects: 'dignity and relational temperature', cost: 'boundaries can sound softer than intended', others: 'people often feel seen before they feel closure', pattern: 'emotion-first' },
  reflective: { protects: 'fairness and decision accuracy', cost: 'pace can feel slow in a live-pressure window', others: 'people may appreciate rigor while still wanting earlier direction', pattern: 'inquiry-first' },
  delegative: { protects: 'system ownership and sustainable follow-through', cost: 'the principal can appear distant in the moment', others: 'teams feel shared responsibility; families may want more direct leader presence', pattern: 'systems-first' },
  repair: { protects: 'relationship continuity after strain', cost: 'repair can be mistaken for lowered accountability', others: 'people experience genuine reset if next steps are explicit', pattern: 'repair-first' },
  optics: { protects: 'public confidence and message control', cost: 'private trust can thin if substance lags', others: 'people see strong signaling but question authenticity', pattern: 'optics-first' },
  delay: { protects: 'de-escalation in the immediate moment', cost: 'uncertainty can expand without specific follow-up', others: 'people may feel calmer now but less secure later', pattern: 'delay/avoidance' },
};

const signalToTendency = {
  decisive: 'structureFirst',
  contextual: 'emotionFirst',
  reflective: 'inquiryFirst',
  delegative: 'systemsFirst',
  repair: 'repairFirst',
  optics: 'opticsFirst',
  delay: 'delayAvoidance',
};

export default function FactorModulePage({ module }) {
  const { factorId: factorKey, title, quote, teachingBlocks, interactions, reflectionPrompts, recoveryRehearsal, pressureShift, moduleTrains } = module;
  const [answers, setAnswers] = useState({});
  const [notes, setNotes] = useState({});
  const [done, setDone] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const ready = Object.keys(answers).length >= interactions.length && Object.values(notes).filter(Boolean).length >= 4;

  const tally = useMemo(() => {
    const counts = Object.fromEntries(Object.keys(tendencyProfiles).map((k) => [k, 0]));
    interactions.forEach((q, idx) => {
      const choice = answers[idx];
      if (choice === undefined) return;
      const signal = q.options[choice]?.signal || 'reflective';
      const tendency = signalToTendency[signal] || signal || 'inquiryFirst';
      counts[tendency] = (counts[tendency] || 0) + 1;
    });
    return counts;
  }, [answers, interactions]);

  const dominantKey = useMemo(() => Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] || 'inquiryFirst', [tally]);
  const profile = tendencyProfiles[dominantKey];
  const recoveryMove = `${recoveryRehearsal?.duringPressure || ''} ${profile.recovery}`.trim();
  const evidenceSummary = `${title}: ${profile.title}; drift=${profile.drift}; recovery=${recoveryMove}`;

  const completeModule = () => {
    const completedAt = new Date().toISOString();
    const nextFactor = factorCatalog.find((f) => f.key === factorKey);
    const saved = saveCourseEvidence((current) => ({
      ...current,
      latestCompletedFactor: factorKey,
      latestCompletedFactorTitle: title,
      interactionEvidence: { ...current.interactionEvidence, [factorKey]: answers },
      reflections: { ...current.reflections, [factorKey]: notes },
      growthSignals: [...(current.growthSignals || []), `${title}: ${profile.title}`],
      timelineEvents: [...(current.timelineEvents || []), { label: `${title} module completed`, timestamp: completedAt, source: 'course' }],
      courseEvidenceCount: (current.courseEvidenceCount || 0) + 1,
      factorEvidence: {
        ...current.factorEvidence,
        [factorKey]: { factorId: factorKey, factorTitle: title, completed: true, dominantTendency: profile.title, driftToWatch: profile.drift, recoveryMove, reflectionResponses: notes, interactionChoices: answers, completedAt, evidenceSummary, sourceChip: 'Course' },
      },
    }));
    saveEvidenceEvent(createEvidenceEvent({ sourceType: 'course_reflection', sourceId: `${factorKey}`, sourceLabel: `${title} Module`, evidenceType: 'eight_factors_course', summary: evidenceSummary, tags: ['8 Factors Course', 'Course'], factorImpacts: [addFactorImpact(factorKey, 0.75, 0.72, 'positive', 'Course calibration evidence')] }));
    setDone(true);
    setSyncMessage('Evidence synced to dashboard.');
    window.dispatchEvent(new StorageEvent('storage', { key: 'humanEquationCourseEvidence', newValue: JSON.stringify(saved) }));
  };

  const currentIndex = factorCatalog.findIndex((f) => f.key === factorKey);
  const nextFactor = currentIndex >= 0 && currentIndex < factorCatalog.length - 1 ? factorCatalog[currentIndex + 1] : null;

  return <main className="section section-light"><div className="container"><HumanEquationNav />
    <section className='hes-awareness-hero top-space-sm'>
      <p className='eyebrow'>Course → {title}</p>
      <div className='button-row top-space-sm'><Link className='button secondary' href='/human-equation-suite/course'>Back to Course</Link></div>
      <h1>{title}</h1><h2>{quote}</h2><p><strong>Pressure shift:</strong> {pressureShift}</p><p><strong>What this module trains:</strong> {moduleTrains}</p><p><strong>Current read:</strong> {Object.keys(answers).length ? `${profile.title} pattern emerging from your choices.` : 'No final pattern yet — begin the micro-pressure sequence.'}</p></section>
    <section className='top-space-sm card'><h2>Teaching section</h2>{teachingBlocks.map((b) => <article key={b.heading} className='top-space-sm'><h3>{b.heading}</h3><p>{b.body}</p></article>)}</section>
    <section className='top-space-sm card'><h2>Interaction moments</h2>{interactions.map((q,idx)=><article key={idx} className='top-space-sm'><h3>{q.prompt}</h3><div className='button-grid'>{q.options.map((o,i)=><button key={o.label} className={`button ${answers[idx]===i?'primary':'secondary'}`} onClick={()=>setAnswers((p)=>({...p,[idx]:i}))}>{o.label}</button>)}</div>{answers[idx]!==undefined&&(() => { const selected=q.options[answers[idx]]; const lens=signalFeedback[selected.signal]||signalFeedback.reflective; return <p><strong>Feedback:</strong> {selected.feedback} You protected {lens.protects}. The tradeoff is {lens.cost}. Others may experience this as {lens.others}. Leadership pattern signal: {lens.pattern}.</p>; })()}</article>)}</section>
    <section className='top-space-sm card'><h2>Reflection calibration (before debrief)</h2>{reflectionPrompts.map((r,idx)=><label key={idx} className='hes-reflect-field'><span>{r}</span><textarea rows={3} value={notes[idx]||''} onChange={(e)=>setNotes((p)=>({...p,[idx]:e.target.value}))} /></label>)}</section>
    <section className='top-space-sm card'><h2>Recovery rehearsal</h2><p><strong>Before pressure:</strong> {recoveryRehearsal.beforePressure}</p><p><strong>During pressure:</strong> {recoveryRehearsal.duringPressure}</p><p><strong>After pressure:</strong> {recoveryRehearsal.afterPressure}</p><p><strong>Language shift:</strong> {recoveryRehearsal.languageShift}</p><p><strong>60-second reset:</strong> {recoveryRehearsal.reset60}</p><p><strong>What others need from you:</strong> {recoveryRehearsal.othersNeed}</p></section>
    <section className='top-space-sm card'><h2>Guided pattern read / debrief</h2><p><strong>Dominant tendency:</strong> {profile.title}</p><p><strong>What this protects:</strong> {profile.protects}</p><p><strong>What it may cost:</strong> {profile.costs}</p><p><strong>What staff may experience:</strong> {profile.staffExperience}</p><p><strong>What parents may experience:</strong> {profile.parentExperience}</p><p><strong>Drift to watch:</strong> {profile.drift}</p><p><strong>Recovery pattern:</strong> {recoveryMove}</p><div className='button-row'><button className='button primary' disabled={!ready||done} onClick={completeModule}>{done?'Synced ✓':'Complete Module + Sync Dashboard Evidence'}</button><Link className='button secondary' href='/human-equation-suite/course'>Back to Course</Link></div>{syncMessage&&<p className='top-space-sm'><strong>{syncMessage}</strong></p>}{done&&<div className='top-space-sm card'><p>This factor has been added to your leadership profile.</p><div className='button-row'><Link className='button secondary' href='/human-equation-suite/dashboard'>Open Dashboard</Link><Link className='button secondary' href='/human-equation-suite/course'>Back to Course</Link>{nextFactor&&<Link className='button primary' href={`/human-equation-suite/course/${nextFactor.slug}`}>Continue to Next Factor</Link>}</div></div>}</section>
    <div className='button-row top-space-sm'><Link className='button secondary' href='/human-equation-suite/course'>Back to Course</Link></div>
  </div></main>;
}
