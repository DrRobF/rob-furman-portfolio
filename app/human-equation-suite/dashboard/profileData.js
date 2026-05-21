export const DASHBOARD_PROFILE_STORAGE_KEY = 'heq_master_profile_v1';

export const dimensionDefinitions = [
  { key: 'regulationUnderPressure', label: 'Regulation Under Pressure' },
  { key: 'humanAwareness', label: 'Human Awareness' },
  { key: 'trustConstruction', label: 'Trust Construction' },
  { key: 'realityAnchoring', label: 'Reality Anchoring' },
  { key: 'grayAreaLeadership', label: 'Gray Area Leadership' },
  { key: 'teamSystemsLeadership', label: 'Team & Systems Leadership' },
  { key: 'instructionalAcademicLeadership', label: 'Instructional & Academic Leadership' },
  { key: 'visionChangeLeadership', label: 'Vision & Change Leadership' },
];

const evidenceSeeds = [
  { key: 'diagnostic', label: 'Leadership Diagnostic', route: '/human-equation-suite/diagnostic' },
  { key: 'parentCall', label: 'Parent Call Rehearsal', route: '/human-equation' },
  { key: 'leadershipSim', label: 'Leadership Simulation', route: '/simulation-overview' },
  { key: 'urbanSim', label: 'Urban Student Simulation', route: '/day-in-the-life-urban-student' },
  { key: 'observationLab', label: 'Observation Lab', route: '/human-equation-suite/dashboard' },
  { key: 'futureSims', label: 'Future Simulations', route: '/human-equation-suite/dashboard' },
];

export const createEmptyMasterProfile = () => ({
  profileVersion: 1,
  generatedAt: null,
  profileTitle: 'Leadership Pressure Profile',
  dimensions: Object.fromEntries(dimensionDefinitions.map((d) => [d.key, {
    label: d.label, blendedCompositeScore: null, confidence: 'needs_more_evidence', trend: 'Not enough history yet', strongestEvidenceSource: 'Awaiting simulation blend', statusProgress: 0, evidenceWeights: {}, history: [],
  }])),
  evidenceSources: Object.fromEntries(evidenceSeeds.map((s) => [s.key, { ...s, status: 'not_started', completion: 0, contribution: 'Pending evidence feed', latestUpdate: 'No evidence captured yet' }])),
  distortions: { emerging: [], observed: [], mild: [], needsMoreEvidence: ['Pressure responses are still forming and will sharpen with more behavioral evidence.'] },
  confidenceLevels: { baseline: 0.35, blended: 0.25 },
  trends: { overall: 'No longitudinal trend yet', trajectory: 'Monitoring baseline only' },
  simulationHistory: [],
  recommendations: { nextSimulation: 'Parent Call Rehearsal', reason: 'Behavioral pressure evidence will deepen profile confidence.' },
});

export const toMasterProfileFromDiagnostic = (diagnosticResult) => {
  const base = createEmptyMasterProfile();
  if (!diagnosticResult?.dimensions) return base;
  const confidenceMap = { strong: 'high', baseline: 'moderate', early: 'early', insufficient: 'needs_more_evidence' };

  dimensionDefinitions.forEach(({ key, label }) => {
    const dimension = diagnosticResult.dimensions[key];
    const score = dimension?.composite;
    base.dimensions[key] = {
      ...base.dimensions[key],
      label,
      blendedCompositeScore: Number.isFinite(score) ? score : null,
      confidence: confidenceMap[dimension?.confidenceLevel] || 'needs_more_evidence',
      trend: 'Baseline established; awaiting simulation trendline',
      strongestEvidenceSource: Number.isFinite(score) ? 'Leadership Diagnostic baseline' : 'Awaiting simulation blend',
      statusProgress: Number.isFinite(score) ? Math.round((score / 5) * 100) : 0,
      evidenceWeights: { diagnostic: Number.isFinite(score) ? 1 : 0, parentCall: 0, leadershipSim: 0, urbanSim: 0, observationLab: 0 },
      history: Number.isFinite(score) ? [{ source: 'diagnostic', value: score, capturedAt: diagnosticResult.timestamp || null }] : [],
    };
  });

  base.generatedAt = diagnosticResult.timestamp || null;
  base.profileTitle = diagnosticResult.pressureProfileTitle || base.profileTitle;
  base.confidenceLevels = { baseline: diagnosticResult.baselineConfidence === 'Stronger initial signal' ? 0.7 : 0.45, blended: 0.3 };
  base.evidenceSources.diagnostic = { ...base.evidenceSources.diagnostic, status: 'complete', completion: 100, contribution: 'Baseline dimension signal captured', latestUpdate: diagnosticResult.timestamp ? new Date(diagnosticResult.timestamp).toLocaleDateString('en-US') : 'Just now' };

  const distortionNarratives = (diagnosticResult.topDistortions || []).map((distortion) => `${distortion.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim()} tendencies may emerge when relational tension rises.`);
  base.distortions = {
    emerging: distortionNarratives.slice(0, 1),
    observed: distortionNarratives.slice(1, 2),
    mild: diagnosticResult.topDistortions?.length ? ['Mild tendencies are visible in baseline responses and may shift under live pressure.'] : [],
    needsMoreEvidence: ['Simulation behavior is needed before naming persistent pressure patterns.'],
  };

  base.simulationHistory = [{ source: 'Leadership Diagnostic', completedAt: diagnosticResult.timestamp || null, status: 'complete' }];
  base.trends = { overall: 'Baseline snapshot captured from diagnostic self-perception and scenario responses.', trajectory: 'Trend detection begins after two or more simulation evidence points.' };
  return base;
};
