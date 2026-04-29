'use client';

import { useMemo, useState } from 'react';

const urbanStudentScenes = [
  {
    id: 'scene_2am_bedroom',
    sceneNumber: 1,
    totalScenes: 10,
    time: '2:00 AM',
    heading: 'Bedroom at 2:00 AM',
    visualTone: 'late-night',
    revealGroups: [
      [
        {
          type: 'paragraph',
          text: 'It’s 2:00 AM, and you’re still awake. Laughter keeps cutting through the floor from downstairs — your mom and her boyfriend. It has been going on for hours, ever since he showed up around 10:00.',
        },
        {
          type: 'paragraph',
          text: 'You keep your eyes closed, but it does not help. You are not even close to asleep. Beside you, your baby sister is curled into the blanket, somehow still sleeping through all of it.',
        },
        { type: 'thought', text: 'How is she still asleep? How do you not wake up to this?' },
      ],
      [
        {
          type: 'paragraph',
          text: 'You shift under the blanket. The mattress creaks. The laughter gets louder for a second, then drops back into muffled voices below you.',
        },
        { type: 'paragraph', text: 'You check the clock. 2:07. You have to be up at 6:00.' },
        { type: 'thought', text: 'Four hours. No — less than that. I’m gonna be dead tomorrow.' },
      ],
      [
        {
          type: 'paragraph',
          text: 'You pull the blanket higher, trying to block out the sound. It barely changes anything. Another burst of laughter comes through the floor, and your jaw tightens.',
        },
        {
          type: 'thought',
          text: 'Why does this always happen on school nights? Why doesn’t she care? If I say something, it’s just gonna get worse.',
        },
        { type: 'paragraph', text: 'You turn toward your sister again. Still asleep. You stare at the ceiling, wide awake.' },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'What assumptions might an adult make about Adam if he seems tired or disengaged later?',
        'How might disrupted sleep affect his patience, focus, or tone at school?',
        'What would a teacher need to know before interpreting his behavior?',
      ],
      writingPrompt: 'In 2–3 sentences, describe how you would respond if Adam appears disengaged in first period.',
      insight:
        'A student’s visible behavior may be the last part of a much longer night. Fatigue can look like defiance, disinterest, or poor motivation when the real issue is exhaustion and emotional overload.',
      expandedInsight:
        'Adam has not even entered school yet, but the school day is already being shaped. Sleep disruption affects patience, memory, focus, impulse control, and the ability to respond calmly to adult direction. If an educator only sees the tired student in class, they may miss the night that produced the behavior.',
      facilitatorLens:
        'Ask participants what they would normally assume if a student put his head down, snapped back, or failed to engage during first period.',
    },
    choices: [
      {
        id: 'ignore_noise', label: 'Put the pillow over your head and try to block it out', resultTitle: 'You try to shut the world out.', metrics: { sleep: -1, stress: 1, time: 0 },
        result: [
          { type: 'paragraph', text: 'You press the pillow over your ears and turn your face toward the wall. For a few seconds, the room feels smaller and darker, like maybe you can disappear into it.' },
          { type: 'paragraph', text: 'The noise still gets through. Not clearly, but enough. A laugh. A chair moving. A voice rising and falling.' },
          { type: 'thought', text: 'Just stop. Just for one night.' },
          { type: 'paragraph', text: 'Your neck starts to ache from the way you are curled up. You stay there anyway.' },
        ],
        nextSceneId: 'scene_625am_bedroom',
      },
      {
        id: 'confront_mom', label: 'Get up and ask them to be quiet', resultTitle: 'You step into the hallway.', metrics: { sleep: -1, stress: 2, time: -1 },
        result: [
          { type: 'paragraph', text: 'You sit up slowly and listen. For a second, you almost talk yourself out of it. Then another laugh comes from downstairs, and you swing your feet onto the floor.' },
          { type: 'paragraph', text: 'The hallway feels colder than your room. You stand at the top of the stairs and look down into the dim light.' },
          { type: 'thought', text: 'Don’t make this worse. Just ask. Just say it normal.' },
          { type: 'paragraph', text: 'Your voice comes out smaller than you want it to. You ask if they can keep it down because you have school in the morning.' },
          { type: 'paragraph', text: 'There is a pause. Then your mom’s voice answers back, sharp enough to make your stomach drop.' },
          { type: 'thought', text: 'I should’ve stayed in bed.' },
        ],
        nextSceneId: 'scene_625am_bedroom',
      },
      {
        id: 'check_sister', label: 'Check on your sister', resultTitle: 'You check on your sister.', metrics: { sleep: -1, stress: 1, time: 0 },
        result: [
          { type: 'paragraph', text: 'You turn carefully so you do not wake her. Her face is half-buried in the blanket, one hand tucked under her cheek.' },
          { type: 'paragraph', text: 'You watch her breathe for a moment. Slow. Even. Somehow safe inside sleep.' },
          { type: 'thought', text: 'At least she’s okay. At least one of us is sleeping.' },
          { type: 'paragraph', text: 'You fix the blanket near her shoulder, then lie back down without making a sound.' },
        ],
        nextSceneId: 'scene_625am_bedroom',
      },
      {
        id: 'phone_distraction', label: 'Grab your phone and distract yourself', resultTitle: 'You reach for your phone.', metrics: { sleep: -2, stress: 1, time: -1 },
        result: [
          { type: 'paragraph', text: 'The screen lights up your face. It is too bright, but you do not turn it down right away.' },
          { type: 'paragraph', text: 'You scroll without really reading. Videos. Messages. Random posts. Anything that is not the noise downstairs.' },
          { type: 'thought', text: 'Just a few minutes. Then I’ll sleep.' },
          { type: 'paragraph', text: 'The minutes do not feel like minutes. They disappear.' },
        ],
        nextSceneId: 'scene_625am_bedroom',
      },
    ],
  },
  {
    id: 'scene_625am_bedroom', sceneNumber: 2, totalScenes: 10, time: '6:25 AM', heading: 'Bedroom at 6:25 AM', visualTone: 'morning',
    introByPreviousChoice: {
      ignore_noise: [
        { type: 'paragraph', text: 'The alarm cuts through the room. Sharp. Repeating. Your eyes open, but your body does not move.' },
        { type: 'paragraph', text: 'Your neck hurts from the way you slept. The pillow is still shoved near your head like it was supposed to protect you from the whole house.' },
        { type: 'thought', text: 'That barely helped. Did I even sleep?' },
      ],
      confront_mom: [
        { type: 'paragraph', text: 'The alarm cuts through the room. Sharp. Repeating. Your eyes open, and for a second you remember the hallway before you remember the morning.' },
        { type: 'paragraph', text: 'The house is quiet now, but it does not feel peaceful. It feels heavy.' },
        { type: 'thought', text: 'That didn’t help anything. I should’ve just stayed quiet.' },
      ],
      check_sister: [
        { type: 'paragraph', text: 'The alarm cuts through the room. Sharp. Repeating. Your eyes open, and the first thing you do is look beside you.' },
        { type: 'paragraph', text: 'Your sister is still asleep, curled into the blanket. You remember watching her breathe last night, making sure she was okay.' },
        { type: 'thought', text: 'At least she slept. At least she’s okay.' },
      ],
      phone_distraction: [
        { type: 'paragraph', text: 'The alarm cuts through the room. Sharp. Repeating. Your phone is already in your hand.' },
        { type: 'paragraph', text: 'You do not remember putting it down. Your eyes burn before you even sit up.' },
        { type: 'thought', text: 'I was on this way too late.' },
      ],
      default: [
        { type: 'paragraph', text: 'The alarm cuts through the room. Sharp. Repeating. Your eyes open, but your body does not move.' },
        { type: 'paragraph', text: 'You feel like you never really slept.' },
        { type: 'thought', text: 'No way it’s already morning.' },
      ],
    },
    coreRevealGroups: [
      [
        { type: 'paragraph', text: 'You reach for your phone and stare at the time. 6:25.' },
        { type: 'thought', text: 'I just closed my eyes.' },
        { type: 'paragraph', text: 'The room feels colder now. The house is quiet, of course. Quiet now, when it no longer helps you.' },
      ],
      [
        { type: 'paragraph', text: 'You sit up slowly. Your head throbs. You try to think through what you have today, but nothing lands clearly.' },
        { type: 'paragraph', text: 'You swing your feet to the floor and stand there for a second, trying to wake up.' },
        { type: 'thought', text: 'It’s not working.' },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'What might Adam’s morning choices reveal about exhaustion, responsibility, and stress?',
        'How could being late or unprepared be connected to what happened before school?',
        'How should an adult respond differently if they understand the night-before context?',
      ],
      writingPrompt: 'Write one supportive adult response that addresses the behavior without ignoring the context.',
      insight:
        'Morning behavior is often shaped before the school day begins. Rushing, lateness, irritability, or shutdown may be connected to sleep disruption, caregiving stress, and emotional load.',
      expandedInsight:
        'By the time Adam wakes up, he is already making decisions under pressure. Choices that look irresponsible from the outside may actually be attempts to manage exhaustion, family responsibility, and limited control. This is where educators can begin separating behavior from character.',
      facilitatorLens:
        'Ask participants how their response would change if they knew the student’s morning began this way.',
    },
    choices: [
      { id: 'snooze', label: 'Hit snooze and lie back down', resultTitle: 'You lie back down.', metrics: { sleep: 1, stress: 1, time: -2 }, result: [
        { type: 'paragraph', text: 'You tap the screen and let the alarm go quiet. The silence feels too good for one second.' },
        { type: 'paragraph', text: 'You lie back down, telling yourself you only need five minutes. Your eyes close before you finish the thought.' },
        { type: 'thought', text: 'Just five. I can still make it.' },
        { type: 'paragraph', text: 'But the morning is already moving without you.' },
      ], nextSceneId: 'scene_640am_getting_ready' },
      { id: 'get_ready', label: 'Get up and start getting ready', resultTitle: 'You force yourself up.', metrics: { sleep: 0, stress: 1, time: 0 }, result: [
        { type: 'paragraph', text: 'You stand before your body feels ready. Your legs are heavy, but you move anyway.' },
        { type: 'paragraph', text: 'You look around the room for what you need: clothes, shoes, backpack, something clean enough to wear.' },
        { type: 'thought', text: 'Move. Just move.' },
        { type: 'paragraph', text: 'You are awake now, but not clear. Every small thing feels like it takes longer than it should.' },
      ], nextSceneId: 'scene_640am_getting_ready' },
      { id: 'check_phone', label: 'Check your phone first', resultTitle: 'You check your phone.', metrics: { sleep: 0, stress: 1, time: -1 }, result: [
        { type: 'paragraph', text: 'You unlock the phone before you stand up. Notifications stack over each other. A few messages. A few things you do not need to see right now.' },
        { type: 'paragraph', text: 'You tell yourself you are just checking the time, but your thumb keeps moving.' },
        { type: 'thought', text: 'One second. Then I’ll get up.' },
        { type: 'paragraph', text: 'The room stays still around you, but the clock does not.' },
      ], nextSceneId: 'scene_640am_getting_ready' },
      { id: 'wake_sister', label: 'Wake your sister up', resultTitle: 'You wake your sister.', metrics: { sleep: 0, stress: 2, time: -1 }, result: [
        { type: 'paragraph', text: 'You touch her shoulder gently. She shifts but does not open her eyes.' },
        { type: 'paragraph', text: 'You say her name quietly. Then again. She makes a small sound and turns away from the light.' },
        { type: 'thought', text: 'Come on. I can’t be late again.' },
        { type: 'paragraph', text: 'You are trying to be patient, but you can already feel the morning getting away from you.' },
      ], nextSceneId: 'scene_640am_getting_ready' },
    ],
  },
];

const sceneById = Object.fromEntries(urbanStudentScenes.map((scene) => [scene.id, scene]));

const renderBlocks = (blocks) =>
  blocks.map((block, index) =>
    block.type === 'thought' ? (
      <aside key={`${block.type}-${index}`} className="thought-wrap">
        <p className="thought-label">ADAM’S THOUGHTS</p>
        <div className="thought-card">{block.text}</div>
      </aside>
    ) : (
      <p key={`${block.type}-${index}`} className="paragraph-card">{block.text}</p>
    )
  );

const metricConfig = { sleep: { label: 'Sleep', color: '#3b82f6' }, stress: { label: 'Stress', color: '#ef4444' }, time: { label: 'Time', color: '#f59e0b' } };
const metricOrder = ['sleep', 'stress', 'time'];
const initialMetrics = { sleep: 6, stress: 2, time: 5 };
const clampMetric = (value) => Math.max(0, Math.min(10, value));

export default function DayInTheLifeUrbanStudentPage() {
  const [sceneId, setSceneId] = useState('scene_2am_bedroom');
  const [selectedChoices, setSelectedChoices] = useState({});
  const [revealedGroupCounts, setRevealedGroupCounts] = useState({ scene_2am_bedroom: 1, scene_625am_bedroom: 1 });
  const [sceneMetrics, setSceneMetrics] = useState(initialMetrics);
  const [showInsights, setShowInsights] = useState({});

  const scene = sceneById[sceneId] ?? urbanStudentScenes[0];
  const selectedChoiceId = selectedChoices[scene.id];
  const selectedChoice = scene.choices.find((choice) => choice.id === selectedChoiceId);

  const revealGroups = useMemo(() => {
    if (scene.id === 'scene_625am_bedroom') {
      const previousChoiceId = selectedChoices.scene_2am_bedroom;
      const introSet = scene.introByPreviousChoice?.[previousChoiceId] ?? scene.introByPreviousChoice?.default ?? [];
      return [introSet, ...(scene.coreRevealGroups ?? [])];
    }
    return scene.revealGroups ?? [];
  }, [scene, selectedChoices.scene_2am_bedroom]);

  const visibleGroupCount = Math.min(revealedGroupCounts[scene.id] ?? 1, revealGroups.length || 1);
  const visibleGroups = revealGroups.slice(0, visibleGroupCount);
  const isFullyRevealed = visibleGroupCount >= revealGroups.length;

  const handleRevealMore = () => {
    setRevealedGroupCounts((prev) => ({ ...prev, [scene.id]: Math.min((prev[scene.id] ?? 1) + 1, revealGroups.length) }));
  };

  const handleChoose = (choiceId) => {
    const nextChoice = scene.choices.find((choice) => choice.id === choiceId);
    if (!nextChoice) return;
    const previousChoiceId = selectedChoices[scene.id];
    const previousChoice = scene.choices.find((choice) => choice.id === previousChoiceId);
    setSceneMetrics((prev) => {
      const withRevertedPrior = { ...prev };
      if (previousChoice) {
        metricOrder.forEach((metric) => {
          withRevertedPrior[metric] = clampMetric((withRevertedPrior[metric] ?? 0) - (previousChoice.metrics?.[metric] ?? 0));
        });
      }
      const nextMetrics = { ...withRevertedPrior };
      metricOrder.forEach((metric) => {
        nextMetrics[metric] = clampMetric((nextMetrics[metric] ?? 0) + (nextChoice.metrics?.[metric] ?? 0));
      });
      return nextMetrics;
    });
    setSelectedChoices((prev) => ({ ...prev, [scene.id]: choiceId }));
  };

  const handleContinue = () => {
    if (selectedChoice?.nextSceneId && sceneById[selectedChoice.nextSceneId]) {
      setSceneId(selectedChoice.nextSceneId);
      setRevealedGroupCounts((prev) => ({ ...prev, [selectedChoice.nextSceneId]: prev[selectedChoice.nextSceneId] ?? 1 }));
      return;
    }
    setSceneId('scene_placeholder_end');
  };

  if (sceneId === 'scene_placeholder_end') {
    return <main className="urban-student-page"><section className="experience-shell"><article className="scene-card"><h1>Next scene not built yet.</h1><p className="paragraph-card">This prototype currently focuses on the first two scenes so we can perfect the experience before adding the rest of Adam’s day.</p></article></section></main>;
  }

  const changedMetrics = metricOrder
    .map((metric) => [metric, selectedChoice?.metrics?.[metric] ?? 0])
    .filter(([, value]) => value !== 0);

  return (
    <main className="urban-student-page">
      <section className="experience-shell">
        <article className="scene-card">
          <header className="scene-header">
            <div className="tone-band" />
            <p>{scene.time}</p>
            <h1>{scene.heading}</h1>
            <p>Scene {scene.sceneNumber} of {scene.totalScenes}</p>
          </header>
          <div className="metrics-stack">
            {metricOrder.map((metric) => (
              <div className="metric-row" key={metric}>
                <div className="metric-row-meta">
                  <span>{metricConfig[metric].label}</span>
                  <span>{sceneMetrics[metric]}/10</span>
                </div>
                <div className="metric-track">
                  <div className="metric-fill" style={{ width: `${(sceneMetrics[metric] / 10) * 100}%`, background: metricConfig[metric].color }} />
                </div>
              </div>
            ))}
          </div>

          <p className="section-label">THE MOMENT</p>
          <div className="scene-content">{visibleGroups.map((group, index) => <div key={`group-${index}`}>{renderBlocks(group)}</div>)}</div>
          {!isFullyRevealed && <button type="button" className="continue-moment" onClick={handleRevealMore}>Continue the moment</button>}

          {isFullyRevealed && !selectedChoice && (
            <div className="choices-section">
              <p className="section-label">YOUR CHOICE</p>
              <h2>{scene.question}</h2>
              <div className="button-group">
                {scene.choices.map((choice) => <button key={choice.id} type="button" onClick={() => handleChoose(choice.id)}>{choice.label}</button>)}
              </div>
            </div>
          )}

          {selectedChoice && (
            <section className="result-section">
              <p className="section-label">YOUR CHOICE</p>
              <p className="selected-pill">You chose: {selectedChoice.label}</p>
              <p className="section-label">CONSEQUENCE</p>
              <div className="result-card"><h2>{selectedChoice.resultTitle}</h2>{renderBlocks(selectedChoice.result)}</div>
              {changedMetrics.length > 0 && <div><p className="section-label">IMMEDIATE IMPACT</p><div className="impact-row">{changedMetrics.map(([key, value]) => <span key={key} className="impact-pill" style={{ borderColor: metricConfig[key].color, color: metricConfig[key].color }}>{metricConfig[key].label} {value > 0 ? `↑${Math.abs(value) >= 2 ? '↑' : ''}` : `↓${Math.abs(value) >= 2 ? '↓' : ''}`}</span>)}</div></div>}
              <details className="reflect-panel"><summary><div><p className="reflect-title">Pause & Reflect</p><p className="reflect-subtitle">Adult learning layer</p></div><span className="reflect-indicator">+</span></summary><div className="reflect-content"><ul>{scene.reflection.questions.map((question) => <li key={question}>{question}</li>)}</ul><p className="writing-prompt"><strong>Writing Prompt</strong></p><p>{scene.reflection.writingPrompt}</p><textarea placeholder="Type your reflection here..." rows={4} /><button type="button" className="insight-toggle" onClick={() => setShowInsights((prev) => ({ ...prev, [scene.id]: !prev[scene.id] }))}>View Deeper Insight</button>{showInsights[scene.id] && <div className="insight-panel"><p><strong>Manuscript Insight:</strong> {scene.reflection.insight}</p><p>{scene.reflection.expandedInsight}</p><p><strong>Facilitator lens:</strong> {scene.reflection.facilitatorLens}</p></div>}</div></details>
              <button type="button" className="continue-button" onClick={handleContinue}>Continue</button>
            </section>
          )}
        </article>
      </section>

      <style jsx>{`
        .urban-student-page { min-height: 100vh; background: #0b1120; color: #fff; padding: 3rem 1rem; }
        .experience-shell { max-width: 900px; margin: 0 auto; }
        .scene-card { background: #f8fafc; color: #0f172a; border-radius: 24px; padding: 32px; max-width: 900px; margin: 0 auto; box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22); display: grid; gap: 1.2rem; }
        .metrics-stack { display: grid; gap: 10px; }
        .metric-row { border: 1px solid #cbd5e1; background: #fff; border-radius: 12px; padding: 10px 12px; }
        .metric-row-meta { display: flex; align-items: center; justify-content: space-between; font-weight: 700; color: #1e293b; font-size: 0.92rem; }
        .metric-track { margin-top: 6px; background: #e2e8f0; height: 10px; border-radius: 999px; overflow: hidden; }
        .metric-fill { height: 100%; border-radius: 999px; transition: width 0.35s ease; }
        .tone-band { height: 10px; border-radius: 999px; margin-bottom: 12px; background: linear-gradient(90deg, #1e293b, #334155); }
        .scene-header p { margin: 0; color: #334155; }
        .scene-header h1 { margin: 0.35rem 0; font-size: clamp(1.5rem, 2.8vw, 2.2rem); }
        .section-label { margin: 0 0 10px; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.08em; color: #475569; font-weight: 800; }
        .paragraph-card { margin: 0 0 16px; color: #1e293b; font-size: 1.05rem; line-height: 1.8; }
        .thought-wrap { margin: 18px 0; }
        .thought-label { margin: 0 0 6px; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #475569; font-style: normal; font-weight: 800; }
        .thought-card { background: #e8eef6; border-left: 5px solid #1e3a5f; color: #102033; font-style: italic; font-weight: 600; border-radius: 14px; padding: 14px 18px; margin: 0; line-height: 1.65; }
        button { display: block; width: 100%; background: #fff; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 14px; padding: 14px 16px; margin-top: 10px; text-align: left; font-weight: 600; cursor: pointer; }
        .continue-moment, .continue-button { text-align: center; background: #0f172a; color: #fff; }
        .selected-pill { margin: 0 0 12px; display: inline-block; background: #334155; color: #fff; border-radius: 999px; padding: 8px 12px; }
        .result-card { background: #fff; border: 1px solid #cbd5e1; border-radius: 18px; padding: 22px; }
        .impact-row { display: flex; flex-wrap: wrap; gap: 10px; }
        .impact-pill { background: #f8fafc; border: 1px solid; border-radius: 999px; padding: 8px 13px; font-size: 0.9rem; font-weight: 800; }
        .reflect-panel { margin-top: 20px; background: #fff; border: 1px solid #cbd5e1; border-radius: 16px; padding: 18px; }
        .reflect-panel summary { cursor: pointer; font-weight: 700; list-style: none; display: flex; align-items: center; justify-content: space-between; }
        .reflect-panel summary::-webkit-details-marker { display: none; }
        .reflect-title { margin: 0; font-size: 1rem; color: #0f172a; }
        .reflect-subtitle { margin: 3px 0 0; color: #64748b; font-size: 0.86rem; font-weight: 600; }
        .reflect-indicator { font-size: 1.2rem; font-weight: 800; color: #475569; }
        .reflect-panel[open] .reflect-indicator { transform: rotate(45deg); }
        .reflect-content { margin-top: 14px; }
        .reflect-panel ul { margin: 0 0 12px 18px; color: #1e293b; display: grid; gap: 10px; }
        .writing-prompt { margin: 10px 0 4px; color: #0f172a; }
        textarea { min-height: 110px; width: 100%; border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px; font-size: 1rem; color: #0f172a; background: #fff; font-family: inherit; }
        .insight-toggle { margin-top: 14px; width: auto; border: 1px solid #cbd5e1; background: #fff; color: #0f172a; border-radius: 12px; padding: 10px 14px; font-weight: 700; }
        .insight-panel { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 14px; padding: 16px; margin-top: 10px; line-height: 1.65; color: #1e293b; }
      `}</style>
    </main>
  );
}
