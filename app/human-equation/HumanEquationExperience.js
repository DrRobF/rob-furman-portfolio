'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '../components/LanguageProvider';
import styles from './human-equation.module.css';
import { briefings, callTimingBriefings, setupOptions } from './data/mockScenario';
import { reportPreviewFixtures } from './data/reportPreviewFixtures';

const stages = ['intro', 'setup', 'incoming', 'active', 'report'];
const randomFrom = (items = []) => items[Math.floor(Math.random() * items.length)];
const briefingDepthOptions = ['low context', 'moderate context', 'detailed context'];
const HUMAN_EQUATION_BUILD_VERSION = '2026-05-15 GA-CLEAN-1';

const asText = (value, fallback = 'Unknown') => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
};

const toSafeList = (value, fallback = []) => {
  if (Array.isArray(value)) return value.filter((item) => typeof item === 'string' && item.trim());
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return fallback;
};

const safeTimeLabel = (timestamp) => {
  const parsed = new Date(timestamp);
  return Number.isNaN(parsed.getTime()) ? 'Unknown time' : parsed.toLocaleTimeString();
};


const FRAMEWORK_DIMENSIONS = [
  'Trust Construction',
  'Human Awareness',
  'Reality Anchoring',
  'Regulation Under Pressure',
  'Accountability Balance',
  'Vision & Change Leadership',
  'Instructional & Academic Leadership',
  'Team & Systems Leadership',
];

const normalizeStatus = (value) => {
  const text = asText(value, 'Developing').toLowerCase();
  if (text.includes('strong')) return 'Strong';
  if (text.includes('watch')) return 'Watch';
  return 'Developing';
};

const normalizeFrameworkAnalysis = (analysis) => {
  const byLabel = new Map();
  (Array.isArray(analysis) ? analysis : []).forEach((item) => {
    const label = asText(item?.label, '').trim();
    if (label) byLabel.set(label, item);
  });
  return FRAMEWORK_DIMENSIONS.map((label) => {
    const raw = byLabel.get(label) || {};
    const evidence = asText(raw?.evidence, '').trim();
    return {
      label,
      level: normalizeStatus(raw?.level),
      evidence: evidence || 'Limited evidence in this call.',
      summary: evidence ? evidence.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 1).join(' ') : 'Limited evidence in this call.',
    };
  });
};

const shortInsight = (value) => {
  const firstSentence = asText(value, '').split(/(?<=[.!?])\s+/).filter(Boolean)[0] || '';
  const compact = firstSentence.replace(/["“”]/g, '').trim();
  if (!compact) return '';
  const words = compact.split(/\s+/).slice(0, 7).join(' ');
  return words.replace(/[.,;:!?]+$/, '');
};

const coachingAnalysisSentences = (value) => {
  const base = asText(value, '').trim();
  if (!base) return ['No detailed coaching insight available for this dimension yet.'];
  const sentences = base.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 4);
  return sentences.length ? sentences : ['No detailed coaching insight available for this dimension yet.'];
};

const normalizePatternItems = (value) => (Array.isArray(value) ? value : []).map((item) => {
  if (typeof item === 'string') return { pattern: item, evidence: 'Evidence suggests this pattern appeared in the call.', implication: 'This may be worth revisiting in next coaching focus.' };
  return {
    pattern: asText(item?.pattern || item?.name || item?.label, 'Pattern signal'),
    evidence: asText(item?.evidence, 'Limited evidence in this call.'),
    implication: asText(item?.leadershipImplication || item?.implication, 'Evidence suggests a watch point for next coaching focus.'),
  };
});

const normalizeConversationTrajectory = (value) => {
  const raw = value && typeof value === 'object' ? value : {};
  return {
    startingParentState: asText(raw?.startingParentState, 'The parent began with visible concern and pressure signals.'),
    escalationPoints: asText(raw?.escalationPoints, 'Escalation points were limited in the captured transcript sample.'),
    containmentAttempts: asText(raw?.containmentAttempts, 'Containment attempts were present but not consistently explicit in language.'),
    turningPoint: asText(raw?.turningPoint, 'A clear turning point was not fully established; movement appeared gradual.'),
    endingState: asText(raw?.endingState, 'The conversation ended with partial alignment and open trust work.'),
    overallMovement: asText(raw?.overallMovement, 'Overall movement was mixed, with some structure gains and unresolved concerns.'),
  };
};

const TRANSCRIPT_EVENT_TYPES = new Set([
  'conversation.item.input_audio_transcription.completed',
  'conversation.item.created',
  'response.audio_transcript.done',
  'response.output_text.done',
  'response.done',
]);

const scenarioTypeProfiles = {
  discipline: {
    issueSummary: [
      'A discipline incident escalated quickly and now trust in school response is fragile.',
      'A behavior and safety concern is now driving parent pressure around fairness and accountability.',
    ],
    knownFacts: [
      'A behavior referral was submitted and at least one staff member documented direct observations.',
      'Students involved were separated and supervised after the incident.',
      'Initial parent communication occurred, but timing/content is being scrutinized.',
    ],
    staffReport: [
      "Teacher note: 'They were already arguing when I walked over. I separated them before it got physical.'",
      "Campus aide note: 'I got there after it started. I can confirm they were apart by the time admin arrived.'",
    ],
    studentStatements: [
      "Student A: 'I thought he was about to hit me, so I pushed him away.'",
      "Student B: 'He kept calling me out in front of everybody, and then it just went left.'",
    ],
    unknownFacts: [
      'Whether the parent believes consequences were equitable across students.',
      'Whether prior peer conflict or social media tension triggered the incident.',
    ],
    leadershipChallenge: [
      'Maintain trust while communicating safety, due process, and fair consequences without overstating unresolved facts.',
    ],
    priorActions: {
      light: 'Students were separated, basic supervision notes were logged, and initial family contact was attempted.',
      detailed: 'Staff and student statements were collected, supervision logs reviewed, and follow-up investigation checkpoints were documented.',
    },
    parentConcern: 'Their child may be unfairly blamed or unsafe with the same peers tomorrow.',
    mindset: 'Lead with fairness, process clarity, and concrete safety actions while holding boundaries.',
  },
  academic_concern: {
    issueSummary: [
      'The parent believes instruction, grading, or support quality is harming their child’s progress.',
      'Academic performance has shifted and the family is challenging whether classroom support is sufficient.',
    ],
    knownFacts: [
      'Recent grades or work samples show a noticeable change in performance.',
      'Teacher contact history exists but may feel insufficient to the parent.',
      'The student has identified at least one class task or expectation as a stress point.',
    ],
    staffReport: [
      "Teacher note: 'Missing work has piled up. I sent reminders, but I'm not sure those messages made it home.'",
      "Counselor note: 'Student shuts down on long assignments; timeline of when that started is still fuzzy.'",
    ],
    studentStatements: [
      "Student: 'I don't always get what the teacher wants, then I'm already behind.'",
      "Student: 'I keep trying to catch up, but every week it gets worse.'",
    ],
    unknownFacts: [
      'Whether concerns center more on rigor, clarity, or perceived teacher responsiveness.',
      'Which supports the family views as acceptable and realistic right now.',
    ],
    leadershipChallenge: [
      'Protect trust while separating grading/process facts from perception and building a concrete support plan.',
    ],
    priorActions: {
      light: 'Gradebook review started and recent assignment feedback was pulled for administrative review.',
      detailed: 'Recent graded work, assignment timelines, and teacher outreach logs were reviewed with initial support options outlined.',
    },
    parentConcern: 'Their child is falling behind academically and school support may be inconsistent.',
    mindset: 'Balance empathy with concrete academic next steps and measurable follow-up.',
  },
  attendance: {
    issueSummary: [
      'Attendance concerns are now tied to family stress, accountability, and student engagement risks.',
      'Repeated absences and tardies are affecting progress, and the family is seeking practical support over blame.',
    ],
    knownFacts: [
      'Attendance records show a pattern that now requires direct intervention.',
      'The student has missed instructional minutes that impact progress and belonging.',
      'Previous reminders or outreach have occurred with mixed follow-through.',
    ],
    staffReport: [
      "Attendance clerk note: 'It's been off-and-on for weeks, but some days they arrive and leave early without advance notice.'",
      "Teacher note: 'When they come back, they sit quiet and avoid work. We still don't have a consistent re-entry plan.'",
    ],
    studentStatements: [
      "Student: 'Mornings are chaos at home. Sometimes I miss the bus and just give up.'",
      "Student: 'After I miss one day, I feel lost, so coming back feels embarrassing.'",
    ],
    unknownFacts: [
      'Whether barriers are primarily logistical, health-related, or school climate-related.',
      'What immediate supports would most increase consistent attendance this week.',
    ],
    leadershipChallenge: [
      'Drive accountability without shame by pairing attendance expectations with barrier-solving and short-cycle follow-up.',
    ],
    priorActions: {
      light: 'Attendance reminders were sent and basic outreach attempts were made by school staff.',
      detailed: 'Attendance pattern review, outreach log review, and a draft support/check-in cadence were prepared before this call.',
    },
    parentConcern: 'Their child may be labeled negatively while the real barriers are not being addressed.',
    mindset: 'Stay nonjudgmental, focus on barrier-solving, and define shared accountability.',
  },
  teacher_complaint: {
    issueSummary: [
      'The parent is challenging a teacher interaction and expects administrative accountability.',
      'A classroom-practice complaint is raising concerns about communication, professionalism, and student trust.',
    ],
    knownFacts: [
      'A specific classroom interaction is being cited as disrespectful or unprofessional.',
      'The student has repeated the concern with strong emotional language at home.',
      'Administrator review has started, but full context may still be developing.',
    ],
    staffReport: [
      "Teacher note: 'I redirected the student for talking over others. I did not intend to embarrass them.'",
      "Assistant principal note: 'We have two witness accounts and they do not fully match yet.'",
    ],
    studentStatements: [
      "Student: 'She talked to me like I was the problem in front of everyone.'",
      "Student: 'I'm not saying anything in that class now. It's not worth it.'",
    ],
    unknownFacts: [
      'Whether this reflects an isolated moment or a pattern of classroom concerns.',
      'What resolution the parent expects: apology, reassignment, monitoring, or formal complaint steps.',
    ],
    leadershipChallenge: [
      'Acknowledge impact while protecting due process and communicating transparent professional accountability steps.',
    ],
    priorActions: {
      light: 'Initial administrative intake was completed and context gathering began with involved parties.',
      detailed: 'Initial interviews and classroom context review were completed, and formal follow-up steps were drafted.',
    },
    parentConcern: 'Their child may not be emotionally safe or respected by school adults.',
    mindset: 'Validate impact, avoid premature judgments, and explain the accountability process clearly.',
  },
};

const pickOne = (items = []) => randomFrom(items.filter(Boolean));

const communicationStyleGuidance = {
  direct: 'Set a clear agenda early and keep each response focused on decisions and next steps.',
  emotional: 'Lead with empathy, then transition quickly to facts, options, and follow-through.',
  passive_aggressive: 'Expect indirect pushback; stay neutral, name specifics, and keep redirecting to decisions.',
  negotiating: 'Use collaborative language while holding firm boundaries, ownership, and timelines.',
};

const parentToneGuidance = {
  full_blaze: 'Expect immediate escalation pressure; keep your tone calm and your language specific.',
  controlled_anger: 'Expect firm pushback; stay calm, specific, and timeline-focused.',
  exhausted: 'Parent may sound worn down and frustrated; acknowledge strain and provide concrete follow-through.',
  formal_procedural: 'Parent may focus on policy and process; be precise about steps and documentation.',
};

const intensityGuidance = {
  moderate: 'Set a steady pace and confirm shared understanding throughout the call.',
  high: 'Keep the call tightly structured and return often to actionable next steps.',
  full_blaze: 'Use short, calm responses and frequent resets to maintain control of the conversation.',
};

const toReadableLabel = (value, map, fallback = '') => map[value] ?? fallback;

const withIndefiniteArticle = (phrase = '') => {
  if (!phrase) return phrase;
  const firstWord = phrase.trim().split(/\s+/)[0]?.toLowerCase() ?? '';
  const useAn = ['a', 'e', 'i', 'o', 'u'].includes(firstWord[0]);
  return `${useAn ? 'an' : 'a'} ${phrase}`;
};

const guidedScenarioProfileMap = {
  student_safety: 'discipline',
  academic_conflict: 'academic_concern',
  behavior_discipline: 'discipline',
  parent_distrust: 'teacher_complaint',
  staff_conduct_concern: 'teacher_complaint',
  communication_breakdown: 'teacher_complaint',
  emotional_crisis: 'attendance',
};

const buildScenarioBriefing = (baseSetup, timingBriefing, interfaceLanguage = 'en') => {
  const scenarioProfileKey = guidedScenarioProfileMap[baseSetup.scenarioType] || baseSetup.scenarioType;
  const scenarioProfile = scenarioTypeProfiles[scenarioProfileKey] ?? scenarioTypeProfiles.discipline;
  const styleGuidance = toReadableLabel(baseSetup.communicationStyle, communicationStyleGuidance, 'Keep communication clear, practical, and next-step oriented.');
  const toneGuidance = toReadableLabel(baseSetup.parentTone, parentToneGuidance, 'Expect concern and pressure; keep your response calm and specific.');
  const intensityGuidanceText = toReadableLabel(baseSetup.intensity, intensityGuidance, 'Keep a steady cadence and confirm concrete next steps.');
  const dynamicFocus = [
    styleGuidance,
    toneGuidance,
    intensityGuidanceText,
    `Anchor decisions and next steps to the ${baseSetup.callTiming.toLowerCase()} context in ${withIndefiniteArticle(baseSetup.gradeBand.toLowerCase())} setting.`,
  ];
  if (interfaceLanguage === 'es') {
    return {
      issueSummary: `Resumen del caso: ${baseSetup.scenarioType}. Contexto: ${baseSetup.callType}.`,
      knownFacts: [
        `Responderás como ${baseSetup.role} en ${baseSetup.gradeBand}.`,
        `La llamada ocurre en el contexto: ${baseSetup.callTiming}.`,
        'La familia probablemente pedirá claridad sobre hechos confirmados y próximos pasos.',
      ],
      staffReport: ['El personal reporta un incidente que requiere claridad, calma y seguimiento administrativo.'],
      studentStatements: ['Existen versiones parciales del estudiante/familia que deben verificarse antes de conclusiones finales.'],
      unknownFacts: ['No está claro todo el contexto; aclara primero hechos, tiempos y acciones concretas.'],
      leadershipChallenge: 'Sostener confianza mientras comunicas proceso, límites y responsabilidad sin prometer resultados prematuros.',
      priorActions: {
        light: 'Se inició una revisión básica y se preparan próximos puntos de comunicación.',
        detailed: 'Se recopilaron datos iniciales y se definieron pasos de seguimiento con tiempos concretos.',
      },
      parentConcern: 'La familia teme que su hijo/a no esté seguro/a, escuchado/a o tratado/a con justicia.',
      suggestedMindset: 'Mantén calma, valida emoción y guía la conversación hacia decisiones concretas y seguimiento verificable.',
      contextFocus: [
        'Diferencia con precisión lo confirmado, lo pendiente y los próximos pasos.',
        'Asigna responsable + plazo para cada compromiso clave.',
        'Mantén lenguaje profesional, claro y sin defensividad.',
      ],
      primaryGoal: 'Alinear seguridad, claridad y plan de seguimiento sin escalar el conflicto.',
      timingSummary: 'Este informe previo se muestra en el idioma de la interfaz seleccionada.',
    };
  }

  return {
    issueSummary: `${pickOne(scenarioProfile.issueSummary)} (${baseSetup.scenarioType}; ${baseSetup.callType.toLowerCase()}).`,
    knownFacts: [
      `${scenarioProfile.knownFacts[0]} You are responding as the ${baseSetup.role.toLowerCase()} in ${withIndefiniteArticle(baseSetup.gradeBand.toLowerCase())} setting.`,
      `${scenarioProfile.knownFacts[1]} This call is taking place during ${baseSetup.callTiming.toLowerCase()}.`,
      `${scenarioProfile.knownFacts[2]} Parent is likely to press for clarity on both communication and next steps.`,
    ],
    staffReport: scenarioProfile.staffReport,
    studentStatements: scenarioProfile.studentStatements,
    unknownFacts: [
      `${scenarioProfile.unknownFacts[0]} Clarify this early, given the ${baseSetup.callTiming.toLowerCase()} timing pressure.`,
      `${scenarioProfile.unknownFacts[1]} Clarify expectations early so the call stays focused on decisions and follow-through.`,
    ],
    leadershipChallenge: pickOne(scenarioProfile.leadershipChallenge),
    priorActions: scenarioProfile.priorActions,
    parentConcern: `${scenarioProfile.parentConcern} Expect pressure for clear accountability, communication, and timelines.`,
    suggestedMindset: `${scenarioProfile.mindset} Keep your language practical, calm, and action-oriented for ${baseSetup.gradeBand.toLowerCase()} families.`,
    contextFocus: [...(timingBriefing.focus || []), ...dynamicFocus],
    primaryGoal: timingBriefing.goal,
    timingSummary: timingBriefing.summary,
  };
};

const optionLabelKeys = {
  teacher: 'he.teacher',
  assistant_principal: 'he.assistantPrincipal',
  principal: 'he.principal',
  elementary: 'he.elementary',
  middle_school: 'he.middleSchool',
  high_school: 'he.highSchool',
  parent_calls_unexpectedly: 'he.parentCallsUnexpectedly',
  you_call_after_investigation: 'he.youCallAfterInvestigation',
  morning_call_before_school: 'he.morningCallBeforeSchool',
  same_day_afternoon_parent_call: 'he.sameDayAfternoonParentCall',
  administrator_callback_after_initial_investigation: 'he.administratorCallbackAfterInvestigation',
  next_day_follow_up_call: 'he.nextDayFollowUpCall',
  student_safety: 'he.studentSafety',
  academic_conflict: 'he.academicConflict',
  behavior_discipline: 'he.behaviorDiscipline',
  parent_distrust: 'he.parentDistrust',
  staff_conduct_concern: 'he.staffConductConcern',
  communication_breakdown: 'he.communicationBreakdown',
  emotional_crisis: 'he.emotionalCrisis',
  moderate: 'he.moderate',
  high: 'he.high',
  full_blaze: 'he.fullBlaze',
  male: 'he.male',
  female: 'he.female',
  controlled_anger: 'he.controlledAnger',
  exhausted: 'he.exhausted',
  formal_procedural: 'he.formalProcedural',
  direct: 'he.direct',
  emotional: 'he.emotional',
  passive_aggressive: 'he.passiveAggressive',
  negotiating: 'he.negotiating',
  english: 'he.english',
  spanish: 'he.spanish',
  haitian_creole: 'he.haitianCreole',
  portuguese: 'he.portuguese',
};

export default function HumanEquationExperience() {
  const { t, language } = useLanguage();
  const translateOption = (option) => t(optionLabelKeys[option] ?? option);
  const [stage, setStage] = useState('intro');
  const [callStartedAt, setCallStartedAt] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [privateNotes, setPrivateNotes] = useState('');
  const [prepUnknownsNotes, setPrepUnknownsNotes] = useState('');
  const [callStatus, setCallStatus] = useState('Not connected');
  const [emotionalTemperature, setEmotionalTemperature] = useState('Escalated');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcriptLines, setTranscriptLines] = useState([]);
  const [callEndedAt, setCallEndedAt] = useState(null);
  const [setup, setSetup] = useState({
    role: setupOptions.roles[1],
    gradeBand: setupOptions.gradeBands[1],
    callType: 'you_call_after_investigation',
    callTiming: 'administrator_callback_after_initial_investigation',
    scenarioType: setupOptions.scenarioTypes[0],
    intensity: randomFrom(setupOptions.intensities),
    parentVoice: setupOptions.parentVoices[1],
    parentTone: setupOptions.parentTones[0],
    communicationStyle: setupOptions.communicationStyles[0],
    parentLanguage: setupOptions.parentLanguages[0],
    practiceMode: 'random',
    briefingDepth: 'moderate context',
  });
  const [isGuidedScenarioBuilt, setIsGuidedScenarioBuilt] = useState(false);
  const [micPermission, setMicPermission] = useState('Checking…');
  const [micError, setMicError] = useState('');
  const [hasMicrophone, setHasMicrophone] = useState(true);
  const [userAudioDetected, setUserAudioDetected] = useState(false);
  const [noiseWarning, setNoiseWarning] = useState('');
  const [micTestResult, setMicTestResult] = useState('');
  const [micTestVoiceDetected, setMicTestVoiceDetected] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [rtcDiagnostics, setRtcDiagnostics] = useState({
    micStreamStatus: 'missing',
    audioTrackCount: 0,
    firstTrackEnabled: 'n/a',
    firstTrackMuted: 'n/a',
    peerConnectionState: 'new',
    iceConnectionState: 'new',
    dataChannelState: 'closed',
    realtimeSessionStatus: 'not_started',
    peerConnectionCreated: false,
    dataChannelOpen: false,
    realtimeSessionStarted: false,
  });
  const [debugInfo, setDebugInfo] = useState({ selectedCards: null, simulationPrompt: '', promptPreview: '', promptSource: 'unknown', fallbackReason: null, dataCounts: { parentArchetypes: 0, issueCards: 0 }, buildVersion: 'server-realtime-session' });
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [previewFixtureId, setPreviewFixtureId] = useState(null);
  const [realtimeEventCounts, setRealtimeEventCounts] = useState({});
  const [guidedScenario, setGuidedScenario] = useState(null);
  const [coachingReport, setCoachingReport] = useState(null);
  const [coachingStatus, setCoachingStatus] = useState({ state: 'idle', source: 'none', fallbackReason: null });

  const pcRef = useRef(null);
  const micStreamRef = useRef(null);
  const audioElRef = useRef(null);
  const dcRef = useRef(null);
  const analyzerRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioDetectIntervalRef = useRef(null);
  const micTestIntervalRef = useRef(null);
  const micTestAudioContextRef = useRef(null);
  const callReadinessRef = useRef({
    remoteTrackReceived: false,
    audioPlayAttempted: false,
    audioPlayable: false,
    peerConnected: false,
    dataChannelOpen: false,
    parentOpeningTriggered: false,
  });
  const parentOpeningTimeoutRef = useRef(null);

  const callDuration = useMemo(() => {
    if (!callStartedAt) return '00:00';
    const seconds = Math.floor((now - callStartedAt) / 1000);
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  }, [callStartedAt, now]);

  const resolvedCallDuration = useMemo(() => {
    if (!callStartedAt) return '00:00';
    const endTime = callEndedAt || now;
    const seconds = Math.max(0, Math.floor((endTime - callStartedAt) / 1000));
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  }, [callEndedAt, callStartedAt, now]);

  useEffect(() => {
    if (stage !== 'active') return undefined;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [stage]);

  const nextStage = () => setStage(stages[Math.min(stages.indexOf(stage) + 1, stages.length - 1)]);

  const teardownCall = () => {
    if (parentOpeningTimeoutRef.current) clearTimeout(parentOpeningTimeoutRef.current);
    parentOpeningTimeoutRef.current = null;
    callReadinessRef.current = {
      remoteTrackReceived: false,
      audioPlayAttempted: false,
      audioPlayable: false,
      peerConnected: false,
      dataChannelOpen: false,
      parentOpeningTriggered: false,
    };
    dcRef.current?.close();
    pcRef.current?.getSenders().forEach((sender) => sender.track?.stop());
    pcRef.current?.close();
    micStreamRef.current?.getTracks().forEach((track) => track.stop());
    pcRef.current = null;
    micStreamRef.current = null;
    dcRef.current = null;
    if (audioElRef.current) audioElRef.current.srcObject = null;
    setCallStatus('Call ended');
    setIsSpeaking(false);
    setUserAudioDetected(false);
    setNoiseWarning('');
    if (audioDetectIntervalRef.current) clearInterval(audioDetectIntervalRef.current);
    if (micTestIntervalRef.current) clearInterval(micTestIntervalRef.current);
    analyzerRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
    micTestAudioContextRef.current?.close();
    micTestAudioContextRef.current = null;
  };

  const mapRealtimeRole = (role) => {
    if (role === 'assistant') return 'parent';
    if (role === 'user') return 'user';
    if (role === 'system') return 'system';
    return 'unknown';
  };

  const extractTranscriptEntries = (message) => {
    const eventType = asText(message?.type, '');
    const timestamp = Date.now();
    const candidates = [];
    const pushEntry = (id, role, text) => {
      const cleanText = typeof text === 'string' ? text.trim() : '';
      if (!cleanText) return;
      candidates.push({
        id: asText(id, `${eventType}-${timestamp}-${candidates.length}`),
        role: mapRealtimeRole(role),
        text: cleanText,
        timestamp,
        eventType,
      });
    };

    if (typeof message?.transcript === 'string') {
      pushEntry(message?.item_id || message?.id || 'event-transcript', message?.item?.role || message?.role || 'unknown', message.transcript);
    }
    if (typeof message?.text === 'string') {
      pushEntry(message?.item_id || `${eventType}-text`, message?.item?.role || message?.role || 'unknown', message.text);
    }
    if (typeof message?.delta === 'string') {
      pushEntry(message?.item_id || `${eventType}-delta`, message?.item?.role || message?.role || 'unknown', message.delta);
    }

    const responseOutput = Array.isArray(message?.response?.output) ? message.response.output : [];
    responseOutput.forEach((outputItem, index) => {
      const content = Array.isArray(outputItem?.content) ? outputItem.content : [];
      content.forEach((contentItem, contentIndex) => {
        if (typeof contentItem?.transcript === 'string') {
          pushEntry(outputItem?.id || `${outputItem?.role || 'unknown'}-${index}-${contentIndex}`, outputItem?.role, contentItem.transcript);
        }
        if (typeof contentItem?.text === 'string') {
          pushEntry(outputItem?.id || `${outputItem?.role || 'unknown'}-${index}-${contentIndex}-text`, outputItem?.role, contentItem.text);
        }
      });
    });

    if (typeof message?.response?.output_text === 'string') {
      pushEntry(message?.response?.id || `${eventType}-response-output-text`, 'assistant', message.response.output_text);
    }

    if (eventType === 'conversation.item.input_audio_transcription.completed') {
      pushEntry(message?.item_id || message?.id || 'user-transcription', 'user', message?.transcript);
    }

    if (eventType === 'conversation.item.created') {
      const item = message?.item;
      const content = Array.isArray(item?.content) ? item.content : [];
      content.forEach((contentItem, index) => {
        if (typeof contentItem?.transcript === 'string') pushEntry(item?.id || `item-${index}`, item?.role, contentItem.transcript);
        if (typeof contentItem?.text === 'string') pushEntry(item?.id || `item-text-${index}`, item?.role, contentItem.text);
      });
    }
    const deduped = [];
    const seen = new Set();
    candidates.forEach((entry) => {
      const key = `${entry.role}::${entry.text}`;
      if (seen.has(key)) return;
      seen.add(key);
      deduped.push(entry);
    });
    return deduped;
  };

  useEffect(() => {
    const assessMicReadiness = async () => {
      try {
        if (!navigator?.mediaDevices?.enumerateDevices) return;
        const devices = await navigator.mediaDevices.enumerateDevices();
        const mics = devices.filter((d) => d.kind === 'audioinput');
        setHasMicrophone(mics.length > 0);
        if (mics.length === 0) {
          setMicError('No microphone found. Connect a mic and refresh before starting the call.');
        }
      } catch {
        setMicPermission('Unknown');
      }
    };

    const trackPermission = async () => {
      if (!navigator.permissions?.query) {
        setMicPermission('Unknown');
        await assessMicReadiness();
        return;
      }
      try {
        const status = await navigator.permissions.query({ name: 'microphone' });
        const apply = () => {
          setMicPermission(status.state);
          if (status.state === 'denied') {
            setMicError('Microphone permission is denied. Enable microphone access in your browser settings.');
          } else if (status.state !== 'denied') {
            setMicError('');
          }
        };
        apply();
        status.onchange = apply;
      } catch {
        setMicPermission('Unknown');
      } finally {
        await assessMicReadiness();
      }
    };

    trackPermission();
  }, []);

  const ensureMicStream = async () => {
    console.log('HUMAN_EQUATION_MIC_REQUEST_START');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioTracks = stream.getAudioTracks();
    console.log('HUMAN_EQUATION_MIC_REQUEST_SUCCESS');
    console.log('HUMAN_EQUATION_AUDIO_TRACKS', {
      count: audioTracks.length,
      enabled: audioTracks[0]?.enabled ?? null,
      muted: audioTracks[0]?.muted ?? null,
    });
    setMicPermission('granted');
    setMicError('');
    setRtcDiagnostics((prev) => ({
      ...prev,
      micStreamStatus: stream.active ? 'active' : 'inactive',
      audioTrackCount: audioTracks.length,
      firstTrackEnabled: String(audioTracks[0]?.enabled ?? 'n/a'),
      firstTrackMuted: String(audioTracks[0]?.muted ?? 'n/a'),
    }));
    return stream;
  };

  const beginCall = async () => {
    console.log('HUMAN_EQUATION_BEGIN_CALL');
    setCallStartedAt(Date.now());
    setTranscriptLines([]);
    setDebugInfo({ selectedCards: null, simulationPrompt: '', promptPreview: '', promptSource: 'unknown', fallbackReason: null, dataCounts: { parentArchetypes: 0, issueCards: 0 }, buildVersion: 'server-realtime-session' });
    setShowDebugPanel(false);
    setRealtimeEventCounts({});
    setCallEndedAt(null);
    setCallStatus('Connecting…');
    setEmotionalTemperature('Escalated');
    setStage('active');
    setSessionError('');
    setRtcDiagnostics((prev) => ({
      ...prev,
        peerConnectionCreated: false,
      dataChannelOpen: false,
      realtimeSessionStarted: false,
      realtimeSessionStatus: 'not_started',
    }));

    try {
      callReadinessRef.current = {
        remoteTrackReceived: false,
        audioPlayAttempted: false,
        audioPlayable: false,
        peerConnected: false,
        dataChannelOpen: false,
        parentOpeningTriggered: false,
      };
      const triggerParentOpeningWhenReady = () => {
        const readiness = callReadinessRef.current;
        if (readiness.parentOpeningTriggered) return;
        const readyForOpening = readiness.remoteTrackReceived
          && readiness.audioPlayAttempted
          && readiness.peerConnected
          && readiness.dataChannelOpen;
        if (!readyForOpening) return;
        readiness.parentOpeningTriggered = true;
        console.log('HUMAN_EQUATION_PARENT_OPENING_READINESS_CONFIRMED');
        parentOpeningTimeoutRef.current = setTimeout(() => {
          const dc = dcRef.current;
          if (!dc || dc.readyState !== 'open') return;
          console.log('HUMAN_EQUATION_PARENT_OPENING_TRIGGERED');
          dc.send(JSON.stringify({
            type: 'response.create',
            response: {
              modalities: ['audio', 'text'],
            },
          }));
        }, 700);
      };
      const stream = micStreamRef.current?.active ? micStreamRef.current : await ensureMicStream();
      micStreamRef.current = stream;
      const audioTracks = stream.getAudioTracks();
      if (!audioTracks.length) {
        throw new Error('Microphone is not connected to the call. Check browser permission or try headphones.');
      }

      const pc = new RTCPeerConnection();
      console.log('HUMAN_EQUATION_PEER_CONNECTION_CREATED');
      pcRef.current = pc;
      setRtcDiagnostics((prev) => ({
        ...prev,
        peerConnectionCreated: true,
      }));
      pc.onconnectionstatechange = () => {
        console.log('HUMAN_EQUATION_PEER_CONNECTION_STATE', pc.connectionState);
        if (pc.connectionState === 'connected' || pc.iceConnectionState === 'connected') {
          console.log('HUMAN_EQUATION_PEER_OR_ICE_CONNECTED');
          callReadinessRef.current.peerConnected = true;
          triggerParentOpeningWhenReady();
        }
        setRtcDiagnostics((prev) => ({ ...prev, peerConnectionState: pc.connectionState, iceConnectionState: pc.iceConnectionState }));
      };
      pc.oniceconnectionstatechange = () => {
        console.log('HUMAN_EQUATION_ICE_CONNECTION_STATE', pc.iceConnectionState);
        if (pc.iceConnectionState === 'connected') {
          console.log('HUMAN_EQUATION_PEER_OR_ICE_CONNECTED');
          callReadinessRef.current.peerConnected = true;
          triggerParentOpeningWhenReady();
        }
        setRtcDiagnostics((prev) => ({ ...prev, iceConnectionState: pc.iceConnectionState }));
      };

      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      audioEl.playsInline = true;
      audioEl.muted = false;
      console.log('HUMAN_EQUATION_REMOTE_AUDIO_ELEMENT_CREATED');
      audioElRef.current = audioEl;
      pc.ontrack = async (e) => {
        console.log('HUMAN_EQUATION_REMOTE_AUDIO_TRACK_RECEIVED');
        callReadinessRef.current.remoteTrackReceived = true;
        audioEl.srcObject = e.streams[0];
        callReadinessRef.current.audioPlayAttempted = true;
        console.log('HUMAN_EQUATION_AUDIO_PLAY_ATTEMPTED');
        try {
          await audioEl.play();
          callReadinessRef.current.audioPlayable = true;
          console.log('HUMAN_EQUATION_AUDIO_PLAY_SUCCESS');
        } catch (playError) {
          console.log('HUMAN_EQUATION_AUDIO_PLAY_FAILURE', playError);
        }
        triggerParentOpeningWhenReady();
      };

      pc.addTrack(audioTracks[0]);

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      audioContextRef.current = audioContext;
      analyzerRef.current = analyser;
      const bins = new Uint8Array(analyser.frequencyBinCount);
      audioDetectIntervalRef.current = setInterval(() => {
        analyser.getByteFrequencyData(bins);
        const avg = bins.reduce((sum, val) => sum + val, 0) / bins.length;
        setUserAudioDetected(avg > 18);
        setNoiseWarning(avg > 48 ? 'Background noise may be interfering. Move to a quieter room if possible.' : '');
      }, 300);

      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;
      setRtcDiagnostics((prev) => ({ ...prev, dataChannelState: dc.readyState, realtimeSessionStatus: 'connecting' }));
      dc.onopen = () => {
        console.log('HUMAN_EQUATION_DATA_CHANNEL_OPEN');
        callReadinessRef.current.dataChannelOpen = true;
        triggerParentOpeningWhenReady();
        setCallStatus('Live call connected');
        setRtcDiagnostics((prev) => ({ ...prev, dataChannelState: dc.readyState, dataChannelOpen: true, realtimeSessionStatus: 'connected' }));
        console.log('HUMAN_EQUATION_REALTIME_CONNECTED');
      };

      dc.onmessage = (event) => {
        try {
          const rawPayload = typeof event?.data === 'string' ? event.data : '';
          if (!rawPayload) return;

          let message = null;
          try {
            message = JSON.parse(rawPayload);
          } catch (parseError) {
            console.log('HUMAN_EQUATION_DATA_CHANNEL_PARSE_ERROR', parseError);
            return;
          }

          const eventType = asText(message?.type, '');
          if (!eventType) return;

          setRealtimeEventCounts((prev) => ({
            ...prev,
            [eventType]: (prev[eventType] || 0) + 1,
          }));

          switch (eventType) {
            case 'response.audio.delta':
            case 'output_audio_buffer.started':
              setIsSpeaking(true);
              return;
            case 'output_audio_buffer.stopped':
              setIsSpeaking(false);
              return;
            case 'response.done': {
              const transcriptEntries = extractTranscriptEntries(message);
              if (transcriptEntries.length) {
                setTranscriptLines((prev) => [...prev, ...transcriptEntries]);
              }
              const fullText = rawPayload.toLowerCase();
              if (fullText.includes('i hear you') || fullText.includes('thank you for explaining')) {
                setEmotionalTemperature('Stabilizing');
              }
              return;
            }
            case 'conversation.item.input_audio_transcription.completed':
            case 'conversation.item.created':
            case 'response.audio_transcript.done':
            case 'response.output_text.done': {
              const transcriptEntries = extractTranscriptEntries(message);
              if (transcriptEntries.length) {
                setTranscriptLines((prev) => [...prev, ...transcriptEntries]);
              }
              return;
            }
            case 'input_audio_buffer.speech_started':
            case 'input_audio_buffer.speech_stopped':
              // Presence-only events for debugging/diagnostics.
              return;
            default:
              if (TRANSCRIPT_EVENT_TYPES.has(eventType)) {
                const transcriptEntries = extractTranscriptEntries(message);
                if (transcriptEntries.length) {
                  setTranscriptLines((prev) => [...prev, ...transcriptEntries]);
                }
              }
              // Ignore unknown realtime event types so new API events cannot crash the UI.
              return;
          }
        } catch (handlerError) {
          console.log('HUMAN_EQUATION_DATA_CHANNEL_HANDLER_ERROR', handlerError);
        }
      };
      dc.onclose = () => setRtcDiagnostics((prev) => ({ ...prev, dataChannelState: 'closed' }));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log('HUMAN_EQUATION_SDP_OFFER_CREATED');
      const localSdp = offer.sdp;
      if (!localSdp) throw new Error('Local SDP offer is missing.');

      console.log('HUMAN_EQUATION_SDP_REQUEST_START');
      const sdpRes = await fetch('/api/human-equation/realtime-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp',
          'x-simulation-setup': JSON.stringify(setup),
        },
        body: localSdp,
      });
      console.log('HUMAN_EQUATION_SDP_REQUEST_STATUS', sdpRes.status);
      const answerText = await sdpRes.text();
      if (!sdpRes.ok) {
        throw new Error(answerText || `Realtime SDP exchange failed (${sdpRes.status}).`);
      }

      const answer = { type: 'answer', sdp: answerText };
      console.log('HUMAN_EQUATION_SDP_ANSWER_RECEIVED');
      await pc.setRemoteDescription(answer);
      console.log('HUMAN_EQUATION_SET_REMOTE_DESCRIPTION_SUCCESS');
      setRtcDiagnostics((prev) => ({ ...prev, realtimeSessionStarted: true, realtimeSessionStatus: 'started' }));

      setDebugInfo({
        selectedCards: null,
        simulationPrompt: 'Prompt is injected server-side from simulation cards.',
        promptPreview: 'Prompt is injected server-side from simulation cards.',
        promptSource: 'json/card builder',
        fallbackReason: null,
        dataCounts: { parentArchetypes: 0, issueCards: 0 },
        buildVersion: 'server-realtime-session',
      });
    } catch (error) {
      console.log('HUMAN_EQUATION_SESSION_REQUEST_ERROR', error);
      setRtcDiagnostics((prev) => ({ ...prev, realtimeSessionStatus: 'failed' }));
      if (/session|realtime|token/i.test(error?.message || '')) {
        setSessionError(`Realtime session failed to start: ${error.message}`);
      }
      console.log('HUMAN_EQUATION_MIC_REQUEST_ERROR', error);
      if (error?.name === 'NotAllowedError') {
        setMicPermission('denied');
      }
      if (error?.name === 'NotAllowedError' || /Microphone is not connected/.test(error?.message || '')) {
        setMicError('Microphone is not connected to the call. Check browser permission or try headphones.');
      }
      setCallStatus(`Connection failed: ${error.message}`);
      teardownCall();
    }
  };

  const testMicrophone = async () => {
    setMicTestResult('Requesting microphone…');
    setMicTestVoiceDetected(false);
    try {
      const stream = await ensureMicStream();
      micStreamRef.current = stream;
      const audioTracks = stream.getAudioTracks();
      setMicTestResult(`Stream received. Audio tracks: ${audioTracks.length}`);
      if (micTestIntervalRef.current) clearInterval(micTestIntervalRef.current);
      micTestAudioContextRef.current?.close();
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      micTestAudioContextRef.current = audioContext;
      const bins = new Uint8Array(analyser.frequencyBinCount);
      micTestIntervalRef.current = setInterval(() => {
        analyser.getByteFrequencyData(bins);
        const avg = bins.reduce((sum, val) => sum + val, 0) / bins.length;
        setMicTestVoiceDetected(avg > 18);
      }, 250);
    } catch (error) {
      console.log('HUMAN_EQUATION_MIC_REQUEST_ERROR', error);
      setMicTestResult(`Mic test failed: ${error.message}`);
      setMicError('Microphone is not connected to the call. Check browser permission or try headphones.');
    }
  };


  const requestCoachingReport = ({ setupSnapshot, notesSnapshot, prepUnknownsSnapshot, durationSnapshot, endedAt, transcriptSnapshot }) => {
    setCoachingStatus({ state: 'loading', source: 'pending', fallbackReason: null });
    setCoachingReport(null);
    setCallEndedAt(endedAt);
    setStage('report');

    fetch('/api/human-equation/post-call-coaching', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        setup: setupSnapshot,
        privateNotes: notesSnapshot,
        prepUnknownsNotes: prepUnknownsSnapshot,
        callDuration: durationSnapshot,
        callEndedAt: endedAt,
        transcriptLines: transcriptSnapshot,
        interfaceLanguage: language,
      }),
    })
      .then((res) => res.json())
      .then((report) => {
        setCoachingReport(report);
        setCoachingStatus({ state: 'ready', source: asText(report?.source, 'unknown'), fallbackReason: report?.fallbackReason || null });
      })
      .catch(() => {
        setCoachingStatus({ state: 'ready', source: 'local-fallback', fallbackReason: 'request-failed' });
      });
  };

  const launchReportPreview = (fixture) => {
    if (!fixture) return;
    const endedAt = Date.now();
    const fixtureSetup = {
      ...setup,
      scenarioType: asText(fixture?.metadata?.scenarioType, setup.scenarioType),
      callType: asText(fixture?.metadata?.issueType, setup.callType),
      callTiming: asText(fixture?.metadata?.callTiming, setup.callTiming),
      role: asText(fixture?.metadata?.role, setup.role),
      gradeBand: asText(fixture?.metadata?.gradeBand, setup.gradeBand),
      parentLanguage: asText(fixture?.metadata?.parentLanguage, setup.parentLanguage),
    };
    const normalizedTranscript = Array.isArray(fixture?.transcript)
      ? fixture.transcript.map((line, index) => ({
        id: asText(line?.id, `preview-${fixture.id || 'fixture'}-${index}`),
        role: asText(line?.role, 'unknown'),
        text: asText(line?.text, ''),
        timestamp: Number.isNaN(new Date(line?.timestamp).getTime()) ? endedAt : new Date(line.timestamp).getTime(),
        eventType: asText(line?.eventType, 'preview-sample'),
      })).filter((line) => line.text)
      : [];

    setPreviewFixtureId(asText(fixture?.id, null));
    setSetup(fixtureSetup);
    setPrivateNotes(asText(fixture?.privateNotes, ''));
    setPrepUnknownsNotes(asText(fixture?.prepUnknownsNotes, ''));
    setCallStartedAt(endedAt - 12 * 60 * 1000);
    setTranscriptLines(normalizedTranscript);
    teardownCall();

    requestCoachingReport({
      setupSnapshot: fixtureSetup,
      notesSnapshot: asText(fixture?.privateNotes, ''),
      prepUnknownsSnapshot: asText(fixture?.prepUnknownsNotes, ''),
      durationSnapshot: '12:00',
      endedAt,
      transcriptSnapshot: normalizedTranscript,
    });
  };

  const endCall = () => {
    const endedAt = Date.now();
    const transcriptSnapshot = transcriptLines.map((line) => ({ role: line.role, text: line.text, timestamp: line.timestamp, eventType: line.eventType }));
    const setupSnapshot = { ...setup, prepUnknownsNotes };
    const notesSnapshot = privateNotes;
    const prepUnknownsSnapshot = prepUnknownsNotes;
    const durationSnapshot = resolvedCallDuration;

    teardownCall();
    requestCoachingReport({
      setupSnapshot,
      notesSnapshot,
      prepUnknownsSnapshot,
      durationSnapshot,
      endedAt,
      transcriptSnapshot,
    });
  };

  const copyTranscript = async () => {
    const transcriptText = transcriptLines.map((line) => `[${new Date(line.timestamp).toLocaleTimeString()}] (${line.role}) ${line.text}`).join('\n');
    try {
      await navigator.clipboard.writeText(transcriptText);
    } catch (error) {
      console.log('HUMAN_EQUATION_COPY_TRANSCRIPT_ERROR', error);
    }
  };

  const downloadFullReport = () => {
    const fallback = 'Not available';
    const stamp = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    const fileName = `human-equation-report-${stamp.getFullYear()}-${pad(stamp.getMonth() + 1)}-${pad(stamp.getDate())}-${pad(stamp.getHours())}${pad(stamp.getMinutes())}.md`;
    const scenarioMeta = [
      `- Scenario: ${translateOption(setup.scenarioType) || fallback}`,
      `- Parent: ${setup.parentVoice === 'male' ? 'Mr. Carter' : 'Ms. Rodriguez'}`,
      `- Issue: ${translateOption(setup.callType) || fallback}`,
      `- Call duration: ${resolvedCallDuration || fallback}`,
      `- Parent language: ${translateOption(setup.parentLanguage) || fallback}`,
    ];
    const optionalSections = [];
    if (coachingReport?.conversationTrajectory) {
      optionalSections.push([
        '## Conversation Trajectory',
        `- Starting Parent State: ${conversationTrajectory.startingParentState || fallback}`,
        `- Escalation Points: ${conversationTrajectory.escalationPoints || fallback}`,
        `- Containment / Stabilization Attempts: ${conversationTrajectory.containmentAttempts || fallback}`,
        `- Turning Point: ${conversationTrajectory.turningPoint || fallback}`,
        `- Ending State: ${conversationTrajectory.endingState || fallback}`,
        `- Overall Movement: ${conversationTrajectory.overallMovement || fallback}`,
      ].join('\n'));
    }
    if (privateNotes || coachingReport?.privateAdministratorNotes) {
      optionalSections.push(`## Private Administrator Notes\n${privateNotes || coachingReport?.privateAdministratorNotes || fallback}`);
    }
    if (prepUnknownsNotes) {
      optionalSections.push(`## Questions / Unknowns to Clarify\n${prepUnknownsNotes || fallback}`);
    }
    const leadershipSection = frameworkAnalysis.length
      ? frameworkAnalysis.map((item) => `### ${item.label}\n- Level: ${item.level || fallback}\n- Summary: ${item.summary || fallback}\n- Evidence: ${item.evidence || fallback}`).join('\n\n')
      : fallback;
    const parentPatternSection = parentPatterns.length
      ? parentPatterns.map((item) => `- **${item.pattern || fallback}**\n  - Evidence: ${item.evidence || fallback}\n  - Leadership implication: ${item.implication || fallback}`).join('\n')
      : fallback;
    const transcriptSection = transcriptLines.length
      ? transcriptLines.map((line) => `- [${safeTimeLabel(line.timestamp)}] (${line.role || 'unknown'}) ${line.text || fallback}`).join('\n')
      : fallback;
    const markdown = [
      '# Human Equation Post-Call Report',
      '',
      '## Scenario metadata',
      ...scenarioMeta,
      '',
      '## Executive Summary',
      conciseExecutiveSummary || fallback,
      '',
      ...optionalSections.flatMap((section) => [section, '']),
      '## Human Equation Leadership Analysis',
      leadershipSection,
      '',
      '## Parent Pattern Analysis',
      parentPatternSection,
      '',
      '## Moments to Revisit',
      momentsToRevisit.length ? momentsToRevisit.map((item) => `- ${item || fallback}`).join('\n') : fallback,
      '',
      '## Stronger Alternative Phrasing',
      strongerPhrasing.length ? strongerPhrasing.map((item) => `- ${item || fallback}`).join('\n') : fallback,
      '',
      '## Suggested Follow-Up Plan',
      followUpPlan.length ? followUpPlan.map((item) => `- ${item || fallback}`).join('\n') : fallback,
      '',
      '## Full Transcript',
      transcriptSection,
      '',
    ].join('\n');
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const startNewCall = () => {
    setTranscriptLines([]);
    setCoachingReport(null);
    setCoachingStatus({ state: 'idle', source: 'none', fallbackReason: null });
    setPrivateNotes('');
    setPrepUnknownsNotes('');
    setCallStartedAt(null);
    setCallEndedAt(null);
    setCallStatus('Not connected');
    setPreviewFixtureId(null);
    setEmotionalTemperature('Escalated');
    setStage('setup');
  };

  const setField = (key, value) => {
    setSetup((prev) => {
      if (prev.practiceMode === 'guided') setIsGuidedScenarioBuilt(false);
      return { ...prev, [key]: value };
    });
  };

  const randomizeScenario = () => {
    const randomCallType = randomFrom(setupOptions.callTypes);
    const randomCallTiming = randomFrom(setupOptions.callTimings);
    const isCallbackStyle = /callback|after[- ]?investigation/i.test(`${randomCallType} ${randomCallTiming}`);
    const isSurpriseStyle = /unexpected|surprise|drop[- ]?in/i.test(`${randomCallType} ${randomCallTiming}`);
    let randomizedBriefingDepth = randomFrom(briefingDepthOptions);
    if (isCallbackStyle) randomizedBriefingDepth = randomFrom(['moderate context', 'detailed context', 'detailed context']);
    if (isSurpriseStyle) randomizedBriefingDepth = randomFrom(['low context', 'low context', 'moderate context']);
    setSetup((prev) => ({
      ...prev,
      role: randomFrom(setupOptions.roles),
      gradeBand: randomFrom(setupOptions.gradeBands),
      callType: randomCallType,
      callTiming: randomCallTiming,
      scenarioType: randomFrom(setupOptions.scenarioTypes),
      intensity: randomFrom(setupOptions.intensities),
      parentVoice: randomFrom(setupOptions.parentVoices),
      parentTone: randomFrom(setupOptions.parentTones),
      communicationStyle: randomFrom(setupOptions.communicationStyles),
      parentLanguage: randomFrom(setupOptions.parentLanguages),
      practiceMode: 'random',
      briefingDepth: randomizedBriefingDepth,
      scenarioNonce: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    }));
  };

  const handleStartRandomCall = () => {
    setSetup((prev) => ({ ...prev, practiceMode: 'random', parentLanguage: randomFrom(setupOptions.parentLanguages) }));
    setIsGuidedScenarioBuilt(false);
    randomizeScenario();
    setStage('setup');
  };

  const handleConfigurePractice = () => {
    setSetup((prev) => ({ ...prev, practiceMode: 'guided', callType: 'you_call_after_investigation', callTiming: 'administrator_callback_after_initial_investigation', briefingDepth: 'detailed context', parentLanguage: prev.parentLanguage || setupOptions.parentLanguages[0], intensity: randomFrom(setupOptions.intensities), parentTone: randomFrom(setupOptions.parentTones), communicationStyle: randomFrom(setupOptions.communicationStyles) }));
    setIsGuidedScenarioBuilt(false);
    setStage('setup');
  };

  const regenerateParentProfile = () => {
    setSetup((prev) => ({
      ...prev,
      intensity: randomFrom(setupOptions.intensities),
      parentVoice: randomFrom(setupOptions.parentVoices),
      parentTone: randomFrom(setupOptions.parentTones),
      communicationStyle: randomFrom(setupOptions.communicationStyles),
      parentProfileNonce: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    }));
    if (setup.practiceMode === 'guided') setIsGuidedScenarioBuilt(false);
  };

  const buildGuidedScenario = () => {
    const forcedGuidedSetup = {
      ...setup,
      practiceMode: 'guided',
      callType: 'you_call_after_investigation',
      callTiming: 'administrator_callback_after_initial_investigation',
      briefingDepth: 'detailed context',
    };
    const timingBriefing = callTimingBriefings?.[forcedGuidedSetup.callTiming] ?? {
      summary: 'Context briefing unavailable.',
      goal: 'Clarify the call context and establish next steps.',
      focus: [],
    };
    const generatedScenario = buildScenarioBriefing(forcedGuidedSetup, timingBriefing, language);

    console.log('HUMAN_EQUATION_GUIDED_SELECTED_VALUES', forcedGuidedSetup);
    console.log('HUMAN_EQUATION_GUIDED_GENERATED_SCENARIO', generatedScenario);
    setGuidedScenario(generatedScenario);
    setSetup((prev) => ({
      ...forcedGuidedSetup,
      scenarioNonce: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    }));
    setIsGuidedScenarioBuilt(true);
  };
  const isUnexpectedCall = setup.practiceMode === 'random' && setup.briefingDepth === 'low context';
  const isDetailedBriefing = setup.briefingDepth === 'detailed context';
  const selectedTimingBriefing = callTimingBriefings?.[setup.callTiming] ?? {
    summary: 'Context briefing unavailable.',
    goal: 'Clarify the call context and establish next steps.',
    focus: [],
  };
  const randomScenarioBriefing = useMemo(() => {
    if (setup.practiceMode !== 'random') return null;
    return buildScenarioBriefing(setup, selectedTimingBriefing, language);
  }, [setup, selectedTimingBriefing, language]);
  const activeBriefing = setup.practiceMode === 'guided' && guidedScenario ? guidedScenario : randomScenarioBriefing;

  const frameworkAnalysis = normalizeFrameworkAnalysis(coachingReport?.humanEquationLeadershipAnalysis);
  const parentPatterns = normalizePatternItems(coachingReport?.parentPatternAnalysis);
  const conciseExecutiveSummary = asText(coachingReport?.executiveSummary, 'Summary unavailable.').split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 4).join(' ');
  const followUpPlan = toSafeList(coachingReport?.suggestedFollowUpPlan);
  const strongerPhrasing = toSafeList(coachingReport?.strongerAlternativePhrasing);
  const momentsToRevisit = toSafeList(coachingReport?.momentsToRevisit);
  const conversationTrajectory = normalizeConversationTrajectory(coachingReport?.conversationTrajectory);

  return (
    <section className={styles.shell}>
      <div className={styles.content}>
        {stage === 'intro' && (
          <div className={styles.panel}>
            <p className={styles.eyebrow}>The Human Equation</p>
            <h1>{t('he.practiceHeading')}</h1>
            <p className={styles.lead}>{t('he.introLead')}</p>
            <div className={styles.valueGrid}>
              <article><h3>{t('he.stayCalm')}</h3></article>
              <article><h3>{t('he.practiceDynamics')}</h3></article>
              <article><h3>{t('he.reviewReport')}</h3></article>
            </div>
            <div className={styles.pathChoiceGrid}>
              <button type="button" className={`${styles.pathCard} ${styles.pathCardPrimary}`} onClick={handleStartRandomCall}>
                <p className={styles.pathTitle}>{t('he.randomCall')}</p>
                <p>{t('he.randomCardBody')}</p>
                <span className={styles.ctaMini}>{t('he.startRandomCall')}</span>
              </button>
              <button type="button" className={`${styles.pathCard} ${styles.pathCardSecondary}`} onClick={handleConfigurePractice}>
                <p className={styles.pathTitle}>{t('he.guidedPractice')}</p>
                <p>{t('he.guidedCardBody')}</p>
                <span className={styles.secondaryMini}>{t('he.configurePractice')}</span>
              </button>
            </div>
          </div>
        )}
        {stage === 'setup' && (
          <div className={styles.panel}>
            <p className={styles.eyebrow}>{t('he.simulationSetup')}</p>
            <h2>{setup.practiceMode === 'random' ? t('he.randomCall') : t('he.guidedPractice')}</h2>
            {setup.practiceMode === 'random' && <p className={styles.variationNote}>{t('he.randomizedNote')}</p>}
            {setup.practiceMode === 'random' && (
              <>
                <label className={styles.notesLabel}>{t('he.privateAdminNotes')}</label>
                <textarea className={styles.notes} placeholder={t('he.notesPlaceholderSetup')} value={privateNotes} onChange={(e) => setPrivateNotes(e.target.value)} />
              </>
            )}
            {setup.practiceMode === 'guided' && (
              <>
                <h3 className={styles.stageHeadline}>{t('he.guidedCallbackHeadline')}</h3>
                <p>{t('he.guidedCallbackFraming')}</p>
                <p className={styles.subtle}>{t('he.guidedCallbackSupportLine')}</p>
                <div className={styles.guidedLayout}>
                  <div className={styles.setupPanel}>
                    <p className={styles.panelTitle}>{t('he.practiceSetupPanel')}</p>
                    <div className={styles.setupGrid}>
                      <Selector label={t('he.role')} options={setupOptions.roles} translateOption={translateOption} value={setup.role} onSelect={(value) => setField('role', value)} />
                      <Selector label={t('he.gradeBand')} options={setupOptions.gradeBands} translateOption={translateOption} value={setup.gradeBand} onSelect={(value) => setField('gradeBand', value)} />
                      <Selector label={t('he.scenarioType')} options={setupOptions.scenarioTypes} translateOption={translateOption} value={setup.scenarioType} onSelect={(value) => setField('scenarioType', value)} />
                      <Selector label={t('he.parentLanguage')} options={setupOptions.parentLanguages} translateOption={translateOption} value={setup.parentLanguage} onSelect={(value) => setField('parentLanguage', value)} />
                    </div>
                    <label className={styles.notesLabel}>{t('he.privateAdminNotes')}</label>
                    <textarea className={`${styles.notes} ${styles.setupNotes}`} placeholder={t('he.notesPlaceholderSetup')} value={privateNotes} onChange={(e) => setPrivateNotes(e.target.value)} />
                    <div className={styles.setupActions}>
                      <button type="button" className={styles.cta} onClick={buildGuidedScenario}>{t('he.generateBriefing')}</button>
                    </div>
                  </div>
                  <div className={styles.briefingPanel}>
                    {!isGuidedScenarioBuilt ? (
                      <div className={styles.briefingCard}>
                        <p className={styles.panelTitle}>{t('he.callbackBriefingPreview')}</p>
                        <p className={styles.contextLabel}><strong>{t('he.statusLabel')}:</strong> {t('he.waitingForBriefing')}</p>
                        <p>{t('he.previewBriefingNote')}</p>
                        <ul className={styles.lockedList}>
                          <li><strong>{t('he.knownFacts')}:</strong> {t('he.lockedAfterBriefing')}</li>
                          <li><strong>{t('he.parentConcernFear')}:</strong> {t('he.lockedAfterBriefing')}</li>
                        </ul>
                      </div>
                    ) : (
                      <div className={styles.briefingCard}>
                        <h3>{t('he.preCallBriefing')}</h3>
                        <p className={styles.contextLabel}><strong>{t('he.path')}:</strong> {t('he.guidedPractice')}</p>
                        <p className={styles.contextLabel}><strong>{t('he.briefingDepth')}:</strong> {setup.briefingDepth}</p>
                        <p className={styles.contextLabel}><strong>{t('he.issueSummary')}:</strong> {activeBriefing?.issueSummary ?? translateOption(setup.scenarioType)}</p>
                        <p className={styles.contextLabel}><strong>{t('he.callTimingContext')}:</strong> {translateOption(setup.callTiming)}</p>
                        <p className={styles.contextLabel}><strong>{t('he.callType')}:</strong> {translateOption(setup.callType)}</p>
                        <p className={styles.contextLabel}><strong>{t('he.parentLanguage')}:</strong> {translateOption(setup.parentLanguage)}</p>
                        <p>{activeBriefing?.timingSummary ?? selectedTimingBriefing.summary}</p>
                        <p><strong>{t('he.whatKnown')}:</strong> {activeBriefing ? activeBriefing.knownFacts[0] : 'Use confirmed facts and observed behavior from current reports.'}</p>
                        <p><strong>{t('he.parentConcernFear')}:</strong> {activeBriefing?.parentConcern ?? 'Their child may not be safe, heard, or treated fairly.'}</p>
                        <p><strong>{t('he.knownFacts')}</strong></p>
                        <ul>{(activeBriefing?.knownFacts ?? briefings.full.knownFacts).map((item) => <li key={item}>{item}</li>)}</ul>
                        <p><strong>{t('he.staffReport')}</strong></p>
                        <ul>{(activeBriefing?.staffReport ?? []).map((item) => <li key={item}>{item}</li>)}</ul>
                        <p><strong>{t('he.studentStatements')}</strong></p>
                        <ul>{(activeBriefing?.studentStatements ?? []).map((item) => <li key={item}>{item}</li>)}</ul>
                        <p><strong>{t('he.questionsUnknownsToClarify')}</strong></p>
                        <p className={styles.subtle}>{t('he.questionsUnknownsHelper')}</p>
                        <textarea
                          className={`${styles.notes} ${styles.setupNotes}`}
                          placeholder={t('he.questionsUnknownsPlaceholder')}
                          value={prepUnknownsNotes}
                          onChange={(e) => setPrepUnknownsNotes(e.target.value)}
                        />
                        <p><strong>{t('he.priorActions')}:</strong> {isDetailedBriefing ? (activeBriefing?.priorActions?.detailed ?? 'Staff and student statements were collected, supervision logs reviewed, and a follow-up timeline prepared.') : (activeBriefing?.priorActions?.light ?? 'Initial review in progress; timelines may still be developing.')}</p>
                        <p className={styles.subtle}><strong>{t('he.professionalNote')}:</strong> {t('he.professionalNoteBody')}</p>
                        <button className={styles.cta} onClick={nextStage}>{t('he.startCall')}</button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            {setup.practiceMode === 'random' && (setup.practiceMode === 'random' || isGuidedScenarioBuilt) && (
              <div className={styles.briefingCard}>
                <h3>{t('he.preCallBriefing')}</h3>
                <p className={styles.contextLabel}><strong>{t('he.path')}:</strong> {t('he.randomCall')}</p>
                <p className={styles.contextLabel}><strong>{t('he.briefingDepth')}:</strong> {setup.briefingDepth}</p>
                <p className={styles.contextLabel}><strong>{t('he.issueSummary')}:</strong> {activeBriefing?.issueSummary ?? translateOption(setup.scenarioType)}</p>
                <p className={styles.contextLabel}><strong>{t('he.callTimingContext')}:</strong> {translateOption(setup.callTiming)}</p>
                <p className={styles.contextLabel}><strong>{t('he.callType')}:</strong> {translateOption(setup.callType)}</p>
                <p className={styles.contextLabel}><strong>{t('he.parentLanguage')}:</strong> {translateOption(setup.parentLanguage)}</p>
                <p>{activeBriefing?.timingSummary ?? selectedTimingBriefing.summary}</p>
              </div>
            )}

            <button type="button" className={styles.debugToggle} onClick={() => setShowDebugPanel((prev) => !prev)}>
              {showDebugPanel ? 'Hide Developer Debug' : 'Show Developer Debug'}
            </button>
            {showDebugPanel && (
              <div className={styles.debugPanel}>
                <h3>Developer Debug Panel</h3>
                <p><strong>Core Scenario Type:</strong> {setup.scenarioType}</p>
                <p><strong>Hidden Parent Profile:</strong> tone={setup.parentTone}, intensity={setup.intensity}, style={setup.communicationStyle}</p>
                <p><strong>Call Context:</strong> {setup.callType} / {setup.callTiming}</p>
                <p><strong>Archetype / Tactic / Vulnerability:</strong> available in server prompt cards and report diagnostics.</p>
                <button type="button" className={styles.secondaryAction} onClick={regenerateParentProfile}>{t('he.regenerateParent')}</button>
                <p><strong>Report Preview Mode:</strong> Load sample transcript data and open the same post-call report flow.</p>
                {reportPreviewFixtures.map((fixture) => (
                  <button key={fixture.id} type="button" className={styles.secondaryAction} onClick={() => launchReportPreview(fixture)}>
                    Preview Sample Report: {fixture.label}
                  </button>
                ))}
              </div>
            )}
            {setup.practiceMode === 'random' && (
              <button className={styles.cta} onClick={nextStage}>{t('he.startCall')}</button>
            )}
          </div>
        )}
        {stage === 'incoming' && (
          <div className={styles.panelCentered}>
            <p className={styles.eyebrow}>{t('he.incomingCall')}</p>
            <div className={styles.callOrb} />
            <h2>Parent Caller: {setup.parentVoice === 'male' ? 'Mr. Carter' : 'Ms. Rodriguez'} ({translateOption(setup.gradeBand)})</h2>
            <p className={styles.subtle}>{translateOption(setup.scenarioType)} • {translateOption(setup.callType)}</p>
            <p className={styles.contextLabel}><strong>{t('he.callTimingContext')}:</strong> {translateOption(setup.callTiming)}</p>
              <p className={styles.contextLabel}><strong>{t('he.callType')}:</strong> {translateOption(setup.callType)}</p>
            <div className={styles.micChecklist}>
              <h3>{t('he.preCallEnvironmentCheck')}</h3>
              <ul>
                <li>Quiet room recommended</li>
                <li>Headphones recommended</li>
                <li>Use a device with a working microphone</li>
              </ul>
              <p><strong>Microphone permission:</strong> {micPermission}</p>
              {micTestResult && <p><strong>Mic test:</strong> {micTestResult}</p>}
              <p><strong>Voice test:</strong> {micTestVoiceDetected ? 'Voice detected' : 'Waiting for voice'}</p>
              {micError && <p className={styles.errorText}>{micError}</p>}
              {!hasMicrophone && <p className={styles.errorText}>No microphone detected.</p>}
              <button type="button" className={styles.secondaryAction} onClick={testMicrophone}>{t('he.testMicrophone')}</button>
            </div>
            <button className={styles.cta} onClick={beginCall} disabled={Boolean(micError) || !hasMicrophone}>{t('he.answerBegin')}</button>
          </div>
        )}
        {stage === 'active' && (
          <div className={styles.callLayout}>
            <div className={styles.callHeader}>
              <p className={styles.eyebrow}>{t('he.liveVoiceSimulation')}</p>
              <div className={styles.timer}>{callDuration}</div>
            </div>
            <p className={styles.subtle}><strong>Human Equation Build:</strong> {HUMAN_EQUATION_BUILD_VERSION}</p>
            <h2>Ms. Rodriguez — Parent Caller</h2>
            <p className={styles.subtle}>Emotional temperature: <strong>{emotionalTemperature}</strong> • {callStatus}</p>
            <p className={styles.contextLabel}><strong>{t('he.callTimingContext')}:</strong> {translateOption(setup.callTiming)}</p>
              <p className={styles.contextLabel}><strong>{t('he.callType')}:</strong> {translateOption(setup.callType)}</p>
            <div className={styles.callStatusGrid}>
              <p><strong>Mic status:</strong> {micPermission}</p>
              <p><strong>Mic stream status:</strong> {rtcDiagnostics.micStreamStatus}</p>
              <p><strong>Audio tracks found:</strong> {rtcDiagnostics.audioTrackCount}</p>
              <p><strong>First audio track enabled:</strong> {rtcDiagnostics.firstTrackEnabled}</p>
              <p><strong>First audio track muted:</strong> {rtcDiagnostics.firstTrackMuted}</p>
              <p><strong>WebRTC connection state:</strong> {rtcDiagnostics.peerConnectionState}</p>
              <p><strong>ICE connection state:</strong> {rtcDiagnostics.iceConnectionState}</p>
              <p><strong>Data channel state:</strong> {rtcDiagnostics.dataChannelState}</p>
              <p><strong>Realtime session status:</strong> {rtcDiagnostics.realtimeSessionStatus}</p>
              <p><strong>Realtime session started:</strong> {rtcDiagnostics.realtimeSessionStarted ? 'true' : 'false'}</p>
              <p><strong>Peer connection created:</strong> {rtcDiagnostics.peerConnectionCreated ? 'true' : 'false'}</p>
              <p><strong>Data channel open:</strong> {rtcDiagnostics.dataChannelOpen ? 'true' : 'false'}</p>
              <p><strong>Your audio:</strong> {userAudioDetected ? 'Detected' : 'Waiting for voice'}</p>
              {noiseWarning && <p className={styles.warningText}>{noiseWarning}</p>}
              {micError && <p className={styles.errorText}>{micError}</p>}
              {sessionError && <p className={styles.errorText}>{sessionError}</p>}
            </div>
            <div className={`${styles.waveform} ${isSpeaking ? styles.waveformActive : ''}`} aria-hidden />
            <label className={styles.notesLabel}>{t('he.privateNotesNotShared')}</label>
            <textarea className={styles.notes} placeholder="Capture key facts, commitments, and follow-up actions..." value={privateNotes} onChange={(e) => setPrivateNotes(e.target.value)} />
            {prepUnknownsNotes ? (
              <>
                <label className={styles.notesLabel}>{t('he.questionsUnknownsToClarify')}</label>
                <textarea className={styles.notes} value={prepUnknownsNotes} onChange={(e) => setPrepUnknownsNotes(e.target.value)} />
              </>
            ) : null}
            <button className={styles.endCall} onClick={endCall}>{t('he.endCall')}</button>
            <button type="button" className={styles.debugToggle} onClick={() => setShowDebugPanel((prev) => !prev)}>
              {showDebugPanel ? 'Hide Developer Debug' : 'Show Developer Debug'}
            </button>
            {showDebugPanel && (
              <div className={styles.debugPanel}>
                <h3>Developer Debug Panel</h3>
                <p><strong>Parent archetypes count:</strong> {debugInfo.dataCounts?.parentArchetypes ?? 0}</p>
                <p><strong>Issue cards count:</strong> {debugInfo.dataCounts?.issueCards ?? 0}</p>
                <p><strong>Selected parent archetype:</strong> {debugInfo.selectedCards?.openingArchetype?.name || 'Unknown'}</p>
                <p><strong>Selected issue card:</strong> {debugInfo.selectedCards?.issue?.title || 'Unknown'}</p>
                <p><strong>Generated prompt length:</strong> {debugInfo.simulationPrompt?.length || 0}</p>
                <p><strong>Prompt source:</strong> {asText(debugInfo.promptSource, 'unknown')}</p>
                <p><strong>Build version:</strong> {asText(debugInfo.buildVersion, HUMAN_EQUATION_BUILD_VERSION)}</p>
                <p><strong>Prompt builder error:</strong> {asText(debugInfo.fallbackReason, 'None')}</p>
                {asText(debugInfo.promptSource, 'unknown') !== 'json' && (
                  <p className={styles.debugWarning}><strong>WARNING:</strong> Realtime session is not using generated JSON prompt.</p>
                )}
                <p><strong>Realtime event types seen:</strong> {Object.keys(realtimeEventCounts).length}</p>
                <pre>{JSON.stringify(realtimeEventCounts, null, 2)}</pre>
                <p><strong>Generated prompt (first 1500 chars):</strong></p>
                <pre>{debugInfo.promptPreview || (debugInfo.simulationPrompt ? debugInfo.simulationPrompt.slice(0, 1500) : 'No prompt generated yet.')}</pre>
              </div>
            )}
          </div>
        )}
        {stage === 'report' && (
          <div className={styles.panel}>
            <p className={styles.eyebrow}>{t('he.postCallReport')}</p>
            <h2>Human Equation Post-Call Report</h2>
            <p className={styles.subtle}>{t('he.endReportTranscriptSubtle')}</p>
            <p><strong>Scenario:</strong> {translateOption(setup.scenarioType) || 'Unknown scenario'}</p>
            <p><strong>Parent:</strong> {setup.parentVoice === 'male' ? 'Mr. Carter' : 'Ms. Rodriguez'}</p>
            <p><strong>Issue:</strong> {translateOption(setup.callType) || 'Unknown issue'}</p>
            <p><strong>Call duration:</strong> {resolvedCallDuration}</p>
            {previewFixtureId ? <p><strong>Preview sample:</strong> {previewFixtureId}</p> : null}
            <div className={styles.reportMeta}>
              {coachingStatus.state === 'loading' && <section><h3>Generating coaching report…</h3><p>Analyzing transcript and call context.</p></section>}
              {coachingStatus.state === 'ready' && !coachingReport && <section><h3>Coaching unavailable</h3><p>We could not generate a full report from transcript data. Limited report mode is active.</p></section>}
              {coachingReport && (
                <>
                  <section className={`${styles.reportSection} ${styles.executiveSummarySection}`}><h3>Executive Summary</h3><p>{conciseExecutiveSummary}</p></section>
                  <section className={styles.reportSection}>
                    <h3>Conversation Trajectory</h3>
                    <ul>
                      <li><strong>Starting Parent State:</strong> {conversationTrajectory.startingParentState}</li>
                      <li><strong>Escalation Points:</strong> {conversationTrajectory.escalationPoints}</li>
                      <li><strong>Containment / Stabilization Attempts:</strong> {conversationTrajectory.containmentAttempts}</li>
                      <li><strong>Turning Point:</strong> {conversationTrajectory.turningPoint}</li>
                      <li><strong>Ending State:</strong> {conversationTrajectory.endingState}</li>
                      <li><strong>Overall Movement:</strong> {conversationTrajectory.overallMovement}</li>
                    </ul>
                  </section>
                  <section className={styles.reportSection}>
                    <h3>Human Equation Leadership Analysis</h3>
                    <div className={styles.analysisGrid}>
                      {frameworkAnalysis.map((item, idx) => {
                        const snapshot = shortInsight(item.summary) || 'Limited evidence in this call.';
                        const evidenceText = item.summary ? shortInsight(item.summary) : 'Limited evidence in this call.';
                        const coachingInsight = coachingAnalysisSentences(item.evidence);
                        return (
                          <article key={`analysis-${item.label}-${idx}`} className={styles.analysisCard}>
                            <div className={styles.cardTop}>
                              <h4>{item.label}</h4>
                              <span className={`${styles.statusPill} ${styles[`status${item.level}`]}`}>{item.level}</span>
                            </div>
                            <p className={styles.analysisSnapshot}><strong>Snapshot:</strong> {snapshot}</p>
                            <div className={styles.analysisBody}>
                              <p><strong>Coaching Insight:</strong></p>
                              {coachingInsight.map((sentence, sentenceIdx) => <p key={`analysis-sentence-${idx}-${sentenceIdx}`}>{sentence}</p>)}
                            </div>
                            <p className={styles.analysisEvidence}><strong>Transcript Evidence:</strong> {evidenceText}</p>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                  <div className={styles.lowerGrid}>
                    <section className={styles.reportSection}><h3>Parent Pattern Analysis</h3>{parentPatterns.length === 0 ? <p className={styles.emptyMessage}>Limited parent pattern evidence available for this sample.</p> : <div className={styles.patternGrid}>{parentPatterns.map((item, idx) => <article key={`parent-pattern-${idx}-${item.pattern}`} className={styles.patternCard}><h4>{item.pattern}</h4><ul className={styles.patternList}><li><strong>Evidence:</strong> {item.evidence}</li><li><strong>Leadership implication:</strong> {item.implication}</li></ul></article>)}</div>}</section>
                    <section className={styles.reportSection}><h3>Moments to Revisit</h3><ul>{momentsToRevisit.map((item, idx) => <li key={`revisit-${idx}-${item}`}>{item}</li>)}</ul></section>
                    <section className={styles.reportSection}><h3>Stronger Alternative Phrasing</h3><div className={styles.quoteList}>{strongerPhrasing.map((item, idx) => <blockquote key={`phrasing-${idx}-${item}`} className={styles.quoteCard}>“{item}”</blockquote>)}</div></section>
                    <section className={styles.reportSection}><h3>Suggested Follow-Up Plan</h3><ul className={styles.checklist}>{followUpPlan.map((item, idx) => <li key={`followup-${idx}-${item}`}>{item}</li>)}</ul></section>
                  </div>
                  {coachingReport.languageNote ? <section className={styles.reportSection}><h3>Language note</h3><p>{coachingReport.languageNote}</p></section> : null}
                </>
              )}
            </div>
            <section className={`${styles.debugBlock} ${styles.debugMinimized}`}>
              <h3>Developer debug</h3>
              <p><strong>Coaching source:</strong> {coachingStatus.source}</p>
              <p><strong>Fallback reason:</strong> {coachingStatus.fallbackReason || 'None'}</p>
            </section>
            <section className={styles.transcriptBlock}>
              <h3>Private notes</h3>
              <p>{privateNotes || 'No private notes captured for this call.'}</p>
              {prepUnknownsNotes ? (
                <>
                  <h3>{t('he.questionsUnknownsToClarify')}</h3>
                  <p>{prepUnknownsNotes}</p>
                </>
              ) : null}
            </section>
            <section className={styles.transcriptBlock}>
              <h3>Transcript</h3>
              {transcriptLines.length === 0 ? (
                <p>Transcript was not captured for this call yet, but the live voice session completed.</p>
              ) : (
                transcriptLines.map((line, idx) => (
                  <article key={`${line.id}-${idx}`} className={styles.lineItem}>
                    <div className={styles.lineMeta}><strong>{line.role || 'unknown'}</strong> <span>{safeTimeLabel(line.timestamp)} • {line.eventType || 'unknown-event'}</span></div>
                    <p>{line.text}</p>
                  </article>
                ))
              )}
            </section>
            <div className={styles.reportActions}>
              <button type="button" className={styles.cta} onClick={downloadFullReport}>{t('he.downloadFullReport')}</button>
              <button type="button" className={styles.secondaryAction} onClick={copyTranscript} disabled={transcriptLines.length === 0}>{t('he.copyTranscript')}</button>
              {previewFixtureId ? <button type="button" className={styles.secondaryAction} onClick={startNewCall}>Return to setup</button> : null}
              <button className={styles.secondaryAction} onClick={startNewCall}>{t('he.startNewCall')}</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Selector({ label, options, value, onSelect, translateOption = (option) => option }) {
  return (
    <div>
      <p className={styles.selectorLabel}>{label}</p>
      <div className={styles.selectorWrap}>
        {options.map((option) => (
          <button key={option} type="button" className={`${styles.selectorBtn} ${option === value ? styles.selected : ''}`} onClick={() => onSelect(option)}>{translateOption(option)}</button>
        ))}
      </div>
    </div>
  );
}
