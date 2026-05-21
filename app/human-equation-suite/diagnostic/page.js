'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useLanguage } from '../../components/LanguageProvider';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

const dimensions = [
  { key: 'trustConstruction', label: 'Trust Construction' },
  { key: 'humanAwareness', label: 'Human Awareness' },
  { key: 'realityAnchoring', label: 'Reality Anchoring' },
  { key: 'regulationUnderPressure', label: 'Regulation Under Pressure' },
  { key: 'grayAreaLeadership', label: 'Gray Area Leadership' },
  { key: 'visionChangeLeadership', label: 'Vision & Change Leadership' },
  { key: 'instructionalAcademicLeadership', label: 'Instructional & Academic Leadership' },
  { key: 'teamSystemsLeadership', label: 'Team & Systems Leadership' },
];

const beliefItems = dimensions.map((dimension) => ({
  id: `belief-${dimension.key}`,
  dimension: dimension.key,
  prompt: `How important is ${dimension.label.toLowerCase()} in your leadership practice?`,
}));

const selfItems = dimensions.map((dimension) => ({
  id: `self-${dimension.key}`,
  dimension: dimension.key,
  prompt: `Under pressure, how consistently do you practice ${dimension.label.toLowerCase()}?`,
}));

const scenarioItems = [
  {
    id: 'scenario-1',
    prompt: 'A parent strongly disagrees with a consequence. The teacher expects consistency, but the family asks for flexibility based on context. What feels most important to protect first?',
    options: [
      { id: 'a', label: 'Preserve trust through transparent dialogue and shared next steps.', dims: { trustConstruction: 2, humanAwareness: 1 }, distortions: { harmonizer: 1 } },
      { id: 'b', label: 'Protect policy consistency so no one questions fairness.', dims: { realityAnchoring: 1, teamSystemsLeadership: 2 }, distortions: { loyalist: 1, controller: 1 } },
      { id: 'c', label: 'Keep the interaction calm and gather context before deciding.', dims: { regulationUnderPressure: 2, grayAreaLeadership: 1 }, distortions: { avoider: 1 } },
      { id: 'd', label: 'Move quickly to keep the situation from escalating publicly.', dims: { visionChangeLeadership: 1, regulationUnderPressure: 1 }, distortions: { performer: 1, reactor: 1 } },
    ],
  },
  {
    id: 'scenario-2',
    prompt: 'Your district announces a rapid initiative that staff view as disconnected from classroom realities. What is your first move?',
    options: [
      { id: 'a', label: 'Translate the why, acknowledge concern, and co-design rollout checkpoints.', dims: { visionChangeLeadership: 2, trustConstruction: 1 }, distortions: { hero: 1 } },
      { id: 'b', label: 'Set strict implementation expectations to avoid drift.', dims: { teamSystemsLeadership: 2, realityAnchoring: 1 }, distortions: { controller: 2 } },
      { id: 'c', label: 'Delay launch conversations until emotions cool and guidance is clearer.', dims: { regulationUnderPressure: 1, grayAreaLeadership: 1 }, distortions: { avoider: 2 } },
      { id: 'd', label: 'Publicly align upward first, then troubleshoot privately later.', dims: { teamSystemsLeadership: 1, visionChangeLeadership: 1 }, distortions: { loyalist: 2 } },
    ],
  },
  {
    id: 'scenario-3',
    prompt: 'Two teachers conflict over student behavior support. Both feel unheard and each has community backing. What do you prioritize?',
    options: [
      { id: 'a', label: 'Center the student evidence and create a shared problem-solving protocol.', dims: { instructionalAcademicLeadership: 2, realityAnchoring: 1 }, distortions: { detachedLeader: 1 } },
      { id: 'b', label: 'Protect relationships first by softening difficult truths for now.', dims: { humanAwareness: 2, trustConstruction: 1 }, distortions: { harmonizer: 2 } },
      { id: 'c', label: 'Take ownership yourself and mediate each part personally.', dims: { regulationUnderPressure: 1, teamSystemsLeadership: 1 }, distortions: { martyr: 1, hero: 2 } },
      { id: 'd', label: 'Draw a hard line quickly to prevent ongoing disruption.', dims: { teamSystemsLeadership: 2, grayAreaLeadership: 1 }, distortions: { defender: 1, controller: 1 } },
    ],
  },
  {
    id: 'scenario-4',
    prompt: 'A vocal stakeholder challenges your leadership in a public meeting with partial information. How do you respond first?',
    options: [
      { id: 'a', label: 'Regulate, acknowledge concern, and commit to verified follow-up data.', dims: { regulationUnderPressure: 2, realityAnchoring: 2 }, distortions: { performer: 1 } },
      { id: 'b', label: 'Defend your team forcefully to show unity.', dims: { trustConstruction: 1, teamSystemsLeadership: 1 }, distortions: { defender: 2, reactor: 1 } },
      { id: 'c', label: 'Redirect quickly to protect confidence in your leadership image.', dims: { visionChangeLeadership: 1 }, distortions: { performer: 2 } },
      { id: 'd', label: 'Table the issue and continue agenda to avoid escalation.', dims: { grayAreaLeadership: 1 }, distortions: { detachedLeader: 1, avoider: 1 } },
    ],
  },
  {
    id: 'scenario-5',
    prompt: 'An instructional coach flags a decline in classroom rigor, but your team is exhausted and morale is fragile. What do you protect first?',
    options: [
      { id: 'a', label: 'Set a paced improvement cycle with support and clear non-negotiables.', dims: { instructionalAcademicLeadership: 2, visionChangeLeadership: 1 }, distortions: { hero: 1 } },
      { id: 'b', label: 'Prioritize morale now and postpone accountability conversations.', dims: { humanAwareness: 1, trustConstruction: 1 }, distortions: { harmonizer: 1, avoider: 1 } },
      { id: 'c', label: 'Carry the instructional burden yourself to spare the team.', dims: { instructionalAcademicLeadership: 1 }, distortions: { martyr: 2 } },
      { id: 'd', label: 'Show immediate results with visible compliance actions.', dims: { teamSystemsLeadership: 1, realityAnchoring: 1 }, distortions: { performer: 1, controller: 1 } },
    ],
  },
  {
    id: 'scenario-6',
    prompt: 'A high-performing staff member is undermining collaboration and creating factions. What matters most in your first intervention?',
    options: [
      { id: 'a', label: 'Confront behavior directly while preserving dignity and expectations.', dims: { grayAreaLeadership: 2, trustConstruction: 1 }, distortions: { reactor: 1 } },
      { id: 'b', label: 'Protect system norms before individual preference.', dims: { teamSystemsLeadership: 2, realityAnchoring: 1 }, distortions: { loyalist: 1 } },
      { id: 'c', label: 'Keep peace by redistributing responsibilities quietly.', dims: { humanAwareness: 1 }, distortions: { harmonizer: 1, detachedLeader: 1 } },
      { id: 'd', label: 'Step in personally to absorb tension and keep momentum.', dims: { visionChangeLeadership: 1 }, distortions: { hero: 2, martyr: 1 } },
    ],
  },
  {
    id: 'scenario-7',
    prompt: 'You receive conflicting data: attendance is improving while student voice surveys show lower belonging. How do you prioritize?',
    options: [
      { id: 'a', label: 'Hold both truths and launch a cross-team inquiry before conclusions.', dims: { realityAnchoring: 2, teamSystemsLeadership: 1 }, distortions: { detachedLeader: 1 } },
      { id: 'b', label: 'Lead with narrative confidence and highlight gains first.', dims: { visionChangeLeadership: 1 }, distortions: { performer: 2 } },
      { id: 'c', label: 'Focus on emotional repair circles immediately.', dims: { humanAwareness: 2, trustConstruction: 1 }, distortions: { harmonizer: 1 } },
      { id: 'd', label: 'Intensify controls to ensure every team executes the same plan.', dims: { teamSystemsLeadership: 1, instructionalAcademicLeadership: 1 }, distortions: { controller: 2 } },
    ],
  },
  {
    id: 'scenario-8',
    prompt: 'A crisis week leaves you overloaded. Several team leads wait for direction while urgent family concerns continue. What do you do first?',
    options: [
      { id: 'a', label: 'Name priorities, delegate ownership, and schedule visible check-ins.', dims: { teamSystemsLeadership: 2, regulationUnderPressure: 1 }, distortions: { hero: 1 } },
      { id: 'b', label: 'Handle most issues yourself to reduce burden on others.', dims: { trustConstruction: 1 }, distortions: { martyr: 2, hero: 1 } },
      { id: 'c', label: 'Pause non-urgent conflict conversations until next week.', dims: { regulationUnderPressure: 1 }, distortions: { avoider: 2 } },
      { id: 'd', label: 'Keep communication minimal to stay focused on operational tasks.', dims: { realityAnchoring: 1 }, distortions: { detachedLeader: 2 } },
    ],
  },
];

const distortionsList = ['harmonizer', 'loyalist', 'controller', 'performer', 'martyr', 'reactor', 'avoider', 'hero', 'defender', 'detachedLeader'];

export default function HumanEquationDiagnosticPage() {
  const { language } = useLanguage();
  const es = language === 'es';
  const [started, setStarted] = useState(false);
  const [viewResults, setViewResults] = useState(false);
  const [beliefAnswers, setBeliefAnswers] = useState({});
  const [selfAnswers, setSelfAnswers] = useState({});
  const [scenarioAnswers, setScenarioAnswers] = useState({});

  const isComplete = beliefItems.every((q) => beliefAnswers[q.id]) && selfItems.every((q) => selfAnswers[q.id]) && scenarioItems.every((q) => scenarioAnswers[q.id]);

  const result = useMemo(() => {
    const dimensionScores = Object.fromEntries(
      dimensions.map((d) => [d.key, { belief: 0, selfImplementation: 0, scenarioSignal: 0, composite: 0 }]),
    );
    beliefItems.forEach((item) => {
      dimensionScores[item.dimension].belief = Number(beliefAnswers[item.id] || 0);
    });
    selfItems.forEach((item) => {
      dimensionScores[item.dimension].selfImplementation = Number(selfAnswers[item.id] || 0);
    });

    const distortions = Object.fromEntries(distortionsList.map((d) => [d, 0]));
    scenarioItems.forEach((q) => {
      const picked = q.options.find((opt) => opt.id === scenarioAnswers[q.id]);
      if (!picked) return;
      Object.entries(picked.dims || {}).forEach(([key, val]) => {
        dimensionScores[key].scenarioSignal += val;
      });
      Object.entries(picked.distortions || {}).forEach(([key, val]) => {
        distortions[key] += val;
      });
    });

    Object.values(dimensionScores).forEach((score) => {
      score.composite = Number((score.belief * 0.3 + score.selfImplementation * 0.45 + score.scenarioSignal * 0.25).toFixed(2));
    });

    const ranked = dimensions
      .map((d) => ({ key: d.key, label: d.label, ...dimensionScores[d.key], gap: Number((dimensionScores[d.key].belief - dimensionScores[d.key].selfImplementation).toFixed(2)) }))
      .sort((a, b) => b.composite - a.composite);

    const topDistortions = Object.entries(distortions).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([key]) => key);
    const pressureProfileTitle = ranked[0]?.composite >= 4
      ? 'Anchored Integrative Leadership Profile'
      : ranked[0]?.composite >= 3
        ? 'Developing Adaptive Leadership Profile'
        : 'Emerging Leadership Pressure Profile';

    return {
      dimensions: dimensionScores,
      distortions,
      topStrengths: ranked.slice(0, 3).map((r) => r.label),
      growthEdges: ranked.slice(-3).map((r) => r.label),
      pressureProfileTitle,
      recommendedNextStep: 'Continue to Parent Call Rehearsal to test your pressure patterns in live dialogue.',
      gaps: ranked.map((r) => ({ dimension: r.label, gap: r.gap, belief: r.belief, selfImplementation: r.selfImplementation, composite: r.composite })),
      topDistortions,
    };
  }, [beliefAnswers, selfAnswers, scenarioAnswers]);

  return (
    <section className="section section-light">
      <div className="container">
        <LanguageSwitcher />
        <p className="eyebrow">Human Equation Suite</p>
        <h1>{es ? 'Diagnóstico de Presión de Liderazgo' : 'Leadership Pressure Diagnostic'}</h1>
        <p className="lead">
          {es ? 'Establece tu perfil base antes de las simulaciones. Este diagnóstico refleja lo que valoras, cómo lideras bajo presión y hacia qué puedes derivar en tensión.' : 'Establish your baseline profile before simulations. This diagnostic reflects what you value, how you implement under pressure, and where you may drift in tension.'}
        </p>

        <div className="button-row">
          <button className="button primary" onClick={() => { setStarted(true); setViewResults(false); }}>Start Diagnostic</button>
          <button className="button secondary" disabled={!isComplete} onClick={() => setViewResults(true)}>View Results</button>
          <Link href="/human-equation" className="button secondary">Continue to Parent Call Rehearsal</Link>
          <Link href="/human-equation-suite" className="button secondary">Back to Human Equation Suite</Link>
        </div>

        {started && !viewResults && (
          <div className="top-space card project-card">
            <p className="eyebrow">Progress</p>
            <p>{Object.keys(beliefAnswers).length + Object.keys(selfAnswers).length + Object.keys(scenarioAnswers).length} / 24 complete</p>
            <hr />
            <h3>A. Belief / Importance</h3>
            {beliefItems.map((q) => (
              <div key={q.id} className="top-space-sm">
                <p>{q.prompt}</p>
                <div className="button-row">{[1, 2, 3, 4, 5].map((n) => <button key={n} className={`button secondary ${beliefAnswers[q.id] === n ? 'active' : ''}`} onClick={() => setBeliefAnswers((prev) => ({ ...prev, [q.id]: n }))}>{n}</button>)}</div>
              </div>
            ))}
            <h3 className="top-space">B. Self-Implementation</h3>
            {selfItems.map((q) => (
              <div key={q.id} className="top-space-sm">
                <p>{q.prompt}</p>
                <div className="button-row">{[1, 2, 3, 4, 5].map((n) => <button key={n} className={`button secondary ${selfAnswers[q.id] === n ? 'active' : ''}`} onClick={() => setSelfAnswers((prev) => ({ ...prev, [q.id]: n }))}>{n}</button>)}</div>
              </div>
            ))}
            <h3 className="top-space">C. Pressure Scenarios</h3>
            {scenarioItems.map((q) => (
              <div key={q.id} className="top-space-sm">
                <p>{q.prompt}</p>
                <div className="card-grid top-space-sm">
                  {q.options.map((o) => (
                    <button key={o.id} className={`button secondary ${scenarioAnswers[q.id] === o.id ? 'active' : ''}`} onClick={() => setScenarioAnswers((prev) => ({ ...prev, [q.id]: o.id }))}>{o.label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {viewResults && isComplete && (
          <div className="top-space card project-card">
            <h2>{result.pressureProfileTitle}</h2>
            <p>Your current profile suggests a baseline pattern that can strengthen through deliberate practice under pressure.</p>
            <h3 className="top-space-sm">8-Dimension Scores</h3>
            {dimensions.map((d) => (
              <p key={d.key}><strong>{d.label}:</strong> belief {result.dimensions[d.key].belief}, self-implementation {result.dimensions[d.key].selfImplementation}, scenario signal {result.dimensions[d.key].scenarioSignal}, composite {result.dimensions[d.key].composite}</p>
            ))}
            <h3 className="top-space-sm">Belief vs Self-Implementation Gaps</h3>
            {result.gaps.map((g) => <p key={g.dimension}>{g.dimension}: gap {g.gap} (belief {g.belief} vs self {g.selfImplementation})</p>)}
            <h3 className="top-space-sm">Likely Pressure Distortions</h3>
            <p>Under pressure, you may drift toward <strong>{result.topDistortions[0]}</strong> and <strong>{result.topDistortions[1]}</strong>.</p>
            <h3 className="top-space-sm">Strengths</h3>
            <p>Your strongest baseline areas appear to be: {result.topStrengths.join(', ')}.</p>
            <h3 className="top-space-sm">Growth Edges</h3>
            <p>A useful growth edge may be strengthening: {result.growthEdges.join(', ')}.</p>
            <h3 className="top-space-sm">Recommended Next Simulation</h3>
            <p>{result.recommendedNextStep}</p>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </section>
  );
}
