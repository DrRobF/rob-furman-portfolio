'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
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

const dimensionLayers = [
  { title: 'Foundational Human Capacities', keys: ['regulationUnderPressure', 'humanAwareness', 'trustConstruction'] },
  { title: 'Applied Leadership Judgment', keys: ['realityAnchoring', 'grayAreaLeadership'] },
  { title: 'Organizational Leadership Expression', keys: ['teamSystemsLeadership', 'instructionalAcademicLeadership', 'visionChangeLeadership'] },
];

const distortionDetails = {
  harmonizer: 'May over-prioritize immediate peace or approval.', loyalist: 'May over-index on alignment to authority, even when local realities need adaptation.',
  controller: 'May tighten control too quickly and reduce shared ownership.', performer: 'May protect image, polish, or external confidence before fully facing messy reality.',
  martyr: 'May carry too much personally and underuse distributed leadership.', reactor: 'May move into urgency responses before deeper reflection.',
  avoider: 'May delay hard conversations that need timely engagement.', hero: 'May over-function instead of building sustainable team capacity.',
  defender: 'May protect people or positions so strongly that learning is reduced.', detachedLeader: 'May default to distance and analysis when relational presence is needed most.',
};

const distortionsList = ['harmonizer', 'loyalist', 'controller', 'performer', 'martyr', 'reactor', 'avoider', 'hero', 'defender', 'detachedLeader'];
const titleCase = (value) => value.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim();
const progressMessages = ['Building your leadership profile…', 'Refining your profile…', 'Checking pressure patterns…', 'Filling in missing signals…'];

const likertOptions = [1, 2, 3, 4, 5];

const questionPool = [
  { id: 'belief-trustConstruction', section: 'Leadership Belief Tensions', sectionKey: 'belief', dimension: 'trustConstruction', prompt: 'Teachers and families trust leaders more when they remain consistent, even when individual situations feel emotionally compelling.', type: 'likert', options: likertOptions, reverseScored: false, tags: ['belief-tension'], distortionSignals: { loyalist: 1 }, followUpTriggers: ['harmony'], isCore: true },
  { id: 'belief-humanAwareness', section: 'Leadership Belief Tensions', sectionKey: 'belief', dimension: 'humanAwareness', prompt: 'Understanding the emotion underneath a conflict is just as important as resolving the surface problem.', type: 'likert', options: likertOptions, reverseScored: false, tags: ['belief-tension'], distortionSignals: { harmonizer: 1 }, followUpTriggers: ['harmony'], isCore: true },
  { id: 'belief-realityAnchoring', section: 'Leadership Belief Tensions', sectionKey: 'belief', dimension: 'realityAnchoring', prompt: 'When conflict escalates publicly, leaders should project certainty quickly, even before every detail is known.', type: 'likert', options: likertOptions, reverseScored: true, tags: ['certainty'], distortionSignals: { performer: 1, controller: 1 }, followUpTriggers: ['controlCertainty', 'imagePolish'], isCore: true },
  { id: 'belief-regulationUnderPressure', section: 'Leadership Belief Tensions', sectionKey: 'belief', dimension: 'regulationUnderPressure', prompt: 'A leader’s calm presence matters more than having the perfect answer in the first difficult moment.', type: 'likert', options: likertOptions, reverseScored: false, tags: ['presence'], distortionSignals: { reactor: 1 }, followUpTriggers: ['detachedUrgency'], isCore: true },
  { id: 'self-grayAreaLeadership', section: 'Self-Perception Under Pressure', sectionKey: 'self', dimension: 'grayAreaLeadership', prompt: 'When fairness and flexibility collide, I can explain my decision without sounding inconsistent or rigid.', type: 'likert', options: likertOptions, reverseScored: false, tags: ['self-perception'], distortionSignals: { avoider: 1 }, followUpTriggers: ['consistencyAccountability'], isCore: true },
  { id: 'self-teamSystemsLeadership', section: 'Self-Perception Under Pressure', sectionKey: 'self', dimension: 'teamSystemsLeadership', prompt: 'When pressure rises, I protect my team without hiding problems or pretending everything is fine.', type: 'likert', options: likertOptions, reverseScored: false, tags: ['self-perception'], distortionSignals: { martyr: 1 }, followUpTriggers: ['selfSacrifice'], isCore: true },
  { id: 'self-visionChangeLeadership', section: 'Self-Perception Under Pressure', sectionKey: 'self', dimension: 'visionChangeLeadership', prompt: 'When people resist change, I can connect the change back to purpose instead of just pushing compliance.', type: 'likert', options: likertOptions, reverseScored: false, tags: ['self-perception'], distortionSignals: { detachedLeader: 1 }, followUpTriggers: ['detachedUrgency'], isCore: true },
  { id: 'self-instructionalAcademicLeadership', section: 'Self-Perception Under Pressure', sectionKey: 'self', dimension: 'instructionalAcademicLeadership', prompt: 'When giving academic or instructional feedback, I can be honest without making the other person feel attacked.', type: 'likert', options: likertOptions, reverseScored: false, tags: ['self-perception'], distortionSignals: { harmonizer: 1 }, followUpTriggers: ['consistencyAccountability'], isCore: true },
  { id: 'scenario-1', section: 'Pressure Scenarios', sectionKey: 'scenario', dimension: 'multi', prompt: 'A parent strongly disagrees with a consequence. The teacher expects consistency, but the family asks for flexibility based on context. What feels most important to protect first?', type: 'scenario', options: [
    { id: 'a', label: 'Preserve trust through transparent dialogue and shared next steps.', dims: { trustConstruction: 2, humanAwareness: 1 }, distortions: { harmonizer: 1 } },
    { id: 'b', label: 'Protect policy consistency so no one questions fairness.', dims: { realityAnchoring: 1, teamSystemsLeadership: 2 }, distortions: { loyalist: 1, controller: 1 } },
    { id: 'c', label: 'Keep the interaction calm and gather context before deciding.', dims: { regulationUnderPressure: 2, grayAreaLeadership: 1 }, distortions: { avoider: 1 } },
    { id: 'd', label: 'Move quickly to keep the situation from escalating publicly.', dims: { visionChangeLeadership: 1, regulationUnderPressure: 1 }, distortions: { performer: 1, reactor: 1 } },
  ], reverseScored: false, tags: ['scenario'], distortionSignals: {}, followUpTriggers: ['controlCertainty', 'harmony'], isCore: true },
  { id: 'scenario-2', section: 'Pressure Scenarios', sectionKey: 'scenario', dimension: 'multi', prompt: 'Your district announces a rapid initiative that staff view as disconnected from classroom realities. What is your first move?', type: 'scenario', options: [
    { id: 'a', label: 'Translate the why, acknowledge concern, and co-design rollout checkpoints.', dims: { visionChangeLeadership: 2, trustConstruction: 1 }, distortions: { hero: 1 } },
    { id: 'b', label: 'Set strict implementation expectations to avoid drift.', dims: { teamSystemsLeadership: 2, realityAnchoring: 1 }, distortions: { controller: 2 } },
    { id: 'c', label: 'Delay launch conversations until emotions cool and guidance is clearer.', dims: { regulationUnderPressure: 1, grayAreaLeadership: 1 }, distortions: { avoider: 2 } },
    { id: 'd', label: 'Publicly align upward first, then troubleshoot privately later.', dims: { teamSystemsLeadership: 1, visionChangeLeadership: 1 }, distortions: { loyalist: 2 } },
  ], reverseScored: false, tags: ['scenario'], distortionSignals: {}, followUpTriggers: ['detachedUrgency', 'selfSacrifice'], isCore: true },
  { id: 'scenario-3', section: 'Pressure Scenarios', sectionKey: 'scenario', dimension: 'multi', prompt: 'Two teachers conflict over student behavior support. Both feel unheard and each has community backing. What do you prioritize?', type: 'scenario', options: [
    { id: 'a', label: 'Center the student evidence and create a shared problem-solving protocol.', dims: { instructionalAcademicLeadership: 2, realityAnchoring: 1 }, distortions: { detachedLeader: 1 } },
    { id: 'b', label: 'Protect relationships first by softening difficult truths for now.', dims: { humanAwareness: 2, trustConstruction: 1 }, distortions: { harmonizer: 2 } },
    { id: 'c', label: 'Take ownership yourself and mediate each part personally.', dims: { regulationUnderPressure: 1, teamSystemsLeadership: 1 }, distortions: { martyr: 1, hero: 2 } },
    { id: 'd', label: 'Draw a hard line quickly to prevent ongoing disruption.', dims: { teamSystemsLeadership: 2, grayAreaLeadership: 1 }, distortions: { defender: 1, controller: 1 } },
  ], reverseScored: false, tags: ['scenario'], distortionSignals: {}, followUpTriggers: ['consistencyAccountability'], isCore: true },
  { id: 'scenario-4', section: 'Pressure Scenarios', sectionKey: 'scenario', dimension: 'multi', prompt: 'A vocal stakeholder challenges your leadership in a public meeting with partial information. How do you respond first?', type: 'scenario', options: [
    { id: 'a', label: 'Regulate, acknowledge concern, and commit to verified follow-up data.', dims: { regulationUnderPressure: 2, realityAnchoring: 2 }, distortions: { performer: 1 } },
    { id: 'b', label: 'Defend your team forcefully to show unity.', dims: { trustConstruction: 1, teamSystemsLeadership: 1 }, distortions: { defender: 2, reactor: 1 } },
    { id: 'c', label: 'Redirect quickly to protect confidence in your leadership image.', dims: { visionChangeLeadership: 1 }, distortions: { performer: 2 } },
    { id: 'd', label: 'Table the issue and continue agenda to avoid escalation.', dims: { grayAreaLeadership: 1 }, distortions: { detachedLeader: 1, avoider: 1 } },
  ], reverseScored: false, tags: ['scenario'], distortionSignals: {}, followUpTriggers: ['imagePolish'], isCore: true },

  { id: 'probe-control-1', section: 'Adaptive Probe', sectionKey: 'probe', dimension: 'realityAnchoring', prompt: 'Leaders sometimes need to sound certain before they feel certain, because people need stability in the moment.', type: 'likert', options: likertOptions, reverseScored: true, tags: ['control'], distortionSignals: { controller: 1, performer: 1 }, followUpTriggers: [], isCore: false, probeCategory: 'controlCertainty' },
  { id: 'probe-control-2', section: 'Adaptive Probe', sectionKey: 'probe', dimension: 'grayAreaLeadership', prompt: 'Treating similar situations differently can still be fair if the underlying principle is clear.', type: 'likert', options: likertOptions, reverseScored: false, tags: ['ambiguity'], distortionSignals: { loyalist: 1 }, followUpTriggers: [], isCore: false, probeCategory: 'controlCertainty' },
  { id: 'probe-harmony-1', section: 'Adaptive Probe', sectionKey: 'probe', dimension: 'trustConstruction', prompt: 'Keeping relationships intact is sometimes worth delaying a hard accountability conversation.', type: 'likert', options: likertOptions, reverseScored: false, tags: ['harmony'], distortionSignals: { harmonizer: 2, avoider: 1 }, followUpTriggers: [], isCore: false, probeCategory: 'consistencyAccountability' },
  { id: 'probe-harmony-2', section: 'Adaptive Probe', sectionKey: 'probe', dimension: 'teamSystemsLeadership', prompt: 'Staff trust is damaged more by inconsistent protection than by difficult accountability.', type: 'likert', options: likertOptions, reverseScored: false, tags: ['accountability'], distortionSignals: { defender: 1 }, followUpTriggers: [], isCore: false, probeCategory: 'consistencyAccountability' },
  { id: 'probe-martyr-1', section: 'Adaptive Probe', sectionKey: 'probe', dimension: 'teamSystemsLeadership', prompt: 'Strong leaders absorb pressure themselves so teachers can stay focused on students.', type: 'likert', options: likertOptions, reverseScored: false, tags: ['martyr'], distortionSignals: { martyr: 2, hero: 1 }, followUpTriggers: [], isCore: false, probeCategory: 'selfSacrifice' },
  { id: 'probe-martyr-2', section: 'Adaptive Probe', sectionKey: 'probe', dimension: 'visionChangeLeadership', prompt: 'If I can keep strain off my team by carrying it myself, that is usually the right leadership move.', type: 'likert', options: likertOptions, reverseScored: false, tags: ['over-functioning'], distortionSignals: { hero: 2 }, followUpTriggers: [], isCore: false, probeCategory: 'selfSacrifice' },
  { id: 'probe-optics-1', section: 'Adaptive Probe', sectionKey: 'probe', dimension: 'realityAnchoring', prompt: 'In a public conflict, protecting confidence in leadership may matter as much as getting every detail right immediately.', type: 'likert', options: likertOptions, reverseScored: true, tags: ['optics'], distortionSignals: { performer: 2 }, followUpTriggers: [], isCore: false, probeCategory: 'imagePolish' },
  { id: 'probe-optics-2', section: 'Adaptive Probe', sectionKey: 'probe', dimension: 'trustConstruction', prompt: 'When uncertainty is high, polished communication can prevent panic even if the full story is still emerging.', type: 'likert', options: likertOptions, reverseScored: true, tags: ['optics'], distortionSignals: { performer: 1, loyalist: 1 }, followUpTriggers: [], isCore: false, probeCategory: 'imagePolish' },
  { id: 'probe-detached-1', section: 'Adaptive Probe', sectionKey: 'probe', dimension: 'regulationUnderPressure', prompt: 'Not every problem needs immediate leadership involvement; sometimes stepping back is the healthiest response.', type: 'likert', options: likertOptions, reverseScored: false, tags: ['detached'], distortionSignals: { detachedLeader: 2 }, followUpTriggers: [], isCore: false, probeCategory: 'detachedUrgency' },
  { id: 'probe-detached-2', section: 'Adaptive Probe', sectionKey: 'probe', dimension: 'teamSystemsLeadership', prompt: 'If the team can figure it out without me, delayed engagement is often better than quick intervention.', type: 'likert', options: likertOptions, reverseScored: false, tags: ['ownership'], distortionSignals: { detachedLeader: 1, avoider: 1 }, followUpTriggers: [], isCore: false, probeCategory: 'detachedUrgency' },
  { id: 'probe-awareness-1', section: 'Adaptive Probe', sectionKey: 'probe', dimension: 'humanAwareness', prompt: 'A parent’s anger often makes more sense when you understand what they are afraid of losing.', type: 'likert', options: likertOptions, reverseScored: false, tags: ['human-awareness'], distortionSignals: { harmonizer: 1 }, followUpTriggers: [], isCore: false, probeCategory: 'consistencyAccountability' },
  { id: 'probe-gray-1', section: 'Adaptive Probe', sectionKey: 'probe', dimension: 'grayAreaLeadership', prompt: 'Leaders can preserve fairness while making exceptions, as long as the rationale is explicit and repeatable.', type: 'likert', options: likertOptions, reverseScored: false, tags: ['gray-area'], distortionSignals: { controller: 1 }, followUpTriggers: [], isCore: false, probeCategory: 'controlCertainty' },
];

const coreQuestions = questionPool.filter((q) => q.isCore);
const questionById = Object.fromEntries(questionPool.map((q) => [q.id, q]));
const HARD_QUESTION_CAP = 32;
const MIN_SCENARIO_PROBE_QUESTIONS = 6;
const SOFT_TARGET_SECONDS = 600;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const computeResults = (answers, questionFlow) => {
  const seed = Object.fromEntries(dimensions.map((d) => [d.key, { beliefTotal: 0, beliefCount: 0, selfTotal: 0, selfCount: 0, scenarioSignalTotal: 0, scenarioCount: 0, probeTotal: 0, probeCount: 0 }]));
  const distortions = Object.fromEntries(distortionsList.map((d) => [d, 0]));
  questionFlow.forEach((qid) => {
    const q = questionById[qid];
    const answer = answers[qid];
    if (!q || answer === undefined) return;
    if (q.type === 'likert' && q.dimension && q.dimension !== 'multi') {
      const raw = Number(answer || 0);
      const scored = q.reverseScored && raw ? 6 - raw : raw;
      if (q.sectionKey === 'belief') { seed[q.dimension].beliefTotal += scored; seed[q.dimension].beliefCount += 1; }
      if (q.sectionKey === 'self') { seed[q.dimension].selfTotal += scored; seed[q.dimension].selfCount += 1; }
      if (q.sectionKey === 'probe') { seed[q.dimension].probeTotal += scored; seed[q.dimension].probeCount += 1; }
      Object.entries(q.distortionSignals || {}).forEach(([key, val]) => { distortions[key] += val * (scored >= 4 ? 1 : 0.5); });
    }
    if (q.sectionKey === 'scenario') {
      const picked = q.options.find((opt) => opt.id === answer);
      if (!picked) return;
      Object.entries(picked.dims || {}).forEach(([key, val]) => { seed[key].scenarioSignalTotal += val; seed[key].scenarioCount += 1; });
      Object.entries(picked.distortions || {}).forEach(([key, val]) => { distortions[key] += val; });
    }
  });
  const normalized = Object.fromEntries(dimensions.map((d) => {
    const item = seed[d.key];
    const belief = item.beliefCount ? item.beliefTotal / item.beliefCount : null;
    const selfImplementation = item.selfCount ? item.selfTotal / item.selfCount : null;
    const scenarioSignal = item.scenarioCount ? clamp(2 + (item.scenarioSignalTotal / item.scenarioCount), 1, 5) : null;
    const probeSignal = item.probeCount ? item.probeTotal / item.probeCount : null;
    const present = [belief, selfImplementation, scenarioSignal, probeSignal].filter((v) => Number.isFinite(v));
    const totalSignalCount = item.beliefCount + item.selfCount + item.scenarioCount + item.probeCount;
    const hasMeaningful = totalSignalCount >= 1;
    const preferredCoverage = totalSignalCount >= 2;
    const composite = present.length ? clamp(Number((present.reduce((a, b) => a + b, 0) / present.length).toFixed(2)), 1, 5) : null;
    const confidenceLevel = totalSignalCount >= 4 ? 'strong' : totalSignalCount >= 2 ? 'baseline' : totalSignalCount >= 1 ? 'early' : 'insufficient';
    return [d.key, { belief: belief ? Number(belief.toFixed(2)) : null, selfImplementation: selfImplementation ? Number(selfImplementation.toFixed(2)) : null, scenarioSignal: scenarioSignal ? Number(scenarioSignal.toFixed(2)) : null, probeSignal: probeSignal ? Number(probeSignal.toFixed(2)) : null, composite, confidenceLevel, beliefCount: item.beliefCount, selfImplementationCount: item.selfCount, scenarioCount: item.scenarioCount, probeCount: item.probeCount, totalSignalCount, hasMeaningful, preferredCoverage }];
  }));
  const scenarioProbeAnsweredCount = questionFlow.reduce((count, qid) => {
    const q = questionById[qid];
    if (!q || answers[qid] === undefined) return count;
    return (q.sectionKey === 'scenario' || q.sectionKey === 'probe') ? count + 1 : count;
  }, 0);
  return { normalized, distortions, scenarioProbeAnsweredCount };
};

const evaluateSignalSufficiency = (answers, questionFlow) => {
  const { normalized, scenarioProbeAnsweredCount } = computeResults(answers, questionFlow);
  const dimensionsMissingSufficiency = dimensions.filter((d) => {
    const item = normalized[d.key];
    const hasTwoSignals = item.totalSignalCount >= 2;
    const hasBehaviorOrSelfSignal = (item.scenarioCount + item.probeCount) >= 1 || item.selfImplementationCount >= 1;
    return !hasTwoSignals || !hasBehaviorOrSelfSignal;
  }).map((d) => d.key);
  const hasMinScenarioProbe = scenarioProbeAnsweredCount >= MIN_SCENARIO_PROBE_QUESTIONS;
  return { isSufficient: dimensionsMissingSufficiency.length === 0 && hasMinScenarioProbe, dimensionsMissingSufficiency, hasMinScenarioProbe, scenarioProbeAnsweredCount, normalized };
};

const chooseNextProbe = (answers, questionFlow) => {
  const asked = new Set(questionFlow);
  const { normalized, distortions } = computeResults(answers, questionFlow);
  const distortionRank = Object.entries(distortions).sort((a, b) => b[1] - a[1]).map(([key]) => key);
  const distortionCategoryMap = {
    controller: ['controlCertainty'], performer: ['imagePolish'], harmonizer: ['consistencyAccountability'], loyalist: ['controlCertainty', 'imagePolish'],
    martyr: ['selfSacrifice'], hero: ['selfSacrifice'], detachedLeader: ['detachedUrgency'], avoider: ['detachedUrgency', 'consistencyAccountability'], defender: ['consistencyAccountability'], reactor: ['detachedUrgency'],
  };
  const dimensionPriority = [...dimensions].sort((a, b) => {
    const aN = normalized[a.key];
    const bN = normalized[b.key];
    const aMissingScenario = (aN.scenarioCount + aN.probeCount) === 0 ? -1 : 0;
    const bMissingScenario = (bN.scenarioCount + bN.probeCount) === 0 ? -1 : 0;
    const aGap = Math.abs((aN.belief ?? 0) - (aN.selfImplementation ?? 0));
    const bGap = Math.abs((bN.belief ?? 0) - (bN.selfImplementation ?? 0));
    return (aN.totalSignalCount - bN.totalSignalCount) || (aMissingScenario - bMissingScenario) || (bGap - aGap);
  });
  const mapping = {
    realityAnchoring: ['controlCertainty', 'imagePolish'], humanAwareness: ['consistencyAccountability'], regulationUnderPressure: ['detachedUrgency'],
    teamSystemsLeadership: ['selfSacrifice', 'consistencyAccountability', 'detachedUrgency'], trustConstruction: ['consistencyAccountability', 'imagePolish'],
    grayAreaLeadership: ['controlCertainty', 'consistencyAccountability'], visionChangeLeadership: ['selfSacrifice', 'detachedUrgency'], instructionalAcademicLeadership: ['consistencyAccountability', 'controlCertainty'],
  };
  const preferredCategories = [];
  dimensionPriority.forEach((d) => (mapping[d.key] || []).forEach((c) => preferredCategories.push(c)));
  distortionRank.slice(0, 3).forEach((dist) => (distortionCategoryMap[dist] || []).forEach((c) => preferredCategories.push(c)));
  for (const category of preferredCategories) {
    const candidate = questionPool.find((q) => !q.isCore && q.probeCategory === category && !asked.has(q.id));
    if (candidate) return candidate.id;
  }
  return questionPool.find((q) => !q.isCore && !asked.has(q.id))?.id || null;
};

export default function HumanEquationDiagnosticPage() {
  const { language } = useLanguage();
  const es = language === 'es';
  const [started, setStarted] = useState(false);
  const [viewResults, setViewResults] = useState(false);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [insightMessage, setInsightMessage] = useState('');
  const [showDebugData, setShowDebugData] = useState(false);
  const [signalScores, setSignalScores] = useState({ controlCertainty: 0, consistencyAccountability: 0, selfSacrifice: 0, imagePolish: 0, detachedUrgency: 0 });
  const [questionFlow, setQuestionFlow] = useState(coreQuestions.map((q) => q.id));
  const [startedAt, setStartedAt] = useState(null);
  const [completionReason, setCompletionReason] = useState(null);
  const [triggeredProbeCategories, setTriggeredProbeCategories] = useState([]);
  const alreadyAdvancingRef = useRef(false);

  const currentQuestion = questionById[questionFlow[currentQuestionIndex]];
  const completedCount = Object.keys(answers).length;
  const unansweredQuestionExists = questionFlow.some((qid) => answers[qid] === undefined);
  const isComplete = Boolean(completionReason) || (!unansweredQuestionExists && !questionById[questionFlow[currentQuestionIndex]]);
  const coverageProgress = useMemo(() => {
    const { normalized } = computeResults(answers, questionFlow);
    const points = dimensions.reduce((total, d) => {
      const item = normalized[d.key];
      if (item.totalSignalCount >= 2) return total + 1;
      if (item.totalSignalCount >= 1) return total + 0.5;
      return total;
    }, 0);
    return (points / dimensions.length) * 100;
  }, [answers, questionFlow]);
  const progressPercent = isComplete
    ? 100
    : clamp(Math.round((Math.min(completedCount, coreQuestions.length) / coreQuestions.length) * 55 + (coverageProgress * 0.45)), 0, 100);
  const progressMessage = progressMessages[Math.min(progressMessages.length - 1, Math.floor(progressPercent / 25))];

  const resolveCompletionReason = (nextAnswers, nextFlow) => {
    if (nextFlow.length >= HARD_QUESTION_CAP) return 'max_questions';
    const sufficiency = evaluateSignalSufficiency(nextAnswers, nextFlow);
    if (sufficiency.isSufficient) return 'sufficient_signal';
    return null;
  };

  const setAnswer = (question, value) => {
    if (alreadyAdvancingRef.current || isComplete) return;
    alreadyAdvancingRef.current = true;
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    setSignalScores((prev) => {
      const next = { ...prev };
      if (question.followUpTriggers?.includes('controlCertainty') && Number(value) >= 4) next.controlCertainty += 1;
      if (question.followUpTriggers?.includes('consistencyAccountability') && Number(value) >= 4) next.consistencyAccountability += 1;
      if (question.followUpTriggers?.includes('selfSacrifice') && Number(value) >= 4) next.selfSacrifice += 1;
      if (question.followUpTriggers?.includes('imagePolish') && Number(value) >= 4) next.imagePolish += 1;
      if (question.followUpTriggers?.includes('detachedUrgency') && Number(value) >= 4) next.detachedUrgency += 1;
      if (question.sectionKey === 'scenario') {
        const picked = question.options.find((option) => option.id === value);
        if ((picked?.distortions?.controller || 0) > 0) next.controlCertainty += 1;
        if ((picked?.distortions?.harmonizer || 0) > 0) next.consistencyAccountability += 1;
        if ((picked?.distortions?.martyr || 0) > 0 || (picked?.distortions?.hero || 0) > 0) next.selfSacrifice += 1;
        if ((picked?.distortions?.performer || 0) > 0) next.imagePolish += 1;
        if ((picked?.distortions?.detachedLeader || 0) > 0 || (picked?.distortions?.avoider || 0) > 0) next.detachedUrgency += 1;
      }
      return next;
    });

    setInsightMessage('Interesting tension.');
    setTimeout(() => setInsightMessage(''), 1000);
    const nextAnswers = { ...answers, [question.id]: value };
    let nextFlow = [...questionFlow];
    const allAnswered = nextFlow.every((qid) => nextAnswers[qid] !== undefined);
    if (allAnswered && nextFlow.length < HARD_QUESTION_CAP) {
      const elapsedSeconds = startedAt ? (Date.now() - startedAt) / 1000 : 0;
      const canEnd = resolveCompletionReason(nextAnswers, nextFlow) === 'sufficient_signal';
      if (!canEnd && elapsedSeconds < SOFT_TARGET_SECONDS + 120) {
        const nextProbeId = chooseNextProbe(nextAnswers, nextFlow);
        if (nextProbeId) {
          nextFlow = [...nextFlow, nextProbeId];
          setQuestionFlow(nextFlow);
          const probeCategory = questionById[nextProbeId]?.probeCategory;
          if (probeCategory) {
            setTriggeredProbeCategories((prev) => (prev.includes(probeCategory) ? prev : [...prev, probeCategory]));
          }
        } else {
          setCompletionReason('no_questions_available');
        }
      } else if (!canEnd && nextFlow.length >= HARD_QUESTION_CAP) {
        setCompletionReason('max_questions');
      }
    }
    const resolved = resolveCompletionReason(nextAnswers, nextFlow);
    if (resolved) setCompletionReason(resolved);
    if (!resolved && currentQuestionIndex < nextFlow.length - 1) {
      setCurrentQuestionIndex((idx) => Math.min(idx + 1, nextFlow.length - 1));
    } else if (!resolved && !questionById[nextFlow[currentQuestionIndex]]) {
      setCompletionReason('no_questions_available');
    }
    setTimeout(() => {
      alreadyAdvancingRef.current = false;
    }, 0);
  };

  const result = useMemo(() => {
    const { normalized, distortions } = computeResults(answers, questionFlow);

    const ranked = dimensions.map((d) => ({ key: d.key, label: d.label, ...normalized[d.key], gap: Number((((normalized[d.key].belief || 0) - (normalized[d.key].selfImplementation || 0)).toFixed(2)) ) })).sort((a, b) => (b.composite || 0) - (a.composite || 0));
    const topDistortions = Object.entries(distortions).filter(([, v]) => v >= 2).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([key]) => key);

    return {
      dimensions: normalized,
      distortions,
      topDistortions,
      topStrengths: ranked.slice(0, 3).map((r) => r.label),
      growthEdges: ranked.slice(-3).map((r) => r.label),
      pressureProfileTitle: (ranked[0]?.composite || 0) >= 4 ? 'Anchored Integrative Leadership Profile' : (ranked[0]?.composite || 0) >= 3 ? 'Developing Adaptive Leadership Profile' : 'Emerging Leadership Pressure Profile',
      narrativeSummary: `Your current profile suggests strongest baseline capacity in ${ranked.slice(0, 2).map((r) => r.label).join(' and ')}.`,
      baselineConfidence: dimensions.every((d) => normalized[d.key].totalSignalCount >= 2) ? 'Stronger initial signal' : 'Early profile',
      distortionConfidenceLabel: topDistortions.length ? null : 'Pressure drift is still emerging',
      metadata: { questionsAnswered: completedCount, dimensionConfidence: Object.fromEntries(dimensions.map((d) => [d.key, normalized[d.key].confidenceLevel])) },
    };
  }, [answers, questionFlow, completedCount]);

  return (<section className="section section-light"><div className="container"><LanguageSwitcher />
    <p className="eyebrow">Human Equation Suite</p><h1>{es ? 'Diagnóstico de Presión de Liderazgo' : 'Leadership Pressure Diagnostic'}</h1>
    <p className="lead">{es ? 'Establece tu perfil base antes de las simulaciones. Este diagnóstico refleja lo que valoras, cómo lideras bajo presión y hacia qué puedes derivar en tensión.' : 'Establish your baseline profile before simulations. This diagnostic reflects what you value, how you implement under pressure, and where you may drift in tension.'}</p>
    <div className="button-row"><button className="button primary" onClick={() => { setStarted(true); setViewResults(false); setCurrentQuestionIndex(0); setQuestionFlow(coreQuestions.map((q) => q.id)); setStartedAt(Date.now()); setAnswers({}); setSignalScores({ controlCertainty: 0, consistencyAccountability: 0, selfSacrifice: 0, imagePolish: 0, detachedUrgency: 0 }); setCompletionReason(null); setTriggeredProbeCategories([]); }}>Start Diagnostic</button><button className="button secondary" disabled={!isComplete} onClick={() => setViewResults(true)}>View Results</button><Link href="/human-equation" className="button secondary">Continue to Parent Call Rehearsal</Link><Link href="/human-equation-suite" className="button secondary">Back to Human Equation Suite</Link></div>

    {started && !viewResults && currentQuestion && !isComplete && (<div className="top-space card project-card" style={{ maxWidth: 880, marginInline: 'auto', transition: 'all 250ms ease' }}>
      <p className="eyebrow">{currentQuestion.section}</p>
      <progress max="100" value={progressPercent} style={{ width: '100%' }} />
      <p className="top-space-sm"><em>{progressMessage}</em></p>
      <h3 className="top-space">{currentQuestion.prompt}</h3>
      {(currentQuestion.sectionKey === 'belief' || currentQuestion.sectionKey === 'self' || currentQuestion.sectionKey === 'probe') && <p className="top-space-sm"><strong>Scale:</strong> 1 = Strongly disagree, 2 = Disagree, 3 = It depends / mixed, 4 = Agree, 5 = Strongly agree</p>}
      <div className="top-space-sm" style={{ display: 'grid', gap: 10 }}>
        {currentQuestion.sectionKey === 'scenario' ? currentQuestion.options.map((o) => <button key={o.id} className={`button secondary ${answers[currentQuestion.id] === o.id ? 'active' : ''}`} onClick={() => setAnswer(currentQuestion, o.id)}>{o.label}</button>) : likertOptions.map((n) => <button key={n} className={`button secondary ${answers[currentQuestion.id] === n ? 'active' : ''}`} onClick={() => setAnswer(currentQuestion, n)}>{n}</button>)}
      </div>
      {insightMessage && <p className="top-space-sm" style={{ opacity: 0.85 }}><em>{insightMessage}</em></p>}
      <div className="button-row top-space-sm"><button className="button secondary" disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex((idx) => Math.max(0, idx - 1))}>Back</button><button className="button secondary" disabled={!isComplete} onClick={() => setViewResults(true)}>Finish & View Results</button></div>
    </div>)}
    {started && !viewResults && isComplete && <div className="top-space card project-card" style={{ maxWidth: 880, marginInline: 'auto' }}>
      <progress max="100" value={100} style={{ width: '100%' }} />
      <h3 className="top-space">Your baseline profile is ready.</h3>
      <p>We have enough signal to generate your first Human Equation profile. Simulations will add behavioral evidence over time.</p>
      <button className="button primary top-space-sm" onClick={() => setViewResults(true)}>View Results</button>
    </div>}

    {viewResults && isComplete && <div className="top-space card project-card"><h2>{result.pressureProfileTitle}</h2><h2>Leadership Pressure Profile</h2><p>{result.narrativeSummary}</p>
      <p><em>Baseline confidence: {result.baselineConfidence}</em></p>
      {result.baselineConfidence === 'Early profile' && <p><em>Some areas will become clearer after simulations.</em></p>}
      <h3 className="top-space-sm">Framework Layers</h3>{dimensionLayers.map((layer) => <div key={layer.title} className="top-space-sm"><p className="eyebrow">{layer.title}</p><div className="card-grid">{layer.keys.map((key) => { const dim = dimensions.find((d) => d.key === key); const score = result.dimensions[key]; const c = score.composite; return <div key={key} className="card project-card"><p><strong>{dim.label}</strong></p>{c !== null && <><p>Composite: {`${c} / 5`}</p><progress max="5" value={c} style={{ width: '100%' }} /></>}{score.belief !== null && <p>Belief: {score.belief}</p>}{score.selfImplementation !== null && <p>Self-perception: {score.selfImplementation}</p>}{score.scenarioSignal !== null && <p>Scenario signal: {score.scenarioSignal}</p>}</div>; })}</div></div>)}
      <h3 className="top-space-sm">Likely Pressure Distortions</h3>{result.topDistortions.length ? result.topDistortions.map((distortion) => <div key={distortion}><p><strong>{titleCase(distortion)}</strong></p><p>{distortionDetails[distortion]}</p></div>) : <p>{result.distortionConfidenceLabel}</p>}
      <h3 className="top-space-sm">Strengths</h3><p>Your strongest baseline areas appear to be {result.topStrengths.join(', ')}.</p>
      <h3 className="top-space-sm">Growth Edges</h3><p>{result.growthEdges[0]} may be a useful growth edge.</p><p>Additional growth edges to watch: {result.growthEdges.slice(1).join(', ')}.</p>
      <h3 className="top-space-sm">Next Step: Pressure-Test the Profile</h3><p>This diagnostic is a self-perception baseline. The simulations will test how these patterns hold under live pressure.</p><Link href="/human-equation" className="button primary">Continue to Parent Call Rehearsal</Link>
      <div className="top-space-sm"><button className="button secondary" onClick={() => setShowDebugData((prev) => !prev)}>{showDebugData ? 'Hide' : 'Show'} Debug Data</button>{showDebugData && <pre>{JSON.stringify({ ...result, adaptiveSignals: signalScores, completionReason, answeredQuestionCount: completedCount, triggeredProbeCategories, signalCountsByDimension: Object.fromEntries(dimensions.map((d) => [d.key, result.dimensions[d.key].totalSignalCount])) }, null, 2)}</pre>}</div>
    </div>}
  </div></section>);
}
