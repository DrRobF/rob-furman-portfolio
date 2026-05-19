import { NextResponse } from 'next/server';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const normText = (value, fallback = '') => (typeof value === 'string' ? value.trim() : fallback);
const arr = (value) => (Array.isArray(value) ? value : []);

const inferFrameworkLevel = (transcriptText, strengths = [], risks = [], supports = []) => {
  const hasStrength = strengths.some((pattern) => pattern.test(transcriptText));
  const hasRisk = risks.some((pattern) => pattern.test(transcriptText));
  const hasSupport = supports.some((pattern) => pattern.test(transcriptText));

  if (hasRisk && !hasStrength) return 'Watch';
  if (hasStrength && !hasRisk) return 'Strong';
  if (hasStrength || hasSupport) return 'Developing';
  return 'Developing';
};

function buildFallbackReport(payload = {}) {
  const reportLanguage = payload.interfaceLanguage === 'es' ? 'es' : 'en';
  const transcriptLines = arr(payload.transcriptLines);
  const transcriptText = transcriptLines.map((line) => `${line.role || 'unknown'}: ${line.text || ''}`).join(' ').toLowerCase();
  const userLines = transcriptLines.filter((line) => line.role === 'user');
  const parentLines = transcriptLines.filter((line) => line.role === 'parent');

  const humanEquationLeadershipAnalysis = [
    { label: 'Trust Construction', level: inferFrameworkLevel(transcriptText, [/(written update|documented next steps|by tomorrow|follow up|fair process)/i], [/(we\'ll see|not sure|maybe)/i], [/(i hear|i understand)/i]), evidence: /(written update|documented next steps|by tomorrow|follow up|fair process)/i.test(transcriptText) ? 'Credibility was reinforced through timeline language and explicit follow-through commitments.' : 'Trust signals are present but mostly implied; add explicit fairness and follow-through checkpoints.' },
    { label: 'Human Awareness', level: inferFrameworkLevel(transcriptText, [/(i hear|i understand|urgent|felt humiliated|hardest part)/i], [/(calm down|you are overreacting)/i], [/(concern|impact)/i]), evidence: /(i hear|i understand|urgent|hardest part|impact)/i.test(transcriptText) ? 'Leader named emotion and pressure cues without losing direction.' : 'Limited direct naming of emotional cues; risk of the parent feeling unheard even when process is clear.' },
    { label: 'Reality Anchoring', level: inferFrameworkLevel(transcriptText, [/(confirmed|verify|review|timeline|by tomorrow|facts|gradebook)/i], [/(always|never|everyone knows)/i], [/(next step|update)/i]), evidence: /(confirmed|verify|review|timeline|by tomorrow|facts|gradebook)/i.test(transcriptText) ? 'Leader separated confirmed facts from pending review and provided a verification path.' : 'Facts and assumptions were not clearly separated; add explicit what-we-know vs what-we-still-need-to-check framing.' },
    { label: 'Regulation Under Pressure', level: inferFrameworkLevel(transcriptText, [/(i want to be direct|understood|let me|one step at a time)/i], [/(this is not my problem|enough)/i], [/(cannot guarantee outcomes yet|can guarantee follow-through)/i]), evidence: userLines[0]?.text ? `Leadership tone opened with: "${userLines[0].text.slice(0, 120)}"` : 'Transcript is limited; maintain calm structure and avoid emotional contagion under pressure.' },
    { label: 'Accountability Balance', level: inferFrameworkLevel(transcriptText, [/(need daily attendance|obligation|responsibility|cannot make immediate|expectation)/i], [/(whatever you want|no consequences|it\'s all your fault)/i], [/(support plan|pair expectation with options)/i]), evidence: /(need daily attendance|obligation|responsibility|cannot make immediate|expectation)/i.test(transcriptText) ? 'Leader held standards while still offering support options.' : 'Standards were not consistently explicit; strengthen accountability language without becoming punitive.' },
    { label: 'Vision & Change Leadership', level: inferFrameworkLevel(transcriptText, [/(improvement|support plan|restore trust|next checkpoint|growth)/i], [/(nothing will change|this is pointless)/i], [/(plan|finalize supports)/i]), evidence: /(support plan|restore trust|next checkpoint|finalize supports)/i.test(transcriptText) ? 'Conversation moved beyond immediate conflict toward improvement and relationship repair.' : 'Future-facing leadership is light; add explicit improvement targets and culture expectations.' },
    { label: 'Instructional & Academic Leadership', level: inferFrameworkLevel(transcriptText, [/(catch-up plan|assignments|gradebook|student support|counselor)/i], [/(ignore academics|not about learning)/i], [/(teacher|class|submission)/i]), evidence: /(catch-up plan|assignments|gradebook|student support|counselor)/i.test(transcriptText) ? 'Leader connected response steps to student learning and support structures.' : 'Academic impact was referenced minimally; define instructional supports and monitoring more clearly.' },
    { label: 'Team & Systems Leadership', level: inferFrameworkLevel(transcriptText, [/(meeting with counselor|teacher notes|documented|written update|owner)/i], [/(no one knows|nobody follows up)/i], [/(conference|update)/i]), evidence: /(meeting with counselor|teacher notes|documented|written update)/i.test(transcriptText) ? 'Cross-team coordination and documentation were visible in commitments.' : 'System coordination is implied but thin; assign owners, communication cadence, and documentation steps.' },
  ];

  return {
    source: transcriptLines.length ? 'rule-based-transcript' : 'fallback-limited-data',
    reportLanguage,
    languageNote: null,
    executiveSummary: [
      `This call addressed ${normText(payload.setup?.scenarioType, 'an unresolved school concern')} in a high-pressure parent context.`,
      `The parent pattern showed ${parentLines.length > userLines.length ? 'sustained pressure and reassurance-seeking' : 'active pressure with concern about support and accountability'}.`,
      'The leader stance was generally firm and process-oriented, with emphasis on accountability and controllable next steps.',
      transcriptLines.length ? 'Outcome: conversation moved toward structure, but at least one thread appears unresolved and needs documented follow-up.' : 'Outcome is partially unresolved because transcript evidence was limited.',
    ].join(' '),
    humanEquationLeadershipAnalysis,
    parentPatternAnalysis: [
      /(just want to make sure|are you sure|promise me|guarantee)/i.test(transcriptText) ? 'Reassurance seeking' : 'Pressure for guarantees',
      /(again|like i said|i already told you|same thing)/i.test(transcriptText) ? 'Escalation through repetition' : 'Looping',
      /(policy|procedure|district|formal complaint)/i.test(transcriptText) ? 'Procedural pressure' : 'Distrust of school systems',
      /(your fault|school failed|teacher failed|blame)/i.test(transcriptText) ? 'Blame shifting' : 'Identity protection',
      /(left out|excluded|nobody told me|without me)/i.test(transcriptText) ? 'Fear of exclusion' : 'Status threat',
    ],
    momentsToRevisit: [
      'Revisit any point where firmness may have sounded final before process completion was explained.',
      'Revisit moments where parent emotion was acknowledged briefly but not explicitly linked to support actions.',
      'Revisit any commitment that lacked owner + deadline language.',
    ],
    strongerAlternativePhrasing: [
      'I hear the urgency. I will not promise an outcome today, but I will give you a documented timeline and owner for each step.',
      'I need to be direct: attendance is a serious obligation, and we are also going to remove barriers with a concrete support plan.',
      'We are not minimizing this. We are handling it through a fair process, and you will get an update by tomorrow at 3 PM.',
      'I can’t conclude the full finding yet, but I can commit to specific actions today and a follow-up checkpoint.',
      'If we disagree on interpretation, we can still align on immediate student support and clear accountability steps.',
    ],
    suggestedFollowUpPlan: [
      'Send parent recap within 24 hours: decisions made, open questions, owner, and next update time.',
      'Document call summary and commitments in internal case notes immediately.',
      'Conduct staff check-in (teacher/counselor/AP) to align execution and messaging.',
      'Run student check-in within one school day to validate support and safety.',
      'Publish short support plan with timeline and progress indicators.',
      'Schedule follow-up communication window (24–72 hours based on risk).',
    ],
  };
}

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const fallback = buildFallbackReport(payload);
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ ...fallback, apiStatus: 'fallback', fallbackReason: 'missing-api-key' });
  const reportLanguageInstruction = payload.interfaceLanguage === 'es' ? 'Spanish' : 'English';
  const prompt = `Generate a Human Equation post-call coaching report JSON organized around the Human Equation Leadership Framework. Canonical order: Trust Construction, Human Awareness, Reality Anchoring, Regulation Under Pressure, Accountability Balance, Vision & Change Leadership, Instructional & Academic Leadership, Team & Systems Leadership. Philosophy: evaluate leadership under human pressure; tension and firmness are not automatically negative, soothing language is not automatically positive. Focus on strategic leadership behavior, not generic niceness. Use transcript evidence whenever available and practical coaching language. Return JSON only with keys: executiveSummary, humanEquationLeadershipAnalysis (array of {label, level, evidence} in canonical order), parentPatternAnalysis, momentsToRevisit, strongerAlternativePhrasing, suggestedFollowUpPlan. Levels allowed: Strong, Developing, Watch. If evidence is thin, still return all 8 dimensions with concise fallback evidence language. Write all visible report text in ${reportLanguageInstruction}. Parent language controls the simulated parent speech only and must not force this report language.

Input:
${JSON.stringify(payload).slice(0, 18000)}`;
  try {
    const response = await fetch(OPENAI_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: MODEL, temperature: 0.2, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: 'Return only JSON.' }, { role: 'user', content: prompt }] }) });
    if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`);
    const data = await response.json();
    const parsed = JSON.parse(data?.choices?.[0]?.message?.content || '{}');
    return NextResponse.json({ ...fallback, ...parsed, source: 'ai-transcript', apiStatus: 'success' });
  } catch {
    return NextResponse.json({ ...fallback, apiStatus: 'fallback', fallbackReason: 'api-error' });
  }
}
