'use client';

import { useMemo, useState } from 'react';

const scenarios = [
  {
    title: 'Parent complaint before school',
    context:
      'At 7:20 AM, a parent arrives upset about a bullying concern and demands immediate action before students enter the building.',
    choices: [
      {
        text: 'Ask the parent to send an email and schedule a meeting later this week.',
        feedback:
          'Delaying the issue may increase family frustration and reduce trust in school responsiveness.',
        insight:
          'Early acknowledgment and a short immediate protocol can prevent escalation while protecting your schedule.',
      },
      {
        text: 'Pause for a 10-minute intake conversation and assign follow-up roles to counselor and assistant principal.',
        feedback:
          'Strong move. You validated the concern and created a fast response structure with clear ownership.',
        insight:
          'Visible, calm triage is a high-leverage leadership behavior during high-stress family interactions.',
      },
      {
        text: 'Refer the parent directly to the district office.',
        feedback:
          'Escalating too early can feel dismissive and may create avoidable conflict.',
        insight:
          'School-level problem framing first; district escalation should support, not replace, local leadership action.',
      },
    ],
  },
  {
    title: 'Teacher conflict during planning period',
    context:
      'Two teachers are in conflict over shared student support responsibilities and interrupt your planning block.',
    choices: [
      {
        text: 'Tell them to resolve it on their own and return later.',
        feedback: 'Autonomy matters, but unresolved tension may affect students before the day ends.',
        insight:
          'Leaders can preserve teacher ownership while setting a structured protocol for rapid conflict resolution.',
      },
      {
        text: 'Hold a short mediation now, identify immediate student needs, and schedule deeper follow-up.',
        feedback:
          'Effective. You protected student outcomes now and created space for sustainable team alignment later.',
        insight:
          'A two-step mediation model helps teams separate urgent student needs from long-term adult dynamics.',
      },
      {
        text: 'Move one teacher off the responsibility immediately without discussion.',
        feedback:
          'Quick reassignment may reduce immediate noise but risks fairness concerns and reduced team trust.',
        insight:
          'Process clarity and shared decision rationale matter as much as speed in staff-facing decisions.',
      },
    ],
  },
  {
    title: 'Student discipline decision before dismissal',
    context:
      'Late afternoon, a student is involved in a hallway altercation. Staff request immediate suspension before buses depart.',
    choices: [
      {
        text: 'Issue immediate suspension with no student conference.',
        feedback: 'Fast action may satisfy urgency but can weaken procedural fairness and context accuracy.',
        insight:
          'Discipline decisions should combine safety, due process, and restorative planning whenever possible.',
      },
      {
        text: 'Conduct a rapid fact-finding conference and assign a temporary safety plan with next-day review.',
        feedback:
          'Strong balance. You addressed safety and fairness while protecting long-term relationship and accountability goals.',
        insight:
          'High-quality discipline leadership uses immediate containment and structured follow-up—not only punishment.',
      },
      {
        text: 'Postpone all action until next week.',
        feedback: 'Delaying action can signal inconsistency and leave students and staff uncertain about expectations.',
        insight:
          'Timely communication of interim expectations is essential, even when final consequences need more review.',
      },
    ],
  },
];

export default function PrincipalSimulationClient() {
  const [started, setStarted] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);

  const currentScenario = useMemo(() => scenarios[scenarioIndex], [scenarioIndex]);

  const handleChoice = (index) => {
    setSelectedChoice(index);
  };

  const handleNext = () => {
    if (scenarioIndex < scenarios.length - 1) {
      setScenarioIndex((prev) => prev + 1);
      setSelectedChoice(null);
      return;
    }

    setStarted(false);
    setScenarioIndex(0);
    setSelectedChoice(null);
  };

  if (!started) {
    return (
      <div className="simulation-shell">
        <h2>Principal Simulation</h2>
        <p>
          Step into real leadership moments and practice making decisions with immediate feedback and
          practical leadership insight.
        </p>
        <button className="button primary" onClick={() => setStarted(true)}>
          Start Simulation
        </button>
      </div>
    );
  }

  const choiceResult = selectedChoice !== null ? currentScenario.choices[selectedChoice] : null;

  return (
    <div className="simulation-shell">
      <p className="eyebrow">Scenario {scenarioIndex + 1} of {scenarios.length}</p>
      <h3>{currentScenario.title}</h3>
      <p>{currentScenario.context}</p>

      <div className="choices">
        {currentScenario.choices.map((choice, index) => (
          <button
            key={choice.text}
            className={`choice ${selectedChoice === index ? 'active' : ''}`}
            onClick={() => handleChoice(index)}
            disabled={selectedChoice !== null}
          >
            {choice.text}
          </button>
        ))}
      </div>

      {choiceResult && (
        <div className="feedback">
          <h4>Feedback</h4>
          <p>{choiceResult.feedback}</p>
          <h4>Leadership Insight</h4>
          <p>{choiceResult.insight}</p>
          <button className="button secondary" onClick={handleNext}>
            {scenarioIndex < scenarios.length - 1 ? 'Next Scenario' : 'Restart Simulation'}
          </button>
        </div>
      )}
    </div>
  );
}
