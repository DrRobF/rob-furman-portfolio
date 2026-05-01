'use client';

import { useEffect, useMemo, useState } from 'react';

const initialFolders = {
  red: [],
  orange: [],
  green: [],
};

const arrivalSortItems = [
  'Voicemail light blinking',
  'Unread inbox messages',
  'Physical mail stack',
  'Teacher waiting to speak',
];
const arrivalPriorityRanks = ['1st', '2nd', '3rd', '4th'];
const suggestedArrivalSequence = [
  'Teacher waiting to speak',
  'Voicemail light blinking',
  'Unread inbox messages',
  'Physical mail stack',
];
const suggestedArrivalCoachingNote =
  'Human needs come first because a waiting teacher may be unable to move into the day effectively. Voicemail is usually next because someone who calls may have a more urgent or emotional concern than someone who emails. Email matters, but it can usually be scanned once the immediate human and phone concerns are handled. Physical mail is generally last unless something unusual stands out, such as a hand-delivered envelope with only your name on it.';

const decisionToFolderItem = {
  'Send an email response': {
    bucket: 'red',
    item: 'Respond to parent with care and clear timeline',
  },
  'Investigate the situation': { bucket: 'red', item: 'Gather facts from teacher and records today' },
  'Call the parent': {
    bucket: 'red',
    item: 'Prepare for parent contact with facts and boundaries',
  },
  'Address the teacher directly': {
    bucket: 'red',
    item: 'Speak with teacher after reviewing available context',
  },
};

const decisionConsequences = {
  'Send an email response': {
    title: 'Communication First',
    message:
      'You chose to respond before gathering full context. This can be strong if the message simply acknowledges receipt, shows concern, and sets a follow-up timeline. It becomes risky if you explain, defend, blame, or promise outcomes before investigating.',
    takeaway: 'A fast acknowledgment can calm escalation. A full response requires facts.',
  },
  'Investigate the situation': {
    title: 'Process First',
    message:
      'You chose to gather information before responding. This protects accuracy and keeps you from choosing sides too quickly. If the investigation will take more than a short time, send a quick acknowledgment so the parent knows the concern was received.',
    takeaway:
      'Good leaders do not ignore emotion, but they do not let emotion replace process.',
  },
  'Call the parent': {
    title: 'Direct Contact',
    message:
      'You chose live communication. A phone call can build trust, but it can also become time-consuming and emotionally difficult before you have the facts. In many cases, a short acknowledgment email followed by investigation creates better boundaries.',
    takeaway: 'Direct communication is powerful, but timing and preparation matter.',
  },
  'Address the teacher directly': {
    title: 'Internal Action',
    message:
      'You chose to act internally first. Speaking with the teacher may be necessary, but moving too quickly can feel accusatory if you have not reviewed the context. The goal is to gather facts, not assign blame.',
    takeaway: 'Support staff accountability without skipping due process.',
  },
};

const investigationFolderItem = 'Complete investigation before final parent response';

const postResponseFolderItems = {
  red: ['Speak with teacher immediately', 'Document parent concern'],
  orange: ['Follow up with parent within 48 hours', 'Review classroom reward practices'],
  green: ['Reflect on equity in recognition systems'],
};

const simulationProgressStorageKey = 'rob-furman-school-leader-simulation-v1';
const simulationEvaluationStorageKey = 'rob-furman-school-leader-evaluation-v1';
const reportTestLabel = 'mock-report-test';
const formatDashboardLabel = (label) => {
  const explicitLabels = {
    trustBuilder: 'Trust Builder',
    decisionSpeed: 'Decision Speed',
    authorityUnderPressure: 'Authority Under Pressure',
    operationalExecution: 'Operational Execution',
  };
  if (explicitLabels[label]) return explicitLabels[label];
  return `${label || ''}`
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
const getRatingTone = (rating = '') => {
  const normalized = `${rating}`.toLowerCase();
  if (normalized === 'strong' || normalized === 'exceptional') return 'band-strong';
  if (normalized === 'developing') return 'band-amber';
  if (normalized === 'limited') return 'band-limited';
  if (normalized === 'concern') return 'band-concern';
  return 'band-amber';
};
const getRatingFallbackScore = (rating = '') => {
  const normalized = `${rating}`.toLowerCase();
  if (normalized === 'exceptional') return 95;
  if (normalized === 'strong') return 85;
  if (normalized === 'developing') return 70;
  if (normalized === 'limited') return 60;
  if (normalized === 'concern') return 45;
  return 70;
};
const getCompetencyRating = (score) => {
  if (score >= 90) return { label: 'Exceptional', tone: 'band-strong' };
  if (score >= 80) return { label: 'Strong', tone: 'band-strong' };
  if (score >= 65) return { label: 'Developing', tone: 'band-amber' };
  if (score >= 55) return { label: 'Limited', tone: 'band-limited' };
  return { label: 'Concern', tone: 'band-concern' };
};
const reportTestPayloads = {
  weak: { overallReadinessScore: 52, readinessLevel: 'Emerging Readiness', candidateProfile: 'Weak Candidate', evaluationConfidence: 'Low', primaryLeadershipStyle: 'Reactive / Compliance-First', snapshot: { trustBuilder: 'Concern', decisionSpeed: 'Concern', authorityUnderPressure: 'Concern', operationalExecution: 'Concern' }, domainScores: { judgmentUnderPressure: 49, communicationLeadershipVoice: 52, studentCenteredLeadership: 56, equityFairness: 51, safetyRiskAwareness: 47, operationalFollowThrough: 45, instructionalLeadership: 50 }, strengths: ['Acknowledges stakeholder emotion and attempts to keep interactions respectful.', 'Shows baseline willingness to engage concerns rather than ignore them.', 'Demonstrates initial awareness that student dignity should remain central in conflict situations.'], growthAreas: ['Written responses need significantly more specificity, including facts, next steps, ownership, and timelines.', 'Leadership reasoning is not yet consistently visible in scenario responses when stakes increase.', 'Communication needs stronger alignment to the actual scenario facts before reassurance is offered.', 'High-risk situations require clearer escalation language and more direct action planning.'], signatureLeadershipInsight: 'Current evidence shows limited leadership reasoning depth across the simulation. Responses are often brief or vague, which weakens confidence in independent decision-making under pressure. Communication intent is generally respectful, but it does not consistently translate into actionable direction for staff or families. In a real school setting, this pattern can increase uncertainty during high-stakes moments. The core strength is relational intent, and the primary growth edge is operational specificity with clear ownership and timeline language.', howYouLeadUnderPressure: 'When pressure rises, this candidate’s responses become less complete and less specific. The simulation evidence suggests difficulty translating concern into concrete action steps, especially when ownership, timeline, or escalation decisions are needed. In a real school setting, this could lead to uncertainty among staff or families. Development should focus on naming the immediate action, responsible party, and follow-up checkpoint.', communicationLeadershipVoice: 'The communication voice signals care, but clarity drops when the scenario requires direct administrative language. Written responses often acknowledge concerns without naming who will do what by when. This creates relational warmth without operational closure. Strengthening ownership and escalation phrasing would substantially improve leadership credibility.', leadershipImpact: [{ label: 'Student Belonging', rating: 'Developing', insight: 'Student-centered intent appears, but first moves do not consistently protect dignity through concrete action.' }, { label: 'School Culture', rating: 'Limited', insight: 'Culture-building language is present, yet follow-through and accountability structures remain inconsistent.' }, { label: 'Staff Trust', rating: 'Limited', insight: 'Staff may feel heard, but unclear direction can reduce confidence in leadership execution.' }, { label: 'Crisis & Risk Leadership', rating: 'Concern', insight: 'Risk recognition is limited by incomplete responses and unclear escalation language.' }], crisisRiskLeadership: 'Risk signals are sometimes acknowledged, but response plans are frequently underdeveloped for high-stakes situations.', leadershipReadinessSummary: 'Current profile indicates emerging readiness with significant coaching needs before independent principal-level placement. The candidate needs stronger decision specificity, escalation clarity, and closure routines to lead reliably in complex school environments.', predictedFirst90DaysImpact: 'The first 90 days may show positive relationship-building intent, but inconsistent execution could produce staff uncertainty and delayed issue resolution. Early support should prioritize action-planning routines, communication templates, and accountability checkpoints.', recommendedFollowUpQuestions: ['Walk through your first 30 minutes after receiving a high-risk parent complaint. Who is contacted, in what order, and why?', 'How do you write follow-up language that names ownership, timeline, and closure criteria?', 'Describe how you decide when to escalate immediately versus gather more facts first.'], evaluationSource: reportTestLabel, apiStatus: 'test-mode' },
  developing: { overallReadinessScore: 70, readinessLevel: 'Developing Readiness', candidateProfile: 'Developing Candidate', evaluationConfidence: 'High', primaryLeadershipStyle: 'Relational / Process-Balanced', snapshot: { trustBuilder: 'Strong', decisionSpeed: 'Developing', authorityUnderPressure: 'Developing', operationalExecution: 'Developing' }, domainScores: { judgmentUnderPressure: 71, communicationLeadershipVoice: 74, studentCenteredLeadership: 75, equityFairness: 72, safetyRiskAwareness: 69, operationalFollowThrough: 67, instructionalLeadership: 70 }, strengths: ['Builds trust through calm and respectful stakeholder communication.', 'Demonstrates consistent student-centered framing before assigning blame.', 'Shows growing ability to structure decisions with fairness and professionalism.'], growthAreas: ['Increase urgency language in safety and conflict scenarios to reduce response delay.', 'Tighten operational closure by consistently naming owner, action, and deadline.', 'Strengthen escalation judgment when risk indicators move from moderate to high.', 'Use more concise directives when multiple teams need immediate alignment.'], signatureLeadershipInsight: 'This candidate shows credible relational leadership with developing administrative sharpness under pressure. Decision-making generally reflects sound intent, but action plans can lose precision when situations become time-sensitive. Communication is professional and trust-preserving, yet follow-through language does not always close the loop for staff execution. In a real school, this profile can build culture effectively while still requiring coaching in urgency and escalation consistency. The primary strength is relational credibility, and the key growth edge is decisive operational closure.', howYouLeadUnderPressure: 'When pressure increases, this leader remains respectful and composed, but can become less direct about immediate next steps. Responses show concern and professionalism, though urgency signals are not always explicit. Trust is usually preserved, but follow-through can be uneven when multiple issues stack at once. Stronger owner-and-timeline language would improve reliability in high-demand moments.', communicationLeadershipVoice: 'Communication reflects empathy and professionalism across families and staff. The next level is increasing clarity in directive language so that expectations, ownership, and checkpoints are unambiguous. This would better align relational strength with execution speed.', leadershipImpact: [{ label: 'Student Belonging', rating: 'Strong', insight: 'The candidate regularly protects student dignity and avoids exclusionary first moves.' }, { label: 'School Culture', rating: 'Developing', insight: 'Positive culture intent is clear, but consistent closure routines are still emerging.' }, { label: 'Staff Trust', rating: 'Strong', insight: 'Tone and fairness language support trust, especially in sensitive conversations.' }, { label: 'Crisis & Risk Leadership', rating: 'Developing', insight: 'Risk is generally recognized, with occasional delays in escalation and action sequencing.' }], crisisRiskLeadership: 'Risk framing is usually accurate, with growth needed in immediate escalation wording during fast-moving incidents.', leadershipReadinessSummary: 'Developing readiness profile with clear potential for school leadership. With targeted coaching in urgency, escalation thresholds, and follow-through discipline, this candidate can move toward stronger independent administrative judgment.', predictedFirst90DaysImpact: 'Likely to strengthen relationships and school tone early. Operational reliability should improve if supported with explicit response protocols and weekly follow-through accountability checks.', recommendedFollowUpQuestions: ['How do you decide escalation thresholds when safety concerns are still unfolding?', 'Show how you convert a values-based response into a task-based execution plan within 24 hours.', 'What communication structure do you use to close loops with families and staff?'], evaluationSource: reportTestLabel, apiStatus: 'test-mode' },
  strong: { overallReadinessScore: 91, readinessLevel: 'Highly Ready', candidateProfile: 'Strong Candidate', evaluationConfidence: 'High', primaryLeadershipStyle: 'Decisive / Student-Centered Systems Leader', snapshot: { trustBuilder: 'Strong', decisionSpeed: 'Strong', authorityUnderPressure: 'Strong', operationalExecution: 'Strong' }, domainScores: { judgmentUnderPressure: 92, communicationLeadershipVoice: 90, studentCenteredLeadership: 93, equityFairness: 89, safetyRiskAwareness: 92, operationalFollowThrough: 91, instructionalLeadership: 88 }, strengths: ['Consistently identifies appropriate first moves in complex school scenarios without unnecessary delay.', 'Maintains calm authority while preserving student, family, and staff dignity.', 'Uses clear ownership and timeline language to reduce ambiguity and improve follow-through.', 'Balances relational trust with decisive administrative action.'], growthAreas: ['Deepen instructional leadership language to further strengthen teacher coaching precision.', 'Expand evidence-sharing routines so stakeholders see how decisions connect to data and policy.', 'Continue delegating high-volume follow-up tasks while maintaining quality control.'], signatureLeadershipInsight: 'This leader demonstrates a strong capacity to balance clarity and trust in high-pressure environments. Across scenarios, decisions show structured reasoning, timely action, and the ability to maintain authority without escalating conflict. Communication and decision-making are tightly aligned: expectations are clear, ownership is explicit, and follow-through language reinforces accountability. In a real school, this pattern is likely to stabilize teams quickly during disruption while protecting student-centered culture. The leading strength is decisive trust-preserving execution, with the growth edge centered on deeper instructional leadership leverage.', howYouLeadUnderPressure: 'When pressure rises, this leader becomes more focused rather than reactive. Decisions consistently identify risk, set direction, and preserve trust while moving the situation toward resolution. Urgency is communicated clearly without sacrificing calm authority. This response pattern can stabilize a school during difficult moments and sustain confidence across stakeholders.', communicationLeadershipVoice: 'Communication is direct, composed, and operationally clear. The candidate consistently pairs empathy with explicit expectations, ownership language, and timelines. This voice builds trust while improving implementation reliability across teams.', leadershipImpact: [{ label: 'Student Belonging', rating: 'Strong', insight: 'The candidate consistently protects student dignity and avoids exclusionary first moves.' }, { label: 'School Culture', rating: 'Strong', insight: 'Language and decision patterns reinforce high expectations with relational trust.' }, { label: 'Staff Trust', rating: 'Exceptional', insight: 'Clear ownership language and fair process build confidence in leadership consistency.' }, { label: 'Crisis & Risk Leadership', rating: 'Strong', insight: 'Risk is identified early, escalated appropriately, and managed with calm authority.' }], crisisRiskLeadership: 'Crisis decision patterns show proactive risk recognition and reliable escalation with clear communication.', leadershipReadinessSummary: 'Highly ready profile for independent school leadership. Evidence indicates strong decision quality, communication clarity, and execution discipline in high-stakes scenarios.', predictedFirst90DaysImpact: 'Likely to establish clear expectations, strengthen staff confidence, and stabilize operational systems quickly. Early culture and execution gains should be visible across student support, family communication, and team follow-through.', recommendedFollowUpQuestions: ['How do you scale your crisis communication model across assistant principals and teacher leaders?', 'What leading indicators do you track in the first 90 days to confirm execution quality?', 'How do you deepen instructional coaching while maintaining high operational tempo?'], evaluationSource: reportTestLabel, apiStatus: 'test-mode' },
  mixed: { overallReadinessScore: 75, readinessLevel: 'Strong Readiness', candidateProfile: 'Mixed Candidate', evaluationConfidence: 'High', primaryLeadershipStyle: 'Adaptive / Inconsistent Under Peak Stress', snapshot: { trustBuilder: 'Strong', decisionSpeed: 'Developing', authorityUnderPressure: 'Strong', operationalExecution: 'Limited' }, domainScores: { judgmentUnderPressure: 82, communicationLeadershipVoice: 84, studentCenteredLeadership: 86, equityFairness: 70, safetyRiskAwareness: 62, operationalFollowThrough: 60, instructionalLeadership: 76 }, strengths: ['Builds trust quickly through respectful and credible communication.', 'Demonstrates strong student-centered judgment in several high-stakes scenarios.', 'Maintains authority without becoming adversarial in emotionally charged situations.'], growthAreas: ['Execution reliability drops when multiple urgent issues compete for attention.', 'Risk escalation language is uneven, especially when timelines are compressed.', 'Follow-through planning needs clearer ownership checkpoints to avoid drift.', 'Operational systems need stronger consistency across routine and crisis conditions.'], signatureLeadershipInsight: 'This candidate shows meaningful leadership strength with noticeable variability across domains. Communication and relational trust are strong, and many decisions demonstrate sound judgment in complex school contexts. Under peak pressure, however, operational follow-through and escalation precision become less consistent. In a real school, this profile can generate early culture confidence but may create execution volatility if support systems are weak. The standout strength is trust-centered communication, while the growth edge is consistent crisis-to-execution closure.', howYouLeadUnderPressure: 'When stakes rise, this leader stays composed and usually preserves trust, but action specificity can become uneven. Some responses are decisive and clear, while others leave ownership or escalation steps underdefined. Urgency is present but not always translated into consistent closure. Strengthening high-pressure execution routines would improve reliability.', communicationLeadershipVoice: 'The leadership voice is professional, empathetic, and generally confidence-building. The main opportunity is to pair that strong tone with tighter operational directives when multiple stakeholders need immediate clarity.', leadershipImpact: [{ label: 'Student Belonging', rating: 'Strong', insight: 'Student dignity is protected in most decisions, even during conflict.' }, { label: 'School Culture', rating: 'Strong', insight: 'Culture language is constructive, though consistency depends on follow-through strength.' }, { label: 'Staff Trust', rating: 'Developing', insight: 'Teams feel respected, but variable execution can reduce confidence during high-load periods.' }, { label: 'Crisis & Risk Leadership', rating: 'Limited', insight: 'Risk recognition is present, but escalation speed and closure are not consistently strong.' }], crisisRiskLeadership: 'Crisis leadership shows good composure with uneven execution consistency in multi-variable incidents.', leadershipReadinessSummary: 'Strong-leaning readiness with targeted development priorities. This candidate is credible for leadership progression, with coaching needed in operational consistency and risk escalation discipline.', predictedFirst90DaysImpact: 'Likely to improve climate and communication quickly. Success will depend on establishing tighter execution systems and clearer accountability loops in complex operational weeks.', recommendedFollowUpQuestions: ['Describe a time when strong communication did not produce execution; what changed?', 'How do you structure crisis escalation when two urgent incidents happen simultaneously?', 'What systems ensure follow-through after initial decisions are made?'], evaluationSource: reportTestLabel, apiStatus: 'test-mode' },
};

const lensNames = [
  'Judgment Under Pressure',
  'Communication & Tone',
  'Fairness & Professional Integrity',
  'Process & Follow-Through',
  'Emotional Awareness',
];

const dayModules = [
  { id: 'arrival', label: '7:30 AM — Arrival', enabled: true },
  { id: 'iepMeeting', label: '8:15 AM — IEP Meeting', enabled: true },
  { id: 'announcements', label: '9:00 AM — Announcements', enabled: true },
  { id: 'voicemail', label: '9:30 AM — Voicemail & Mailbox', enabled: true },
  { id: 'classroomWalkthrough', label: '11:00 AM — Classroom Walkthrough', enabled: true },
  { id: 'lunchClimate', label: '11:30 AM — Lunch & Cafeteria Climate', enabled: true },
  { id: 'parentEscalation', label: '1:00 PM — Parent Escalation', enabled: true },
  { id: 'cafeteriaBoundary', label: '1:30 PM — Cafeteria Boundary Incident', enabled: true },
  { id: 'teacherConflict', label: '3:15 PM — Teacher Conflict', enabled: true },
  { id: 'endOfDayEmail', label: '4:00 PM — End-of-Day Desk Stack', enabled: true },
];

const requiredDayModuleDefinitions = [
  { id: 'arrival', label: 'Arrival Priorities' },
  { id: 'endOfDayRewardConcern', label: 'Parent Concern' },
  { id: 'iepMeeting', label: 'IEP Meeting' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'voicemailParentHelp', label: 'Voicemail (Parent Help)' },
  { id: 'voicemailTeacherCall', label: 'Voicemail (Teacher Call)' },
  { id: 'lunchClimate', label: 'Lunch & Cafeteria Climate' },
  { id: 'parentEscalation', label: 'Parent Escalation' },
  { id: 'cafeteriaBoundary', label: 'Cafeteria Boundary Incident' },
  { id: 'teacherConflict', label: 'Teacher Conflict' },
  { id: 'studentThreatEmail', label: 'Student Threat' },
  { id: 'academicDeclineEmail', label: 'Academic Concern' },
];
const builderModeModuleIds = new Set([
  'arrival',
  'iepMeeting',
  'announcements',
  'voicemail',
  'classroomWalkthrough',
  'lunchClimate',
  'parentEscalation',
  'cafeteriaBoundary',
  'teacherConflict',
  'endOfDayEmail',
]);

const moduleGuidance = {
  arrival: {
    focus: 'Start with people and urgency signals before lower-risk tasks.',
    actions: [
      'Choose a sequence you can defend under pressure.',
      'Prioritize immediate human needs and time-sensitive communication.',
    ],
    insight: 'Early triage sets the tone for every leadership decision that follows.',
  },
  iepMeeting: {
    focus: 'Treat compliance tasks as trust and legal obligations, not admin extras.',
    actions: [
      'Capture the task before the meeting context is lost.',
      'Assign it to the right priority folder with a completion standard.',
    ],
    insight: 'Small compliance misses can create large relationship and legal risks.',
  },
  announcements: {
    focus: 'Visibility creates spontaneous requests that still need reliable follow-through.',
    actions: [
      'Break hallway asks into concrete tasks.',
      'File each task immediately so nothing is dropped.',
    ],
    insight: 'Leader visibility helps culture, but only systems protect execution.',
  },
  voicemail: {
    focus: 'Voicemails often carry urgency and emotion that need fast acknowledgment.',
    actions: [
      'Triage for risk first, then write concise next steps.',
      'Use calm, process-based language in every callback.',
    ],
    insight: 'Fast acknowledgment with clear process reduces escalation pressure.',
  },
  classroomWalkthrough: {
    focus: 'Capture objective evidence before drawing conclusions or giving direction.',
    actions: [
      'Anchor notes in what was seen and heard.',
      'Use non-evaluative language that supports coaching.',
    ],
    insight: 'Evidence-first walkthroughs build instructional trust.',
  },
  lunchClimate: {
    focus: 'Address immediate climate needs while preserving adult professionalism.',
    actions: [
      'Give direct next-step guidance to staff.',
      'Balance student safety, supervision, and team tone.',
    ],
    insight: 'In public spaces, your direction shapes safety and culture simultaneously.',
  },
  parentEscalation: {
    focus: 'Acknowledge emotion without sacrificing process or accuracy.',
    actions: [
      'Respond quickly with empathy and boundaries.',
      'Name what you will review and when follow-up will happen.',
    ],
    insight: 'Trust grows when families feel heard and see disciplined follow-through.',
  },
  cafeteriaBoundary: {
    focus: 'Hold staff boundaries firmly while keeping the conversation professional.',
    actions: [
      'Start with clarity, not accusation.',
      'Set the immediate expectation and document next steps.',
    ],
    insight: 'Professional tone protects accountability from becoming personal conflict.',
  },
  teacherConflict: {
    focus: 'De-escalate adult conflict and return the team to student-centered work.',
    actions: [
      'Open with shared expectations and neutral language.',
      'Set a process for resolution and follow-up.',
    ],
    insight: 'Conflict leadership is measured by clarity, fairness, and reset.',
  },
  endOfDayEmail: {
    focus: 'Close every active case with ownership, documentation, and a next action.',
    actions: [
      'Work cases in any order, but finish each with a clear record.',
      'Use responses that acknowledge concern and define process.',
    ],
    insight: 'End-of-day quality determines tomorrow’s trust load.',
  },
};

const moduleStatuses = {
  upcoming: 'upcoming',
  active: 'active',
  completed: 'completed',
};

const deskStackItemStatuses = {
  notStarted: 'Not Started',
  inProgress: 'In Progress',
  complete: 'Complete',
};

const initialDeskStackStatuses = {
  rewardConcern: deskStackItemStatuses.notStarted,
  studentThreatEmail: deskStackItemStatuses.notStarted,
  ptoTalentShowEmail: deskStackItemStatuses.notStarted,
  academicDeclineEmail: deskStackItemStatuses.notStarted,
  recessInjuryEmail: deskStackItemStatuses.notStarted,
  studentRemovalVoicemail: deskStackItemStatuses.notStarted,
};

const deskStackItems = [
  {
    id: 'rewardConcern',
    title: 'Parent Email: Classroom Reward Concern',
    type: 'Email',
    description:
      'Parent escalation about perceived exclusion from a classroom reward and concern about student dignity.',
    isAvailable: true,
  },
  {
    id: 'studentThreatEmail',
    title: 'Email: Student Threat Language',
    type: 'Email',
    description: 'A parent reports that another student made a threatening statement toward their child.',
    isAvailable: true,
  },
  {
    id: 'ptoTalentShowEmail',
    title: 'Email: PTO / Talent Show Conflict',
    type: 'Email',
    description: 'A frustrated parent volunteer says she is done helping with the talent show and PTO fundraising.',
    isAvailable: true,
  },
  {
    id: 'academicDeclineEmail',
    title: 'Email: Academic Decline Concern',
    type: 'Email',
    description: 'A parent is concerned about a sudden drop in their child\'s grades and performance.',
    isAvailable: true,
  },
  {
    id: 'recessInjuryEmail',
    title: 'Email: Recess Injury / Liability Concern',
    type: 'Email',
    description: 'A parent requests documentation and reimbursement after a recess injury involving another student.',
    isAvailable: true,
  },
  {
    id: 'studentRemovalVoicemail',
    title: 'Voicemail: Student Removal From Class',
    type: 'Voicemail',
    description: 'A teacher requests administrative support after wanting a student removed from class.',
    isAvailable: true,
  },
];

const studentThreatDecisionOptions = [
  'Contact the parent immediately',
  'Begin investigation before responding',
  'Contact the students involved first',
  'Alert administration/counseling support',
];

const studentThreatDecisionCoaching = {
  'Contact the parent immediately': {
    title: 'Immediate Parent Contact',
    message:
      'You chose to respond directly. This can build trust, but you must be careful not to provide incomplete or inaccurate information.',
  },
  'Begin investigation before responding': {
    title: 'Investigation First',
    message:
      'You chose to gather facts first. This supports accuracy, but the parent may feel anxious if they do not receive acknowledgment.',
  },
  'Contact the students involved first': {
    title: 'Student-Level Action',
    message:
      'You chose to address the students directly. This is part of the process, but communication with the parent still needs to happen.',
  },
  'Alert administration/counseling support': {
    title: 'Support Structure',
    message:
      'You chose to involve additional support. Threat-related concerns often require multiple layers of response.',
  },
};

const studentThreatEvidenceCards = [
  {
    title: 'Safety First',
    content:
      'Any report of threatening language must be treated seriously, even if the full context is not yet known.',
  },
  {
    title: 'Incomplete Information',
    content:
      'The parent is reporting what their child said. This may be accurate, incomplete, or misunderstood.',
  },
  {
    title: 'Communication Timing',
    content:
      'The parent needs acknowledgment before a full investigation is complete.',
  },
  {
    title: 'Documentation and Process',
    content:
      'The school must follow proper procedures for documenting and investigating student incidents.',
  },
];

const academicDeclineDecisionOptions = [
  'Acknowledge the parent and review academic records',
  'Contact the teacher immediately for explanation',
  'Suggest the parent speak directly with the teacher',
  'Assume it is a student responsibility issue',
];

const academicDeclineDecisionCoaching = {
  'Acknowledge the parent and review academic records': {
    title: 'Structured Response',
    message:
      'You chose to acknowledge the concern and begin reviewing records. This is a strong first step that supports accuracy before drawing conclusions.',
  },
  'Contact the teacher immediately for explanation': {
    title: 'Teacher Insight',
    message:
      'You chose to reach out to the teacher quickly. This can provide insight, but should be paired with a structured review of data.',
  },
  'Suggest the parent speak directly with the teacher': {
    title: 'Redirecting the Concern',
    message:
      'You chose to redirect the parent. While teacher communication is important, the leader still plays a role in ensuring follow-through and support.',
  },
  'Assume it is a student responsibility issue': {
    title: 'Premature Conclusion',
    message:
      'You chose to assume responsibility lies with the student. This risks missing underlying issues and can damage trust with the parent.',
  },
};

const academicDeclineEvidenceCards = [
  {
    title: 'Multiple Factors',
    content:
      'Changes in academic performance can result from many factors, including instruction, workload, student habits, or external issues.',
  },
  {
    title: 'Teacher Insight',
    content:
      'The classroom teacher has the most direct understanding of assignments, expectations, and recent changes.',
  },
  {
    title: 'Data Matters',
    content:
      'Grades, missing assignments, and patterns over time should be reviewed before forming conclusions.',
  },
  {
    title: 'Parent Partnership',
    content:
      'Parents are often the first to notice changes. A strong response keeps them informed and involved.',
  },
];

const ptoTalentShowDecisionOptions = [
  'Respond with appreciation and invite a conversation',
  'Forward it to the PTO president',
  'Explain the planning limitations',
  'Let the parent step away for now',
];

const ptoTalentShowDecisionCoaching = {
  'Respond with appreciation and invite a conversation': {
    title: 'Relationship Repair',
    message:
      'You chose to acknowledge the volunteer’s frustration and keep the relationship open. This can preserve trust, especially when the parent still cares about the school.',
  },
  'Forward it to the PTO president': {
    title: 'Delegating the Conflict',
    message:
      'You chose to send the issue back to PTO leadership. That may be appropriate later, but it can feel dismissive if the parent came to you because the process already felt unsupported.',
  },
  'Explain the planning limitations': {
    title: 'Clarifying the System',
    message:
      'You chose to explain constraints. This can help, but starting with explanation before acknowledgment can make the parent feel unheard.',
  },
  'Let the parent step away for now': {
    title: 'Respecting Boundaries',
    message:
      'You chose not to push the parent to stay involved. That may be respectful, but the school still risks losing a committed volunteer without repairing the relationship.',
  },
};

const ptoTalentShowEvidenceCards = [
  {
    title: 'Volunteer Trust',
    content:
      'Parent volunteers often give time because they feel connected to the school. When communication breaks down, the issue is not only the event — it is trust.',
  },
  {
    title: 'PTO Boundaries',
    content:
      'The PTO may manage parts of the event, but the principal still helps protect the school’s relationship with families.',
  },
  {
    title: 'Emotional Tone',
    content:
      'The parent is frustrated, but the message also shows that she still cares about the school and students.',
  },
  {
    title: 'Leadership Balance',
    content:
      'The response should acknowledge the frustration, avoid blaming PTO or staff, and offer a constructive next step.',
  },
];

const recessInjuryDecisionOptions = [
  'Acknowledge the parent and review documentation',
  'Forward the bill to the other family',
  'Call the parent immediately',
  'Refer the matter to district/admin guidance',
];

const studentRemovalDecisionOptions = [
  'Support the teacher and remove the student',
  'Gather more context before deciding',
  'Speak with the student first',
  'Help the teacher reset the classroom plan',
];

const studentRemovalDecisionCoaching = {
  'Support the teacher and remove the student': {
    title: 'Immediate Support',
    message:
      'You chose to support the teacher’s request quickly. This may help the teacher feel heard, but repeated removal can become the default response if the underlying pattern is not addressed.',
  },
  'Gather more context before deciding': {
    title: 'Context First',
    message:
      'You chose to understand what led to the request before acting. This protects fairness and helps avoid making removal the only tool.',
  },
  'Speak with the student first': {
    title: 'Student Perspective',
    message:
      'You chose to hear from the student. This can be important, but the teacher still needs visible support and follow-up.',
  },
  'Help the teacher reset the classroom plan': {
    title: 'System Support',
    message:
      'You chose to focus on the classroom system. This can support both teacher and student, but it requires careful communication so the teacher does not feel dismissed.',
  },
};

const studentRemovalEvidenceCards = [
  {
    title: 'Teacher Support',
    content:
      'Teachers need to know administrators will respond when classroom behavior becomes difficult.',
  },
  {
    title: 'Student Dignity',
    content:
      'Removing a student may be necessary, but it should not become the only response or a public punishment without follow-up.',
  },
  {
    title: 'Pattern Check',
    content:
      'The leader should look for patterns: Is this a one-time disruption, a repeated behavior issue, or a classroom management support need?',
  },
  {
    title: 'Follow-Up',
    content:
      'The school leader needs a next step for the teacher, the student, and the classroom environment.',
  },
];

const recessInjuryDecisionCoaching = {
  'Acknowledge the parent and review documentation': {
    title: 'Careful First Step',
    message:
      'You chose to acknowledge the concern and review documentation. This is a strong first move because injury concerns require accuracy, care, and process before commitments are made.',
  },
  'Forward the bill to the other family': {
    title: 'Liability Risk',
    message:
      'You chose to forward the reimbursement request. This is risky because the school should not promise payment, assign liability, or share student/family information without following proper procedures.',
  },
  'Call the parent immediately': {
    title: 'Direct Contact',
    message:
      'You chose live communication. This can show care, but you need to be prepared to avoid promising reimbursement, assigning blame, or discussing another student improperly.',
  },
  'Refer the matter to district/admin guidance': {
    title: 'Process Protection',
    message:
      'You chose to involve district or administrative guidance. This is often appropriate for injury, liability, documentation, and confidentiality concerns, but the parent still needs acknowledgment.',
  },
};

const recessInjuryEvidenceCards = [
  {
    title: 'Student Safety',
    content:
      'A reported head injury must be treated seriously, even if the student appeared stable at the time.',
  },
  {
    title: 'Documentation',
    content:
      'The school should review nurse records, incident/accident reports, supervision notes, and staff accounts before responding fully.',
  },
  {
    title: 'Confidentiality',
    content:
      'The parent may request the name of another student, but student privacy and district procedures must guide what can be shared.',
  },
  {
    title: 'Liability and Reimbursement',
    content:
      'The school should not promise payment, assign fault, or forward bills to another family without district guidance.',
  },
  {
    title: 'Communication',
    content:
      'The parent needs a prompt, calm acknowledgment and a clear explanation of what will be reviewed next.',
  },
];

const iepDecisionCoaching = {
  'Handle it immediately after the meeting': {
    title: 'Immediate Follow-Through',
    message:
      'You chose to handle the compliance-related request right away. This protects trust, documentation, and timelines. The risk is that it may interrupt other urgent start-of-day needs if you do not manage the transition carefully.',
  },
  'Add it to today’s priority list': {
    title: 'Controlled Follow-Through',
    message:
      'You chose to capture the task and complete it today. This is usually a strong leadership move if the item is clearly tracked and not allowed to disappear into the day.',
  },
  'Delegate it to the office': {
    title: 'Delegated Task',
    message:
      'You chose to delegate the task. Delegation can be appropriate, but compliance-sensitive communication still needs clear ownership and follow-up from the administrator.',
  },
  'Wait until email time later': {
    title: 'Delay Risk',
    message:
      'You chose to wait until later. This may feel efficient, but compliance-related parent communication can become risky if it is not tracked carefully.',
  },
};

const iepFolderOptions = [
  { id: 'red', label: 'Red: Before leaving today' },
  { id: 'orange', label: 'Orange: Next two days' },
  { id: 'green', label: 'Green: This week' },
];

const iepTaskItem = 'Send IDEA manual to parents and CC Special Education Director';
const announcementsDecisionCoaching = {
  'Handle it yourself right away': {
    title: 'Helpful but Costly',
    message:
      'You chose to personally handle the request. This supports the teacher, but it can also pull you away from other responsibilities if every hallway request becomes your task.',
  },
  'Ask the administrative assistant to send the announcements': {
    title: 'Smart Delegation',
    message:
      'You chose to use the office system to help quickly. This is often a strong move: the teacher gets what she needs, students do not miss information, and you preserve time for other leadership work.',
  },
  'Tell the teacher to email you': {
    title: 'Delay Risk',
    message:
      'You chose to push the request back to the teacher. This may create a record, but it also adds work for someone who already lost instructional access and may delay a simple fix.',
  },
  'Make a quick note and keep moving': {
    title: 'Capture Before It Disappears',
    message:
      'You chose to capture the request before moving on. Principals need a reliable system for hallway tasks because five more people may stop you before you reach your desk.',
  },
};

const announcementsTasks = [
  {
    id: 'announcementsCopy',
    label: 'Send teacher a copy of the morning announcements',
  },
  {
    id: 'announcementsMaintenance',
    label: 'Notify maintenance that classroom TV is not working',
  },
];
const voicemailLoopTaskItem = 'Close open voicemail loops';
const voicemailFirstMoveOptions = [
  'Send acknowledgment',
  'Investigate first',
  'Call back directly',
  'Delegate follow-up',
];
const voicemailCoachingByDecision = {
  'Send acknowledgment': {
    title: 'Acknowledge First',
    message:
      'You chose to acknowledge the message. This can reduce anxiety and show responsiveness while buying time to gather accurate information before giving a full answer.',
  },
  'Investigate first': {
    title: 'Process First',
    message:
      'You chose to gather information before responding. This protects accuracy, but if the caller is waiting for a response, a short acknowledgment may still be needed.',
  },
  'Call back directly': {
    title: 'Live Contact',
    message:
      'You chose direct contact. A call can build trust, but it can also take significant time and become difficult if you do not yet have enough information.',
  },
  'Delegate follow-up': {
    title: 'Delegated Follow-Up',
    message:
      'You chose to involve someone else in the follow-up. Delegation can be appropriate, but the principal still needs to ensure the loop is closed.',
  },
};
const walkthroughFormFields = [
  {
    id: 'studentEngagement',
    label: 'A. Student Engagement',
    prompt:
      'What evidence do you see of student engagement? Focus on what students are doing, saying, writing, asking, or producing.',
  },
  {
    id: 'learningObjective',
    label: 'B. Learning Objective / Purpose',
    prompt:
      'What appears to be the learning objective or instructional purpose of the lesson? What evidence helped you determine that?',
  },
  {
    id: 'instructionalSupport',
    label: 'C. Instructional Support / Scaffolding',
    prompt:
      'What supports does the teacher provide to help students access the learning? Look for modeling, examples, prompts, checks for understanding, or guided practice.',
  },
  {
    id: 'classroomEnvironment',
    label: 'D. Classroom Environment',
    prompt: 'What do you notice about the tone, expectations, routines, and structure of the classroom?',
  },
  {
    id: 'evidenceBasedStrength',
    label: 'E. Evidence-Based Strength',
    prompt: 'Identify one instructional strength using evidence from the lesson.',
  },
  {
    id: 'followUpQuestion',
    label: 'F. Follow-Up Conversation',
    prompt: 'What is one reflective question you would ask the teacher after this walkthrough?',
  },
];
const lunchClimateDecisionOptions = [
  'Step in and reset expectations',
  'Watch before acting',
  'Pull the lunch monitors together',
  'Remove the loudest students',
];
const lunchClimateDecisionCoaching = {
  'Step in and reset expectations': {
    title: 'Immediate Climate Reset',
    message:
      'You chose to reset expectations directly. This can quickly calm the room, but it works best when paired with consistent follow-through from the adults supervising.',
  },
  'Watch before acting': {
    title: 'Observe the Pattern',
    message:
      'You chose to observe before acting. This can help you identify the real pattern instead of reacting to noise alone. The risk is waiting too long while behavior escalates.',
  },
  'Pull the lunch monitors together': {
    title: 'Adult Alignment',
    message:
      'You chose to align the adults first. This is often a strong move because inconsistent adult responses create inconsistent student behavior.',
  },
  'Remove the loudest students': {
    title: 'Control Move',
    message:
      'You chose to remove the most visible behavior. This may calm the room temporarily, but it can miss the system issue if expectations and adult responses remain unclear.',
  },
};
const lunchClimateTaskItem = 'Stabilize cafeteria expectations today';
const lunchClimateInsightMessage =
  'Cafeteria behavior improves when adults share the same expectations, use the same language, and respond consistently. Strong leaders do not just correct students — they build systems adults can follow.';
const parentEscalationTaskItem = 'Respond to parent escalation from lunch incident';
const parentEscalationDecisionOptions = [
  'Call the parent back immediately',
  'Send a quick acknowledgment first',
  'Finish gathering facts before responding',
  'Ask the secretary to take a message',
];
const parentEscalationDecisionCoaching = {
  'Call the parent back immediately': {
    title: 'Direct Contact Under Pressure',
    message:
      'You chose live communication. This can build trust, but it may also pull you into a long emotional conversation before your documentation and facts are fully organized.',
  },
  'Send a quick acknowledgment first': {
    title: 'Acknowledge and Set Boundaries',
    message:
      'You chose to acknowledge the parent quickly. This can reduce escalation while giving you time to finish gathering facts and set a clear follow-up window.',
  },
  'Finish gathering facts before responding': {
    title: 'Accuracy First',
    message:
      'You chose to complete the fact-finding before responding. This protects accuracy, but it can increase parent frustration if they feel ignored.',
  },
  'Ask the secretary to take a message': {
    title: 'Buffering the Contact',
    message:
      'You chose to create a buffer. This may protect your time briefly, but the parent still needs to know the concern was received and will be addressed.',
  },
};
const parentEscalationEvidenceCards = [
  {
    title: 'Communication Gap',
    content:
      'The parent has heard the student’s version first. That does not mean the student is wrong, but it does mean the parent may be reacting to incomplete information.',
  },
  {
    title: 'School Responsibility',
    content:
      'The school still needs to document what happened, confirm facts with staff/students, and communicate next steps calmly.',
  },
  {
    title: 'Cell Phone Reality',
    content:
      'Information now moves faster than school procedures. Leaders often respond while the story is already spreading.',
  },
  {
    title: 'Leadership Balance',
    content:
      'The goal is not to win the narrative. The goal is to acknowledge concern, gather facts, and communicate clearly without blaming or overpromising.',
  },
];
const cafeteriaBoundaryTaskItem = 'Address cafeteria staff boundary issue';
const cafeteriaBoundaryDecisionOptions = [
  'Speak with the cafeteria worker immediately',
  'Gather more information first',
  'Address the student situation first',
  'Document the incident and follow up later',
];
const cafeteriaBoundaryDecisionCoaching = {
  'Speak with the cafeteria worker immediately': {
    title: 'Immediate Boundary Correction',
    message:
      'You chose to address the adult behavior right away. This can prevent further issues, but it requires a calm, professional approach to avoid escalation or embarrassment.',
  },
  'Gather more information first': {
    title: 'Full Context Approach',
    message:
      'You chose to gather information before acting. This can help you respond accurately, but delays may allow the situation to spread or repeat.',
  },
  'Address the student situation first': {
    title: 'Student-First Focus',
    message:
      'You chose to focus on the student concern. While student safety matters, the adult’s behavior still needs to be addressed appropriately.',
  },
  'Document the incident and follow up later': {
    title: 'Delayed Response',
    message:
      'You chose to document first. Documentation is important, but delaying response to a public incident may weaken expectations around staff conduct.',
  },
};
const cafeteriaBoundaryEvidenceCards = [
  {
    title: 'Role Boundaries',
    content:
      'Staff members must not use their position to address personal issues involving their own children during the school day.',
  },
  {
    title: 'Public Setting',
    content:
      'This interaction happened in front of other students, which affects school climate and student perception of fairness and safety.',
  },
  {
    title: 'Dual Role',
    content:
      'The individual is both a staff member and a parent. These roles must be handled separately.',
  },
  {
    title: 'Leadership Responsibility',
    content:
      'The leader must address staff behavior, protect students, and ensure proper processes are followed moving forward.',
  },
];
const teacherConflictTaskItem = 'Address teacher conflict before end of day';
const teacherConflictDecisionOptions = [
  'Meet with both teachers together immediately',
  'Speak with each teacher separately first',
  'Support the team leader’s decision',
  'Allow each teacher to continue their own approach',
];
const teacherConflictDecisionCoaching = {
  'Meet with both teachers together immediately': {
    title: 'Immediate Joint Conversation',
    message:
      'You chose to address the issue together. This can promote transparency, but it requires careful facilitation to prevent escalation or defensiveness.',
  },
  'Speak with each teacher separately first': {
    title: 'Individual Understanding',
    message:
      'You chose to understand each perspective first. This can help you gather insight, but the conflict will still need to be addressed collectively.',
  },
  'Support the team leader’s decision': {
    title: 'Leadership Alignment',
    message:
      'You chose to back the team leader. While leadership roles matter, this approach may damage trust if concerns are not fully acknowledged.',
  },
  'Allow each teacher to continue their own approach': {
    title: 'Flexibility Over Consistency',
    message:
      'You chose flexibility. While this may reduce conflict short term, inconsistent practices across a grade level can impact students and team cohesion.',
  },
};
const teacherConflictEvidenceCards = [
  {
    title: 'Leadership Structure',
    content:
      'Grade-level leaders are responsible for guiding instruction, but leadership requires support and alignment, not just authority.',
  },
  {
    title: 'Experience Matters',
    content:
      'Veteran teachers bring valuable experience and proven practices. Change without acknowledgment of that experience can create resistance.',
  },
  {
    title: 'Consistency for Students',
    content:
      'Students benefit from consistent expectations and instructional approaches across a team.',
  },
  {
    title: 'Change Management',
    content:
      'Effective leaders introduce change by building understanding and buy-in, not just presenting a better method.',
  },
];

const initialModuleStatuses = dayModules.reduce((acc, module) => {
  acc[module.id] = module.id === 'arrival' ? moduleStatuses.active : moduleStatuses.upcoming;
  return acc;
}, {});

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function analyzeLeadershipWriting(responseText, contextType) {
  const normalizedResponse = responseText.trim();
  const lowered = normalizedResponse.toLowerCase();
  const wordCount = normalizedResponse.split(/\s+/).filter(Boolean).length;
  const hasMeaningfulLength = wordCount >= 35;

  const acknowledgmentTerms = ['concern', 'understand', 'hear', 'appreciate', 'thank you'];
  const empathyTerms = ['sorry', 'frustrating', 'upsetting', 'difficult', 'understand why'];
  const nextStepTerms = [
    'i will',
    'we will',
    'follow up',
    'by tomorrow',
    'today',
    'review',
    'speak with',
    'investigate',
  ];
  const timelineTerms = ['today', 'tomorrow', 'by ', 'within', 'follow up'];
  const riskTerms = {
    blame: ['your child', 'the child is', 'the parent is', 'the teacher is', 'blame'],
    dismissive: ['calm down', 'you are overreacting', 'no issue', 'nothing happened'],
    overpromise: ['i promise', 'guarantee', 'will never happen again', 'immediately resolved'],
  };

  const hasAcknowledgment = includesAny(lowered, acknowledgmentTerms);
  const hasEmpathy = includesAny(lowered, empathyTerms) || includesAny(lowered, ['understand why']);
  const hasNextStep = includesAny(lowered, nextStepTerms);
  const hasTimeline = includesAny(lowered, timelineTerms);
  const hasRiskBlame = includesAny(lowered, riskTerms.blame);
  const hasRiskDismissive = includesAny(lowered, riskTerms.dismissive);
  const hasRiskOverpromise = includesAny(lowered, riskTerms.overpromise);
  const hasAnyRisk = hasRiskBlame || hasRiskDismissive || hasRiskOverpromise;
  const hasInjuryLanguage = includesAny(lowered, ['injury', 'head injury', 'head trauma', 'fell', 'hit his head']);
  const hasDocumentationLanguage = includesAny(lowered, [
    'documentation',
    'incident report',
    'accident report',
    'nurse record',
    'records',
    'review',
  ]);
  const hasConfidentialityLanguage = includesAny(lowered, [
    'confidential',
    'privacy',
    'student privacy',
    'cannot share',
    'cannot discuss another student',
  ]);
  const hasDistrictGuidanceLanguage = includesAny(lowered, [
    'district',
    'admin guidance',
    'administrative guidance',
    'district procedures',
    'policy',
    'procedures',
  ]);
  const hasFollowUpLanguage = includesAny(lowered, ['follow up', 'follow-up', 'by tomorrow', 'within', 'today']);
  const hasReimbursementPromiseRisk = includesAny(lowered, [
    'we will reimburse',
    'we will pay',
    'the school will pay',
    'i will reimburse',
    'we will forward the bill',
  ]);
  const hasOtherFamilyPaysRisk = includesAny(lowered, [
    'henry\'s parents will pay',
    'the other family will pay',
    'we will send the bill to',
    'forward the bill to',
  ]);
  const hasNamedStudentBlameRisk = includesAny(lowered, [
    'henry',
    'the other student caused',
    'the other student pushed',
    'the other student tackled',
    'their son caused',
  ]);
  const hasDisciplineGuaranteeRisk = includesAny(lowered, [
    'will be disciplined',
    'guarantee discipline',
    'will suspend',
    'will punish',
    'discipline immediately',
  ]);
  const hasConfidentialInfoRisk = includesAny(lowered, [
    'i can share the other student',
    'i will share the other student',
    'here is the other student',
    'i can provide details about the other student',
  ]);
  const hasDismissInjuryRisk = includesAny(lowered, [
    'minor injury',
    'not serious',
    'no real injury',
    'nothing happened',
    'not a concern',
  ]);
  const hasTeacherSupportLanguage = includesAny(lowered, [
    'support the teacher',
    'support for the teacher',
    'teacher support',
    'classroom support',
    'support the class',
    'respond to the teacher',
  ]);
  const hasStudentRemovalLanguage = includesAny(lowered, [
    'remove',
    'removal',
    'out of class',
    'leave class',
    'behavior',
    'disruption',
  ]);
  const hasContextGatheringLanguage = includesAny(lowered, [
    'gather context',
    'more context',
    'review what happened',
    'understand what happened',
    'check pattern',
    'look for patterns',
    'before deciding',
    'investigate',
  ]);
  const hasStudentDignityLanguage = includesAny(lowered, [
    'dignity',
    'respect',
    'private',
    'not public',
    'without shaming',
    'reentry',
    'restore',
  ]);
  const hasStudentBlameRisk = includesAny(lowered, [
    'this student is the problem',
    'bad kid',
    'defiant child',
    'the student is the issue',
    'the student is the problem',
    'embarrass',
    'shame',
  ]);
  const hasTeacherBlameRisk = includesAny(lowered, [
    'the teacher caused this',
    'teacher is the problem',
    'teacher cannot manage',
    'teacher is overreacting',
  ]);
  const hasAutoRemovalRisk = includesAny(lowered, [
    'remove the student immediately',
    'always remove',
    'automatic removal',
    'i will remove the student now',
  ]);
  const hasNoReentrySupportRisk = hasStudentRemovalLanguage && !includesAny(lowered, [
    'reentry',
    'return to class',
    'support plan',
    'follow up',
    'next step',
  ]);
  const hasPtoTalentShowLanguage = includesAny(lowered, [
    'pto',
    'talent show',
    'volunteer',
    'fundraising',
  ]);
  const hasParentFrustrationLanguage = includesAny(lowered, [
    'frustrated',
    'frustration',
    'hard',
    'roadblock',
    'unsupported',
  ]);
  const hasFamilyInvolvementLanguage = includesAny(lowered, [
    'family involvement',
    'family partnership',
    'parent involvement',
    'community',
    'school community',
    'value your support',
    'value your involvement',
  ]);
  const hasConversationInviteLanguage = includesAny(lowered, [
    'would you be open to',
    'can we talk',
    'conversation',
    'follow-up conversation',
    'connect',
    'meet',
    'call',
  ]);
  const hasPtoBlameRisk = includesAny(lowered, [
    'pto is the problem',
    'pto caused this',
    'pto failed',
    'the pto failed you',
    'staff failed',
    'staff is the problem',
    'it is their fault',
  ]);
  const hasPressureToContinueRisk = includesAny(lowered, [
    'you need to keep helping',
    'you should not step away',
    'you must continue',
    'we need you to stay involved',
    'do not quit',
  ]);
  const hasAcademicLanguage = includesAny(lowered, [
    'academic',
    'grades',
    'performance',
    'assignments',
    'missing work',
  ]);
  const hasRecordReviewLanguage = includesAny(lowered, [
    'review records',
    'review academic records',
    'review data',
    'look at grades',
    'missing assignments',
    'patterns over time',
    'data',
  ]);
  const hasTeacherInvolvementLanguage = includesAny(lowered, [
    'teacher input',
    'speak with the teacher',
    'check with the teacher',
    'teacher insight',
    'classroom teacher',
  ]);
  const hasAcademicStudentBlameRisk = includesAny(lowered, [
    'your child is the problem',
    'student responsibility issue',
    'your child needs to be more responsible',
    'the student is lazy',
    'the student is the issue',
  ]);
  const hasAcademicTeacherBlameRisk = includesAny(lowered, [
    'the teacher is the problem',
    'the teacher caused this',
    'teacher is at fault',
    'this is the teacher’s fault',
  ]);
  const hasNoPlanRisk = !hasNextStep;
  const hasDataIgnoreRisk = hasAcademicLanguage && !hasRecordReviewLanguage;
  const hasDismissParentRisk = includesAny(lowered, [
    'nothing to worry about',
    'this is normal',
    'not a concern',
    'you are overreacting',
  ]);

  const contextConceptGroups = {
    parentFinalResponse: [
      ['parent', 'family', 'guardian'],
      ['child', 'student', 'daughter', 'son'],
      ['classroom reward', 'pizza party', 'participation', 'reward system', 'incentive'],
      ['review', 'investigate', 'look into', 'gather facts'],
      ['teacher', 'classroom practice', 'instructional practice'],
      ['follow up', 'follow-up', 'circle back', 'update you'],
    ],
    voicemailParent: [
      ['parent', 'family', 'guardian'],
      ['child', 'student'],
      ['concern', 'issue', 'worry'],
      ['help', 'support', 'assist'],
      ['follow up', 'follow-up', 'call back', 'update'],
      ['school', 'teacher', 'classroom', 'principal'],
    ],
    voicemailTeacher: [
      ['teacher', 'educator', 'staff'],
      ['class', 'classroom'],
      ['student', 'students'],
      ['support', 'help', 'assist', 'coverage'],
      ['concern', 'issue', 'decision', 'judgment'],
      ['follow up', 'follow-up', 'check in', 'update'],
    ],
    parentEscalation: [
      ['parent', 'family', 'guardian'],
      ['lunch', 'cafeteria', 'incident', 'office'],
      ['student', 'child'],
      ['voicemail', 'call', 'called home', 'message'],
      ['facts', 'review', 'investigate', 'gather'],
      ['follow up', 'follow-up', 'timeline', 'update'],
    ],
    staffBoundary: [
      ['staff', 'employee', 'cafeteria worker', 'worker', 'adult'],
      ['boundary', 'professional', 'expectation', 'conduct'],
      ['student', 'child'],
      ['parent role', 'staff role', 'separate', 'role'],
      ['address', 'speak with', 'conversation', 'follow up'],
      ['today', 'next steps', 'document', 'process'],
    ],
    teacherConflict: [
      ['teacher', 'teachers', 'team leader', 'veteran'],
      ['approach', 'instruction', 'strategy', 'tools', 'methods'],
      ['both', 'each', 'together', 'perspective'],
      ['align', 'consistency', 'grade level', 'students'],
      ['conversation', 'discuss', 'listen', 'next steps'],
      ['neutral', 'professional', 'respect', 'calm'],
    ],
    studentThreatEmail: [
      ['parent', 'family', 'guardian'],
      ['student', 'child'],
      ['threat', 'threatening', 'safety'],
      ['serious', 'seriously', 'concern'],
      ['investigate', 'review', 'look into', 'gather facts'],
      ['follow up', 'follow-up', 'update', 'next steps'],
    ],
    recessInjuryEmail: [
      ['parent', 'family', 'guardian'],
      ['student', 'child', 'son'],
      ['injury', 'head injury', 'head trauma', 'recess'],
      ['documentation', 'incident report', 'nurse record', 'records'],
      ['privacy', 'confidential', 'student privacy'],
      ['district', 'guidance', 'procedures', 'policy'],
      ['follow up', 'follow-up', 'timeline', 'update'],
    ],
    studentRemovalVoicemail: [
      ['teacher', 'classroom', 'educator'],
      ['student', 'behavior', 'removal'],
      ['support', 'immediate support', 'classroom support'],
      ['context', 'gather', 'review', 'pattern'],
      ['follow up', 'follow-up', 'next steps', 'reentry'],
      ['dignity', 'respect', 'private', 'fair'],
    ],
    ptoTalentShowEmail: [
      ['parent', 'family', 'volunteer', 'pto'],
      ['talent show', 'fundraising', 'hospitality committee'],
      ['frustrated', 'frustration', 'roadblock', 'unsupported'],
      ['thank you', 'appreciate'],
      ['conversation', 'connect', 'meet', 'call'],
      ['family involvement', 'school community', 'partnership'],
      ['follow up', 'follow-up', 'next step', 'timeline'],
    ],
    academicDeclineEmail: [
      ['parent', 'family', 'guardian'],
      ['student', 'child'],
      ['academic', 'grades', 'performance', 'missing assignments'],
      ['review', 'records', 'data', 'patterns'],
      ['teacher', 'classroom teacher', 'teacher input'],
      ['follow up', 'follow-up', 'timeline', 'next steps'],
    ],
  };

  const selectedConceptGroups = contextConceptGroups[contextType] || [];
  const matchedConceptCount = selectedConceptGroups.reduce((count, group) => (
    includesAny(lowered, group) ? count + 1 : count
  ), 0);
  const hasStaffBehaviorReference = includesAny(lowered, ['staff', 'employee', 'adult behavior', 'cafeteria worker']);
  const hasBoundaryLanguage = includesAny(lowered, ['boundary', 'professional', 'professionalism', 'conduct']);
  const hasRoleSeparationLanguage = includesAny(lowered, [
    'parent role',
    'employee role',
    'staff role',
    'separate',
    'separately',
    'while at work',
  ]);
  const hasBothTeacherReference = includesAny(lowered, ['both teachers', 'each teacher', 'both of you', 'two teachers']);
  const hasLeaderReference = includesAny(lowered, ['team leader', 'grade-level leader', 'grade level leader']);
  const hasVeteranReference = includesAny(lowered, ['veteran', 'years of experience', 'experienced teacher']);
  const hasNeutralityLanguage = includesAny(lowered, [
    'neutral',
    'not taking sides',
    'without taking sides',
    'respect',
    'professional',
    'calm',
    'listen to both',
    'hear both',
  ]);
  const hasDeEscalationLanguage = includesAny(lowered, [
    'de-escalate',
    'deescalate',
    'calm',
    'respectful',
    'productive conversation',
    'ground rules',
  ]);
  const hasEarlySidingRisk = includesAny(lowered, [
    'i agree with the team leader',
    'the veteran teacher is wrong',
    'the team leader is wrong',
    'you need to do it my way',
    'no discussion',
  ]);
  const contextMatchScore = selectedConceptGroups.length
    ? matchedConceptCount / selectedConceptGroups.length
    : 0;
  const hasVeryLowContextMatch = selectedConceptGroups.length > 0
    && (matchedConceptCount <= 1 || contextMatchScore < 0.34);
  const unrelatedScenario = Boolean(normalizedResponse) && hasVeryLowContextMatch;

  const getStatusAndNote = (name) => {
    if (name === 'Situation Fit / Accuracy') {
      if (!normalizedResponse) {
        return {
          status: 'Needs Attention',
          note: 'Add a response that directly addresses the voicemail or school scenario provided.',
        };
      }
      if (contextType === 'staffBoundary') {
        if (!hasStaffBehaviorReference || !hasBoundaryLanguage || !hasRoleSeparationLanguage) {
          return {
            status: 'Needs Attention',
            note: 'Name the staff behavior, use boundary/professional language, and separate parent role from employee role.',
          };
        }
        if (hasMeaningfulLength) {
          return {
            status: 'Strong',
            note: 'Response directly addresses staff conduct, professional boundaries, and role separation.',
          };
        }
        return {
          status: 'Developing',
          note: 'The response is aligned; add more specific language for follow-up and expectations.',
        };
      }
      if (contextType === 'teacherConflict') {
        if (!(hasBothTeacherReference || (hasLeaderReference && hasVeteranReference))) {
          return {
            status: 'Needs Attention',
            note: 'Reference both teachers and the instructional disagreement before outlining your leadership response.',
          };
        }
        if (hasMeaningfulLength) {
          return {
            status: 'Strong',
            note: 'Response fits the scenario by naming both perspectives and the shared instructional issue.',
          };
        }
        return {
          status: 'Developing',
          note: 'Scenario fit is present; add a little more specificity about the issue and leadership approach.',
        };
      }
      if (contextType === 'studentThreatEmail') {
        const hasSafetyLanguage = includesAny(lowered, ['safety', 'safe', 'threat', 'threatening']);
        const hasSeriousnessLanguage = includesAny(lowered, ['serious', 'seriously', 'immediate concern']);
        if (!hasSafetyLanguage || !hasSeriousnessLanguage) {
          return {
            status: 'Needs Attention',
            note: 'Name the safety concern directly and acknowledge the seriousness of threatening language.',
          };
        }
        if (hasRiskOverpromise) {
          return {
            status: 'Needs Attention',
            note: 'Avoid promising outcomes before fact-finding; keep the response accurate and process-based.',
          };
        }
        if (hasMeaningfulLength && hasNextStep) {
          return {
            status: 'Strong',
            note: 'Response fits the case by centering safety, seriousness, and process-focused next steps.',
          };
        }
        return {
          status: 'Developing',
          note: 'Scenario fit is present; add clearer process language and immediate follow-up commitments.',
        };
      }
      if (contextType === 'recessInjuryEmail') {
        if (!hasInjuryLanguage || !hasDocumentationLanguage || !hasDistrictGuidanceLanguage) {
          return {
            status: 'Needs Attention',
            note: 'Address the injury concern directly and explain records review plus district-guided next steps.',
          };
        }
        if (!hasConfidentialityLanguage) {
          return {
            status: 'Developing',
            note: 'Add student privacy/confidentiality language before discussing any other student.',
          };
        }
        if (hasReimbursementPromiseRisk || hasOtherFamilyPaysRisk || hasNamedStudentBlameRisk) {
          return {
            status: 'Needs Attention',
            note: 'Avoid reimbursement promises, assigning fault, or naming/blaming another student.',
          };
        }
        if (hasMeaningfulLength && hasFollowUpLanguage) {
          return {
            status: 'Strong',
            note: 'Response fits the case by acknowledging injury risk, records review, privacy, and district process.',
          };
        }
        return {
          status: 'Developing',
          note: 'Case alignment is present; add a clearer follow-up timeline and specific process language.',
        };
      }
      if (contextType === 'studentRemovalVoicemail') {
        if (!hasTeacherSupportLanguage || !hasStudentRemovalLanguage || !hasContextGatheringLanguage) {
          return {
            status: 'Needs Attention',
            note: 'Address teacher support, student behavior/removal context, and how you will gather facts before final action.',
          };
        }
        if (!hasStudentDignityLanguage || !hasFollowUpLanguage) {
          return {
            status: 'Developing',
            note: 'Add language protecting student dignity and include clear follow-up for teacher, student, and classroom.',
          };
        }
        if (hasMeaningfulLength) {
          return {
            status: 'Strong',
            note: 'Response balances teacher support, context-gathering, student dignity, and concrete follow-up steps.',
          };
        }
        return {
          status: 'Developing',
          note: 'Scenario fit is present; strengthen with more concrete, step-by-step action language.',
        };
      }
      if (contextType === 'ptoTalentShowEmail') {
        if (!hasPtoTalentShowLanguage || !hasParentFrustrationLanguage) {
          return {
            status: 'Needs Attention',
            note: 'Name the PTO/talent show volunteer concern and acknowledge the parent’s frustration directly.',
          };
        }
        if (!hasAcknowledgment || !hasConversationInviteLanguage || !hasNextStep) {
          return {
            status: 'Developing',
            note: 'Add appreciation, relationship-repair language, and a clear invitation to a calm follow-up conversation.',
          };
        }
        if (hasPtoBlameRisk) {
          return {
            status: 'Needs Attention',
            note: 'Avoid blaming PTO or staff; keep the response relationship-centered and constructive.',
          };
        }
        if (hasMeaningfulLength && hasFamilyInvolvementLanguage) {
          return {
            status: 'Strong',
            note: 'Response fits the case by acknowledging frustration, preserving trust, and inviting a constructive next step.',
          };
        }
        return {
          status: 'Developing',
          note: 'Core scenario fit is present; add stronger school-community partnership language.',
        };
      }
      if (contextType === 'academicDeclineEmail') {
        if (!hasAcademicLanguage || !hasRecordReviewLanguage || !hasTeacherInvolvementLanguage) {
          return {
            status: 'Needs Attention',
            note: 'Address academic decline directly and include records/data review plus teacher involvement.',
          };
        }
        if (hasAcademicStudentBlameRisk || hasAcademicTeacherBlameRisk) {
          return {
            status: 'Needs Attention',
            note: 'Avoid blaming the student or teacher. Keep the response neutral, collaborative, and process-based.',
          };
        }
        if (hasMeaningfulLength && hasFollowUpLanguage) {
          return {
            status: 'Strong',
            note: 'Response fits the case by acknowledging concern, using data review, involving the teacher, and outlining follow-up.',
          };
        }
        return {
          status: 'Developing',
          note: 'Case alignment is present; strengthen with clearer next steps and timeline language.',
        };
      }
      if (unrelatedScenario) {
        return {
          status: 'Needs Attention',
          note: 'The writing may be clear, but it does not appear connected to this school leadership scenario.',
        };
      }
      if (contextMatchScore >= 0.67 && hasMeaningfulLength) {
        return {
          status: 'Strong',
          note: 'Response is grounded in the actual concern, uses scenario evidence, and avoids unrelated claims.',
        };
      }
      return {
        status: 'Developing',
        note: 'Connect more directly to the specific issue, evidence, and follow-up needed in this scenario.',
      };
    }

    if (unrelatedScenario) {
      return {
        status: 'Developing',
        note: 'This cannot be fully assessed until the response addresses the actual scenario.',
      };
    }

    if (name === 'Tone & Professionalism') {
      if (!normalizedResponse) {
        return { status: 'Needs Attention', note: 'Add a calm, professional response before submitting.' };
      }
      if (!hasAnyRisk && hasMeaningfulLength) {
        return { status: 'Strong', note: 'Tone is steady and professional without blame or escalation.' };
      }
      if (contextType === 'teacherConflict' && (hasNeutralityLanguage || hasDeEscalationLanguage) && !hasEarlySidingRisk) {
        return { status: 'Strong', note: 'Tone is neutral, respectful, and de-escalates adult conflict.' };
      }
      if (hasRiskBlame || hasRiskDismissive) {
        return { status: 'Needs Attention', note: 'Remove blaming or dismissive language to protect trust.' };
      }
      return { status: 'Developing', note: 'Tone is mostly professional, but tighten wording for consistency.' };
    }

    if (name === 'Empathy / Acknowledgment') {
      if (hasAcknowledgment && hasEmpathy) {
        return { status: 'Strong', note: 'You acknowledged concern and named the emotional impact.' };
      }
      if (hasAcknowledgment || hasEmpathy) {
        return { status: 'Developing', note: 'Add one clear line that validates the family or caller experience.' };
      }
      return { status: 'Needs Attention', note: 'Include explicit acknowledgment and empathy language.' };
    }

    if (name === 'Clarity') {
      if (hasMeaningfulLength && hasNextStep) {
        return { status: 'Strong', note: 'Response is substantive and points to concrete action.' };
      }
      if (wordCount >= 18) {
        return { status: 'Developing', note: 'Clarify with one or two concrete actions and cleaner structure.' };
      }
      return { status: 'Needs Attention', note: 'Response is very brief; add more concrete and complete guidance.' };
    }

    if (name === 'Next Steps') {
      if (hasNextStep && hasTimeline) {
        return { status: 'Strong', note: 'Next steps and timeline are explicit and actionable.' };
      }
      if (hasNextStep) {
        return { status: 'Developing', note: 'Add when follow-up will happen (for example, today or by tomorrow).' };
      }
      return { status: 'Needs Attention', note: 'State what you will do next and when the person will hear back.' };
    }

    if (contextType === 'recessInjuryEmail') {
      const recessRiskNotes = [];
      if (hasReimbursementPromiseRisk) recessRiskNotes.push('reimbursement promise');
      if (hasOtherFamilyPaysRisk) recessRiskNotes.push('claiming the other family will pay');
      if (hasNamedStudentBlameRisk) recessRiskNotes.push('naming/blaming another student');
      if (hasDisciplineGuaranteeRisk) recessRiskNotes.push('discipline guarantee');
      if (hasConfidentialInfoRisk) recessRiskNotes.push('sharing confidential student details');
      if (hasDismissInjuryRisk) recessRiskNotes.push('dismissing injury concern');
      if (recessRiskNotes.length) {
        return {
          status: 'Needs Attention',
          note: `Risk detected: ${recessRiskNotes.join(', ')}. Keep language neutral, private, and process-based.`,
        };
      }
      if (!hasDistrictGuidanceLanguage || !hasConfidentialityLanguage) {
        return {
          status: 'Developing',
          note: 'Reduce risk by naming district procedures and student privacy boundaries explicitly.',
        };
      }
      return {
        status: 'Strong',
        note: 'Language avoids liability promises, protects confidentiality, and follows district process.',
      };
    }
    if (contextType === 'studentRemovalVoicemail') {
      const studentRemovalRiskNotes = [];
      if (hasAutoRemovalRisk) studentRemovalRiskNotes.push('automatic removal without context or follow-up');
      if (hasTeacherBlameRisk) studentRemovalRiskNotes.push('blaming the teacher');
      if (hasStudentBlameRisk) studentRemovalRiskNotes.push('blaming/shaming the student');
      if (hasNoReentrySupportRisk) studentRemovalRiskNotes.push('no classroom reentry/support plan');
      if (!hasTeacherSupportLanguage) studentRemovalRiskNotes.push('teacher support not addressed');
      if (studentRemovalRiskNotes.length) {
        return {
          status: 'Needs Attention',
          note: `Risk detected: ${studentRemovalRiskNotes.join(', ')}. Keep response supportive, neutral, and follow-up based.`,
        };
      }
      if (!hasFollowUpLanguage || !hasStudentDignityLanguage) {
        return {
          status: 'Developing',
          note: 'Reduce risk with explicit follow-up and student-dignity language, including reentry support.',
        };
      }
      return {
        status: 'Strong',
        note: 'Response avoids overreaction, supports teacher needs, and protects student dignity with follow-up.',
      };
    }
    if (contextType === 'ptoTalentShowEmail') {
      const ptoRiskNotes = [];
      if (hasPtoBlameRisk) ptoRiskNotes.push('blaming PTO/staff');
      if (hasRiskDismissive) ptoRiskNotes.push('dismissive response to frustration');
      if (hasPressureToContinueRisk) ptoRiskNotes.push('pressuring parent to continue volunteering');
      const startsWithSystemDefense = /^\s*(the issue|the problem|the process|planning limitations|limitations)/.test(lowered);
      if (startsWithSystemDefense && !hasAcknowledgment) ptoRiskNotes.push('arguing details before acknowledgment');
      if (!hasNextStep) ptoRiskNotes.push('missing next step/conversation invitation');
      if (ptoRiskNotes.length) {
        return {
          status: 'Needs Attention',
          note: `Risk detected: ${ptoRiskNotes.join(', ')}. Lead with appreciation, acknowledgment, and relationship repair.`,
        };
      }
      if (!hasConversationInviteLanguage || !hasFamilyInvolvementLanguage) {
        return {
          status: 'Developing',
          note: 'Reduce risk by explicitly inviting a calm follow-up and reaffirming the school’s value of family involvement.',
        };
      }
      return {
        status: 'Strong',
        note: 'Response protects trust by avoiding blame, de-escalating tone, and offering a constructive next step.',
      };
    }
    if (contextType === 'academicDeclineEmail') {
      const academicRiskNotes = [];
      if (hasAcademicStudentBlameRisk) academicRiskNotes.push('blaming the student immediately');
      if (hasAcademicTeacherBlameRisk) academicRiskNotes.push('blaming the teacher');
      if (hasNoPlanRisk) academicRiskNotes.push('no plan');
      if (hasDataIgnoreRisk) academicRiskNotes.push('ignoring records/data review');
      if (hasDismissParentRisk) academicRiskNotes.push('dismissing parent concern');
      if (academicRiskNotes.length) {
        return {
          status: 'Needs Attention',
          note: `Risk detected: ${academicRiskNotes.join(', ')}. Keep language neutral, data-informed, and follow-up based.`,
        };
      }
      if (!hasRecordReviewLanguage || !hasTeacherInvolvementLanguage || !hasTimeline) {
        return {
          status: 'Developing',
          note: 'Reduce risk by naming record review, teacher input, and a specific follow-up timeline.',
        };
      }
      return {
        status: 'Strong',
        note: 'Response avoids blame, uses records and teacher input, and provides clear next steps and timeline.',
      };
    }
    if (hasAnyRisk) {
      const riskNotes = [];
      if (hasRiskBlame) riskNotes.push('blame wording');
      if (hasRiskDismissive) riskNotes.push('dismissive wording');
      if (hasRiskOverpromise) riskNotes.push('overpromising');
      return {
        status: 'Needs Attention',
        note: `Risk detected: ${riskNotes.join(', ')}. Replace with neutral, fact-finding language.`,
      };
    }
    if (!hasTimeline || !hasNextStep) {
      return {
        status: 'Developing',
        note: 'Reduce risk by avoiding vague responses and adding a realistic timeline.',
      };
    }
    return {
      status: 'Strong',
      note: 'Language avoids overpromising and keeps accountability grounded in process.',
    };
  };

  const categories = [
    'Situation Fit / Accuracy',
    'Tone & Professionalism',
    'Empathy / Acknowledgment',
    'Clarity',
    'Next Steps',
    'Risk Awareness',
  ].map((name) => ({ name, ...getStatusAndNote(name) }));

  const contextLabel = {
    parentFinalResponse: 'final parent response',
    voicemailParent: 'voicemail response to parent request',
    voicemailTeacher: 'voicemail response to teacher call',
    parentEscalation: 'parent escalation response',
    staffBoundary: 'staff boundary response',
    teacherConflict: 'teacher conflict opening statement',
    studentThreatEmail: 'student threat parent email response',
    recessInjuryEmail: 'recess injury parent email response',
    studentRemovalVoicemail: 'student removal voicemail response/action plan',
    ptoTalentShowEmail: 'PTO talent show parent-volunteer response',
    academicDeclineEmail: 'academic decline parent email response',
  }[contextType] || 'written response';

  const needsAttentionCount = categories.filter((category) => category.status === 'Needs Attention').length;
  const strongCount = categories.filter((category) => category.status === 'Strong').length;
  const situationFitCategory = categories.find((category) => category.name === 'Situation Fit / Accuracy');
  const summary = situationFitCategory?.status === 'Needs Attention'
    ? unrelatedScenario
      ? `This ${contextLabel} needs attention because it does not clearly address the scenario prompt. Before tone or next steps can be evaluated, the response should connect directly to the stated concern.`
      : `This ${contextLabel} needs attention because it does not clearly address the situation.`
    : needsAttentionCount > 0
      ? `This ${contextLabel} has strengths, but ${needsAttentionCount} category${needsAttentionCount > 1 ? 'ies need' : ' needs'} attention.`
      : strongCount >= 5
      ? `This ${contextLabel} is clear, empathetic, and professionally grounded.`
      : `This ${contextLabel} is developing and can be strengthened with clearer follow-through language.`;

  return { summary, categories };
}

const leadershipStyles = [
  'Democratic',
  'Autocratic',
  'Laissez-faire',
  'Transformational',
  'Transactional',
  'Bureaucratic',
  'Servant',
  'Adaptive',
];

const leadershipWritingKeywordClusters = {
  Democratic: ['we', 'together', 'team', 'input', 'perspective', 'collaborate', 'discuss', 'listen', 'shared', 'involve'],
  Autocratic: ['i will', 'must', 'immediately', 'require', 'direct', 'decide', 'non-negotiable', 'mandate'],
  'Laissez-faire': ['let me know', 'handle it', 'up to you', 'wait and see', 'later', 'optional', 'if needed'],
  Transformational: ['growth', 'improve', 'develop', 'opportunity', 'change', 'build', 'better', 'reflect', 'learn'],
  Transactional: ['expectations', 'consequences', 'follow-through', 'compliance', 'rules', 'reward', 'accountability'],
  Bureaucratic: ['policy', 'procedure', 'protocol', 'process', 'documentation', 'district', 'regulation', 'formal', 'records'],
  Servant: ['support', 'care', 'help', 'understand', 'dignity', 'student needs', 'staff needs', 'empathy', 'safe'],
  Adaptive: [
    'based on what we know',
    'gather information',
    'next steps',
    'balance',
    'adjust',
    'monitor',
    'respond',
    'context',
    'flexible',
    'appropriate',
  ],
};

function countTermOccurrences(text, term) {
  let count = 0;
  let start = 0;
  while (start < text.length) {
    const index = text.indexOf(term, start);
    if (index === -1) break;
    count += 1;
    start = index + term.length;
  }
  return count;
}

function buildLeadershipStyleProfile({ writtenResponses = [], decisions = [] } = {}) {
  const writingScores = leadershipStyles.reduce((acc, style) => ({ ...acc, [style]: 0 }), {});
  const decisionScores = leadershipStyles.reduce((acc, style) => ({ ...acc, [style]: 0 }), {});

  const normalizedWrittenResponses = writtenResponses
    .map((response) => response.trim().toLowerCase())
    .filter(Boolean);

  normalizedWrittenResponses.forEach((response) => {
    leadershipStyles.forEach((style) => {
      const terms = leadershipWritingKeywordClusters[style] || [];
      terms.forEach((term) => {
        writingScores[style] += countTermOccurrences(response, term.toLowerCase());
      });
    });
  });

  const normalizedDecisions = decisions
    .map((decision) => decision.trim().toLowerCase())
    .filter(Boolean);

  normalizedDecisions.forEach((decision) => {
    if (includesAny(decision, ['gather', 'investigate', 'review', 'records', 'information'])) {
      decisionScores.Adaptive += 2;
      decisionScores.Bureaucratic += 1.5;
      decisionScores.Democratic += 1;
    }
    if (includesAny(decision, ['call', 'immediate', 'immediately', 'act now'])) {
      decisionScores.Autocratic += 1.5;
      decisionScores.Servant += 1;
      decisionScores.Adaptive += 1;
    }
    if (includesAny(decision, ['delegate', 'on their own', 'up to', 'follow-up roles'])) {
      decisionScores['Laissez-faire'] += 1.5;
      decisionScores.Democratic += 1;
    }
    if (includesAny(decision, ['support teacher immediately', 'remove student', 'suspension', 'no conference'])) {
      decisionScores.Autocratic += 1.5;
      decisionScores.Transactional += 1.5;
    }
    if (includesAny(decision, ['acknowledge', 'validate', 'hear', 'listen'])) {
      decisionScores.Servant += 1.5;
      decisionScores.Adaptive += 1;
      decisionScores.Democratic += 1;
    }
    if (includesAny(decision, ['district', 'administration', 'counseling support', 'guidance', 'procedure', 'policy'])) {
      decisionScores.Bureaucratic += 1.5;
      decisionScores.Adaptive += 1;
    }
  });

  const writingTotal = Object.values(writingScores).reduce((sum, value) => sum + value, 0);
  const decisionTotal = Object.values(decisionScores).reduce((sum, value) => sum + value, 0);

  const bothAvailable = writingTotal > 0 && decisionTotal > 0;
  const writingWeight = bothAvailable ? 0.75 : writingTotal > 0 ? 1 : 0;
  const decisionWeight = bothAvailable ? 0.25 : decisionTotal > 0 ? 1 : 0;

  const normalizedScores = leadershipStyles.reduce((acc, style) => {
    const normalizedWritingScore = writingTotal > 0 ? writingScores[style] / writingTotal : 0;
    const normalizedDecisionScore = decisionTotal > 0 ? decisionScores[style] / decisionTotal : 0;
    acc[style] = (normalizedWritingScore * writingWeight) + (normalizedDecisionScore * decisionWeight);
    return acc;
  }, {});

  const rankedStyles = leadershipStyles
    .map((style) => ({ style, score: normalizedScores[style] }))
    .sort((a, b) => b.score - a.score);

  const primaryStyle = rankedStyles[0];
  const secondaryTendencies = rankedStyles.slice(1, 4).filter((entry) => entry.score > 0);
  const situationalWatchAreas = rankedStyles.slice(-3).reverse().filter((entry) => entry.score > 0);

  const dataNote = bothAvailable
    ? 'Profile weights: written responses 75% and decision/button choices 25%.'
    : writingTotal > 0
      ? 'Decision-choice data was limited, so this profile is based on writing patterns only.'
      : decisionTotal > 0
        ? 'Writing data was limited, so this profile is based on decision/button choices only.'
        : 'Writing and decision data are limited, so this profile is provisional.';

  return {
    primaryStyle,
    secondaryTendencies,
    situationalWatchAreas,
    dataNote,
    hasWritingData: writingTotal > 0,
    hasDecisionData: decisionTotal > 0,
  };
}

export default function SimulationShellClient() {
  const [builderMode, setBuilderMode] = useState(false);
  const [currentModule, setCurrentModule] = useState('arrival');
  const [timelineStatuses, setTimelineStatuses] = useState(initialModuleStatuses);
  const [started, setStarted] = useState(true);
  const [folders, setFolders] = useState(initialFolders);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [firstDecision, setFirstDecision] = useState('');
  const [investigationDecision, setInvestigationDecision] = useState('');
  const [initialParentResponse, setInitialParentResponse] = useState('');
  const [finalParentResponse, setFinalParentResponse] = useState('');
  const [parentFinalWritingAssessment, setParentFinalWritingAssessment] = useState(null);
  const [hasCompletedFinalStep, setHasCompletedFinalStep] = useState(false);
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  const [isVicOpen, setIsVicOpen] = useState(false);
  const [arrivalPriorityAssignments, setArrivalPriorityAssignments] = useState({});
  const [arrivalRankingRecord, setArrivalRankingRecord] = useState(null);
  const [arrivalCoachingRecord, setArrivalCoachingRecord] = useState(null);
  const [arrivalCompleted, setArrivalCompleted] = useState(false);
  const [iepDecision, setIepDecision] = useState('');
  const [iepFolderChoice, setIepFolderChoice] = useState('');
  const [iepLeadershipRecord, setIepLeadershipRecord] = useState(null);
  const [announcementsDecision, setAnnouncementsDecision] = useState('');
  const [announcementsTaskFolders, setAnnouncementsTaskFolders] = useState({});
  const [announcementsLeadershipRecord, setAnnouncementsLeadershipRecord] = useState(null);
  const [voicemailDecisions, setVoicemailDecisions] = useState({ parentHelp: '', teacherCall: '' });
  const [voicemailResponses, setVoicemailResponses] = useState({ parentHelp: '', teacherCall: '' });
  const [showParentSupportingInfo, setShowParentSupportingInfo] = useState(false);
  const [showTeacherSupportingInfo, setShowTeacherSupportingInfo] = useState(false);
  const [voicemailWritingAssessments, setVoicemailWritingAssessments] = useState({
    parentHelp: null,
    teacherCall: null,
  });
  const [voicemailTaskClosed, setVoicemailTaskClosed] = useState(false);
  const [voicemailLeadershipRecord, setVoicemailLeadershipRecord] = useState(null);
  const [walkthroughResponses, setWalkthroughResponses] = useState(
    walkthroughFormFields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {}),
  );
  const [walkthroughLeadershipRecord, setWalkthroughLeadershipRecord] = useState(null);
  const [lunchClimateDecision, setLunchClimateDecision] = useState('');
  const [lunchMonitorDirectionNote, setLunchMonitorDirectionNote] = useState('');
  const [lunchClimateCoachingRecord, setLunchClimateCoachingRecord] = useState(null);
  const [lunchClimateInsightUnlocked, setLunchClimateInsightUnlocked] = useState(false);
  const [parentEscalationVoicemailPlayed, setParentEscalationVoicemailPlayed] = useState(false);
  const [parentEscalationDecision, setParentEscalationDecision] = useState('');
  const [parentEscalationResponse, setParentEscalationResponse] = useState('');
  const [showParentEscalationSupportingInfo, setShowParentEscalationSupportingInfo] = useState(false);
  const [showRewardConcernSupportingInfo, setShowRewardConcernSupportingInfo] = useState(false);
  const [parentEscalationWritingAssessment, setParentEscalationWritingAssessment] = useState(null);
  const [parentEscalationLeadershipRecord, setParentEscalationLeadershipRecord] = useState(null);
  const [cafeteriaBoundaryVoicemailPlayed, setCafeteriaBoundaryVoicemailPlayed] = useState(false);
  const [cafeteriaBoundaryDecision, setCafeteriaBoundaryDecision] = useState('');
  const [cafeteriaBoundaryResponse, setCafeteriaBoundaryResponse] = useState('');
  const [showCafeteriaBoundarySupportingInfo, setShowCafeteriaBoundarySupportingInfo] = useState(false);
  const [cafeteriaBoundaryWritingAssessment, setCafeteriaBoundaryWritingAssessment] = useState(null);
  const [cafeteriaBoundaryLeadershipRecord, setCafeteriaBoundaryLeadershipRecord] = useState(null);
  const [teacherConflictDecision, setTeacherConflictDecision] = useState('');
  const [teacherConflictResponse, setTeacherConflictResponse] = useState('');
  const [teacherConflictWritingAssessment, setTeacherConflictWritingAssessment] = useState(null);
  const [teacherConflictLeadershipRecord, setTeacherConflictLeadershipRecord] = useState(null);
  const [deskStackStatuses, setDeskStackStatuses] = useState(initialDeskStackStatuses);
  const [currentDeskStackItem, setCurrentDeskStackItem] = useState(null);
  const [studentThreatDecision, setStudentThreatDecision] = useState('');
  const [studentThreatResponse, setStudentThreatResponse] = useState('');
  const [showStudentThreatSupportingInfo, setShowStudentThreatSupportingInfo] = useState(false);
  const [studentThreatWritingAssessment, setStudentThreatWritingAssessment] = useState(null);
  const [academicDeclineDecision, setAcademicDeclineDecision] = useState('');
  const [academicDeclineResponse, setAcademicDeclineResponse] = useState('');
  const [showAcademicDeclineSupportingInfo, setShowAcademicDeclineSupportingInfo] = useState(false);
  const [academicDeclineWritingAssessment, setAcademicDeclineWritingAssessment] = useState(null);
  const [ptoTalentShowDecision, setPtoTalentShowDecision] = useState('');
  const [ptoTalentShowResponse, setPtoTalentShowResponse] = useState('');
  const [ptoTalentShowWritingAssessment, setPtoTalentShowWritingAssessment] = useState(null);
  const [recessInjuryDecision, setRecessInjuryDecision] = useState('');
  const [recessInjuryResponse, setRecessInjuryResponse] = useState('');
  const [showRecessInjurySupportingInfo, setShowRecessInjurySupportingInfo] = useState(false);
  const [recessInjuryWritingAssessment, setRecessInjuryWritingAssessment] = useState(null);
  const [studentRemovalDecision, setStudentRemovalDecision] = useState('');
  const [studentRemovalResponse, setStudentRemovalResponse] = useState('');
  const [studentRemovalWritingAssessment, setStudentRemovalWritingAssessment] = useState(null);
  const [moduleTransitionNote, setModuleTransitionNote] = useState('');
  const [snapshotPreviewMessage, setSnapshotPreviewMessage] = useState('');
  const [snapshotValidationMessage, setSnapshotValidationMessage] = useState('');
  const [saveProgressMessage, setSaveProgressMessage] = useState('');
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isGeneratingEvaluation, setIsGeneratingEvaluation] = useState(false);
  const [evaluationErrorMessage, setEvaluationErrorMessage] = useState('');
  const [isReportTestMode, setIsReportTestMode] = useState(false);
  const [reportTestNotice, setReportTestNotice] = useState('');
  const [lastSavedLabel, setLastSavedLabel] = useState('');
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const [hasReachedEndOfDay, setHasReachedEndOfDay] = useState(false);

  const hasSelectedDecision = Boolean(firstDecision);
  const [scene, setScene] = useState('initial');
  const isInvestigationScene = scene === 'investigation';
  const isReportScene = scene === 'report';
  const isDeskStackLanding = currentModule === 'endOfDayEmail' && currentDeskStackItem === null;
  const availableDeskStackItems = deskStackItems.filter((item) => item.isAvailable);
  const moduleCompletionState = useMemo(() => ({
    arrival: timelineStatuses.arrival === moduleStatuses.completed,
    endOfDayRewardConcern: deskStackStatuses.rewardConcern === deskStackItemStatuses.complete,
    iepMeeting: timelineStatuses.iepMeeting === moduleStatuses.completed,
    announcements: timelineStatuses.announcements === moduleStatuses.completed,
    voicemailParentHelp: Boolean(voicemailDecisions.parentHelp) && Boolean(voicemailResponses.parentHelp.trim()),
    voicemailTeacherCall: Boolean(voicemailDecisions.teacherCall) && Boolean(voicemailResponses.teacherCall.trim()),
    lunchClimate: timelineStatuses.lunchClimate === moduleStatuses.completed,
    parentEscalation: timelineStatuses.parentEscalation === moduleStatuses.completed,
    cafeteriaBoundary: timelineStatuses.cafeteriaBoundary === moduleStatuses.completed,
    teacherConflict: timelineStatuses.teacherConflict === moduleStatuses.completed,
    studentThreatEmail: !deskStackItems.find((item) => item.id === 'studentThreatEmail')?.isAvailable
      || deskStackStatuses.studentThreatEmail === deskStackItemStatuses.complete,
    academicDeclineEmail: !deskStackItems.find((item) => item.id === 'academicDeclineEmail')?.isAvailable
      || deskStackStatuses.academicDeclineEmail === deskStackItemStatuses.complete,
  }), [
    timelineStatuses,
    deskStackStatuses,
    voicemailDecisions,
    voicemailResponses,
  ]);
  const requiredDayModules = useMemo(
    () => requiredDayModuleDefinitions.filter((module) => (
      module.id !== 'studentThreatEmail'
      && module.id !== 'academicDeclineEmail'
    ) || deskStackItems.find((item) => item.id === module.id)?.isAvailable),
    [],
  );
  const unresolvedRequiredDayModules = requiredDayModules.filter((module) => !moduleCompletionState[module.id]);
  const completedRequiredModuleCount = requiredDayModules.length - unresolvedRequiredDayModules.length;
  const allRequiredModulesComplete = unresolvedRequiredDayModules.length === 0;
  const unresolvedRequiredItemCount = unresolvedRequiredDayModules.length;
  const canCloseDeskStackDay = availableDeskStackItems.every(
    (item) => deskStackStatuses[item.id] === deskStackItemStatuses.complete,
  ) && allRequiredModulesComplete;
  const selectedConsequence = hasSelectedDecision ? decisionConsequences[firstDecision] : null;
  const activeGuidance = useMemo(() => {
    if (currentModule === 'endOfDayEmail' && currentDeskStackItem) {
      const itemTitle = deskStackItems.find((item) => item.id === currentDeskStackItem)?.title || 'Current case';
      return {
        ...moduleGuidance.endOfDayEmail,
        insight: `${itemTitle}: keep your response calm, documented, and action-oriented.`,
      };
    }
    return moduleGuidance[currentModule] || moduleGuidance.arrival;
  }, [currentModule, currentDeskStackItem]);

  useEffect(() => {
    if (currentModule !== 'voicemail') return;
    addFolderItems({ red: [voicemailLoopTaskItem] });
  }, [currentModule]);

  useEffect(() => {
    if (currentModule !== 'lunchClimate') return;
    addFolderItems({ red: [lunchClimateTaskItem] });
  }, [currentModule]);

  useEffect(() => {
    if (currentModule !== 'parentEscalation') return;
    addFolderItems({ red: [parentEscalationTaskItem] });
  }, [currentModule]);

  useEffect(() => {
    if (currentModule !== 'cafeteriaBoundary') return;
    addFolderItems({ red: [cafeteriaBoundaryTaskItem] });
  }, [currentModule]);

  useEffect(() => {
    if (currentModule !== 'teacherConflict') return;
    addFolderItems({ red: [teacherConflictTaskItem] });
  }, [currentModule]);

  useEffect(() => {
    if (currentModule === 'endOfDayEmail' || scene === 'report') {
      setHasReachedEndOfDay(true);
    }
  }, [currentModule, scene]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const serializedSnapshot = window.localStorage.getItem(simulationProgressStorageKey);
      if (!serializedSnapshot) return;
      const parsedSnapshot = JSON.parse(serializedSnapshot);
      if (!isValidSnapshotForRestore(parsedSnapshot)) return;

      setSavedSnapshot(parsedSnapshot);
      setLastSavedLabel(
        parsedSnapshot.savedAt
          ? `Last saved: ${new Date(parsedSnapshot.savedAt).toLocaleString()}`
          : 'Last saved: unavailable',
      );
    } catch (error) {
      setSavedSnapshot(null);
    }
  }, []);

  const applyReportTestPayload = (typeKey) => {
    const payload = reportTestPayloads[typeKey];
    if (!payload) return;
    setEvaluationResult(payload);
    setEvaluationErrorMessage('');
    setScene('report');
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(simulationEvaluationStorageKey);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const reportTestEnabled = params.get('reportTest') === '1';
    setIsReportTestMode(reportTestEnabled);
    if (!reportTestEnabled) return;
    const type = params.get('type');
    if (type && reportTestPayloads[type]) {
      applyReportTestPayload(type);
    }
  }, []);

  const resetSimulationState = ({ clearSavedProgress = false, confirmationMessage = '' } = {}) => {
    if (typeof window !== 'undefined' && clearSavedProgress) {
      window.localStorage.removeItem(simulationProgressStorageKey);
    }

    setStarted(true);
    setScene('initial');
    setCurrentModule('arrival');
    setTimelineStatuses(initialModuleStatuses);
    setFolders(initialFolders);
    setCompletedTasks([]);

    setFirstDecision('');
    setInvestigationDecision('');
    setInitialParentResponse('');
    setFinalParentResponse('');
    setParentFinalWritingAssessment(null);
    setHasCompletedFinalStep(false);
    setIsEmailVisible(false);
    setIsVicOpen(false);
    setArrivalPriorityAssignments({});
    setArrivalRankingRecord(null);
    setArrivalCoachingRecord(null);
    setArrivalCompleted(false);
    setIepDecision('');
    setIepFolderChoice('');
    setIepLeadershipRecord(null);
    setAnnouncementsDecision('');
    setAnnouncementsTaskFolders({});
    setAnnouncementsLeadershipRecord(null);
    setVoicemailDecisions({ parentHelp: '', teacherCall: '' });
    setVoicemailResponses({ parentHelp: '', teacherCall: '' });
    setShowParentSupportingInfo(false);
    setShowTeacherSupportingInfo(false);
    setVoicemailWritingAssessments({ parentHelp: null, teacherCall: null });
    setVoicemailTaskClosed(false);
    setVoicemailLeadershipRecord(null);
    setWalkthroughResponses(walkthroughFormFields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {}));
    setWalkthroughLeadershipRecord(null);
    setLunchClimateDecision('');
    setLunchMonitorDirectionNote('');
    setLunchClimateCoachingRecord(null);
    setLunchClimateInsightUnlocked(false);
    setParentEscalationVoicemailPlayed(false);
    setParentEscalationDecision('');
    setParentEscalationResponse('');
    setShowRewardConcernSupportingInfo(false);
    setParentEscalationWritingAssessment(null);
    setParentEscalationLeadershipRecord(null);
    setCafeteriaBoundaryVoicemailPlayed(false);
    setCafeteriaBoundaryDecision('');
    setCafeteriaBoundaryResponse('');
    setCafeteriaBoundaryWritingAssessment(null);
    setCafeteriaBoundaryLeadershipRecord(null);
    setTeacherConflictDecision('');
    setTeacherConflictResponse('');
    setTeacherConflictWritingAssessment(null);
    setTeacherConflictLeadershipRecord(null);
    setDeskStackStatuses(initialDeskStackStatuses);
    setCurrentDeskStackItem(null);
    setStudentThreatDecision('');
    setStudentThreatResponse('');
    setStudentThreatWritingAssessment(null);
    setAcademicDeclineDecision('');
    setAcademicDeclineResponse('');
    setShowAcademicDeclineSupportingInfo(false);
    setAcademicDeclineWritingAssessment(null);
    setPtoTalentShowDecision('');
    setPtoTalentShowResponse('');
    setPtoTalentShowWritingAssessment(null);
    setRecessInjuryDecision('');
    setRecessInjuryResponse('');
    setRecessInjuryWritingAssessment(null);
    setStudentRemovalDecision('');
    setStudentRemovalResponse('');
    setStudentRemovalWritingAssessment(null);
    setModuleTransitionNote('');
    setSnapshotPreviewMessage('');
    setSnapshotValidationMessage('');
    setSaveProgressMessage(confirmationMessage);
    setHasReachedEndOfDay(false);

    if (clearSavedProgress) {
      setSavedSnapshot(null);
      setLastSavedLabel('');
    }
  };

  const isValidSnapshotForRestore = (snapshot) => Boolean(
    snapshot
      && snapshot.version === 'simulation-snapshot-v1'
      && snapshot.timelineStatuses
      && snapshot.currentModule
      && snapshot.records,
  );

  const restoreSimulationProgress = (snapshot) => {
    const safeDecisions = snapshot.decisions || {};
    const safeResponses = snapshot.responses || {};
    const safeRecords = snapshot.records || {};
    const safeUiProgress = snapshot.uiProgress || {};

    setStarted(true);
    const safeCurrentModule = snapshot.currentModule === 'teacherObservation'
      ? 'cafeteriaBoundary'
      : snapshot.currentModule;
    setCurrentModule(safeCurrentModule || 'arrival');
    setScene(snapshot.scene || 'initial');
    const snapshotStatuses = snapshot.timelineStatuses || {};
    const normalizedTimelineStatuses = dayModules.reduce((acc, module) => {
      if (module.id === 'cafeteriaBoundary' && snapshotStatuses.teacherObservation) {
        acc[module.id] = snapshotStatuses.teacherObservation;
      } else {
        acc[module.id] = snapshotStatuses[module.id] || initialModuleStatuses[module.id];
      }
      return acc;
    }, {});
    setTimelineStatuses(normalizedTimelineStatuses);
    setFolders(snapshot.folders || initialFolders);
    setCompletedTasks(Array.isArray(snapshot.completedTasks) ? snapshot.completedTasks : []);

    setFirstDecision(safeDecisions.firstDecision || '');
    setInvestigationDecision(safeDecisions.investigationDecision || '');
    setIepDecision(safeDecisions.iepDecision || '');
    setAnnouncementsDecision(safeDecisions.announcementsDecision || '');
    setVoicemailDecisions(safeDecisions.voicemailDecisions || { parentHelp: '', teacherCall: '' });
    setArrivalPriorityAssignments(safeDecisions.arrivalPriorityAssignments || {});
    setLunchClimateDecision(safeDecisions.lunchClimateDecision || '');
    setParentEscalationDecision(safeDecisions.parentEscalationDecision || '');
    setCafeteriaBoundaryDecision(safeDecisions.cafeteriaBoundaryDecision || '');
    setTeacherConflictDecision(safeDecisions.teacherConflictDecision || '');
    setStudentThreatDecision(safeDecisions.studentThreatDecision || '');
    setAcademicDeclineDecision(safeDecisions.academicDeclineDecision || '');
    setPtoTalentShowDecision(safeDecisions.ptoTalentShowDecision || '');
    setRecessInjuryDecision(safeDecisions.recessInjuryDecision || '');
    setStudentRemovalDecision(safeDecisions.studentRemovalDecision || '');

    setInitialParentResponse(safeResponses.initialParentResponse || '');
    setFinalParentResponse(safeResponses.finalParentResponse || '');
    setVoicemailResponses(safeResponses.voicemailResponses || { parentHelp: '', teacherCall: '' });
    setLunchMonitorDirectionNote(safeResponses.lunchMonitorDirectionNote || '');
    setParentEscalationResponse(safeResponses.parentEscalationResponse || '');
    setCafeteriaBoundaryResponse(safeResponses.cafeteriaBoundaryResponse || '');
    setTeacherConflictResponse(safeResponses.teacherConflictResponse || '');
    setStudentThreatResponse(safeResponses.studentThreatResponse || '');
    setAcademicDeclineResponse(safeResponses.academicDeclineResponse || '');
    setPtoTalentShowResponse(safeResponses.ptoTalentShowResponse || '');
    setRecessInjuryResponse(safeResponses.recessInjuryResponse || '');
    setStudentRemovalResponse(safeResponses.studentRemovalResponse || '');
    setWalkthroughResponses(
      safeResponses.walkthroughResponses
      || walkthroughFormFields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {}),
    );

    setArrivalRankingRecord(safeRecords.arrivalRankingRecord || null);
    setArrivalCoachingRecord(safeRecords.arrivalCoachingRecord || null);
    setIepLeadershipRecord(safeRecords.iepLeadershipRecord || null);
    setAnnouncementsLeadershipRecord(safeRecords.announcementsLeadershipRecord || null);
    setVoicemailLeadershipRecord(safeRecords.voicemailLeadershipRecord || null);
    setWalkthroughLeadershipRecord(safeRecords.walkthroughLeadershipRecord || null);
    setLunchClimateCoachingRecord(safeRecords.lunchClimateCoachingRecord || null);
    setParentEscalationLeadershipRecord(safeRecords.parentEscalationLeadershipRecord || null);
    setParentEscalationWritingAssessment(safeRecords.parentEscalationWritingAssessment || null);
    setCafeteriaBoundaryLeadershipRecord(safeRecords.cafeteriaBoundaryLeadershipRecord || null);
    setCafeteriaBoundaryWritingAssessment(safeRecords.cafeteriaBoundaryWritingAssessment || null);
    setTeacherConflictLeadershipRecord(safeRecords.teacherConflictLeadershipRecord || null);
    setTeacherConflictWritingAssessment(safeRecords.teacherConflictWritingAssessment || null);
    setStudentThreatWritingAssessment(safeRecords.studentThreatWritingAssessment || null);
    setAcademicDeclineWritingAssessment(safeRecords.academicDeclineWritingAssessment || null);
    setPtoTalentShowWritingAssessment(safeRecords.ptoTalentShowWritingAssessment || null);
    setRecessInjuryWritingAssessment(safeRecords.recessInjuryWritingAssessment || null);
    setStudentRemovalWritingAssessment(safeRecords.studentRemovalWritingAssessment || null);
    setParentFinalWritingAssessment(safeRecords.parentFinalWritingAssessment || null);
    setVoicemailWritingAssessments(
      safeRecords.voicemailWritingAssessments || { parentHelp: null, teacherCall: null },
    );
    const restoredDeskStackStatuses = {
      ...initialDeskStackStatuses,
      ...(safeRecords.deskStackStatuses || {}),
    };
    if (safeRecords.deskStackStatuses?.academicDecline && !safeRecords.deskStackStatuses?.academicDeclineEmail) {
      restoredDeskStackStatuses.academicDeclineEmail = safeRecords.deskStackStatuses.academicDecline;
    }
    if (!safeRecords.deskStackStatuses) {
      if (safeUiProgress.hasCompletedFinalStep) {
        restoredDeskStackStatuses.rewardConcern = deskStackItemStatuses.complete;
      } else if (safeDecisions.firstDecision) {
        restoredDeskStackStatuses.rewardConcern = deskStackItemStatuses.inProgress;
      }
    }
    setDeskStackStatuses(restoredDeskStackStatuses);

    setIsEmailVisible(Boolean(safeUiProgress.showFullEmail));
    setIsVicOpen(Boolean(safeUiProgress.showVicGuidance));
    setHasCompletedFinalStep(Boolean(safeUiProgress.hasCompletedFinalStep));
    setArrivalCompleted(Boolean(safeUiProgress.arrivalCompleted));
    setVoicemailTaskClosed(Boolean(safeUiProgress.voicemailTaskClosed));
    setLunchClimateInsightUnlocked(Boolean(safeUiProgress.lunchClimateInsightUnlocked));
    setParentEscalationVoicemailPlayed(Boolean(safeUiProgress.parentEscalationVoicemailPlayed));
    setCafeteriaBoundaryVoicemailPlayed(Boolean(safeUiProgress.cafeteriaBoundaryVoicemailPlayed));
    setCurrentDeskStackItem(safeUiProgress.currentDeskStackItem || null);
    setHasReachedEndOfDay(Boolean(
      safeUiProgress.hasReachedEndOfDay
      || snapshot.currentModule === 'endOfDayEmail'
      || snapshot.scene === 'report',
    ));
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const addFolderItems = (itemsByBucket) => {
    setFolders((prev) => {
      const next = {
        red: [...prev.red],
        orange: [...prev.orange],
        green: [...prev.green],
      };

      Object.entries(itemsByBucket).forEach(([bucket, items]) => {
        items.forEach((item) => {
          if (!next[bucket].includes(item)) {
            next[bucket].push(item);
          }
        });
      });

      return next;
    });
  };

  const completeFolderItems = (items) => {
    if (!items.length) return;
    setFolders((prev) => {
      const next = {
        red: prev.red.filter((item) => !items.includes(item)),
        orange: prev.orange.filter((item) => !items.includes(item)),
        green: prev.green.filter((item) => !items.includes(item)),
      };
      return next;
    });
    setCompletedTasks((prev) => {
      const next = [...prev];
      items.forEach((item) => {
        if (!next.includes(item)) {
          next.push(item);
        }
      });
      return next;
    });
  };

  const handleDecision = (decisionLabel) => {
    const mapping = decisionToFolderItem[decisionLabel];
    if (!mapping) return;

    setFirstDecision(decisionLabel);
    addFolderItems({ [mapping.bucket]: [mapping.item] });
  };

  const handleArrivalPriorityAssignment = (item, rank) => {
    if (arrivalCompleted) return;
    setArrivalPriorityAssignments((prev) => {
      const next = { ...prev };
      Object.entries(next).forEach(([assignedItem, assignedRank]) => {
        if (assignedItem !== item && assignedRank === rank) {
          delete next[assignedItem];
        }
      });
      next[item] = rank;
      return next;
    });
  };

  const handleContinueDay = () => {
    if (arrivalSortItems.some((item) => !arrivalPriorityAssignments[item])) return;

    const rankedSelections = arrivalSortItems
      .map((item) => ({ item, rank: arrivalPriorityAssignments[item] }))
      .sort((a, b) => arrivalPriorityRanks.indexOf(a.rank) - arrivalPriorityRanks.indexOf(b.rank));

    setArrivalRankingRecord(rankedSelections);
    setArrivalCoachingRecord({
      title: 'Suggested Leadership Sequence',
      recommendedSequence: suggestedArrivalSequence,
      leadershipThinking: suggestedArrivalCoachingNote,
    });
    setArrivalCompleted(true);
    setTimelineStatuses((prev) => {
      const next = { ...prev, arrival: moduleStatuses.completed };
      const nextEnabledModule = dayModules.find((module) => (
        module.enabled && module.id !== 'arrival' && next[module.id] !== moduleStatuses.completed
      ));

      if (nextEnabledModule) {
        next[nextEnabledModule.id] = moduleStatuses.active;
        setCurrentModule(nextEnabledModule.id);
        setModuleTransitionNote('');
      } else {
        setCurrentModule('arrival');
        setModuleTransitionNote('Next module coming soon.');
      }
      return next;
    });
    scrollToTop();
  };

  const handleContinueToInvestigation = () => {
    setScene('investigation');
    addFolderItems({ red: [investigationFolderItem] });
    scrollToTop();
  };

  const handleOpenDeskStackItem = (itemId) => {
    if (
      itemId !== 'rewardConcern'
      && itemId !== 'studentThreatEmail'
      && itemId !== 'academicDeclineEmail'
      && itemId !== 'ptoTalentShowEmail'
      && itemId !== 'recessInjuryEmail'
      && itemId !== 'studentRemovalVoicemail'
    ) return;
    setCurrentDeskStackItem(itemId);
    setDeskStackStatuses((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === deskStackItemStatuses.complete
        ? deskStackItemStatuses.complete
        : deskStackItemStatuses.inProgress,
    }));
    scrollToTop();
  };

  const handleReturnToDeskStack = () => {
    setCurrentDeskStackItem(null);
    setScene('initial');
    setIsEmailVisible(false);
    setShowRewardConcernSupportingInfo(false);
    scrollToTop();
  };

  const handleCloseDeskStackDay = () => {
    if (!canCloseDeskStackDay) {
      setModuleTransitionNote(
        `You still have ${unresolvedRequiredItemCount} unresolved items before the end-of-day review.`,
      );
      return;
    }
    setTimelineStatuses((prev) => ({
      ...prev,
      endOfDayEmail: moduleStatuses.completed,
    }));
    setCurrentDeskStackItem('rewardConcern');
    setScene('report');
    setModuleTransitionNote('Desk stack closed. Leadership record saved.');
    scrollToTop();
  };

  const handleStudentThreatContinue = () => {
    if (!studentThreatDecision || !studentThreatResponse.trim()) return;
    if (studentThreatWritingAssessment) {
      handleStudentThreatReturnToDeskStack();
      return;
    }
    const assessment = analyzeLeadershipWriting(studentThreatResponse, 'studentThreatEmail');
    setStudentThreatWritingAssessment(assessment);
    handleStudentThreatReturnToDeskStack();
  };

  const handleStudentThreatReturnToDeskStack = () => {
    setDeskStackStatuses((prev) => ({ ...prev, studentThreatEmail: deskStackItemStatuses.complete }));
    setCurrentDeskStackItem(null);
    scrollToTop();
  };

  const handleAcademicDeclineContinue = () => {
    if (!academicDeclineDecision || !academicDeclineResponse.trim()) return;
    if (academicDeclineWritingAssessment) {
      handleAcademicDeclineReturnToDeskStack();
      return;
    }
    const assessment = analyzeLeadershipWriting(academicDeclineResponse, 'academicDeclineEmail');
    setAcademicDeclineWritingAssessment(assessment);
    handleAcademicDeclineReturnToDeskStack();
  };

  const handleAcademicDeclineReturnToDeskStack = () => {
    setDeskStackStatuses((prev) => ({ ...prev, academicDeclineEmail: deskStackItemStatuses.complete }));
    setShowAcademicDeclineSupportingInfo(false);
    setCurrentDeskStackItem(null);
    scrollToTop();
  };

  const handlePtoTalentShowContinue = () => {
    if (!ptoTalentShowDecision || !ptoTalentShowResponse.trim()) return;
    if (ptoTalentShowWritingAssessment) {
      handlePtoTalentShowReturnToDeskStack();
      return;
    }
    const assessment = analyzeLeadershipWriting(ptoTalentShowResponse, 'ptoTalentShowEmail');
    setPtoTalentShowWritingAssessment(assessment);
    handlePtoTalentShowReturnToDeskStack();
  };

  const handlePtoTalentShowReturnToDeskStack = () => {
    setDeskStackStatuses((prev) => ({ ...prev, ptoTalentShowEmail: deskStackItemStatuses.complete }));
    setCurrentDeskStackItem(null);
    scrollToTop();
  };

  const handleRecessInjuryContinue = () => {
    if (!recessInjuryDecision || !recessInjuryResponse.trim()) return;
    if (recessInjuryWritingAssessment) {
      handleRecessInjuryReturnToDeskStack();
      return;
    }
    const assessment = analyzeLeadershipWriting(recessInjuryResponse, 'recessInjuryEmail');
    setRecessInjuryWritingAssessment(assessment);
    handleRecessInjuryReturnToDeskStack();
  };

  const handleRecessInjuryReturnToDeskStack = () => {
    setDeskStackStatuses((prev) => ({ ...prev, recessInjuryEmail: deskStackItemStatuses.complete }));
    setCurrentDeskStackItem(null);
    scrollToTop();
  };

  const handleStudentRemovalContinue = () => {
    if (!studentRemovalDecision || !studentRemovalResponse.trim()) return;
    if (studentRemovalWritingAssessment) {
      handleStudentRemovalReturnToDeskStack();
      return;
    }
    const assessment = analyzeLeadershipWriting(studentRemovalResponse, 'studentRemovalVoicemail');
    setStudentRemovalWritingAssessment(assessment);
    handleStudentRemovalReturnToDeskStack();
  };

  const handleStudentRemovalReturnToDeskStack = () => {
    setDeskStackStatuses((prev) => ({ ...prev, studentRemovalVoicemail: deskStackItemStatuses.complete }));
    setCurrentDeskStackItem(null);
    scrollToTop();
  };

  const handleIepDecisionSelect = (decisionLabel) => {
    setIepDecision(decisionLabel);
  };

  const handleIepFolderSelection = (folderId) => {
    setIepFolderChoice(folderId);
    addFolderItems({ [folderId]: [iepTaskItem] });
  };

  const handleIepContinueDay = () => {
    if (!iepDecision || !iepFolderChoice) return;

    const coaching = iepDecisionCoaching[iepDecision];
    setIepLeadershipRecord({
      module: '8:15 AM — IEP Meeting',
      decision: iepDecision,
      folder: iepFolderChoice,
      coachingNote: coaching?.message || '',
      insight:
        'IEP-related requests may seem simple, but they sit inside legal expectations and parent trust. Missing small steps here can create larger problems later.',
      suggestedFolder: 'Red — before leaving today.',
    });
    setTimelineStatuses((prev) => {
      const next = { ...prev, iepMeeting: moduleStatuses.completed };
      const nextEnabledModule = dayModules.find((module) => (
        module.enabled && module.id !== 'iepMeeting' && next[module.id] !== moduleStatuses.completed
      ));

      if (nextEnabledModule) {
        next[nextEnabledModule.id] = moduleStatuses.active;
        setCurrentModule(nextEnabledModule.id);
        setModuleTransitionNote('');
      } else {
        setModuleTransitionNote('Next module coming soon.');
      }
      return next;
    });
    scrollToTop();
  };

  const handleInvestigationContinue = () => {
    if (!investigationDecision || !finalParentResponse.trim() || hasCompletedFinalStep) return;
    const finalAssessment = analyzeLeadershipWriting(finalParentResponse, 'parentFinalResponse');
    setParentFinalWritingAssessment(finalAssessment);
    completeFolderItems([
      'Respond to parent with care and clear timeline',
      'Speak with teacher immediately',
      'Document parent concern',
      'Follow up with parent within 48 hours',
    ]);
    setHasCompletedFinalStep(true);
    setDeskStackStatuses((prev) => ({ ...prev, rewardConcern: deskStackItemStatuses.complete }));
    setScene('initial');
    setCurrentDeskStackItem(null);
    setModuleTransitionNote(
      `Parent Concern complete. You still have ${Math.max(unresolvedRequiredItemCount - 1, 0)} unresolved items before the end-of-day review.`,
    );
    scrollToTop();
  };

  const handleAnnouncementsDecisionSelect = (decisionLabel) => {
    setAnnouncementsDecision(decisionLabel);
  };

  const handleAnnouncementsTaskFolderSelection = (taskId, folderId) => {
    const task = announcementsTasks.find((card) => card.id === taskId);
    if (!task) return;

    setAnnouncementsTaskFolders((prev) => {
      const previousFolder = prev[taskId];
      const next = { ...prev, [taskId]: folderId };

      if (previousFolder && previousFolder !== folderId) {
        setFolders((folderState) => ({
          red: folderState.red.filter((item) => item !== task.label),
          orange: folderState.orange.filter((item) => item !== task.label),
          green: folderState.green.filter((item) => item !== task.label),
        }));
      }

      return next;
    });
    addFolderItems({ [folderId]: [task.label] });
  };

  const handleAnnouncementsContinueDay = () => {
    const hasAllTaskFolders = announcementsTasks.every((task) => Boolean(announcementsTaskFolders[task.id]));
    if (!announcementsDecision || !hasAllTaskFolders) return;

    setAnnouncementsLeadershipRecord({
      module: '9:00 AM — Announcements',
      decision: announcementsDecision,
      taskFolders: announcementsTaskFolders,
      coachingNote: announcementsDecisionCoaching[announcementsDecision]?.message || '',
      insight:
        'Visibility creates access. The more present you are in the building, the more people will bring needs to you in motion. Strong leaders use a capture system — notebook, phone, assistant, or dashboard — so small requests do not disappear on the walk back to the office.',
      suggestedFolder: 'Red for both tasks.',
    });

    setTimelineStatuses((prev) => {
      const next = { ...prev, announcements: moduleStatuses.completed };
      const nextEnabledModule = dayModules.find((module) => (
        module.enabled && module.id !== 'announcements' && next[module.id] !== moduleStatuses.completed
      ));

      if (nextEnabledModule) {
        next[nextEnabledModule.id] = moduleStatuses.active;
        setCurrentModule(nextEnabledModule.id);
        setModuleTransitionNote('');
      } else {
        setModuleTransitionNote('Next module coming soon.');
      }
      return next;
    });
    scrollToTop();
  };

  const handleVoicemailDecisionSelect = (threadId, decision) => {
    setVoicemailDecisions((prev) => ({ ...prev, [threadId]: decision }));
  };

  const handleVoicemailResponseChange = (threadId, value) => {
    setVoicemailResponses((prev) => ({ ...prev, [threadId]: value }));
  };

  const handleVoicemailContinue = () => {
    const hasAllResponses = Object.values(voicemailResponses).every((response) => response.trim());
    if (!hasAllResponses) return;
    const nextAssessments = {
      parentHelp: analyzeLeadershipWriting(voicemailResponses.parentHelp, 'voicemailParent'),
      teacherCall: analyzeLeadershipWriting(voicemailResponses.teacherCall, 'voicemailTeacher'),
    };
    setVoicemailWritingAssessments(nextAssessments);

    if (!voicemailTaskClosed) {
      completeFolderItems([voicemailLoopTaskItem]);
      setVoicemailTaskClosed(true);
    }

    setVoicemailLeadershipRecord({
      module: '9:30 AM — Voicemail & Mailbox',
      triageDecisions: voicemailDecisions,
      responses: voicemailResponses,
      writingAssessments: nextAssessments,
      coachingNote:
        'Strong leaders do not just listen to messages. They close loops. The quality of the response depends on whether the caller knows the message was received, what will happen next, and when they can expect follow-up.',
    });
    setTimelineStatuses((prev) => {
      const next = { ...prev, voicemail: moduleStatuses.completed };
      const nextEnabledModule = dayModules.find((module) => (
        module.enabled && module.id !== 'voicemail' && next[module.id] !== moduleStatuses.completed
      ));

      if (nextEnabledModule) {
        next[nextEnabledModule.id] = moduleStatuses.active;
        setCurrentModule(nextEnabledModule.id);
        setModuleTransitionNote('');
      } else {
        setModuleTransitionNote('Next module coming soon.');
      }
      return next;
    });
    scrollToTop();
  };

  const handleWalkthroughResponseChange = (fieldId, value) => {
    setWalkthroughResponses((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleWalkthroughContinue = () => {
    const hasAllResponses = walkthroughFormFields.every((field) => walkthroughResponses[field.id].trim());
    if (!hasAllResponses) return;

    setWalkthroughLeadershipRecord({
      module: '11:00 AM — Classroom Walkthrough',
      responses: walkthroughResponses,
      reflectionSaved: true,
    });
    setTimelineStatuses((prev) => {
      const next = { ...prev, classroomWalkthrough: moduleStatuses.completed };
      const nextEnabledModule = dayModules.find((module) => (
        module.enabled && module.id !== 'classroomWalkthrough' && next[module.id] !== moduleStatuses.completed
      ));

      if (nextEnabledModule) {
        next[nextEnabledModule.id] = moduleStatuses.active;
        setCurrentModule(nextEnabledModule.id);
        setModuleTransitionNote('');
      } else {
        setModuleTransitionNote('Next module coming soon.');
      }
      return next;
    });
    scrollToTop();
  };

  const handleLunchClimateDecisionSelect = (decisionLabel) => {
    setLunchClimateDecision(decisionLabel);
  };

  const handleLunchClimateDirectionContinue = () => {
    if (!lunchClimateDecision || !lunchMonitorDirectionNote.trim()) return;
    completeFolderItems([lunchClimateTaskItem]);
    setLunchClimateCoachingRecord({
      module: '11:30 AM — Lunch & Cafeteria Climate',
      decision: lunchClimateDecision,
      monitorDirectionNote: lunchMonitorDirectionNote.trim(),
      coachingNote: lunchClimateDecisionCoaching[lunchClimateDecision]?.message || '',
      leadershipInsight: lunchClimateInsightMessage,
    });
    setLunchClimateInsightUnlocked(true);
    scrollToTop();
  };

  const handleLunchClimateContinueDay = () => {
    if (!lunchClimateDecision || !lunchMonitorDirectionNote.trim() || !lunchClimateInsightUnlocked) return;
    setTimelineStatuses((prev) => {
      const next = { ...prev, lunchClimate: moduleStatuses.completed };
      const nextEnabledModule = dayModules.find((module) => (
        module.enabled && module.id !== 'lunchClimate' && next[module.id] !== moduleStatuses.completed
      ));

      if (nextEnabledModule) {
        next[nextEnabledModule.id] = moduleStatuses.active;
        setCurrentModule(nextEnabledModule.id);
        setModuleTransitionNote('');
      } else {
        setModuleTransitionNote('Next module coming soon.');
      }
      return next;
    });
    scrollToTop();
  };

  const handleParentEscalationContinue = () => {
    if (!parentEscalationDecision || !parentEscalationResponse.trim()) return;
    if (parentEscalationWritingAssessment) {
      handleParentEscalationContinueDay();
      return;
    }
    const nextAssessment = analyzeLeadershipWriting(parentEscalationResponse, 'parentEscalation');
    setParentEscalationWritingAssessment(nextAssessment);
    completeFolderItems([parentEscalationTaskItem]);
    setParentEscalationLeadershipRecord({
      module: '1:00 PM — Parent Escalation',
      voicemailPlayed: parentEscalationVoicemailPlayed,
      decision: parentEscalationDecision,
      response: parentEscalationResponse.trim(),
      writingAssessment: nextAssessment,
      coachingNote: parentEscalationDecisionCoaching[parentEscalationDecision]?.message || '',
    });
    setTimelineStatuses((prev) => {
      const next = { ...prev, parentEscalation: moduleStatuses.completed };
      const nextEnabledModule = dayModules.find((module) => (
        module.enabled && module.id !== 'parentEscalation' && next[module.id] !== moduleStatuses.completed
      ));

      if (nextEnabledModule) {
        next[nextEnabledModule.id] = moduleStatuses.active;
        setCurrentModule(nextEnabledModule.id);
        setModuleTransitionNote('');
      } else {
        setModuleTransitionNote('Next module coming soon.');
      }
      return next;
    });
    scrollToTop();
  };

  const handleParentEscalationDecisionSelect = (decisionLabel) => {
    setParentEscalationDecision(decisionLabel);
  };

  const handleParentEscalationContinueDay = () => {
    if (!parentEscalationWritingAssessment) return;
    setTimelineStatuses((prev) => {
      const next = { ...prev, parentEscalation: moduleStatuses.completed };
      const nextEnabledModule = dayModules.find((module) => (
        module.enabled && module.id !== 'parentEscalation' && next[module.id] !== moduleStatuses.completed
      ));

      if (nextEnabledModule) {
        next[nextEnabledModule.id] = moduleStatuses.active;
        setCurrentModule(nextEnabledModule.id);
        setModuleTransitionNote('');
      } else {
        setModuleTransitionNote('Next module coming soon.');
      }
      return next;
    });
    scrollToTop();
  };

  const handleCafeteriaBoundaryContinue = () => {
    if (!cafeteriaBoundaryDecision || !cafeteriaBoundaryResponse.trim()) return;
    if (cafeteriaBoundaryWritingAssessment) {
      handleCafeteriaBoundaryContinueDay();
      return;
    }
    const nextAssessment = analyzeLeadershipWriting(cafeteriaBoundaryResponse, 'staffBoundary');
    setCafeteriaBoundaryWritingAssessment(nextAssessment);
    completeFolderItems([cafeteriaBoundaryTaskItem]);
    setCafeteriaBoundaryLeadershipRecord({
      module: '1:30 PM — Cafeteria Boundary Incident',
      voicemailPlayed: cafeteriaBoundaryVoicemailPlayed,
      decision: cafeteriaBoundaryDecision,
      response: cafeteriaBoundaryResponse.trim(),
      writingAssessment: nextAssessment,
      coachingNote: cafeteriaBoundaryDecisionCoaching[cafeteriaBoundaryDecision]?.message || '',
    });
    setTimelineStatuses((prev) => {
      const next = { ...prev, cafeteriaBoundary: moduleStatuses.completed };
      const nextEnabledModule = dayModules.find((module) => (
        module.enabled && module.id !== 'cafeteriaBoundary' && next[module.id] !== moduleStatuses.completed
      ));

      if (nextEnabledModule) {
        next[nextEnabledModule.id] = moduleStatuses.active;
        setCurrentModule(nextEnabledModule.id);
        setModuleTransitionNote('');
      } else {
        setModuleTransitionNote('Next module coming soon.');
      }
      return next;
    });
    scrollToTop();
  };

  const handleCafeteriaBoundaryContinueDay = () => {
    if (!cafeteriaBoundaryWritingAssessment) return;
    setTimelineStatuses((prev) => {
      const next = { ...prev, cafeteriaBoundary: moduleStatuses.completed };
      const nextEnabledModule = dayModules.find((module) => (
        module.enabled && module.id !== 'cafeteriaBoundary' && next[module.id] !== moduleStatuses.completed
      ));

      if (nextEnabledModule) {
        next[nextEnabledModule.id] = moduleStatuses.active;
        setCurrentModule(nextEnabledModule.id);
        setModuleTransitionNote('');
      } else {
        setModuleTransitionNote('Next module coming soon.');
      }
      return next;
    });
    scrollToTop();
  };

  const handleTeacherConflictContinue = () => {
    if (!teacherConflictDecision || !teacherConflictResponse.trim()) return;
    if (teacherConflictWritingAssessment) {
      handleTeacherConflictContinueDay();
      return;
    }
    const nextAssessment = analyzeLeadershipWriting(teacherConflictResponse, 'teacherConflict');
    setTeacherConflictWritingAssessment(nextAssessment);
    completeFolderItems([teacherConflictTaskItem]);
    setTeacherConflictLeadershipRecord({
      module: '3:15 PM — Teacher Conflict',
      decision: teacherConflictDecision,
      openingStatement: teacherConflictResponse.trim(),
      writingAssessment: nextAssessment,
      coachingNote: teacherConflictDecisionCoaching[teacherConflictDecision]?.message || '',
    });
    setTimelineStatuses((prev) => {
      const next = { ...prev, teacherConflict: moduleStatuses.completed };
      const nextEnabledModule = dayModules.find((module) => (
        module.enabled && module.id !== 'teacherConflict' && next[module.id] !== moduleStatuses.completed
      ));

      if (nextEnabledModule) {
        next[nextEnabledModule.id] = moduleStatuses.active;
        setCurrentModule(nextEnabledModule.id);
        setModuleTransitionNote('');
      } else {
        setModuleTransitionNote('Next module coming soon.');
      }
      return next;
    });
    scrollToTop();
  };

  const handleTeacherConflictContinueDay = () => {
    if (!teacherConflictWritingAssessment) return;
    setTimelineStatuses((prev) => {
      const next = { ...prev, teacherConflict: moduleStatuses.completed };
      const nextEnabledModule = dayModules.find((module) => (
        module.enabled && module.id !== 'teacherConflict' && next[module.id] !== moduleStatuses.completed
      ));

      if (nextEnabledModule) {
        next[nextEnabledModule.id] = moduleStatuses.active;
        setCurrentModule(nextEnabledModule.id);
        setModuleTransitionNote('');
      } else {
        setModuleTransitionNote('Next module coming soon.');
      }
      return next;
    });
    scrollToTop();
  };

  const showInitialParentResponse = firstDecision === 'Send an email response';
  const showFinalParentResponse = Boolean(investigationDecision) && !hasCompletedFinalStep;
  const hasFinishedArrivalRanking = arrivalSortItems.every((item) => Boolean(arrivalPriorityAssignments[item]));
  const hasParentEscalationResponse = Boolean(parentEscalationResponse.trim());
  const hasParentEscalationDecision = Boolean(parentEscalationDecision);
  const hasCafeteriaBoundaryResponse = Boolean(cafeteriaBoundaryResponse.trim());
  const hasCafeteriaBoundaryDecision = Boolean(cafeteriaBoundaryDecision);
  const hasTeacherConflictResponse = Boolean(teacherConflictResponse.trim());
  const hasTeacherConflictDecision = Boolean(teacherConflictDecision);
  const hasStudentThreatDecision = Boolean(studentThreatDecision);
  const hasStudentThreatResponse = Boolean(studentThreatResponse.trim());
  const hasAcademicDeclineDecision = Boolean(academicDeclineDecision);
  const hasAcademicDeclineResponse = Boolean(academicDeclineResponse.trim());
  const hasPtoTalentShowDecision = Boolean(ptoTalentShowDecision);
  const hasPtoTalentShowResponse = Boolean(ptoTalentShowResponse.trim());
  const hasRecessInjuryDecision = Boolean(recessInjuryDecision);
  const hasRecessInjuryResponse = Boolean(recessInjuryResponse.trim());
  const hasStudentRemovalDecision = Boolean(studentRemovalDecision);
  const hasStudentRemovalResponse = Boolean(studentRemovalResponse.trim());
  const isDecisionMade = currentModule === 'arrival'
    ? hasFinishedArrivalRanking
    : currentModule === 'parentEscalation'
      ? hasParentEscalationDecision
      : hasSelectedDecision;
  const hasCompletedWalkthroughForm = walkthroughFormFields.every(
    (field) => walkthroughResponses[field.id].trim(),
  );
  const hasSelectedBothVoicemailDecisions = Object.values(voicemailDecisions).every(Boolean);
  const hasCompletedBothVoicemailResponses = Object.values(voicemailResponses).every((response) => response.trim());
  const liveParentFinalWritingAssessment = useMemo(
    () => analyzeLeadershipWriting(finalParentResponse, 'parentFinalResponse'),
    [finalParentResponse],
  );
  const liveParentEscalationWritingAssessment = useMemo(
    () => analyzeLeadershipWriting(parentEscalationResponse, 'parentEscalation'),
    [parentEscalationResponse],
  );
  const liveCafeteriaBoundaryWritingAssessment = useMemo(
    () => analyzeLeadershipWriting(cafeteriaBoundaryResponse, 'staffBoundary'),
    [cafeteriaBoundaryResponse],
  );
  const liveTeacherConflictWritingAssessment = useMemo(
    () => analyzeLeadershipWriting(teacherConflictResponse, 'teacherConflict'),
    [teacherConflictResponse],
  );
  const liveStudentThreatWritingAssessment = useMemo(
    () => analyzeLeadershipWriting(studentThreatResponse, 'studentThreatEmail'),
    [studentThreatResponse],
  );
  const liveAcademicDeclineWritingAssessment = useMemo(
    () => analyzeLeadershipWriting(academicDeclineResponse, 'academicDeclineEmail'),
    [academicDeclineResponse],
  );
  const liveRecessInjuryWritingAssessment = useMemo(
    () => analyzeLeadershipWriting(recessInjuryResponse, 'recessInjuryEmail'),
    [recessInjuryResponse],
  );
  const liveStudentRemovalWritingAssessment = useMemo(
    () => analyzeLeadershipWriting(studentRemovalResponse, 'studentRemovalVoicemail'),
    [studentRemovalResponse],
  );
  const leadershipStyleProfile = useMemo(
    () => buildLeadershipStyleProfile({
      writtenResponses: [
        initialParentResponse,
        finalParentResponse,
        voicemailResponses.parentHelp,
        voicemailResponses.teacherCall,
        ...Object.values(walkthroughResponses),
        lunchMonitorDirectionNote,
        parentEscalationResponse,
        cafeteriaBoundaryResponse,
        teacherConflictResponse,
        studentThreatResponse,
        academicDeclineResponse,
        ptoTalentShowResponse,
        recessInjuryResponse,
        studentRemovalResponse,
      ],
      decisions: [
        firstDecision,
        investigationDecision,
        iepDecision,
        announcementsDecision,
        voicemailDecisions.parentHelp,
        voicemailDecisions.teacherCall,
        lunchClimateDecision,
        parentEscalationDecision,
        cafeteriaBoundaryDecision,
        teacherConflictDecision,
        studentThreatDecision,
        academicDeclineDecision,
        ptoTalentShowDecision,
        recessInjuryDecision,
        studentRemovalDecision,
      ],
    }),
    [
      initialParentResponse,
      finalParentResponse,
      voicemailResponses,
      walkthroughResponses,
      lunchMonitorDirectionNote,
      parentEscalationResponse,
      cafeteriaBoundaryResponse,
      teacherConflictResponse,
      studentThreatResponse,
      academicDeclineResponse,
      ptoTalentShowResponse,
      recessInjuryResponse,
      studentRemovalResponse,
      firstDecision,
      investigationDecision,
      iepDecision,
      announcementsDecision,
      voicemailDecisions,
      lunchClimateDecision,
      parentEscalationDecision,
      cafeteriaBoundaryDecision,
      teacherConflictDecision,
      studentThreatDecision,
      academicDeclineDecision,
      ptoTalentShowDecision,
      recessInjuryDecision,
      studentRemovalDecision,
    ],
  );
  const fullSimulationFirstMoveDecisions = useMemo(
    () => ([
      { module: 'Arrival Priorities', decision: arrivalRankingRecord ? 'Priorities ranked' : '' },
      { module: 'Parent Concern — Reward Practice', decision: firstDecision },
      { module: 'Parent Concern Investigation', decision: investigationDecision },
      { module: 'IEP Meeting', decision: iepDecision },
      { module: 'Announcements', decision: announcementsDecision },
      { module: 'Voicemail (Parent Help)', decision: voicemailDecisions.parentHelp },
      { module: 'Voicemail (Teacher Call)', decision: voicemailDecisions.teacherCall },
      { module: 'Lunch & Cafeteria Climate', decision: lunchClimateDecision },
      { module: 'Parent Escalation', decision: parentEscalationDecision },
      { module: 'Cafeteria Boundary Incident', decision: cafeteriaBoundaryDecision },
      { module: 'Teacher Conflict', decision: teacherConflictDecision },
      { module: 'Student Threat Report', decision: studentThreatDecision },
      { module: 'Academic Decline Concern', decision: academicDeclineDecision },
      { module: 'PTO Talent Show Equity', decision: ptoTalentShowDecision },
      { module: 'Recess Injury Parent Concern', decision: recessInjuryDecision },
      { module: 'Student Removal Request', decision: studentRemovalDecision },
    ]).filter((entry) => Boolean(entry.decision)),
    [
      arrivalRankingRecord,
      firstDecision,
      investigationDecision,
      iepDecision,
      announcementsDecision,
      voicemailDecisions,
      lunchClimateDecision,
      parentEscalationDecision,
      cafeteriaBoundaryDecision,
      teacherConflictDecision,
      studentThreatDecision,
      academicDeclineDecision,
      ptoTalentShowDecision,
      recessInjuryDecision,
      studentRemovalDecision,
    ],
  );
  const fullSimulationWrittenResponses = useMemo(
    () => ([
      { module: 'Parent Concern — Initial Response', label: 'Initial parent response', response: initialParentResponse },
      { module: 'Parent Concern — Final Response', label: 'Final parent response', response: finalParentResponse },
      { module: 'Voicemail & Mailbox', label: 'Parent help response', response: voicemailResponses.parentHelp },
      { module: 'Voicemail & Mailbox', label: 'Teacher call response', response: voicemailResponses.teacherCall },
      { module: 'Classroom Walkthrough', label: 'Walkthrough reflection', response: Object.values(walkthroughResponses).join(' ').trim() },
      { module: 'Lunch & Cafeteria Climate', label: 'Monitor direction note', response: lunchMonitorDirectionNote },
      { module: 'Parent Escalation', label: 'Parent escalation response', response: parentEscalationResponse },
      { module: 'Cafeteria Boundary Incident', label: 'Staff boundary response', response: cafeteriaBoundaryResponse },
      { module: 'Teacher Conflict', label: 'Teacher conflict opening statement', response: teacherConflictResponse },
      { module: 'Student Threat Report', label: 'Student threat response', response: studentThreatResponse },
      { module: 'Academic Decline Concern', label: 'Academic concern response', response: academicDeclineResponse },
      { module: 'PTO Talent Show Equity', label: 'PTO response', response: ptoTalentShowResponse },
      { module: 'Recess Injury Parent Concern', label: 'Recess injury response', response: recessInjuryResponse },
      { module: 'Student Removal Request', label: 'Student removal response', response: studentRemovalResponse },
    ]).filter((entry) => Boolean(entry.response.trim())),
    [
      initialParentResponse,
      finalParentResponse,
      voicemailResponses,
      walkthroughResponses,
      lunchMonitorDirectionNote,
      parentEscalationResponse,
      cafeteriaBoundaryResponse,
      teacherConflictResponse,
      studentThreatResponse,
      academicDeclineResponse,
      ptoTalentShowResponse,
      recessInjuryResponse,
      studentRemovalResponse,
    ],
  );
  const responseQualityFlags = useMemo(() => fullSimulationWrittenResponses.map((entry) => {
    const response = `${entry.response || ''}`.trim();
    const wordCount = response ? response.split(/\s+/).filter(Boolean).length : 0;
    const isBlank = !response;
    const isPlaceholder = /^(idk|ok|done|yada yada|n\/a|none|call parent)$/i.test(response);
    const repeatedNonsense = /(asdf|blah blah|lorem ipsum|test test)/i.test(response);
    const isExtremelyShort = wordCount > 0 && wordCount <= 5;
    return { module: entry.module, label: entry.label, wordCount, isBlank, isPlaceholder, repeatedNonsense, isExtremelyShort };
  }), [fullSimulationWrittenResponses]);
  const fullSimulationWritingAssessments = useMemo(
    () => ([
      { module: 'Parent Concern — Final Response', assessment: parentFinalWritingAssessment || liveParentFinalWritingAssessment },
      { module: 'Parent Escalation', assessment: parentEscalationWritingAssessment || liveParentEscalationWritingAssessment },
      { module: 'Cafeteria Boundary Incident', assessment: cafeteriaBoundaryWritingAssessment || liveCafeteriaBoundaryWritingAssessment },
      { module: 'Teacher Conflict', assessment: teacherConflictWritingAssessment || liveTeacherConflictWritingAssessment },
      { module: 'Student Threat Report', assessment: studentThreatWritingAssessment || liveStudentThreatWritingAssessment },
      { module: 'Academic Decline Concern', assessment: academicDeclineWritingAssessment || liveAcademicDeclineWritingAssessment },
      { module: 'PTO Talent Show Equity', assessment: ptoTalentShowWritingAssessment || analyzeLeadershipWriting(ptoTalentShowResponse, 'ptoTalentShowEmail') },
      { module: 'Recess Injury Parent Concern', assessment: recessInjuryWritingAssessment || liveRecessInjuryWritingAssessment },
      { module: 'Student Removal Request', assessment: studentRemovalWritingAssessment || liveStudentRemovalWritingAssessment },
      { module: 'Voicemail (Parent Help)', assessment: voicemailWritingAssessments.parentHelp || analyzeLeadershipWriting(voicemailResponses.parentHelp, 'voicemailParent') },
      { module: 'Voicemail (Teacher Call)', assessment: voicemailWritingAssessments.teacherCall || analyzeLeadershipWriting(voicemailResponses.teacherCall, 'voicemailTeacher') },
    ]).filter((entry) => Boolean(entry.assessment?.summary)),
    [
      parentFinalWritingAssessment,
      liveParentFinalWritingAssessment,
      parentEscalationWritingAssessment,
      liveParentEscalationWritingAssessment,
      cafeteriaBoundaryWritingAssessment,
      liveCafeteriaBoundaryWritingAssessment,
      teacherConflictWritingAssessment,
      liveTeacherConflictWritingAssessment,
      studentThreatWritingAssessment,
      liveStudentThreatWritingAssessment,
      academicDeclineWritingAssessment,
      liveAcademicDeclineWritingAssessment,
      ptoTalentShowWritingAssessment,
      ptoTalentShowResponse,
      recessInjuryWritingAssessment,
      liveRecessInjuryWritingAssessment,
      studentRemovalWritingAssessment,
      liveStudentRemovalWritingAssessment,
      voicemailWritingAssessments,
      voicemailResponses,
    ],
  );
  const decisionPatternSummary = useMemo(() => {
    const decisionText = fullSimulationFirstMoveDecisions.map((entry) => entry.decision.toLowerCase());
    const patternCounts = {
      investigateFirst: decisionText.filter((value) => /(investigate|review|gather|assess|learn more|clarify)/.test(value)).length,
      acknowledgeFirst: decisionText.filter((value) => /(acknowledge|respond|contact|call|speak|follow up)/.test(value)).length,
      actImmediately: decisionText.filter((value) => /(immediate|right away|at once|urgent|secure|intervene)/.test(value)).length,
      delegateOrCollaborate: decisionText.filter((value) => /(team|delegate|support|coach|with teacher|assistant|partner)/.test(value)).length,
    };

    return [
      `Investigate-first choices appeared in ${patternCounts.investigateFirst} decision points.`,
      `Acknowledge/contact-first moves appeared in ${patternCounts.acknowledgeFirst} decision points.`,
      `Immediate action language appeared in ${patternCounts.actImmediately} decision points.`,
      `Delegation/collaboration language appeared in ${patternCounts.delegateOrCollaborate} decision points.`,
    ];
  }, [fullSimulationFirstMoveDecisions]);
  const writingCategoryTrends = useMemo(() => {
    const statusCounts = {};
    fullSimulationWritingAssessments.forEach(({ assessment }) => {
      (assessment?.categories || []).forEach((category) => {
        if (!statusCounts[category.name]) {
          statusCounts[category.name] = { strong: 0, needsAttention: 0 };
        }
        if (category.status === 'Strong') {
          statusCounts[category.name].strong += 1;
        } else if (category.status === 'Needs Attention') {
          statusCounts[category.name].needsAttention += 1;
        }
      });
    });
    return statusCounts;
  }, [fullSimulationWritingAssessments]);
  const fullSimulationStrengths = useMemo(() => {
    const strengths = [];
    if ((writingCategoryTrends['Tone & Professionalism']?.strong || 0) >= 3) {
      strengths.push('Maintains a professional leadership tone across multiple written responses.');
    }
    if ((writingCategoryTrends.Empathy?.strong || 0) >= 3) {
      strengths.push('Consistently acknowledges stakeholder emotion and perspective.');
    }
    if ((writingCategoryTrends['Actionability & Follow-Through']?.strong || 0) >= 3) {
      strengths.push('Frequently includes concrete next steps and follow-through commitments.');
    }
    if (decisionPatternSummary.some((line) => line.includes('Investigate-first choices appeared in') && !line.includes(' 0 '))) {
      strengths.push('Demonstrates a fact-finding mindset before making final judgments.');
    }
    return strengths.slice(0, 4);
  }, [writingCategoryTrends, decisionPatternSummary]);
  const fullSimulationGrowthAreas = useMemo(() => {
    const growth = [];
    if ((writingCategoryTrends['Tone & Professionalism']?.needsAttention || 0) >= 2) {
      growth.push('Increase consistency of calm, confidence-building language in high-stress communications.');
    }
    if ((writingCategoryTrends.Empathy?.needsAttention || 0) >= 2) {
      growth.push('Add clearer acknowledgment of stakeholder concerns before moving to logistics.');
    }
    if ((writingCategoryTrends['Specificity & Clarity']?.needsAttention || 0) >= 2) {
      growth.push('Improve specificity by naming concrete actions, owners, and timelines.');
    }
    if ((writingCategoryTrends['Actionability & Follow-Through']?.needsAttention || 0) >= 2) {
      growth.push('Close communication loops with explicit next steps and follow-up timing.');
    }
    return growth.slice(0, 4);
  }, [writingCategoryTrends]);
  const reportDomainScores = useMemo(() => {
    const scoreFromCategory = (name) => {
      const totals = writingCategoryTrends[name] || { strong: 0, needsAttention: 0 };
      const total = totals.strong + totals.needsAttention;
      if (!total) return 70;
      return Math.max(45, Math.min(96, Math.round(((totals.strong + 1) / (total + 2)) * 100)));
    };
    return [
      { label: 'Judgment Under Pressure', score: Math.max(55, 65 + (decisionPatternSummary[0]?.includes(' 0 ') ? 0 : 18)), weight: 0.2, interpretation: 'Assesses early risk recognition, escalation judgment, and decisiveness under pressure.' },
      { label: 'Communication & Leadership Voice', score: Math.round((scoreFromCategory('Tone & Professionalism') + scoreFromCategory('Specificity & Clarity')) / 2), weight: 0.25, interpretation: 'Measures empathy, authority, clarity, and ownership language across written responses.' },
      { label: 'Student-Centered Leadership', score: scoreFromCategory('Empathy') },
      { label: 'Equity & Fairness', score: scoreFromCategory('Equity & Bias Awareness'), weight: 0.1, interpretation: 'Evaluates fairness framing, bias awareness, and inclusion instincts in decisions and writing.' },
      { label: 'Safety & Risk Awareness', score: scoreFromCategory('Risk/Safety Framing'), weight: 0.15, interpretation: 'Rates how well safety concerns are named, documented, and escalated proportionately.' },
      { label: 'Operational Follow-Through', score: scoreFromCategory('Actionability & Follow-Through'), weight: 0.15, interpretation: 'Tracks use of owners, timelines, and completion language to close accountability loops.' },
    ];
  }, [decisionPatternSummary, writingCategoryTrends]);
  reportDomainScores[2].weight = 0.15;
  reportDomainScores[2].interpretation = 'Captures student dignity, belonging, and instructional equity orientation.';
  const overallReadinessScore = useMemo(
    () => Math.round(reportDomainScores.reduce((acc, item) => acc + (item.score * item.weight), 0)),
    [reportDomainScores],
  );
  const totalWrittenResponses = fullSimulationWrittenResponses.length;
  const candidateTypeLabel = overallReadinessScore >= 80 ? 'Principal Candidate' : 'Emerging Principal / Assistant Principal Candidate';
  const growthEdge = overallReadinessScore >= 75 ? 'Crisis command language precision' : 'Operational ownership and decisive closure under pressure';
  const primaryLeadershipStyleLabel = leadershipStyleProfile.primaryStyle?.style || 'Relational';
  const overallReadinessLabel = overallReadinessScore >= 90
    ? 'Highly Ready'
    : overallReadinessScore >= 82
      ? 'Strong Readiness'
      : overallReadinessScore >= 74
        ? 'Proficient Readiness'
        : overallReadinessScore >= 66
          ? 'Developing Readiness'
          : 'Emerging Readiness';
  const scenarioWeights = useMemo(() => {
    const mapping = {
      'Student Threat Report': { band: 'Critical', weight: 2.0 },
      'Cafeteria Boundary Incident': { band: 'Critical', weight: 2.0 },
      'Recess Injury Parent Concern': { band: 'High-Stakes', weight: 1.5 },
      'Parent Escalation': { band: 'High-Stakes', weight: 1.5 },
    };
    return fullSimulationFirstMoveDecisions.map((entry) => ({
      ...entry,
      ...(mapping[entry.module] || { band: 'Routine', weight: 1.0 }),
    }));
  }, [fullSimulationFirstMoveDecisions]);
  const decisionEffectiveness = useMemo(() => {
    const text = fullSimulationFirstMoveDecisions.map((entry) => entry.decision.toLowerCase());
    const strongFirstMoves = text.filter((value) => /(investigate|review|fact|immediate|safety|support|follow[- ]?up|document|plan)/.test(value)).length;
    const delayedDecisions = text.filter((value) => /(wait|later|postpone|next week|defer)/.test(value)).length;
    const missedEscalations = text.filter((value) => /(handle quietly|no escalation|own their own|ignore|do nothing)/.test(value)).length;
    const total = text.length || 1;
    const asPct = (count) => Math.round((count / total) * 100);
    return {
      total,
      strongFirstMoves,
      delayedDecisions,
      missedEscalations,
      strongPct: asPct(strongFirstMoves),
      delayedPct: asPct(delayedDecisions),
      missedPct: asPct(missedEscalations),
    };
  }, [fullSimulationFirstMoveDecisions]);
  const weightedScenarioScore = useMemo(() => {
    const scoreFromDecision = (decision) => {
      const text = decision.toLowerCase();
      if (/(investigate|safety|immediate|plan|document|follow[- ]?up)/.test(text)) return 85;
      if (/(meet|discuss|review|support)/.test(text)) return 74;
      if (/(wait|later|postpone|defer)/.test(text)) return 58;
      return 68;
    };
    let weightedTotal = 0;
    let totalWeight = 0;
    let criticalTotal = 0;
    let criticalWeight = 0;
    let nonCriticalTotal = 0;
    let nonCriticalWeight = 0;
    scenarioWeights.forEach((entry) => {
      const score = scoreFromDecision(entry.decision);
      weightedTotal += score * entry.weight;
      totalWeight += entry.weight;
      if (entry.band === 'Critical') {
        criticalTotal += score * entry.weight;
        criticalWeight += entry.weight;
      } else {
        nonCriticalTotal += score * entry.weight;
        nonCriticalWeight += entry.weight;
      }
    });
    return {
      weightedScore: Math.round(weightedTotal / (totalWeight || 1)),
      criticalScore: Math.round(criticalTotal / (criticalWeight || 1)),
      nonCriticalScore: Math.round(nonCriticalTotal / (nonCriticalWeight || 1)),
    };
  }, [scenarioWeights]);
  const instructionalLeadershipScore = useMemo(() => {
    const teachingScenarios = fullSimulationWrittenResponses.filter((entry) => (
      /(academic|student support|walkthrough|teacher|instruction|iep|removal)/i.test(`${entry.module} ${entry.label}`)
    ));
    const mentions = teachingScenarios.reduce((count, entry) => {
      const text = entry.response.toLowerCase();
      if (/(instruction|learning|feedback|intervention|progress|coaching|data|support plan)/.test(text)) return count + 1;
      return count;
    }, 0);
    const base = reportDomainScores.find((row) => row.label === 'Student-Centered Leadership')?.score || 68;
    return Math.min(97, Math.round((base * 0.6) + ((mentions / (teachingScenarios.length || 1)) * 40)));
  }, [fullSimulationWrittenResponses, reportDomainScores]);
  const hiringRecommendation = overallReadinessScore >= 85
    ? 'Strong Hire'
    : overallReadinessScore >= 76
      ? 'Hire with Coaching'
      : overallReadinessScore >= 66
        ? 'Proceed with Caution'
        : 'Not Recommended';
  const reportData = evaluationResult || {
    evaluationSource: 'heuristic-fallback',
    evaluationConfidence: 'Moderate',
    apiStatus: 'fallback',
    overallReadinessScore,
    readinessLevel: overallReadinessLabel,
    candidateProfile: candidateTypeLabel,
    primaryLeadershipStyle: primaryLeadershipStyleLabel,
    snapshot: {
      trustBuilder: (writingCategoryTrends.Empathy?.strong || 0) >= 3 ? 'Strong' : 'Developing',
      decisionSpeed: decisionEffectiveness.delayedPct <= 12 ? 'Strong' : decisionEffectiveness.delayedPct <= 24 ? 'Developing' : 'Concern',
      authorityUnderPressure: weightedScenarioScore.criticalScore >= 80 ? 'Strong' : weightedScenarioScore.criticalScore >= 70 ? 'Developing' : 'Concern',
      operationalExecution: reportDomainScores[5]?.score >= 80 ? 'Strong' : reportDomainScores[5]?.score >= 70 ? 'Developing' : 'Concern',
    },
    strengths: fullSimulationStrengths,
    growthAreas: fullSimulationGrowthAreas,
    signatureLeadershipInsight: `Leadership profile indicates ${candidateTypeLabel} with a growth edge in ${growthEdge}.`,
    communicationLeadershipVoice: 'Communication is professional, with growth needed in decisiveness and ownership language under pressure.',
    schoolClimateCultureImpact: [{ label: 'Student Belonging', rating: 'Developing', insight: 'Student-centered language appears in several responses.' }],
    crisisRiskLeadership: 'Risk awareness is present with room for faster escalation clarity.',
    leadershipReadinessSummary: `Heuristic report generated from decisions and responses. Hiring recommendation: ${hiringRecommendation}.`,
    predictedFirst90DaysImpact: 'Likely to establish relational trust quickly, with growth needed in operational closure and execution precision.',
    recommendedFollowUpQuestions: ['How do you assign ownership and deadlines in high-stakes situations?'],
    howYouLeadUnderPressure: 'Under pressure, this candidate stays values-oriented but can become less explicit about ownership and timeline. Decisions generally acknowledge concern and set direction, yet closure language is sometimes incomplete. Strengthening escalation and follow-up checkpoints would improve reliability during fast-moving school moments.',
    leadershipImpact: [{ label: 'Student Belonging', rating: 'Developing', insight: 'Student-centered language appears in several responses, with room for clearer action closure.' }, { label: 'School Culture', rating: 'Developing', insight: 'Culture intent is present, but operational consistency needs reinforcement.' }, { label: 'Staff Trust', rating: 'Developing', insight: 'Trust-building tone is visible, though reliability depends on stronger follow-through.' }, { label: 'Crisis & Risk Leadership', rating: 'Developing', insight: 'Risk awareness is present with room for faster escalation clarity.' }],
  };
  const dashboardDomainScores = [
    { label: 'Judgment Under Pressure', score: reportData.domainScores?.judgmentUnderPressure ?? reportDomainScores[0]?.score ?? 70 },
    { label: 'Communication & Leadership Voice', score: reportData.domainScores?.communicationLeadershipVoice ?? reportDomainScores[1]?.score ?? 70 },
    { label: 'Student-Centered Leadership', score: reportData.domainScores?.studentCenteredLeadership ?? reportDomainScores[2]?.score ?? 70 },
    { label: 'Equity & Fairness', score: reportData.domainScores?.equityFairness ?? reportDomainScores[3]?.score ?? 70 },
    { label: 'Safety & Risk Awareness', score: reportData.domainScores?.safetyRiskAwareness ?? reportDomainScores[4]?.score ?? 70 },
    { label: 'Operational Follow-Through', score: reportData.domainScores?.operationalFollowThrough ?? reportDomainScores[5]?.score ?? 70 },
    { label: 'Instructional Leadership', score: reportData.domainScores?.instructionalLeadership ?? instructionalLeadershipScore ?? 70 },
  ];
  const weightedDomainRows = dashboardDomainScores.map((item) => ({ ...item, contribution: Number((item.score * item.weight).toFixed(1)) }));
  const leadershipConsistencyIndex = useMemo(() => {
    const scores = weightedDomainRows.map((row) => row.score);
    const mean = scores.reduce((sum, value) => sum + value, 0) / (scores.length || 1);
    const variance = scores.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / (scores.length || 1);
    const consistency = Math.max(40, Math.min(98, Math.round(100 - Math.sqrt(variance))));
    return consistency;
  }, [weightedDomainRows]);
  const leadershipRiskFlags = useMemo(() => {
    const flags = [];
    if (decisionEffectiveness.delayedPct >= 20) flags.push('Delay risk: multiple first moves postpone action in time-sensitive moments.');
    if (weightedScenarioScore.criticalScore < weightedScenarioScore.nonCriticalScore - 8) flags.push('Critical-scenario drop: performance dips when stakes are highest.');
    if ((writingCategoryTrends['Actionability & Follow-Through']?.needsAttention || 0) >= 2) flags.push('Execution gap: follow-through language does not consistently name owners and deadlines.');
    if ((writingCategoryTrends['Specificity & Clarity']?.needsAttention || 0) >= 2) flags.push('Clarity risk: some responses are values-aligned but still too general for staff execution.');
    if (leadershipConsistencyIndex < 72) flags.push('Consistency volatility: leadership quality shifts across decisions and communication tasks.');
    return flags.slice(0, 5);
  }, [decisionEffectiveness, weightedScenarioScore, writingCategoryTrends, leadershipConsistencyIndex]);

  useEffect(() => {
    if (scene === 'report') return;
    if (currentModule !== 'endOfDayEmail' || currentDeskStackItem !== null) return;
    if (!canCloseDeskStackDay) return;
    handleCloseDeskStackDay();
  }, [scene, currentModule, currentDeskStackItem, canCloseDeskStackDay]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cached = window.localStorage.getItem(simulationEvaluationStorageKey);
    if (cached) {
      try {
        setEvaluationResult(JSON.parse(cached));
      } catch (error) {
        window.localStorage.removeItem(simulationEvaluationStorageKey);
      }
    }
  }, []);

  useEffect(() => {
    if (scene !== 'report' || isGeneratingEvaluation || evaluationResult || isReportTestMode) return;
    const evaluate = async () => {
      setIsGeneratingEvaluation(true);
      setEvaluationErrorMessage('');
      try {
        const payload = {
          completedScenarios: requiredDayModules.filter((module) => timelineStatuses[module.id] === moduleStatuses.completed).map((module) => module.label),
          selectedDecisions: fullSimulationFirstMoveDecisions,
          writtenResponses: fullSimulationWrittenResponses,
          scenarioTitles: requiredDayModules.map((module) => module.label),
          timestamps: { completedAt: new Date().toISOString() },
          qualityFlags: responseQualityFlags,
          primaryLeadershipStyle: primaryLeadershipStyleLabel,
        };
        console.log('[simulation/report] Calling AI evaluation route');
        const response = await fetch('/api/simulation/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        console.log(`[simulation/report] Evaluation response status: ${response.status}`);
        if (!response.ok) throw new Error('Evaluation request failed');
        const result = await response.json();
        console.log(`[simulation/report] Evaluation source: ${result?.evaluationSource || 'unknown'}`);
        setEvaluationResult(result);
        window.localStorage.setItem(simulationEvaluationStorageKey, JSON.stringify(result));
        if (result.evaluationSource === 'heuristic-fallback') {
          setEvaluationErrorMessage('We could not complete the AI evaluation, so a basic report was generated from local scoring.');
        }
      } catch (error) {
        setEvaluationErrorMessage('We could not complete the AI evaluation, so a basic report was generated from local scoring.');
      } finally {
        setIsGeneratingEvaluation(false);
      }
    };
    evaluate();
  }, [scene, isGeneratingEvaluation, evaluationResult, fullSimulationFirstMoveDecisions, fullSimulationWrittenResponses, responseQualityFlags, primaryLeadershipStyleLabel, timelineStatuses]);

  const investigationGuidanceCopy = {
    'Discuss the situation with the teacher':
      'You chose to discuss the situation with the teacher before responding. This is appropriate if the goal is to review the classroom practice, support the teacher, and prevent future misunderstandings — not to assign blame.',
    'Respond to the parent':
      'You chose to respond after reviewing the available context. Your response should validate the parent’s concern, clarify the facts without blaming the child, and explain the next steps.',
  };

  const investigationOptions = ['Discuss the situation with the teacher', 'Respond to the parent'];

  const buildSimulationSnapshot = () => ({
    version: 'simulation-snapshot-v1',
    savedAt: new Date().toISOString(),
    currentModule,
    scene,
    timelineStatuses,
    folders,
    completedTasks,
    decisions: {
      firstDecision,
      investigationDecision,
      iepDecision,
      announcementsDecision,
      voicemailDecisions,
      lunchClimateDecision,
      parentEscalationDecision,
      cafeteriaBoundaryDecision,
      teacherConflictDecision,
      studentThreatDecision,
      academicDeclineDecision,
      ptoTalentShowDecision,
      recessInjuryDecision,
      studentRemovalDecision,
      arrivalPriorityAssignments,
      arrivalRankingSequence: arrivalRankingRecord ? arrivalRankingRecord.map((entry) => entry.item) : [],
    },
    responses: {
      initialParentResponse,
      finalParentResponse,
      voicemailResponses,
      lunchMonitorDirectionNote,
      parentEscalationResponse,
      cafeteriaBoundaryResponse,
      teacherConflictResponse,
      studentThreatResponse,
      academicDeclineResponse,
      ptoTalentShowResponse,
      recessInjuryResponse,
      studentRemovalResponse,
      walkthroughResponses,
    },
    records: {
      arrivalRankingRecord: arrivalRankingRecord || null,
      arrivalCoachingRecord: arrivalCoachingRecord || null,
      iepLeadershipRecord,
      announcementsLeadershipRecord,
      voicemailLeadershipRecord,
      walkthroughLeadershipRecord,
      lunchClimateCoachingRecord,
      parentEscalationLeadershipRecord,
      parentEscalationWritingAssessment,
      cafeteriaBoundaryLeadershipRecord,
      cafeteriaBoundaryWritingAssessment,
      teacherConflictLeadershipRecord,
      teacherConflictWritingAssessment,
      studentThreatWritingAssessment,
      academicDeclineWritingAssessment,
      ptoTalentShowWritingAssessment,
      recessInjuryWritingAssessment,
      studentRemovalWritingAssessment,
      parentFinalWritingAssessment,
      voicemailWritingAssessments,
      deskStackStatuses,
    },
    uiProgress: {
      started,
      showFullEmail: isEmailVisible,
      showVicGuidance: isVicOpen,
      hasCompletedFinalStep,
      arrivalCompleted,
      voicemailTaskClosed,
      lunchClimateInsightUnlocked,
      parentEscalationVoicemailPlayed,
      cafeteriaBoundaryVoicemailPlayed,
      hasCompletedWalkthroughForm,
      isInvestigationScene,
      isReportScene,
      currentDeskStackItem,
      hasReachedEndOfDay,
    },
  });

  const handlePreviewSaveSnapshot = () => {
    const snapshot = buildSimulationSnapshot();
    // eslint-disable-next-line no-console
    console.log('Simulation snapshot preview', snapshot);

    const hasRequiredFields = Boolean(
      snapshot.version && snapshot.currentModule && snapshot.timelineStatuses && snapshot.records,
    );

    setSnapshotPreviewMessage('Snapshot preview generated in console.');
    setSnapshotValidationMessage(
      hasRequiredFields
        ? 'Snapshot structure looks valid.'
        : 'Snapshot is missing required fields.',
    );
  };

  const saveSimulationProgress = () => {
    if (typeof window === 'undefined') return;

    const snapshot = buildSimulationSnapshot();

    try {
      const serializedSnapshot = JSON.stringify(snapshot);
      window.localStorage.setItem(simulationProgressStorageKey, serializedSnapshot);
      setSaveProgressMessage('Progress saved on this device.');
      setLastSavedLabel(`Last saved: ${new Date(snapshot.savedAt).toLocaleString()}`);
      setSavedSnapshot(snapshot);
    } catch (error) {
      setSaveProgressMessage('Progress could not be saved on this device.');
      setLastSavedLabel('');
    }
  };

  const handleResumeSavedSimulation = () => {
    if (!savedSnapshot || !isValidSnapshotForRestore(savedSnapshot)) {
      setSaveProgressMessage('Saved progress could not be restored.');
      return;
    }

    restoreSimulationProgress(savedSnapshot);
    setSaveProgressMessage('Saved simulation restored.');
    scrollToTop();
  };

  const handleClearSavedProgress = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(simulationProgressStorageKey);
    }

    setSavedSnapshot(null);
    setLastSavedLabel('');
    setSnapshotPreviewMessage('');
    setSnapshotValidationMessage('');
    setSaveProgressMessage('Saved progress cleared from this device.');
  };

  const handleStartOver = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(simulationEvaluationStorageKey);
    }
    setEvaluationResult(null);
    setEvaluationErrorMessage('');
    resetSimulationState({ clearSavedProgress: true, confirmationMessage: 'Simulation restarted.' });
    scrollToTop();
  };

  const handleExitReportTestMode = () => {
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', window.location.pathname);
    }
    setIsReportTestMode(false);
    setEvaluationResult(null);
    resetSimulationState({ confirmationMessage: 'Exited Report Test Mode.' });
  };

  const reportDashboard = (
    <div className="leadership-dashboard">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-header-kicker">◆ Leadership Evaluation</p>
          <h2>Your Leadership Evaluation</h2>
          <p>Generated from your decisions and responses during the simulation.</p>
        </div>
        <div className="dashboard-header-right">
          <p><strong>VIC</strong> | AI Co-Teacher & Leadership Evaluation System</p>
          <div className="button-row report-actions-top no-print">
          <button type="button" className="button primary" onClick={() => window.print()}>Download / Print Report</button>
          <button type="button" className="button secondary" onClick={handleStartOver}>Start New Simulation</button>
          </div>
        </div>
      </header>
      {isGeneratingEvaluation ? <article className="report-card"><p>Generating your leadership evaluation report…</p></article> : null}
      {evaluationErrorMessage ? <article className="report-card"><p>{evaluationErrorMessage}</p></article> : null}
      {!allRequiredModulesComplete && !isReportTestMode ? <article className="report-card"><p>Some required scenarios were not completed before entering report mode.</p></article> : null}
      <div className="dashboard-meta-strip">
        <span><strong>Completed Scenarios:</strong> {fullSimulationFirstMoveDecisions.length}</span>
        <span><strong>Written Responses:</strong> {totalWrittenResponses}</span>
        <span><strong>Evaluation Period:</strong> Simulation Day 1</span>
        {(isReportTestMode || process.env.NODE_ENV === 'development')
          ? <span><strong>Source:</strong> {reportData.evaluationSource || 'n/a'} · {reportData.apiStatus || 'n/a'}</span>
          : null}
      </div>
      <div className="dashboard-workspace">
        <aside className="dashboard-sidebar">
          <h3>Report Navigation</h3>
          <ul>
            <li><a href="#executive-summary">Executive Summary</a></li>
            <li><a href="#core-competencies">Core Competencies</a></li>
            <li><a href="#leadership-impact">Leadership Impact</a></li>
            <li><a href="#strengths-growth">Strengths & Growth</a></li>
            <li><a href="#detailed-analysis">Detailed Analysis</a></li>
            <li><a href="#follow-up-questions">Follow-Up Questions</a></li>
          </ul>
          <div className="sidebar-snapshot-pills">
            {['trustBuilder', 'decisionSpeed', 'authorityUnderPressure', 'operationalExecution'].map((key) => {
              const snapshotRating = reportData.snapshot?.[key] || 'Developing';
              const snapshotTone = getRatingTone(snapshotRating);
              return (
                <div key={key} className={`snapshot-pill snapshot-${snapshotTone}`}>
                  <span>{formatDashboardLabel(key)}</span>
                  <strong className={`status-${snapshotTone}`}>{snapshotRating}</strong>
                </div>
              );
            })}
          </div>
          <blockquote>“Leadership is not about being in charge. It is about taking care of those in your charge.”<span>— Simon Sinek</span></blockquote>
        </aside>
      <div className="dashboard-grid">
        <article id="executive-summary" className="report-card dashboard-card overall-readiness-card"><h3>Overall Readiness</h3><div className="hero-readiness-panel"><div className="readiness-gauge hero-readiness-gauge" style={{ '--gauge-value': `${reportData.overallReadinessScore || 0}` }}><div className="readiness-needle" /><div className="readiness-gauge-inner"><p className="score-big">{reportData.overallReadinessScore}/100</p><p>{reportData.readinessLevel}</p><span className="confidence-badge">{reportData.evaluationConfidence} confidence</span></div></div><div className="profile-chip-grid"><p><strong>Candidate Profile:</strong> {reportData.candidateProfile}</p><p><strong>Leadership Style:</strong> {reportData.primaryLeadershipStyle}</p><p><strong>Leadership Consistency:</strong> {leadershipConsistencyIndex}/100</p></div></div><div className="hero-mini-tiles"><article><h4>Evaluation Confidence</h4><p>{reportData.evaluationConfidence}</p></article><article><h4>Leadership Style</h4><p>{reportData.primaryLeadershipStyle}</p></article><article><h4>Leadership Consistency</h4><p>{leadershipConsistencyIndex}/100</p></article><article><h4>Completion Quality</h4><p>{Math.round((completedRequiredModuleCount / requiredDayModules.length) * 100)}%</p></article></div></article>
        <article id="core-competencies" className="report-card dashboard-card core-competencies-card">
          <h3>Core Competency Scores</h3>
          <div className="competency-gauge-grid">{dashboardDomainScores.map((item) => { const rating = getCompetencyRating(item.score); return <article key={item.label} className="competency-gauge-card"><h4>{item.label}</h4><div className="domain-score-head"><strong>{item.score}/100</strong><span className={`status-${rating.tone}`}>{rating.label}</span></div><div className="domain-score-track"><span className={rating.tone} style={{ width: `${item.score}%` }} /></div><p>{item.score >= 85 ? 'Clear evidence of dependable execution in this domain.' : item.score >= 70 ? 'Solid leadership evidence with opportunities to tighten consistency.' : item.score >= 55 ? 'Developing performance with visible growth opportunities.' : 'Priority coaching area requiring immediate focus and support.'}</p></article>; })}</div>
        </article>
        <section className="dashboard-split dashboard-feature-row">
          <article className="report-card dashboard-card"><h3>Signature Leadership Insight</h3><p>{reportData.signatureLeadershipInsight}</p><p><strong>Communication & Leadership Voice:</strong> {reportData.communicationLeadershipVoice}</p></article>
        </section>
        <section id="strengths-growth" className="dashboard-split">
          <article className="report-card dashboard-card"><h3>Strengths</h3><ul className="strong-response-list status-list">{(reportData.strengths || []).map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className="report-card dashboard-card"><h3>Growth Areas</h3><ul className="strong-response-list status-list growth">{(reportData.growthAreas || []).map((item) => <li key={item}>{item}</li>)}</ul></article>
        </section>
        <section className="dashboard-split">
          <article className="report-card dashboard-card pressure-card"><h3>How You Lead Under Pressure</h3><p>{reportData.howYouLeadUnderPressure || reportData.crisisRiskLeadership}</p><p><strong>Crisis & Risk Leadership:</strong> {reportData.crisisRiskLeadership}</p></article>
          <article className="report-card dashboard-card"><h3>Leadership Readiness Summary</h3><p>{reportData.leadershipReadinessSummary}</p></article>
        </section>
        <section id="leadership-impact" className="dashboard-impact-grid">
          {(reportData.leadershipImpact || reportData.schoolClimateCultureImpact || []).slice(0, 4).map((item) => { const score = Number.isFinite(item.score) ? item.score : getRatingFallbackScore(item.rating); const rating = getCompetencyRating(score); return <article key={item.label} className="report-card dashboard-card impact-visual-card"><h3>{item.label}</h3><div className="impact-gauge-wrap"><div className="readiness-gauge impact-readiness-gauge" style={{ '--gauge-value': `${score}` }}><div className="readiness-needle" /><div className="readiness-gauge-inner"><strong>{score}</strong></div></div><p className={`impact-rating status-${getRatingTone(item.rating)}`}>{item.rating}</p></div><p className={`impact-score status-${rating.tone}`}>{score}/100</p><p>{item.insight}</p></article>; })}
        </section>
        <section className="dashboard-split">
          <article className="report-card dashboard-card"><h3>Predicted First 90 Days Impact</h3><p>{reportData.predictedFirst90DaysImpact}</p></article>
          <article id="detailed-analysis" className="report-card dashboard-card"><h3>Evaluator Notes</h3><p><strong>Overall Readiness:</strong> {reportData.leadershipReadinessSummary}</p><p><strong>Communication & Leadership Voice:</strong> {reportData.communicationLeadershipVoice}</p><p><strong>Operational Execution:</strong> {reportData.snapshot?.operationalExecution || 'Developing'} readiness indicates how consistently this candidate turns decisions into owned, time-bound actions across scenarios.</p><p><strong>Crisis & Risk Leadership:</strong> {reportData.crisisRiskLeadership}</p></article>
        </section>
        <article id="follow-up-questions" className="report-card dashboard-card dashboard-full"><h3>Recommended Follow-Up Questions</h3><ul className="strong-response-list">{(reportData.recommendedFollowUpQuestions || []).map((item) => <li key={item}>{item}</li>)}</ul></article>
      </div>
      </div>
    </div>
  );

  const reportTestPanel = isReportTestMode ? (
    <article className="report-card no-print report-test-panel" style={{ border: '2px solid #1d4ed8', marginBottom: '0.75rem' }}>
      <h2 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>Report Test Mode</h2>
      <p>Use this panel to preview report dashboard layouts without completing the full simulation.</p>
      <div className="button-row">
        <button type="button" className="button secondary" onClick={() => applyReportTestPayload('weak')}>Weak Candidate</button>
        <button type="button" className="button secondary" onClick={() => applyReportTestPayload('developing')}>Developing Candidate</button>
        <button type="button" className="button secondary" onClick={() => applyReportTestPayload('strong')}>Strong Candidate</button>
        <button type="button" className="button secondary" onClick={() => applyReportTestPayload('mixed')}>Mixed Candidate</button>
        <button type="button" className="button secondary" onClick={() => { if (typeof window !== 'undefined') window.localStorage.removeItem(simulationEvaluationStorageKey); setEvaluationResult(null); setReportTestNotice('Evaluation cache cleared.'); }}>Clear Evaluation Cache</button>
        <button type="button" className="button primary" onClick={handleExitReportTestMode}>Exit Test Mode</button>
      </div>
      {reportTestNotice ? <p>{reportTestNotice}</p> : null}
    </article>
  ) : null;

  if (isReportScene) {
    return <div className="simulation-product-shell report-only-shell">{reportTestPanel}{isReportTestMode ? <article className="report-card no-print"><p>TEST MODE — {reportTestLabel}</p></article> : null}{reportDashboard}</div>;
  }

  return (
    <div className="simulation-product-shell">
      {reportTestPanel}
      <section className="day-timeline-card timeline-full-width" aria-label="Simulation day modules">
        <p className="eyebrow">Simulation Day Timeline</p>
        <h2>A Day in the Life of a School Leader</h2>
        <p className="timeline-note">
          Time moves forward. Once a leadership moment passes, it becomes part of your record.
        </p>
        <p className="timeline-note">
          <strong>
            Day Progress: {completedRequiredModuleCount} / {requiredDayModules.length} scenarios completed
          </strong>
        </p>
        <div className="day-timeline-grid">
          {dayModules.map((module) => {
            const status = timelineStatuses[module.id];
            const isActive = status === moduleStatuses.active && currentModule === module.id;
            const isCompleted = status === moduleStatuses.completed;
            const isUpcoming = status === moduleStatuses.upcoming;
            const moduleLabel = isUpcoming && !module.enabled ? `${module.label} (Coming Soon)` : module.label;
            const isBuilderModeModule = builderModeModuleIds.has(module.id);
            const isDisabled = builderMode
              ? !module.enabled || !isBuilderModeModule
              : !module.enabled || (!hasReachedEndOfDay && isCompleted);

            return (
              <button
                key={module.id}
                type="button"
                className={`timeline-module ${
                  isCompleted
                    ? 'completed'
                    : isActive
                      ? 'active'
                      : 'upcoming'
                } ${isUpcoming && !module.enabled ? 'coming-soon' : ''}`}
                aria-current={isActive ? 'step' : undefined}
                disabled={isDisabled}
                onClick={() => {
                  if (isDisabled) return;
                  if (hasReachedEndOfDay) {
                    setCurrentModule(module.id);
                    setCurrentDeskStackItem(null);
                    setScene('initial');
                    setModuleTransitionNote('');
                    scrollToTop();
                    return;
                  }
                  setTimelineStatuses((prev) => {
                    const next = { ...prev };
                    dayModules.forEach((dayModule) => {
                      if (next[dayModule.id] !== moduleStatuses.completed) {
                        next[dayModule.id] = dayModule.id === module.id
                          ? moduleStatuses.active
                          : moduleStatuses.upcoming;
                      }
                    });
                    return next;
                  });
                  setCurrentModule(module.id);
                  setModuleTransitionNote('');
                }}
              >
                <span>{moduleLabel}</span>
                {isCompleted ? <span className="timeline-module-badge">Locked</span> : null}
              </button>
            );
          })}
        </div>
        {builderMode ? <p className="builder-mode-badge">Builder Mode Active</p> : null}
      </section>

      <div className="simulation-layout-grid">
        <div className="scenario-column card">
          <div className={`scenario-content ${isDecisionMade ? 'decision-made' : 'pre-decision'}`}>
            {currentModule === 'arrival' ? (
              <>
                {arrivalCompleted ? (
                  <article className="scenario-preview-card">
                    <p>Morning triage complete. Your first leadership decisions are now part of the record.</p>
                    {arrivalRankingRecord ? (
                      <p>
                        Saved ranking:{' '}
                        {arrivalRankingRecord.map(({ item, rank }) => `${rank} ${item}`).join(' • ')}
                      </p>
                    ) : null}
                    {arrivalCoachingRecord ? (
                      <p>{arrivalCoachingRecord.title} saved to leadership record.</p>
                    ) : null}
                    <p>{moduleTransitionNote || 'Next module coming soon.'}</p>
                  </article>
                ) : (
                  <>
                    <p className="eyebrow">7:30 AM</p>
                    <h2>The Day Begins</h2>
                    <article className="scenario-preview-card">
                      <p>
                        You arrive before most of the building is moving. For a few minutes, the office is
                        quiet — but the day is already waiting for you.
                      </p>
                      <p>
                        Your voicemail light is blinking. Your inbox has unread messages. A stack of physical
                        mail is sitting on your desk. A teacher has also stopped by to ask if you have a
                        minute.
                      </p>
                    </article>
                    <article className="report-card" aria-live="polite">
                        <h3>Sequence Your Priorities</h3>
                        <p>
                          All of these require your attention today. The leadership challenge is deciding what
                          comes first — and why.
                        </p>
                        <div className="arrival-priority-list">
                          {arrivalSortItems.map((item) => (
                            <div key={item} className="arrival-priority-card">
                              <span className="selected-decision-label">{item}</span>
                              <div className="button-row arrival-rank-row">
                                {arrivalPriorityRanks.map((rank) => (
                                  <button
                                    key={`${item}-${rank}`}
                                    type="button"
                                    className={`button secondary ${arrivalPriorityAssignments[item] === rank ? 'active' : ''}`}
                                    onClick={() => handleArrivalPriorityAssignment(item, rank)}
                                    aria-pressed={arrivalPriorityAssignments[item] === rank}
                                  >
                                    {rank}
                                  </button>
                                ))}
                              </div>
                              <p className="arrival-assigned-rank">
                                Assigned:{' '}
                                <strong>
                                  {arrivalPriorityAssignments[item]
                                    ? arrivalPriorityAssignments[item]
                                    : 'Not assigned'}
                                </strong>
                              </p>
                            </div>
                          ))}
                        </div>
                        {hasFinishedArrivalRanking ? (
                          <article className="decision-consequence-card" aria-live="polite">
                            <h4>Suggested Leadership Sequence</h4>
                            <p>Recommended sequence:</p>
                            <ol className="arrival-coaching-list">
                              {suggestedArrivalSequence.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ol>
                            <p>
                              Leadership thinking:
                            </p>
                            <p>{suggestedArrivalCoachingNote}</p>
                          </article>
                        ) : null}
                        <div className="button-row">
                          <button
                            type="button"
                            className="button primary"
                            onClick={handleContinueDay}
                            disabled={!hasFinishedArrivalRanking}
                          >
                            Continue Day
                          </button>
                        </div>
                    </article>
                  </>
                )}
              </>
            ) : currentModule === 'iepMeeting' ? (
              <>
                <p className="eyebrow">8:15 AM</p>
                <h2>IEP Meeting</h2>
                <article className="scenario-preview-card">
                  <p>
                    Teachers have arrived, and you are already in an IEP meeting. The earlier messages,
                    mailbox items, and email stack will have to wait.
                  </p>
                  <p>
                    At the end of the meeting, the Special Education Director asks you to retrieve the IDEA
                    manual, send a copy to the parents, and CC her.
                  </p>
                </article>

                <h3 className="decision-prompt">
                  This is not complicated, but it is compliance-sensitive. What do you do with this task?
                </h3>
                <div className="choices">
                  {Object.keys(iepDecisionCoaching).map((decision) => (
                    <button
                      key={decision}
                      className={`choice ${iepDecision === decision ? 'active' : ''}`}
                      onClick={() => handleIepDecisionSelect(decision)}
                    >
                      {decision}
                    </button>
                  ))}
                </div>

                {iepDecision ? (
                  <article className="decision-consequence-card" aria-live="polite">
                    <h4>{iepDecisionCoaching[iepDecision].title}</h4>
                    <p>{iepDecisionCoaching[iepDecision].message}</p>
                  </article>
                ) : null}

                {iepDecision ? (
                  <>
                    <h3 className="decision-prompt">Where should this task live?</h3>
                    <div className="choices">
                      {iepFolderOptions.map((option) => (
                        <button
                          key={option.id}
                          className={`choice ${iepFolderChoice === option.id ? 'active' : ''}`}
                          onClick={() => handleIepFolderSelection(option.id)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    {iepFolderChoice ? (
                      <article className="decision-next-step-panel" aria-live="polite">
                        <p>
                          Added to{' '}
                          <strong>{iepFolderChoice.charAt(0).toUpperCase() + iepFolderChoice.slice(1)}</strong>{' '}
                          folder: {iepTaskItem}
                        </p>
                      </article>
                    ) : null}
                    <article className="decision-consequence-card" aria-live="polite">
                      <h4>IEP Follow-Through Insight</h4>
                      <p>
                        IEP-related requests may seem simple, but they sit inside legal expectations and
                        parent trust. Missing small steps here can create larger problems later.
                      </p>
                      <p>
                        <strong>Suggested folder: Red — before leaving today.</strong>
                      </p>
                    </article>
                  </>
                ) : null}

                <div className="button-row">
                  <button
                    type="button"
                    className="button primary"
                    onClick={handleIepContinueDay}
                    disabled={!iepDecision || !iepFolderChoice}
                  >
                    Continue Day
                  </button>
                </div>
              </>
            ) : currentModule === 'announcements' ? (
              <>
                <p className="eyebrow">9:00 AM</p>
                <h2>Morning Announcements</h2>
                <article className="scenario-preview-card">
                  <p>
                    You finish morning announcements with the student TV crew. These moments matter —
                    students see the principal as present, visible, and part of the life of the school.
                  </p>
                  <p>
                    On your way back to the office, a teacher stops you. Her classroom TV was not
                    working, so her students could not hear the announcements. She asks if you can get her
                    a copy and also let maintenance know her TV needs attention.
                  </p>
                </article>
                <h3 className="decision-prompt">
                  You are only steps away from the office, but this is how a principal&apos;s day fills up:
                  one hallway request becomes three things to remember before you even sit down.
                </h3>
                <div className="choices">
                  {Object.keys(announcementsDecisionCoaching).map((decision) => (
                    <button
                      key={decision}
                      className={`choice ${announcementsDecision === decision ? 'active' : ''}`}
                      onClick={() => handleAnnouncementsDecisionSelect(decision)}
                    >
                      {decision}
                    </button>
                  ))}
                </div>

                {announcementsDecision ? (
                  <article className="decision-consequence-card" aria-live="polite">
                    <h4>{announcementsDecisionCoaching[announcementsDecision].title}</h4>
                    <p>{announcementsDecisionCoaching[announcementsDecision].message}</p>
                  </article>
                ) : null}

                {announcementsDecision ? (
                  <>
                    <h3 className="decision-prompt">
                      What needs to be captured from this hallway request?
                    </h3>
                    <div className="arrival-priority-list">
                      {announcementsTasks.map((task) => (
                        <article key={task.id} className="arrival-priority-card">
                          <span className="selected-decision-label">{task.label}</span>
                          <div className="button-row arrival-rank-row">
                            {iepFolderOptions.map((option) => (
                              <button
                                key={`${task.id}-${option.id}`}
                                type="button"
                                className={`button secondary ${announcementsTaskFolders[task.id] === option.id ? 'active' : ''}`}
                                onClick={() => handleAnnouncementsTaskFolderSelection(task.id, option.id)}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                          {announcementsTaskFolders[task.id] ? (
                            <p className="arrival-assigned-rank">
                              Added to{' '}
                              <strong>
                                {announcementsTaskFolders[task.id].charAt(0).toUpperCase()
                                  + announcementsTaskFolders[task.id].slice(1)}
                              </strong>{' '}
                              folder.
                            </p>
                          ) : null}
                        </article>
                      ))}
                    </div>
                    {announcementsTasks.every((task) => Boolean(announcementsTaskFolders[task.id])) ? (
                      <article className="decision-consequence-card" aria-live="polite">
                        <h4>Hallway Leadership Insight</h4>
                        <p>
                          Visibility creates access. The more present you are in the building, the more
                          people will bring needs to you in motion. Strong leaders use a capture system —
                          notebook, phone, assistant, or dashboard — so small requests do not disappear on
                          the walk back to the office.
                        </p>
                        <p>
                          <strong>Suggested folder: Red for both tasks.</strong>
                        </p>
                      </article>
                    ) : null}
                  </>
                ) : null}

                <div className="button-row">
                  <button
                    type="button"
                    className="button primary"
                    onClick={handleAnnouncementsContinueDay}
                    disabled={
                      !announcementsDecision
                      || announcementsTasks.some((task) => !announcementsTaskFolders[task.id])
                    }
                  >
                    Continue Day
                  </button>
                </div>
              </>
            ) : currentModule === 'voicemail' ? (
              <>
                <p className="eyebrow">9:30 AM</p>
                <h2>Voicemail Backlog</h2>
                <article className="scenario-preview-card">
                  <p>
                    You finally get a few minutes near your desk. The red voicemail light is blinking
                    again. Some messages came in before you arrived, and now they need to be triaged
                    before the day moves too far ahead.
                  </p>
                  <p>
                    Voicemails often carry a different urgency than email. If someone took the time to
                    call, there may be emotion, confusion, or a time-sensitive concern behind the message.
                  </p>
                </article>

                <div className="arrival-priority-list voicemail-thread-list">
                  <article className="arrival-priority-card voicemail-thread-card">
                    <h3>Voicemail 1</h3>
                    <audio controls className="voicemail-audio-player">
                      <source src="/images/parent-help-request.vm.mp3" type="audio/mpeg" />
                    </audio>
                    <h4 className="decision-prompt">What is your first move with this message?</h4>
                    <div className="button-row arrival-rank-row">
                      {voicemailFirstMoveOptions.map((choice) => (
                        <button
                          key={`parent-${choice}`}
                          type="button"
                          className={`button secondary ${voicemailDecisions.parentHelp === choice ? 'active' : ''}`}
                          onClick={() => handleVoicemailDecisionSelect('parentHelp', choice)}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                    {voicemailDecisions.parentHelp ? (
                      <article className="decision-consequence-card" aria-live="polite">
                        <h4>{voicemailCoachingByDecision[voicemailDecisions.parentHelp].title}</h4>
                        <p>{voicemailCoachingByDecision[voicemailDecisions.parentHelp].message}</p>
                      </article>
                    ) : null}
                  </article>

                  <article className="arrival-priority-card voicemail-thread-card">
                    <h3>Voicemail 2</h3>
                    <audio controls className="voicemail-audio-player">
                      <source src="/images/teacher-call-vm.mp3" type="audio/mpeg" />
                    </audio>
                    <h4 className="decision-prompt">What is your first move with this message?</h4>
                    <div className="button-row arrival-rank-row">
                      {voicemailFirstMoveOptions.map((choice) => (
                        <button
                          key={`teacher-${choice}`}
                          type="button"
                          className={`button secondary ${voicemailDecisions.teacherCall === choice ? 'active' : ''}`}
                          onClick={() => handleVoicemailDecisionSelect('teacherCall', choice)}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                    {voicemailDecisions.teacherCall ? (
                      <article className="decision-consequence-card" aria-live="polite">
                        <h4>{voicemailCoachingByDecision[voicemailDecisions.teacherCall].title}</h4>
                        <p>{voicemailCoachingByDecision[voicemailDecisions.teacherCall].message}</p>
                      </article>
                    ) : null}
                  </article>
                </div>

                {hasSelectedBothVoicemailDecisions ? (
                  <>
                    <article className="report-card report-intro">
                      <h3>Open Voicemail Threads</h3>
                      <p>
                        Both messages now require follow-through. A voicemail is not complete when it
                        is heard. It is complete when the concern has been acknowledged, investigated
                        if needed, and answered with next steps.
                      </p>
                    </article>
                    <article className="report-card">
                      <h3>Parent Help Request — Context Needed</h3>
                      <p>
                        Before giving a full answer, determine what the parent is asking for, whether
                        the concern involves a student need, a classroom issue, a scheduling issue, or
                        a support request, and whether anyone else needs to be consulted.
                      </p>
                      <button
                        type="button"
                        className="button secondary"
                        onClick={() => setShowParentSupportingInfo((prev) => !prev)}
                      >
                        {showParentSupportingInfo ? '🔎 Hide Supporting Information' : '🔎 View Supporting Information'}
                      </button>
                      {showParentSupportingInfo ? (
                        <div className="analysis-row">
                          <p className="analysis-lens">Parent Help Request — Supporting Information</p>
                          <p><strong>Teacher Observation Note:</strong></p>
                          <ul className="strong-response-list">
                            <li>Student becomes overwhelmed during transitions, group work, and loud classroom moments.</li>
                            <li>Student covers ears, asks to leave, or shuts down when the room becomes noisy.</li>
                            <li>Concern has become more frequent over the past two weeks.</li>
                          </ul>
                          <p><strong>Student Support Snapshot:</strong></p>
                          <ul className="strong-response-list">
                            <li>Student has a documented ADHD diagnosis.</li>
                            <li>Parent does not want the child moved to another classroom.</li>
                            <li>Parent is asking for strategies and consistency between home and school.</li>
                            <li>No major discipline incidents are connected to this concern.</li>
                          </ul>
                          <p><strong>Current Classroom Supports:</strong></p>
                          <ul className="strong-response-list">
                            <li>Preferential seating away from the highest-traffic area.</li>
                            <li>Quiet breaks are allowed when the student requests support.</li>
                            <li>Teacher has used proximity support and calm verbal redirection.</li>
                            <li>No formal noise-reduction plan has been written yet.</li>
                          </ul>
                          <p><strong>Guidance / ESE Input:</strong></p>
                          <ul className="strong-response-list">
                            <li>Consider noise-reduction headphones during high-noise activities.</li>
                            <li>Add predictable transition warnings before noisy parts of the day.</li>
                            <li>Identify a quiet reset space the student can use appropriately.</li>
                            <li>Align home and school language so the student can practice the same coping script in both places.</li>
                          </ul>
                        </div>
                      ) : null}
                    </article>
                    <article className="report-card">
                      <h3>Teacher Call — Context Needed</h3>
                      <p>
                        Before closing the loop, determine whether the teacher needs a decision, a
                        resource, coverage, parent support, student support, or administrative
                        follow-up.
                      </p>
                      <button
                        type="button"
                        className="button secondary"
                        onClick={() => setShowTeacherSupportingInfo((prev) => !prev)}
                      >
                        {showTeacherSupportingInfo ? '🔎 Hide Supporting Information' : '🔎 View Supporting Information'}
                      </button>
                      {showTeacherSupportingInfo ? (
                        <div className="analysis-row">
                          <p className="analysis-lens">Teacher Call — Supporting Information</p>
                          <p><strong>Placement / IEP Snapshot:</strong></p>
                          <ul className="strong-response-list">
                            <li>Student has an IEP with inclusion time in the general education setting.</li>
                            <li>Placement was determined through the IEP/support process.</li>
                            <li>Placement is not determined by teacher preference alone.</li>
                            <li>Concerns should be addressed through support planning, not by refusing placement.</li>
                          </ul>
                          <p><strong>Student Readiness Information:</strong></p>
                          <ul className="strong-response-list">
                            <li>Student has participated successfully in short general education activities with support.</li>
                            <li>Student may need help with transitions, sensory regulation, and peer interaction.</li>
                            <li>Student responds well to predictable routines, visual supports, and calm adult prompting.</li>
                            <li>There is no current evidence that the student is unsafe in general education with appropriate supports.</li>
                          </ul>
                          <p><strong>Teacher Support Plan:</strong></p>
                          <ul className="strong-response-list">
                            <li>ESE staff will provide push-in support during the initial transition period.</li>
                            <li>Teacher will receive a brief support plan with triggers, calming strategies, and communication guidance.</li>
                            <li>A check-in meeting can be scheduled after the first week.</li>
                            <li>Administration will monitor the transition and support both the student and teacher.</li>
                          </ul>
                          <p><strong>Leadership Considerations:</strong></p>
                          <ul className="strong-response-list">
                            <li>Acknowledge the teacher’s concern without validating refusal of placement.</li>
                            <li>Reinforce that the school will follow the IEP process.</li>
                            <li>Focus on support, preparation, and collaboration.</li>
                            <li>Maintain a firm, calm, process-based tone.</li>
                          </ul>
                        </div>
                      ) : null}
                    </article>
                    <article className="report-card report-intro">
                      <h3>Voicemail Response Guidance</h3>
                      <p>
                        Strong leaders do not just listen to messages. They close loops. Before you write, make
                        sure the caller knows the message was received, what will happen next, and when they can
                        expect follow-up.
                      </p>
                      <ul className="strong-response-list">
                        <li>Acknowledge the concern.</li>
                        <li>Avoid overpromising.</li>
                        <li>Identify the next step.</li>
                        <li>Give a realistic timeline.</li>
                        <li>Preserve time for the rest of the day.</li>
                      </ul>
                    </article>
                    <article className="report-card">
                      <div className="analysis-grid">
                        <div className="analysis-row">
                          <p className="analysis-lens">Thread 1: Parent Help Request</p>
                          <p><strong>First move:</strong> {voicemailDecisions.parentHelp}</p>
                          <p><strong>Status:</strong> Open</p>
                          <label htmlFor="voicemail-parent-response" className="response-label">
                            Draft the response or next-step message…
                          </label>
                          <textarea
                            id="voicemail-parent-response"
                            rows={5}
                            className="response-input"
                            value={voicemailResponses.parentHelp}
                            onChange={(event) => handleVoicemailResponseChange('parentHelp', event.target.value)}
                            required
                          />
                        </div>
                        <div className="analysis-row">
                          <p className="analysis-lens">Thread 2: Teacher Call</p>
                          <p><strong>First move:</strong> {voicemailDecisions.teacherCall}</p>
                          <p><strong>Status:</strong> Open</p>
                          <label htmlFor="voicemail-teacher-response" className="response-label">
                            Draft the response or next-step message…
                          </label>
                          <textarea
                            id="voicemail-teacher-response"
                            rows={5}
                            className="response-input"
                            value={voicemailResponses.teacherCall}
                            onChange={(event) => handleVoicemailResponseChange('teacherCall', event.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </article>
                    <div className="button-row">
                      <button
                        type="button"
                        className="button primary"
                        onClick={handleVoicemailContinue}
                        disabled={!hasCompletedBothVoicemailResponses}
                      >
                        Continue
                      </button>
                    </div>
                  </>
                ) : null}
              </>
            ) : currentModule === 'classroomWalkthrough' ? (
              <>
                <p className="eyebrow">11:00 AM</p>
                <h2>Classroom Walkthrough</h2>
                <article className="scenario-preview-card">
                  <p>
                    You step into a classroom during an 18-minute lesson. This is not a formal evaluation —
                    it is a chance to gather evidence about instruction, student engagement, and classroom
                    dynamics.
                  </p>
                  <p>
                    Effective walkthroughs are short, non-evaluative, and focused on gathering evidence to
                    improve instruction. Strong leaders observe student engagement, clarity of learning goals,
                    instructional support, and classroom environment — then use that evidence to guide
                    reflective conversations with teachers.
                  </p>
                </article>

                <article className="report-card walkthrough-video-card">
                  <h3>Classroom Walkthrough Lesson Video</h3>
                  <div className="walkthrough-video-embed">
                    <iframe
                      src="https://www.youtube.com/embed/7SZnuQqv6bw?si=cs141QKMPsZsbpDK"
                      title="Classroom walkthrough lesson video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </article>

                <article className="report-card report-intro">
                  <h3>Walkthrough Observation Guide</h3>
                  <p>
                    Walkthroughs are not about judging teaching in the moment. They are about collecting evidence
                    that can support a thoughtful professional conversation.
                  </p>
                  <h4>Coaching Check</h4>
                  <ul className="strong-response-list">
                    <li>Focus on what students are doing, not only what the teacher is doing.</li>
                    <li>Identify evidence of learning rather than general impressions.</li>
                    <li>Notice whether the lesson purpose is clear.</li>
                    <li>Look for instructional supports or scaffolds.</li>
                    <li>Write a follow-up question that invites reflection rather than defensiveness.</li>
                  </ul>
                </article>

                <article className="report-card">
                  <h3>Strong Walkthrough Notes Usually Include</h3>
                  <ul className="strong-response-list">
                    <li>Specific student behaviors</li>
                    <li>Evidence connected to the learning goal</li>
                    <li>Teacher moves that support understanding</li>
                    <li>Classroom routines or environmental factors</li>
                    <li>One strength grounded in evidence</li>
                    <li>One reflective, non-accusatory follow-up question</li>
                  </ul>
                </article>

                <article className="report-card">
                  <h3>Walkthrough Evidence Form</h3>
                  <p>
                    Capture objective, non-evaluative evidence from the lesson. All sections are required
                    before continuing.
                  </p>
                  <div className="analysis-grid">
                    {walkthroughFormFields.map((field) => (
                      <div key={field.id}>
                        <label htmlFor={`walkthrough-${field.id}`} className="response-label">
                          {field.label}
                        </label>
                        <p className="analysis-note">{field.prompt}</p>
                        <textarea
                          id={`walkthrough-${field.id}`}
                          rows={4}
                          className="response-input"
                          value={walkthroughResponses[field.id]}
                          onChange={(event) => handleWalkthroughResponseChange(field.id, event.target.value)}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </article>

                <div className="button-row">
                  <button
                    type="button"
                    className="button primary"
                    onClick={handleWalkthroughContinue}
                    disabled={!hasCompletedWalkthroughForm}
                  >
                    Continue
                  </button>
                </div>
              </>
            ) : currentModule === 'lunchClimate' ? (
              <>
                <p className="eyebrow">11:30 AM</p>
                <h2>Lunch & Cafeteria Climate</h2>
                <article className="scenario-preview-card">
                  <p>
                    You head to the cafeteria for two lunch periods because you have been hearing concerns
                    that these periods are becoming rowdy. Lunch is not just supervision — it is school
                    culture in motion.
                  </p>
                  <p>
                    The cafeteria is loud, movement is loose, and several students are testing boundaries.
                    Lunch monitors are trying, but expectations are inconsistent from table to table.
                  </p>
                </article>

                <h3 className="decision-prompt">What do you focus on first?</h3>
                <div className="choices">
                  {lunchClimateDecisionOptions.map((decision) => (
                    <button
                      key={decision}
                      className={`choice ${lunchClimateDecision === decision ? 'active' : ''}`}
                      onClick={() => handleLunchClimateDecisionSelect(decision)}
                    >
                      {decision}
                    </button>
                  ))}
                </div>

                {lunchClimateDecision ? (
                  <article className="decision-consequence-card" aria-live="polite">
                    <h4>{lunchClimateDecisionCoaching[lunchClimateDecision].title}</h4>
                    <p>{lunchClimateDecisionCoaching[lunchClimateDecision].message}</p>
                  </article>
                ) : null}

                {lunchClimateDecision ? (
                  <article className="report-card">
                    <label htmlFor="lunch-monitor-direction-note" className="response-label">
                      Draft a short note to the lunch monitors explaining the next steps for improving
                      cafeteria expectations.
                    </label>
                    <textarea
                      id="lunch-monitor-direction-note"
                      rows={5}
                      className="response-input"
                      placeholder="Write your lunch monitor direction note…"
                      value={lunchMonitorDirectionNote}
                      onChange={(event) => setLunchMonitorDirectionNote(event.target.value)}
                    />
                    <div className="button-row">
                      <button
                        type="button"
                        className="button primary"
                        onClick={handleLunchClimateDirectionContinue}
                        disabled={!lunchMonitorDirectionNote.trim()}
                      >
                        Continue
                      </button>
                    </div>
                  </article>
                ) : null}

                {lunchClimateInsightUnlocked ? (
                  <>
                    <article className="decision-consequence-card" aria-live="polite">
                      <h4>Cafeteria Leadership Insight</h4>
                      <p>{lunchClimateInsightMessage}</p>
                      <ul className="strong-response-list">
                        <li>Did you clarify expectations?</li>
                        <li>Did you support the monitors rather than blame them?</li>
                        <li>Did you identify consistent adult actions?</li>
                        <li>Did you keep the tone calm and practical?</li>
                      </ul>
                    </article>
                    <div className="button-row">
                      <button
                        type="button"
                        className="button primary"
                        onClick={handleLunchClimateContinueDay}
                      >
                        Continue Day
                      </button>
                    </div>
                  </>
                ) : null}
              </>
            ) : currentModule === 'parentEscalation' ? (
              <>
                <p className="eyebrow">1:00 PM</p>
                <h2>Parent Escalation</h2>
                <article className="scenario-preview-card">
                  <p>
                    You finally return to your office after lunch supervision and handling student behavior.
                    Before you can finish documenting what happened, your secretary tells you a parent is
                    already calling.
                  </p>
                  <p>
                    One of the students involved apparently had a cell phone and called home immediately
                    after leaving your office. The parent now has part of the story before you have finished
                    the school&apos;s follow-up.
                  </p>
                </article>

                <article className="report-card voicemail-thread-card">
                  <p className="response-label">Listen to the parent voicemail before deciding your next move.</p>
                  {!parentEscalationVoicemailPlayed ? (
                    <p className="analysis-note">Listen to the voicemail before choosing your first move.</p>
                  ) : null}
                  <h3>Voicemail</h3>
                  <audio
                    controls
                    className="voicemail-audio-player"
                    onPlay={() => setParentEscalationVoicemailPlayed(true)}
                  >
                    <source src="/images/student-fight-vm.mp3" type="audio/mpeg" />
                  </audio>
                </article>

                <h3 className="decision-prompt">What is your first move?</h3>
                <div className="choices">
                  {parentEscalationDecisionOptions.map((decision) => (
                    <button
                      type="button"
                      key={decision}
                      className={`choice ${parentEscalationDecision === decision ? 'active' : ''}`}
                      onClick={() => handleParentEscalationDecisionSelect(decision)}
                    >
                      {decision}
                    </button>
                  ))}
                </div>

                {parentEscalationDecision ? (
                  <article className="decision-consequence-card" aria-live="polite">
                    <h4>{parentEscalationDecisionCoaching[parentEscalationDecision].title}</h4>
                    <p>{parentEscalationDecisionCoaching[parentEscalationDecision].message}</p>
                  </article>
                ) : null}

                {parentEscalationDecision ? (
                  <>
                    <div className="investigation-evidence-grid">
                      {parentEscalationEvidenceCards.map((card) => (
                        <article key={card.title} className="investigation-card">
                          <h3>{card.title}</h3>
                          <p>{card.content}</p>
                        </article>
                      ))}
                    </div>
                    <article className="report-card">
                      <button
                        type="button"
                        className="button secondary"
                        onClick={() => setShowParentEscalationSupportingInfo((prev) => !prev)}
                      >
                        {showParentEscalationSupportingInfo ? '🔎 Hide Supporting Information' : '🔎 View Supporting Information'}
                      </button>
                      {showParentEscalationSupportingInfo ? (
                        <div className="analysis-row">
                          <p className="analysis-lens">Parent Escalation — Supporting Information</p>
                          <p><strong>Incident Snapshot:</strong></p>
                          <ul className="strong-response-list">
                            <li>Two students were involved in a verbal conflict that escalated to minor physical contact during lunch.</li>
                            <li>Staff intervened and brought both students to the office.</li>
                            <li>No serious injuries were reported.</li>
                            <li>The situation was contained quickly.</li>
                          </ul>
                          <p><strong>Student Statements (Preliminary):</strong></p>
                          <ul className="strong-response-list">
                            <li>Students provided conflicting accounts of how the situation started.</li>
                            <li>One student reports being provoked.</li>
                            <li>The other reports responding to repeated comments.</li>
                            <li>Full investigation is still in progress.</li>
                          </ul>
                          <p><strong>Parent Awareness:</strong></p>
                          <ul className="strong-response-list">
                            <li>One student used a cell phone immediately after leaving the office.</li>
                            <li>Parent likely received a partial and emotional version of events.</li>
                            <li>School has not yet made direct contact with the parent.</li>
                          </ul>
                          <p><strong>Staff Input:</strong></p>
                          <ul className="strong-response-list">
                            <li>Lunch monitors report increased noise and crowding during that time.</li>
                            <li>Visibility across groups was limited.</li>
                            <li>Staff responded quickly but did not witness the full lead-up to the conflict.</li>
                          </ul>
                          <p><strong>Process Status:</strong></p>
                          <ul className="strong-response-list">
                            <li>Documentation is not yet complete.</li>
                            <li>Administration is still gathering information.</li>
                            <li>No final decisions or consequences have been communicated.</li>
                          </ul>
                        </div>
                      ) : null}
                    </article>

                    <article className="report-card">
                      <p className="response-label">Draft your response or call-back script to the parent.</p>
                      <label htmlFor="parent-escalation-response" className="response-label">
                        Write your parent response…
                      </label>
                      <textarea
                        id="parent-escalation-response"
                        rows={6}
                        className="response-input"
                        value={parentEscalationResponse}
                        onChange={(event) => setParentEscalationResponse(event.target.value)}
                        required
                      />
                    </article>
                  </>
                ) : null}

                {false && hasParentEscalationDecision && hasParentEscalationResponse ? (
                  <article className="report-card" aria-live="polite">
                    <h3>VIC Writing Assessment</h3>
                    <p className="analysis-note">
                      {(parentEscalationWritingAssessment || liveParentEscalationWritingAssessment).summary}
                    </p>
                    <div className="analysis-grid report-analysis-grid">
                      {(parentEscalationWritingAssessment || liveParentEscalationWritingAssessment).categories.map((category) => (
                        <article key={`parent-escalation-${category.name}`} className="analysis-row report-analysis-row">
                          <div className="report-analysis-header">
                            <p className="analysis-lens">{category.name}</p>
                            <p className={`analysis-status ${category.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {category.status}
                            </p>
                          </div>
                          <p>{category.note}</p>
                        </article>
                      ))}
                    </div>
                  </article>
                ) : null}

                <div className="button-row">
                  <button
                    type="button"
                    className="button primary"
                    onClick={handleParentEscalationContinue}
                    disabled={!hasParentEscalationDecision || !hasParentEscalationResponse}
                  >
                    Continue
                  </button>
                </div>
              </>
            ) : currentModule === 'cafeteriaBoundary' ? (
              <>
                <p className="eyebrow">1:30 PM</p>
                <h2>Cafeteria Boundary Incident</h2>
                <article className="scenario-preview-card">
                  <p>
                    As you are still working through lunch-related issues, you receive another message.
                    This one is different.
                  </p>
                  <p>
                    A cafeteria worker, who is also a parent in the school, has confronted another student
                    during lunch about bullying her own child. The interaction happened in front of other
                    students and staff.
                  </p>
                </article>

                <article className="report-card voicemail-thread-card">
                  <p className="response-label">Listen to the voicemail before deciding your next move.</p>
                  {!cafeteriaBoundaryVoicemailPlayed ? (
                    <p className="analysis-note">
                      Tip: Play the voicemail for context, then choose your first move.
                    </p>
                  ) : null}
                  <h3>Voicemail</h3>
                  <audio
                    controls
                    className="voicemail-audio-player"
                    onPlay={() => setCafeteriaBoundaryVoicemailPlayed(true)}
                  >
                    <source src="/images/cafe-work-vm.mp3" type="audio/mpeg" />
                  </audio>
                </article>

                <h3 className="decision-prompt">What is your first move?</h3>
                <div className="choices">
                  {cafeteriaBoundaryDecisionOptions.map((decision) => (
                    <button
                      key={decision}
                      className={`choice ${cafeteriaBoundaryDecision === decision ? 'active' : ''}`}
                      onClick={() => setCafeteriaBoundaryDecision(decision)}
                    >
                      {decision}
                    </button>
                  ))}
                </div>

                {cafeteriaBoundaryDecision ? (
                  <article className="decision-consequence-card" aria-live="polite">
                    <h4>{cafeteriaBoundaryDecisionCoaching[cafeteriaBoundaryDecision].title}</h4>
                    <p>{cafeteriaBoundaryDecisionCoaching[cafeteriaBoundaryDecision].message}</p>
                  </article>
                ) : null}

                {cafeteriaBoundaryDecision ? (
                  <>
                    <div className="investigation-evidence-grid">
                      {cafeteriaBoundaryEvidenceCards.map((card) => (
                        <article key={card.title} className="investigation-card">
                          <h3>{card.title}</h3>
                          <p>{card.content}</p>
                        </article>
                      ))}
                    </div>

                    <article className="report-card">
                      <button
                        type="button"
                        className="button secondary"
                        onClick={() => setShowCafeteriaBoundarySupportingInfo((prev) => !prev)}
                      >
                        {showCafeteriaBoundarySupportingInfo ? '🔎 Hide Supporting Information' : '🔎 View Supporting Information'}
                      </button>
                      {showCafeteriaBoundarySupportingInfo ? (
                        <div className="analysis-row">
                          <p className="analysis-lens">Cafeteria Boundary Incident — Supporting Information</p>
                          <p><strong>Witness Summary:</strong></p>
                          <ul className="strong-response-list">
                            <li>Multiple students and at least one staff member observed the interaction.</li>
                            <li>The cafeteria worker approached the student directly during lunch.</li>
                            <li>The tone was described as firm and emotionally charged.</li>
                            <li>The interaction drew attention from nearby students.</li>
                          </ul>
                          <p><strong>Student Impact:</strong></p>
                          <ul className="strong-response-list">
                            <li>The student appeared uncomfortable and unsure how to respond.</li>
                            <li>Other students began watching and reacting.</li>
                            <li>The situation disrupted normal cafeteria flow.</li>
                          </ul>
                          <p><strong>Staff Role Expectation:</strong></p>
                          <ul className="strong-response-list">
                            <li>Cafeteria staff are responsible for supervision, not discipline beyond basic redirection.</li>
                            <li>Personal concerns involving their own child should be directed to administration.</li>
                            <li>Staff members are expected to maintain professional boundaries during the school day.</li>
                          </ul>
                          <p><strong>Leadership Considerations:</strong></p>
                          <ul className="strong-response-list">
                            <li>Address the behavior quickly to prevent repetition.</li>
                            <li>Separate the employee role from the parent role clearly.</li>
                            <li>Reinforce expectations without escalating emotion.</li>
                            <li>Maintain a calm, private, and professional tone in the first conversation.</li>
                          </ul>
                        </div>
                      ) : null}
                    </article>

                    <article className="report-card">
                      <p className="response-label">
                        Draft what you would say to the cafeteria worker in your first conversation.
                      </p>
                      <label htmlFor="cafeteria-boundary-response" className="response-label">
                        Write your staff conversation opener…
                      </label>
                      <textarea
                        id="cafeteria-boundary-response"
                        rows={6}
                        className="response-input"
                        value={cafeteriaBoundaryResponse}
                        onChange={(event) => setCafeteriaBoundaryResponse(event.target.value)}
                        required
                      />
                    </article>
                  </>
                ) : null}

                {false && hasCafeteriaBoundaryDecision && hasCafeteriaBoundaryResponse ? (
                  <article className="report-card" aria-live="polite">
                    <h3>VIC Writing Assessment</h3>
                    <p className="analysis-note">
                      {(cafeteriaBoundaryWritingAssessment || liveCafeteriaBoundaryWritingAssessment).summary}
                    </p>
                    <div className="analysis-grid report-analysis-grid">
                      {(cafeteriaBoundaryWritingAssessment || liveCafeteriaBoundaryWritingAssessment).categories.map((category) => (
                        <article key={`cafeteria-boundary-${category.name}`} className="analysis-row report-analysis-row">
                          <div className="report-analysis-header">
                            <p className="analysis-lens">{category.name}</p>
                            <p className={`analysis-status ${category.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {category.status}
                            </p>
                          </div>
                          <p>{category.note}</p>
                        </article>
                      ))}
                    </div>
                  </article>
                ) : null}

                <div className="button-row">
                  <button
                    type="button"
                    className="button primary"
                    onClick={handleCafeteriaBoundaryContinue}
                    disabled={!hasCafeteriaBoundaryDecision || !hasCafeteriaBoundaryResponse}
                  >
                    Continue
                  </button>
                </div>
              </>
            ) : currentModule === 'teacherConflict' ? (
              <>
                <p className="eyebrow">3:15 PM</p>
                <h2>Teacher Conflict</h2>
                <article className="scenario-preview-card">
                  <p>
                    As the day is winding down, your secretary lets you know that two teachers are waiting
                    to speak with you.
                  </p>
                  <p>
                    One teacher is the grade-level team leader. She recently introduced a new academic
                    approach using updated tools and strategies she believes are more efficient and aligned
                    with current expectations.
                  </p>
                  <p>
                    The other teacher is a veteran with many years of experience. She is frustrated and
                    feels the change is unnecessary, stating that her current methods have always worked and
                    that students learn successfully without the new approach.
                  </p>
                  <p>Both teachers are now in your office and want you to support their position.</p>
                </article>

                <h3 className="decision-prompt">What is your first approach to this situation?</h3>
                <div className="choices">
                  {teacherConflictDecisionOptions.map((decision) => (
                    <button
                      type="button"
                      key={decision}
                      className={`choice ${teacherConflictDecision === decision ? 'active' : ''}`}
                      onClick={() => setTeacherConflictDecision(decision)}
                    >
                      {decision}
                    </button>
                  ))}
                </div>

                {teacherConflictDecision ? (
                  <article className="decision-consequence-card" aria-live="polite">
                    <h4>{teacherConflictDecisionCoaching[teacherConflictDecision].title}</h4>
                    <p>{teacherConflictDecisionCoaching[teacherConflictDecision].message}</p>
                  </article>
                ) : null}

                {teacherConflictDecision ? (
                  <>
                    <div className="investigation-evidence-grid">
                      {teacherConflictEvidenceCards.map((card) => (
                        <article key={card.title} className="investigation-card">
                          <h3>{card.title}</h3>
                          <p>{card.content}</p>
                        </article>
                      ))}
                    </div>

                    <article className="report-card">
                      <p className="response-label">
                        Write how you would open this conversation with both teachers.
                      </p>
                      <p className="analysis-note">
                        This is not a decision or final resolution. This is the first moment of leadership
                        in the room.
                      </p>
                      <label htmlFor="teacher-conflict-response" className="response-label">
                        Write your opening statement…
                      </label>
                      <textarea
                        id="teacher-conflict-response"
                        rows={6}
                        className="response-input"
                        value={teacherConflictResponse}
                        onChange={(event) => setTeacherConflictResponse(event.target.value)}
                        required
                      />
                    </article>
                  </>
                ) : null}

                {false && hasTeacherConflictDecision && hasTeacherConflictResponse ? (
                  <article className="report-card" aria-live="polite">
                    <h3>VIC Writing Assessment</h3>
                    <p className="analysis-note">
                      {(teacherConflictWritingAssessment || liveTeacherConflictWritingAssessment).summary}
                    </p>
                    <div className="analysis-grid report-analysis-grid">
                      {(teacherConflictWritingAssessment || liveTeacherConflictWritingAssessment).categories.map((category) => (
                        <article key={`teacher-conflict-${category.name}`} className="analysis-row report-analysis-row">
                          <div className="report-analysis-header">
                            <p className="analysis-lens">{category.name}</p>
                            <p className={`analysis-status ${category.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {category.status}
                            </p>
                          </div>
                          <p>{category.note}</p>
                        </article>
                      ))}
                    </div>
                  </article>
                ) : null}

                <div className="button-row">
                  <button
                    type="button"
                    className="button primary"
                    onClick={handleTeacherConflictContinue}
                    disabled={!hasTeacherConflictDecision || !hasTeacherConflictResponse}
                  >
                    Continue
                  </button>
                </div>
              </>
            ) : currentModule === 'endOfDayEmail' ? (
              isDeskStackLanding ? (
                <>
                  <p className="eyebrow">4:00 PM</p>
                  <h2>End-of-Day Desk Stack</h2>
                  <article className="scenario-preview-card">
                    <p>
                      Your school day is technically over, but your professional responsibilities are not.
                      Before you leave, you need to work through the communications, concerns, and follow-ups
                      still sitting on your desk.
                    </p>
                    <p>
                      At this point in the day, order matters less than completion. Choose what to handle next,
                      keep track of what is still open, and make sure every communication has a response or next
                      step.
                    </p>
                  </article>

                  <div className="desk-stack-grid">
                    {deskStackItems.map((item) => {
                      const status = deskStackStatuses[item.id] || deskStackItemStatuses.notStarted;
                      return (
                        <article key={item.id} className="desk-stack-card">
                          <div className="desk-stack-card-header">
                            <span className={`desk-stack-type-badge ${item.type.toLowerCase()}`}>{item.type}</span>
                            <span className={`desk-stack-status-badge ${status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {status}
                            </span>
                          </div>
                          <h3>{item.title}</h3>
                          <p>{item.description}</p>
                          <button
                            type="button"
                            className="button primary"
                            onClick={() => handleOpenDeskStackItem(item.id)}
                          >
                            Open Case
                          </button>
                        </article>
                      );
                    })}
                  </div>

                  <article className="desk-stack-close-card">
                    <h3>Day Closure</h3>
                    {canCloseDeskStackDay ? (
                      <button type="button" className="button primary" onClick={handleCloseDeskStackDay}>
                        Close the Day
                      </button>
                    ) : (
                      <>
                        <p>
                          You still have {unresolvedRequiredItemCount} unresolved items before the end-of-day review.
                        </p>
                        {unresolvedRequiredDayModules.length ? (
                          <ul className="strong-response-list">
                            {unresolvedRequiredDayModules.map((module) => (
                              <li key={module.id}>{module.label}</li>
                            ))}
                          </ul>
                        ) : null}
                        <p className="analysis-note">
                          Use the timeline above to return to unresolved required scenarios.
                        </p>
                      </>
                    )}
                  </article>
                </>
              ) : currentDeskStackItem === 'studentThreatEmail' ? (
              <>
                <p className="eyebrow">4:18 PM</p>
                <h2>Email: Student Threat Language</h2>

                <article className="scenario-alert-card">
                  <p><strong>Subject:</strong> Concern About Student Safety</p>
                  <p><strong>Type:</strong> Email</p>
                </article>

                <article className="full-email-card">
                  <p>Good afternoon,</p>
                  <p>
                    My child came home very upset today and told me that another student said something
                    threatening to them during school. I am extremely concerned about what was said and how
                    serious this situation is.
                  </p>
                  <p>
                    I need to know what happened and what the school is going to do about it. I expect this to
                    be taken seriously.
                  </p>
                  <p>Please contact me as soon as possible.</p>
                  <p>Thank you.</p>
                </article>

                <h3 className="decision-prompt">What is your first move?</h3>
                <div className="choices">
                  {studentThreatDecisionOptions.map((option) => (
                    <button
                      key={option}
                      className={`choice ${studentThreatDecision === option ? 'active' : ''}`}
                      onClick={() => setStudentThreatDecision(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {hasStudentThreatDecision ? (
                  <article className="decision-consequence-card" aria-live="polite">
                    <h4>{studentThreatDecisionCoaching[studentThreatDecision].title}</h4>
                    <p>{studentThreatDecisionCoaching[studentThreatDecision].message}</p>
                  </article>
                ) : null}

                <div className="investigation-evidence-grid">
                  {studentThreatEvidenceCards.map((card) => (
                    <article key={card.title} className="investigation-card">
                      <h3>{card.title}</h3>
                      <p>{card.content}</p>
                    </article>
                  ))}
                </div>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setShowStudentThreatSupportingInfo((prev) => !prev)}
                >
                  {showStudentThreatSupportingInfo ? '🔎 Hide Supporting Information' : '🔎 View Supporting Information'}
                </button>
                {showStudentThreatSupportingInfo ? (
                  <div className="analysis-row">
                    <p className="analysis-lens">Student Threat Language — Supporting Information</p>
                    <p><strong>Incident Summary:</strong></p>
                    <ul className="strong-response-list">
                      <li>The report involves a statement made by one student toward another during the school day.</li>
                      <li>The comment was reported after the fact and was not directly heard by staff at the moment it occurred.</li>
                      <li>Staff were notified and began follow-up with the students involved.</li>
                    </ul>
                    <p><strong>Student Statements:</strong></p>
                    <ul className="strong-response-list">
                      <li>The student who made the comment stated it was said out of frustration.</li>
                      <li>The reporting student interpreted the comment as serious and felt unsafe.</li>
                      <li>No prior documented conflict exists between the students.</li>
                    </ul>
                    <p><strong>Staff Findings:</strong></p>
                    <ul className="strong-response-list">
                      <li>Multiple students confirmed that a concerning statement was made.</li>
                      <li>Accounts of tone and intent varied among those present.</li>
                      <li>No staff member directly heard the original statement.</li>
                    </ul>
                    <p><strong>Safety Context:</strong></p>
                    <ul className="strong-response-list">
                      <li>The situation has been contained within the school setting.</li>
                      <li>Students are currently supervised and accounted for.</li>
                      <li>No immediate disruption to the broader school environment was reported.</li>
                    </ul>
                  </div>
                ) : null}

                <label htmlFor="student-threat-response" className="response-label">
                  Draft your response to the parent.
                </label>
                <textarea
                  id="student-threat-response"
                  rows={6}
                  className="response-input"
                  placeholder="Write your response…"
                  value={studentThreatResponse}
                  onChange={(event) => setStudentThreatResponse(event.target.value)}
                />

                {false && studentThreatWritingAssessment ? (
                  <article className="report-card" aria-live="polite">
                    <h3>VIC Writing Assessment</h3>
                    <p className="analysis-note">{studentThreatWritingAssessment.summary}</p>
                    <div className="analysis-grid report-analysis-grid">
                      {studentThreatWritingAssessment.categories.map((category) => (
                        <article key={`student-threat-${category.name}`} className="analysis-row report-analysis-row">
                          <div className="report-analysis-header">
                            <p className="analysis-lens">{category.name}</p>
                            <p className={`analysis-status ${category.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {category.status}
                            </p>
                          </div>
                          <p>{category.note}</p>
                        </article>
                      ))}
                    </div>
                  </article>
                ) : null}

                <div className="button-row">
                  <button
                    type="button"
                    className="button primary"
                    onClick={handleStudentThreatContinue}
                    disabled={!hasStudentThreatDecision || !hasStudentThreatResponse}
                  >
                    Continue
                  </button>
                </div>
              </>
              ) : currentDeskStackItem === 'academicDeclineEmail' ? (
              <>
                <p className="eyebrow">4:20 PM</p>
                <h2>Email: Academic Decline Concern</h2>

                <article className="scenario-alert-card">
                  <p><strong>Subject:</strong> Concern About Academic Performance</p>
                  <p><strong>Type:</strong> Email</p>
                </article>

                <article className="full-email-card">
                  <p>Good afternoon,</p>
                  <p>
                    I am reaching out because I am concerned about my child&apos;s recent grades. Up until this
                    point, they have always done well in school, but over the last few weeks I have noticed a
                    significant drop in performance.
                  </p>
                  <p>
                    Assignments that were usually completed on time are now missing, and grades have dropped in
                    multiple areas. I am not sure what has changed, but I would like to understand what is going on.
                  </p>
                  <p>
                    Can you please help me understand what is happening and what we can do to support my child
                    moving forward?
                  </p>
                  <p>Thank you.</p>
                </article>

                <h3 className="decision-prompt">What is your first move?</h3>
                <div className="choices">
                  {academicDeclineDecisionOptions.map((option) => (
                    <button
                      key={option}
                      className={`choice ${academicDeclineDecision === option ? 'active' : ''}`}
                      onClick={() => setAcademicDeclineDecision(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {hasAcademicDeclineDecision ? (
                  <article className="decision-consequence-card" aria-live="polite">
                    <h4>{academicDeclineDecisionCoaching[academicDeclineDecision].title}</h4>
                    <p>{academicDeclineDecisionCoaching[academicDeclineDecision].message}</p>
                  </article>
                ) : null}

                <div className="investigation-evidence-grid">
                  {academicDeclineEvidenceCards.map((card) => (
                    <article key={card.title} className="investigation-card">
                      <h3>{card.title}</h3>
                      <p>{card.content}</p>
                    </article>
                  ))}
                </div>

                <article className="report-card">
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => setShowAcademicDeclineSupportingInfo((prev) => !prev)}
                  >
                    {showAcademicDeclineSupportingInfo ? '🔎 Hide Supporting Information' : '🔎 View Supporting Information'}
                  </button>
                  {showAcademicDeclineSupportingInfo ? (
                    <div className="analysis-row">
                      <p className="analysis-lens">Academic Decline — Supporting Information</p>
                      <p><strong>Academic Data Snapshot:</strong></p>
                      <ul className="strong-response-list">
                        <li>Over the past 3–4 weeks, the student&apos;s grades have declined across multiple subject areas.</li>
                        <li>Missing assignments have increased, particularly in independent work and homework.</li>
                        <li>Assessment scores show a drop from earlier performance levels.</li>
                        <li>Participation during class activities has become less consistent.</li>
                      </ul>
                      <p><strong>Teacher Observations:</strong></p>
                      <ul className="strong-response-list">
                        <li>The student has been less engaged during lessons and group work.</li>
                        <li>Work completion during class time has slowed.</li>
                        <li>The student occasionally appears distracted or off-task.</li>
                        <li>No major behavior concerns have been reported.</li>
                      </ul>
                      <p><strong>Instructional Changes:</strong></p>
                      <ul className="strong-response-list">
                        <li>The class recently transitioned into a more independent and application-based unit.</li>
                        <li>Assignments now require sustained focus and multi-step thinking.</li>
                        <li>Expectations have increased slightly in workload and pacing.</li>
                      </ul>
                      <p><strong>Support Strategies in Place:</strong></p>
                      <ul className="strong-response-list">
                        <li>Teacher has provided reminders and check-ins during class.</li>
                        <li>Opportunities for extra help have been offered.</li>
                        <li>Some assignments have been re-explained or broken into smaller steps.</li>
                        <li>The teacher has spoken with the student about missing work.</li>
                      </ul>
                      <p><strong>Pattern Considerations:</strong></p>
                      <ul className="strong-response-list">
                        <li>The change has occurred gradually over several weeks.</li>
                        <li>The decline is consistent across more than one subject.</li>
                        <li>No single cause has been identified at this time.</li>
                      </ul>
                    </div>
                  ) : null}
                </article>

                <label htmlFor="academic-decline-response" className="response-label">
                  Draft your response to the parent.
                </label>
                <textarea
                  id="academic-decline-response"
                  rows={6}
                  className="response-input"
                  placeholder="Write your response…"
                  value={academicDeclineResponse}
                  onChange={(event) => setAcademicDeclineResponse(event.target.value)}
                />

                {false && academicDeclineWritingAssessment ? (
                  <article className="report-card" aria-live="polite">
                    <h3>VIC Writing Assessment</h3>
                    <p className="analysis-note">
                      {(academicDeclineWritingAssessment || liveAcademicDeclineWritingAssessment).summary}
                    </p>
                    <div className="analysis-grid report-analysis-grid">
                      {(academicDeclineWritingAssessment || liveAcademicDeclineWritingAssessment).categories.map((category) => (
                        <article key={`academic-decline-${category.name}`} className="analysis-row report-analysis-row">
                          <div className="report-analysis-header">
                            <p className="analysis-lens">{category.name}</p>
                            <p className={`analysis-status ${category.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {category.status}
                            </p>
                          </div>
                          <p>{category.note}</p>
                        </article>
                      ))}
                    </div>
                  </article>
                ) : null}

                <div className="button-row">
                  <button
                    type="button"
                    className="button primary"
                    onClick={handleAcademicDeclineContinue}
                    disabled={!hasAcademicDeclineDecision || !hasAcademicDeclineResponse}
                  >
                    Continue
                  </button>
                </div>
              </>
              ) : currentDeskStackItem === 'ptoTalentShowEmail' ? (
              <>
                <p className="eyebrow">4:22 PM</p>
                <h2>Email: PTO / Talent Show Conflict</h2>

                <article className="scenario-alert-card">
                  <p><strong>Subject:</strong> Talent Show Concerns</p>
                  <p><strong>Type:</strong> Email</p>
                </article>

                <article className="full-email-card">
                  <p>Dr. Principal,</p>
                  <p>
                    I am writing because I am extremely frustrated with how the talent show planning has gone. I
                    volunteered because I wanted to help raise money for the school and create something fun for
                    the students, but I feel like I have run into roadblock after roadblock.
                  </p>
                  <p>
                    I have been waiting for dates, guidance, and clear answers. I tried to work with the PTO and
                    staff, but it feels like no one really wanted this event to happen. At this point, I am done
                    with the talent show, fundraising, and the hospitality committee.
                  </p>
                  <p>
                    I love this school and I care about the students, but PTO is not for everyone. I will still
                    help the kids and the community when I can, but I do not want to keep fighting to be involved.
                  </p>
                  <p>Thank you for your time.</p>
                </article>

                <h3 className="decision-prompt">What is your first move?</h3>
                <div className="choices">
                  {ptoTalentShowDecisionOptions.map((option) => (
                    <button
                      key={option}
                      className={`choice ${ptoTalentShowDecision === option ? 'active' : ''}`}
                      onClick={() => setPtoTalentShowDecision(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {hasPtoTalentShowDecision ? (
                  <article className="decision-consequence-card" aria-live="polite">
                    <h4>{ptoTalentShowDecisionCoaching[ptoTalentShowDecision].title}</h4>
                    <p>{ptoTalentShowDecisionCoaching[ptoTalentShowDecision].message}</p>
                  </article>
                ) : null}

                <div className="investigation-evidence-grid">
                  {ptoTalentShowEvidenceCards.map((card) => (
                    <article key={card.title} className="investigation-card">
                      <h3>{card.title}</h3>
                      <p>{card.content}</p>
                    </article>
                  ))}
                </div>

                <label htmlFor="pto-talent-show-response" className="response-label">
                  Draft your response to the parent volunteer.
                </label>
                <textarea
                  id="pto-talent-show-response"
                  rows={6}
                  className="response-input"
                  placeholder="Write your response…"
                  value={ptoTalentShowResponse}
                  onChange={(event) => setPtoTalentShowResponse(event.target.value)}
                />

                {false && ptoTalentShowWritingAssessment ? (
                  <article className="report-card" aria-live="polite">
                    <h3>VIC Writing Assessment</h3>
                    <p className="analysis-note">{ptoTalentShowWritingAssessment.summary}</p>
                    <div className="analysis-grid report-analysis-grid">
                      {ptoTalentShowWritingAssessment.categories.map((category) => (
                        <article key={`pto-talent-show-${category.name}`} className="analysis-row report-analysis-row">
                          <div className="report-analysis-header">
                            <p className="analysis-lens">{category.name}</p>
                            <p className={`analysis-status ${category.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {category.status}
                            </p>
                          </div>
                          <p>{category.note}</p>
                        </article>
                      ))}
                    </div>
                  </article>
                ) : null}

                <div className="button-row">
                  <button
                    type="button"
                    className="button primary"
                    onClick={handlePtoTalentShowContinue}
                    disabled={!hasPtoTalentShowDecision || !hasPtoTalentShowResponse}
                  >
                    Continue
                  </button>
                </div>
              </>
              ) : currentDeskStackItem === 'recessInjuryEmail' ? (
              <>
                <p className="eyebrow">4:25 PM</p>
                <h2>Email: Recess Injury / Liability Concern</h2>

                <article className="scenario-alert-card">
                  <p><strong>Subject:</strong> Recess Injury Documentation Request</p>
                  <p><strong>Type:</strong> Email</p>
                </article>

                <article className="full-email-card">
                  <p>Mr. Principal,</p>
                  <p>
                    As you may be aware, my son Fred fell last week during recess and hit his head on the pavement.
                    I was told he was playing football and following the recess rules, but another student pushed or
                    tackled him, causing him to fall.
                  </p>
                  <p>
                    When the nurse contacted me, Fred was in the office with ice on his head. Fred told me the other
                    student involved was Henry.
                  </p>
                  <p>
                    I have been advised to request documentation from the school, including when the incident
                    occurred, the circumstances of the incident, and the names of the students involved. I am
                    requesting this as a precaution because the effects of head trauma may not always be immediately
                    clear.
                  </p>
                  <p>
                    I will also be sending a copy of the medical co-payment related to Fred’s treatment. I am asking
                    that the school forward the bill to Henry’s parents because this expense would not have occurred
                    if their son had followed the rules.
                  </p>
                  <p>
                    Please contact me as soon as possible. I would prefer to deal directly with you on this matter.
                  </p>
                  <p>Thank you.</p>
                </article>

                <h3 className="decision-prompt">What is your first move?</h3>
                <div className="choices">
                  {recessInjuryDecisionOptions.map((option) => (
                    <button
                      key={option}
                      className={`choice ${recessInjuryDecision === option ? 'active' : ''}`}
                      onClick={() => setRecessInjuryDecision(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {hasRecessInjuryDecision ? (
                  <article className="decision-consequence-card" aria-live="polite">
                    <h4>{recessInjuryDecisionCoaching[recessInjuryDecision].title}</h4>
                    <p>{recessInjuryDecisionCoaching[recessInjuryDecision].message}</p>
                  </article>
                ) : null}

                <div className="investigation-evidence-grid">
                  {recessInjuryEvidenceCards.map((card) => (
                    <article key={card.title} className="investigation-card">
                      <h3>{card.title}</h3>
                      <p>{card.content}</p>
                    </article>
                  ))}
                </div>

                <article className="report-card">
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => setShowRecessInjurySupportingInfo((prev) => !prev)}
                  >
                    {showRecessInjurySupportingInfo ? '🔎 Hide Supporting Information' : '🔎 View Supporting Information'}
                  </button>
                  {showRecessInjurySupportingInfo ? (
                    <div className="analysis-row">
                      <p className="analysis-lens">Recess Injury — Supporting Information</p>
                      <p><strong>Incident Report Summary:</strong></p>
                      <ul className="strong-response-list">
                        <li>The incident occurred during scheduled recess while students were engaged in active play.</li>
                        <li>A student fell and hit their head during the activity.</li>
                        <li>Staff were supervising the area and responded immediately.</li>
                        <li>The student was escorted to the nurse.</li>
                      </ul>
                      <p><strong>Nurse Documentation:</strong></p>
                      <ul className="strong-response-list">
                        <li>The student was evaluated by the school nurse.</li>
                        <li>Ice was applied and the student was monitored.</li>
                        <li>The parent was contacted promptly.</li>
                        <li>No immediate signs of severe injury were observed at the time.</li>
                      </ul>
                      <p><strong>Staff Observations:</strong></p>
                      <ul className="strong-response-list">
                        <li>The situation occurred during active play involving multiple students.</li>
                        <li>Accounts differ regarding whether the contact was intentional or incidental.</li>
                        <li>No clear determination of fault has been established.</li>
                      </ul>
                      <p><strong>Documentation Status:</strong></p>
                      <ul className="strong-response-list">
                        <li>An official incident/accident report has been completed.</li>
                        <li>The report includes time, location, supervision, and general circumstances.</li>
                        <li>The report does NOT include identifying information about other students.</li>
                      </ul>
                      <p><strong>Confidentiality Guidelines:</strong></p>
                      <ul className="strong-response-list">
                        <li>The school cannot share the names or personal information of other students.</li>
                        <li>Student involvement or discipline cannot be discussed with other families.</li>
                        <li>Communication must follow student privacy requirements and district procedures.</li>
                      </ul>
                      <p><strong>Liability Boundaries:</strong></p>
                      <ul className="strong-response-list">
                        <li>The school does not assign financial responsibility between families.</li>
                        <li>The school does not forward medical bills to other families.</li>
                        <li>Any financial or legal concerns must be handled outside of the school process.</li>
                      </ul>
                      <p><strong>Important:</strong></p>
                      <ul className="strong-response-list">
                        <li>Do NOT include names of other students.</li>
                        <li>Do NOT include assignment of fault.</li>
                        <li>Do NOT include payment commitments.</li>
                        <li>Do NOT include legal conclusions.</li>
                      </ul>
                      <p>The purpose of this section is to provide information only, not resolution.</p>
                    </div>
                  ) : null}
                </article>

                <label htmlFor="recess-injury-response" className="response-label">
                  Draft your response to the parent.
                </label>
                <textarea
                  id="recess-injury-response"
                  rows={7}
                  className="response-input"
                  placeholder="Write your response…"
                  value={recessInjuryResponse}
                  onChange={(event) => setRecessInjuryResponse(event.target.value)}
                />

                {false && recessInjuryWritingAssessment ? (
                  <article className="report-card" aria-live="polite">
                    <h3>VIC Writing Assessment</h3>
                    <p className="analysis-note">{(recessInjuryWritingAssessment || liveRecessInjuryWritingAssessment).summary}</p>
                    <div className="analysis-grid report-analysis-grid">
                      {(recessInjuryWritingAssessment || liveRecessInjuryWritingAssessment).categories.map((category) => (
                        <article key={`recess-injury-${category.name}`} className="analysis-row report-analysis-row">
                          <div className="report-analysis-header">
                            <p className="analysis-lens">{category.name}</p>
                            <p className={`analysis-status ${category.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {category.status}
                            </p>
                          </div>
                          <p>{category.note}</p>
                        </article>
                      ))}
                    </div>
                  </article>
                ) : null}

                <div className="button-row">
                  <button
                    type="button"
                    className="button primary"
                    onClick={handleRecessInjuryContinue}
                    disabled={!hasRecessInjuryDecision || !hasRecessInjuryResponse}
                  >
                    Continue
                  </button>
                </div>
              </>
              ) : currentDeskStackItem === 'studentRemovalVoicemail' ? (
              <>
                <p className="eyebrow">4:31 PM</p>
                <h2>Voicemail: Student Removal From Class</h2>

                <article className="report-card voicemail-thread-card">
                  <p className="response-label">Listen to the voicemail before deciding your next move.</p>
                  <h3>Voicemail</h3>
                  <audio controls className="voicemail-audio-player">
                    <source src="/images/student-removal-class-vm.mp3" type="audio/mpeg" />
                  </audio>
                </article>

                <h3 className="decision-prompt">What is your first move?</h3>
                <div className="choices">
                  {studentRemovalDecisionOptions.map((option) => (
                    <button
                      key={option}
                      className={`choice ${studentRemovalDecision === option ? 'active' : ''}`}
                      onClick={() => setStudentRemovalDecision(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {hasStudentRemovalDecision ? (
                  <article className="decision-consequence-card" aria-live="polite">
                    <h4>{studentRemovalDecisionCoaching[studentRemovalDecision].title}</h4>
                    <p>{studentRemovalDecisionCoaching[studentRemovalDecision].message}</p>
                  </article>
                ) : null}

                {hasStudentRemovalDecision ? (
                  <>
                    <div className="investigation-evidence-grid">
                      {studentRemovalEvidenceCards.map((card) => (
                        <article key={card.title} className="investigation-card">
                          <h3>{card.title}</h3>
                          <p>{card.content}</p>
                        </article>
                      ))}
                    </div>

                    <article className="report-card">
                      <p className="response-label">
                        Before responding to the teacher, outline the information you need and how you will gather it.
                      </p>
                      <label htmlFor="student-removal-response" className="response-label">
                        What questions do you need answered by the teacher, and what steps will you take to understand the
                        situation before making a decision?
                      </label>
                      <p className="response-label">Focus on:</p>
                      <ul className="response-label">
                        <li>Questions about the student’s behavior pattern</li>
                        <li>What strategies have already been attempted</li>
                        <li>When and where the behavior occurs most often</li>
                        <li>What support the teacher may need</li>
                        <li>How you will observe, review, or follow up before deciding on removal</li>
                      </ul>
                      <textarea
                        id="student-removal-response"
                        rows={6}
                        className="response-input"
                        value={studentRemovalResponse}
                        onChange={(event) => setStudentRemovalResponse(event.target.value)}
                        required
                      />
                    </article>
                  </>
                ) : null}

                {false && hasStudentRemovalDecision && hasStudentRemovalResponse ? (
                  <article className="report-card" aria-live="polite">
                    <h3>VIC Writing Assessment</h3>
                    <p className="analysis-note">
                      {(studentRemovalWritingAssessment || liveStudentRemovalWritingAssessment).summary}
                    </p>
                    <div className="analysis-grid report-analysis-grid">
                      {(studentRemovalWritingAssessment || liveStudentRemovalWritingAssessment).categories.map((category) => (
                        <article key={`student-removal-${category.name}`} className="analysis-row report-analysis-row">
                          <div className="report-analysis-header">
                            <p className="analysis-lens">{category.name}</p>
                            <p className={`analysis-status ${category.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {category.status}
                            </p>
                          </div>
                          <p>{category.note}</p>
                        </article>
                      ))}
                    </div>
                  </article>
                ) : null}

                <div className="button-row">
                  <button
                    type="button"
                    className="button primary"
                    onClick={handleStudentRemovalContinue}
                    disabled={!hasStudentRemovalDecision || !hasStudentRemovalResponse}
                  >
                    Continue
                  </button>
                </div>
              </>
              ) : isReportScene && allRequiredModulesComplete ? (
              <>
                <p className="eyebrow">End-of-Day Leadership Review</p>
                <div className="vic-report-header">
                  <div>
                    <h2>Your Leadership Evaluation Report</h2>
                    <p className="report-subtitle">Generated from your decisions and responses during the simulation.</p>
                  </div>
                  <div className="vic-badge">
                    <p>Powered by VIC</p>
                    <small>AI Co-Teacher & Leadership Evaluation System</small>
                  </div>
                </div>
                <div className="button-row no-print report-actions-top">
                  <button type="button" className="button primary" onClick={() => window.print()}>Download / Print Report</button>
                  <button type="button" className="button secondary" onClick={handleStartOver}>Start New Simulation</button>
                </div>
                {isGeneratingEvaluation ? <article className="report-card"><p>Generating your leadership evaluation report…</p></article> : null}
                {evaluationErrorMessage ? <article className="report-card"><p>{evaluationErrorMessage}</p></article> : null}
                <article className="report-card no-print">
                  <h3>Diagnostics</h3>
                  <p><strong>Evaluation Source:</strong> {reportData.evaluationSource || 'unknown'}</p>
                  <p><strong>Evaluation Confidence:</strong> {reportData.evaluationConfidence || 'unknown'}</p>
                  <p><strong>API Status:</strong> {reportData.apiStatus || 'error'}</p>
                </article>
                <section className="report-scorecard-grid">
                  <article className="report-card tone-blue"><h3>Overall Readiness</h3><p className="score-big">{reportData.overallReadinessScore}/100</p></article>
                  <article className="report-card tone-amber"><h3>Readiness Level</h3><p>{reportData.readinessLevel}</p></article>
                  <article className="report-card tone-blue"><h3>Candidate Profile</h3><p>{reportData.candidateProfile}</p></article>
                  <article className="report-card tone-green"><h3>Completed Scenarios</h3><p>{fullSimulationFirstMoveDecisions.length}</p></article>
                  <article className="report-card tone-blue"><h3>Written Responses Analyzed</h3><p>{totalWrittenResponses}</p></article>
                  <article className="report-card tone-blue"><h3>Primary Leadership Style</h3><p>{reportData.primaryLeadershipStyle}</p></article>
                </section>
                <section className="report-scorecard-grid">
                  <article className="report-card tone-green"><h3>Trust Builder</h3><p>{reportData.snapshot?.trustBuilder}</p></article>
                  <article className="report-card tone-amber"><h3>Decision Speed</h3><p>{reportData.snapshot?.decisionSpeed}</p></article>
                  <article className="report-card tone-red"><h3>Authority Under Pressure</h3><p>{reportData.snapshot?.authorityUnderPressure}</p></article>
                  <article className="report-card tone-blue"><h3>Operational Execution</h3><p>{reportData.snapshot?.operationalExecution}</p></article>
                </section>
                <article className="report-card report-intro"><h3>Signature Leadership Insight</h3><p>{reportData.signatureLeadershipInsight}</p></article>
                <section className="report-scorecard-grid">
                  <article className="report-card"><h3>Strengths</h3><ul className="strong-response-list">{(reportData.strengths || []).map((item) => <li key={item}>{item}</li>)}</ul></article>
                  <article className="report-card"><h3>Growth Areas</h3><ul className="strong-response-list">{(reportData.growthAreas || []).map((item) => <li key={item}>{item}</li>)}</ul></article>
                </section>
                <article className="report-card"><h3>Communication & Leadership Voice</h3><p>{reportData.communicationLeadershipVoice}</p></article>
                <article className="report-card"><h3>School Climate & Culture Impact</h3><ul className="strong-response-list">{(reportData.schoolClimateCultureImpact || []).map((item) => <li key={item.label}><strong>{item.label} — {item.rating}:</strong> {item.insight}</li>)}</ul></article>
                <article className="report-card"><h3>Crisis & Risk Leadership</h3><p>{reportData.crisisRiskLeadership}</p></article>
                <article className="report-card"><h3>Leadership Readiness Summary</h3><p>{reportData.leadershipReadinessSummary}</p></article>
                <article className="report-card"><h3>Predicted First 90 Days Impact</h3><p>{reportData.predictedFirst90DaysImpact}</p></article>
                <article className="report-card"><h3>Recommended Follow-Up Questions</h3><ul className="strong-response-list">{(reportData.recommendedFollowUpQuestions || []).map((item) => <li key={item}>{item}</li>)}</ul></article></>
              ) : isReportScene ? (
              <>
                <p className="eyebrow">End-of-Day Review Locked</p>
                <h2>Complete Remaining Scenarios</h2>
                <article className="report-card">
                  <p>
                    You still have {unresolvedRequiredItemCount} unresolved items before the end-of-day review.
                  </p>
                  <ul className="strong-response-list">
                    {unresolvedRequiredDayModules.map((module) => (
                      <li key={module.id}>{module.label}</li>
                    ))}
                  </ul>
                  <p className="analysis-note">
                    Use the timeline above to return to unresolved required scenarios.
                  </p>
                </article>
              </>
              ) : !isInvestigationScene ? (
              <>
                {hasSelectedDecision ? (
                  <div className="compact-scene-header">
                    <p className="eyebrow">4:12 PM — The Email You Cannot Ignore</p>
                  </div>
                ) : (
                  <>
                    <p className="eyebrow">4:12 PM</p>
                    <h2>The Email You Cannot Ignore</h2>
                  </>
                )}

                <div className={`cinematic-block ${hasSelectedDecision ? 'compact' : ''}`}>
                  <p className="cinematic-opening">The building is quieter now, but your day is not over.</p>
                  {!hasSelectedDecision ? (
                    <>
                      <p className="cinematic-opening">You finally sit down at your desk and open your inbox.</p>
                      <p className="cinematic-opening">One message immediately stands out.</p>
                      <p className="cinematic-opening strong">It is emotional.</p>
                      <p className="cinematic-opening strong">It is angry.</p>
                      <p className="cinematic-opening strong">It is about a child who feels humiliated.</p>
                    </>
                  ) : null}
                </div>

                <article className="scenario-alert-card">
                  <p><strong>Subject:</strong> Concern Regarding My Daughter</p>
                  <p><strong>Tone Detected:</strong> Escalation Risk — High</p>
                  <p><strong>Leadership Pressure:</strong> Parent trust, student dignity, staff accountability</p>
                </article>

                {!hasSelectedDecision ? (
                  <article className="scenario-preview-card">
                    <p>
                      A parent believes her daughter was publicly excluded from a class pizza party because
                      of academic performance. The child already receives reading support and now feels
                      embarrassed, ashamed, and less capable than her peers.
                    </p>
                    <p>
                      The parent is angry, questioning the school&apos;s judgment, and threatening to escalate
                      beyond the building level.
                    </p>
                  </article>
                ) : null}

                {!hasSelectedDecision ? (
                  <>
                    <h3 className="decision-prompt">
                      After reviewing the parent&apos;s concern, what is your first leadership move?
                    </h3>
                    <div className="choices">
                      {Object.keys(decisionToFolderItem).map((decision) => (
                        <button
                          key={decision}
                          className={`choice ${firstDecision === decision ? 'active' : ''}`}
                          onClick={() => handleDecision(decision)}
                        >
                          {decision}
                        </button>
                      ))}
                    </div>
                  </>
                ) : null}

                {!hasSelectedDecision ? (
                  <div className="button-row decision-support-row">
                    <button type="button" className="button secondary" onClick={() => setIsVicOpen(true)}>
                      Ask VIC for Guidance
                    </button>
                  </div>
                ) : null}

                {hasSelectedDecision ? (
                  <>
                    <div className="selected-decision-chip" role="status" aria-live="polite">
                      <span className="selected-decision-label">Your first move:</span> {firstDecision}
                    </div>

                    {selectedConsequence ? (
                      <article className="decision-consequence-card" aria-live="polite">
                        <p className="decision-consequence-kicker">Leadership Coaching Lens</p>
                        <p className="decision-consequence-subhead">
                          <span className="decision-consequence-marker" aria-hidden="true">
                            ●
                          </span>
                          Direct coaching based on your first move.
                        </p>
                        <h4>{selectedConsequence.title}</h4>
                        <p>{selectedConsequence.message}</p>
                        <p className="decision-consequence-takeaway">
                          <strong>Leadership takeaway:</strong> {selectedConsequence.takeaway}
                        </p>
                        <p className="decision-consequence-vic-note">
                          VIC guidance will build on this coaching layer by analyzing tone, urgency, and next
                          steps.
                        </p>
                      </article>
                    ) : null}
                  </>
                ) : null}

                {showInitialParentResponse && !isInvestigationScene ? (
                  <>
                    <label htmlFor="leadership-initial-response" className="response-label">
                      Draft your response to this parent…
                    </label>
                    <textarea
                      id="leadership-initial-response"
                      rows={6}
                      className="response-input"
                      placeholder="Capture your acknowledgment, immediate next steps, and follow-up timeline."
                      value={initialParentResponse}
                      onChange={(event) => setInitialParentResponse(event.target.value)}
                    />
                  </>
                ) : null}
              </>
              ) : (
              <>
                <div className="compact-scene-header">
                  <p className="eyebrow">4:28 PM</p>
                </div>
                <h2>Gathering the Other Side of the Story</h2>
                <article className="investigation-intro-card">
                  <p>
                    Before giving a full response, you gather context from the teacher and review what happened.
                    The situation is more layered than the parent&apos;s email suggested.
                  </p>
                </article>
                <div className="investigation-evidence-grid">
                  <article className="investigation-card">
                    <h3>Reward Structure</h3>
                    <p>
                      The activity was participation-based, not accuracy-based. Students who attempted the
                      challenge were included in the reward.
                    </p>
                  </article>
                  <article className="investigation-card">
                    <h3>Student Context</h3>
                    <p>
                      Sue was given the opportunity to participate but did not attempt the activity. According to
                      the teacher, she would have been included if she had tried.
                    </p>
                  </article>
                  <article className="investigation-card">
                    <h3>Parent Perspective</h3>
                    <p>
                      The parent&apos;s concern appears to be based on a limited understanding of what occurred
                      during the activity.
                    </p>
                  </article>
                  <article className="investigation-card">
                    <h3>Leadership Consideration</h3>
                    <p>
                      While the structure was designed around participation, the outcome still felt exclusionary
                      to the student, which contributed to the parent&apos;s concern.
                    </p>
                  </article>
                </div>

                <h3 className="decision-prompt">How do you want to proceed?</h3>
                <div className="choices">
                  {investigationOptions.map((option) => (
                    <button
                      key={option}
                      className={`choice ${investigationDecision === option ? 'active' : ''}`}
                      onClick={() => {
                        setInvestigationDecision(option);
                        completeFolderItems([investigationFolderItem]);
                        addFolderItems({
                          red: [
                            'Document parent concern',
                            option === 'Discuss the situation with the teacher'
                              ? 'Speak with teacher immediately'
                              : 'Respond to parent with care and clear timeline',
                          ],
                          orange: ['Follow up with parent within 48 hours'],
                        });
                        scrollToTop();
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {investigationDecision ? (
                  <>
                    <div className="selected-decision-chip" role="status" aria-live="polite">
                      <span className="selected-decision-label">Selected path:</span> {investigationDecision}
                    </div>
                    <article className="decision-next-step-panel" aria-live="polite">
                      <p className="decision-next-step-kicker">Decision Impact</p>
                      <p>{investigationGuidanceCopy[investigationDecision]}</p>
                    </article>
                  </>
                ) : null}

                {showFinalParentResponse ? (
                  <>
                    <p className="response-label">
                      Regardless of the path you chose, the parent still needs a clear response. Use what you
                      learned to acknowledge the concern, clarify the facts, and explain the next step.
                    </p>
                    <label htmlFor="leadership-response" className="response-label">
                      Draft your full response to the parent…
                    </label>
                    <textarea
                      id="leadership-response"
                      rows={6}
                      className="response-input"
                      placeholder="Capture your communication strategy, immediate next steps, and your follow-up timeline."
                      value={finalParentResponse}
                      onChange={(event) => setFinalParentResponse(event.target.value)}
                    />
                  </>
                ) : null}

              </>
            )
            ) : (
              <article className="scenario-preview-card">
                <p>This module is coming soon.</p>
              </article>
            )}

            {currentModule === 'endOfDayEmail'
            && currentDeskStackItem === 'rewardConcern'
            && !isInvestigationScene
            && !isReportScene ? (
              <button
                type="button"
                className="button secondary reveal-email-button"
                onClick={() => setIsEmailVisible((prev) => !prev)}
              >
                {isEmailVisible ? 'Hide Full Email' : 'Reveal Full Email'}
              </button>
            ) : null}

            {currentModule === 'endOfDayEmail'
            && currentDeskStackItem === 'rewardConcern'
            && !isInvestigationScene
            && !isReportScene ? (
              <article className="report-card">
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setShowRewardConcernSupportingInfo((prev) => !prev)}
                >
                  {showRewardConcernSupportingInfo ? '🔎 Hide Supporting Information' : '🔎 View Supporting Information'}
                </button>
                {showRewardConcernSupportingInfo ? (
                  <div className="analysis-row">
                    <p className="analysis-lens">Parent Concern — Supporting Information</p>
                    <p><strong>Teacher Explanation:</strong></p>
                    <ul className="strong-response-list">
                      <li>The pizza activity was based on participation in a class activity, not academic performance.</li>
                      <li>Students who completed the activity were invited to participate.</li>
                      <li>Sue chose not to complete the activity, along with one other student.</li>
                      <li>The teacher reports that expectations were clearly explained ahead of time.</li>
                    </ul>
                    <p><strong>Student Context:</strong></p>
                    <ul className="strong-response-list">
                      <li>Sue is currently receiving reading intervention support.</li>
                      <li>She has shown inconsistent effort during independent and practice tasks.</li>
                      <li>On this occasion, she did not engage in the required activity.</li>
                      <li>Another student also chose not to participate and did not attend the activity.</li>
                    </ul>
                    <p><strong>Classroom Practice Review:</strong></p>
                    <ul className="strong-response-list">
                      <li>The activity was structured around participation, not ability or achievement.</li>
                      <li>Students were aware of expectations ahead of time.</li>
                      <li>While not intended to exclude, the visible separation created unintended social impact.</li>
                    </ul>
                    <p><strong>Impact Observed:</strong></p>
                    <ul className="strong-response-list">
                      <li>Sue reported feeling embarrassed after not participating.</li>
                      <li>The parent received a partial and emotionally framed version of events.</li>
                      <li>The situation escalated due to a mismatch between perception and actual classroom practice.</li>
                    </ul>
                    <p><strong>Leadership Action Taken:</strong></p>
                    <ul className="strong-response-list">
                      <li>Met with the teacher to review the situation.</li>
                      <li>Confirmed that participation—not performance—was the basis for inclusion.</li>
                      <li>Discussed how reward structures can create unintended emotional responses.</li>
                      <li>Reinforced expectations for minimizing visible exclusion.</li>
                    </ul>
                    <p><strong>Next Steps:</strong></p>
                    <ul className="strong-response-list">
                      <li>Teacher will continue participation-based expectations with clearer framing.</li>
                      <li>Alternative recognition methods will be explored to reduce visible separation.</li>
                      <li>Administration will monitor classroom practices.</li>
                      <li>Parent communication will clarify expectations and reinforce student support.</li>
                    </ul>
                  </div>
                ) : null}
              </article>
            ) : null}

            {currentModule === 'endOfDayEmail'
            && currentDeskStackItem === 'rewardConcern'
            && isEmailVisible
            && !isInvestigationScene
            && !isReportScene ? (
              <article className="full-email-card">
                <p className="full-email-greeting">Dear Mr. Principal,</p>
                <p>
                  My daughter Sue was excluded from a class pizza party because of her performance on
                  a spelling pre-test. Sue already struggles with reading, attends remediation, and
                  has been working hard to improve.
                </p>
                <p>
                  This decision left her feeling embarrassed and ashamed. She cried at breakfast
                  saying, “Why can&apos;t I be smart like the other kids?” and “I hate being so stupid.”
                </p>
                <p>
                  This is unacceptable. It shows poor judgment, lack of compassion, and outdated
                  teaching practices.
                </p>
                <p>
                  I expect a response and a plan to ensure this does not happen again. I am prepared
                  to escalate this to the board if necessary.
                </p>
                <p className="full-email-signoff">Sincerely,</p>
                <p className="full-email-signoff">A concerned parent</p>
              </article>
            ) : null}

            {currentModule === 'endOfDayEmail' && currentDeskStackItem === 'rewardConcern' && hasSelectedDecision ? (
              <>
                <div className="button-row">
                  <button type="button" className="button secondary" onClick={() => setIsVicOpen(true)}>
                    Ask VIC for Guidance
                  </button>
                  {isReportScene ? (
                    <button type="button" className="button primary" onClick={handleReturnToDeskStack}>
                      Return to Desk Stack
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="button primary"
                      onClick={isInvestigationScene ? handleInvestigationContinue : handleContinueToInvestigation}
                      disabled={
                        isInvestigationScene
                        && !hasCompletedFinalStep
                        && (!investigationDecision || !finalParentResponse.trim())
                      }
                    >
                      Continue
                    </button>
                  )}
                </div>
                {isReportScene ? <p className="next-scenario-note">Return to the desk stack to close the day.</p> : null}
              </>
            ) : null}
          </div>
        </div>

        <aside className="dashboard-column">
          <div className="card dashboard-card">
            <h3>Leadership Dashboard</h3>
            <p className="dashboard-intro">
              Dr. Furman&apos;s Green / Orange / Red prioritization system for daily leadership flow.
            </p>

            <div className="folder-list">
              <article className="folder-card folder-red">
                <h4>Red</h4>
                <p className="folder-subtitle">Must handle before leaving today</p>
                <ul>
                  {folders.red.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="folder-card folder-orange">
                <h4>Orange</h4>
                <p className="folder-subtitle">Handle within the next two days</p>
                <ul>
                  {folders.orange.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="folder-card folder-green">
                <h4>Green</h4>
                <p className="folder-subtitle">Handle within the week</p>
                <ul>
                  {folders.green.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>

          <details className="card vic-panel" open={isVicOpen} onToggle={(event) => setIsVicOpen(event.currentTarget.open)}>
            <summary>VIC Leadership Guidance</summary>
            <p>{activeGuidance.focus}</p>
            <p className="vic-structure-title">Strong leadership response structure:</p>
            <ol className="vic-structure-list">
              {activeGuidance.actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ol>
            <p className="vic-note">Leadership Insight: {activeGuidance.insight}</p>
          </details>

          <details className="card" open={false}>
            <summary>Leadership Records</summary>
            <div className="folder-list leadership-records-list">
              {completedTasks.length ? (
                <article className="folder-card">
                  <h4>Completed</h4>
                  <p className="folder-subtitle">Closed items from this case step</p>
                  <ul>
                    {completedTasks.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ) : null}

              {iepLeadershipRecord ? (
                <article className="folder-card">
                  <h4>IEP Meeting Record</h4>
                  <p className="folder-subtitle">Captured leadership follow-through notes</p>
                  <ul>
                    <li><strong>Decision:</strong> {iepLeadershipRecord.decision}</li>
                    <li>
                      <strong>Folder selected:</strong>{' '}
                      {iepLeadershipRecord.folder.charAt(0).toUpperCase() + iepLeadershipRecord.folder.slice(1)}
                    </li>
                    <li><strong>Coaching note:</strong> {iepLeadershipRecord.coachingNote}</li>
                    <li><strong>Suggested folder:</strong> {iepLeadershipRecord.suggestedFolder}</li>
                  </ul>
                </article>
              ) : null}

              {announcementsLeadershipRecord ? (
                <article className="folder-card">
                  <h4>Announcements Record</h4>
                  <p className="folder-subtitle">Captured hallway request follow-through notes</p>
                  <ul>
                    <li><strong>Decision:</strong> {announcementsLeadershipRecord.decision}</li>
                    {announcementsTasks.map((task) => (
                      <li key={`record-${task.id}`}>
                        <strong>{task.label}:</strong>{' '}
                        {(announcementsLeadershipRecord.taskFolders[task.id] || '')
                          .charAt(0)
                          .toUpperCase()
                          + (announcementsLeadershipRecord.taskFolders[task.id] || '').slice(1)}
                      </li>
                    ))}
                    <li><strong>Coaching note:</strong> {announcementsLeadershipRecord.coachingNote}</li>
                    <li><strong>Suggested folder:</strong> {announcementsLeadershipRecord.suggestedFolder}</li>
                  </ul>
                </article>
              ) : null}

              {voicemailLeadershipRecord ? (
                <article className="folder-card">
                  <h4>Voicemail Record</h4>
                  <p className="folder-subtitle">Captured voicemail triage and follow-through notes</p>
                  <ul>
                    <li><strong>Parent Help Request first move:</strong> {voicemailLeadershipRecord.triageDecisions.parentHelp}</li>
                    <li><strong>Teacher Call first move:</strong> {voicemailLeadershipRecord.triageDecisions.teacherCall}</li>
                    <li><strong>Parent response draft:</strong> {voicemailLeadershipRecord.responses.parentHelp}</li>
                    <li><strong>Teacher response draft:</strong> {voicemailLeadershipRecord.responses.teacherCall}</li>
                    <li><strong>Guidance note:</strong> {voicemailLeadershipRecord.coachingNote}</li>
                  </ul>
                </article>
              ) : null}

              {walkthroughLeadershipRecord ? (
                <article className="folder-card">
                  <h4>Walkthrough Record</h4>
                  <p className="folder-subtitle">Captured non-evaluative classroom walkthrough notes</p>
                  <ul>
                    <li><strong>Student engagement evidence:</strong> {walkthroughLeadershipRecord.responses?.studentEngagement}</li>
                    <li><strong>Learning objective evidence:</strong> {walkthroughLeadershipRecord.responses?.learningObjective}</li>
                    <li><strong>Instructional supports observed:</strong> {walkthroughLeadershipRecord.responses?.instructionalSupport}</li>
                    <li><strong>Classroom environment notes:</strong> {walkthroughLeadershipRecord.responses?.classroomEnvironment}</li>
                    <li><strong>Evidence-based strength:</strong> {walkthroughLeadershipRecord.responses?.evidenceBasedStrength}</li>
                    <li><strong>Follow-up question:</strong> {walkthroughLeadershipRecord.responses?.followUpQuestion}</li>
                    <li><strong>Record status:</strong> {walkthroughLeadershipRecord.reflectionSaved ? 'Saved' : 'Pending'}</li>
                  </ul>
                </article>
              ) : null}

              {lunchClimateCoachingRecord ? (
                <article className="folder-card">
                  <h4>Lunch Climate Record</h4>
                  <p className="folder-subtitle">Captured cafeteria leadership decisions and staff direction</p>
                  <ul>
                    <li><strong>Decision:</strong> {lunchClimateCoachingRecord.decision}</li>
                    <li><strong>Direction note:</strong> {lunchClimateCoachingRecord.monitorDirectionNote}</li>
                    <li><strong>Coaching note:</strong> {lunchClimateCoachingRecord.coachingNote}</li>
                    <li><strong>Leadership insight:</strong> {lunchClimateCoachingRecord.leadershipInsight}</li>
                  </ul>
                </article>
              ) : null}

              {parentEscalationLeadershipRecord ? (
                <article className="folder-card">
                  <h4>Parent Escalation Record</h4>
                  <p className="folder-subtitle">Captured parent escalation response notes</p>
                  <ul>
                    <li><strong>Voicemail played:</strong> {parentEscalationLeadershipRecord.voicemailPlayed ? 'Yes' : 'No'}</li>
                    <li><strong>Decision:</strong> {parentEscalationLeadershipRecord.decision}</li>
                    <li><strong>Response script:</strong> {parentEscalationLeadershipRecord.response}</li>
                    <li><strong>Coaching note:</strong> {parentEscalationLeadershipRecord.coachingNote}</li>
                  </ul>
                </article>
              ) : null}

              {cafeteriaBoundaryLeadershipRecord ? (
                <article className="folder-card">
                  <h4>Cafeteria Boundary Record</h4>
                  <p className="folder-subtitle">Captured staff boundary response notes</p>
                  <ul>
                    <li><strong>Voicemail played:</strong> {cafeteriaBoundaryLeadershipRecord.voicemailPlayed ? 'Yes' : 'No'}</li>
                    <li><strong>Decision:</strong> {cafeteriaBoundaryLeadershipRecord.decision}</li>
                    <li><strong>Staff conversation opener:</strong> {cafeteriaBoundaryLeadershipRecord.response}</li>
                    <li><strong>Coaching note:</strong> {cafeteriaBoundaryLeadershipRecord.coachingNote}</li>
                  </ul>
                </article>
              ) : null}

              {teacherConflictLeadershipRecord ? (
                <article className="folder-card">
                  <h4>Teacher Conflict Record</h4>
                  <p className="folder-subtitle">Captured adult conflict leadership response notes</p>
                  <ul>
                    <li><strong>Decision:</strong> {teacherConflictLeadershipRecord.decision}</li>
                    <li><strong>Opening statement:</strong> {teacherConflictLeadershipRecord.openingStatement}</li>
                    <li><strong>Coaching note:</strong> {teacherConflictLeadershipRecord.coachingNote}</li>
                  </ul>
                </article>
              ) : null}
            </div>
          </details>

          <details className="card" open={false}>
            <summary>Utilities</summary>
            <button
              type="button"
              className="button secondary"
              onClick={() => setBuilderMode((prev) => !prev)}
            >
              Builder Mode: {builderMode ? 'On' : 'Off'}
            </button>
            <button type="button" className="button secondary" onClick={saveSimulationProgress}>
              Save Progress
            </button>
            <p className="folder-subtitle">Progress is saved only in this browser on this device.</p>
            {saveProgressMessage ? <p>{saveProgressMessage}</p> : null}
            {lastSavedLabel ? <p>{lastSavedLabel}</p> : null}
            {savedSnapshot ? (
              <div>
                <p><strong>Saved progress found.</strong></p>
                <p>
                  Last saved:{' '}
                  {savedSnapshot.savedAt ? new Date(savedSnapshot.savedAt).toLocaleString() : 'unavailable'}
                </p>
                <button type="button" className="button secondary" onClick={handleResumeSavedSimulation}>
                  Resume Saved Simulation
                </button>
                <button type="button" className="button secondary" onClick={handleClearSavedProgress}>
                  Clear Saved Progress
                </button>
              </div>
            ) : null}
            <button type="button" className="button secondary" onClick={handlePreviewSaveSnapshot}>
              Preview Save Snapshot
            </button>
            <button type="button" className="button secondary" onClick={handleStartOver}>
              Start Over
            </button>
            {snapshotPreviewMessage ? <p>{snapshotPreviewMessage}</p> : null}
            {snapshotValidationMessage ? <p>{snapshotValidationMessage}</p> : null}
          </details>
        </aside>
      </div>
    </div>
  );
}
