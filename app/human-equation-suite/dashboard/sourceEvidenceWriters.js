import { addFactorImpact, createEvidenceEvent, saveEvidenceEvent } from './evidenceModel';

const toText = (value, fallback = '') => {
  if (typeof value === 'string') return value.trim() || fallback;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
};

const toIsoString = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toISOString();
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const markerFromDelta = (delta) => {
  if (delta >= 0.35) return 'positive';
  if (delta <= -0.25) return 'risk';
  return 'mixed';
};

const parentCallFactorLabels = {
  'Trust Construction': 'trustConstruction',
  'Human Awareness': 'humanAwareness',
  'Reality Anchoring': 'realityAnchoring',
  'Regulation Under Pressure': 'regulationUnderPressure',
  'Accountability Balance': 'grayAreaLeadership',
  'Vision & Change Leadership': 'visionChangeLeadership',
  'Instructional & Academic Leadership': 'instructionalAcademicLeadership',
  'Team & Systems Leadership': 'teamSystemsLeadership',
};

const parentLevelSignals = {
  strong: { delta: 0.85, confidence: 0.75, marker: 'positive' },
  developing: { delta: 0.35, confidence: 0.75, marker: 'mixed' },
  watch: { delta: -0.55, confidence: 0.75, marker: 'risk' },
};

export const buildParentCallEvidenceEvent = ({
  report,
  setupSnapshot,
  canonicalScenario,
  callEndedAt,
  callDuration,
  transcriptLines,
  parentCallerName,
}) => {
  const completedAt = callEndedAt || Date.now();
  const sourceId = String(completedAt);
  const factorImpacts = (Array.isArray(report?.humanEquationLeadershipAnalysis) ? report.humanEquationLeadershipAnalysis : [])
    .map((item) => {
      const factorId = parentCallFactorLabels[toText(item?.label)];
      if (!factorId) return null;
      const level = toText(item?.level).toLowerCase();
      const signal = parentLevelSignals[level] || { delta: 0.15, confidence: 0.55, marker: 'mixed' };
      return addFactorImpact(
        factorId,
        signal.delta,
        signal.confidence,
        signal.marker,
        toText(item?.evidence, 'Parent call coaching signal.'),
      );
    })
    .filter(Boolean);

  const scenarioTitle = toText(canonicalScenario?.title)
    || toText(setupSnapshot?.situationDescription)
    || toText(setupSnapshot?.scenarioType);
  const scenarioIssue = toText(canonicalScenario?.issue)
    || toText(canonicalScenario?.parentConcern)
    || toText(setupSnapshot?.callType);
  const transcriptLineCount = Array.isArray(transcriptLines) ? transcriptLines.length : 0;

  return createEvidenceEvent({
    sourceType: 'parent_call',
    evidenceType: 'post_call_coaching_report',
    sourceLabel: 'Parent Call Rehearsal',
    sourceId,
    summary: toText(report?.executiveSummary, 'Parent Call Rehearsal completed and coaching evidence captured.'),
    tags: ['parent-call', 'conversation', 'trust', 'pressure-practice'],
    weight: 1.0,
    factorImpacts,
    rawResponseReference: {
      callEndedAt: toIsoString(callEndedAt || completedAt),
      callDuration: toText(callDuration, 'Unknown'),
      scenarioTitle: scenarioTitle || null,
      scenarioIssue: scenarioIssue || null,
      parentArchetype: toText(setupSnapshot?.parentVoice) || null,
      parentName: toText(parentCallerName) || null,
      transcriptLineCount,
      reportSource: toText(report?.source) || null,
      apiStatus: toText(report?.apiStatus) || null,
    },
  });
};

export const saveParentCallEvidenceEvent = (payload) => saveEvidenceEvent(buildParentCallEvidenceEvent(payload));

const leadershipDomainMappings = {
  judgmentUnderPressure: {
    label: 'Judgment Under Pressure',
    factors: ['regulationUnderPressure', 'grayAreaLeadership', 'realityAnchoring'],
  },
  communicationLeadershipVoice: {
    label: 'Communication & Leadership Voice',
    factors: ['trustConstruction', 'humanAwareness', 'regulationUnderPressure'],
  },
  studentCenteredLeadership: {
    label: 'Student-Centered Leadership',
    factors: ['humanAwareness', 'instructionalAcademicLeadership'],
  },
  equityFairness: {
    label: 'Equity & Fairness',
    factors: ['grayAreaLeadership', 'humanAwareness'],
  },
  safetyRiskAwareness: {
    label: 'Safety & Risk Awareness',
    factors: ['realityAnchoring', 'regulationUnderPressure', 'grayAreaLeadership'],
  },
  operationalFollowThrough: {
    label: 'Operational Follow-Through',
    factors: ['teamSystemsLeadership', 'trustConstruction', 'visionChangeLeadership'],
  },
  instructionalLeadership: {
    label: 'Instructional Leadership',
    factors: ['instructionalAcademicLeadership'],
  },
};

const snapshotMappings = {
  trustBuilder: {
    label: 'Trust Builder',
    factors: ['trustConstruction'],
  },
  decisionSpeed: {
    label: 'Decision Speed',
    factors: ['regulationUnderPressure', 'realityAnchoring'],
  },
  authorityUnderPressure: {
    label: 'Authority Under Pressure',
    factors: ['regulationUnderPressure', 'grayAreaLeadership'],
  },
  operationalExecution: {
    label: 'Operational Execution',
    factors: ['teamSystemsLeadership', 'visionChangeLeadership'],
  },
};

const scoreToDelta = (score) => clamp((score - 70) / 30, -0.8, 1.0);

const snapshotRatingToDelta = (rating) => {
  const normalized = toText(rating).toLowerCase();
  if (normalized.includes('exceptional')) return 0.9;
  if (normalized.includes('strong')) return 0.65;
  if (normalized.includes('limited')) return -0.35;
  if (normalized.includes('concern')) return -0.65;
  if (normalized.includes('developing')) return 0.15;
  return 0.15;
};

export const buildLeadershipSimEvidenceEvent = ({ result, evaluationPayload, completedAt }) => {
  const stableCompletedAt = evaluationPayload?.timestamps?.completedAt
    || result?.completedAt
    || result?.savedAt
    || completedAt
    || new Date().toISOString();
  const numericConfidence = result?.evaluationSource === 'heuristic-fallback' ? 0.62 : 0.78;
  const factorImpacts = [];

  Object.entries(leadershipDomainMappings).forEach(([domainKey, mapping]) => {
    const score = Number(result?.domainScores?.[domainKey]);
    if (!Number.isFinite(score)) return;
    const delta = scoreToDelta(score);
    mapping.factors.forEach((factorId) => {
      factorImpacts.push(addFactorImpact(
        factorId,
        delta,
        numericConfidence,
        markerFromDelta(delta),
        `Leadership simulation domain signal: ${mapping.label}`,
      ));
    });
  });

  Object.entries(snapshotMappings).forEach(([snapshotKey, mapping]) => {
    const rating = result?.snapshot?.[snapshotKey];
    if (!rating) return;
    const delta = snapshotRatingToDelta(rating);
    mapping.factors.forEach((factorId) => {
      factorImpacts.push(addFactorImpact(
        factorId,
        delta,
        0.65,
        markerFromDelta(delta),
        `Leadership simulation domain signal: ${mapping.label}`,
      ));
    });
  });

  return createEvidenceEvent({
    sourceType: 'leadership_sim',
    evidenceType: 'simulation_evaluation_report',
    sourceLabel: 'School Leadership Simulation',
    sourceId: String(stableCompletedAt),
    summary: toText(
      result?.leadershipReadinessSummary,
      toText(result?.signatureLeadershipInsight, 'School Leadership Simulation completed and evaluation evidence captured.'),
    ),
    tags: ['leadership-sim', 'decision-making', 'systems', 'pressure-practice'],
    weight: 1.0,
    factorImpacts,
    rawResponseReference: {
      overallReadinessScore: result?.overallReadinessScore ?? null,
      readinessLevel: toText(result?.readinessLevel) || null,
      evaluationSource: toText(result?.evaluationSource) || null,
      apiStatus: toText(result?.apiStatus) || null,
      completedScenariosCount: Array.isArray(evaluationPayload?.completedScenarios) ? evaluationPayload.completedScenarios.length : 0,
      selectedDecisionsCount: Array.isArray(evaluationPayload?.selectedDecisions) ? evaluationPayload.selectedDecisions.length : 0,
      writtenResponsesCount: Array.isArray(evaluationPayload?.writtenResponses) ? evaluationPayload.writtenResponses.length : 0,
    },
  });
};

export const saveLeadershipSimEvidenceEvent = (payload) => saveEvidenceEvent(buildLeadershipSimEvidenceEvent(payload));
