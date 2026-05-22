import { dimensionDefinitions } from './profileData';

export const URBAN_REPORT_STORAGE_KEY = 'humanEquationUrbanReport';

const weightedDimensionInputs = {
  regulationUnderPressure: ['stress', 'time', 'sleep'],
  humanAwareness: ['care', 'sleep'],
  trustConstruction: ['care', 'stress'],
  realityAnchoring: ['time', 'stress'],
  grayAreaLeadership: ['care', 'time', 'stress'],
  teamSystemsLeadership: ['care', 'time'],
  instructionalAcademicLeadership: ['sleep', 'care'],
  visionChangeLeadership: ['care', 'sleep', 'time'],
};

const normalizeMetric = (value) => Math.max(-10, Math.min(10, value || 0));
const toScore = (value) => +(Math.max(1, Math.min(5, 3 + (value / 10))).toFixed(1));

export const urbanReflectionQuestions = [
  { id: 'shaped_behavior', prompt: 'What most shaped Adam’s behavior across the day?', options: [{ text: 'Personal defiance', dims: ['realityAnchoring'] }, { text: 'Accumulated fatigue and environmental stress', dims: ['humanAwareness', 'realityAnchoring', 'teamSystemsLeadership'] }, { text: 'Lack of consequences', dims: ['teamSystemsLeadership'] }, { text: 'Unclear adult authority', dims: ['teamSystemsLeadership', 'trustConstruction'] }] },
  { id: 'early_intervention', prompt: 'Where was the earliest high-leverage adult intervention?', options: [{ text: 'Before school arrival', dims: ['teamSystemsLeadership', 'trustConstruction'] }, { text: 'First classroom interaction', dims: ['instructionalAcademicLeadership'] }, { text: 'Hallway/transition moment', dims: ['teamSystemsLeadership', 'trustConstruction'] }, { text: 'Office response', dims: ['instructionalAcademicLeadership'] }] },
  { id: 'leader_response', prompt: 'How should a leader respond when behavior is real but context is also real?', options: [{ text: 'Consequence first, context later', dims: ['realityAnchoring'] }, { text: 'Context first, consequence later', dims: ['trustConstruction'] }, { text: 'Hold accountability while adjusting support', dims: ['grayAreaLeadership', 'trustConstruction', 'realityAnchoring'] }, { text: 'Avoid consequence to preserve relationship', dims: ['humanAwareness'] }] },
  { id: 'harmful_pattern', prompt: 'Which adult pattern was most harmful?', options: [{ text: 'Assuming motive too quickly', dims: ['humanAwareness', 'realityAnchoring'] }, { text: 'Delaying intervention', dims: ['teamSystemsLeadership'] }, { text: 'Focusing only on compliance', dims: ['instructionalAcademicLeadership', 'trustConstruction'] }, { text: 'Treating the student as already known', dims: ['humanAwareness', 'visionChangeLeadership'] }] },
  { id: 'staff_understand', prompt: 'What would you want staff to understand after this simulation?', options: [{ text: 'Behavior may be communication', dims: ['humanAwareness', 'trustConstruction'] }, { text: 'Systems shape student choices', dims: ['visionChangeLeadership', 'teamSystemsLeadership'] }, { text: 'Expectations still matter', dims: ['instructionalAcademicLeadership'] }, { text: 'Relationships affect interpretation', dims: ['trustConstruction', 'grayAreaLeadership'] }] },
  { id: 'system_routine', prompt: 'What system routine could reduce repeated escalation?', options: [{ text: 'Morning check-in', dims: ['teamSystemsLeadership'] }, { text: 'Adult handoff notes', dims: ['teamSystemsLeadership', 'realityAnchoring'] }, { text: 'Restorative reset routine', dims: ['trustConstruction', 'grayAreaLeadership'] }, { text: 'Targeted academic support', dims: ['instructionalAcademicLeadership'] }] },
  { id: 'leadership_risk', prompt: 'Which leadership risk is most visible in this scenario?', options: [{ text: 'Narrowing interpretation under urgency', dims: ['regulationUnderPressure', 'realityAnchoring'] }, { text: 'Over-accommodating behavior', dims: ['grayAreaLeadership'] }, { text: 'Blaming staff too quickly', dims: ['visionChangeLeadership'] }, { text: 'Delaying action too long', dims: ['teamSystemsLeadership'] }] },
  { id: 'protect_most', prompt: 'What should be protected most in the response?', options: [{ text: 'Student dignity', dims: ['trustConstruction', 'humanAwareness'] }, { text: 'Classroom learning environment', dims: ['instructionalAcademicLeadership'] }, { text: 'Adult consistency', dims: ['teamSystemsLeadership'] }, { text: 'Long-term trust', dims: ['trustConstruction', 'grayAreaLeadership'] }] },
  { id: 'next_move', prompt: 'What is the strongest next leadership move after this scenario?', options: [{ text: 'Name the pattern and reset routines with staff', dims: ['visionChangeLeadership', 'teamSystemsLeadership'] }, { text: 'Issue consequences and move on', dims: ['instructionalAcademicLeadership'] }, { text: 'Focus only on individual teacher performance', dims: ['teamSystemsLeadership'] }, { text: 'Wait for another incident for more data', dims: ['realityAnchoring'] }] },
];

export const buildUrbanSimulationReport = ({ selectedChoices = {}, cumulativeMetrics = {}, completedAt = new Date().toISOString(), completionReason = 'completed', postReflectionAnswers = {}, reflectionQuestions = [] }) => {
  const metrics = {
    sleep: normalizeMetric(cumulativeMetrics.sleep),
    stress: normalizeMetric(cumulativeMetrics.stress),
    time: normalizeMetric(cumulativeMetrics.time),
    care: normalizeMetric(cumulativeMetrics.care),
  };

  const dimensions = Object.fromEntries(dimensionDefinitions.map(({ key, label }) => {
    const metricKeys = weightedDimensionInputs[key] || [];
    const weightedSignal = metricKeys.length ? metricKeys.reduce((sum, metricKey) => sum + (metrics[metricKey] || 0), 0) / metricKeys.length : 0;
    const score = toScore(weightedSignal);
    return [key, {
      label,
      score,
      confidence: Math.min(0.95, 0.45 + (Object.keys(selectedChoices).length / 28)),
      narrative: score >= 4
        ? 'Consistently recognizes hidden human context before moving into judgment.'
        : score <= 2.4
          ? 'Tends to narrow interpretation too quickly under emotional ambiguity.'
          : 'Shows mixed interpretation patterns when pressure and ambiguity rise together.',
    }];
  }));

  const strengths = Object.values(dimensions).sort((a, b) => b.score - a.score).slice(0, 3).map((d) => d.label);
  const growthEdges = Object.values(dimensions).sort((a, b) => a.score - b.score).slice(0, 3).map((d) => d.label);
  const distortions = [
    metrics.stress < -4 ? 'Stress acceleration: high urgency narrows emotional interpretation bandwidth.' : null,
    metrics.sleep < -3 ? 'Sleep depletion: reduced regulation reserve increases reactive judgment risk.' : null,
    metrics.care < -2 ? 'Connection thinning: empathy access drops when relational safety feels low.' : null,
  ].filter(Boolean);

  const simulationPathEvidence = Object.entries(selectedChoices).map(([sceneId, choiceId]) => ({ sceneId, choiceId }));
  const postReflectionEvidence = Object.entries(postReflectionAnswers).map(([questionId, response]) => ({ questionId, response }));
  const reflectionSummary = `${postReflectionEvidence.length} reflection responses added to strengthen interpretive confidence and leadership narrative depth.`;
  return {
    source: 'urban_student_simulation',
    completedAt,
    simulationPathEvidence,
    postReflectionEvidence,
    dimensionContributions: dimensions,
    reflectionSummary,
    leadershipImplications: [
      'Leadership interpretation improves when behavior is read with context, sequence, and systems awareness.',
      'Dignity-preserving accountability increases trust while maintaining standards.',
    ],
    completionReason,
    dimensions,
    distortions,
    strengths,
    growthEdges,
    evidenceSummary: completionReason === 'reflection_only'
      ? 'Urban reflection evidence captured. Full simulation evidence can deepen this profile later.'
      : completionReason === 'ended_early'
      ? 'Urban evidence captured from a partial pathway, highlighting how pressure interrupts reflective decision-making.'
      : 'Urban evidence captured across a full student-day pathway, revealing how cumulative stress conditions decision quality and empathy access.',
    emotionalInterpretationPatterns: [
      'Decision speed increases when emotional ambiguity rises.',
      'Context attention strengthens when relational cues are made explicit.',
      'Interpretive range narrows when urgency and uncertainty collide.',
    ],
    pressureTendencies: distortions.length ? distortions : ['Pressure expression remained mixed without a dominant distortion pattern.'],
    studentAwarenessIndicators: [
      metrics.care >= 0 ? 'Protects student dignity language even in tense moments.' : 'Student dignity drops out of frame when urgency spikes.',
      metrics.sleep < -2 ? 'May misread fatigue-based behavior as motivation or compliance failure.' : 'Shows signs of considering context behind surface behavior.',
    ],
    completionSummary: completionReason === 'ended_early' ? 'Urban simulation ended early; evidence still captured and blended into your dashboard.' : 'Urban simulation completed and evidence is now integrated into your dashboard profile.',
    studentExperienceInterpretation: 'The student\'s school-day behavior appears shaped by accumulated fatigue, environmental stress, urgency, and social pressure rather than single-moment intent.',
    leadershipEvidenceObserved: [
      'Adult response opportunities were present during arrival, transitions, and office interactions.',
      'Pressure appeared to narrow interpretation bandwidth during high-urgency moments.',
      'Context-aware responses increased when relational safety and time were present.',
    ],
    growthOpportunities: [
      'Strengthen pause-and-interpret routines before consequence decisions.',
      'Increase proactive support checkpoints during predictable stress transitions.',
      'Use dignity-preserving language under pressure to sustain trust and regulation.',
    ],
    dashboardContribution: 'Urban evidence contributes behavioral signal strength to awareness, regulation, trust construction, and reality anchoring dimensions.',
    timelineEvents: [
      { type: 'urban_simulation_started', label: 'Urban simulation started', occurredAt: completedAt, detail: completionReason === 'reflection_only' ? 'Direct reflection evidence pathway launched without full simulation run.' : 'Urban simulation evidence sequence initiated.' },
      { type: 'urban_simulation_completed', label: 'Urban simulation completed', occurredAt: completedAt, detail: completionReason === 'reflection_only' ? `Reflection-only completion with ${postReflectionEvidence.length} responses.` : `Completed with ${Object.keys(selectedChoices).length} behavioral decision points.` },
    ],
    keyMoments: simulationPathEvidence.slice(0, 8),
    confidenceScore: Math.min(0.95, 0.42 + (Object.keys(selectedChoices).length / 26)),
  };
};
