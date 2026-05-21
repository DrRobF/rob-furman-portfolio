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

export const buildUrbanSimulationReport = ({ selectedChoices = {}, cumulativeMetrics = {}, completedAt = new Date().toISOString(), completionReason = 'completed' }) => {
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

  return {
    source: 'urban_student_simulation',
    completedAt,
    completionReason,
    dimensions,
    distortions,
    strengths,
    growthEdges,
    evidenceSummary: completionReason === 'ended_early'
      ? 'Early completion captured preliminary evidence under partial pathway exposure.'
      : 'Observed behavior suggests this leader is being shaped more by live emotional load than by stated leadership intent.',
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
    timelineEvents: [
      { type: 'urban_simulation_started', occurredAt: completedAt, detail: 'Urban simulation evidence sequence initiated.' },
      { type: 'urban_simulation_completed', occurredAt: completedAt, detail: `Completed with ${Object.keys(selectedChoices).length} behavioral decision points.` },
    ],
    keyMoments: Object.entries(selectedChoices).slice(0, 8).map(([sceneId, choiceId]) => ({ sceneId, choiceId })),
    confidenceScore: Math.min(0.95, 0.42 + (Object.keys(selectedChoices).length / 26)),
  };
};
