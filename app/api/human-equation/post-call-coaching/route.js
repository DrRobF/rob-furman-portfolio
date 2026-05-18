import { NextResponse } from 'next/server';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const normText = (value, fallback = '') => (typeof value === 'string' ? value.trim() : fallback);
const arr = (value) => (Array.isArray(value) ? value : []);

function buildFallbackReport(payload = {}) {
  const transcriptLines = arr(payload.transcriptLines);
  const transcriptText = transcriptLines.map((line) => `${line.role || 'unknown'}: ${line.text || ''}`).join(' ').toLowerCase();
  const parentTurns = transcriptLines.filter((line) => line.role === 'parent').length;
  const userTurns = transcriptLines.filter((line) => line.role === 'user').length;
  const leadershipMoves = [];
  if (/(fact|confirm|what happened|walk me through|specific|documentation|record)/i.test(transcriptText)) leadershipMoves.push('Clarified facts and grounded the conversation in specifics.');
  if (/(cannot|need to be clear|boundary|not appropriate|we will not|expectation)/i.test(transcriptText)) leadershipMoves.push('Set or reinforced boundaries when expectations needed structure.');
  if (/(next step|follow up|by tomorrow|timeline|i will call|email)/i.test(transcriptText)) leadershipMoves.push('Named concrete next steps and follow-up structure.');
  if (/(i hear you|i understand|that sounds|i can hear)/i.test(transcriptText)) leadershipMoves.push('Used empathy without abandoning administrative clarity.');
  if (/(accountability|responsibility|consequence|due process)/i.test(transcriptText)) leadershipMoves.push('Established accountability framing instead of pure reassurance.');
  const parentPatterns = [];
  if (/(just want to make sure|are you sure|promise me|guarantee)/i.test(transcriptText)) parentPatterns.push('Reassurance seeking');
  if (/(again|like i said|i already told you|same thing)/i.test(transcriptText)) parentPatterns.push('Looping / repetition under stress');
  if (/(policy|procedure|district|formal complaint)/i.test(transcriptText)) parentPatterns.push('Procedural pressure');
  if (/(your fault|school failed|teacher failed|blame)/i.test(transcriptText)) parentPatterns.push('Blame shifting / responsibility transfer');
  if (/(board|superintendent|media|lawyer)/i.test(transcriptText)) parentPatterns.push('Escalation threat signaling');
  if (/(don't trust|never listen|always ignore)/i.test(transcriptText)) parentPatterns.push('Distrust of school systems');
  return {
    source: transcriptLines.length ? 'rule-based-transcript' : 'fallback-limited-data',
    snapshot: {
      issue: normText(payload.setup?.scenarioType, 'Unknown issue'),
      parentTypeTone: `${normText(payload.setup?.parentVoice, 'Unknown voice')} / ${normText(payload.setup?.parentTone, 'Unknown tone')}`,
      callContext: normText(payload.setup?.callTiming, 'Unknown context'),
      duration: normText(payload.callDuration, '00:00'),
      briefSummary: transcriptLines.length ? `Call included ${userTurns} leader turns and ${parentTurns} parent turns with pressure around ${normText(payload.setup?.callType, 'the concern')}.` : 'Transcript was unavailable; summary is based on call setup metadata only.',
    },
    leadershipMovesObserved: leadershipMoves.length ? leadershipMoves : ['Maintained engagement through a high-pressure interaction with limited evidence detail in transcript.'],
    strategicTradeoffs: [
      'This increased emotional intensity, but it also clarified accountability expectations.',
      'This may have created defensiveness, but it helped surface the parent’s real concern for decision-making.',
      'This was firm rather than soothing; that may be appropriate when process integrity and fairness are the immediate goal.',
    ],
    parentPatternAnalysis: parentPatterns.length ? parentPatterns : ['No clear parent pattern could be confidently inferred from available transcript data.'],
    strengths: ['Leadership voice stayed task-oriented under pressure.', 'Conversation appeared oriented toward follow-through instead of vague reassurance.'],
    watchPoints: ['If firm language was used without explicit empathy, trust could weaken even when decisions are correct.', 'Any commitments should be documented quickly to avoid perception gaps later.', 'If tension rose, a same-day follow-up note can stabilize interpretation of what was agreed.'],
    suggestedFollowUp: ['Send a short recap email within one school day with decisions, owner, and timeline.', 'Document key facts and commitments in internal notes immediately after the call.', 'Run a staff check-in with counselor/AP/teacher as relevant before the next parent update.', 'Schedule a parent update checkpoint (24–72 hours depending on urgency).'],
    strongerAlternativePhrasing: ['I hear your concern. I am not going to over-promise, but I am going to give you a clear process and timeline today.', 'This is difficult, and I want to be direct: we will address this, and we will do it through a fair, documented process.', 'I understand why this feels urgent. My job right now is to protect your child and make sure accountability is handled correctly.', 'I cannot finalize conclusions in this moment, but I can commit to specific next steps and a time for follow-up.'],
  };
}

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const fallback = buildFallbackReport(payload);
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ ...fallback, apiStatus: 'fallback', fallbackReason: 'missing-api-key' });
  const prompt = `You are generating a post-call school leadership coaching report from a parent-call transcript. Core philosophy: do not frame all tension as negative; evaluate strategic tradeoffs and accountability language. Return JSON only with keys snapshot, leadershipMovesObserved, strategicTradeoffs, parentPatternAnalysis, strengths, watchPoints, suggestedFollowUp, strongerAlternativePhrasing.\n\nTranscript + metadata:\n${JSON.stringify(payload).slice(0, 18000)}`;
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
