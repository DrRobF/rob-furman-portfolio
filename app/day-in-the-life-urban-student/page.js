'use client';

import { useMemo, useState } from 'react';

const scenes = [
  {
    id: 1,
    title: 'Intro / Lobby',
    time: '6:40 PM · Evening Orientation',
    mood: 'Quiet, anticipatory, and reflective.',
    narrative:
      "You are stepping into Adam's day. This prototype follows moments where stress, support, and missed opportunities shape what learning feels like.",
    choices: [{ label: 'Start Adam\'s Night', nextScene: 2 }],
  },
  {
    id: 2,
    title: 'Bedroom at Night',
    time: '10:52 PM · Home',
    mood: 'Crowded, tired, and unsettled.',
    narrative:
      'Adam is trying to finish homework while noise moves through the apartment. His phone battery is low, his younger sibling needs help, and sleep is already slipping away.',
    reflection: {
      whatHappened:
        'Basic needs are unstable. Rest, space, and predictable routines are not guaranteed before the school day even begins.',
      educator:
        'When students arrive tired or unprepared, it may signal unmet needs rather than low motivation. Curiosity can open doors that judgment closes.',
    },
    choices: [
      { label: 'Stay up to finish work', nextScene: 3 },
      { label: 'Sleep now and try in the morning', nextScene: 3 },
    ],
  },
  {
    id: 3,
    title: 'Morning Decision',
    time: '6:08 AM · Kitchen',
    mood: 'Rushed, tense, and uncertain.',
    narrative:
      'Breakfast is limited and the bus timing is tight. Adam can grab food and risk being late, or leave quickly and make it on time but hungry.',
    choices: [
      { label: 'Grab quick food, risk lateness', nextScene: 4 },
      { label: 'Skip food, run for the bus', nextScene: 4 },
    ],
  },
  {
    id: 4,
    title: 'Bus Stop',
    time: '7:02 AM · Neighborhood Corner',
    mood: 'Alert, exposed, and watchful.',
    narrative:
      'At the stop, older youth are arguing nearby. Adam keeps scanning the street while checking the time. Stress is rising before first period starts.',
    reflection: {
      whatHappened:
        'Safety concerns trigger survival thinking. The body shifts toward fight-or-flight long before a student enters a classroom.',
      educator:
        'Safety comes before academic risk-taking. Calm transitions, warm greetings, and clear routines can help students re-regulate.',
    },
    choices: [
      { label: 'Stay quiet and avoid attention', nextScene: 5 },
      { label: 'Move farther down the block', nextScene: 5 },
    ],
  },
  {
    id: 5,
    title: 'School Entrance',
    time: '7:43 AM · Front Doors',
    mood: 'Crowded, procedural, and pressured.',
    narrative:
      'Security and hallway traffic create a bottleneck. Adam is stopped for a uniform detail and enters class already embarrassed and behind.',
    choices: [{ label: 'Push through to first class', nextScene: 6 }],
  },
  {
    id: 6,
    title: 'Technology Class',
    time: '9:16 AM · Room 204',
    mood: 'Public, fast-paced, and fragile.',
    narrative:
      'A device issue prevents Adam from logging in. Instructions move on quickly. A comment from a peer lands hard, and Adam shuts down instead of asking for help.',
    reflection: {
      whatHappened:
        'Learning access is interrupted by technical barriers and social pressure. Small breakdowns compound when support is delayed.',
      educator:
        'Connection before correction matters. Brief check-ins and private redirection can prevent public stress from becoming disengagement.',
    },
    choices: [
      { label: 'Put head down and disengage', nextScene: 7 },
      { label: 'Ask for help quietly', nextScene: 7 },
    ],
  },
  {
    id: 7,
    title: 'Office Breakdown / Missed Support Moment',
    time: '11:02 AM · Main Office Hallway',
    mood: 'Overloaded, visible, and misunderstood.',
    narrative:
      'After being sent out, Adam waits near the office. Several adults pass with urgency. No one pauses long enough to ask what happened beneath the behavior.',
    reflection: {
      whatHappened:
        'A key intervention point is missed. Behavior is addressed, but underlying stress signals and support needs remain unresolved.',
      educator:
        'Early adult intervention can redirect a day. Naming emotion, offering regulation options, and preserving dignity can rebuild trust quickly.',
    },
    choices: [{ label: 'Move to final reflection', nextScene: 8 }],
  },
  {
    id: 8,
    title: 'Reflection Stop',
    time: '3:18 PM · End of Day Debrief',
    mood: 'Heavy, honest, and forward-looking.',
    narrative:
      'The day ends without a dramatic event, but with accumulated strain. Adam is still carrying hunger, stress, and disconnection into tomorrow.',
    reflection: {
      whatHappened:
        'Multiple small moments shaped the outcome more than one big incident. The pattern reveals barriers to belonging and readiness.',
      educator:
        'Reflect on where adults could have created safety, connection, and practical support. Those moments can change student trajectories.',
    },
    choices: [{ label: 'Restart Prototype Flow', nextScene: 1 }],
  },
];

export default function DayInLifeUrbanStudentPage() {
  const [sceneId, setSceneId] = useState(1);
  const scene = useMemo(() => scenes.find((item) => item.id === sceneId) ?? scenes[0], [sceneId]);

  return (
    <section className="section urban-prototype-wrap">
      <div className="container urban-prototype">
        <p className="prototype-label">Prototype Experience Flow</p>
        <h1>A Day in the Life of an Urban Student</h1>
        <p className="lead">An interactive experience based on real urban school stories.</p>

        <div className="scene-progress">Scene {scene.id} of {scenes.length}</div>

        <article className="scene-card" aria-live="polite">
          <div className="scene-visual-panel">
            <p className="scene-time">{scene.time}</p>
            <h2>{scene.title}</h2>
            <p className="scene-mood">Mood: {scene.mood}</p>
          </div>

          <div className="scene-content">
            <p>{scene.narrative}</p>
          </div>

          <div className="choice-row">
            {scene.choices.map((choice) => (
              <button
                key={choice.label}
                type="button"
                className="choice-button"
                onClick={() => setSceneId(choice.nextScene)}
              >
                {choice.label}
              </button>
            ))}
          </div>
        </article>

        {scene.reflection ? (
          <aside className="reflection-panel">
            <div className="reflection-card">
              <h3>What just happened?</h3>
              <p>{scene.reflection.whatHappened}</p>
            </div>
            <div className="reflection-card">
              <h3>Educator Reflection</h3>
              <p>{scene.reflection.educator}</p>
            </div>
          </aside>
        ) : null}
      </div>
      <style jsx>{`
        .urban-prototype-wrap {
          background: linear-gradient(180deg, #121822 0%, #1b2433 35%, #0f141d 100%);
          color: #ebf1ff;
          min-height: calc(100vh - 130px);
        }
        .urban-prototype {
          max-width: 900px;
        }
        .prototype-label {
          display: inline-block;
          border: 1px solid rgba(191, 216, 255, 0.55);
          color: #d5e7ff;
          border-radius: 999px;
          padding: 0.35rem 0.8rem;
          font-size: 0.8rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .scene-progress {
          margin-top: 1rem;
          font-size: 0.95rem;
          color: #c8d7f0;
        }
        .scene-card {
          margin-top: 1rem;
          border: 1px solid rgba(214, 228, 255, 0.18);
          border-radius: 18px;
          background: rgba(11, 19, 31, 0.72);
          overflow: hidden;
        }
        .scene-visual-panel {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(214, 228, 255, 0.15);
          background: linear-gradient(135deg, rgba(93, 117, 153, 0.28), rgba(22, 34, 51, 0.4));
        }
        .scene-time {
          margin: 0 0 0.35rem;
          font-size: 0.85rem;
          color: #e8f0ff;
          opacity: 0.85;
        }
        .scene-visual-panel h2 {
          margin: 0;
        }
        .scene-mood {
          margin-top: 0.65rem;
          color: #dbe8ff;
          font-style: italic;
        }
        .scene-content {
          padding: 1.4rem 1.5rem 0;
          color: #f3f7ff;
          line-height: 1.7;
        }
        .choice-row {
          padding: 1.2rem 1.5rem 1.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
        }
        .choice-button {
          background: #d8e6ff;
          color: #0e1724;
          border: none;
          border-radius: 12px;
          padding: 0.62rem 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .choice-button:hover {
          background: #fff;
        }
        .reflection-panel {
          margin-top: 1.1rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.8rem;
        }
        .reflection-card {
          border-radius: 14px;
          border: 1px solid rgba(214, 228, 255, 0.2);
          background: rgba(18, 27, 41, 0.82);
          padding: 1rem 1.1rem;
        }
        .reflection-card h3 {
          margin: 0 0 0.45rem;
          color: #f8fbff;
        }
        .reflection-card p {
          margin: 0;
          color: #d4e1f7;
          line-height: 1.6;
        }
      `}</style>
    </section>
  );
}
