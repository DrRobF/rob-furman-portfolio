export const setupOptions = {
  roles: ['Teacher', 'Assistant Principal', 'Principal'],
  gradeBands: ['Elementary', 'Middle School', 'High School'],
  callTypes: ['Parent calls you unexpectedly', 'You call parent after initial investigation'],
  scenarioTypes: ['Discipline', 'Academic Concern', 'Attendance', 'Teacher Complaint'],
  intensities: ['Moderate', 'High', 'Full Blaze'],
};

export const callerProfiles = {
  Moderate: 'Concerned parent (frustrated, still collaborative)',
  High: 'Upset parent (defensive and distrustful)',
  'Full Blaze': 'Highly escalated parent (accusatory, intense urgency)',
};

export const briefings = {
  limited:
    'You do not yet have the full context. Your goal is to listen, gather facts, stay calm, and avoid premature conclusions.',
  full: {
    knownFacts: [
      'A conflict occurred near the cafeteria transition during 4th period.',
      'Two students were separated by staff in under two minutes.',
      'A nurse check was completed and no immediate injuries required hospital transport.',
    ],
    staffReport: [
      'Teacher reports escalating verbal exchanges over the last week.',
      'Hall monitor observed both students raising voices before physical contact.',
    ],
    studentStatements: [
      'Student A says they felt threatened and reacted defensively.',
      'Student B says they were confronted publicly and felt embarrassed.',
    ],
    unclear: [
      'Who initiated physical contact first.',
      'Whether social media conflict from last night influenced the incident.',
    ],
    leadershipChallenge:
      'Maintain trust while communicating accountability and process: validate emotion, share what is confirmed, and avoid overstating what is unresolved.',
  },
};

export const transcript = [
  {
    speaker: 'Parent',
    tone: 'Escalated',
    line: 'I need to understand why this happened at school and why nobody called me right away.',
    time: '00:18',
  },
  {
    speaker: 'You',
    tone: 'Grounded',
    line: 'I hear how upsetting this is. I want to walk through what we know and what we are still verifying.',
    time: '00:46',
  },
  {
    speaker: 'Parent',
    tone: 'Pressured',
    line: 'It feels like I am hearing pieces, not the whole story.',
    time: '01:23',
  },
  {
    speaker: 'You',
    tone: 'De-escalating',
    line: 'That makes sense. I can summarize confirmed facts now and then outline next update checkpoints.',
    time: '01:52',
  },
];

export const report = {
  pressureMoments: [
    '00:18 — Parent opens with urgency and blame framing.',
    '01:23 — Trust concern appears (“pieces, not the whole story”).',
  ],
  coachingHighlights: [
    'You acknowledged emotion before delivering process details.',
    'You used structured language to separate facts from unknowns.',
  ],
  leadershipStrengths: [
    'Calm voice under accusation',
    'Clear timeline framing',
    'Commitment to follow-through',
  ],
  growthAreas: [
    'Use one more reflective statement before transitioning to policy.',
    'Ask a concise checking question to confirm parent understanding.',
  ],
  nextPracticeRecommendation:
    'Repeat this scenario at Full Blaze intensity and practice concise empathy statements in the first 45 seconds.',
};
