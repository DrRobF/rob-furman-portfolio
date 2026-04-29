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
    question: 'What do you try to do?',
    reflection: {
      questions: [
        'What assumptions might an adult make about Adam if he seems tired or disengaged later?',
        'How might disrupted sleep affect his patience, focus, or tone at school?',
        'What would a teacher need to know before interpreting his behavior?',
      ],
      writingPrompt: 'In 2–3 sentences, describe how you would respond if Adam appears disengaged in first period.',
      insight:
        'A student’s visible behavior may be the last part of a much longer night. Fatigue can look like defiance, disinterest, or poor motivation when the real issue is exhaustion and emotional overload.',
      manuscriptExcerpt:
        '[PASTE MANUSCRIPT EXCERPT HERE]\n\nThis space is designed for a longer excerpt from the Urban Student manuscript. It can hold a full section, chapter passage, or facilitator reading connected to this moment in Adam’s day.\n\nUse this area for the original manuscript language, not a summary.',
      facilitatorLens:
        'Ask participants what they would normally assume if a student put his head down, snapped back, or failed to engage during first period.',
    },
    choices: [
      {
        id: 'ignore_noise', label: 'Put the pillow over your head and try to block it out', resultTitle: 'You try to shut the world out.', metrics: { sleep: 1, stress: -1, time: 0, care: 0 },
        result: [
          { type: 'paragraph', text: 'You press the pillow over your ears and turn your face toward the wall. For a few seconds, the room feels smaller and darker, like maybe you can disappear into it.' },
          { type: 'paragraph', text: 'The noise still gets through. Not clearly, but enough. A laugh. A chair moving. A voice rising and falling.' },
          { type: 'thought', text: 'Just stop. Just for one night.' },
          { type: 'paragraph', text: 'Your neck starts to ache from the way you are curled up. You stay there anyway.' },
        ],
        nextSceneId: 'scene_625am_bedroom',
      },
      {
        id: 'confront_mom', label: 'Get up and ask them to be quiet', resultTitle: 'You step into the hallway.', metrics: { sleep: -1, stress: -2, time: -1, care: -1 },
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
        id: 'check_sister', label: 'Check on your sister', resultTitle: 'You check on your sister.', metrics: { sleep: -1, stress: 1, time: 0, care: 1 },
        result: [
          { type: 'paragraph', text: 'You turn carefully so you do not wake her. Her face is half-buried in the blanket, one hand tucked under her cheek.' },
          { type: 'paragraph', text: 'You watch her breathe for a moment. Slow. Even. Somehow safe inside sleep.' },
          { type: 'thought', text: 'At least she’s okay. At least one of us is sleeping.' },
          { type: 'paragraph', text: 'You fix the blanket near her shoulder, then lie back down without making a sound.' },
        ],
        nextSceneId: 'scene_625am_bedroom',
      },
      {
        id: 'phone_distraction', label: 'Grab your phone and distract yourself', resultTitle: 'You reach for your phone.', metrics: { sleep: -2, stress: 1, time: -1, care: 0 },
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
    question: 'What do you try to do?',
    reflection: {
      questions: [
        'What might Adam’s morning choices reveal about exhaustion, responsibility, and stress?',
        'How could being late or unprepared be connected to what happened before school?',
        'How should an adult respond differently if they understand the night-before context?',
      ],
      writingPrompt: 'Write one supportive adult response that addresses the behavior without ignoring the context.',
      insight:
        'Morning behavior is often shaped before the school day begins. Rushing, lateness, irritability, or shutdown may be connected to sleep disruption, caregiving stress, and emotional load.',
      manuscriptExcerpt:
        '[PASTE MANUSCRIPT EXCERPT HERE]\n\nThis space is designed for a longer excerpt from the Urban Student manuscript. It can hold a full section, chapter passage, or facilitator reading connected to this moment in Adam’s day.\n\nUse this area for the original manuscript language, not a summary.',
      facilitatorLens:
        'Ask participants how their response would change if they knew the student’s morning began this way.',
    },
    choices: [
      { id: 'snooze', label: 'Hit snooze and lie back down', resultTitle: 'The alarm costs you.', metrics: { sleep: -1, stress: -3, time: -1, care: -1 }, result: [
        { type: 'paragraph', text: 'The alarm goes off again.\n\nYou reach for it, but not fast enough.' },
        { type: 'paragraph', text: 'Movement downstairs.\n\nNot calm this time.\n\nLouder. Faster.\n\nVoices.' },
        { type: 'paragraph', text: 'Your body locks before your brain catches up.\n\nThat’s not just noise.\n\nThat’s arguing.' },
        { type: 'thought', text: 'I shouldn’t have hit snooze.' },
        { type: 'paragraph', text: 'The voices get closer.\n\nYour name cuts through the shouting.\n\nNot now.' },
        { type: 'paragraph', text: 'The door bursts open.\n\nHe’s already moving before you can react.\n\nYour arm is yanked hard—too hard—and you’re pulled off the bed.\n\nYour head cracks against the bed post as you hit the floor.' },
        { type: 'thought', text: 'Don’t say anything.' },
        { type: 'paragraph', text: 'Your sister starts to cry, but it’s swallowed by yelling.\n\nYour mom is shouting. He’s shouting louder.\n\nSomething about the alarm. About waking him up.' },
        { type: 'paragraph', text: 'You stay down.\n\nYou’ve learned this part.\n\nWait it out.\n\nDon’t make it worse.' },
        { type: 'paragraph', text: 'They leave as fast as they came in.\n\nThe noise moves away.\n\nBut your chest is still tight.' },
        { type: 'thought', text: 'I’m not making that mistake again.' },
        { type: 'paragraph', text: 'You move fast now.\n\nFaster than before.\n\nYou just need to get out of the house.' },
      ], nextSceneId: 'scene_bus_stop' },
      { id: 'get_ready', label: 'Get up and start getting ready', resultTitle: 'You force yourself up.', metrics: { sleep: 0, stress: -2, time: 1, care: -1 }, result: [
        { type: 'paragraph', text: 'You stand before your body feels ready.\n\nYour legs are heavy, but you move anyway.' },
        { type: 'paragraph', text: 'You find clothes, grab what you can, and start getting dressed as quickly as possible.\n\nThe house is not calm anymore.' },
        { type: 'paragraph', text: 'You hear his voice from another room.\n\nLoud.\n\nAngry.\n\nSomething about the alarm.' },
        { type: 'thought', text: 'Just keep moving.' },
        { type: 'paragraph', text: 'Then you hear it clearly.\n\n“That little asshole needs to turn off his damn alarm.”' },
        { type: 'paragraph', text: 'Your stomach tightens.\n\nYou do not wait to hear what comes next.' },
        { type: 'paragraph', text: 'You grab what you can and move toward the door.\n\nYou hope your mom and baby sister will be okay.\n\nBut right now, you need to get out.' },
        { type: 'thought', text: 'Just get out of the house.' },
      ], nextSceneId: 'scene_bus_stop' },
      { id: 'check_phone', label: 'Check your phone first', resultTitle: 'You check your phone.', metrics: { sleep: 0, stress: -1, time: -1, care: 0 }, result: [
        { type: 'paragraph', text: 'You unlock the phone before you stand up. Notifications stack over each other. A few messages. A few things you do not need to see right now.' },
        { type: 'paragraph', text: 'You tell yourself you are just checking the time, but your thumb keeps moving.' },
        { type: 'thought', text: 'One second. Then I’ll get up.' },
        { type: 'paragraph', text: 'The room stays still around you, but the clock does not.' },
      ], nextSceneId: 'scene_bus_stop' },
      { id: 'wake_sister', label: 'Wake your sister up', resultTitle: 'You wake your sister.', metrics: { sleep: 0, stress: -1, time: -1, care: 1 }, result: [
        { type: 'paragraph', text: 'You touch her shoulder gently. She shifts but does not open her eyes.' },
        { type: 'paragraph', text: 'You say her name quietly. Then again. She makes a small sound and turns away from the light.' },
        { type: 'thought', text: 'Come on. I can’t be late again.' },
        { type: 'paragraph', text: 'You are trying to be patient, but you can already feel the morning getting away from you.' },
      ], nextSceneId: 'scene_bus_stop' },
    ],
  },
  {
    id: 'scene_bus_stop',
    sceneNumber: 3,
    totalScenes: 10,
    time: 'Bus Stop',
    heading: 'On the Way to School',
    revealGroups: [
      [
        { type: 'paragraph', text: 'You step outside and the air hits different.\n\nCold. Quiet. No yelling.\n\nBut your body is still moving like the yelling followed you.' },
        { type: 'paragraph', text: 'You move fast down the street.\n\nFaster than you need to.\n\nYou don’t look back.' },
        { type: 'thought', text: 'Just get to the bus.' },
      ],
      [
        { type: 'paragraph', text: 'You see the bus coming up the street.\n\nAlready.\n\nToo soon.' },
        { type: 'paragraph', text: 'You reach for your backpack—\n\nNothing.\n\nYou stop.' },
        { type: 'thought', text: 'No. No way.' },
        { type: 'paragraph', text: 'You ran out of the house without it.\n\nNo bag.\n\nNo bus pass.\n\nNothing.' },
        { type: 'paragraph', text: 'The bus is still coming.\n\nYou don’t have time to think.' },
      ],
      [
        { type: 'paragraph', text: 'A younger kid is standing at the stop.\n\nYou’ve seen him before.\n\nSmaller.\n\nAlone.' },
        { type: 'paragraph', text: 'The bus gets closer.\n\nYou feel it in your chest.\n\nNo bag.\n\nNo pass.\n\nNo time.' },
        { type: 'thought', text: 'I need that pass.' },
      ],
    ],
    question: 'What do you try to do?',
    reflection: {
      questions: [
        'What might an adult assume if Adam shows up aggressive or withdrawn?',
        'What happened before this moment that influenced this decision?',
        'How does urgency affect moral decision-making?',
      ],
      writingPrompt: 'Describe how stress and urgency changed Adam’s decision-making in this moment.',
      insight: 'Behavior is often the result of accumulated pressure, not a single choice.',
      expandedInsight:
        'By the time Adam reaches the bus stop, he is not making decisions from a calm or neutral state. His actions are shaped by lack of sleep, emotional stress, fear, and urgency. When students act aggressively or impulsively, it is often the visible result of invisible buildup.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
      facilitatorLens:
        'Ask participants whether Adam’s behavior should be judged in isolation or as part of a larger chain of events.',
    },
    choices: [
      { id: 'try_ask_first', label: 'Ask him for help first', resultTitle: 'You try to ask.', metrics: { sleep: 0, stress: -1, time: 1, care: -1 }, result: [
        { type: 'paragraph', text: 'You walk up to him, trying to keep your voice steady.\n\nYou ask if you can use his pass.' },
        { type: 'paragraph', text: 'He hesitates.\n\nThen shakes his head.\n\n“No.”' },
        { type: 'thought', text: 'Of course.' },
        { type: 'paragraph', text: 'The bus is almost there.\n\nYour chest tightens.\n\nNo bag. No pass. No time.' },
        { type: 'paragraph', text: 'You step closer.\n\nToo close.\n\nYour hand moves before you fully decide.' },
        { type: 'paragraph', text: 'You shove him.\n\nHe stumbles.\n\nYou grab the pass.' },
        { type: 'thought', text: 'Just get on the bus.' },
        { type: 'paragraph', text: 'You don’t look back.' },
      ], nextSceneId: 'scene_school_entrance' },
      { id: 'hesitate_then_take', label: 'Hesitate and try to think', resultTitle: 'You hesitate.', metrics: { sleep: 0, stress: -2, time: 1, care: -2 }, result: [
        { type: 'paragraph', text: 'You stand there for a second too long.\n\nThinking.\n\nTrying to find another way.' },
        { type: 'paragraph', text: 'The bus gets closer.\n\nCloser.\n\nYou feel it slipping.' },
        { type: 'thought', text: 'Do something.' },
        { type: 'paragraph', text: 'You step forward suddenly.\n\nToo fast.\n\nYour shoulder hits him.' },
        { type: 'paragraph', text: 'He stumbles.\n\nYou grab the pass.\n\nYou don’t even remember deciding to do it.' },
        { type: 'thought', text: 'I didn’t mean to—' },
        { type: 'paragraph', text: 'But you’re already moving.' },
      ], nextSceneId: 'scene_school_entrance' },
      { id: 'look_around', label: 'Look around for another option', resultTitle: 'You look for another way.', metrics: { sleep: 0, stress: -1, time: 1, care: -2 }, result: [
        { type: 'paragraph', text: 'You glance around.\n\nMaybe someone else.\n\nMaybe another option.' },
        { type: 'paragraph', text: 'There isn’t one.\n\nJust him.\n\nJust the bus.' },
        { type: 'paragraph', text: 'The doors are about to open.\n\nPanic hits your chest.' },
        { type: 'thought', text: 'There’s no other way.' },
        { type: 'paragraph', text: 'You step in.\n\nHarder than you meant to.\n\nYou take the pass.' },
        { type: 'paragraph', text: 'He doesn’t fight back.\n\nThat almost makes it worse.' },
        { type: 'thought', text: 'Don’t think about it.' },
      ], nextSceneId: 'scene_school_entrance' },
      { id: 'freeze_then_take', label: 'Freeze for a second', resultTitle: 'You freeze.', metrics: { sleep: 0, stress: -2, time: 1, care: -2 }, result: [
        { type: 'paragraph', text: 'You don’t move.\n\nYour body just… stops.' },
        { type: 'paragraph', text: 'The bus is right there now.\n\nYou feel stuck.' },
        { type: 'thought', text: 'Move.' },
        { type: 'paragraph', text: 'You force yourself forward.\n\nToo late to think.\n\nToo late to decide.' },
        { type: 'paragraph', text: 'You push him aside and take the pass.\n\nYou get on the bus.' },
        { type: 'paragraph', text: 'Your chest is tight.\n\nYour hands feel off.' },
        { type: 'thought', text: 'What did I just do?' },
      ], nextSceneId: 'scene_school_entrance' },
    ],
  },
  {
    id: 'scene_school_entrance',
    sceneNumber: 4,
    totalScenes: 10,
    time: 'School Entrance',
    heading: 'Entering the Building',
    revealGroups: [
      [
        { type: 'paragraph', text: 'You rush into school and through the metal detectors.\n\nThe building feels loud.\n\nToo loud.\n\nToo fast.' },
        { type: 'paragraph', text: 'You’re still thinking about the house.\n\nAbout your mom.\n\nAbout your sister.\n\nAbout the bus.' },
        { type: 'thought', text: 'Just get to class.' },
      ],
      [
        { type: 'paragraph', text: 'Security stops you.\n\nThey point at your bag.' },
        { type: 'paragraph', text: 'You look down.\n\nNothing.' },
        { type: 'thought', text: 'Damn.' },
        { type: 'paragraph', text: 'You forgot it.\n\nYour book bag is still at home.' },
      ],
      [
        { type: 'paragraph', text: 'That new boyfriend.\n\nYou ran out so fast you forgot everything.\n\nBus pass.\n\nBag.\n\nEverything.' },
        { type: 'paragraph', text: 'You feel it now.\n\nThis is going to follow you all day.' },
        { type: 'thought', text: 'I’m not telling them why.' },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'What might staff assume about Adam in this moment?',
        'What context is completely invisible to them?',
        'How quickly do adults form judgments here?',
      ],
      writingPrompt: 'Write how a staff member might interpret Adam—and how that interpretation could be wrong.',
      insight: 'Adults respond to what they see, not what caused it.',
      expandedInsight:
        'By the time Adam enters school, he is already carrying stress, lack of sleep, fear, and urgency. Without that context, adults interpret only what they observe—missing materials, tone, and behavior—often leading to incorrect conclusions.',
      facilitatorLens:
        'Ask participants what they would assume—and what they would need to know before deciding.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      { id: 'tell_truth', label: 'Tell them what happened at home', resultTitle: 'You try to explain.', metrics: { sleep: 0, stress: -1, time: 0, care: -1 }, result: [
        { type: 'paragraph', text: 'You start to explain.\n\nAbout your house.\n\nAbout the morning.\n\nAbout why you rushed out.' },
        { type: 'paragraph', text: 'They listen.\n\nBut not really.' },
        { type: 'thought', text: 'They don’t get it.' },
        { type: 'paragraph', text: '“Just get to class.”\n\nThat’s it.' },
      ] },
      { id: 'say_forgot', label: 'Say you forgot your bag', resultTitle: 'You keep it simple.', metrics: { sleep: 0, stress: 1, time: 1, care: 0 }, result: [
        { type: 'paragraph', text: '“I forgot it.”\n\nYou keep it short.' },
        { type: 'paragraph', text: 'They look at you.\n\nThen wave you through.' },
        { type: 'thought', text: 'Good.' },
        { type: 'paragraph', text: 'No questions.' },
      ] },
      { id: 'get_defensive', label: 'Push back a little', resultTitle: 'You push back.', metrics: { sleep: 0, stress: -2, time: -1, care: -1 }, result: [
        { type: 'paragraph', text: '“It’s not a big deal.”\n\nYou say it sharp.' },
        { type: 'paragraph', text: 'Security pauses.\n\nThat’s enough.' },
        { type: 'thought', text: 'Now they’re watching me.' },
      ] },
      { id: 'say_nothing', label: 'Say nothing', resultTitle: 'You stay quiet.', metrics: { sleep: 0, stress: -1, time: 0, care: -1 }, result: [
        { type: 'paragraph', text: 'You don’t answer.\n\nYou just stand there.' },
        { type: 'paragraph', text: 'They look at you longer.\n\nTrying to figure you out.' },
        { type: 'thought', text: 'Say something.' },
        { type: 'paragraph', text: 'They wave you through.\n\nBut not before making up their mind about you.' },
      ] },
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

const metricConfig = {
  sleep: { label: 'Sleep Reserve', help: 'negative = deficit · positive = recovery' },
  stress: { label: 'Stress Load', help: 'negative = load building · positive = relief' },
  time: { label: 'Time Pressure', help: 'negative = slipping · positive = room gained' },
  care: { label: 'Care Connection', help: 'negative = disconnection · positive = support/protection' },
};
const metricOrder = ['sleep', 'stress', 'time', 'care'];
const initialMetrics = { sleep: 0, stress: 0, time: 0, care: 0 };
const clampMetric = (value) => Math.max(-10, Math.min(10, value));

export default function DayInTheLifeUrbanStudentPage() {
  const [sceneId, setSceneId] = useState('scene_2am_bedroom');
  const [selectedChoices, setSelectedChoices] = useState({});
  const [revealedGroupCounts, setRevealedGroupCounts] = useState({ scene_2am_bedroom: 1, scene_625am_bedroom: 1, scene_bus_stop: 1, scene_school_entrance: 1 });
  const [cumulativeMetrics, setCumulativeMetrics] = useState(initialMetrics);
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
    if (selectedChoices[scene.id]) return;
    const nextChoice = scene.choices.find((choice) => choice.id === choiceId);
    if (!nextChoice) return;

    setCumulativeMetrics((prev) => {
      const nextMetrics = { ...prev };
      metricOrder.forEach((metric) => {
        nextMetrics[metric] = clampMetric((nextMetrics[metric] ?? 0) + (nextChoice.metrics?.[metric] ?? 0));
      });
      return nextMetrics;
    });
    setSelectedChoices((prev) => ({ ...prev, [scene.id]: choiceId }));
  };

  const handleReset = () => {
    setSceneId('scene_2am_bedroom');
    setSelectedChoices({});
    setCumulativeMetrics(initialMetrics);
    setRevealedGroupCounts({ scene_2am_bedroom: 1, scene_625am_bedroom: 1, scene_bus_stop: 1, scene_school_entrance: 1 });
    setShowInsights({});
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
    return <main className="urban-student-page"><section className="experience-shell"><article className="scene-card"><h1>Next scene not built yet.</h1><p className="paragraph-card">This prototype currently focuses on the first three scenes so we can perfect the experience before adding the rest of Adam’s day.</p></article></section></main>;
  }

  const changedMetrics = metricOrder
    .map((metric) => [metric, selectedChoice?.metrics?.[metric] ?? 0])
    .filter(([, value]) => value !== 0);
  const hasAnyChoiceSelected = Object.keys(selectedChoices).length > 0;

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
              {changedMetrics.length > 0 && <div><p className="section-label">IMMEDIATE IMPACT</p><div className="impact-row">{changedMetrics.map(([key, value]) => <span key={key} className={`impact-pill ${value > 0 ? (key === 'care' ? 'impact-positive-care' : 'impact-positive') : 'impact-negative'}`}>{metricConfig[key].label} {value > 0 ? `+${value}` : value}</span>)}</div></div>}
              {hasAnyChoiceSelected && <div className="metrics-stack">
                <p className="section-label">CUMULATIVE LOAD</p>
                <p className="metric-subtitle">How far Adam has moved from baseline</p>
                {metricOrder.map((metric) => (
                  <div className="metric-row" key={metric}>
                    <div className="metric-row-meta">
                      <div>
                        <span>{metricConfig[metric].label}</span>
                        <p className="metric-help">{metricConfig[metric].help}</p>
                      </div>
                      <span>{cumulativeMetrics[metric] > 0 ? `+${cumulativeMetrics[metric]}` : cumulativeMetrics[metric]}</span>
                    </div>
                    <div className="metric-track">
                      <span className="metric-center-marker">0</span>
                      <div
                        className={`metric-fill ${cumulativeMetrics[metric] >= 0 ? (metric === 'care' ? 'metric-fill-care-positive' : 'metric-fill-positive') : 'metric-fill-negative'}`}
                        style={{
                          width: `${Math.abs((cumulativeMetrics[metric] / 10) * 50)}%`,
                          left: cumulativeMetrics[metric] >= 0 ? '50%' : `${50 - Math.abs((cumulativeMetrics[metric] / 10) * 50)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>}
              <details className="reflect-panel"><summary><div><p className="reflect-title">Pause & Reflect</p><p className="reflect-subtitle">Adult learning layer</p></div><span className="reflect-indicator">+</span></summary><div className="reflect-content"><ul>{scene.reflection.questions.map((question) => <li key={question}>{question}</li>)}</ul><p className="writing-prompt"><strong>Writing Prompt</strong></p><p>{scene.reflection.writingPrompt}</p><textarea placeholder="Type your reflection here..." rows={4} /><div className="facilitator-lens"><p><strong>Facilitator Lens</strong></p><p>{scene.reflection.insight}</p>{scene.reflection.expandedInsight && <p>{scene.reflection.expandedInsight}</p>}<p className="lens-prompt">{scene.reflection.facilitatorLens}</p></div><button type="button" className="insight-toggle" onClick={() => setShowInsights((prev) => ({ ...prev, [scene.id]: !prev[scene.id] }))}>Read Manuscript Excerpt</button>{showInsights[scene.id] && <div className="insight-panel"><p className="insight-heading">From the Manuscript</p><p className="insight-subheading">Extended reading for facilitators, teachers, and discussion leaders</p><p className="insight-note">This reading is optional and can be used for discussion, journaling, or facilitator-led reflection.</p><p className="manuscript-text">{scene.reflection.manuscriptExcerpt}</p></div>}</div></details>
              <button type="button" className="continue-button" onClick={handleContinue}>Continue</button>
              <button type="button" className="reset-button" onClick={handleReset}>Reset / Start Over</button>
            </section>
          )}
        </article>
      </section>

      <style jsx>{`
        .urban-student-page { min-height: 100vh; background: #0b1120; color: #fff; padding: 3rem 1rem; }
        .experience-shell { max-width: 900px; margin: 0 auto; }
        .scene-card { background: #fbfdff; color: #0f172a; border-radius: 24px; padding: 36px; max-width: 860px; margin: 0 auto; box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22); display: grid; gap: 1.2rem; }
        .metrics-stack { display: grid; gap: 10px; background: #ffffff; border: 1px solid #d8e0ea; border-radius: 18px; padding: 18px; margin-top: 18px; }
        .metric-subtitle { margin: -4px 0 6px; color: #334155; font-size: 0.92rem; }
        .metric-row { border: 1px solid #d8e0ea; background: #fff; border-radius: 12px; padding: 10px 12px; }
        .metric-row-meta { display: flex; align-items: center; justify-content: space-between; font-weight: 700; color: #1e293b; font-size: 0.92rem; }
        .metric-help { margin: 4px 0 0; font-size: 0.8rem; color: #475569; font-weight: 500; }
        .metric-track { margin-top: 8px; background: #e2e8f0; height: 14px; border-radius: 999px; overflow: hidden; position: relative; }
        .metric-track::before { content: ''; position: absolute; left: 50%; top: 0; transform: translateX(-50%); width: 2px; height: 100%; background: #334155; z-index: 2; }
        .metric-center-marker { position: absolute; left: 50%; top: -16px; transform: translateX(-50%); font-size: 0.72rem; color: #334155; font-weight: 700; }
        .metric-fill { position: absolute; top: 0; height: 100%; transition: all 0.35s ease; z-index: 1; }
        .metric-fill-negative { background: #dc2626; }
        .metric-fill-positive { background: #2563eb; }
        .metric-fill-care-positive { background: #16a34a; }
        .tone-band { height: 10px; border-radius: 999px; margin-bottom: 12px; background: linear-gradient(90deg, #1e293b, #334155); }
        .scene-header p { margin: 0; color: #334155; }
        .scene-header h1 { margin: 0.35rem 0 0.75rem; font-size: clamp(1.5rem, 2.8vw, 2.2rem); color: #071228; }
        .section-label { margin: 0 0 10px; font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.08em; color: #475569; font-weight: 800; }
        .scene-content { max-width: 720px; }
        .paragraph-card { margin: 0 0 18px; color: #24324a; font-size: 1.08rem; line-height: 1.9; letter-spacing: 0.005em; }
        .thought-wrap { margin: 22px 0; max-width: 720px; }
        .thought-label { margin: 0 0 8px; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.12em; color: #334155; font-style: normal !important; font-weight: 900; }
        .thought-card { background: #eef4ff; border-left: 7px solid #1e3a8a; color: #0f172a; font-style: italic !important; font-size: 1.08rem; font-weight: 700; border-radius: 16px; padding: 18px 22px; margin: 24px 0; line-height: 1.65; box-shadow: 0 8px 24px rgba(30, 58, 138, 0.08); }
        button { display: block; width: 100%; background: #fff; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 14px; padding: 14px 16px; margin-top: 10px; text-align: left; font-weight: 600; cursor: pointer; }
        .continue-moment, .continue-button { text-align: center; background: #0f172a; color: #fff; }
        .reset-button { text-align: center; background: #334155; color: #fff; }
        .selected-pill { margin: 0 0 12px; display: inline-block; background: #334155; color: #fff; border-radius: 999px; padding: 8px 12px; }
        .result-card { background: #fff; border: 1px solid #cbd5e1; border-radius: 18px; padding: 22px; }
        .impact-row { display: flex; flex-wrap: wrap; gap: 10px; }
        .impact-pill { border: 1px solid; border-radius: 999px; padding: 8px 13px; font-size: 0.9rem; font-weight: 800; }
        .impact-negative { background: #fff1f2; border-color: #dc2626; color: #b91c1c; }
        .impact-positive { background: #eff6ff; border-color: #2563eb; color: #1d4ed8; }
        .impact-positive-care { background: #f0fdf4; border-color: #16a34a; color: #166534; }
        .reflect-panel { margin-top: 22px; background: #f8fafc; border: 1px solid #d8e0ea; border-radius: 20px; padding: 22px; }
        .reflect-panel summary { cursor: pointer; font-weight: 700; list-style: none; display: flex; align-items: center; justify-content: space-between; }
        .reflect-panel summary::-webkit-details-marker { display: none; }
        .reflect-title { margin: 0; font-size: 1rem; color: #0f172a; }
        .reflect-subtitle { margin: 3px 0 0; color: #64748b; font-size: 0.86rem; font-weight: 600; }
        .reflect-indicator { font-size: 1.2rem; font-weight: 800; color: #475569; }
        .reflect-panel[open] .reflect-indicator { transform: rotate(45deg); }
        .reflect-content { margin-top: 14px; }
        .reflect-panel ul { margin: 0 0 16px; padding-left: 20px; color: #1e293b; display: grid; gap: 16px; line-height: 1.8; }
        .writing-prompt { margin: 10px 0 4px; color: #0f172a; }
        textarea { min-height: 110px; width: 100%; border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px; font-size: 1rem; color: #0f172a; background: #fff; font-family: inherit; }
        .insight-toggle { margin-top: 14px; width: auto; border: 1px solid #cbd5e1; background: #fff; color: #0f172a; border-radius: 12px; padding: 10px 14px; font-weight: 700; }
        .facilitator-lens { margin-top: 14px; background: #fff; border: 1px solid #d8e0ea; border-radius: 14px; padding: 14px; color: #0f172a; }
        .lens-prompt { margin-top: 8px; }
        .insight-panel { max-height: 420px; overflow-y: auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; padding: 22px; margin-top: 14px; line-height: 1.85; font-size: 1.02rem; color: #1e293b; }
        .insight-heading { margin: 0; font-size: 1.08rem; font-weight: 800; color: #0f172a; }
        .insight-subheading { margin: 4px 0 8px; color: #475569; font-size: 0.9rem; }
        .insight-note { margin: 0 0 12px; color: #64748b; font-size: 0.9rem; }
        .manuscript-text { white-space: pre-line; margin: 0; }
      `}</style>
    </main>
  );
}
