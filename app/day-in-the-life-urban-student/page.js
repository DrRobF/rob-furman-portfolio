'use client';

import { useMemo, useState } from 'react';

const scenes = {
  introLobby: {
    id: 'introLobby',
    title: 'Intro',
    timeLocation: 'Intro',
    narrative: [
      'This simulation will take you step by step in the day in the life of an urban student.',
      'All events in this "day" are real and have happened in the day of an Urban Child. Teachers and administrators have come together to discuss their Urban experiences. This simulation was created based on stories and discussions shared with the staff from by various urban students in and around the Pittsburgh PA region. Some concepts in this simulation may be disturbing... but real.',
    ],
    choices: [{ label: 'Continue to Bedroom / 2:00 AM.', next: 'bedroomNightToMorning' }],
  },
  bedroomNightToMorning: {
    id: 'bedroomNightToMorning',
    title: '2:00 AM · Adam's Bedroom',
    timeLocation: '2:00 AM · Adam's Bedroom',
    narrative: [
      'It's 2:00 AM.',
      'You're still awake.',
      'Laughter cuts through the floor again—your mom and her boyfriend.',
      'It's been going on for hours. Since he showed up.',
      'You keep your eyes closed. Doesn't matter.',
      'You're not even close to asleep.',
      'Beside you, your baby sister doesn't move.',
      'How is she still asleep? How do you not wake up to this?',
      'You shift under the blanket. The mattress creaks.',
      'The laughter gets louder.',
      'You check the clock. 2:07.',
      'You have to be up at 6.',
      'Four hours. No… less than that. I'm gonna be dead tomorrow.',
      'You pull the blanket over your head. It muffles it—barely.',
      'Another burst of laughter. Your jaw tightens.',
      'Why does this always happen on school nights? Why doesn't she care? If I say something… it's just gonna get worse.',
      'You turn toward your sister again. Still asleep.',
      'You stare at the ceiling. Wide awake.',
    ],
    choices: [
      { label: 'Put the pillow over your head and try to block it out.', next: 'morningChoice' },
      { label: 'Get up and ask them to be quiet.', next: 'morningChoice' },
      { label: 'Check on your sister.', next: 'morningChoice' },
      { label: 'Grab your phone and distract yourself.', next: 'morningChoice' },
    ],
  },
  morningChoice: {
    id: 'morningChoice',
    title: 'Morning Decision',
    timeLocation: '6:25 AM · Home',
    narrative: [
      'You heard your alarm go off twice so far. The snooze alarm is a great thing… 10 extra minutes. You start to weigh your options in your half dream state. You can get up, get dressed and get to the Port Authority Bus stop so you will not be late to school or you can hit that snooze just one more time. You try to remember the bus schedule wondering if you can hit it for ten more minutes and still make the last run. As you go in and out of sleep you try to remember where you put your school issued bus pass.',
    ],
    choices: [
      {
        label: 'I need ten more minutes sleep. I am pretty sure I can still make the next bus run.',
        next: 'snoozePath',
      },
      {
        label: 'I will get up now and get ready for school.',
        next: 'getUpPath',
      },
    ],
  },
  snoozePath: {
    id: 'snoozePath',
    title: 'Snooze Path / Boyfriend Incident',
    timeLocation: 'Morning · Home',
    narrative: [
      'As you silence your alarm using the beautiful snooze button, you start to hear movement downstairs and assume it is your mom getting up for work. She works a 12 hour shift today and may even need to double out. In your half asleep state of mind you think it will be a long night at home without her. The noise starts to get a bit louder downstairs and it sounds like arguing. You assume that the boyfriend from last night must have stayed over. Your first thought is that you made a bad decision hitting that snooze so many times because now you are stuck up stairs until this argument is over. if you go down stairs it may only get worse for your mom or even you. As you slowly start to get out of the bed you hear the arguing getting louder and closer and you hear your name mentioned a few times. This is not good. Suddenly your bedroom door bursts open and the boyfriend comes flying into the room and yanks you off the bed. Your head hits the bed post on your way down to hit the floor. You hear screaming from both the boyfriend and your mom. Typical, your mom is screaming but not actually stopping him. The boyfriend is screaming about having only one day to sleep in and my alarm. Your head hurts where it hit the bed post and you don\'t really care what the boyfriend is saying. What was his name anyhow? You sit on the floor until the shouting is over and they leave your room.',
    ],
    choices: [
      { label: 'Get ready and get to the bus stop', next: 'busStop' },
      { label: 'I have had enough. This is too much.', next: 'teacherRefusal' },
    ],
  },
  getUpPath: {
    id: 'getUpPath',
    title: 'Get Ready / Leave House Path',
    timeLocation: 'Morning · Home',
    narrative: [
      'Adam gets up immediately and gets ready for school while carrying the same worry from overnight. He is moving fast, trying to stay focused even though he is exhausted.',
      'He leaves home without feeling settled. The concern about his mother and baby sister stays with him as he heads out to catch transportation.',
    ],
    choices: [{ label: 'Get ready and get to the bus stop.', next: 'busStop' }],
  },
  busStop: {
    id: 'busStop',
    title: 'Bus Stop',
    timeLocation: 'Morning · Bus Stop',
    narrative: [
      'At the bus stop, Adam realizes he forgot his backpack and his bus pass. He is already late, emotionally overloaded, and afraid to go back to the apartment because of what was happening there.',
      'A younger child nearby has a bus pass. Adam takes the younger child\'s pass because he feels out of options, out of time, and too afraid to return home.',
    ],
    reflection:
      'Adam is not making this choice in a calm moment.\nHe is tired, hurt, afraid to go back home, and out of time.\nThe harm he causes is real — but so is the chain of events that brought him there.',
    choices: [{ label: 'Click here to arrive at school.', next: 'schoolEntrance' }],
  },
  schoolEntrance: {
    id: 'schoolEntrance',
    title: 'School Entrance',
    timeLocation: 'Morning · School Entrance',
    narrative: [
      'Adam arrives at school carrying the entire morning with him: almost no sleep, fear from home, and the pressure of the decision he made at the bus stop.',
      'From the outside he has made it to school. Internally, he is still trying to figure out whether his family is safe.',
    ],
    choices: [{ label: 'Go to technology class.', next: 'technologyClass' }],
  },
  technologyClass: {
    id: 'technologyClass',
    title: 'Technology Class',
    timeLocation: 'First Period · Technology Class',
    narrative: [
      'In technology class, Adam is not trying to play games and he is not trying to avoid work. He has heard that police were called near his home, and he needs to check the news immediately.',
      'He is focused on one urgent question: did something happen to his mother or baby sister?',
    ],
    choices: [
      { label: 'Tell the teacher about your experience at home.', next: 'teacherRefusal' },
      { label: 'Go get on the computer.', next: 'teacherRefusal' },
    ],
  },
  teacherRefusal: {
    id: 'teacherRefusal',
    title: 'Teacher Refusal / Internet News Concern',
    timeLocation: 'First Period · Technology Class',
    narrative: [
      'Adam explains why he needs internet access right now and tries to communicate the seriousness of what he heard. The teacher responds by reinforcing the computer lab rule and directs him back to the assigned activity.',
      'Adam\'s core concern is not acknowledged. He feels ignored and blocked from finding out whether his mother and baby sister are safe, and his frustration escalates quickly.',
    ],
    choices: [
      { label: 'I have had enough. This is too much.', next: 'officeReferral' },
      { label: 'Go to the office.', next: 'officeReferral' },
    ],
  },
  officeReferral: {
    id: 'officeReferral',
    title: 'Office Referral Moment',
    timeLocation: 'First Period · Hallway / Office',
    narrative: [
      'The interaction in class breaks down and Adam is referred out of the room. From the school perspective, the incident is a behavior escalation.',
      'From Adam\'s perspective, he was trying to check whether something serious happened at home and felt shut down when he asked for help. The moment ends with removal to the office.',
    ],
    reflection:
      'Adam was not trying to avoid work.\nHe was trying to find out whether his mother and baby sister were safe.\nThe teacher responded to the rule.\nAdam was reacting to what he believed was happening at home.',
    choices: [{ label: 'Start over from the lobby.', next: 'introLobby' }],
  },
};

const sceneOrder = [
  'introLobby',
  'bedroomNightToMorning',
  'morningChoice',
  'snoozePath',
  'getUpPath',
  'busStop',
  'schoolEntrance',
  'technologyClass',
  'teacherRefusal',
  'officeReferral',
];

export default function DayInTheLifeUrbanStudentPage() {
  const [sceneId, setSceneId] = useState('introLobby');

  const scene = useMemo(() => scenes[sceneId] ?? scenes.introLobby, [sceneId]);

  return (
    <main className="urban-student-page">
      <div className="experience-shell">
        <p className="prototype-label">Prototype Experience</p>
        <h1>A Day in the Life of an Urban Student</h1>

        <article className="scene-card" aria-live="polite">
          <p className="scene-meta">{scene.timeLocation}</p>
          <h2>{scene.title}</h2>
          <div className="scene-narrative">
            {scene.narrative.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="button-group">
            {scene.choices.map((choice) => (
              <button key={choice.label} type="button" onClick={() => setSceneId(choice.next)}>
                {choice.label}
              </button>
            ))}
          </div>
        </article>

        {scene.reflection ? (
          <aside className="reflection-card" aria-live="polite">
            {scene.reflection.split('\n').map((line) => (
              <p key={line}>{line}</p>
            ))}
          </aside>
        ) : null}

        <div className="footer-row">
          <p className="scene-index">
            Scene {sceneOrder.indexOf(scene.id) + 1} of {sceneOrder.length}
          </p>
          <button type="button" className="reset-button" onClick={() => setSceneId('introLobby')}>
            Reset / Start Over
          </button>
        </div>
      </div>

      <style jsx>{`
        .urban-student-page {
          min-height: 100vh;
          background: #0b1120;
          color: #ffffff;
          display: flex;
          justify-content: center;
          padding: 4rem 1.25rem;
        }

        .experience-shell {
          width: 100%;
          max-width: 840px;
          display: grid;
          gap: 1.5rem;
        }

        .prototype-label {
          margin: 0;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #d1d5db;
        }

        h1 {
          margin: 0;
          font-size: clamp(1.75rem, 2.6vw, 2.35rem);
          line-height: 1.2;
          color: #ffffff;
        }

        .scene-card {
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 14px;
          padding: 2rem;
          display: grid;
          gap: 1rem;
        }

        .scene-meta {
          margin: 0;
          font-size: 0.9rem;
          color: #d1d5db;
        }

        h2 {
          margin: 0;
          font-size: 1.4rem;
          color: #ffffff;
        }

        .scene-narrative {
          display: grid;
          gap: 0.85rem;
        }

        .scene-narrative p {
          margin: 0;
          line-height: 1.7;
          color: #ffffff;
        }

        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding-top: 0.5rem;
        }

        button {
          border: 1px solid #374151;
          background: #1f2937;
          color: #ffffff;
          border-radius: 10px;
          padding: 0.72rem 1rem;
          cursor: pointer;
          font-size: 0.95rem;
        }

        button:hover {
          background: #374151;
        }

        .reflection-card {
          background: #111827;
          border: 1px solid #374151;
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          display: grid;
          gap: 0.5rem;
        }

        .reflection-card p {
          margin: 0;
          line-height: 1.55;
          color: #d1d5db;
        }

        .footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .scene-index {
          margin: 0;
          color: #d1d5db;
          font-size: 0.9rem;
        }

        .reset-button {
          background: transparent;
          border-color: #4b5563;
        }

        .reset-button:hover {
          background: #1f2937;
        }
      `}</style>
    </main>
  );
}
