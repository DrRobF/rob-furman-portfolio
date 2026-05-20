import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { HUMAN_EQUATION_COACHING_CONSTITUTION } from '../../../../lib/human-equation/coachingConstitution';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const DATA_DIR = path.join(process.cwd(), 'data', 'human-equation');
const normText = (value, fallback = '') => (typeof value === 'string' ? value.trim() : fallback);
const arr = (value) => (Array.isArray(value) ? value : []);
const hasAny = (text, patterns = []) => patterns.some((pattern) => pattern.test(text));

const loadJson = async (file) => JSON.parse(await fs.readFile(path.join(DATA_DIR, file), 'utf8'));
const safeLower = (value) => normText(value).toLowerCase();
const isShortTranscript = (lines = []) => lines.filter((line) => normText(line?.text).length >= 4).length < 2;

const BASE_PARENT_PATTERN_DEFINITIONS = [
  { pattern: 'Looping', triggers: [/(again|like i said|i already told you|same thing|you keep saying)/i], implication: 'This appeared intended to force acknowledgment through repetition; the leadership move is concise recap plus a concrete checkpoint to prevent circular debate.' },
  { pattern: 'Deadline pressure', triggers: [/(today|right now|immediately|by end of day|before tomorrow|need this now|when exactly)/i], implication: 'The effect is urgency pressure that can distort process; leadership should reality-anchor timelines while preserving follow-through credibility.' },
  { pattern: 'Threat escalation', triggers: [/(lawyer|superintendent|board|media|formal complaint|go above you|legal)/i], implication: 'This may be a leverage move under distrust; leadership should keep procedural clarity and avoid side-fight dynamics.' },
  { pattern: 'Distrust amplification', triggers: [/(you people|school never|nobody listens|can[’\']t trust|covering this up|not telling the truth)/i], implication: 'The effect is trust erosion pressure; leadership should separate verifiable facts from assumptions and document commitments.' },
  { pattern: 'Emotional flooding', triggers: [/(furious|outraged|humiliated|devastated|unacceptable|this is insane)/i], implication: 'High affect does not automatically indicate leader failure; containment language and structured next steps are key.' },
  { pattern: 'Authority testing', triggers: [/(who are you to|you work for me|you need to do what i say|you can[’\']t tell me)/i], implication: 'This may test role boundaries; leadership should reset boundaries without sarcasm and return to child/school outcomes.' },
  { pattern: 'Narrative control', triggers: [/(what happened is|the real story is|don[’\']t twist this|let me be clear)/i], implication: 'Control bids can narrow shared reality; leadership should acknowledge perspective while restoring fact-verification structure.' },
  { pattern: 'Reassurance seeking', triggers: [/(promise me|guarantee|are you sure|just tell me it won[’\']t happen)/i], implication: 'Reassurance pressure can invite appeasement; strong leadership avoids false certainty and offers measurable follow-up commitments.' },
  { pattern: 'Demand for specificity', triggers: [/(exactly what|specific|what are you going to do|what is the plan|which policy|who approved)/i], implication: 'Specificity pressure can be productive when met with concrete facts, owners, and dates.' },
  { pattern: 'Procedural challenge', triggers: [/(policy|procedure|protocol|process|violation|you didn[’\']t follow)/i], implication: 'Procedure-based challenge often tests institutional legitimacy; leadership should clarify policy steps and appeal channels.' },
  { pattern: 'Conditional cooperation', triggers: [/(if you|unless you|only if|i will cooperate when)/i], implication: 'Conditionality signals negotiable trust; leadership should set clear boundaries while identifying realistic areas of flexibility.' },
  { pattern: 'Status/expertise assertion', triggers: [/(i know how this works|i work in education|i have rights|i know the law)/i], implication: 'Expertise assertion can be a power-balancing move; leadership should acknowledge knowledge without ceding process integrity.' },
];

const inferFrameworkLevel = (transcriptText, strengths = [], risks = [], supports = []) => {
  const hasStrength = strengths.some((pattern) => pattern.test(transcriptText));
  const hasRisk = risks.some((pattern) => pattern.test(transcriptText));
  const hasSupport = supports.some((pattern) => pattern.test(transcriptText));
  if (hasRisk && !hasStrength) return 'Watch';
  if (hasStrength && !hasRisk) return 'Strong';
  if (hasStrength || hasSupport) return 'Developing';
  return 'Developing';
};

const extractArchetypeHints = (payload = {}) => {
  const setup = payload?.setup || {};
  const cards = payload?.cards || payload?.scenarioCards || {};
  const picks = [setup.openingArchetype, setup.selectedArchetype, cards.openingArchetype, cards.selectedArchetype].filter((item) => item && typeof item === 'object');
  const selected = picks[0] || null;
  if (!selected) return null;
  return {
    name: normText(selected.archetypeName || selected.name, 'Selected archetype'),
    commonTacticsUsed: normText(selected.commonTacticsUsed),
    escalationTriggers: normText(selected.escalationTriggers),
    calmingFactors: normText(selected.calmingFactors),
    hiddenFear: normText(selected.hiddenFear || selected.hiddenFearVulnerability),
    speechPattern: normText(selected.speechPattern),
    typicalPhrases: normText(selected.typicalPhrases),
    manipulationStyle: normText(selected.manipulationStyle),
    relationshipToSchool: normText(selected.relationshipToSchool),
    likelyEndingState: normText(selected.likelyEndingState),
  };
};

const inferParentPatterns = (transcriptLines, archetypeHints, tacticCards = []) => {
  const parentLines = transcriptLines.filter((line) => line.role === 'parent');
  const transcriptText = transcriptLines.map((line) => `${line.role || 'unknown'}: ${line.text || ''}`).join(' ').toLowerCase();
  const tacticDefinitions = arr(tacticCards).map((tactic) => ({
    pattern: normText(tactic.tacticName || tactic.name, ''),
    triggers: [safeLower(tactic.description), safeLower(tactic.parentLanguageCue), safeLower(tactic.typicalPhrases)].filter(Boolean),
    implication: normText(tactic.leadershipRisk || tactic.recommendedLeadershipResponse, 'This pattern adds pressure and requires explicit process clarity.'),
  })).filter((item) => item.pattern && item.triggers.length);

  const archetypeDerived = archetypeHints
    ? [
      ['Common Tactics Used', archetypeHints.commonTacticsUsed],
      ['Escalation Triggers', archetypeHints.escalationTriggers],
      ['Calming Factors', archetypeHints.calmingFactors],
      ['Hidden Fear / Vulnerability', archetypeHints.hiddenFear],
      ['Speech Pattern', archetypeHints.speechPattern],
      ['Typical Phrases', archetypeHints.typicalPhrases],
      ['Manipulation Style', archetypeHints.manipulationStyle],
      ['Relationship to School', archetypeHints.relationshipToSchool],
      ['Likely Ending State', archetypeHints.likelyEndingState],
    ].filter(([, value]) => value).map(([field, value]) => ({ pattern: `${field} cue`, value }))
    : [];

  const directPatterns = BASE_PARENT_PATTERN_DEFINITIONS
    .filter((definition) => hasAny(transcriptText, definition.triggers))
    .map((definition) => ({
      pattern: definition.pattern,
      evidence: parentLines.find((line) => hasAny(line?.text || '', definition.triggers))?.text || 'Pattern language appeared across parent turns.',
      implication: definition.implication,
    }));

  const tacticPatterns = tacticDefinitions
    .filter((definition) => definition.triggers.some((trigger) => transcriptText.includes(trigger) && trigger.length > 10))
    .slice(0, 3)
    .map((definition) => ({
      pattern: definition.pattern,
      evidence: `Transcript language aligns with this tactic profile: ${definition.triggers.find((trigger) => transcriptText.includes(trigger))}.`,
      implication: definition.implication,
    }));

  const archetypePatterns = archetypeDerived
    .filter((item) => transcriptText.includes(item.value.toLowerCase().slice(0, 18)))
    .slice(0, 2)
    .map((item) => ({
      pattern: item.pattern,
      evidence: `Observed language tracks the selected archetype field: ${item.value}.`,
      implication: 'This suggests the parent behavior is archetype-consistent and should be managed with clear boundaries plus concrete follow-through.'
    }));

  const merged = [...directPatterns, ...tacticPatterns, ...archetypePatterns].filter((item, idx, all) => all.findIndex((x) => x.pattern === item.pattern) === idx);
  if (!merged.length && !isShortTranscript(transcriptLines) && parentLines.length) {
    return [{
      pattern: 'Narrative pressure',
      evidence: parentLines[0]?.text || 'Parent sustained a concern-driven narrative across turns.',
      implication: 'Even without explicit trigger phrases, the parent maintained pressure for certainty; leadership should respond with structured checkpoints.',
    }];
  }
  return merged;
};

const normalizeLeadershipSkills = (rawSkills = []) => arr(rawSkills).map((skill) => ({
  cardId: normText(skill?.cardId),
  skillName: normText(skill?.skillName),
  leadershipPurpose: normText(skill?.leadershipPurpose),
  whenUseful: normText(skill?.whenUseful),
  exampleLanguage: normText(skill?.exampleLanguage),
  coreConcept: normText(skill?.coreConcept),
})).filter((skill) => skill.cardId && skill.skillName);

function buildFallbackReport(payload = {}, tacticCards = [], leadershipSkills = []) {
  const reportLanguage = payload.interfaceLanguage === 'es' ? 'es' : 'en';
  const transcriptLines = arr(payload.transcriptLines);
  const transcriptText = transcriptLines.map((line) => `${line.role || 'unknown'}: ${line.text || ''}`).join(' ').toLowerCase();
  const userLines = transcriptLines.filter((line) => line.role === 'user');
  const parentLines = transcriptLines.filter((line) => line.role === 'parent');
  const parentPatternAnalysis = inferParentPatterns(transcriptLines, extractArchetypeHints(payload), tacticCards);
  const parentText = parentLines.map((line) => normText(line?.text)).join(' ').toLowerCase();
  const userText = userLines.map((line) => normText(line?.text)).join(' ').toLowerCase();
  const hasGuardedCooperation = /(i[’']?ll hold you to that|let[’']s see if this goes somewhere real|we[’']ll see|fine[, ]?but|okay[, ]?but|if you follow through)/i.test(parentText);
  const hasEscalationLanguage = /(lawyer|board|media|formal complaint|covering this up|not telling the truth|this is insane|unacceptable)/i.test(parentText);
  const hasContainmentLanguage = /(let me be direct|one step at a time|documented|written update|by tomorrow|verify|shared goal|student support|fair process)/i.test(userText);
  const hasTurningPoint = /(shared goal|student support|next step|written update|timeline|checkpoint|owner)/i.test(userText) && /(okay|fine|i hear you|if you follow through|i'll hold you to that|let's see)/i.test(parentText);
  const scenarioSummary = normText(payload?.canonicalScenario?.issueSummary, normText(payload.setup?.scenarioType, 'an unresolved school concern'));

  return {
    source: transcriptLines.length ? 'rule-based-transcript' : 'fallback-limited-data',
    reportLanguage,
    languageNote: null,
    executiveSummary: [
      `This call addressed ${scenarioSummary} in a high-pressure parent context.`,
      'The parent pattern analysis captures observed pressure dynamics independently from leader performance ratings.',
      'The leader stance was generally firm and process-oriented; strategic firmness and reality anchoring are treated as potential strengths when they create clearer commitments.',
      transcriptLines.length ? 'Outcome: conversation moved toward structure, but at least one thread appears unresolved and needs documented follow-up.' : 'Outcome is partially unresolved because transcript evidence was limited.',
    ].join(' '),
    conversationTrajectory: {
      startingParentState: parentLines[0]?.text
        ? 'The parent began with distrust and visible pressure, prioritizing proof and accountability.'
        : 'Parent opening state was only partially captured; pressure signals still suggest distrust and urgency.',
      escalationPoints: hasEscalationLanguage
        ? 'The conversation intensified when legal/process language was heard as self-protective rather than student-centered.'
        : 'Escalation remained moderate; pressure rose when certainty was requested before full fact verification.',
      containmentAttempts: hasContainmentLanguage
        ? 'The leader attempted containment by reality-anchoring facts, setting timelines, and reframing toward shared student support.'
        : 'Containment attempts were present but not always explicit; stronger owner-plus-deadline language would stabilize pressure.',
      turningPoint: hasTurningPoint
        ? 'A turning point emerged when the leader linked accountability to concrete next steps and the parent shifted from resistance to conditional engagement.'
        : 'No single clean turning point appeared; movement was incremental through repeated process clarity and follow-through framing.',
      endingState: hasGuardedCooperation
        ? 'The parent ended in guarded cooperation rather than full trust, indicating meaningful but incomplete repair.'
        : 'The call ended with partial alignment and unresolved trust, requiring disciplined follow-up to convert structure into confidence.',
      overallMovement: hasGuardedCooperation || (hasContainmentLanguage && !hasEscalationLanguage)
        ? 'Overall movement was from high pressure toward usable working alignment: clearer commitments, realistic follow-up, and shared next steps.'
        : 'Overall movement was mixed: some clarity gains occurred, but trust and accountability still require stronger follow-through and explicit agreement checkpoints.',
    },
    humanEquationLeadershipAnalysis: [
      { label: 'Trust Construction', level: inferFrameworkLevel(transcriptText, [/(written update|documented next steps|by tomorrow|follow up|fair process)/i], [/(we\'ll see|not sure|maybe)/i], [/(i hear|i understand)/i]), evidence: /(written update|documented next steps|by tomorrow|follow up|fair process)/i.test(transcriptText) ? 'Credibility was reinforced through timeline language and explicit follow-through commitments.' : 'Trust signals are present but mostly implied; add explicit fairness and follow-through checkpoints.' },
      { label: 'Human Awareness', level: inferFrameworkLevel(transcriptText, [/(i hear|i understand|urgent|felt humiliated|hardest part)/i], [/(calm down|you are overreacting)/i], [/(concern|impact)/i]), evidence: /(i hear|i understand|urgent|hardest part|impact)/i.test(transcriptText) ? 'Leader named emotion and pressure cues without losing direction.' : 'Limited direct naming of emotional cues; risk of the parent feeling unheard even when process is clear.' },
      { label: 'Reality Anchoring', level: inferFrameworkLevel(transcriptText, [/(confirmed|verify|review|timeline|by tomorrow|facts|gradebook)/i], [/(always|never|everyone knows)/i], [/(next step|update)/i]), evidence: /(confirmed|verify|review|timeline|by tomorrow|facts|gradebook)/i.test(transcriptText) ? 'Leader separated confirmed facts from pending review and provided a verification path.' : 'Facts and assumptions were not clearly separated; add explicit what-we-know vs what-we-still-need-to-check framing.' },
      { label: 'Regulation Under Pressure', level: inferFrameworkLevel(transcriptText, [/(i want to be direct|understood|let me|one step at a time|stay with the process)/i], [/(this is not my problem|enough|you need to calm down)/i], [/(cannot guarantee outcomes yet|can guarantee follow-through|realistic timeline)/i]), evidence: userLines[0]?.text ? `This appeared intended to stabilize pressure while preserving process: "${userLines[0].text.slice(0, 140)}"` : 'Transcript is limited; maintain containment structure and avoid personal defensiveness under pressure.' },
      { label: 'Accountability Balance', level: inferFrameworkLevel(transcriptText, [/(need daily attendance|obligation|responsibility|cannot make immediate|expectation)/i], [/(whatever you want|no consequences|it\'s all your fault)/i], [/(support plan|pair expectation with options)/i]), evidence: /(need daily attendance|obligation|responsibility|cannot make immediate|expectation)/i.test(transcriptText) ? 'Leader held standards while still offering support options.' : 'Standards were not consistently explicit; strengthen accountability language without becoming punitive.' },
      { label: 'Vision & Change Leadership', level: inferFrameworkLevel(transcriptText, [/(improvement|support plan|restore trust|next checkpoint|growth)/i], [/(nothing will change|this is pointless)/i], [/(plan|finalize supports)/i]), evidence: /(support plan|restore trust|next checkpoint|finalize supports)/i.test(transcriptText) ? 'Conversation moved beyond immediate conflict toward improvement and relationship repair.' : 'Future-facing leadership is light; add explicit improvement targets and culture expectations.' },
      { label: 'Instructional & Academic Leadership', level: inferFrameworkLevel(transcriptText, [/(catch-up plan|assignments|gradebook|student support|counselor)/i], [/(ignore academics|not about learning)/i], [/(teacher|class|submission)/i]), evidence: /(catch-up plan|assignments|gradebook|student support|counselor)/i.test(transcriptText) ? 'Leader connected response steps to student learning and support structures.' : 'Academic impact was referenced minimally; define instructional supports and monitoring more clearly.' },
      { label: 'Team & Systems Leadership', level: inferFrameworkLevel(transcriptText, [/(meeting with counselor|teacher notes|documented|written update|owner)/i], [/(no one knows|nobody follows up)/i], [/(conference|update)/i]), evidence: /(meeting with counselor|teacher notes|documented|written update)/i.test(transcriptText) ? 'Cross-team coordination and documentation were visible in commitments.' : 'System coordination is implied but thin; assign owners, communication cadence, and documentation steps.' },
    ],
    leadershipMovesObservedAndAvailable: {
      movesYouUsed: leadershipSkills.slice(0, 2).map((skill, idx) => ({
        skillName: skill.skillName,
        shortExplanation: `This resembled ${skill.skillName.toLowerCase()} through steady process language under pressure.`,
        transcriptEvidence: userLines[idx]?.text ? `When you said, "${userLines[idx].text.slice(0, 180)}", this reflected a coaching move tied to structure and clarity.` : '',
        whyItHelped: 'It helped keep the conversation anchored to actionable next steps instead of escalating emotionally.',
      })).filter((move) => move.transcriptEvidence),
      movesToConsiderNextTime: leadershipSkills.slice(2, 4).map((skill) => ({
        skillName: skill.skillName,
        momentOpportunity: 'A possible move available here is during moments where the parent requests certainty before verification is complete.',
        suggestedPhrasing: skill.exampleLanguage || 'A strategy to consider next time is pairing empathy with one concrete next step and timeline.',
        whyItMayHelp: 'Another option could have been to lower defensiveness while maintaining role clarity and follow-through credibility.',
      })),
    },
    parentPatternAnalysis: parentPatternAnalysis.length || isShortTranscript(transcriptLines)
      ? parentPatternAnalysis
      : [{ pattern: 'Limited evidence', evidence: 'Transcript did not contain enough parent turns to identify stable patterns.', implication: 'Collect additional transcript evidence before making pattern-level judgments.' }],
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
  const tacticCards = (await loadJson('tactic-patterns.json').catch(() => ({ tactics: [] })))?.tactics || [];
  const leadershipSkillsData = await loadJson('leadership-skills.json').catch(() => ({ skills: [] }));
  const leadershipSkills = normalizeLeadershipSkills(leadershipSkillsData?.skills);
  const fallback = buildFallbackReport(payload, tacticCards, leadershipSkills);
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ ...fallback, apiStatus: 'fallback', fallbackReason: 'missing-api-key' });
  const reportLanguageInstruction = payload.interfaceLanguage === 'es' ? 'Spanish' : 'English';

  const prompt = `Generate a Human Equation post-call coaching report JSON organized around the Human Equation Leadership Framework.
Canonical order: Trust Construction, Human Awareness, Reality Anchoring, Regulation Under Pressure, Accountability Balance, Vision & Change Leadership, Instructional & Academic Leadership, Team & Systems Leadership.
Use this doctrine exactly for interpretation:
${HUMAN_EQUATION_COACHING_CONSTITUTION}

Implementation requirements:
- Evaluate strategic pressure by function/outcome, not by emotional comfort alone.
- Distinguish strategic firmness from unnecessary escalation.
- parentPatternAnalysis must be an array of objects with keys: pattern, evidence, implication.
- Parent patterns must be analyzed separately from leader performance; include patterns when evidence exists.
- Do not use "limited evidence" wording unless the transcript is very short or empty.
- Use setup/cards archetype fields when present (Common Tactics Used, Escalation Triggers, Calming Factors, Hidden Fear/Vulnerability, Speech Pattern, Typical Phrases, Manipulation Style, Relationship to School, Likely Ending State) as pattern guidance, but still infer directly from transcript language.
- Add a section named "Leadership Moves Observed & Available" as leadershipMovesObservedAndAvailable with exactly two keys:
  - movesYouUsed: array of 2-4 objects with keys skillName, shortExplanation, transcriptEvidence, whyItHelped.
  - movesToConsiderNextTime: array of 1-3 objects with keys skillName, momentOpportunity, suggestedPhrasing, whyItMayHelp.
- Leadership skills are optional tools, not checklist requirements. Never grade skills as pass/fail, never use "failed to use", and never imply scenario-selected skills were required.
- Use reflective language such as: "You appeared to use...", "This resembled...", "A possible move available here...", "A strategy to consider next time...", "Another option could have been...".
- Every move claim must include concrete transcript evidence with a direct quote when available. If exact evidence is unavailable, omit that move claim instead of inventing it.
- Leadership skills reference (optional suggestions only): ${JSON.stringify(leadershipSkills).slice(0, 7000)}

Return JSON only with keys: executiveSummary, humanEquationLeadershipAnalysis (array of {label, level, evidence} in canonical order), leadershipMovesObservedAndAvailable, parentPatternAnalysis, momentsToRevisit, strongerAlternativePhrasing, suggestedFollowUpPlan.
Add conversationTrajectory as an object with exactly these keys:
- startingParentState
- escalationPoints
- containmentAttempts
- turningPoint
- endingState
- overallMovement
Trajectory analysis must evaluate movement over time (start -> escalation/containment -> turn -> ending), not isolated moments.
Do not treat parent anger as automatic leader failure or calmness as automatic success.
Assess whether the leader moved the conversation toward clarity, trust, accountability, realistic follow-up, usable agreement, and shared next steps.
Levels allowed: Strong, Developing, Watch.
Write all visible report text in ${reportLanguageInstruction}.
If evidence is thin, still return all 8 dimensions with concise fallback evidence language.
Write all visible report text in ${reportLanguageInstruction}. Parent language controls the simulated parent speech only and must not force this report language.

Input:
${JSON.stringify(payload).slice(0, 18000)}`;

  try {
    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [{ role: 'system', content: 'Return only JSON.' }, { role: 'user', content: prompt }],
      }),
    });
    if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`);
    const data = await response.json();
    const parsed = JSON.parse(data?.choices?.[0]?.message?.content || '{}');
    return NextResponse.json({ ...fallback, ...parsed, source: 'ai-transcript', apiStatus: 'success' });
  } catch {
    return NextResponse.json({ ...fallback, apiStatus: 'fallback', fallbackReason: 'api-error' });
  }
}
