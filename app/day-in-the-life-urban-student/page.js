'use client';

import { useMemo, useState } from 'react';

const urbanStudentScenes = [
  {
    id: 'scene_2am_bedroom',
    sceneNumber: 1,
    totalScenes: 10,
    time: '2:00 AM',
    title: "Adam's Bedroom",
    heading: 'Bedroom at 2:00 AM',
    intro: [
      {
        type: 'paragraph',
        text: 'It’s 2:00 AM, and you’re still awake. Laughter keeps cutting through the floor from downstairs — your mom and her boyfriend. It has been going on for hours, ever since he showed up around 10:00.',
      },
      {
        type: 'paragraph',
        text: 'You keep your eyes closed, but it does not help. You are not even close to asleep. Beside you, your baby sister is curled into the blanket, somehow still sleeping through all of it.',
      },
      { type: 'thought', text: 'How is she still asleep? How do you not wake up to this?' },
      {
        type: 'paragraph',
        text: 'You shift under the blanket. The mattress creaks. The laughter gets louder for a second, then drops back into muffled voices below you.',
      },
      { type: 'paragraph', text: 'You check the clock. 2:07. You have to be up at 6:00.' },
      { type: 'thought', text: 'Four hours. No — less than that. I’m gonna be dead tomorrow.' },
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
    question: 'What do you do?',
    choices: [
      {
        id: 'ignore_noise',
        label: 'Put the pillow over your head and try to block it out',
        resultTitle: 'You try to shut the world out.',
        result: [
          {
            type: 'paragraph',
            text: 'You press the pillow over your ears and turn your face toward the wall. For a few seconds, the room feels smaller and darker, like maybe you can disappear into it.',
          },
          { type: 'paragraph', text: 'The noise still gets through. Not clearly, but enough. A laugh. A chair moving. A voice rising and falling.' },
          { type: 'thought', text: 'Just stop. Just for one night.' },
          { type: 'paragraph', text: 'Your neck starts to ache from the way you are curled up. You stay there anyway.' },
        ],
        nextSceneId: 'scene_625am_bedroom',
      },
      {
        id: 'confront_mom',
        label: 'Get up and ask them to be quiet',
        resultTitle: 'You step into the hallway.',
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
        id: 'check_sister',
        label: 'Check on your sister',
        resultTitle: 'You check on your sister.',
        result: [
          { type: 'paragraph', text: 'You turn carefully so you do not wake her. Her face is half-buried in the blanket, one hand tucked under her cheek.' },
          { type: 'paragraph', text: 'You watch her breathe for a moment. Slow. Even. Somehow safe inside sleep.' },
          { type: 'thought', text: 'At least she’s okay. At least one of us is sleeping.' },
          { type: 'paragraph', text: 'You fix the blanket near her shoulder, then lie back down without making a sound.' },
        ],
        nextSceneId: 'scene_625am_bedroom',
      },
      {
        id: 'phone_distraction',
        label: 'Grab your phone and distract yourself',
        resultTitle: 'You reach for your phone.',
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
    id: 'scene_625am_bedroom',
    sceneNumber: 2,
    totalScenes: 10,
    time: '6:25 AM',
    title: "Adam's Bedroom",
    heading: 'Bedroom at 6:25 AM',
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
    core: [
      { type: 'paragraph', text: 'You reach for your phone and stare at the time. 6:25.' },
      { type: 'thought', text: 'I just closed my eyes.' },
      { type: 'paragraph', text: 'The room feels colder now. The house is quiet, of course. Quiet now, when it no longer helps you.' },
      { type: 'paragraph', text: 'You sit up slowly. Your head throbs. You try to think through what you have today, but nothing lands clearly.' },
      { type: 'paragraph', text: 'You swing your feet to the floor and stand there for a second, trying to wake up.' },
      { type: 'thought', text: 'It’s not working.' },
    ],
    question: 'What do you do?',
    choices: [
      { id: 'snooze', label: 'Hit snooze and lie back down', resultTitle: 'You lie back down.', result: [
        { type: 'paragraph', text: 'You tap the screen and let the alarm go quiet. The silence feels too good for one second.' },
        { type: 'paragraph', text: 'You lie back down, telling yourself you only need five minutes. Your eyes close before you finish the thought.' },
        { type: 'thought', text: 'Just five. I can still make it.' },
        { type: 'paragraph', text: 'But the morning is already moving without you.' },
      ], nextSceneId: 'scene_640am_getting_ready' },
      { id: 'get_ready', label: 'Get up and start getting ready', resultTitle: 'You force yourself up.', result: [
        { type: 'paragraph', text: 'You stand before your body feels ready. Your legs are heavy, but you move anyway.' },
        { type: 'paragraph', text: 'You look around the room for what you need: clothes, shoes, backpack, something clean enough to wear.' },
        { type: 'thought', text: 'Move. Just move.' },
        { type: 'paragraph', text: 'You are awake now, but not clear. Every small thing feels like it takes longer than it should.' },
      ], nextSceneId: 'scene_640am_getting_ready' },
      { id: 'check_phone', label: 'Check your phone first', resultTitle: 'You check your phone.', result: [
        { type: 'paragraph', text: 'You unlock the phone before you stand up. Notifications stack over each other. A few messages. A few things you do not need to see right now.' },
        { type: 'paragraph', text: 'You tell yourself you are just checking the time, but your thumb keeps moving.' },
        { type: 'thought', text: 'One second. Then I’ll get up.' },
        { type: 'paragraph', text: 'The room stays still around you, but the clock does not.' },
      ], nextSceneId: 'scene_640am_getting_ready' },
      { id: 'wake_sister', label: 'Wake your sister up', resultTitle: 'You wake your sister.', result: [
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
      <aside key={`${block.type}-${index}`} className="thought-card">{block.text}</aside>
    ) : (
      <p key={`${block.type}-${index}`} className="paragraph-card">{block.text}</p>
    )
  );

export default function DayInTheLifeUrbanStudentPage() {
  const [sceneId, setSceneId] = useState('scene_2am_bedroom');
  const [selectedChoices, setSelectedChoices] = useState({});

  const scene = sceneById[sceneId] ?? urbanStudentScenes[0];
  const selectedChoiceId = selectedChoices[scene.id];
  const selectedChoice = scene.choices.find((choice) => choice.id === selectedChoiceId);

  const introBlocks = useMemo(() => {
    if (scene.id !== 'scene_625am_bedroom') {
      return scene.intro ?? [];
    }
    const previousChoiceId = selectedChoices.scene_2am_bedroom;
    const introSet = scene.introByPreviousChoice?.[previousChoiceId] ?? scene.introByPreviousChoice?.default ?? [];
    return [...introSet, ...(scene.core ?? [])];
  }, [scene, selectedChoices.scene_2am_bedroom]);

  const handleChoose = (choiceId) => {
    setSelectedChoices((prev) => ({ ...prev, [scene.id]: choiceId }));
  };

  const handleContinue = () => {
    if (selectedChoice?.nextSceneId && sceneById[selectedChoice.nextSceneId]) {
      setSceneId(selectedChoice.nextSceneId);
    }
  };

  return (
    <main className="urban-student-page">
      <section className="experience-shell">
        <article className="scene-card">
          <header className="scene-header">
            <p>{scene.time}</p>
            <h1>{scene.heading}</h1>
            <p>Scene {scene.sceneNumber} of {scene.totalScenes}</p>
          </header>

          <div className="scene-content">{renderBlocks(introBlocks)}</div>

          {!selectedChoice ? (
            <div className="choices-section">
              <h2>{scene.question}</h2>
              <div className="button-group">
                {scene.choices.map((choice) => (
                  <button key={choice.id} type="button" onClick={() => handleChoose(choice.id)}>{choice.label}</button>
                ))}
              </div>
            </div>
          ) : (
            <section className="result-section">
              <p className="selected-pill">You chose: {selectedChoice.label}</p>
              <div className="result-card">
                <h2>{selectedChoice.resultTitle}</h2>
                {renderBlocks(selectedChoice.result)}
              </div>
              <button type="button" className="continue-button" onClick={handleContinue}>Continue</button>
            </section>
          )}
        </article>
      </section>

      <style jsx>{`
        .urban-student-page { min-height: 100vh; background: #0b1120; color: #fff; padding: 3rem 1rem; }
        .experience-shell { max-width: 900px; margin: 0 auto; }
        .scene-card { background: #111827; border: 1px solid #1f2937; border-radius: 16px; padding: 2rem; display: grid; gap: 1.5rem; }
        .scene-header p { margin: 0; color: #cbd5e1; }
        .scene-header h1 { margin: 0.35rem 0; font-size: clamp(1.5rem, 2.8vw, 2.2rem); }
        .scene-content { display: grid; gap: 0.75rem; }
        .paragraph-card { margin: 0; line-height: 1.75; color: #e5e7eb; background: rgba(15, 23, 42, 0.25); border-radius: 12px; padding: 14px 16px; }
        .thought-card { margin: 16px 0; background: rgba(15, 23, 42, 0.06); border-left: 4px solid #334155; font-style: italic; border-radius: 12px; padding: 14px 16px; color: #dbeafe; }
        .choices-section h2, .result-card h2 { margin: 0 0 0.75rem; font-size: 1.2rem; }
        .button-group { display: grid; gap: 0.75rem; }
        button { width: 100%; text-align: left; border: 1px solid #374151; background: #1f2937; color: #fff; border-radius: 12px; padding: 0.85rem 1rem; cursor: pointer; }
        button:hover { background: #374151; }
        .selected-pill { margin: 0; display: inline-block; background: #1e293b; border: 1px solid #475569; color: #e2e8f0; border-radius: 999px; padding: 0.45rem 0.9rem; }
        .result-card { margin-top: 0.75rem; background: #0f172a; border: 1px solid #334155; border-radius: 14px; padding: 1rem; }
        .continue-button { margin-top: 1rem; text-align: center; background: #2563eb; border-color: #1d4ed8; }
      `}</style>
    </main>
  );
}
