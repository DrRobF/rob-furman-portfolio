'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import HumanEquationNav from '../../../components/HumanEquationNav';
import { addFactorImpact, createEvidenceEvent, saveEvidenceEvent } from '../../dashboard/evidenceModel';

const LEGACY_EVIDENCE_KEY = 'humanEquationEvidence';
const COURSE_PROGRESS_KEY = 'humanAwarenessCourseProgress';

const lessons = [
  {
    id: 'lesson-1',
    title: 'Interpretive Presence',
    teaching: 'Executive awareness begins with what you notice first when emotions spike. Under stress, leaders often move to certainty before relational meaning is read.',
    schools: 'In schools, this looks like hallway escalation, parent volatility, and staff defensiveness being interpreted as resistance instead of signal.',
    others: 'Others feel safer when your first move is to read context before assigning motive.',
    biology: 'Pressure recruits fast-protective circuitry, narrowing empathy bandwidth and accelerating premature conclusions.',
    recovery: 'Recovery starts by slowing voice tempo and naming what may be happening for the person before you.',
    interaction: { id: 'scenario', prompt: 'An AP enters escalated after a parent accusation. First move?', options: ['Clarify timeline', 'Stabilize emotion', 'Check policy exposure', 'Escalate risk'] }
  },
  {
    id: 'lesson-2',
    title: 'Meaning Before Judgment',
    teaching: 'Behavior is visible; motive is inferred. Human awareness keeps those separate long enough to preserve judgment quality.',
    schools: 'This appears in difficult staff conversations where tone can be stress, not disrespect.',
    others: 'People experience dignity when they feel interpreted, not flattened into a behavior label.',
    biology: 'Cognitive load reduces perspective flexibility and increases attribution bias under urgency.',
    recovery: 'Re-open interpretation with one alternative hypothesis before deciding.',
    interaction: { id: 'frame', prompt: "A teacher's abrupt tone most likely signals:", options: ['Disrespect', 'Stress + unmet need', 'Resistance', 'Unprofessionalism'] }
  },
  {
    id: 'lesson-3',
    title: 'Pacing Under Urgency',
    teaching: 'Great leaders keep decisiveness while resisting interpretive compression. Pace control is a trust behavior.',
    schools: 'When incidents stack, fast action can outrun shared meaning with staff and families.',
    others: 'Others feel included when your reasoning is visible before directional commands.',
    biology: 'Adrenal activation narrows option scanning, making first explanations feel “obvious.”',
    recovery: 'Use a brief fact-meaning-next step framework to preserve speed and clarity.',
    interaction: { id: 'pace', prompt: 'When urgency rises:', options: ['Interpret then act', 'Brief inquiry then act', 'Deep inquiry then act'] }
  }
];

const sims = [
  { id: 'sim1', title: 'Micro-Pressure 01', prompt: 'Teacher enters escalated after parent complaint. What do you notice FIRST?', choices: ['Procedural concern', 'Emotional state', 'Policy issue', 'Timeline risk'], why: 'Your first attention target predicts whether people experience you as containing or controlling.' },
  { id: 'sim2', title: 'Micro-Pressure 02', prompt: 'Tense staff meeting goes silent. Interpret first:', choices: ['Compliance achieved', 'Unspoken disagreement', 'Execution confusion', 'Fear of speaking'], why: 'Silence can mean alignment, confusion, or fear; the read changes your leadership next move.' },
  { id: 'sim3', title: 'Micro-Pressure 03', prompt: 'Student conflict video spreads online. First attention:', choices: ['Reputation risk', 'Family emotional climate', 'Procedural review', 'Staff psychological safety'], why: 'Your primary lens under reputational threat reveals pressure drift patterns.' }
];

const reflections = ['What urgency changes your interpretation speed most?', 'When do people misunderstand your intent most?', 'Do you prioritize emotional stabilization or clarity first?', 'What leadership feedback has surprised you?'];

export default function Page() {
  const [answers, setAnswers] = useState({});
  const [refs, setRefs] = useState({});
  const [done, setDone] = useState(false);

  const total = lessons.length + sims.length;
  const answered = [...lessons.map((l) => l.interaction), ...sims].filter((q) => answers[q.id] !== undefined).length;
  const refCount = Object.values(refs).filter(Boolean).length;
  const progress = Math.round(((answered + refCount) / (total + reflections.length)) * 100);

  const tendency = useMemo(() => {
    const emo = ['Stabilize emotion', 'Stress + unmet need', 'Brief inquiry then act'];
    let hits = 0;
    lessons.forEach((l) => {
      const idx = answers[l.interaction.id];
      if (idx !== undefined && emo.includes(l.interaction.options[idx])) hits++;
    });
    return hits >= 2 ? 'Context-first' : 'Action-first';
  }, [answers]);

  const score = Math.max(2.3, Math.min(4.8, +(2.7 + answered * 0.18 + refCount * 0.12).toFixed(2)));
  const confidence = Math.min(98, 28 + answered * 12 + refCount * 8);
  const speedPattern = answered >= 4 ? 'Fast-interpretive under urgency' : 'Deliberate-interpretive under uncertainty';
  const drift = tendency === 'Context-first' ? 'Urgency compression after clarity' : 'Interpretive narrowing under pressure';
  const radar = [score, confidence / 20, tendency === 'Context-first' ? 4.2 : 3.1, refCount >= 3 ? 4 : 2.8, answered >= 4 ? 3.9 : 3.2];
  const ready = answered === total && refCount >= 3;

  const save = () => {
    if (typeof window === 'undefined') return;
    const payload = { type: 'HUMAN_AWARENESS_COURSE', completedAt: new Date().toISOString(), progress, score, confidence, tendency, drift, speedPattern, answers, refs };
    const legacy = JSON.parse(localStorage.getItem(LEGACY_EVIDENCE_KEY) || '[]');
    localStorage.setItem(LEGACY_EVIDENCE_KEY, JSON.stringify([...legacy, payload]));
    localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify({ complete: true, ...payload }));
    saveEvidenceEvent(createEvidenceEvent({ sourceType: 'course_reflection', sourceId: `human-awareness-${Date.now()}`, sourceLabel: 'Human Awareness Course Module', evidenceType: 'HUMAN_AWARENESS_COURSE', summary: `Course completed with ${confidence}% confidence evidence.`, tags: ['human awareness', 'course', speedPattern], factorImpacts: [addFactorImpact('humanAwareness', (score - 3) / 1.4, Math.min(0.95, confidence / 100), score >= 3.5 ? 'positive' : 'risk', 'Course calibration evidence'), addFactorImpact('regulationUnderPressure', tendency === 'Context-first' ? 0.25 : -0.1, 0.68, tendency === 'Context-first' ? 'positive' : 'risk', 'Pacing signal'), addFactorImpact('trustConstruction', refCount >= 3 ? 0.2 : 0.05, 0.65, 'positive', 'Reflection intelligence'), addFactorImpact('grayAreaLeadership', answered >= 4 ? 0.18 : 0.04, 0.62, 'positive', 'Interpretation speed and calibration consistency')], weight: 0.98 }));
    setDone(true);
  };

  return <main className="section section-light hes-awareness-page"><div className="container"><HumanEquationNav />
    <section className="hes-awareness-hero top-space-sm">
      <div className="hes-awareness-glow" /><div className="hes-awareness-glow alt" />
      <p className="eyebrow">Executive Factor Experience</p><h1>Human Awareness</h1><h2>“Pressure changes what humans notice first.”</h2>
      <div className="hes-awareness-hero-grid">
        <div><p>This factor trains how leaders interpret emotion, urgency, and meaning while preserving dignity and decisional clarity.</p>
          <div className='hes-awareness-live'>
            <div><label>Current score</label><strong>{score} / 5</strong></div><div><label>Pressure drift</label><strong>{drift}</strong></div><div><label>Strongest tendency</label><strong>{tendency}</strong></div><div><label>Completion</label><strong>{progress}%</strong></div>
          </div>
        </div>
        <div className='hes-awareness-radar'><svg viewBox="0 0 260 220" aria-label="Human Awareness radar">
          {[36,54,72,90].map((r)=><circle key={r} cx="110" cy="110" r={r} />)}
          {[0,1,2,3,4].map((i)=>{const a=(Math.PI*2*i)/5-Math.PI/2; return <line key={i} x1="110" y1="110" x2={110+Math.cos(a)*90} y2={110+Math.sin(a)*90} />;})}
          <polygon className='hes-radar-fill' points={radar.map((v,i)=>{const a=(Math.PI*2*i)/5-Math.PI/2;const r=(Math.max(1,Math.min(5,v))/5)*90;return `${110+Math.cos(a)*r},${110+Math.sin(a)*r}`;}).join(' ')} />
          {['Interpretation','Regulation','Trust','Recovery','Calibration'].map((l,i)=>{const a=(Math.PI*2*i)/5-Math.PI/2;return <text key={l} x={110+Math.cos(a)*104} y={114+Math.sin(a)*104}>{l}</text>;})}
          {[1,2,3,4,5].map((v)=><text key={v} x="116" y={110-((v/5)*90)} className='anchor'>{v}</text>)}
        </svg><small>Live factor radar · 1–5 anchors · adaptive profile signal</small></div>
      </div>
    </section>

    <section className='top-space-sm hes-lesson-flow'>{lessons.map((lesson, idx) => {const pick = answers[lesson.interaction.id]; return <article key={lesson.id} className='hes-lesson-card'>
      <p className='eyebrow'>Lesson {idx + 1}</p><h3>{lesson.title}</h3><p>{lesson.teaching}</p>
      <div className='hes-lesson-grid'><p><strong>In schools:</strong> {lesson.schools}</p><p><strong>Others feel:</strong> {lesson.others}</p><p><strong>Biology under pressure:</strong> {lesson.biology}</p><p><strong>Recovery looks like:</strong> {lesson.recovery}</p></div>
      <div className='hes-interaction'><h4>Interaction moment</h4><p>{lesson.interaction.prompt}</p><div className='button-grid'>{lesson.interaction.options.map((o, idy)=><button key={o} className={`button ${pick===idy?'primary':'secondary'} hes-choice`} onClick={()=>setAnswers((p)=>({...p,[lesson.interaction.id]:idy}))}>{o}</button>)}</div>
      {pick !== undefined && <p className='hes-live-read'><strong>Live interpretation:</strong> {lesson.interaction.options[pick]} indicates <em>{pick===0?'structure-seeking':'human-signal prioritization'}</em>. This influences confidence, urgency behavior, and recovery tendency evidence.</p>}</div>
      <p className='hes-calibration'><strong>Calibration:</strong> {pick===undefined?'Select an option to unlock next calibration insight.':`Current answers suggest ${tendency.toLowerCase()} leadership under load. Coaching cue: keep decisiveness, narrate your reasoning earlier.`}</p>
    </article>;})}</section>

    <section className='top-space-sm card'><h2>Micro-Pressure Interactions</h2><div className='hes-awareness-grid'>{sims.map((s)=>{const p=answers[s.id]; return <article key={s.id} className='hes-awareness-card signal micro'><p className='eyebrow'>{s.title}</p><h3>{s.prompt}</h3><div className='button-grid top-space-sm'>{s.choices.map((c,idx)=><button key={c} className={`button ${p===idx?'primary':'secondary'} hes-choice`} onClick={()=>setAnswers((pr)=>({...pr,[s.id]:idx}))}>{c}</button>)}</div>{p!==undefined&&<p className='top-space-sm'><strong>Why this matters:</strong> {s.why}<br/><strong>Signal weight:</strong> {['Structure','Emotion','Policy','Risk'][p]} lens stored for dashboard drift and confidence modeling.</p>}</article>;})}</div></section>

    <section className='top-space-sm card'><h2>Live Calibration Engine</h2><p className='lead'>What your current answers suggest:</p><p>“You consistently {tendency === 'Context-first' ? 'stabilize emotion before clarifying structure' : 'move to structure before emotional stabilization'}. This preserves {tendency === 'Context-first' ? 'relational dignity' : 'decisional momentum'} under pressure, but may increase {tendency === 'Context-first' ? 'decisional certainty lag' : 'human interpretation risk'}.”</p><p><strong>Coaching:</strong> Keep your natural strength, then add one explicit line of shared reasoning before action commitment.</p></section>

    <section className='top-space-sm card hes-recovery'><h2>Recovery Rehearsal</h2><p><strong>Before pressure:</strong> Notice faster speech, narrowed attention, and rising certainty language.</p><p><strong>During pressure:</strong> Interrupt interpretive compression: facts first, meaning second, action third.</p><p><strong>After pressure:</strong> Repair trust by naming what you saw, what you missed, and what changes next cycle.</p><p><strong>Language shift:</strong> “Here is what I know. Here is what I may be over-reading. Here is our next verifiable step.”</p><p><strong>60-second reset:</strong> 15s breath + 20s facts + 15s alternate read + 10s assignment and follow-up window.</p><p><strong>What others need from you:</strong> Emotional dignity plus visible decisional logic.</p></section>

    <section className='top-space-sm card'><h2>Factor Debrief</h2><p>Your responses suggest you naturally preserve {tendency === 'Context-first' ? 'emotional dignity' : 'decisional structure'} under pressure. However, urgency appears to {tendency === 'Context-first' ? 'compress collaborative explanation after certainty forms' : 'reduce motive curiosity while certainty rises'}.</p><ul><li><strong>Strongest behavior:</strong> {tendency} interpretation pattern.</li><li><strong>Hidden risk:</strong> {drift}.</li><li><strong>Likely staff perception:</strong> steady leadership with occasional reasoning opacity.</li><li><strong>Likely parent perception:</strong> composed presence, variable clarity pace.</li><li><strong>Leadership drift:</strong> {speedPattern}.</li><li><strong>Next growth target:</strong> make one competing interpretation visible before final direction.</li></ul>
      <div className='button-row top-space-sm'><button className='button primary' disabled={!ready || done} onClick={save}>{done ? 'Evidence Saved to Dashboard' : 'Complete Module + Sync Dashboard Evidence'}</button><Link href='/human-equation-suite/dashboard' className='button secondary'>Open Dashboard</Link></div>
    </section>

    <section className='top-space-sm card'><h2>Leadership Reflection Calibration</h2>{reflections.map((q,idx)=><label key={q} className='hes-reflect-field'><span>{idx+1}. {q}</span><textarea rows={3} value={refs[idx]||''} onChange={(e)=>setRefs((p)=>({...p,[idx]:e.target.value}))} /></label>)}</section>
  </div></main>;
}
