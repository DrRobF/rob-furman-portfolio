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
    title: 'What You Notice First',
    teaching:
      'When pressure rises, leaders often start solving before they fully understand what people are feeling. Human awareness starts with noticing that moment.',
    schools:
      'A parent storms into the office, an assistant principal is shaken, and everyone is waiting for your first words. What you notice first shapes the room.',
    others:
      'People feel steadier when your first move makes space for both emotion and facts.',
    recovery:
      'Slow your pace, name what you are seeing, and ask one grounding question before deciding.',
    interaction: {
      id: 'scenario',
      prompt: 'An AP enters escalated after a parent accusation. What is your first move?',
      options: ['Clarify timeline', 'Stabilize emotion', 'Check policy exposure', 'Escalate risk'],
      reads: [
        'You move quickly to sequence and facts. This protects clarity, especially in conflict, but people may still feel emotionally unseen at first.',
        'You prioritize emotional stabilization before process. This protects dignity and helps people stay open, though next steps can feel delayed if not named quickly.',
        'You go straight to procedural boundaries. This protects consistency and fairness, but can make the interaction feel formal before it feels human.',
        'You immediately scan for downside and escalation points. This can prevent bigger harm, but it may raise anxiety if people do not hear your care for them too.'
      ]
    }
  },
  {
    id: 'lesson-2',
    title: 'Meaning Before Assumption',
    teaching:
      'In school leadership, behavior is visible but inner reality is not. Strong leaders stay curious long enough to avoid reading stress as disrespect.',
    schools:
      'In a tense staff meeting, a teacher speaks sharply. The room tightens. Your interpretation will either open trust or close it.',
    others:
      'People feel respected when they are interpreted with care, not reduced to one moment.',
    recovery:
      'Offer one alternate explanation out loud before landing on judgment.',
    interaction: {
      id: 'frame',
      prompt: "A teacher's abrupt tone most likely signals:",
      options: ['Disrespect', 'Stress + unmet need', 'Resistance', 'Unprofessionalism'],
      reads: [
        'You read direct challenge quickly. This can protect authority in unstable moments, but it may miss the stress behind the tone.',
        'You assume stress and unmet need before blame. This keeps relationships intact and often lowers defensiveness, especially after hard days.',
        'You notice potential pushback to change. This helps with implementation planning, though it can narrow empathy if used too early.',
        'You anchor on professional standards first. This protects expectations, but can feel distancing if emotion is still running high.'
      ]
    }
  },
  {
    id: 'lesson-3',
    title: 'Pacing Under Urgency',
    teaching:
      'Fast decisions are part of leadership. The question is whether people can follow how you got there.',
    schools:
      'During a hallway escalation, adults look to you for direction while students watch your tone and timing.',
    others:
      'Trust rises when people hear your reasoning before the final directive.',
    recovery:
      'Use a quick rhythm: what happened, what it means, what happens next.',
    interaction: {
      id: 'pace',
      prompt: 'When urgency rises, which sequence sounds most like you?',
      options: ['Interpret then act', 'Brief inquiry then act', 'Deep inquiry then act'],
      reads: [
        'You form a read quickly and move. This preserves momentum, but your team may need more visible reasoning to stay aligned.',
        'You ask a focused question, then decide. This often balances speed and trust in real school pressure.',
        'You prefer fuller understanding before action. This can protect fairness, but in high urgency moments others may experience delay.'
      ]
    }
  }
];

const sims = [
  {
    id: 'sim1',
    title: 'Micro-Pressure 01',
    prompt: 'A teacher enters escalated after a parent complaint. What do you notice first?',
    choices: ['Procedural concern', 'Emotional state', 'Policy issue', 'Timeline risk'],
    why: [
      'Procedure-first leaders protect order quickly. In school crises, this helps stabilize decisions.',
      'Emotion-first leaders lower heat and preserve dignity, especially when people feel personally attacked.',
      'Policy-first leaders protect consistency across families and staff, especially when boundaries are blurry.',
      'Risk-first leaders protect the campus from compounding problems, but may need to narrate care more explicitly.'
    ]
  },
  {
    id: 'sim2',
    title: 'Micro-Pressure 02',
    prompt: 'A tense staff meeting goes quiet. Your first interpretation:',
    choices: ['Compliance achieved', 'Unspoken disagreement', 'Execution confusion', 'Fear of speaking'],
    why: [
      'If you read silence as agreement, your next step is speed. Useful sometimes, risky when people are withholding concerns.',
      'If you read disagreement, you create space for honest tension before it becomes hallway resistance.',
      'If you read confusion, you clarify ownership and expectations before frustration builds.',
      'If you read fear, you address safety in the room so truth can come back into the conversation.'
    ]
  },
  {
    id: 'sim3',
    title: 'Micro-Pressure 03',
    prompt: 'A student conflict video spreads online. Where does your attention go first?',
    choices: ['Reputation risk', 'Family emotional climate', 'Procedural review', 'Staff psychological safety'],
    why: [
      'Reputation-first attention protects community trust externally, but internal healing still needs intentional time.',
      'Family-climate attention protects empathy and partnership when emotions are high and facts are still moving.',
      'Procedure-first attention protects fairness and due process under scrutiny.',
      'Staff-safety attention protects adult steadiness so students experience consistent care the next day.'
    ]
  }
];

const reflections = [
  'Where do you feel your interpretation speed up the most: parent conflict, staff tension, or student safety moments?',
  'When have people misunderstood your intent even though your decision was sound?',
  'What helps you hold both humanity and clarity when urgency is high?',
  'What is one pressure pattern you want to change in the next 30 days?'
];

export default function Page() {
  const [answers, setAnswers] = useState({});
  const [refs, setRefs] = useState({});
  const [done, setDone] = useState(false);

  const total = lessons.length + sims.length;
  const answered = [...lessons.map((l) => l.interaction), ...sims].filter((q) => answers[q.id] !== undefined).length;
  const refCount = Object.values(refs).filter(Boolean).length;
  const progress = Math.round(((answered + refCount) / (total + reflections.length)) * 100);

  const tendency = useMemo(() => {
    const contextFirst = ['Stabilize emotion', 'Stress + unmet need', 'Brief inquiry then act'];
    let hits = 0;
    lessons.forEach((l) => {
      const idx = answers[l.interaction.id];
      if (idx !== undefined && contextFirst.includes(l.interaction.options[idx])) hits += 1;
    });
    return hits >= 2 ? 'Context-first' : 'Action-first';
  }, [answers]);

  const score = Math.max(2.3, Math.min(4.8, +(2.7 + answered * 0.18 + refCount * 0.12).toFixed(2)));
  const confidence = Math.min(98, 28 + answered * 12 + refCount * 8);
  const speedPattern = answered >= 4 ? 'Fast interpretation under urgency' : 'Deliberate interpretation under uncertainty';
  const drift = tendency === 'Context-first' ? 'Clarity may lag in high urgency' : 'Emotion may be missed in high urgency';
  const radar = [score, confidence / 20, tendency === 'Context-first' ? 4.2 : 3.1, refCount >= 3 ? 4 : 2.8, answered >= 4 ? 3.9 : 3.2];
  const ready = answered === total && refCount >= 3;

  const save = () => {
    if (typeof window === 'undefined') return;
    const payload = { type: 'HUMAN_AWARENESS_COURSE', completedAt: new Date().toISOString(), progress, score, confidence, tendency, drift, speedPattern, answers, refs };
    const legacy = JSON.parse(localStorage.getItem(LEGACY_EVIDENCE_KEY) || '[]');
    localStorage.setItem(LEGACY_EVIDENCE_KEY, JSON.stringify([...legacy, payload]));
    localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify({ complete: true, ...payload }));
    saveEvidenceEvent(
      createEvidenceEvent({
        sourceType: 'course_reflection',
        sourceId: `human-awareness-${Date.now()}`,
        sourceLabel: 'Human Awareness Course Module',
        evidenceType: 'HUMAN_AWARENESS_COURSE',
        summary: `Course completed with ${confidence}% confidence evidence.`,
        tags: ['human awareness', 'course', speedPattern],
        factorImpacts: [
          addFactorImpact('humanAwareness', (score - 3) / 1.4, Math.min(0.95, confidence / 100), score >= 3.5 ? 'positive' : 'risk', 'Course calibration evidence'),
          addFactorImpact('regulationUnderPressure', tendency === 'Context-first' ? 0.25 : -0.1, 0.68, tendency === 'Context-first' ? 'positive' : 'risk', 'Pacing signal'),
          addFactorImpact('trustConstruction', refCount >= 3 ? 0.2 : 0.05, 0.65, 'positive', 'Reflection intelligence'),
          addFactorImpact('grayAreaLeadership', answered >= 4 ? 0.18 : 0.04, 0.62, 'positive', 'Interpretation speed and calibration consistency')
        ],
        weight: 0.98
      })
    );
    setDone(true);
  };

  return <main className="section section-light hes-awareness-page"><div className="container"><HumanEquationNav />
    <section className="hes-awareness-hero top-space-sm">
      <div className="hes-awareness-glow" /><div className="hes-awareness-glow alt" />
      <p className="eyebrow">Factor Learning Experience</p><h1>Human Awareness</h1><h2>“Pressure changes what humans notice first.”</h2>
      <div className="hes-awareness-hero-grid">
        <div><p>This module helps you notice how urgency shapes interpretation in real school leadership moments.</p>
          <div className='hes-awareness-live'>
            <div><label>Course progress</label><strong>{progress}%</strong></div><div><label>Pattern status</label><strong>{answered < 3 ? 'Early discovery' : answered < total ? 'Emerging patterns' : 'Ready for debrief'}</strong></div><div><label>Signal depth</label><strong>{answered} of {total} interactions</strong></div><div><label>Reflection depth</label><strong>{refCount} of {reflections.length}</strong></div>
          </div>
        </div>
        <div className='hes-awareness-radar'><svg viewBox="0 0 260 220" aria-label="Human Awareness radar">
          {[36,54,72,90].map((r)=><circle key={r} cx="110" cy="110" r={r} />)}
          {[0,1,2,3,4].map((i)=>{const a=(Math.PI*2*i)/5-Math.PI/2; return <line key={i} x1="110" y1="110" x2={110+Math.cos(a)*90} y2={110+Math.sin(a)*90} />;})}
          <polygon className='hes-radar-fill' points={radar.map((v,i)=>{const a=(Math.PI*2*i)/5-Math.PI/2;const r=(Math.max(1,Math.min(5,v))/5)*90;return `${110+Math.cos(a)*r},${110+Math.sin(a)*r}`;}).join(' ')} />
          {['Interpretation','Regulation','Trust','Recovery','Calibration'].map((l,i)=>{const a=(Math.PI*2*i)/5-Math.PI/2;return <text key={l} x={110+Math.cos(a)*104} y={114+Math.sin(a)*104}>{l}</text>;})}
          {[1,2,3,4,5].map((v)=><text key={v} x="116" y={110-((v/5)*90)} className='anchor'>{v}</text>)}
        </svg><small>Pattern map in progress · your profile reveals itself as you interact</small></div>
      </div>
    </section>

    <section className='top-space-sm hes-lesson-flow'>{lessons.map((lesson, idx) => {const pick = answers[lesson.interaction.id]; return <article key={lesson.id} className='hes-lesson-card'>
      <p className='eyebrow'>Lesson {idx + 1}</p><h3>{lesson.title}</h3><p>{lesson.teaching}</p>
      <div className='hes-lesson-grid'><p><strong>In schools:</strong> {lesson.schools}</p><p><strong>What others feel:</strong> {lesson.others}</p><p><strong>Practice in the moment:</strong> {lesson.recovery}</p></div>
      <div className='hes-interaction'><h4>Interaction moment</h4><p>{lesson.interaction.prompt}</p><div className='button-grid'>{lesson.interaction.options.map((o, idy)=><button key={o} className={`button ${pick===idy?'primary':'secondary'} hes-choice`} onClick={()=>setAnswers((p)=>({...p,[lesson.interaction.id]:idy}))}>{o}</button>)}</div>
      {pick !== undefined && <p className='hes-live-read'><strong>Live interpretation:</strong> {lesson.interaction.reads[pick]}</p>}</div>
      <p className='hes-calibration'><strong>Coaching cue:</strong> {pick===undefined?'Choose a response to unlock coaching for this specific pressure move.':'Keep your natural instinct, then add one sentence that names your reasoning so people can stay with you.'}</p>
    </article>;})}</section>

    <section className='top-space-sm card'><h2>Micro-Pressure Interactions</h2><div className='hes-awareness-grid'>{sims.map((s)=>{const p=answers[s.id]; return <article key={s.id} className='hes-awareness-card signal micro'><p className='eyebrow'>{s.title}</p><h3>{s.prompt}</h3><div className='button-grid top-space-sm'>{s.choices.map((c,idx)=><button key={c} className={`button ${p===idx?'primary':'secondary'} hes-choice`} onClick={()=>setAnswers((pr)=>({...pr,[s.id]:idx}))}>{c}</button>)}</div>{p!==undefined&&<p className='top-space-sm'><strong>Why this matters:</strong> {s.why[p]}</p>}</article>;})}</div></section>

    <section className='top-space-sm card'><h2>Leadership Reflection Calibration</h2><p className='lead'>Before conclusions, pause and process your own pattern in words.</p>{reflections.map((q,idx)=><label key={q} className='hes-reflect-field'><span>{idx+1}. {q}</span><textarea rows={3} value={refs[idx]||''} onChange={(e)=>setRefs((p)=>({...p,[idx]:e.target.value}))} /></label>)}</section>

    <section className='top-space-sm card'><h2>Guided Pattern Read</h2><p>You are showing a <strong>{tendency}</strong> starting tendency under pressure. This is not a fixed identity. It is an emerging pattern based on how you interpreted high-urgency moments in this module.</p><p><strong>What this protects:</strong> {tendency === 'Context-first' ? 'Relational steadiness and emotional trust.' : 'Momentum and procedural clarity.'}</p><p><strong>What to watch:</strong> {drift}.</p><p><strong>Next growth move:</strong> In your next difficult conversation, name one human observation and one structural observation before giving direction.</p><ul><li><strong>Staff may experience you as:</strong> {tendency === 'Context-first' ? 'supportive, then decisive.' : 'decisive, then relational.'}</li><li><strong>Families may experience you as:</strong> {tendency === 'Context-first' ? 'present and calm, with occasional delay on next steps.' : 'clear and direct, with occasional emotional distance.'}</li><li><strong>Pressure signature right now:</strong> {speedPattern}.</li></ul>
      <div className='button-row top-space-sm'><button className='button primary' disabled={!ready || done} onClick={save}>{done ? 'Evidence Saved to Dashboard' : 'Complete Module + Sync Dashboard Evidence'}</button><Link href='/human-equation-suite/dashboard' className='button secondary'>Open Dashboard</Link></div>
    </section>
  </div></main>;
}
