import { dimensionDefinitions } from './profileData';

export const EVIDENCE_EVENTS_STORAGE_KEY = 'heq_evidence_events_v1';
export const LEADERSHIP_PROFILE_STORAGE_KEY = 'heq_leadership_profile_v2';

export const SOURCE_WEIGHTS = {
  diagnostic: 0.5,
  urban_sim: 1.0,
  parent_call: 1.5,
  leadership_sim: 1.5,
  written_artifact: 1.25,
  observation_lab: 1.35,
  course_reflection: 0.5,
  artifact: 1.25,
  written_response: 1.0,
  decision_point: 1.2,
};

const FACTOR_IDS = dimensionDefinitions.map((d) => d.key);

export const addFactorImpact = (factorId, delta, confidence = 0.6, marker = 'positive', note = '') => ({ factorId, delta, confidence, marker, note });

export const createEvidenceEvent = ({ userId = 'local-user', sourceType, sourceId, sourceLabel, factorImpacts = [], evidenceType = 'behavioral_choice', tags = [], summary = '', rawResponseReference = null, weight }) => ({
  id: `${sourceType}-${sourceId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  userId,
  sourceType,
  sourceId,
  sourceLabel,
  timestamp: new Date().toISOString(),
  factorImpacts,
  evidenceType,
  weight: weight ?? SOURCE_WEIGHTS[sourceType] ?? 1,
  tags,
  summary,
  rawResponseReference,
});

export const calculateFactorProfile = (events = [], factorId) => {
  const related = events.filter((e) => e.factorImpacts?.some((i) => i.factorId === factorId));
  const impacts = related.flatMap((e) => e.factorImpacts.filter((i) => i.factorId === factorId).map((i) => ({ ...i, sourceType: e.sourceType, timestamp: e.timestamp, effectiveWeight: (e.weight ?? 1) * (i.confidence ?? 0.6) })));
  if (!impacts.length) {
    return { totalEvidenceEvents: 0, weightedEvidence: 0, averageConfidence: 0, positiveMarkers: 0, riskMarkers: 0, latestUpdatedAt: null, sourceTypes: [], score: null, maturityLevel: 'No evidence yet', currentRead: 'Not enough evidence yet' };
  }
  const weightedEvidence = impacts.reduce((s, i) => s + Math.abs(i.delta) * i.effectiveWeight, 0);
  const weightedDelta = impacts.reduce((s, i) => s + (i.delta * i.effectiveWeight), 0);
  const averageConfidence = impacts.reduce((s, i) => s + (i.confidence ?? 0.6), 0) / impacts.length;
  const sourceTypes = [...new Set(related.map((e) => e.sourceType))];
  const count = impacts.length;
  const maturityLevel = count === 0 ? 'No evidence yet' : count === 1 ? 'Early signal' : count <= 3 ? 'Emerging' : count <= 7 ? 'Developing' : (count >= 12 && sourceTypes.length >= 3) ? 'Strongly supported' : (count >= 8 && sourceTypes.length >= 2) ? 'Supported' : 'Developing';
  const score = Math.max(1, Math.min(5, +(3 + (weightedDelta / Math.max(1, weightedEvidence)) * 1.8).toFixed(2)));
  return {
    totalEvidenceEvents: count,
    weightedEvidence: +weightedEvidence.toFixed(2),
    averageConfidence: +averageConfidence.toFixed(2),
    positiveMarkers: impacts.filter((i) => i.marker !== 'risk').length,
    riskMarkers: impacts.filter((i) => i.marker === 'risk').length,
    latestUpdatedAt: related.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]?.timestamp || null,
    sourceTypes,
    score,
    maturityLevel,
    currentRead: maturityLevel === 'No evidence yet' ? 'Not enough evidence yet' : maturityLevel === 'Early signal' ? 'More behavioral data needed.' : 'Pattern improving with accumulating evidence.',
  };
};

export const getEvidenceTimeline = (events = []) => [...events].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

export const getNextRecommendedSimulation = (events = []) => {
  const counts = Object.fromEntries(FACTOR_IDS.map((id) => [id, calculateFactorProfile(events, id).totalEvidenceEvents]));
  const weakest = Object.entries(counts).sort((a, b) => a[1] - b[1])[0]?.[0];
  if (!weakest) return 'Leadership Diagnostic';
  if (['regulationUnderPressure', 'trustConstruction', 'realityAnchoring'].includes(weakest)) return 'Parent Call Rehearsal';
  if (['teamSystemsLeadership', 'visionChangeLeadership', 'grayAreaLeadership'].includes(weakest)) return 'Leadership Simulation';
  if (['instructionalAcademicLeadership'].includes(weakest)) return 'Observation Lab';
  return 'Urban Student Simulation';
};

export const resetLeadershipProfile = () => {
  if (typeof window === 'undefined') return;
  const keys = [
    'humanEquationDiagnosticResult',
    'humanEquationUrbanReport',
    'heq_master_profile_v1',
    LEADERSHIP_PROFILE_STORAGE_KEY,
    EVIDENCE_EVENTS_STORAGE_KEY,
    'humanEquationParentCallEvidence',
    'humanEquationLeadershipSimulationEvidence',
    'humanEquationObservationEvidence',
  ];
  keys.forEach((k) => window.localStorage.removeItem(k));
};
