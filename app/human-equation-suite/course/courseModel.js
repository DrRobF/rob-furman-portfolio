export const COURSE_EVIDENCE_KEY = 'humanEquationCourseEvidence';

export const factorCatalog = [
  { key: 'regulationUnderPressure', slug: 'regulation-under-pressure', label: 'Regulation Under Pressure' },
  { key: 'humanAwareness', slug: 'human-awareness', label: 'Human Awareness' },
  { key: 'trustConstruction', slug: 'trust-construction', label: 'Trust Construction' },
  { key: 'realityAnchoring', slug: 'reality-anchoring', label: 'Reality Anchoring' },
  { key: 'grayAreaLeadership', slug: 'gray-area-leadership', label: 'Gray Area Leadership' },
  { key: 'teamSystemsLeadership', slug: 'team-systems-leadership', label: 'Team & Systems Leadership' },
  { key: 'instructionalAcademicLeadership', slug: 'instructional-academic-leadership', label: 'Instructional & Academic Leadership' },
  { key: 'visionChangeLeadership', slug: 'vision-change-leadership', label: 'Vision & Change Leadership' },
];

export const factorModules = {
  regulationUnderPressure: {
    factorId: 'regulationUnderPressure', title: 'Regulation Under Pressure', quote: '“Pressure changes your pace before it changes your words.”', pressureShift: 'Your tempo speeds up and your range of options narrows.', moduleTrains: 'Staying grounded, avoiding bait, and slowing the moment without losing authority.',
    teachingBlocks: [
      { heading: 'What this factor is', body: 'Regulation under pressure is your ability to keep your nervous system in leadership mode when the room is emotionally charged.' },
      { heading: 'How pressure distorts it', body: 'Leaders often keep a calm face while their interpretation gets faster, sharper, and less collaborative.' },
      { heading: 'School reality and recovery', body: 'In schools, this shows up in hallway confrontations, urgent parent interactions, and staff conflict. Recovery means body reset, pacing language, and clear next-step framing.' },
    ],
    reflectionPrompts: [
      'Where does your pace accelerate first under stress?',
      'How do others read your regulation in high-stakes moments?',
      'What signal tells you you are becoming reactive?',
      'What one reset move will you practice this week?',
    ],
    recoveryRehearsal: {
      beforePressure: 'Set a pace anchor before meetings: breath, cadence, and opening line.',
      duringPressure: 'Slow voice and sequence: concern, fact, boundary, next step.',
      afterPressure: 'Reconnect with impacted people and restate rationale clearly.',
      languageShift: "From 'Handle this now' to 'Let's stabilize, then decide.'",
      reset60: 'One minute: exhale slowly, relax jaw, name priorities in order.',
      othersNeed: 'Steady containment, clear direction, and no reactive blame.',
    },
    interactions: Array.from({ length: 4 }).map((_, i) => ({ prompt: [`A teacher challenges you in front of peers.`, `A parent records a heated exchange.`, `Your AP brings a crisis at dismissal.`, `A student confrontation pulls you into reactive tone.`][i], options: [
      { label: 'Name boundaries immediately', feedback: 'Protects structure, but may skip emotional containment.' },
      { label: 'Slow tone and sequence response', feedback: 'Builds control while preserving authority.' },
      { label: 'Delay and revisit later', feedback: 'Can prevent escalation, but may leave uncertainty.' },
      { label: 'Delegate the moment', feedback: 'Useful when planned, risky if it reads as avoidance.' },
    ] })),
  },
  humanAwareness: {
    factorId: 'humanAwareness', title: 'Human Awareness', quote: '“Pressure changes what humans notice first.”', pressureShift: 'Under urgency, leaders often notice behavior before meaning.', moduleTrains: 'Reading emotion, context, fear, and meaning before assigning motive.',
    teachingBlocks: [
      { heading: 'What Human Awareness actually is', body: 'Human Awareness is the discipline of reading the person, the context, and the threat signal before judging intent. It does not reduce accountability; it improves the accuracy of accountability.' },
      { heading: 'Why leaders miss cues under pressure', body: 'Pressure compresses perception. You may over-index on compliance, speed, or optics and under-read fear, shame, identity threat, and relational rupture.' },
      { heading: 'What this looks like in schools', body: 'In schools, this appears when adults interpret student behavior as defiance before checking context, or when parent intensity is read as hostility instead of a trust alarm.' },
      { heading: 'What staff, parents, and students may feel', body: 'Staff may feel reduced to output. Parents may feel dismissed before understood. Students may feel judged before seen. The common experience is “they decided about me before they heard me.”' },
      { heading: 'What recovery looks like', body: 'Recovery is visible humility with structure: reopen interpretation, acknowledge what you may have missed, and reframe the next step with both care and clarity.' },
    ],
    reflectionPrompts: [
      'Where do you interpret speed as certainty?',
      'What human signal do you miss most under pressure?',
      'How might staff or parents experience your fastest decisions?',
      'What recovery language will you use next time?',
    ],
    recoveryRehearsal: {
      beforePressure: 'Decide your pace anchor: breath, posture, and first sentence.',
      duringPressure: 'Name one human signal and one verified fact before assigning motive.',
      afterPressure: 'Reopen with: what I saw, what I may have missed, what happens next.',
      languageShift: 'From “What is wrong with them?” to “What might be happening for them?”',
      reset60: 'In 60 seconds: breathe, scan body tension, name facts/assumptions, set next step.',
      othersNeed: 'Predictability, dignity, and clear ownership in your next move.',
    },
    interactions: [
      { prompt: 'A veteran teacher gets defensive after feedback on engagement. What do you notice first?', options: [
        { label: 'Identity threat', feedback: 'Centers dignity and can lower defensiveness quickly.' },
        { label: 'Accountability resistance', feedback: 'Protects standards; watch for premature closure.' },
        { label: 'Implementation overload', feedback: 'Surfaces practical friction that may be misread as resistance.' },
        { label: 'Past evaluation wounds', feedback: 'Expands context and improves relational accuracy.' },
      ]},
      { prompt: 'A parent repeats, “Nobody listens here.” What leads your read?', options: [
        { label: 'Complaint details', feedback: 'Important, but trust signal may still drive escalation.' },
        { label: 'Trust rupture language', feedback: 'Often the fastest route to de-escalation and clarity.' },
        { label: 'Public optics risk', feedback: 'Operationally smart; may feel impersonal if done alone.' },
        { label: 'Staff defense posture', feedback: 'Protective move; pair with parent experience naming.' },
      ]},
      { prompt: 'A quiet student refuses to enter class. What do you read first?', options: [
        { label: 'Defiance pattern', feedback: 'Could be true; check for hidden threat signal first.' },
        { label: 'Fear response', feedback: 'Opens support pathways without removing boundaries.' },
        { label: 'Peer social pressure', feedback: 'Useful when belonging dynamics are driving behavior.' },
        { label: 'Adult trust rupture', feedback: 'May explain sudden shifts in compliance.' },
      ]},
      { prompt: 'Staff nod at a rollout then leave silent. What do you notice?', options: [
        { label: 'Agreement', feedback: 'Possible, but silence can mask low commitment.' },
        { label: 'Compliance without belief', feedback: 'Helpful read when execution energy drops.' },
        { label: 'Role confusion', feedback: 'Targets implementation clarity before blame.' },
        { label: 'Change fatigue', feedback: 'Names burden and helps protect long-term trust.' },
      ]},
      { prompt: 'Policy was followed but the situation worsened. What do you notice?', options: [
        { label: 'Fidelity success', feedback: 'A valid anchor, but not a full diagnosis.' },
        { label: 'Relational breakdown', feedback: 'Often the missing channel when policy alone fails.' },
        { label: 'Context gap', feedback: 'Keeps inquiry open and protects judgment quality.' },
        { label: 'Readiness mismatch', feedback: 'Highlights support design over blame assignment.' },
      ]},
      { prompt: 'AP recommends a technically correct consequence that feels emotionally incomplete. What first?', options: [
        { label: 'Consistency', feedback: 'Important base; may miss lived impact.' },
        { label: 'Student context', feedback: 'Improves fit and perceived fairness.' },
        { label: 'Parent trust effect', feedback: 'Strengthens external confidence and communication planning.' },
        { label: 'Staff precedent', feedback: 'Protects team coherence and future execution.' },
      ]},
    ],
  },
};

const addDefaultModule = (key, title, quote, pressureShift, moduleTrains) => ({
  factorId: key, title, quote: `“${quote}”`, pressureShift, moduleTrains,
  teachingBlocks: [
    { heading: 'What this factor is', body: moduleTrains },
    { heading: 'Pressure pattern', body: pressureShift },
    { heading: 'School application and recovery', body: 'Use this factor to hold clarity and humanity together, then recover quickly when interpretation narrows.' },
  ],
  reflectionPrompts: [
    'Where is this factor strongest for you under pressure?',
    'Where does pressure distort this factor in your leadership?',
    'What might staff or parents feel when this factor drifts?',
    'What concrete recovery move will you practice this week?',
  ],
  recoveryRehearsal: {
    beforePressure: 'Pre-brief your non-negotiables, context questions, and tone target.',
    duringPressure: 'Separate facts, interpretations, and urgent actions out loud.',
    afterPressure: 'Close the loop with rationale, ownership, and timeline.',
    languageShift: 'Replace certainty language with calibrated clarity.',
    reset60: 'Take one minute to slow breath, check assumptions, and sequence next actions.',
    othersNeed: 'Visible reasoning, emotional steadiness, and follow-through.',
  },
  interactions: Array.from({ length: 4 }).map((_, idx) => ({ prompt: `${title} pressure decision moment ${idx + 1}`, options: [
    { label: 'Protect structure first', feedback: 'Provides containment; may limit context sensing.' },
    { label: 'Balance context and direction', feedback: 'Often improves trust and implementation quality.' },
    { label: 'Delay for more input', feedback: 'Can improve accuracy; risks momentum loss.' },
    { label: 'Act quickly and revisit', feedback: 'Maintains pace; requires explicit repair loop.' },
  ] })),
});

Object.assign(factorModules, {
  trustConstruction: addDefaultModule('trustConstruction', 'Trust Construction', 'Trust grows when people can see your reasoning.', 'Under pressure, hidden logic erodes trust even when intent is positive.', 'Visible consistency, dignity, follow-through, and repair.'),
  realityAnchoring: addDefaultModule('realityAnchoring', 'Reality Anchoring', 'Pressure makes stories feel like facts.', 'Urgency can collapse distinctions between data, assumptions, and fear.', 'Separating evidence, assumptions, emotion, and urgency.'),
  grayAreaLeadership: addDefaultModule('grayAreaLeadership', 'Gray Area Leadership', 'The hardest decisions usually contain more than one truth.', 'Pressure pushes binary thinking and false either/or choices.', 'Holding accountability and context together without becoming rigid or inconsistent.'),
  teamSystemsLeadership: addDefaultModule('teamSystemsLeadership', 'Team & Systems Leadership', 'If every problem needs you personally, the system is not holding.', 'Pressure pulls leaders into hero mode and bypasses system design.', 'Routines, roles, handoffs, distributed trust, and adult support systems.'),
  instructionalAcademicLeadership: addDefaultModule('instructionalAcademicLeadership', 'Instructional & Academic Leadership', 'Learning conditions are leadership conditions.', 'Under pressure, behavior response can displace learning purpose.', 'Connecting behavior, rigor, support, expectations, and instructional follow-through.'),
  visionChangeLeadership: addDefaultModule('visionChangeLeadership', 'Vision & Change Leadership', 'People follow change when purpose becomes trustworthy.', 'Pressure shortens communication loops and weakens shared meaning.', 'Pacing, meaning, buy-in, communication, and visible follow-through.'),
});

const emptyFactor = () => ({ completed: false, score: null, dominantTendency: '', driftToWatch: '', recoveryMove: '', reflectionResponses: {}, interactionChoices: {}, completedAt: null, evidenceSummary: '' });
export const createDefaultCourseEvidence = () => ({ source: 'eight_factors_course', startedAt: null, updatedAt: null, completedFactors: 0, factorEvidence: Object.fromEntries(factorCatalog.map((f) => [f.key, emptyFactor()])), reflections: {}, interactionEvidence: {}, growthSignals: [], timelineEvents: [] });
export const readCourseEvidence = () => { if (typeof window === 'undefined') return createDefaultCourseEvidence(); const raw = JSON.parse(window.localStorage.getItem(COURSE_EVIDENCE_KEY) || 'null'); return { ...createDefaultCourseEvidence(), ...(raw || {}), factorEvidence: { ...createDefaultCourseEvidence().factorEvidence, ...(raw?.factorEvidence || {}) } }; };
export const saveCourseEvidence = (updater) => { if (typeof window === 'undefined') return createDefaultCourseEvidence(); const current = readCourseEvidence(); const next = typeof updater === 'function' ? updater(current) : updater; const completedFactors = Object.values(next.factorEvidence || {}).filter((f) => f?.completed).length; const payload = { ...next, startedAt: next.startedAt || new Date().toISOString(), updatedAt: new Date().toISOString(), completedFactors }; window.localStorage.setItem(COURSE_EVIDENCE_KEY, JSON.stringify(payload)); return payload; };
