export const scenario = {
  id: 'middle-school-fight-call',
  title: 'Middle School Fight: Parent Follow-Up',
  subtitle: 'Caregiver upset after hallway altercation',
  pressure: 'High',
  description:
    'A parent calls after hearing their child was attacked at school. They are angry, distrustful, and convinced school staff failed to protect their child. Further context indicates the student may also have escalated the conflict before staff arrived.',
  context: [
    'Incident occurred during passing period between 6th and 7th blocks.',
    'Two students were physically separated by staff within 90 seconds.',
    'Security footage suggests verbal provocation happened before the first shove.',
  ],
};

export const transcript = [
  {
    speaker: 'Parent',
    tone: 'Angry',
    line: 'I need to understand how my child was left unsafe in your building.',
    time: '00:12',
  },
  {
    speaker: 'You',
    tone: 'Grounded',
    line: 'I hear how serious this feels for your family. I want to walk through exactly what we know so far.',
    time: '00:34',
  },
  {
    speaker: 'Parent',
    tone: 'Escalated',
    line: 'What I know is my child was jumped, and nobody stepped in fast enough.',
    time: '01:09',
  },
  {
    speaker: 'You',
    tone: 'De-escalating',
    line: 'Your child’s safety is the priority. I also want to share the full sequence clearly, including what staff observed before contact.',
    time: '01:42',
  },
];

export const report = {
  emotionalContainment:
    'Strong opening acknowledgment reduced intensity in the first minute. Maintain slower pacing when parent interruptions increase.',
  deEscalation:
    'You validated impact before correcting facts, which preserved trust. Consider one additional reflective statement before discussing footage.',
  clarity:
    'Your timeline language was specific and non-defensive. Next iteration: summarize in three short checkpoints to improve retention under stress.',
  nextSteps:
    'Confirm family meeting window, document safety supports for both students, and communicate investigation milestones within 24 hours.',
};
