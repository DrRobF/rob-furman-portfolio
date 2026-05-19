export const reportPreviewFixtures = [
  {
    id: 'attendance-accountability-tension',
    label: 'Attendance accountability tension',
    parentName: 'Ms. Jenkins',
    metadata: {
      scenarioType: 'attendance',
      issueType: 'you_call_after_investigation',
      callTiming: 'same_day_afternoon_parent_call',
      role: 'assistant_principal',
      gradeBand: 'middle_school',
      parentLanguage: 'english',
    },
    callContext: 'Family has frequent tardies and absences linked to transportation instability and morning conflict at home.',
    privateNotes: 'Attendance officer reports 11 tardies and 6 absences in 5 weeks. Parent feels blamed and says reminders are "threatening".',
    transcript: [
      { timestamp: '2026-05-18T13:02:12.000Z', role: 'user', text: 'Thanks for speaking with me, Ms. Jenkins. I want us to align on what support can help Maya get to school consistently.' },
      { timestamp: '2026-05-18T13:02:42.000Z', role: 'parent', text: 'I get these calls every week. Nobody asks what is actually happening in our house.' },
      { timestamp: '2026-05-18T13:03:08.000Z', role: 'user', text: 'You are right, and I appreciate you saying that. Can you walk me through the hardest part of mornings right now?' },
      { timestamp: '2026-05-18T13:03:36.000Z', role: 'parent', text: 'My shift ends at 6 AM and the bus is unreliable. If she misses that first bus, she is late no matter what.' },
      { timestamp: '2026-05-18T13:04:21.000Z', role: 'user', text: 'That helps. We still need daily attendance, and I want to pair that expectation with options we can control this week.' },
      { timestamp: '2026-05-18T13:04:57.000Z', role: 'parent', text: 'I can do my part, but stop acting like she does not care. She shuts down when staff lecture her.' },
      { timestamp: '2026-05-18T13:05:39.000Z', role: 'user', text: 'Understood. I will ask her first-period teacher to greet her privately and set a two-day catch-up plan when she arrives late.' }
    ]
  },
  {
    id: 'academic-concern-parent-distrust',
    label: 'Academic concern and parent distrust',
    parentName: 'Mr. Alvarez',
    metadata: {
      scenarioType: 'academic_concern',
      issueType: 'parent_calls_unexpectedly',
      callTiming: 'administrator_callback_after_initial_investigation',
      role: 'principal',
      gradeBand: 'high_school',
      parentLanguage: 'spanish',
    },
    callContext: 'Parent believes grading has become punitive and teacher communication has been dismissive.',
    privateNotes: 'Parent references three missing assignments that were submitted in Google Classroom. Teacher reports late submissions and unclear file uploads.',
    transcript: [
      { timestamp: '2026-05-16T15:11:04.000Z', role: 'parent', text: 'I do not trust what I am hearing. Every time I ask, the story changes and my son gets blamed.' },
      { timestamp: '2026-05-16T15:11:37.000Z', role: 'user', text: 'I hear the trust concern. Let me separate what is confirmed in the gradebook from what still needs review.' },
      { timestamp: '2026-05-16T15:12:09.000Z', role: 'parent', text: 'He turned in work. Then it says zero. That is not fair and nobody explains it clearly.' },
      { timestamp: '2026-05-16T15:12:48.000Z', role: 'user', text: 'Confirmed today: three assignments show zero, and two have upload errors. By tomorrow at 2 PM we will verify each submission with screenshots and teacher notes.' },
      { timestamp: '2026-05-16T15:13:23.000Z', role: 'parent', text: 'If this is another delay, I am filing a formal complaint.' },
      { timestamp: '2026-05-16T15:13:51.000Z', role: 'user', text: 'You have that right. My immediate commitment is a written update tomorrow and a meeting with counselor, teacher, and family to finalize supports.' }
    ]
  },
  {
    id: 'teacher-complaint-emotional-escalation',
    label: 'Teacher complaint with escalation',
    parentName: 'Ms. Thompson',
    metadata: {
      scenarioType: 'teacher_complaint',
      issueType: 'you_call_after_investigation',
      callTiming: 'next_day_follow_up_call',
      role: 'assistant_principal',
      gradeBand: 'elementary',
      parentLanguage: 'english',
    },
    callContext: 'Student reported public humiliation after redirection; parent demands immediate teacher removal.',
    privateNotes: 'Witness account partially corroborates tone concern; no evidence of profanity. Family requests apology and class change.',
    transcript: [
      { timestamp: '2026-05-12T14:22:16.000Z', role: 'parent', text: 'My daughter cried all night. That teacher embarrassed her in front of the whole class.' },
      { timestamp: '2026-05-12T14:22:44.000Z', role: 'user', text: 'I am sorry your daughter felt humiliated. I want to acknowledge that impact while I explain what our review has confirmed so far.' },
      { timestamp: '2026-05-12T14:23:10.000Z', role: 'parent', text: 'No. I am done with reviews. Remove that teacher from her class now.' },
      { timestamp: '2026-05-12T14:23:49.000Z', role: 'user', text: 'I can not make immediate staffing changes on this call, but I can set protections right now: supervised check-in tomorrow and counselor support before class.' },
      { timestamp: '2026-05-12T14:24:18.000Z', role: 'parent', text: 'You are protecting adults, not children.' },
      { timestamp: '2026-05-12T14:24:46.000Z', role: 'user', text: 'I hear that concern. You will receive our documented next steps by 10 AM, including observation, follow-up conference, and options if trust is still not restored.' }
    ]
  }
];
