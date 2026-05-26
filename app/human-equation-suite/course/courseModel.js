export const COURSE_EVIDENCE_KEY = 'humanEquationCourseEvidence';

export const factorCatalog = [
  { key: 'humanAwareness', slug: 'human-awareness', label: 'Human Awareness' },
  { key: 'regulationUnderPressure', slug: 'regulation-under-pressure', label: 'Regulation Under Pressure' },
  { key: 'trustConstruction', slug: 'trust-construction', label: 'Trust Construction' },
  { key: 'realityAnchoring', slug: 'reality-anchoring', label: 'Reality Anchoring' },
  { key: 'grayAreaLeadership', slug: 'gray-area-leadership', label: 'Gray Area Leadership' },
  { key: 'teamSystemsLeadership', slug: 'team-systems-leadership', label: 'Team & Systems Leadership' },
  { key: 'instructionalAcademicLeadership', slug: 'instructional-academic-leadership', label: 'Instructional & Academic Leadership' },
  { key: 'visionChangeLeadership', slug: 'vision-change-leadership', label: 'Vision & Change Leadership' },
];

const emptyFactor = () => ({ completed: false, score: null, dominantTendency: '', driftToWatch: '', recoveryMove: '', reflectionResponses: {}, interactionChoices: {}, completedAt: null });

export const createDefaultCourseEvidence = () => ({
  source: 'eight_factors_course',
  startedAt: null,
  updatedAt: null,
  completedFactors: 0,
  factorEvidence: Object.fromEntries(factorCatalog.map((f) => [f.key, emptyFactor()])),
  reflections: {},
  interactionEvidence: {},
  growthSignals: [],
  timelineEvents: [],
});

export const readCourseEvidence = () => {
  if (typeof window === 'undefined') return createDefaultCourseEvidence();
  const raw = JSON.parse(window.localStorage.getItem(COURSE_EVIDENCE_KEY) || 'null');
  return { ...createDefaultCourseEvidence(), ...(raw || {}), factorEvidence: { ...createDefaultCourseEvidence().factorEvidence, ...(raw?.factorEvidence || {}) } };
};

export const saveCourseEvidence = (updater) => {
  if (typeof window === 'undefined') return createDefaultCourseEvidence();
  const current = readCourseEvidence();
  const next = typeof updater === 'function' ? updater(current) : updater;
  const completedFactors = Object.values(next.factorEvidence || {}).filter((f) => f?.completed).length;
  const payload = { ...next, startedAt: next.startedAt || new Date().toISOString(), updatedAt: new Date().toISOString(), completedFactors };
  window.localStorage.setItem(COURSE_EVIDENCE_KEY, JSON.stringify(payload));
  return payload;
};
