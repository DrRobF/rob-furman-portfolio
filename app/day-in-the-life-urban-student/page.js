'use client';

import { useMemo, useState } from 'react';

const scenes = {
  introLobby: {
    id: 'introLobby',
    title: 'Lobby',
    timeLocation: 'Intro · Lobby',
    narrative: [
      'You are Adam. This simulation follows the same sequence of events from the Urban Student manuscript, beginning before sunrise and continuing through first period at school.',
      'As you move scene by scene, you will experience the choices and pressures exactly as they build across the morning: exhaustion, fear for family, missed time, and school responses that do not match what Adam is carrying internally.',
    ],
    choices: [{ label: 'Enter the bedroom scene at 2:00 AM.', next: 'bedroomNightToMorning' }],
  },
  bedroomNightToMorning: {
    id: 'bedroomNightToMorning',
    title: 'Bedroom at 2:00 AM',
    timeLocation: '2:00 AM · Adam\'s Bedroom',
    narrative: [
      'It is 2:00 AM and Adam is still awake. The apartment is not calm. Noise from home keeps cutting through the night, and he cannot get real sleep before school.',
      'He listens for what is happening with his mother and baby sister in the other room. Instead of resting, he stays alert, worried, and tense while the clock keeps moving toward morning.',
    ],
    choices: [{ label: 'Continue to 6:25 AM.', next: 'morningChoice' }],
  },
  morningChoice: {
    id: 'morningChoice',
    title: 'Morning Decision',
    timeLocation: '6:25 AM · Home',
    narrative: [
      'At 6:25 AM, Adam has barely slept. The night noise and stress are still in his body, and he knows he has to decide immediately what to do next.',
      'He can try to grab a few more minutes of sleep and risk missing time, or get up right now and push through the morning while exhausted.',
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
      'Adam chooses ten more minutes because he is exhausted. When he wakes again, the situation at home is louder and more chaotic, including conflict involving his mother\'s boyfriend.',
      'His fear for his mother and baby sister spikes, and now he is behind schedule. He does not feel safe going deeper into what is happening in the apartment, but he also cannot afford to miss school.',
    ],
    choices: [{ label: 'Get ready and get to the bus stop.', next: 'busStop' }],
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
