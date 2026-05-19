import { NextResponse } from 'next/server';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const normText = (value, fallback = '') => (typeof value === 'string' ? value.trim() : fallback);
const arr = (value) => (Array.isArray(value) ? value : []);

const inferLevel = (transcriptText, type) => {
  const checks = {
    emotionalRegulation: /(let's slow|take a breath|i want to be direct|calm|steady|one step at a time)/i,
    clarityOfNextSteps: /(next step|by (today|tomorrow|end of day)|i will (call|email)|timeline|follow up)/i,
    accountabilityFraming: /(accountability|responsibility|expectation|obligation|cannot|we will not)/i,
    empathyAcknowledgment: /(i hear you|i understand|that sounds|i can hear|i know this is hard)/i,
    boundarySetting: /(need to be clear|cannot|won't|we will not|boundary|not appropriate)/i,
    followThroughRisk: /(not sure|maybe|we'll see|i hope|try to)/i,
  };
  if (type === 'followThroughRisk') {
    if (checks.followThroughRisk.test(transcriptText) && !checks.clarityOfNextSteps.test(transcriptText)) return 'Watch';
    if (checks.clarityOfNextSteps.test(transcriptText)) return 'Developing';
    return 'Watch';
  }
  if (checks[type].test(transcriptText)) return 'Strong';
  return 'Developing';
};

function buildFallbackReport(payload = {}) {
  const reportLanguage = payload.interfaceLanguage === 'es' ? 'es' : 'en';
  const transcriptLines = arr(payload.transcriptLines);
  const transcriptText = transcriptLines.map((line) => `${line.role || 'unknown'}: ${line.text || ''}`).join(' ').toLowerCase();
  const userLines = transcriptLines.filter((line) => line.role === 'user');
  const parentLines = transcriptLines.filter((line) => line.role === 'parent');

  const leadershipSnapshot = [
    { label: 'Emotional Regulation', level: inferLevel(transcriptText, 'emotionalRegulation'), evidence: userLines[0]?.text ? `Leader opened with: "${userLines[0].text.slice(0, 120)}"` : 'Limited transcript evidence; maintain calm pacing and explicit emotional resets.' },
    { label: 'Clarity of Next Steps', level: inferLevel(transcriptText, 'clarityOfNextSteps'), evidence: /(next|follow|timeline|by tomorrow|email|call)/i.test(transcriptText) ? 'Leader referenced follow-up or timeline language during the call.' : 'No explicit next-step cadence detected; risk of ambiguity after call.' },
    { label: 'Accountability Framing', level: inferLevel(transcriptText, 'accountabilityFraming'), evidence: /(accountability|responsibility|obligation|expectation|consequence)/i.test(transcriptText) ? 'Leader used accountability framing rather than reassurance-only language.' : 'Accountability language was limited in captured transcript.' },
    { label: 'Empathy / Acknowledgment', level: inferLevel(transcriptText, 'empathyAcknowledgment'), evidence: /(i hear|i understand|hard|stress)/i.test(transcriptText) ? 'Leader acknowledged parent concern while continuing operational discussion.' : 'Empathy phrase usage is limited in transcript excerpts.' },
    { label: 'Boundary Setting', level: inferLevel(transcriptText, 'boundarySetting'), evidence: /(cannot|need to be clear|not appropriate|we will not)/i.test(transcriptText) ? 'Leader set boundaries on what can be promised or concluded immediately.' : 'Boundary language not strongly visible in captured lines.' },
    { label: 'Follow-Through Risk', level: inferLevel(transcriptText, 'followThroughRisk'), evidence: /(timeline|by|update|follow up|recap)/i.test(transcriptText) ? 'Some follow-through structures are present; ensure documentation closes the loop.' : 'Low explicit closure language raises follow-through risk.' },
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
    leadershipSnapshot,
    keyLeadershipMoves: [
      'Redirected emotional pressure toward process and concrete actions.',
      'Maintained accountability framing instead of offering guarantees.',
      'Balanced concern acknowledgment with institutional boundary language.',
      'Worked toward defining follow-up ownership and timing.',
    ],
    strategicTradeoffs: [
      'This response may have increased defensiveness, but it also clarified accountability.',
      'This was firm rather than soothing; that can be appropriate when the goal is to establish seriousness.',
      'The risk is that the parent may hear it as blame unless it is paired with support and a clear help path.',
      'Holding boundaries likely protected process integrity, but relational trust depends on fast, visible follow-through.',
    ],
    parentPatternAnalysis: [
      /(just want to make sure|are you sure|promise me|guarantee)/i.test(transcriptText) ? 'Reassurance seeking' : 'Fear of child being unsupported',
      /(again|like i said|i already told you|same thing)/i.test(transcriptText) ? 'Looping' : 'Procedural pressure',
      /(policy|procedure|district|formal complaint)/i.test(transcriptText) ? 'Procedural pressure' : 'Emotional reframing',
      /(your fault|school failed|teacher failed|blame)/i.test(transcriptText) ? 'Blame shifting' : 'Pressure for guarantees',
      /(board|superintendent|media|lawyer)/i.test(transcriptText) ? 'Escalation threat' : 'Distrust of school',
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
  const prompt = `Generate a Human Equation post-call coaching report JSON. Philosophy: tension is not automatically bad; evaluate strategic tradeoffs between firmness, accountability, support, and trust. Use transcript evidence whenever available. Return JSON only with keys: executiveSummary, leadershipSnapshot (array of {label, level, evidence}), keyLeadershipMoves, strategicTradeoffs, parentPatternAnalysis, momentsToRevisit, strongerAlternativePhrasing, suggestedFollowUpPlan. Levels allowed: Strong, Developing, Watch. Write all visible report text in ${reportLanguageInstruction}. Parent language controls the simulated parent speech only and must not force this report language.\n\nInput:\n${JSON.stringify(payload).slice(0, 18000)}`;
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
