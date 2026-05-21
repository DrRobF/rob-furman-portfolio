export const DASHBOARD_PROFILE_STORAGE_KEY = 'heq_master_profile_v1';
export const DIAGNOSTIC_RESULT_STORAGE_KEY = 'humanEquationDiagnosticResult';

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
      history: Number.isFinite(score) ? [{ source: 'diagnostic', value: score, capturedAt: diagnosticResult.completedAt || diagnosticResult.timestamp || null }] : [],
    };
  });

  base.generatedAt = diagnosticResult.completedAt || diagnosticResult.timestamp || null;
  base.profileTitle = diagnosticResult.pressureProfileTitle || base.profileTitle;
  base.confidenceLevels = { baseline: diagnosticResult.baselineConfidence === 'Stronger initial signal' ? 0.7 : 0.45, blended: 0.3 };
  base.evidenceSources.diagnostic = { ...base.evidenceSources.diagnostic, status: 'completed', completion: 100, contribution: 'Baseline self-perception + pressure scenario data', latestUpdate: diagnosticResult.completedAt ? new Date(diagnosticResult.completedAt).toLocaleString('en-US') : 'Just now' };

  const distortionNarratives = (diagnosticResult.topDistortions || []).map((distortion) => `${distortion.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim()} may show up gently when pressure rises.`);
  base.distortions = {
    emerging: distortionNarratives.slice(0, 1),
    observed: distortionNarratives.slice(1, 2),
    mild: diagnosticResult.topDistortions?.length ? ['Mild tendencies are visible in baseline responses and may shift under live pressure.'] : [],
    needsMoreEvidence: ['Needs simulation confirmation'],
  };

  base.simulationHistory = [{ source: 'Leadership Diagnostic', completedAt: diagnosticResult.completedAt || diagnosticResult.timestamp || null, status: 'completed' }];
  base.trends = { overall: 'Leadership Diagnostic baseline captured.', trajectory: 'Trend detection begins after two or more simulation evidence points.' };
  base.recommendations = { nextSimulation: diagnosticResult.recommendedNextStep || 'Parent Call Rehearsal', reason: 'Behavioral pressure evidence will deepen profile confidence.' };
  return base;
};

export const blendUrbanEvidenceIntoProfile = (profile, urbanReport) => {
  if (!urbanReport?.dimensions) return profile;
  const next = profile ? { ...profile } : createEmptyMasterProfile();
  next.profileVersion = 2;
  next.generatedAt = urbanReport.completedAt || new Date().toISOString();
  next.simulationHistory = [...(next.simulationHistory || []), { source: 'Urban Student Simulation', completedAt: urbanReport.completedAt || null, status: 'completed' }];
  next.evidenceSources = { ...next.evidenceSources, urbanSim: { ...next.evidenceSources.urbanSim, status: 'completed', completion: 100, latestUpdate: urbanReport.completedAt ? new Date(urbanReport.completedAt).toLocaleString('en-US') : 'Just now', contribution: 'Observed human interpretation under emotional load; weighted heavily for awareness, regulation, trust, and anchoring.' } };

  const urbanDimensionWeights = {
    regulationUnderPressure: 0.7, humanAwareness: 0.75, trustConstruction: 0.68, realityAnchoring: 0.66,
    grayAreaLeadership: 0.55, teamSystemsLeadership: 0.52, instructionalAcademicLeadership: 0.5, visionChangeLeadership: 0.5,
  };

  const strongest = [];
  const growth = [];
  next.dimensions = { ...next.dimensions };
  dimensionDefinitions.forEach(({ key }) => {
    const baseDimension = next.dimensions[key] || {};
    const baseline = Number.isFinite(baseDimension.baselineDiagnosticScore) ? baseDimension.baselineDiagnosticScore : null;
    const urbanScore = urbanReport.dimensions?.[key]?.score;
    const urbanWeight = urbanDimensionWeights[key] || 0.5;
    const diagnosticWeight = 1 - urbanWeight;
    const blended = Number.isFinite(urbanScore) && Number.isFinite(baseline)
      ? +(((baseline * diagnosticWeight) + (urbanScore * urbanWeight)).toFixed(2))
      : (Number.isFinite(urbanScore) ? urbanScore : baseline);
    if (Number.isFinite(blended) && blended >= 3.8) strongest.push(baseDimension.label);
    if (Number.isFinite(blended) && blended <= 2.9) growth.push(baseDimension.label);
    next.dimensions[key] = {
      ...baseDimension,
      simulationEvidenceScore: Number.isFinite(urbanScore) ? urbanScore : baseDimension.simulationEvidenceScore,
      blendedCompositeScore: Number.isFinite(blended) ? blended : null,
      strongestEvidenceSource: Number.isFinite(urbanScore) ? 'Urban Student Simulation behavioral evidence' : baseDimension.strongestEvidenceSource,
      confidence: urbanReport.confidenceScore >= 0.75 ? 'high' : urbanReport.confidenceScore >= 0.58 ? 'moderate' : 'early',
      growthNote: urbanReport.dimensions?.[key]?.narrative || baseDimension.growthNote,
      trend: Number.isFinite(urbanScore) ? 'Behavioral evidence now active under emotional load.' : baseDimension.trend,
      evidenceWeights: { ...(baseDimension.evidenceWeights || {}), diagnostic: Number.isFinite(baseline) ? diagnosticWeight : 0, urbanSim: Number.isFinite(urbanScore) ? urbanWeight : 0 },
      statusProgress: Number.isFinite(blended) ? Math.round((blended / 5) * 100) : (baseDimension.statusProgress || 0),
      history: [...(baseDimension.history || []), ...(Number.isFinite(urbanScore) ? [{ source: 'urbanSim', value: urbanScore, capturedAt: urbanReport.completedAt || null }] : [])],
    };
  });

  next.strongestDimensions = strongest.slice(0, 3);
  next.growthEdges = (urbanReport.growthEdges || growth).slice(0, 3);
  next.growthNotes = [...(next.growthNotes || []), ...(urbanReport.pressureTendencies || [])].slice(0, 4);
  next.distortions = {
    emerging: urbanReport.distortions?.slice(0, 1) || next.distortions?.emerging || [],
    observed: urbanReport.distortions?.slice(1, 2) || next.distortions?.observed || [],
    mild: urbanReport.pressureTendencies?.slice(0, 1) || next.distortions?.mild || [],
    needsMoreEvidence: ['Blend confidence improves with repeated simulation cycles across varied pressure contexts.'],
  };
  next.confidenceLevels = {
    baseline: next.confidenceLevels?.baseline ?? 0.45,
    blended: Math.min(0.95, Math.max(next.confidenceLevels?.blended || 0.3, urbanReport.confidenceScore || 0.45)),
  };
  next.trends = { overall: 'Urban evidence now influences the master profile trendline.', trajectory: 'Observed pressure behaviors are beginning to confirm and challenge baseline self-perception.' };
  next.interpretation = {
    summary: 'This profile now blends self-perception with observed interpretation under human pressure, strengthening behavioral validity.',
    confidenceNarrative: 'Urban simulation evidence increased interpretive confidence most in awareness, regulation, trust, and reality anchoring.',
  };
  return next;
};
