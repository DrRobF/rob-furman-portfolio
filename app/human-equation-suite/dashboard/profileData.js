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



export const factorPsychologyDefinitions = {
  regulationUnderPressure: {
    title: 'Regulation Under Pressure',
    shortDefinition: 'Maintaining emotional and cognitive organization when intensity rises.',
    whatItMeasures: 'Nervous system steadiness, response pacing, escalation tolerance, and your ability to think while emotionally activated.',
    whyItMatters: 'Regulation protects judgment quality when interpersonal heat spikes.',
    healthyFunctioning: 'You stay grounded, pace response timing, and hold both emotion and reasoning in the same moment.',
    pressureDistortion: 'Emotional flooding, cognitive narrowing, rushed response, or over-control disguised as calm.',
    overusePattern: 'Excess composure can read as emotional distance when people need visible empathy.',
    underusePattern: 'Fast escalation, reactive language, and problem-solving before stabilization.',
    currentInterpretation: 'Your profile suggests regulation is strengthening, with consistency improving as evidence accumulates.',
    underStressPattern: 'You may speed up interpretation when emotional load outpaces regulation.',
    recoveryPractice: 'Slow the tempo before solving the problem. Name the emotional load. Create enough space for judgment to return.',
    evidenceLanguage: 'Observed through pacing, tone shifts, and response sequence in',
    growthTrajectory: 'Build shorter reset loops so emotional activation no longer dictates decision speed.',
    courseTeaser: 'Module focus: recover cognitive range while emotionally activated.'
  },
  humanAwareness: { title: 'Human Awareness', shortDefinition: 'Reading the human reality beneath behavior.', whatItMeasures: 'Emotional perception, motive interpretation, empathy accuracy, and reading what people may be protecting, fearing, avoiding, or needing.', whyItMatters: 'Accurate human interpretation prevents unnecessary conflict cycles.', healthyFunctioning: 'You stay curious about meaning beneath behavior and check assumptions before acting.', pressureDistortion: 'Flattening people into problems, misreading intent, losing curiosity, or treating emotional behavior as irrational.', overusePattern: 'Over-attunement can delay boundaries or direct accountability.', underusePattern: 'Behavior gets judged quickly without context, increasing distrust.', currentInterpretation: 'Evidence shows awareness is present, but consistency depends on pressure intensity.', underStressPattern: 'Curiosity can shrink when urgency invites snap motive judgments.', recoveryPractice: 'Ask: “What might this person be protecting right now?” Separate the behavior from the human need underneath it.', evidenceLanguage: 'Current evidence appears in motive-reading language from', growthTrajectory: 'Strengthen empathy precision without losing clarity about expectations.', courseTeaser: 'Module focus: distinguish observable behavior from inferred intent.' },
  trustConstruction: { title: 'Trust Construction', shortDefinition: 'Creating credibility and psychological safety through consistency, honesty, and follow-through.', whatItMeasures: 'Whether others can emotionally rely on you when certainty is limited.', whyItMatters: 'Trust determines whether people stay candid, adaptive, and aligned under stress.', healthyFunctioning: 'You communicate truthfully, set realistic commitments, and follow through visibly.', pressureDistortion: 'Overpromising, avoiding hard truths, becoming vague, or soothing before trust is earned.', overusePattern: 'Over-reassurance can obscure risk and weaken credibility.', underusePattern: 'Sparse communication leaves people guessing and destabilized.', currentInterpretation: 'Trust capacity is active, with growth needed in high-ambiguity moments.', underStressPattern: 'Pressure may pull communication toward control instead of transparency.', recoveryPractice: 'Say what is true, say what is not yet known, and name the next reliable action.', evidenceLanguage: 'Trust signals are currently visible in commitment language across', growthTrajectory: 'Increase reliability by tightening promise-to-follow-through cycles.', courseTeaser: 'Module focus: rebuild trust quickly after uncertainty spikes.' },
  realityAnchoring: { title: 'Reality Anchoring', shortDefinition: 'Staying connected to observable facts when narratives and emotion intensify.', whatItMeasures: 'Evidence discipline, fact-pattern recognition, and resistance to storylines that outrun available data.', whyItMatters: 'Anchoring reality protects teams from fear-driven decisions.', healthyFunctioning: 'You separate signal from noise and sequence decisions around verified evidence.', pressureDistortion: 'Treating urgency as evidence, accepting the loudest narrative, projecting motives, or solving before verifying.', overusePattern: 'Data rigor can become analysis drag when timing requires movement.', underusePattern: 'Assumptions become strategy and increase avoidable rework.', currentInterpretation: 'Fact anchoring is developing, with stronger performance when tempo is managed.', underStressPattern: 'Narrative momentum can outpace verification when stakes rise quickly.', recoveryPractice: 'Return to three anchors: what we know, what we do not know, and what we need to verify next.', evidenceLanguage: 'Reality anchoring evidence is drawn from decision framing in', growthTrajectory: 'Practice fast verification loops that preserve speed without sacrificing truth.', courseTeaser: 'Module focus: evidence discipline under social and emotional pressure.' },
  grayAreaLeadership: { title: 'Gray Area Leadership', shortDefinition: 'Maintaining judgment when there is no clean answer.', whatItMeasures: 'Ambiguity tolerance, moral steadiness, and decision quality with competing truths and partial information.', whyItMatters: 'Most leadership pressure comes with trade-offs, not perfect options.', healthyFunctioning: 'You hold tension, explain trade-offs, and move with accountable reasoning.', pressureDistortion: 'Reaching for false certainty, delaying too long, outsourcing judgment, or hiding behind policy.', overusePattern: 'Endless qualification can stall action and exhaust teams.', underusePattern: 'Premature certainty suppresses nuance and increases relational fallout.', currentInterpretation: 'Your judgment under ambiguity is emerging, with room to make reasoning more visible.', underStressPattern: 'You may rush toward cleaner narratives to reduce discomfort.', recoveryPractice: 'Name the competing truths. Identify the least harmful next step. Make the reasoning visible.', evidenceLanguage: 'Gray-area capacity is reflected in trade-off language from', growthTrajectory: 'Build comfort with visible uncertainty while preserving forward motion.', courseTeaser: 'Module focus: making difficult calls without abandoning nuance.' },
  teamSystemsLeadership: { title: 'Team & Systems Leadership', shortDefinition: 'Seeing how people, roles, routines, communication, and structures interact under pressure.', whatItMeasures: 'Your ability to diagnose patterns beyond individuals and redesign the system producing repeat friction.', whyItMatters: 'Sustainable improvement requires system-level intervention, not heroic over-functioning.', healthyFunctioning: 'You identify recurring patterns, distribute ownership, and reinforce accountability rhythms.', pressureDistortion: 'Personalizing system failures, solving incidents not patterns, or over-functioning instead of distributing responsibility.', overusePattern: 'System focus can feel impersonal if human impact is not acknowledged.', underusePattern: 'Problems reappear because root conditions remain untouched.', currentInterpretation: 'System awareness is active but still maturing in execution consistency.', underStressPattern: 'Immediate incidents can consume attention and hide structural causes.', recoveryPractice: 'Ask: “What system allowed this to become predictable?” Then assign ownership, rhythm, and follow-up.', evidenceLanguage: 'Systems evidence is currently strongest in pattern-recognition moments from', growthTrajectory: 'Shift from one-off rescue responses to repeatable operating routines.', courseTeaser: 'Module focus: convert recurring pressure points into system redesign.' },
  instructionalAcademicLeadership: { title: 'Instructional & Academic Leadership', shortDefinition: 'Keeping student learning and instructional quality visible during operational pressure.', whatItMeasures: 'How well leadership decisions stay connected to classroom purpose when the building gets noisy.', whyItMatters: 'If instruction disappears from decision logic, school improvement drifts off mission.', healthyFunctioning: 'You reconnect people and operations to student learning conditions and teacher support.', pressureDistortion: 'Letting discipline, politics, logistics, or emotional urgency displace instructional thinking.', overusePattern: 'Instruction-first framing can miss urgent safety or relational constraints.', underusePattern: 'Operational firefighting eclipses academic priorities for too long.', currentInterpretation: 'Instructional leadership signal is present and needs deeper behavioral evidence.', underStressPattern: 'Noise can temporarily crowd out explicit learning-centered framing.', recoveryPractice: 'Reconnect the decision to student learning: what students need, what teachers need, and what instructional condition must improve.', evidenceLanguage: 'Instructional signal currently appears in learning-impact references from', growthTrajectory: 'Increase the frequency of decisions that explicitly tie back to learning quality.', courseTeaser: 'Module focus: preserve academic purpose during high-pressure disruption.' },
  visionChangeLeadership: { title: 'Vision & Change Leadership', shortDefinition: 'Helping people move toward a better future without losing stability in the present.', whatItMeasures: 'Direction-setting, transition psychology, confidence signaling, and movement through uncertainty.', whyItMatters: 'Change fails when direction is unclear or emotional readiness is ignored.', healthyFunctioning: 'You set direction, normalize discomfort, and stage practical next steps people can execute.', pressureDistortion: 'Retreating into short-term management, overexplaining vision, or pushing change beyond emotional readiness.', overusePattern: 'Relentless future focus can underweight present capacity limits.', underusePattern: 'Protecting comfort can freeze momentum and erode confidence.', currentInterpretation: 'Vision signal is emerging, with growth opportunity in change pacing under stress.', underStressPattern: 'Pressure can collapse long-term direction into immediate containment mode.', recoveryPractice: 'Restate the destination, name the current discomfort, and give people the next visible step.', evidenceLanguage: 'Change-readiness evidence is visible in transition language from', growthTrajectory: 'Develop steadier change pacing that protects both momentum and trust.', courseTeaser: 'Module focus: lead transitions with emotional realism and directional clarity.' },
};
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
      growthNote: DIMENSION_INSIGHTS[key],
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
  next.simulationHistory = [...new Map([...(next.simulationHistory || []), { source: 'Urban Student Simulation', completedAt: urbanReport.completedAt || null, status: 'completed' }].map((e)=>[e.source,e])).values()];
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
      growthNote: urbanReport.dimensions?.[key]?.narrative || DIMENSION_INSIGHTS[key] || baseDimension.growthNote,
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




const maturityByCount = (count, sourceCount) => {
  if (count >= 8 && sourceCount >= 4) return 'Strongly Supported';
  if (count >= 5 && sourceCount >= 3) return 'Supported';
  if (count >= 3 && sourceCount >= 2) return 'Developing';
  return 'Emerging';
};

const confidenceFromEvidence = (count, sourceCount) => {
  const raw = 0.2 + (count * 0.08) + (sourceCount * 0.12);
  return Math.max(0.2, Math.min(0.95, +raw.toFixed(2)));
};

export const deriveEvidenceMaturity = (dimension = {}) => {
  const history = Array.isArray(dimension.history) ? dimension.history : [];
  const uniqueSources = [...new Set(history.map((item) => item?.source).filter(Boolean))];
  const weightedSources = Object.entries(dimension.evidenceWeights || {}).filter(([, v]) => v > 0).map(([k]) => k);
  const sources = [...new Set([...uniqueSources, ...weightedSources])];
  const evidenceCount = history.length;
  const sourceCount = sources.length;
  const latestEvidenceDate = history.map((item) => item?.capturedAt).filter(Boolean).sort().at(-1) || null;
  const maturityLabel = maturityByCount(evidenceCount, sourceCount);
  const interpretationStrength = maturityLabel === 'Strongly Supported' ? 'strong' : maturityLabel === 'Supported' ? 'supported' : maturityLabel === 'Developing' ? 'developing' : 'early';
  return {
    evidenceCount,
    simulationSources: sources,
    latestEvidenceDate,
    confidenceLevel: confidenceFromEvidence(evidenceCount, sourceCount),
    maturityLabel,
    interpretationStrength,
    observedMarkerCount: evidenceCount,
    sourceCount,
  };
};

export const evidenceCalibratedLanguage = {
  Emerging: {
    intro: 'Early evidence suggests this pattern may be forming.',
    note: 'More simulations are needed before this becomes a stable pattern.'
  },
  Developing: {
    intro: 'A pattern is beginning to appear across available simulations.',
    note: 'Current evidence is becoming more consistent and is worth watching.'
  },
  Supported: {
    intro: 'Repeated evidence suggests this pattern is becoming reliable.',
    note: 'This pattern has appeared across multiple simulations.'
  },
  'Strongly Supported': {
    intro: 'Consistent evidence across simulations suggests a stable pressure pattern.',
    note: 'This is one of the clearest findings in the profile.'
  }
};

const DISTORTION_LIBRARY = {
  avoider: {
    name: 'Avoider',
    pattern: 'Protecting stability by delaying direct tension.',
    looksLike: 'Difficult feedback or conflict conversations get postponed until urgency escalates.',
    why: 'Delay can erode trust because people feel uncertainty and mixed signals.',
    practice: 'Name the hard truth earlier, then pair it with a dignity-preserving path forward.',
  },
  controller: {
    name: 'Controller',
    pattern: 'Narrowing options to regain certainty under pressure.',
    looksLike: 'Fast decisions with limited input and reduced curiosity when stakes feel high.',
    why: 'Speed without shared meaning can weaken commitment and execution quality.',
    practice: 'Pause for one evidence check and one perspective check before final direction.',
  },
  rescuer: {
    name: 'Rescuer',
    pattern: 'Over-functioning for others to prevent discomfort.',
    looksLike: 'Taking on too much ownership and softening accountability language.',
    why: 'Short-term relief can reduce long-term growth and role clarity.',
    practice: 'Support clearly while returning ownership of next steps to the right person.',
  },
};

const DIMENSION_INSIGHTS = {
  regulationUnderPressure: 'Stability under pressure is forming, but live ambiguity still affects pacing.',
  humanAwareness: 'Evidence suggests growing attention to context behind surface behavior.',
  trustConstruction: 'Trust may weaken when urgency pushes interpretation too quickly.',
  realityAnchoring: 'Watch for moments where emotional load narrows evidence-gathering.',
  grayAreaLeadership: 'Context is being considered, but consistency still needs clearer explanation.',
  teamSystemsLeadership: 'System routines appear important but not yet fully developed in evidence.',
  instructionalAcademicLeadership: 'Instructional evidence is still early; future observation work will sharpen this.',
  visionChangeLeadership: 'Purpose language is present, but change leadership needs more behavioral evidence.',
};

export const createInterpretation = (profile, diagnosticResult, urbanReport) => {
  const values = Object.values(profile?.dimensions || {}).filter((d) => Number.isFinite(d.blendedCompositeScore));
  const sorted = [...values].sort((a,b)=>b.blendedCompositeScore-a.blendedCompositeScore);
  const top = sorted[0];
  const low = sorted[sorted.length-1];
  const distortionKey = (urbanReport?.distortions?.[0] || diagnosticResult?.topDistortions?.[0] || 'controller').toLowerCase();
  const distortion = DISTORTION_LIBRARY[distortionKey] || DISTORTION_LIBRARY.controller;
  const confidence = Math.round(((profile?.confidenceLevels?.blended || 0.35) * 100));
  return {
    pressureIdentity: distortion.name,
    emergingPattern: top ? `${top.label} is currently the strongest demonstrated capacity.` : 'Early evidence is still forming a clear strength pattern.',
    keyContradiction: top && low ? `You can show ${top.label.toLowerCase()} while ${low.label.toLowerCase()} softens under pressure.` : 'Need more evidence to define a core tension.',
    trustUnderStress: 'Under combined urgency and ambiguity, trust can drop when interpretation outruns inquiry.',
    mostFragileCapacity: low?.label || 'Needs more evidence',
    strongestCapacity: top?.label || 'Needs more evidence',
    recommendedCoachingFocus: `Coach for ${low?.label || 'trust construction'} with short cycles of evidence-check, intent naming, and clear next-step framing.`,
    nextBestStep: profile?.recommendations?.nextSimulation || 'Run Parent Call Rehearsal next to stress-test trust language.',
    confidenceNarrative: confidence >= 70 ? 'Confidence is strengthening because self-report and simulation evidence are converging.' : 'Confidence is moderate; additional simulations will sharpen signal reliability.',
    summary: `Your current evidence suggests a leader who values human context while pressure can narrow interpretation speed. ${top ? `${top.label} is the clearest current strength, and ${low?.label || 'a lower-capacity area'} is the key growth tension.` : 'The profile is still developing across dimensions.'} The next growth target is building trust while keeping reality anchoring active under live urgency.`,
    reflectionQuestion: `When urgency rises this week, how will you protect ${low?.label || 'your growth edge'} without losing relational trust?`,
    pressureIdentityDetails: [distortion],
  };
};
