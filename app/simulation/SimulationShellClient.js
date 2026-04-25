'use client';

import { useEffect, useMemo, useState } from 'react';

const initialFolders = {
  red: ['Return urgent parent call'],
  orange: ['Prepare follow-up notes'],
  green: ['Review leadership reflection'],
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

const totalDecisionWindowSeconds = 120;

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
  { id: 'lunchDiscipline', label: '11:30 AM — Lunch & Discipline', enabled: false },
  { id: 'parentCall', label: '1:00 PM — Parent Call', enabled: false },
  { id: 'teacherObservation', label: '2:00 PM — Teacher Observation', enabled: false },
  { id: 'teacherConflict', label: '3:15 PM — Teacher Conflict', enabled: false },
  { id: 'endOfDayEmail', label: '4:00 PM — End-of-Day Communication', enabled: true },
];

const moduleStatuses = {
  upcoming: 'upcoming',
  active: 'active',
  completed: 'completed',
};

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

const initialModuleStatuses = dayModules.reduce((acc, module) => {
  acc[module.id] = module.id === 'arrival' ? moduleStatuses.active : moduleStatuses.upcoming;
  return acc;
}, {});

function formatTimer(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function analyzeFinalResponse(response) {
  const lowered = response.toLowerCase();
  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;

  const empathyTerms = [
    'concern',
    'understand',
    'appreciate',
    'sorry',
    'thank you',
    'support',
    'hear',
    'reviewed',
  ];
  const emotionalTerms = ['embarrass', 'frustrat', 'concern', 'worry', 'upset', 'ashamed', 'feel'];
  const processTerms = ['follow up', 'tomorrow', 'today', 'by ', 'will review', 'will speak', 'will call'];
  const factFindingTerms = ['review', 'gather', 'look into', 'speak with', 'context', 'facts'];
  const defensiveTerms = ['not our fault', 'your child', 'teacher was wrong', 'you are wrong', 'calm down'];
  const blameTerms = ['lied', 'lazy', 'teacher is wrong', 'parent is wrong', 'your daughter was wrong'];
  const overpromiseTerms = ['i promise', 'guarantee', 'will be punished immediately', 'this will never happen again'];
  const dismissiveTerms = ['nothing happened', 'no issue', 'overreacting'];

  const hasEmpathy = includesAny(lowered, empathyTerms);
  const hasEmotionAcknowledgment = includesAny(lowered, emotionalTerms);
  const hasProcess = includesAny(lowered, processTerms);
  const hasFactFinding = includesAny(lowered, factFindingTerms);
  const hasDefensive = includesAny(lowered, defensiveTerms);
  const hasBlame = includesAny(lowered, blameTerms);
  const hasOverpromise = includesAny(lowered, overpromiseTerms);
  const hasDismissive = includesAny(lowered, dismissiveTerms);

  const rows = {
    'Communication & Tone': {
      status:
        (wordCount >= 45 && hasEmpathy && !hasDefensive && !hasBlame) ? 'Strong' : 'Needs Attention',
      note:
        (wordCount >= 45 && hasEmpathy && !hasDefensive && !hasBlame)
          ? 'You acknowledged concern in a calm voice that protects trust.'
          : 'Add clearer empathy language and remove any defensive or blaming tone.',
    },
    'Fairness & Professional Integrity': {
      status: !hasBlame && hasFactFinding ? 'Strong' : 'Needs Attention',
      note:
        !hasBlame && hasFactFinding
          ? 'You stayed neutral and grounded your response in fact-finding.'
          : 'Avoid assigning fault; focus on review before conclusions.',
    },
    'Process & Follow-Through': {
      status: hasProcess ? 'Strong' : 'Needs Attention',
      note: hasProcess
        ? 'You gave a concrete next step and timeline.'
        : 'Add a specific next step and when the parent will hear from you.',
    },
    'Emotional Awareness': {
      status: hasEmotionAcknowledgment ? 'Strong' : 'Needs Attention',
      note: hasEmotionAcknowledgment
        ? 'You recognized the family’s emotional experience, not just the facts.'
        : 'Explicitly acknowledge student and parent emotions in your response.',
    },
    'Judgment Under Pressure': {
      status: hasDismissive || hasBlame || includesAny(lowered, ['discipline immediately'])
        ? 'Needs Attention'
        : hasEmpathy && hasFactFinding && !hasOverpromise
          ? 'Strong'
          : 'Developing',
      note: hasDismissive || hasBlame || includesAny(lowered, ['discipline immediately'])
        ? 'Avoid dismissal, blame, or immediate punitive guarantees before facts are confirmed.'
        : hasEmpathy && hasFactFinding && !hasOverpromise
          ? 'You balanced urgency, empathy, and process without overcommitting outcomes.'
          : 'Keep acknowledgment, but tighten language to avoid overpromising before full review.',
    },
  };

  return lensNames.map((name) => ({ lens: name, ...rows[name] }));
}

export default function SimulationShellClient() {
  const [currentModule, setCurrentModule] = useState('arrival');
  const [timelineStatuses, setTimelineStatuses] = useState(initialModuleStatuses);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalDecisionWindowSeconds);
  const [folders, setFolders] = useState(initialFolders);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [firstDecision, setFirstDecision] = useState('');
  const [investigationDecision, setInvestigationDecision] = useState('');
  const [initialParentResponse, setInitialParentResponse] = useState('');
  const [finalParentResponse, setFinalParentResponse] = useState('');
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
  const [voicemailStage, setVoicemailStage] = useState('triage');
  const [voicemailTaskClosed, setVoicemailTaskClosed] = useState(false);
  const [voicemailLeadershipRecord, setVoicemailLeadershipRecord] = useState(null);
  const [walkthroughResponses, setWalkthroughResponses] = useState(
    walkthroughFormFields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {}),
  );
  const [walkthroughLeadershipRecord, setWalkthroughLeadershipRecord] = useState(null);
  const [walkthroughStage, setWalkthroughStage] = useState('form');
  const [moduleTransitionNote, setModuleTransitionNote] = useState('');

  const hasSelectedDecision = Boolean(firstDecision);
  const [scene, setScene] = useState('initial');
  const isInvestigationScene = scene === 'investigation';
  const isReportScene = scene === 'report';
  const selectedConsequence = hasSelectedDecision ? decisionConsequences[firstDecision] : null;

  useEffect(() => {
    if (!started || timeLeft <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft]);

  useEffect(() => {
    if (currentModule !== 'voicemail') return;
    addFolderItems({ red: [voicemailLoopTaskItem] });
  }, [currentModule]);

  const urgencyClass = useMemo(() => {
    if (timeLeft <= 30) return 'critical';
    if (timeLeft <= 60) return 'warning';
    return 'calm';
  }, [timeLeft]);

  const beginSimulation = () => {
    setStarted(true);
    setTimeLeft(totalDecisionWindowSeconds);
    setScene('initial');
    setFirstDecision('');
    setInvestigationDecision('');
    setInitialParentResponse('');
    setFinalParentResponse('');
    setHasCompletedFinalStep(false);
    setIsEmailVisible(false);
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
    setVoicemailStage('triage');
    setVoicemailTaskClosed(false);
    setVoicemailLeadershipRecord(null);
    setWalkthroughResponses(walkthroughFormFields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {}));
    setWalkthroughLeadershipRecord(null);
    setWalkthroughStage('form');
    setModuleTransitionNote('');
    setFolders(initialFolders);
    setCompletedTasks([]);
    setCurrentModule('arrival');
    setTimelineStatuses(initialModuleStatuses);
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
    completeFolderItems([
      'Respond to parent with care and clear timeline',
      'Speak with teacher immediately',
      'Document parent concern',
      'Follow up with parent within 48 hours',
    ]);
    setHasCompletedFinalStep(true);
    setTimelineStatuses((prev) => ({
      ...prev,
      endOfDayEmail: moduleStatuses.completed,
    }));
    setScene('report');
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
    if (!hasAllResponses || voicemailStage !== 'triage') return;

    if (!voicemailTaskClosed) {
      completeFolderItems([voicemailLoopTaskItem]);
      setVoicemailTaskClosed(true);
    }

    setVoicemailLeadershipRecord({
      module: '9:30 AM — Voicemail & Mailbox',
      triageDecisions: voicemailDecisions,
      responses: voicemailResponses,
      coachingNote:
        'Strong leaders do not just listen to messages. They close loops. The quality of the response depends on whether the caller knows the message was received, what will happen next, and when they can expect follow-up.',
    });
    setVoicemailStage('reflection');
    scrollToTop();
  };

  const handleVoicemailContinueDay = () => {
    if (voicemailStage !== 'reflection') return;

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
    if (!hasAllResponses || walkthroughStage !== 'form') return;

    setWalkthroughLeadershipRecord((prev) => ({
      ...(prev || {}),
      module: '11:00 AM — Classroom Walkthrough',
      responses: walkthroughResponses,
    }));
    setWalkthroughStage('reflection');
    scrollToTop();
  };

  const handleWalkthroughContinueDay = () => {
    if (walkthroughStage !== 'reflection') return;

    setWalkthroughLeadershipRecord((prev) => ({
      ...(prev || {}),
      module: '11:00 AM — Classroom Walkthrough',
      responses: prev?.responses || walkthroughResponses,
      reflectionSaved: true,
    }));
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

  const showInitialParentResponse = firstDecision === 'Send an email response';
  const showFinalParentResponse = Boolean(investigationDecision) && !hasCompletedFinalStep;
  const hasFinishedArrivalRanking = arrivalSortItems.every((item) => Boolean(arrivalPriorityAssignments[item]));
  const isDecisionMade = currentModule === 'arrival' ? hasFinishedArrivalRanking : hasSelectedDecision;
  const hasCompletedWalkthroughForm = walkthroughFormFields.every(
    (field) => walkthroughResponses[field.id].trim(),
  );
  const hasSelectedBothVoicemailDecisions = Object.values(voicemailDecisions).every(Boolean);
  const hasCompletedBothVoicemailResponses = Object.values(voicemailResponses).every((response) => response.trim());
  const finalResponseAnalysis = useMemo(
    () => analyzeFinalResponse(finalParentResponse),
    [finalParentResponse],
  );

  const investigationGuidanceCopy = {
    'Discuss the situation with the teacher':
      'You chose to discuss the situation with the teacher before responding. This is appropriate if the goal is to review the classroom practice, support the teacher, and prevent future misunderstandings — not to assign blame.',
    'Respond to the parent':
      'You chose to respond after reviewing the available context. Your response should validate the parent’s concern, clarify the facts without blaming the child, and explain the next steps.',
  };

  const investigationOptions = ['Discuss the situation with the teacher', 'Respond to the parent'];

  return (
    <div className="simulation-product-shell">
      <div className="simulation-hero-card">
        <p className="eyebrow">Interactive Leadership Simulation</p>
        <h1>A Day in the Life of a School Leader</h1>
        <p className="lead">
          An interactive leadership simulation for future principals, aspiring administrators, and
          education leaders.
        </p>
        <p>
          Step into the rhythm of a real school day. Prioritize urgent issues, write thoughtful
          responses, and see how leadership decisions build across time.
        </p>
        <button className="button primary" onClick={beginSimulation}>
          Begin Simulation
        </button>
      </div>

      <div className="simulation-layout-grid">
        <div className="scenario-column card">
          <section className="day-timeline-card" aria-label="Simulation day modules">
            <p className="eyebrow">Simulation Day Timeline</p>
            <h2>A Day in the Life of a School Leader</h2>
            <p className="timeline-note">
              Time moves forward. Once a leadership moment passes, it becomes part of your record.
            </p>
            <div className="day-timeline-grid">
              {dayModules.map((module) => {
                const status = timelineStatuses[module.id];
                const isActive = status === moduleStatuses.active && currentModule === module.id;
                const isCompleted = status === moduleStatuses.completed;
                const isUpcoming = status === moduleStatuses.upcoming;
                const moduleLabel = isUpcoming && !module.enabled ? `${module.label} (Coming Soon)` : module.label;
                const isDisabled = !module.enabled || isCompleted;

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
                    }`}
                    aria-current={isActive ? 'step' : undefined}
                    disabled={isDisabled}
                    onClick={() => {
                      if (isDisabled) return;
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
          </section>

          <div className={`decision-window ${urgencyClass}`}>
            <p className="decision-label">Decision Window</p>
            <p className="decision-time">{formatTimer(timeLeft)}</p>
            <p className="decision-note">You are managing time-sensitive leadership priorities.</p>
          </div>

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
                </article>
                <article className="decision-next-step-panel">
                  <p>
                    Voicemails often carry a different urgency than email. If someone took the time to
                    call, there may be emotion, confusion, or a time-sensitive concern behind the message.
                  </p>
                </article>

                {voicemailStage === 'triage' ? (
                  <>
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
                        </article>
                        <article className="report-card">
                          <h3>Teacher Call — Context Needed</h3>
                          <p>
                            Before closing the loop, determine whether the teacher needs a decision, a
                            resource, coverage, parent support, student support, or administrative
                            follow-up.
                          </p>
                        </article>
                        <article className="report-card">
                          <p className="response-label">
                            Use the same leadership sequence: acknowledge the message, clarify what you are
                            doing next, and give a realistic timeline.
                          </p>
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
                ) : (
                  <>
                    <article className="report-card report-intro">
                      <h3>Voicemail Follow-Through Reflection</h3>
                      <p>
                        Strong leaders do not just listen to messages. They close loops. The quality of
                        the response depends on whether the caller knows the message was received, what will
                        happen next, and when they can expect follow-up.
                      </p>
                    </article>
                    <article className="report-card">
                      <ul className="strong-response-list">
                        <li>Did you acknowledge the concern?</li>
                        <li>Did you avoid overpromising?</li>
                        <li>Did you identify the next step?</li>
                        <li>Did you give a realistic timeline?</li>
                        <li>Did you preserve time for the rest of the day?</li>
                      </ul>
                    </article>
                    <div className="button-row">
                      <button
                        type="button"
                        className="button primary"
                        onClick={handleVoicemailContinueDay}
                      >
                        Continue Day
                      </button>
                    </div>
                  </>
                )}
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
                </article>
                <article className="decision-next-step-panel">
                  <p>
                    Effective walkthroughs are short, non-evaluative, and focused on gathering evidence to
                    improve instruction. Strong leaders observe student engagement, clarity of learning goals,
                    instructional support, and classroom environment — then use that evidence to guide
                    reflective conversations with teachers.
                  </p>
                </article>

                {walkthroughStage === 'form' ? (
                  <>
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
                ) : (
                  <>
                    <article className="report-card report-intro">
                      <h3>Walkthrough Reflection</h3>
                      <p>
                        Walkthroughs are not about judging teaching in the moment. They are about collecting
                        evidence that can support a thoughtful professional conversation.
                      </p>
                    </article>
                    <article className="report-card">
                      <h3>Coaching Check</h3>
                      <ul className="strong-response-list">
                        <li>Did you focus on what students were doing, not only what the teacher was doing?</li>
                        <li>Did you identify evidence of learning rather than general impressions?</li>
                        <li>Did you notice whether the lesson purpose was clear?</li>
                        <li>Did you look for instructional supports or scaffolds?</li>
                        <li>Did your follow-up question invite reflection rather than defensiveness?</li>
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
                    <div className="button-row">
                      <button
                        type="button"
                        className="button primary"
                        onClick={handleWalkthroughContinueDay}
                      >
                        Continue Day
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : currentModule === 'endOfDayEmail' ? (
              isReportScene ? (
              <>
                <p className="eyebrow">Leadership Case Record</p>
                <h2>Leadership Response Report</h2>
                <p className="report-subtitle">Case: Parent concern about classroom reward practice</p>

                <article className="report-card report-intro">
                  <p>
                    Your decisions and written response have been added to the leadership record for this
                    case.
                  </p>
                </article>

                <article className="report-card">
                  <h3>Your Path</h3>
                  <ul className="report-path-list">
                    <li>
                      <span className="report-path-label">First move selected:</span>{' '}
                      {firstDecision || 'Not selected'}
                    </li>
                    <li>
                      <span className="report-path-label">Investigation choice selected:</span>{' '}
                      {investigationDecision || 'Not selected'}
                    </li>
                    <li>
                      <span className="report-path-label">Initial parent response drafted:</span>{' '}
                      {initialParentResponse.trim() ? 'Yes' : 'No'}
                    </li>
                    <li>
                      <span className="report-path-label">Final parent response recorded:</span>{' '}
                      {finalParentResponse.trim() ? 'Yes' : 'No'}
                    </li>
                  </ul>
                </article>

                <article className="report-card" aria-live="polite">
                  <h3>Leadership Response Analysis</h3>
                  <p className="analysis-note">
                    First-pass local simulation analysis only (keyword/heuristic based), not final AI
                    analysis.
                  </p>
                  <div className="analysis-grid report-analysis-grid">
                    {finalResponseAnalysis.map((row) => (
                      <article key={row.lens} className="analysis-row report-analysis-row">
                        <div className="report-analysis-header">
                          <p className="analysis-lens">{row.lens}</p>
                          <p className={`analysis-status ${row.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {row.status}
                          </p>
                        </div>
                        <p>{row.note}</p>
                      </article>
                    ))}
                  </div>
                </article>

                <article className="report-card">
                  <h3>Strong Response Should Include</h3>
                  <ul className="strong-response-list">
                    <li>Acknowledge the parent&apos;s concern.</li>
                    <li>Recognize the child&apos;s emotional experience.</li>
                    <li>Clarify that the reward was participation-based, not accuracy-based.</li>
                    <li>Avoid blaming the child or teacher.</li>
                    <li>Explain that classroom practices around rewards and exclusion will be reviewed.</li>
                    <li>Offer a follow-up conversation or timeline.</li>
                  </ul>
                </article>

                <article className="report-card">
                  <h3>Recorded Response</h3>
                  {initialParentResponse.trim() ? (
                    <div className="recorded-response-block">
                      <p className="recorded-response-title">Initial acknowledgment / first response</p>
                      <p>{initialParentResponse}</p>
                    </div>
                  ) : null}
                  <div className="recorded-response-block">
                    <p className="recorded-response-title">Final parent response</p>
                    <p>{finalParentResponse}</p>
                  </div>
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

            {currentModule === 'endOfDayEmail' && !isInvestigationScene && !isReportScene ? (
              <button
                type="button"
                className="button secondary reveal-email-button"
                onClick={() => setIsEmailVisible((prev) => !prev)}
              >
                {isEmailVisible ? 'Hide Full Email' : 'Reveal Full Email'}
              </button>
            ) : null}

            {currentModule === 'endOfDayEmail' && isEmailVisible && !isInvestigationScene && !isReportScene ? (
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

            {currentModule === 'endOfDayEmail' && hasSelectedDecision ? (
              <>
                <div className="button-row">
                  <button type="button" className="button secondary" onClick={() => setIsVicOpen(true)}>
                    Ask VIC for Guidance
                  </button>
                  <button
                    type="button"
                    className="button primary"
                    onClick={
                      isReportScene
                        ? undefined
                        : (isInvestigationScene
                          ? handleInvestigationContinue
                          : handleContinueToInvestigation)
                    }
                    disabled={
                      isReportScene ||
                      (isInvestigationScene &&
                        !hasCompletedFinalStep &&
                        (!investigationDecision || !finalParentResponse.trim()))
                    }
                  >
                    {isReportScene ? 'Continue to Next Scenario' : 'Continue'}
                  </button>
                </div>
                {isReportScene ? <p className="next-scenario-note">Next scenario coming soon.</p> : null}
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
                    <li><strong>Reflection note:</strong> {voicemailLeadershipRecord.coachingNote}</li>
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
                    <li>
                      <strong>Reflection status:</strong>{' '}
                      {walkthroughLeadershipRecord.reflectionSaved ? 'Saved' : 'Pending'}
                    </li>
                  </ul>
                </article>
              ) : null}
            </div>
          </div>

          <details className="card vic-panel" open={isVicOpen} onToggle={(event) => setIsVicOpen(event.currentTarget.open)}>
            <summary>VIC Leadership Guidance</summary>
            <p>
              This is a high-emotion, high-risk parent communication. Do not begin by defending the
              school.
            </p>
            <p className="vic-structure-title">Strong leadership response structure:</p>
            <ol className="vic-structure-list">
              <li>Acknowledge the parent&apos;s concern and the child&apos;s emotional experience.</li>
              <li>Avoid making promises or assigning blame before gathering facts.</li>
              <li>Explain that you will review what happened with the teacher and relevant staff.</li>
              <li>Commit to a clear follow-up timeline.</li>
              <li>Keep the tone calm, respectful, and student-centered.</li>
            </ol>
            <p className="vic-note">
              Leadership Insight: In moments like this, you are not only answering an email. You are
              protecting trust between the school and the family.
            </p>
          </details>
        </aside>
      </div>
    </div>
  );
}
