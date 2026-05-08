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
      ], nextSceneId: 'scene_morning_bus_stop' },
      { id: 'get_ready', label: 'Get up and start getting ready', resultTitle: 'You force yourself up.', metrics: { sleep: 0, stress: -2, time: 1, care: -1 }, result: [
        { type: 'paragraph', text: 'You stand before your body feels ready.\n\nYour legs are heavy, but you move anyway.' },
        { type: 'paragraph', text: 'You find clothes, grab what you can, and start getting dressed as quickly as possible.\n\nThe house is not calm anymore.' },
        { type: 'paragraph', text: 'You hear his voice from another room.\n\nLoud.\n\nAngry.\n\nSomething about the alarm.' },
        { type: 'thought', text: 'Just keep moving.' },
        { type: 'paragraph', text: 'Then you hear it clearly.\n\n“That little asshole needs to turn off his damn alarm.”' },
        { type: 'paragraph', text: 'Your stomach tightens.\n\nYou do not wait to hear what comes next.' },
        { type: 'paragraph', text: 'You grab what you can and move toward the door.\n\nYou hope your mom and baby sister will be okay.\n\nBut right now, you need to get out.' },
        { type: 'thought', text: 'Just get out of the house.' },
      ], nextSceneId: 'scene_morning_bus_stop' },
      { id: 'check_phone', label: 'Check your phone first', resultTitle: 'You check your phone.', metrics: { sleep: 0, stress: -1, time: -1, care: 0 }, result: [
        { type: 'paragraph', text: 'You unlock the phone before you stand up. Notifications stack over each other. A few messages. A few things you do not need to see right now.' },
        { type: 'paragraph', text: 'You tell yourself you are just checking the time, but your thumb keeps moving.' },
        { type: 'thought', text: 'One second. Then I’ll get up.' },
        { type: 'paragraph', text: 'The room stays still around you, but the clock does not.' },
      ], nextSceneId: 'scene_morning_bus_stop' },
      { id: 'wake_sister', label: 'Wake your sister up', resultTitle: 'You wake your sister.', metrics: { sleep: 0, stress: -1, time: -1, care: 1 }, result: [
        { type: 'paragraph', text: 'You touch her shoulder gently. She shifts but does not open her eyes.' },
        { type: 'paragraph', text: 'You say her name quietly. Then again. She makes a small sound and turns away from the light.' },
        { type: 'thought', text: 'Come on. I can’t be late again.' },
        { type: 'paragraph', text: 'You are trying to be patient, but you can already feel the morning getting away from you.' },
      ], nextSceneId: 'scene_morning_bus_stop' },
    ],
  },
  {
    id: 'scene_morning_bus_stop',
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
        { type: 'paragraph', text: 'You rush into school and through the metal detectors.' },
        { type: 'paragraph', text: 'You get stopped for a check of your book bag.' },
        { type: 'thought', text: 'Oh crap.' },
        { type: 'paragraph', text: 'You already know it before anyone says anything.\n\nYour book bag is still at home.' },
      ],
      [
        { type: 'paragraph', text: 'You forgot your bus pass.\n\nNow your book bag.' },
        { type: 'paragraph', text: 'Damn that new boyfriend.\n\nYou ran out of the house so fast you forgot everything.' },
        { type: 'thought', text: 'This morning sucks.' },
      ],
      [
        { type: 'paragraph', text: 'No book bag means no homework.\n\nAgain.' },
        { type: 'paragraph', text: 'The biggest problem is that there is no way you are telling your teachers why you forgot it.\n\nThat is too embarrassing.' },
        { type: 'paragraph', text: 'Especially since you didn’t go back to see if your mom and sister were okay.' },
        { type: 'thought', text: 'It’s none of their business. I forgot it. That’s it.' },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'What might a teacher assume when Adam shows up without homework or materials again?',
        'What important context is Adam intentionally hiding?',
        'Why might embarrassment or shame look like attitude?',
      ],
      writingPrompt: 'Write how an educator could respond to missing materials without forcing Adam to disclose personal trauma.',
      insight: 'Students often protect private pain by offering short answers, attitude, or silence.',
      expandedInsight:
        'Adam’s missing book bag is not just forgetfulness. It is connected to the chaos of the morning, his fear of the boyfriend, the rushed exit, and his shame about not checking on his mom and sister. By the time he reaches school, he is already preparing to defend himself from questions.',
      facilitatorLens:
        'Ask participants how they would respond to repeated missing homework if they did not know the morning behind it.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      { id: 'say_forgot', label: 'Say you forgot it', resultTitle: 'You keep it simple.', metrics: { sleep: 0, stress: 1, time: 1, care: 0 }, result: [
        { type: 'paragraph', text: '“I forgot it.”\n\nThat is all you give them.' },
        { type: 'paragraph', text: 'No explanation.\n\nNo details.\n\nNo way.' },
        { type: 'thought', text: 'That’s enough.' },
        { type: 'paragraph', text: 'You move on toward first period.' },
      ], nextSceneId: 'scene_technology_class' },
      { id: 'make_excuse', label: 'Think of a quick excuse', resultTitle: 'You search for a reason.', metrics: { sleep: 0, stress: -1, time: 0, care: 0 }, result: [
        { type: 'paragraph', text: 'You try to come up with something fast.\n\nSomething normal.\n\nSomething that does not involve your house.' },
        { type: 'paragraph', text: 'Nothing sounds right.' },
        { type: 'thought', text: 'Just say anything.' },
        { type: 'paragraph', text: 'You mumble that you left it at home and keep moving before anyone asks more.' },
      ], nextSceneId: 'scene_technology_class' },
      { id: 'get_guarded', label: 'Shut the conversation down', resultTitle: 'You put the wall up.', metrics: { sleep: 0, stress: -1, time: 0, care: -1 }, result: [
        { type: 'paragraph', text: 'You feel the question coming before it lands.\n\nYou already hate it.' },
        { type: 'paragraph', text: 'Your face changes.\n\nYour voice gets flat.' },
        { type: 'thought', text: 'Don’t ask me.' },
        { type: 'paragraph', text: 'You make it clear there is nothing else to say.\n\nThen you head toward first period.' },
      ], nextSceneId: 'scene_technology_class' },
      { id: 'none_business', label: 'Decide it is none of their business', resultTitle: 'You decide it is not their business.', metrics: { sleep: 0, stress: 1, time: 1, care: -1 }, result: [
        { type: 'paragraph', text: 'You make the decision before anyone can press you.\n\nYou forgot it.\n\nThat is the story.' },
        { type: 'paragraph', text: 'Not the boyfriend.\n\nNot the yelling.\n\nNot your mom.\n\nNot your sister.' },
        { type: 'thought', text: 'It’s none of their business.' },
        { type: 'paragraph', text: 'You head off to first period.' },
      ], nextSceneId: 'scene_technology_class' },
    ],
  },
  {
    id: 'scene_technology_class',
    sceneNumber: 5,
    totalScenes: 10,
    time: 'First Period',
    heading: 'Technology Class',
    revealGroups: [
      [
        { type: 'paragraph', text: 'My first period is technology.' },
        { type: 'paragraph', text: 'I always found this subject so damn dumb.' },
        { type: 'thought', text: 'Seriously, do these teachers actually think that my mom will buy me a computer that actually can run the internet?' },
        { type: 'paragraph', text: 'This subject is such a waste of my time!' },
      ],
      [
        { type: 'paragraph', text: 'When I roll into class I see a few kids talking.' },
        { type: 'paragraph', text: 'When I go to sit down one of them says to me, “Are you OK bro?”' },
        { type: 'paragraph', text: 'I look at him like he was a freak.' },
        { type: 'thought', text: "What the hell are you talkin’ ’bout?" },
      ],
      [
        { type: 'paragraph', text: 'He begins to explain to me that he heard that there was police called to my street for a fight in one of the homes.' },
        { type: 'paragraph', text: 'He heard that a female got beat up by some dude.' },
        { type: 'paragraph', text: 'My heart stopped.' },
        { type: 'paragraph', text: 'He continued, “Bro, I was worried that maybe it was you and your mom. I am glad you’re here. Must not have been you then.”' },
        { type: 'paragraph', text: 'I didn’t say anything to him.' },
        { type: 'paragraph', text: 'I was starting to hit panic mode.' },
      ],
      [
        { type: 'paragraph', text: 'The teacher walks in and tells us to get to our computer terminals and start on yesterday’s project.' },
        { type: 'paragraph', text: 'The teacher then proceeds to do what he always does.' },
        { type: 'paragraph', text: 'He goes to his desk and fires up Facebook.' },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'What is Adam carrying into first period before instruction even begins?',
        'What does the teacher see, and what does the teacher not see?',
        'How does the news about police on Adam’s street change the meaning of his behavior?',
      ],
      writingPrompt:
        'Write how a teacher could respond if a student appears distracted, panicked, or unwilling to begin classwork.',
      insight: 'A student who seems disengaged may actually be in crisis.',
      expandedInsight:
        'Adam enters first period already carrying fear from home, guilt from the bus stop, missing materials, and now panic about police on his street. The adult sees a student not starting work. Adam is experiencing a possible family emergency.',
      facilitatorLens:
        'Ask participants what they would notice first: the missing work, the attitude, the distraction, or the fear.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'tell_teacher_home',
        label: 'Tell the teacher about your experience at home',
        resultTitle: 'You decide to try the teacher.',
        result: [
          { type: 'paragraph', text: 'You walk up to the teacher and try to get his attention.' },
          { type: 'paragraph', text: 'When he finally pays attention to you, he slams on his keyboard trying to get Facebook off the screen.' },
          { type: 'paragraph', text: 'He acts as if every student in the whole school doesn’t know he plays on the computer all day long.' },
          { type: 'thought', text: 'Maybe, just maybe, he will actually care.' },
        ],
        metrics: { sleep: 0, stress: -1, time: 0, care: 1 },
        nextSceneId: 'scene_technology_teacher_refusal',
      },
      {
        id: 'go_to_computer',
        label: 'Go get on the computer',
        resultTitle: 'You decide to handle it yourself.',
        result: [
          { type: 'paragraph', text: 'You make the decision.\n\nNo one here is going to help you.' },
          { type: 'thought', text: 'I’ll figure it out myself.' },
          { type: 'paragraph', text: 'You move toward a computer.' },
        ],
        metrics: { sleep: 0, stress: -1, time: 0, care: -1 },
        nextSceneId: 'scene_technology_computer_search',
      },
    ],
  },
  {
    id: 'scene_technology_teacher_refusal',
    sceneNumber: 6,
    totalScenes: 10,
    time: 'First Period',
    heading: 'Technology Class',
    revealGroups: [
      [
        { type: 'paragraph', text: '“Why aren’t you at your computer?” he says, obviously irritated.' },
        { type: 'thought', text: 'What a nice way to start this conversation.' },
        { type: 'paragraph', text: 'You debate about telling him.' },
        { type: 'paragraph', text: 'Really, this is none of his business.' },
      ],
      [
        { type: 'paragraph', text: 'The last time you tried to get help from a teacher, he blew you off entirely.' },
        { type: 'thought', text: 'What the hell am I doing? There is no way he is going to care.' },
        { type: 'paragraph', text: 'You decide to give it one final try with this teacher.' },
        { type: 'paragraph', text: 'Maybe, just maybe, he will actually care.' },
      ],
      [
        { type: 'paragraph', text: '“I heard from one of my buddies that there were some police called to my street after I left for school. Can I look it up on the internet to see what happened?”' },
        { type: 'paragraph', text: 'The teacher looks at you suspiciously.' },
        { type: 'paragraph', text: '“Look, you know the rules of the computer lab. You are only allowed to use the internet for work on your school assignments. If the principal would come in with you on some gaming site I would be in serious trouble. I am sure everything is fine. Go do your work.”' },
      ],
      [
        { type: 'paragraph', text: 'Let me tell you how many things were wrong with this statement.' },
        { type: 'paragraph', text: 'First, he doesn’t care about the principal.' },
        { type: 'paragraph', text: 'Hello, Facebook.' },
        { type: 'paragraph', text: 'Second, what rules for this room?' },
        { type: 'paragraph', text: 'The only good thing about this conversation was that you once again learned that the teachers in this building suck and could care less about the students.' },
        { type: 'thought', text: 'They don’t get me. They don’t get any of us. This was the last time I ever ask for help.' },
        { type: 'paragraph', text: 'Worthless teachers.' },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'What opportunity did the teacher have to break the chain of Adam’s day?',
        'How does the teacher’s own rule-breaking change Adam’s reaction?',
        'What does Adam learn from this failed attempt to ask for help?',
      ],
      writingPrompt: 'Write one teacher response that would have helped Adam without ignoring classroom expectations.',
      insight: 'This is the moment where Adam reaches for adult help and gets pushed back into compliance instead.',
      expandedInsight:
        'The teacher’s refusal does more than deny a request. It confirms Adam’s belief that adults in school will not help him. The teacher also models the very rule-breaking he demands Adam avoid.',
      facilitatorLens:
        'Ask participants how often students stop asking for help after one adult dismisses them.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'go_back_computer',
        label: 'Go back to your computer',
        resultTitle: 'You go back to your computer.',
        result: [
          { type: 'paragraph', text: 'That was it.\n\nYou tried.\n\nHe didn’t help.' },
          { type: 'thought', text: 'I’m on my own.' },
          { type: 'paragraph', text: 'You turn back toward the computers.' },
        ],
        metrics: { sleep: 0, stress: -2, time: 0, care: -2 },
        nextSceneId: 'scene_technology_computer_search',
      },
      {
        id: 'enough_quit',
        label: 'This is enough. I need to quit.',
        resultTitle: 'You want out.',
        result: [
          { type: 'paragraph', text: 'You feel yourself hit the wall.' },
          { type: 'paragraph', text: 'This is enough.' },
          { type: 'paragraph', text: 'You do not want to do this anymore.' },
          { type: 'thought', text: 'I need to quit.' },
        ],
        metrics: { sleep: 0, stress: -2, time: -1, care: -1 },
        nextSceneId: 'scene_technology_computer_search',
      },
    ],
  },
  {
    id: 'scene_technology_computer_search',
    sceneNumber: 7,
    totalScenes: 10,
    time: 'First Period',
    heading: 'Technology Class',
    revealGroups: [
      [
        { type: 'paragraph', text: 'What a waste this teacher is.' },
        { type: 'paragraph', text: 'You need to know what is going on with your mom and baby sister.' },
        { type: 'paragraph', text: 'You try to find a computer that is far away from the Facebook-happy teacher.' },
        { type: 'paragraph', text: 'You get on the internet immediately and start to look up the local news.' },
      ],
      [
        { type: 'paragraph', text: 'You get on the local newspaper site and start to fish through the breaking news section.' },
        { type: 'paragraph', text: 'You find the article heading.' },
        { type: 'paragraph', text: '“Police called to 3rd street for disturbance and find two seriously injured.”' },
        { type: 'thought', text: 'Oh god, not my little sister.' },
        { type: 'paragraph', text: 'You need to read more, so you click to the full article.' },
      ],
      [
        { type: 'paragraph', text: 'As soon as you see the full article start to come into view, you hear the teacher shout your name.' },
        { type: 'thought', text: 'Screw him. He wouldn’t help me, so I am helping myself.' },
        { type: 'paragraph', text: 'You ignore him and start to read the first line of the full article.' },
        { type: 'paragraph', text: '“Police were called this morning to a house in the 3rd street district...”' },
      ],
      [
        { type: 'paragraph', text: 'You feel a hand grab your shoulder and swing you around on the swivel chair.' },
        { type: 'paragraph', text: '“You know the rules! What is your problem?”' },
        { type: 'paragraph', text: 'You know where this is going, so why even bother to argue with him.' },
        { type: 'paragraph', text: '“Yea, I know the rules. They are stupid ass rules, just like you!”' },
      ],
      [
        { type: 'paragraph', text: 'The teacher proceeds to shout a few things at you, but you don’t hear him.' },
        { type: 'paragraph', text: 'You are still thinking of how to get back to that article.' },
        { type: 'paragraph', text: 'God knows no one in this school will help you.' },
        { type: 'paragraph', text: 'You spin around to go back to the computer while he is still yelling.' },
        { type: 'paragraph', text: '“Go to the office!”' },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'What rule did Adam break, and what need was he trying to meet?',
        'How did the teacher’s response escalate the situation?',
        'What would a restorative response look like here?',
      ],
      writingPrompt: 'Write how an administrator should respond if Adam is sent to the office after this incident.',
      insight: 'Adam’s defiance is real, but it is connected to fear and failed help-seeking.',
      expandedInsight:
        'This moment should not be reduced to “student used computer incorrectly.” Adam tried to ask for help, was dismissed, and then attempted to meet the need himself. His behavior escalated when the adult treated the rule violation as more important than the possible emergency.',
      facilitatorLens:
        'Ask participants how policy can be enforced without ignoring student crisis.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'go_office',
        label: 'Go to the office',
        resultTitle: 'You go to the office.',
        result: [
          { type: 'paragraph', text: 'You get up from the computer.' },
          { type: 'paragraph', text: 'You still do not know what happened at home.' },
          { type: 'thought', text: 'This place is useless.' },
        ],
        metrics: { sleep: 0, stress: -2, time: -1, care: -2 },
        nextSceneId: 'scene_main_office',
      },
      {
        id: 'go_cool_teacher',
        label: 'Go see the only cool teacher in the school. Maybe she will help me.',
        resultTitle: 'You think of the one teacher who might help.',
        result: [
          { type: 'paragraph', text: 'You are done with this teacher.' },
          { type: 'paragraph', text: 'Maybe there is still one adult in the building who will actually care.' },
          { type: 'thought', text: 'Maybe she will help me.' },
        ],
        metrics: { sleep: 0, stress: -1, time: -1, care: -1 },
        nextSceneId: 'scene_third_period_reading_class',
      },
    ],
  },

  {
    id: 'scene_main_office',
    sceneNumber: 8,
    totalScenes: 10,
    time: 'Main Office',
    heading: 'The Main Office',
    revealGroups: [
      [
        { type: 'paragraph', text: 'I end up at the office and sit down in the front part of the office.' },
        { type: 'paragraph', text: "I didn't say anything to anyone coming in." },
        { type: 'paragraph', text: "Why should I, I don't want to be here so why do I need to say anything?" },
        { type: 'thought', text: 'You can make me come in here, but you can’t make me say anything.' },
      ],
      [
        { type: 'paragraph', text: 'I sit there quietly stewing over this very shitty morning.' },
        { type: 'paragraph', text: 'I am confident it is going to get worse once the principal calls me into his office.' },
        { type: 'paragraph', text: 'He sort of has a mixed reputation in the school.' },
        { type: 'paragraph', text: "He is basically OK, he doesn't really bother any of us kids so we don't bother him back." },
      ],
      [
        { type: 'paragraph', text: 'Every once in a while he gets on the PA and shouts at us about no fighting in the halls or smoking or whatever he feels like yelling about that week.' },
        { type: 'paragraph', text: 'Really it seems to us that those PA announcements come at just about the same time you see all these white guys in suits walking the halls for three or four days.' },
      ],
      [
        { type: 'paragraph', text: '10 minutes have passed and I am getting really bored so I shout over the counter to the secretary.' },
        { type: 'paragraph', text: '"Is he going to see me or what? This is boring!"' },
        { type: 'paragraph', text: 'The secretary looked over her counter and you could swear she saw a ghost.' },
        { type: 'paragraph', text: '“What are you doing there?"' },
      ],
      [
        { type: 'paragraph', text: 'This is stupid, what the hell does she think I am doing here.' },
        { type: 'paragraph', text: "\"I don't know?\" I reply." },
        { type: 'paragraph', text: 'The secretary looks perplexed, "Why are you here?"' },
        { type: 'paragraph', text: "Again I reply a bit louder, “I don't know.”" },
        { type: 'paragraph', text: '“Then get back to class."' },
      ],
      [
        { type: 'paragraph', text: 'I look at her with a full smile and politely say, “Thank you I will."' },
        { type: 'paragraph', text: 'Apparently no one told the office I was coming.' },
        { type: 'paragraph', text: 'Some good luck finally.' },
        { type: 'thought', text: 'Seriously, how dumb do these people think we really are.' },
        { type: 'paragraph', text: 'Fine, I will leave. No problem.' },
        { type: 'paragraph', text: "If the teacher asks me, yes I went to the principal's office and yes I most definitely learned a valuable lesson, don't offer any more info then what they ask for." },
        { type: 'thought', text: 'Check!' },
        { type: 'paragraph', text: 'By now it is second period.' },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'What adult systems failed Adam in this office scene?',
        'What does the secretary’s response communicate to him?',
        'How does disorganization reinforce Adam’s belief that adults do not care?',
      ],
      writingPrompt: 'Write how the office could have responded differently once Adam arrived.',
      insight: 'A missed communication between adults becomes another missed opportunity for the student.',
      expandedInsight:
        'Adam is sent to the office after a serious classroom escalation, but the office does not appear prepared for him. No one asks why he is there, what happened, or whether he is okay. The system failure confirms Adam’s belief that adults are disorganized and unavailable.',
      facilitatorLens:
        'Ask participants how referral systems can either interrupt or intensify a student’s bad day.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'go_second_period',
        label: 'Go to 2nd Period',
        resultTitle: 'You head to second period.',
        result: [
          { type: 'paragraph', text: 'You leave the office before anyone changes their mind.' },
          { type: 'paragraph', text: `No one helped.

No one asked.

No one even seemed to know why you were there.` },
          { type: 'thought', text: 'Some good luck finally.' },
        ],
        metrics: { sleep: 0, stress: 1, time: 1, care: -1 },
        nextSceneId: 'scene_second_period_math',
      },
      {
        id: 'office_quit',
        label: 'I have had enough. I need to quit.',
        resultTitle: 'You hit the wall.',
        result: [
          { type: 'paragraph', text: 'You sit with the feeling that this whole place is a joke.' },
          { type: 'paragraph', text: `No one knows what they are doing.

No one knows what happened to you.

No one asks.` },
          { type: 'thought', text: 'I have had enough.' },
        ],
        metrics: { sleep: 0, stress: -2, time: -1, care: -2 },
        nextSceneId: 'scene_second_period_math',
      },
    ],
  },

  {
    id: 'scene_second_period_math',
    sceneNumber: 9,
    totalScenes: 11,
    time: 'Second Period',
    heading: 'SECOND PERIOD MATH CLASS',
    revealGroups: [
      [
        { type: 'paragraph', text: 'I went back to class after the visit to the main office which was a joke.' },
        { type: 'paragraph', text: "My second period is math and I don't entirely mind math class. The teacher is easy and really doesn't make us do a whole lot other than keep quiet and do worksheets at our desk." },
        { type: 'paragraph', text: 'At the beginning of each class she hands us a daily packet. Our job is to complete the packet using our text books. We are to work up until the bell, turn in what we have done and leave quietly.' },
      ],
      [
        { type: 'paragraph', text: 'Believe it or not that is exactly what happens in her class.' },
        { type: 'paragraph', text: "The only kid in the class that can actually do the math problems does them quickly and then the rest of us copy her sheets. Of course we make a few problems different so the teacher doesn't figure it out." },
        { type: 'paragraph', text: "Honestly, I don't think she would care even if she did know that we copy." },
        { type: 'paragraph', text: "My class is pretty good in math. None of us want to do the work so we try to keep it cool in her class. We don't really want to mess up a good thing." },
      ],
      [
        { type: 'paragraph', text: 'Towards the end of class we start to cut up, but by then she must assume we had enough time to get the packet done.' },
        { type: 'paragraph', text: "The only problem is when we take the tests. If the teacher is not paying attention we copy but when she is walking around we don't do so well." },
        { type: 'paragraph', text: 'I remember one kid in our class. She was only in our school for a short time. She came from a "different" school. We all know that means one of the detention centers.' },
        { type: 'paragraph', text: 'Anyways, this girl was in our class and we told her beforehand the deal. She was cool with that.' },
      ],
      [
        { type: 'paragraph', text: "Well, until the day she got her worksheet back and didn't do very well." },
        { type: 'paragraph', text: 'She ended up beating up the kid who gave us answers.' },
        { type: 'paragraph', text: 'It took us some time to convince the good math student to start helping again.' },
        { type: 'paragraph', text: 'This time we promised to protect her.' },
        { type: 'thought', text: 'I still can’t stop thinking about what happened on my street.' },
        { type: 'paragraph', text: 'I try to focus on the packet in front of me, but none of it is landing.' },
        { type: 'paragraph', text: 'The bell rings for third period.' },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'What adult assumptions might form when a class is quiet but students are not learning?',
        'Where are missed opportunities for checking understanding and student voice?',
        'How can support replace passive compliance in this room?',
      ],
      writingPrompt: 'Name one routine this teacher could change tomorrow to surface real learning needs.',
      insight: 'Compliance can hide disengagement, skill gaps, and survival-mode behavior.',
      expandedInsight:
        'When students are quiet, adults may assume learning is happening. In this scene, low demands and copying create a system where students avoid exposure but also miss growth. A brief check-in and authentic task could interrupt that cycle.',
      facilitatorLens:
        'Guide staff to distinguish calm classrooms from connected classrooms and identify one concrete intervention.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'go_third_period',
        label: 'Go to 3rd Period',
        resultTitle: 'You head to third period.',
        result: [{ type: 'paragraph', text: 'You pack up and head to third period.' }],
        metrics: { sleep: 0, stress: -1, time: -1, care: -1 },
        nextSceneId: 'scene_third_period_reading_class',
      },
      {
        id: 'find_out_street',
        label: 'Try to find out what happened on your street so you can finally relax',
        resultTitle: 'You need to know what happened.',
        result: [{ type: 'paragraph', text: 'You decide to find out what happened on your street before anything else.' }],
        metrics: { sleep: 0, stress: -2, time: 1, care: -1 },
        nextSceneId: 'scene_hallway_internal_reflection',
      },
    ],
  },
  {
    id: 'scene_cool_teacher',
    sceneNumber: 8,
    totalScenes: 10,
    time: 'Second Period',
    heading: 'Looking for the One Teacher Who Cares',
    revealGroups: [
      [
        { type: 'paragraph', text: 'I decided to go try the only teacher in the entire school that we kids actually trust.' },
        { type: 'paragraph', text: 'She is known as the "cool teacher" because she actually gives a shit about us.' },
        { type: 'paragraph', text: 'She teaches math to the grade below me so I have not seen her in a while.' },
        { type: 'thought', text: 'I am sure she will take 2 minutes to look up the article on the internet so I can stop worrying about this.' },
      ],
      [
        { type: 'paragraph', text: 'I knocked on the door to her class room sort of excited to see her again.' },
        { type: 'paragraph', text: 'My friend said he stopped by to see her last week and she remembered every name in his family.' },
        { type: 'paragraph', text: 'When the door opened there was this guy teacher staring at me.' },
        { type: 'paragraph', text: 'My first reaction was who in the hell are you.' },
        { type: 'thought', text: 'Just what I need, a damn substitute?' },
      ],
      [
        { type: 'paragraph', text: '"What do you want and why aren\'t you in class young man?"' },
        { type: 'paragraph', text: 'Seriously did he just call me young man?' },
        { type: 'paragraph', text: '“Who in the hell are you and where is Ms. Blankenship?"' },
        { type: 'paragraph', text: 'He looked at me while his face was slowing turning red from the neck up.' },
        { type: 'paragraph', text: '“What is your name young man? The previous teacher took a better job away from the city. You need to check your manners.”' },
      ],
      [
        { type: 'paragraph', text: 'For the record, this dumb ass will not survive a week in this school.' },
        { type: 'paragraph', text: 'I lost my mind!' },
        { type: 'paragraph', text: 'I ran down the hall just enough for the teacher to not want to follow me and I stopped and went into the bathroom.' },
        { type: 'paragraph', text: 'I sat down in the stall and grabbed a cigarette.' },
      ],
      [
        { type: 'paragraph', text: 'She is gone.' },
        { type: 'thought', text: 'Why am I surprised?' },
        { type: 'paragraph', text: 'All the great teachers leave.' },
        { type: 'paragraph', text: 'The reason this one hurts the most I think is because she told me she would be here for me.' },
        { type: 'paragraph', text: "I didn't realize that it meant until she got a better offer." },
        { type: 'thought', text: "Screw her. I don't need her. I don't need any of them." },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'Why does Ms. Blankenship being gone hit Adam so hard?',
        'How does teacher turnover affect student trust?',
        'What does Adam learn when the one adult he trusted is no longer there?',
      ],
      writingPrompt: 'Write how a school could protect student trust during teacher transitions.',
      insight: 'For students with unstable adult relationships, losing one trusted teacher can feel like another abandonment.',
      expandedInsight:
        'Adam is not simply upset that a teacher changed jobs. He believed this teacher when she said she would not forget him. Her absence confirms a larger pattern in his life: adults leave, promises break, and trusting people is dangerous.',
      facilitatorLens:
        'Ask participants how schools can make sure students do not experience staffing changes as personal abandonment.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'go_principal_office',
        label: "Go to the principal's Office",
        resultTitle: 'You head toward the office.',
        result: [
          { type: 'paragraph', text: 'You collect yourself enough to move.' },
          { type: 'paragraph', text: 'There is nowhere else to go now except the office.' },
          { type: 'thought', text: 'They all leave.' },
        ],
        metrics: { sleep: 0, stress: -2, time: -1, care: -2 },
        nextSceneId: 'scene_main_office',
      },
      {
        id: 'try_leave_school',
        label: 'Try to get out of school and go home to see if mom and sis are OK',
        resultTitle: 'You decide to leave.',
        result: [
          { type: 'paragraph', text: 'You are done waiting for someone in this building to help.' },
          { type: 'paragraph', text: 'If no one here will help you find out what happened, maybe you need to leave and find out yourself.' },
          { type: 'thought', text: 'I need to know if they’re OK.' },
        ],
        metrics: { sleep: 0, stress: -1, time: -1, care: -1 },
        nextSceneId: 'scene_hallway_internal_reflection',
      },
    ],
  },
  {
    id: 'scene_hallway_internal_reflection',
    sceneNumber: 10,
    totalScenes: 13,
    time: 'Hallway',
    heading: 'Hallway / Internal Reflection',
    revealGroups: [
      [
        { type: 'paragraph', text: 'You step into the hallway between classes.' },
        { type: 'paragraph', text: 'The noise hits immediately. Lockers slamming. Kids yelling. Teachers trying to move everyone along before the bell rings.' },
        { type: 'paragraph', text: 'You move slower than everyone else.' },
        { type: 'thought', text: "I can’t focus." },
      ],
      [
        { type: 'paragraph', text: 'You keep thinking about your street. About your mom. About your sister.' },
        { type: 'paragraph', text: 'You try to tell yourself everything is probably fine, but your stomach keeps tightening every time you think about it.' },
        { type: 'paragraph', text: 'For a second you think about finding the one teacher who actually listens sometimes.' },
        { type: 'paragraph', text: "The one who asks if you're okay even when you say you're fine." },
        { type: 'paragraph', text: 'But then you picture trying to explain any of this out loud.' },
        { type: 'thought', text: 'What am I even supposed to say?' },
      ],
      [
        { type: 'paragraph', text: 'A group of kids pushes past you in the hallway. Someone laughs loud enough that you turn your head automatically.' },
        { type: 'paragraph', text: 'Not at you.' },
        { type: 'paragraph', text: "Doesn’t matter." },
        { type: 'paragraph', text: 'Your chest still tightens.' },
        { type: 'paragraph', text: 'The late bell rings.' },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'What trauma responses are visible in Adam’s hallway behavior?',
        'How might hallway staff interpret this moment without context?',
        'What would a safety-centered adult response sound like here?',
      ],
      writingPrompt: 'Write one brief hallway check-in that protects dignity and invites support.',
      insight: 'Unstructured transitions can intensify dysregulation for students carrying fear and uncertainty.',
      expandedInsight:
        'Adam is scanning, bracing, and withdrawing at once. Adults who only enforce pace may miss a key intervention window. Small relational moves in transitions can prevent later escalation.',
      facilitatorLens:
        'Have participants practice 15-second hallway responses that prioritize regulation over compliance.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'try_find_teacher',
        label: 'Try to find the teacher anyway',
        resultTitle: 'You look for the one teacher who might listen.',
        result: [{ type: 'paragraph', text: 'You turn and head down the hall, hoping to find the one teacher who still checks on you.' }],
        metrics: { sleep: 0, stress: 1, time: -1, care: 1 },
        nextSceneId: 'scene_third_period_reading_class',
      },
      {
        id: 'forget_it_go_to_class',
        label: 'Forget it and go to class',
        resultTitle: 'You push it down and head to reading class.',
        result: [{ type: 'paragraph', text: 'You force yourself to keep moving and go to reading class.' }],
        metrics: { sleep: 0, stress: 1, time: 1, care: -1 },
        nextSceneId: 'scene_third_period_reading_class',
      },
    ],
  },
  {
    id: 'scene_third_period_reading_class',
    sceneNumber: 11,
    totalScenes: 13,
    time: '3rd Period',
    heading: '3rd Period Reading Class',
    revealGroups: [
      [
        {
          type: 'paragraph',
          text: "Reading class is a great class. The teacher normally reads to us. We either listen if it is a good story or we put our heads down and sleep. Either way I like it.",
        },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'What basic needs are competing with learning in this scene?',
        'How could a teacher read sleep as data instead of disrespect?',
        'What student voice is missing before instruction begins?',
      ],
      writingPrompt: 'Describe one trauma-informed way to respond when a student puts their head down.',
      insight: 'Sleep in class can be a stress response, not a motivation problem.',
      expandedInsight:
        'Adam’s body is asking for recovery while school asks for attention. If adults respond only with correction, they lose a chance to connect and assess need.',
      facilitatorLens:
        'Prompt teams to separate behavior management from need assessment in real time.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'go_to_sleep',
        label: 'Go to sleep',
        resultTitle: 'You put your head down.',
        result: [{ type: 'paragraph', text: 'You decide to go to sleep.' }],
        metrics: { sleep: 1, stress: -1, time: 0, care: -1 },
        nextSceneId: 'scene_lunch_room',
      },
      {
        id: 'listen_to_story',
        label: 'Listen to the story',
        resultTitle: 'You try to listen.',
        result: [{ type: 'paragraph', text: 'You try to listen to the story.' }],
        metrics: { sleep: -1, stress: 1, time: 0, care: 1 },
        nextSceneId: 'scene_reading_class_trying_to_listen',
      },
    ],
  },
  {
    id: 'scene_lunch_room',
    sceneNumber: 12,
    totalScenes: 14,
    time: 'Lunch',
    heading: 'Lunch Room',
    revealGroups: [
      [
        { type: 'paragraph', text: "I wake up with some drool on my desk. It was a rough wake up. My cousin hit me on the back of the head to get me moving. If I was more awake I would slap him right back. But the bell rang and I had to get going." },
        { type: 'paragraph', text: "\"OK, cuz, I'm going, damn.\"" },
      ],
      [
        { type: 'paragraph', text: "We arrive in the lunch room. This is where you have to be on your toes. I sit with my friends and a few of my cousins that are in the same grade as me." },
        { type: 'paragraph', text: "The food is bad but most cafeterias are and it will probably be all I get today." },
        { type: 'paragraph', text: "Hopefully my mom is OK and if she is she will be at work when I get home. I have no idea if there is any food at home so I better just deal with the food here." },
      ],
      [
        { type: 'paragraph', text: "I go for my book bag to get my money." },
        { type: 'thought', text: "Shit! Book bag is still at home." },
        { type: 'paragraph', text: "I find this one kid we let sit with us and hit him up for some money. He usually always gives it to those of us that forget our money or just don't have any." },
        { type: 'paragraph', text: "He helps us and we let him sit with us. It’s safer for him and good for us." },
      ],
      [
        { type: 'paragraph', text: "I sit down to eat and the topic at our table is my street. Apparently everyone knows a little but no one knows the details. Like if it was my house or not." },
        { type: 'paragraph', text: "My one cousin tells me that he heard the person had to go to the hospital." },
        { type: 'paragraph', text: "One of my buddies tells me he heard that there were two dead." },
        { type: 'thought', text: "I feel like I am going to puke." },
        { type: 'paragraph', text: "I tell them all to shut the hell up and they do. They are my boys!" },
      ],
      [
        { type: 'paragraph', text: "Not ten minutes into lunch a fight breaks out between two girls." },
        { type: 'paragraph', text: "Girl fights are the best. You always get a ton of shouting and weave and fake nails fly everywhere. Even the toughest guys don't mess with the girls." },
        { type: 'paragraph', text: "We all move out of the way to give them room to fight." },
      ],
      [
        { type: 'paragraph', text: "When the biggest hair weave flies you can hear the entire lunch room yell \"OOOOH\" with ear shattering laughter afterwards." },
        { type: 'paragraph', text: "A few teachers who are in the lunch room try to step in. Some of us try to block them from helping and we continue to laugh it up." },
        { type: 'paragraph', text: "Finally one teacher breaks through and you can see her pausing to figure out how to stop this. That just makes us laugh harder. She wanted past us so badly, now what?" },
        { type: 'paragraph', text: "Finally they get the fight under control and we finish our lunch." },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'How do hunger, rumors, and peer dynamics raise risk during lunch?',
        'What adult moves could reduce escalation before a fight?',
        'Where are opportunities to increase emotional and physical safety?',
      ],
      writingPrompt: 'List one supervision change and one relational strategy that could improve lunch safety.',
      insight: 'Cafeteria behavior often reflects unmet needs and unstructured stress, not just misconduct.',
      expandedInsight:
        'Adam is managing hunger, fear for family, and social survival at once. In that state, conflict energy spreads quickly. Predictable adult presence and proactive support can lower harm.',
      facilitatorLens:
        'Ask staff to map how basic-needs stress shows up behaviorally in common spaces.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'go_to_fifth_period',
        label: 'Go to 5th Period',
        resultTitle: 'You head to fifth period.',
        result: [{ type: 'paragraph', text: 'Lunch ends, and you head to fifth period.' }],
        metrics: { sleep: 0, stress: 1, time: 1, care: -1 },
        nextSceneId: 'scene_science_class',
      },
      {
        id: 'lunch_quit',
        label: 'I have had enough. I want to quit.',
        resultTitle: 'You want out.',
        result: [{ type: 'paragraph', text: 'You hit that familiar wall again. This is too much, and you want out.' }],
        metrics: { sleep: 0, stress: -2, time: -1, care: -1 },
        nextSceneId: 'scene_principal_consequence',
      },
    ],
  },
  {
    id: 'scene_reading_class_trying_to_listen',
    sceneNumber: 13,
    totalScenes: 13,
    time: '3rd Period',
    heading: 'Reading Class — Trying to Listen',
    revealGroups: [
      [
        {
          type: 'paragraph',
          text: "I try to stay awake during this book. It is about some boy who has magic. I don't remember the plot because I think I slept in this class yesterday. Besides I am worried about my mom and baby sis, I just came back from the principal's office and I am hungry since I didn't get any breakfast and dinner last night was awful. Do they seriously think I give one shit about some story that can't happen? Screw it, I am going to sleep.",
        },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'What does Adam’s internal dialogue reveal about cognitive overload?',
        'How might adults mislabel this as defiance or apathy?',
        'What support would make listening possible here?',
      ],
      writingPrompt: 'Write a two-sentence teacher response that validates need and re-engages learning.',
      insight: 'When basic needs are unmet, attention to instruction can collapse.',
      expandedInsight:
        'Adam is hungry, exhausted, and worried about safety at home. His shutdown is predictable under strain. Supportive responses should reduce load before demanding performance.',
      facilitatorLens:
        'Have participants identify what “ready to learn” requires beyond compliance.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'fall_asleep',
        label: 'No options here, you fall asleep',
        resultTitle: 'You fall asleep.',
        result: [{ type: 'paragraph', text: 'You fall asleep.' }],
        metrics: { sleep: 1, stress: 1, time: 0, care: -1 },
        nextSceneId: 'scene_lunch_room',
      },
    ],
  },
  {
    id: 'scene_science_class',
    sceneNumber: 13,
    totalScenes: 14,
    time: '5th Period',
    heading: 'Science Class',
    revealGroups: [
      [
        { type: 'paragraph', text: "5th Period is Science. It can be a good class when the teacher does a cool experiment." },
        { type: 'paragraph', text: "The crappy part is that my step brother, who goes to a suburban school outside the city, gets to actually do the experiments." },
        { type: 'paragraph', text: "We only get to watch." },
        { type: 'paragraph', text: "Of course, we are not dumb; we know why they won't let us use chemicals and glass beakers." },
        { type: 'thought', text: "Someone would use it over someone else's head." },
      ],
      [
        { type: 'paragraph', text: "After watching the teacher do this cool water coloring changing experiment he told us to write what we saw." },
        { type: 'paragraph', text: "That's basically where he lost me." },
        { type: 'paragraph', text: "It wasn't hard to write." },
        { type: 'paragraph', text: "I saw water change colors." },
        { type: 'paragraph', text: "I am sure he wanted more but I don't care why the water changed color and I don't care how to do it because I will never need to change the color of water." },
      ],
      [
        { type: 'paragraph', text: "My boys and I were talking about the party that we had a few weeks ago." },
        { type: 'paragraph', text: "My one buddy told us that this one girl got pregnant at the party." },
        { type: 'paragraph', text: "They all laughed joking about which one of the guys at the party was dumb enough to not protect themselves." },
        { type: 'thought', text: "I got dizzy and sick." },
      ],
      [
        { type: 'thought', text: "Oh hell, this day needs to end." },
        { type: 'paragraph', text: "I did protect myself. The condom was old. My step brother told me it was old but should be fine." },
        { type: 'paragraph', text: "I'm not even sure if I had the thing on right." },
        { type: 'paragraph', text: "I can't take much more." },
        { type: 'paragraph', text: "I can only hope she was with someone else also." },
      ],
      [
        { type: 'paragraph', text: "Last year when I was in 6th grade this girl in 8th grade had a baby." },
        { type: 'paragraph', text: "I remember the guy that she thought was the baby's father ended up not being the dad." },
        { type: 'paragraph', text: "I can only hope it wasn't me." },
        { type: 'paragraph', text: "She will be in my next period class." },
        { type: 'paragraph', text: "Maybe I should just ask her. Or maybe just ignore the whole thing." },
        { type: 'paragraph', text: "If she doesn't tell anyone about us then it won't affect me at all." },
        { type: 'thought', text: "Maybe just keep my mouth shut for now." },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'How do low expectations communicate messages about student worth and trust?',
        'What system-level assumptions are driving who gets hands-on learning?',
        'How might disengagement be connected to belonging and relevance?',
      ],
      writingPrompt: 'Name one way to increase voice, rigor, and safety in this science setting.',
      insight: 'Exclusion from meaningful participation can fuel disconnection and behavior risk.',
      expandedInsight:
        'Watching instead of doing reinforces a belief that students are seen as dangerous, not capable. That message compounds existing stress and reduces buy-in.',
      facilitatorLens:
        'Invite teams to examine how policy decisions can unintentionally escalate student alienation.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'go_to_next_period',
        label: 'I really think I am about out of options. Just go to next period and hope no more bad news today.',
        resultTitle: 'You head to the next period.',
        result: [{ type: 'paragraph', text: 'You decide to keep moving and hope no more bad news comes today.' }],
        metrics: { sleep: 0, stress: -2, time: 1, care: -1 },
        nextSceneId: 'scene_gym_class',
      },
    ],
  },

  {
    id: 'scene_gym_class',
    sceneNumber: 14,
    totalScenes: 16,
    time: 'Gym Class',
    heading: 'Gym Class',
    revealGroups: [
      [
        { type: 'paragraph', text: "I walk into gym class. I am so tired." },
        { type: 'paragraph', text: "Between having a very rough morning and the day I have had I am just about done." },
        { type: 'paragraph', text: "I walk into gym class and I see the girl I was with at that party immediately." },
        { type: 'thought', text: "I feel so sick." },
      ],
      [
        { type: 'paragraph', text: "I see that she is sitting out of gym class which makes me think the story is true." },
        { type: 'paragraph', text: "I want to talk to her but I just can't right now." },
        { type: 'paragraph', text: "I don't even know what I would say." },
      ],
      [
        { type: 'paragraph', text: "We start to play some variation of kick ball." },
        { type: 'paragraph', text: "One person kicks but three or four run the bases at one time." },
        { type: 'paragraph', text: "You also have to run the bases twice in order to score." },
      ],
      [
        { type: 'paragraph', text: "I am waiting in line for my turn to kick and the guy behind me says, \"I see your baby momma is sitting out this game.\"" },
        { type: 'paragraph', text: "I don't even look at him." },
        { type: 'paragraph', text: "I just turn and shove him so hard he falls back into three other kids." },
      ],
      [
        { type: 'paragraph', text: "He stays on his feet and cusses at me while he runs to shove me back." },
        { type: 'paragraph', text: "I brace for him and we lock together." },
        { type: 'paragraph', text: "We both go down on the floor." },
        { type: 'paragraph', text: "I roll on top of him and shout at him to shut the hell up." },
      ],
      [
        { type: 'paragraph', text: "By that time the gym teacher is dragging me off of him." },
        { type: 'paragraph', text: "Good thing he did because I was about to knock his head against the gym floor." },
        { type: 'paragraph', text: "I tried to tell the teacher why I shoved him." },
        { type: 'paragraph', text: "Of course he didn't want to hear it." },
      ],
      [
        { type: 'paragraph', text: "The gym teacher calls the security guard from the office." },
        { type: 'paragraph', text: "As the security guard is escorting us to the main office I again try to explain what he said and why I shoved him." },
        { type: 'paragraph', text: "He said that wasn't his job to decide what happened and to tell the principal." },
        { type: 'thought', text: "Typical!" },
      ],
      [
        { type: 'paragraph', text: "The whole way through the halls he and I are yelling back and forth." },
        { type: 'paragraph', text: "One thing I hear him say is, \"You’re a dumb ass daddy with a whore for a baby momma.\"" },
        { type: 'paragraph', text: "I get my arm away from the security guard and I hit him in the back of the head." },
      ],
      [
        { type: 'paragraph', text: "He goes down and the security guard grabs me with both hands." },
        { type: 'paragraph', text: "He is shouting, the kid is yelling on the ground, and I just want everyone to shut up and leave me alone." },
        { type: 'thought', text: "Everyone is always against me and no one ever takes one damn second to listen to me." },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'What warning signs of escalation appear before the conflict turns physical?',
        'How might adult response choices increase or decrease harm?',
        'What de-escalation strategy could have protected both students?',
      ],
      writingPrompt: 'Describe a step-by-step intervention an adult could use before security is needed.',
      insight: 'Escalation is usually a process with multiple missed interruption points.',
      expandedInsight:
        'By the time Adam shoves a peer, stress and provocation have already stacked. Adults who notice early cues can redirect with regulation, distance, and respectful language.',
      facilitatorLens:
        'Practice identifying pre-incident cues and matching them with low-intensity interventions.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'no_options_office',
        label: 'Seriously, options? What options?',
        resultTitle: 'You are taken to the office.',
        result: [{ type: 'paragraph', text: 'There are no options now. You are being taken back to the main office.' }],
        metrics: { sleep: 0, stress: -3, time: -1, care: -2 },
        nextSceneId: 'scene_office_after_gym',
      },
    ],
  },



  {
    id: 'scene_office_after_gym',
    sceneNumber: 15,
    totalScenes: 16,
    time: 'Main Office',
    heading: 'Main Office — After Gym',
    revealGroups: [
      [
        { type: 'paragraph', text: "As the security guard sets us both in the office he explains to the secretary what happened." },
        { type: 'paragraph', text: "I hear him say, “These two thugs decided to start wrestling in the middle of gym class. They were mouthing off to each other about who was a better kick baller. As usual someone took it too seriously and the other threw a punch.”" },
      ],
      [
        { type: 'paragraph', text: "This is really not surprising after you go to this school long enough." },
        { type: 'paragraph', text: "Not only do they not listen to you, but they make shit up about what happened." },
        { type: 'paragraph', text: "No one threw a punch and no one could care less about who is a better kicker." },
      ],
      [
        { type: 'paragraph', text: "I shout, “Do you have any clue what the hell you are talking about? You suck at security if that’s what you think was happening.”" },
        { type: 'paragraph', text: "The kid who I was there with started to laugh at my comment." },
        { type: 'paragraph', text: "Then he joined in, “Yea everyone knows I am the better kicker, just like everyone knows that you suck as a security guard.”" },
      ],
      [
        { type: 'paragraph', text: "We both start laughing." },
        { type: 'paragraph', text: "The security guard does not think it is funny." },
        { type: 'paragraph', text: "He tells us both to shut up and sit down." },
        { type: 'thought', text: "Here we go again." },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'How does inaccurate adult storytelling shape consequences?',
        'What happens when students believe no one will hear their account?',
        'What repair step could restore fairness in this moment?',
      ],
      writingPrompt: 'Write one protocol change to ensure student voice is captured before discipline.',
      insight: 'When adults narrate without listening, trust and legitimacy break down quickly.',
      expandedInsight:
        'Adam experiences the office as a place where facts are replaced by assumptions. That pattern increases oppositional behavior and reduces future help-seeking.',
      facilitatorLens:
        'Challenge teams to define what procedural justice looks like in school discipline spaces.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'wait_for_principal',
        label: 'Wait for the principal',
        resultTitle: 'You wait in the office.',
        result: [{ type: 'paragraph', text: 'You sit there, angry and tired, waiting for whatever happens next.' }],
        metrics: { sleep: 0, stress: -2, time: -1, care: -2 },
        nextSceneId: 'scene_principal_consequence',
      },
    ],
  },


  {
    id: 'scene_principal_consequence',
    sceneNumber: 16,
    totalScenes: 17,
    time: 'Principal Office',
    heading: 'In-School Suspension',
    revealGroups: [
      [
        { type: 'paragraph', text: "Adam and the other kid wait in the office." },
        { type: 'paragraph', text: "After waiting in the office for ten minutes, the secretary and security guard decide the principal is just too busy to deal with them right now." },
        { type: 'paragraph', text: "They send Adam and his partner in crime to the In School Suspension room." },
        { type: 'thought', text: "Off to detention we go." },
      ],
      [
        { type: 'paragraph', text: "Once again Adam’s needs fall on deaf ears." },
        { type: 'paragraph', text: "No one asks what happened." },
        { type: 'paragraph', text: "No one asks why he reacted." },
        { type: 'paragraph', text: "No one asks what he has been trying to find out all day." },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'What is the difference between consequences and support in this scene?',
        'Which needs remain unaddressed before ISS placement?',
        'How could leadership interrupt the punishment pipeline here?',
      ],
      writingPrompt: 'Propose one alternative response that includes accountability and support.',
      insight: 'Consequences without assessment often recycle behavior instead of resolving causes.',
      expandedInsight:
        'Adam is moved through systems quickly, but no adult gathers context or need. Discipline becomes administrative flow rather than intervention.',
      facilitatorLens:
        'Ask participants to redesign this decision point using a support-first framework.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'go_to_iss',
        label: 'Go to In-School Suspension',
        resultTitle: 'You go to ISS.',
        result: [{ type: 'paragraph', text: 'There is nothing else to say. You are sent to In-School Suspension.' }],
        metrics: { sleep: 0, stress: -2, time: -1, care: -2 },
        nextSceneId: 'scene_iss_breaking_point',
      },
    ],
  },
  {
    id: 'scene_iss_breaking_point',
    sceneNumber: 17,
    totalScenes: 20,
    time: 'In-School Suspension',
    heading: 'ISS — Breaking Point',
    revealGroups: [
      [
        { type: 'paragraph', text: "The ISS room is a real joke. This is the room where the school puts you if they don't want to deal with you." },
        { type: 'paragraph', text: "This is basically a holding tank until the end of school." },
        { type: 'paragraph', text: "They don't try to teach us anything which is good." },
        { type: 'paragraph', text: "They basically let us do what we want as long as we stay quiet and do not bother the teacher on duty in the room." },
      ],
      [
        { type: 'paragraph', text: "The only down side of being in the ISS room is that you are in there with students that are usually pretty stupid." },
        { type: 'paragraph', text: "Most of them are in there for fighting for no reason or mouthing off to one of the teachers." },
        { type: 'paragraph', text: "Whatever, it’s none of my business as long as they leave me alone." },
      ],
      [
        { type: 'paragraph', text: "I take a seat by the window and try to take a nap." },
        { type: 'paragraph', text: "I am so damn tired and with only about an hour left in school I would like to get some sleep in case I need to deal with some crazy shit when I get home." },
        { type: 'paragraph', text: "I can only hope that my baby sister will be there when I get home and that my mom is at work and that everything is ok." },
      ],
      [
        { type: 'paragraph', text: "As I am starting to doze off this other kid comes up to me and sits beside me." },
        { type: 'paragraph', text: "I recognize him from my street. He lives about 4 blocks away from me I think." },
        { type: 'paragraph', text: "I give him the head bob and he says to me \"so I hear that you need your mommy to wake you up in the morning.\"" },
      ],
      [
        { type: 'paragraph', text: "I was confused and tired and really didn't feel like dealing with stupid over here." },
        { type: 'paragraph', text: "\"Whatever, shut up stupid.\"" },
      ],
      [
        { type: 'paragraph', text: "\"Yea my daddy told me that your mom was good last night, but really turned into a bitch in the morning.\"" },
        { type: 'paragraph', text: "He then began to laugh." },
        { type: 'paragraph', text: "\"Dad told me that you can’t work an alarm clock.\"" },
        { type: 'paragraph', text: "\"He told me that he had to come wake you up.\"" },
        { type: 'paragraph', text: "\"He told me that your mom was all mad at him for waking you up.\"" },
        { type: 'paragraph', text: "\"Your mom must be a real bitch.\"" },
        { type: 'paragraph', text: "\"Dad told me that she broke up with him.\"" },
        { type: 'paragraph', text: "\"He said that your mom will probably have another man in her bed by tonight cause she is nothing but a whore.\"" },
        { type: 'paragraph', text: "\"Does your mom get paid?\"" },
      ],
      [
        { type: 'paragraph', text: "After not knowing what is going to happen to me if that girl in gym class is pregnant." },
        { type: 'paragraph', text: "After dealing with one stupid adult after another today, this idiot hit the last nerve I had." },
      ],
      [
        { type: 'paragraph', text: "I didn't hold back this time like I did in gym class." },
        { type: 'paragraph', text: 'I took my strong arm and went right for the nose.' },
        { type: 'paragraph', text: 'My fist hit his nose as hard as I could and the cracking sound was gross.' },
        { type: 'paragraph', text: 'Blood splattered from his nose and was everywhere.' },
      ],
      [
        { type: 'paragraph', text: 'I then proceeded to stand up and hit him three or four more times in the face.' },
        { type: 'paragraph', text: 'I wanted to break his face.' },
        { type: 'paragraph', text: 'I wanted my fist to literally go right through his face and back out the other side.' },
      ],
      [
        { type: 'paragraph', text: 'The teacher that was on duty was old and not much of a concern to me.' },
        { type: 'paragraph', text: "I was so blind with rage that I really didn't even feel the security guard on me after about 6 minutes of me punching this kid." },
      ],
      [
        { type: 'paragraph', text: "After I came back to reality a bit I didn't want to wait around to see what happened next." },
        { type: 'paragraph', text: 'I twisted and turned and got away from the guard.' },
        { type: 'paragraph', text: 'Besides, everyone was looking at the busted up kid on the floor so I quickly ran out of the room, down the hall and out the main door of the school.' },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'How do cumulative stress and humiliation shape the breaking point?',
        'What supervision gaps in ISS increase danger for students?',
        'What trauma-responsive response should follow this incident?',
      ],
      writingPrompt: 'Identify immediate and next-day supports Adam would need after this event.',
      insight: 'Explosive behavior often follows prolonged exposure to threat, invalidation, and unmet needs.',
      expandedInsight:
        'The fight is severe, but it is not context-free. Adam reaches a crisis after repeated adult misses, sleep deprivation, and public provocation tied to family trauma.',
      facilitatorLens:
        'Focus discussion on prevention and post-crisis repair, not only punishment severity.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'leave_school',
        label: 'The only option left is to leave the school. I am already out of the building.',
        resultTitle: 'You leave the building.',
        result: [{ type: 'paragraph', text: 'You run out of the room, down the hall, and out the main door of the school.' }],
        metrics: { sleep: 0, stress: -4, time: -2, care: -3 },
        nextSceneId: 'scene_bus_stop',
      },
    ],
  },

  {
    id: 'scene_bus_stop',
    sceneNumber: 18,
    totalScenes: 20,
    time: 'After School',
    heading: 'Bus Stop',
    revealGroups: [
      [
        { type: 'paragraph', text: "That's the beauty of having the public buses around." },
        { type: 'paragraph', text: 'They run every 15 minutes or so.' },
        { type: 'paragraph', text: 'I was so tired from the day I fell asleep on the bus and almost missed my home stop.' },
      ],
      [
        { type: 'paragraph', text: 'I slowly made my way down the stairs of the bus and out onto the side walk.' },
        { type: 'paragraph', text: 'I slowly drug myself back towards my home.' },
        { type: 'paragraph', text: 'I was so tired.' },
        { type: 'paragraph', text: 'My brain even hurt from all the bullshit that went on today.' },
      ],
      [
        { type: 'paragraph', text: 'As I turned the corner to walk the last 4 blocks to my home I see these two bigger guys walking towards me.' },
        { type: 'paragraph', text: "I don't think much of it." },
        { type: 'paragraph', text: 'However, these guys are staring right at me and my street sense kicks in.' },
        { type: 'paragraph', text: 'Unfortunately, it kicks in too late since I am sort of out of it and still waking up from the bus.' },
      ],
      [
        { type: 'paragraph', text: 'By the time I realize something is wrong the two men grab me and one punches me right in the nose.' },
        { type: 'paragraph', text: "We learn in the city early that the nose is the best place to hit first because it makes their eyes water and they can't see what’s coming next." },
      ],
      [
        { type: 'paragraph', text: 'My nose is broken. I can feel it.' },
        { type: 'paragraph', text: 'They hit me a few more times, but this is not a mugging or a theft or this would have been done by now.' },
        { type: 'paragraph', text: 'I have been in those too and this is different.' },
        { type: 'paragraph', text: 'This is a "We need to make a point" sort of beating.' },
      ],
      [
        { type: 'paragraph', text: 'They pause knocking me around long enough for me to listen to them.' },
        { type: 'paragraph', text: '"The next time you decide to take my little cousins bus pass off of him, remember this."' },
        { type: 'paragraph', text: 'Then he kicks me right in the gut.' },
        { type: 'paragraph', text: 'I begin to puke as my rib makes a horrible cracking sound in my stomach.' },
      ],
      [
        { type: 'paragraph', text: 'I have been beat up before, but this one is bad.' },
        { type: 'paragraph', text: 'I start to feel like I am about to pass out...' },
        { type: 'paragraph', text: 'Then I do.' },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'How does violence outside school connect to earlier school-day events?',
        'What safety planning responsibilities does a school still hold after dismissal?',
        'How might unresolved harm at school increase off-campus risk?',
      ],
      writingPrompt: 'Write one school-community safety action that could reduce retaliation risk.',
      insight: 'Student risk does not end at the school door; systems must account for after-school vulnerability.',
      expandedInsight:
        'Adam’s bus-stop assault reflects a chain of earlier conflict and unmet intervention. Without coordinated safety supports, consequences can spill into community violence.',
      facilitatorLens:
        'Encourage teams to map cross-setting risk and identify shared accountability with families and partners.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'black_out',
        label: 'You are blacked out. No options.',
        resultTitle: 'Everything goes dark.',
        result: [
          { type: 'paragraph', text: 'Your body finally gives out.' },
        ],
        metrics: { sleep: 0, stress: -4, time: -2, care: -3 },
        nextSceneId: 'scene_back_in_bedroom',
      },
    ],
  },
  {
    id: 'scene_back_in_bedroom',
    sceneNumber: 19,
    totalScenes: 20,
    time: 'Bedroom',
    heading: 'Back in His Bedroom',
    revealGroups: [
      [
        { type: 'paragraph', text: "I come to in my bed." },
        { type: 'paragraph', text: "I feel like shit and very confused." },
        { type: 'paragraph', text: "I hear rustling downstairs and try to remember how I got here." },
      ],
      [
        { type: 'paragraph', text: "I slowly get out of bed and every inch of my body hurts." },
        { type: 'paragraph', text: "My rib is screaming in pain and my face feels like it is a helium balloon." },
        { type: 'paragraph', text: "I look in the mirror and all of a sudden everything hurts more." },
        { type: 'paragraph', text: "When you see what it looks like it always hurts worse." },
      ],
      [
        { type: 'paragraph', text: "I start to walk downstairs and I remember that my baby sister should be here with her babysitter and my mom should be at work." },
        { type: 'paragraph', text: "I can hear my baby sister downstairs and I feel some relief." },
        { type: 'thought', text: "She is OK." },
      ],
      [
        { type: 'paragraph', text: "I take a few more steps and I hear the one voice that makes me feel worse." },
        { type: 'paragraph', text: "I hear the man’s voice from last night, the asshole’s voice whose kid talked shit on my mom in ISS, the bastard that gave me all kinds of shit this morning, the man that made my entire day a misery." },
      ],
      [
        { type: 'thought', text: "What in the hell would he be doing here!" },
        { type: 'paragraph', text: "Didn't his jerk of a son say that my mom broke up with him this morning?" },
        { type: 'paragraph', text: "So either he chose to not leave after my mom went to work, or did they make up even after how he treated us this morning." },
        { type: 'thought', text: "You know what, screw it! I hate them all!" },
      ],
      [
        { type: 'paragraph', text: "I go back up the few steps." },
        { type: 'paragraph', text: "I go into my room." },
        { type: 'paragraph', text: "I get back into bed." },
        { type: 'paragraph', text: "I try to go back to sleep." },
        { type: 'thought', text: "Sometimes it is just not worth being awake. Sometimes it is just not worth being around." },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'What does Adam’s withdrawal signal about emotional safety and hopelessness?',
        'Which adults or systems should be activated immediately after this return home?',
        'How can student voice guide a safe next step?',
      ],
      writingPrompt: 'Draft a brief re-entry plan for the next school day centered on safety and connection.',
      insight: 'Shutdown and isolation can be warning signs of acute distress, not simply avoidance.',
      expandedInsight:
        'After assault, exhaustion, and repeated invalidation, Adam retreats to bed as a survival strategy. This moment calls for coordinated care, not silence.',
      facilitatorLens:
        'Ask participants to identify protective actions when a student communicates “it is not worth being awake.”',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'go_to_reflection',
        label: 'Reflection',
        resultTitle: 'The day ends here.',
        result: [
          { type: 'paragraph', text: 'There are no more choices in Adam’s day. Now it is time to reflect on what happened.' },
        ],
        metrics: { sleep: 0, stress: -3, time: -1, care: -3 },
        nextSceneId: 'scene_reflection_conference_room',
      },
      {
        id: 'go_to_no_exit_room',
        label: 'I want to get out',
        resultTitle: 'You try to escape the experience.',
        result: [
          { type: 'paragraph', text: 'You look for a way out.' },
        ],
        metrics: { sleep: 0, stress: 0, time: 0, care: 0 },
        nextSceneId: 'scene_no_exit_room',
      },
    ],
  },

  {
    id: 'scene_reflection_conference_room',
    sceneNumber: 20,
    totalScenes: 21,
    time: 'Reflection',
    heading: 'Conference Room for Discussion',
    revealGroups: [
      [
        { type: 'paragraph', text: "This section is for reflection purposes." },
        { type: 'paragraph', text: "There is no right or wrong answer, just an opportunity to think about this simulation experience." },
      ],
      [
        { type: 'paragraph', text: "Questions" },
        { type: 'paragraph', text: "How many adults failed this child throughout the day?" },
        { type: 'paragraph', text: "Which adults failed him purely by accident or simply because they thought they were just doing their job?" },
        { type: 'paragraph', text: "How do we fix those failures that were innocent in nature?" },
      ],
      [
        { type: 'paragraph', text: "Do you feel the child's reactions to the adults were justified? Why or why not?" },
        { type: 'paragraph', text: "Where in this simulation can the school do a better job?" },
        { type: 'paragraph', text: "What were you thinking throughout the simulation in terms of the school?" },
      ],
      [
        { type: 'paragraph', text: "What were your thoughts throughout the simulation in regards to the student?" },
        { type: 'paragraph', text: "Where does parental responsibility come into this scenario?" },
        { type: 'paragraph', text: "What do you see happening to this child the next day? Next month? 5 years from now?" },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'Which adult actions caused the most harm, and which were missed opportunities?',
        'Where could small relational moves have changed the trajectory?',
        'What systems changes would prevent this pattern for other students?',
      ],
      writingPrompt: 'Write two commitments: one personal practice change and one systems-level change.',
      insight: 'Sustainable improvement requires both individual adult reflection and structural redesign.',
      expandedInsight:
        'Adam’s day is not one bad choice; it is a network of adult assumptions, policy gaps, and unmet needs. Reflection should convert insight into concrete action.',
      facilitatorLens:
        'Use this scene to move from empathy to implementation with clear ownership and timelines.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'finish_reflection',
        label: 'Finish the reflection',
        resultTitle: 'Reflection complete.',
        result: [
          { type: 'paragraph', text: 'You have reached the end of Adam’s school day experience.' },
        ],
        metrics: { sleep: 0, stress: 0, time: 0, care: 0 },
        nextSceneId: 'scene_no_exit_room',
      },
    ],
  },
  {
    id: 'scene_no_exit_room',
    sceneNumber: 21,
    totalScenes: 21,
    time: 'No Exit',
    heading: 'You Cannot Leave Yet',
    revealGroups: [
      [
        { type: 'paragraph', text: "Many Urban children wish they could exit their lives in any way possible." },
        { type: 'paragraph', text: "One teacher who worked in a city school for three years had 4 suicides in their Middle School during his tenure." },
      ],
      [
        { type: 'paragraph', text: "A student once said that sometimes it would be better to be sent to jail just to get away from his current living conditions." },
        { type: 'paragraph', text: "You will continue." },
        { type: 'paragraph', text: "This is your only option because it is their only option." },
      ],
    ],
    question: 'What do you do?',
    reflection: {
      questions: [
        'What does “no exit” reveal about how students experience chronic stress systems?',
        'How can schools reduce despair and increase credible pathways to help?',
        'What protective factors can adults build immediately?',
      ],
      writingPrompt: 'Name one prevention strategy and one crisis-response strategy your team can implement now.',
      insight: 'When students feel trapped, safety planning and belonging interventions become urgent.',
      expandedInsight:
        'This scene highlights perceived entrapment—a major risk factor for harm. Adult teams must create visible, trusted exits through relationships, resources, and rapid response.',
      facilitatorLens:
        'Facilitate a concrete discussion on suicide prevention, connectedness, and follow-through.',
      manuscriptExcerpt: '[PASTE MANUSCRIPT EXCERPT HERE]',
    },
    choices: [
      {
        id: 'continue_only_option',
        label: 'Continue',
        resultTitle: 'You continue.',
        result: [
          { type: 'paragraph', text: 'There is no exit here. The experience continues.' },
        ],
        metrics: { sleep: 0, stress: 0, time: 0, care: 0 },
        nextSceneId: 'scene_reflection_conference_room',
      },
    ],
  },
];


const tocItems = [
  { id: 'scene_2am_bedroom', label: 'Intro / Start' },
  { id: 'scene_625am_bedroom', label: 'Morning Alarm' },
  { id: 'scene_morning_bus_stop', label: 'Bus Stop' },
  { id: 'scene_school_entrance', label: 'School Entrance' },
  { id: 'scene_technology_class', label: 'Technology Class' },
  { id: 'scene_technology_teacher_refusal', label: 'Technology Class — Teacher Refusal' },
  { id: 'scene_technology_computer_search', label: 'Technology Class — Computer Search' },
  { id: 'scene_main_office', label: 'Main Office' },
  { id: 'scene_second_period_math', label: 'Second Period Math Class' },
  { id: 'scene_cool_teacher', label: 'Looking for the One Teacher Who Cares' },
  { id: 'scene_hallway_internal_reflection', label: 'Hallway/Internal Reflection' },
  { id: 'scene_third_period_reading_class', label: '3rd Period Reading Class' },
  { id: 'scene_lunch_room', label: 'Lunch Room' },
  { id: 'scene_reading_class_trying_to_listen', label: 'Reading Class — Trying to Listen' },
  { id: 'scene_science_class', label: 'Science Class' },
  { id: 'scene_gym_class', label: 'Gym Class' },
  { id: 'scene_office_after_gym', label: 'Main Office — After Gym' },
  { id: 'scene_principal_consequence', label: 'In-School Suspension' },
  { id: 'scene_iss_breaking_point', label: 'ISS — Breaking Point' },
  { id: 'scene_bus_stop', label: 'Bus Stop' },
  { id: 'scene_back_in_bedroom', label: 'Back in His Bedroom' },
  { id: 'scene_reflection_conference_room', label: 'Reflection / Conference Room' },
  { id: 'scene_no_exit_room', label: 'No Exit Room' },
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
  const [revealedGroupCounts, setRevealedGroupCounts] = useState({ scene_2am_bedroom: 1, scene_625am_bedroom: 1, scene_morning_bus_stop: 1, scene_school_entrance: 1, scene_technology_class: 1 });
  const [cumulativeMetrics, setCumulativeMetrics] = useState(initialMetrics);
  const [showInsights, setShowInsights] = useState({});
  const [showSceneMenu, setShowSceneMenu] = useState(false);
  const [qaReport, setQaReport] = useState(null);

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

    const hadPreviousChoice = !!selectedChoices[scene.id];
    if (!hadPreviousChoice) {
      setCumulativeMetrics((prev) => {
        const nextMetrics = { ...prev };
        metricOrder.forEach((metric) => {
          nextMetrics[metric] = clampMetric((nextMetrics[metric] ?? 0) + (nextChoice.metrics?.[metric] ?? 0));
        });
        return nextMetrics;
      });
    }

    setSelectedChoices((prev) => ({ ...prev, [scene.id]: choiceId }));
  };

  const handleReset = () => {
    setSceneId('scene_2am_bedroom');
    setSelectedChoices({});
    setCumulativeMetrics(initialMetrics);
    setRevealedGroupCounts({ scene_2am_bedroom: 1, scene_625am_bedroom: 1, scene_morning_bus_stop: 1, scene_school_entrance: 1, scene_technology_class: 1 });
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

  const handleJumpToScene = (targetSceneId) => {
    if (!sceneById[targetSceneId]) return;
    setSceneId(targetSceneId);
    setSelectedChoices((prev) => {
      const nextChoices = { ...prev };
      delete nextChoices[targetSceneId];
      return nextChoices;
    });
    setRevealedGroupCounts((prev) => ({ ...prev, [targetSceneId]: 1 }));
    setShowInsights((prev) => ({ ...prev, [targetSceneId]: false }));
    setCumulativeMetrics((prev) => ({ ...initialMetrics, ...(prev ?? {}) }));
    setShowSceneMenu(false);
  };
  const runQaCheck = () => {
    const errors = [];
    const warnings = [];
    const passedChecks = [];

    errors.push(`Scene Count: ${urbanStudentScenes.length}`);

    const missingTargets = [];
    const scenesWithNoChoices = [];
    const scenesMissingReflection = [];
    const scenesMissingToc = [];
    const missingMetrics = [];
    const invalidSceneShape = [];
    const invalidReflectionShape = [];

    urbanStudentScenes.forEach((currentScene) => {
      const hasStandardRevealGroups = Array.isArray(currentScene.revealGroups) && currentScene.revealGroups.length > 0;
      const has625BedroomRevealShape = currentScene.id === 'scene_625am_bedroom'
        && currentScene.introByPreviousChoice
        && Array.isArray(currentScene.coreRevealGroups)
        && currentScene.coreRevealGroups.length > 0;

      if (!currentScene.id || !currentScene.heading || !(hasStandardRevealGroups || has625BedroomRevealShape) || !currentScene.question || !Array.isArray(currentScene.choices)) {
        invalidSceneShape.push(currentScene.id || '(missing id)');
      }

      if (!Array.isArray(currentScene.choices) || currentScene.choices.length === 0) {
        if (currentScene.id !== 'scene_placeholder_end') scenesWithNoChoices.push(currentScene.id);
      }

      if (!currentScene.reflection) {
        scenesMissingReflection.push(currentScene.id);
      } else {
        const reflection = currentScene.reflection;
        const hasReflectionShape = Array.isArray(reflection.questions)
          && typeof reflection.writingPrompt === 'string'
          && typeof reflection.insight === 'string'
          && typeof reflection.facilitatorLens === 'string'
          && typeof reflection.manuscriptExcerpt === 'string';

        if (!hasReflectionShape) invalidReflectionShape.push(currentScene.id);
      }

      (currentScene.choices ?? []).forEach((choice) => {
        if (choice.nextSceneId && !sceneById[choice.nextSceneId]) missingTargets.push(`${currentScene.id} -> ${choice.nextSceneId}`);

        const hasMetrics = choice.metrics
          && Object.prototype.hasOwnProperty.call(choice.metrics, 'sleep')
          && Object.prototype.hasOwnProperty.call(choice.metrics, 'stress')
          && Object.prototype.hasOwnProperty.call(choice.metrics, 'time')
          && Object.prototype.hasOwnProperty.call(choice.metrics, 'care');

        if (!hasMetrics) missingMetrics.push(`${currentScene.id} / ${choice.id}`);
      });

      const inToc = tocItems.some((entry) => entry.id === currentScene.id);
      if (!inToc) scenesMissingToc.push(currentScene.id);
    });

    const tocCounts = tocItems.reduce((acc, entry) => {
      acc[entry.id] = (acc[entry.id] ?? 0) + 1;
      return acc;
    }, {});
    const duplicateTocTargets = Object.entries(tocCounts).filter(([, count]) => count > 1).map(([id, count]) => `${id} (${count})`);

    if (missingTargets.length) errors.push(`Missing scene targets: ${missingTargets.join(', ')}`);
    else passedChecks.push('Missing Scene Targets: none');

    if (invalidSceneShape.length) errors.push(`Basic scene shape issues: ${invalidSceneShape.join(', ')}`);
    else passedChecks.push('Basic Scene Shape: all scenes valid');

    if (missingMetrics.length) errors.push(`Missing metrics fields: ${missingMetrics.join(', ')}`);
    else passedChecks.push('Scenes Missing Metrics: all choices include sleep/stress/time/care');

    if (scenesWithNoChoices.length) warnings.push(`Scenes with no choices: ${scenesWithNoChoices.join(', ')}`);
    else passedChecks.push('Scenes With No Choices: none');

    if (scenesMissingReflection.length) warnings.push(`Scenes missing reflection: ${scenesMissingReflection.join(', ')}`);
    else passedChecks.push('Scenes Missing Reflection: none');

    if (invalidReflectionShape.length) warnings.push(`Reflection shape issues: ${invalidReflectionShape.join(', ')}`);
    else passedChecks.push('Reflection Shape: valid where reflection exists');

    if (scenesMissingToc.length) warnings.push(`Developer menu coverage missing scene ids: ${scenesMissingToc.join(', ')}`);
    else passedChecks.push('Developer Menu Coverage: complete');

    if (duplicateTocTargets.length) warnings.push(`Duplicate TOC targets: ${duplicateTocTargets.join(', ')}`);
    else passedChecks.push('Duplicate TOC Targets: none');

    setQaReport({ errors, warnings, passedChecks, generatedAt: new Date().toISOString() });
  };


  if (sceneId === 'scene_placeholder_end') {
    return <main className="urban-student-page"><section className="experience-shell"><article className="scene-card"><h1>Next scene not built yet.</h1><p className="paragraph-card">This path will continue from the uploaded script.</p></article></section></main>;
  }

  const changedMetrics = metricOrder
    .map((metric) => [metric, selectedChoice?.metrics?.[metric] ?? 0])
    .filter(([, value]) => value !== 0);
  const hasAnyChoiceSelected = Object.keys(selectedChoices).length > 0;
  const hasReflection = Boolean(scene.reflection?.questions?.length);

  return (
    <main className="urban-student-page">
      <section className="experience-shell">
        <article className="scene-card">
          <button
            type="button"
            className="dev-menu-trigger"
            onClick={() => setShowSceneMenu((prev) => !prev)}
          >
            Jump to Scene
          </button>
          <button type="button" className="dev-menu-trigger qa-trigger" onClick={runQaCheck}>Run QA Check</button>
          <header className="scene-header">
            <div className="tone-band" />
            <p>{scene.time}</p>
            <h1>{scene.heading}</h1>
            <p>Scene {scene.sceneNumber} of {scene.totalScenes}</p>
          </header>
          {qaReport && (
            <section className="qa-panel" aria-live="polite">
              <p className="section-label">DEV QA REPORT</p>
              <p className="qa-timestamp">Generated: {qaReport.generatedAt}</p>
              <div className="qa-grid">
                <div>
                  <h3>Errors</h3>
                  {qaReport.errors.length ? <ul>{qaReport.errors.map((item) => <li key={`err-${item}`}>{item}</li>)}</ul> : <p>None</p>}
                </div>
                <div>
                  <h3>Warnings</h3>
                  {qaReport.warnings.length ? <ul>{qaReport.warnings.map((item) => <li key={`warn-${item}`}>{item}</li>)}</ul> : <p>None</p>}
                </div>
                <div>
                  <h3>Passed Checks</h3>
                  {qaReport.passedChecks.length ? <ul>{qaReport.passedChecks.map((item) => <li key={`pass-${item}`}>{item}</li>)}</ul> : <p>None</p>}
                </div>
              </div>
            </section>
          )}
          <p className="section-label">THE MOMENT</p>
          <div className="scene-content">{visibleGroups.map((group, index) => <div key={`group-${index}`} className="scene-group">{renderBlocks(group)}</div>)}</div>
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
              {changedMetrics.length > 0 && <div className="impact-section"><p className="section-label">IMMEDIATE IMPACT</p><div className="impact-row">{changedMetrics.map(([key, value]) => <span key={key} className={`impact-pill ${value > 0 ? (key === 'care' ? 'impact-positive-care' : 'impact-positive') : 'impact-negative'}`}>{metricConfig[key].label} {value > 0 ? `+${value}` : value}</span>)}</div></div>}
              {hasAnyChoiceSelected && <div className="metrics-stack" aria-label="Cumulative load across all choices">
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
              {hasReflection && (
                <details className="reflect-panel"><summary><div><p className="reflect-title">Pause & Reflect</p><p className="reflect-subtitle">Adult learning layer</p></div><span className="reflect-indicator">+</span></summary><div className="reflect-content"><p className="reflect-content-label">Reflection Questions</p><ul>{scene.reflection.questions.map((question) => <li key={question}>{question}</li>)}</ul><p className="writing-prompt"><strong>Writing Prompt</strong></p><p>{scene.reflection.writingPrompt}</p><textarea placeholder="Type your reflection here..." rows={4} /><div className="facilitator-lens"><p><strong>Facilitator Lens</strong></p><p>{scene.reflection.insight}</p>{scene.reflection.expandedInsight && <p>{scene.reflection.expandedInsight}</p>}{scene.reflection?.facilitatorLens && <p className="lens-prompt">{scene.reflection.facilitatorLens}</p>}</div><button type="button" className="insight-toggle" onClick={() => setShowInsights((prev) => ({ ...prev, [scene.id]: !prev[scene.id] }))}>Read Manuscript Excerpt</button>{showInsights[scene.id] && scene.reflection?.manuscriptExcerpt && <div className="insight-panel"><p className="insight-heading">From the Manuscript</p><p className="insight-subheading">Extended reading for facilitators, teachers, and discussion leaders</p><p className="insight-note">This reading is optional and can be used for discussion, journaling, or facilitator-led reflection.</p><p className="manuscript-text">{scene.reflection.manuscriptExcerpt}</p></div>}</div></details>
              )}
              <button type="button" className="continue-button" onClick={handleContinue}>Continue</button>
              <button type="button" className="reset-button" onClick={handleReset}>Reset / Start Over</button>
            </section>
          )}
        </article>
      </section>

      {showSceneMenu && (
        <aside className="scene-menu-overlay" role="dialog" aria-modal="true" aria-label="Developer scene navigation menu">
          <div className="scene-menu-panel">
            <div className="scene-menu-header">
              <p className="scene-menu-dev-label">DEV</p>
              <h2>Scene Menu</h2>
              <button type="button" className="scene-menu-close" onClick={() => setShowSceneMenu(false)}>Close</button>
            </div>
            <p className="scene-menu-help">Testing utility: jump directly to any implemented scene.</p>
            <div className="scene-menu-list" role="list">
              {tocItems.map((entry, index) => (
                <button key={`${entry.id}-${index}`} type="button" className="scene-menu-item" onClick={() => handleJumpToScene(entry.id)} role="listitem">
                  <span>Scene {index + 1}</span>
                  <strong>{entry.label}</strong>
                  <small>{entry.id}</small>
                </button>
              ))}
            </div>
          </div>
        </aside>
      )}

      <style jsx>{`
        .urban-student-page { min-height: 100vh; background: #0b1120; color: #fff; padding: 3rem 1rem; }
        .experience-shell { max-width: 900px; margin: 0 auto; }
        .scene-card { background: #fbfdff; color: #0f172a; border-radius: 24px; padding: 36px; max-width: 860px; margin: 0 auto; box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22); display: grid; gap: 1.2rem; }
        .dev-menu-trigger { position: sticky; top: 8px; z-index: 5; margin: 0 0 6px auto; width: auto; border: 1px solid #94a3b8; border-radius: 999px; padding: 8px 12px; font-size: 0.82rem; background: #f8fafc; color: #0f172a; text-transform: uppercase; letter-spacing: 0.04em; }
        .qa-trigger { margin-top: 0; }
        .qa-panel { border: 1px solid #cbd5e1; border-radius: 14px; padding: 14px; background: #f8fafc; }
        .qa-timestamp { margin: 0 0 10px; color: #475569; font-size: 0.82rem; }
        .qa-grid { display: grid; gap: 10px; }
        .qa-grid h3 { margin: 0 0 6px; font-size: 0.95rem; }
        .qa-grid ul { margin: 0; padding-left: 18px; display: grid; gap: 4px; }

        .metrics-stack { display: grid; gap: 12px; background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); border: 1px solid #d8e0ea; border-radius: 18px; padding: 18px; margin-top: 18px; }
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
        .scene-content { max-width: 720px; display: grid; gap: 0.35rem; }
        .scene-group { margin-bottom: 0.65rem; padding-bottom: 0.2rem; border-bottom: 1px solid rgba(148, 163, 184, 0.22); }
        .scene-group:last-child { border-bottom: none; margin-bottom: 0; }
        .paragraph-card { margin: 0 0 18px; color: #24324a; font-size: 1.08rem; line-height: 1.9; letter-spacing: 0.005em; }
        .thought-wrap { margin: 22px 0; max-width: 720px; }
        .thought-label { margin: 0 0 8px; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.12em; color: #334155; font-style: normal !important; font-weight: 900; }
        .thought-card { background: #eef4ff; border-left: 7px solid #1e3a8a; color: #0f172a; font-style: italic !important; font-size: 1.08rem; font-weight: 700; border-radius: 16px; padding: 18px 22px; margin: 24px 0; line-height: 1.65; box-shadow: 0 8px 24px rgba(30, 58, 138, 0.08); }
        button { display: block; width: 100%; background: #fff; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 14px; padding: 14px 16px; margin-top: 10px; text-align: left; font-weight: 600; cursor: pointer; }
        .continue-moment, .continue-button { text-align: center; background: #0f172a; color: #fff; }
        .reset-button { text-align: center; background: #334155; color: #fff; }
        .selected-pill { margin: 0 0 12px; display: inline-block; background: #334155; color: #fff; border-radius: 999px; padding: 8px 12px; }
        .result-card { background: #fff; border: 1px solid #cbd5e1; border-radius: 18px; padding: 22px; }
        .impact-section { margin-top: 16px; background: #f8fafc; border: 1px solid #d8e0ea; border-radius: 16px; padding: 14px; }
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
        .reflect-content { margin-top: 14px; border-top: 1px solid #d8e0ea; padding-top: 14px; }
        .reflect-content-label { margin: 0 0 8px; color: #334155; font-size: 0.76rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em; }
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
        .scene-menu-overlay { position: fixed; inset: 0; background: rgba(2, 6, 23, 0.55); display: grid; place-items: center; padding: 1rem; z-index: 50; }
        .scene-menu-panel { width: min(640px, 100%); max-height: 85vh; overflow: auto; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 18px; padding: 16px; color: #0f172a; }
        .scene-menu-header { display: flex; align-items: center; gap: 10px; }
        .scene-menu-header h2 { margin: 0; }
        .scene-menu-dev-label { margin: 0; padding: 3px 8px; border-radius: 999px; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em; background: #fee2e2; color: #b91c1c; }
        .scene-menu-close { margin: 0 0 0 auto; width: auto; text-align: center; }
        .scene-menu-help { margin: 8px 0 12px; color: #475569; font-size: 0.9rem; }
        .scene-menu-list { display: grid; gap: 8px; max-height: 60vh; overflow: auto; padding-right: 4px; }
        .scene-menu-item { margin: 0; background: #fff; border: 1px solid #cbd5e1; border-radius: 12px; text-align: left; padding: 12px 14px; display: grid; gap: 2px; }
        .scene-menu-item:hover { border-color: #64748b; background: #f1f5f9; }
        .scene-menu-item span { display: block; font-size: 0.78rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px; }
        .scene-menu-item strong { font-size: 1rem; color: #0f172a; }
        .scene-menu-item small { font-size: 0.75rem; color: #64748b; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
      `}</style>
    </main>
  );
}
