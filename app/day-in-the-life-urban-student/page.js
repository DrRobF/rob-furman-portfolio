'use client';

import { useMemo, useState } from 'react';

const scenes = {
  introLobby: {
    id: 'introLobby',
    title: 'Lobby',
    timeLocation: 'Intro · Lobby',
    narrative:
      'You are Adam. You are about to move through a day shaped by stress, pressure, and split-second decisions.',
    choices: [{ label: 'Enter the night before school', next: 'bedroomNightToMorning' }],
  },
  bedroomNightToMorning: {
    id: 'bedroomNightToMorning',
    title: 'Bedroom',
    timeLocation: '2:00 AM → Morning · Bedroom',
    narrative:
      'It is 2:00 AM. Adam is still awake in his bedroom. Home is loud. Sleep is thin. Morning is coming fast.',
    choices: [{ label: 'Continue', next: 'morningChoice' }],
  },
  morningChoice: {
    id: 'morningChoice',
    title: 'Morning Choice',
    timeLocation: 'Morning · Home',
    narrative:
      'The alarm goes off. Adam has a decision to make before school.',
    choices: [
      { label: 'Snooze', next: 'snoozePath' },
      { label: 'Get up', next: 'getUpPath' },
    ],
  },
  snoozePath: {
    id: 'snoozePath',
    title: 'Snooze Path',
    timeLocation: 'Morning · Home',
    narrative:
      "Adam snoozes. He wakes again to conflict in the apartment involving his mother's boyfriend. Time is almost gone.",
    choices: [{ label: 'Leave for the bus stop', next: 'busStop' }],
  },
  getUpPath: {
    id: 'getUpPath',
    title: 'Get Up Path',
    timeLocation: 'Morning · Home',
    narrative: 'Adam gets up immediately, moving quickly to leave before things escalate at home.',
    choices: [{ label: 'Leave for the bus stop', next: 'busStop' }],
  },
  busStop: {
    id: 'busStop',
    title: 'Bus Stop',
    timeLocation: 'Morning · Bus Stop',
    narrative:
      'At the bus stop, Adam is running on almost no sleep and carrying what happened at home into the school day.',
    reflection:
      'Adam is not making this choice in a calm moment.\nHe is tired, hurt, afraid to go back home, and out of time.\nThe harm he causes is real — but so is the chain of events that brought him there.',
    choices: [{ label: 'Go to school entrance', next: 'schoolEntrance' }],
  },
  schoolEntrance: {
    id: 'schoolEntrance',
    title: 'School Entrance',
    timeLocation: 'Morning · School Entrance',
    narrative:
      'Adam arrives at the school entrance carrying exhaustion, fear, and urgency from the morning.',
    choices: [{ label: 'Go to technology class', next: 'technologyClass' }],
  },
  technologyClass: {
    id: 'technologyClass',
    title: 'Technology Class',
    timeLocation: 'Class Period · Technology Class',
    narrative:
      'In technology class, Adam needs to check whether his mother and baby sister are safe, but class expectations are moving forward.',
    choices: [{ label: 'Respond in class', next: 'technologyConflict' }],
  },
  technologyConflict: {
    id: 'technologyConflict',
    title: 'Technology Conflict',
    timeLocation: 'Class Period · Technology Class',
    narrative:
      'The conflict escalates. Adam is referred to the office after reacting in class.',
    reflection:
      'Adam was not trying to avoid work.\nHe was trying to find out whether his mother and baby sister were safe.\nThe teacher responded to the rule.\nAdam was reacting to what he believed was happening at home.',
    choices: [{ label: 'Restart experience', next: 'introLobby' }],
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
  'technologyConflict',
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
          <p className="scene-narrative">{scene.narrative}</p>

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

        <p className="scene-index">
          Scene {sceneOrder.indexOf(scene.id) + 1} of {sceneOrder.length}
        </p>
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
          opacity: 0.85;
        }

        h1 {
          margin: 0;
          font-size: clamp(1.75rem, 2.6vw, 2.35rem);
          line-height: 1.2;
        }

        .scene-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 14px;
          padding: 2rem;
          display: grid;
          gap: 1rem;
        }

        .scene-meta {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        h2 {
          margin: 0;
          font-size: 1.4rem;
        }

        .scene-narrative {
          margin: 0;
          line-height: 1.7;
          white-space: pre-line;
        }

        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding-top: 0.5rem;
        }

        button {
          border: 1px solid rgba(255, 255, 255, 0.28);
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff;
          border-radius: 10px;
          padding: 0.72rem 1rem;
          cursor: pointer;
          font-size: 0.95rem;
        }

        button:hover {
          background: rgba(255, 255, 255, 0.14);
        }

        .reflection-card {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          display: grid;
          gap: 0.5rem;
        }

        .reflection-card p {
          margin: 0;
          line-height: 1.55;
        }

        .scene-index {
          margin: 0;
          opacity: 0.75;
          font-size: 0.9rem;
        }
      `}</style>
    </main>
  );
}
