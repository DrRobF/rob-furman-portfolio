import { NextResponse } from 'next/server';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

function clampScore(value, fallback = 60) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function analyzeResponseQuality(writtenResponses = []) {
  const placeholderPattern = /^(idk|ok|done|yada yada|n\/a|none|nope|call parent|unknown)$/i;
  let completeResponses = 0;
  let minimalResponses = 0;
  let invalidResponses = 0;
  let offTopicResponses = 0;

  writtenResponses.forEach((entry) => {
    const text = `${entry?.response || ''}`.trim();
    const words = text.split(/\s+/).filter(Boolean);
    if (!text) {
      invalidResponses += 1;
      return;
    }
    if (placeholderPattern.test(text.toLowerCase()) || words.length <= 5) {
      minimalResponses += 1;
      return;
    }
    if (/(asdf|lorem ipsum|blah blah|test test)/i.test(text)) {
      invalidResponses += 1;
      return;
    }
    if (/(^\W+$)/.test(text)) {
      offTopicResponses += 1;
      return;
    }
    completeResponses += 1;
  });

  const total = writtenResponses.length || 1;
  const completionQualityPercent = clampScore((completeResponses / total) * 100, 0);
  return { completeResponses, minimalResponses, invalidResponses, offTopicResponses, completionQualityPercent };
}

function heuristicEvaluation(payload = {}) {
  const decisions = normalizeArray(payload.selectedDecisions);
  const responses = normalizeArray(payload.writtenResponses);
  const responseQuality = analyzeResponseQuality(responses);
  const weakRatio = (responseQuality.minimalResponses + responseQuality.invalidResponses + responseQuality.offTopicResponses) / (responses.length || 1);

  const decisionQualityScore = clampScore(55 + (decisions.filter((d) => /(investigate|review|document|follow up|safety)/i.test(`${d?.decision || ''}`)).length * 4), 55);
  const writingScore = clampScore(35 + responseQuality.completionQualityPercent * 0.6, 45);
  let overallReadinessScore = clampScore((decisionQualityScore * 0.45) + (writingScore * 0.55), 55);

  if (weakRatio > 0.5) overallReadinessScore = Math.min(overallReadinessScore, 50);
  else if (weakRatio > 0.3) overallReadinessScore = Math.min(overallReadinessScore, 60);

  const readinessLevel = overallReadinessScore >= 90 ? 'Exceptional Readiness'
    : overallReadinessScore >= 80 ? 'Strong Readiness'
      : overallReadinessScore >= 70 ? 'Adequate / Emerging Readiness'
        : overallReadinessScore >= 56 ? 'Developing / Limited Readiness'
          : 'Weak Readiness';

  return {
    evaluationSource: 'heuristic-fallback',
    overallReadinessScore,
    readinessLevel,
    candidateProfile: overallReadinessScore >= 80 ? 'Principal Candidate' : 'Emerging Principal / Assistant Principal Candidate',
    evaluationConfidence: weakRatio > 0.4 ? 'Low' : 'Moderate',
    primaryLeadershipStyle: payload?.primaryLeadershipStyle || 'Mixed / Developing',
    snapshot: {
      trustBuilder: overallReadinessScore >= 80 ? 'Strong' : overallReadinessScore >= 65 ? 'Developing' : 'Concern',
      decisionSpeed: decisionQualityScore >= 78 ? 'Strong' : decisionQualityScore >= 62 ? 'Developing' : 'Concern',
      authorityUnderPressure: overallReadinessScore >= 75 ? 'Strong' : overallReadinessScore >= 62 ? 'Developing' : 'Concern',
      operationalExecution: writingScore >= 78 ? 'Strong' : writingScore >= 62 ? 'Developing' : 'Concern',
    },
    domainScores: {
      judgmentUnderPressure: decisionQualityScore,
      communicationLeadershipVoice: writingScore,
      studentCenteredLeadership: clampScore((writingScore + 6)),
      equityFairness: clampScore((writingScore + 2)),
      safetyRiskAwareness: clampScore((decisionQualityScore + 3)),
      operationalFollowThrough: clampScore((writingScore - 4)),
      instructionalLeadership: clampScore((writingScore - 2)),
    },
    responseQuality,
    strengths: weakRatio > 0.4 ? ['Limited evidence of consistent leadership strengths in written responses.'] : ['Shows some evidence of concern acknowledgment and process orientation.'],
    growthAreas: ['Strengthen specificity, ownership, and timelines in written responses.', 'Provide clearer leadership reasoning tied to scenario evidence.'],
    signatureLeadershipInsight: weakRatio > 0.4 ? 'Current evidence shows limited leadership reasoning depth; responses are often minimal or underdeveloped.' : 'Leadership intent is present, but execution detail is inconsistent across scenarios.',
    communicationLeadershipVoice: weakRatio > 0.4 ? 'Voice lacks sufficient specificity and authority for high-stakes leadership communication.' : 'Tone is generally professional, with room for firmer direction and clearer commitments.',
    schoolClimateCultureImpact: [{ label: 'Student Belonging', rating: weakRatio > 0.4 ? 'Concern' : 'Developing', insight: 'Impact depends on more consistent, specific follow-through language.' }],
    crisisRiskLeadership: weakRatio > 0.4 ? 'Risk leadership is inconsistent due to minimal or incomplete response evidence.' : 'Basic risk awareness is present, but escalation clarity should improve.',
    leadershipReadinessSummary: 'This report was generated using local heuristic fallback scoring.',
    predictedFirst90DaysImpact: 'Likely to build partial trust, but execution quality may vary without coaching and tighter systems.',
    recommendedFollowUpQuestions: ['Describe how you would assign ownership and deadlines after a parent escalation.', 'How do you communicate urgency while preserving trust?'],
    riskFlags: weakRatio > 0.3 ? ['High volume of minimal/invalid/off-topic responses reduced score confidence.'] : [],
  };
}

function sanitizeEvaluation(output, fallback) {
  if (!output || typeof output !== 'object') return fallback;

  const evaluation = { ...fallback, ...output, evaluationSource: 'ai-evaluation' };

  if (evaluation.evaluationSource !== 'heuristic-fallback' && evaluation.leadershipReadinessSummary === fallback.leadershipReadinessSummary) {
    delete evaluation.leadershipReadinessSummary;
  }

  return evaluation;
}

export async function POST(request) {
  console.log('[simulation/evaluate] Simulation evaluate route hit');
  const payload = await request.json().catch(() => ({}));
  const fallback = heuristicEvaluation(payload);
  const hasApiKey = Boolean(process.env.OPENAI_API_KEY);
  console.log(`[simulation/evaluate] OPENAI_API_KEY exists: ${hasApiKey}`);

  if (!hasApiKey) {
    console.log('[simulation/evaluate] Using fallback: missing OPENAI_API_KEY');
    return NextResponse.json({ ...fallback, apiStatus: 'fallback', fallbackReason: 'missing-api-key' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);

  try {
    const prompt = `You are an expert school leadership evaluator reviewing a simulation completed by an aspiring school leader. Evaluate only the evidence provided. Do not assume competence that is not demonstrated. Penalize minimal, vague, off-topic, or nonsense responses. Provide practical, district-style leadership feedback that could be used for coaching, preparation, or evaluation. Return only valid JSON matching the schema. Enforce score caps: if >30% minimal/invalid/off-topic cap overall at 60; if >50% cap at 50.\n\nSimulation data:\n${JSON.stringify(payload).slice(0, 12000)}`;

    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'Return only JSON.' },
          { role: 'user', content: prompt },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`);
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Missing model content');
    const parsed = JSON.parse(content);
    const evaluation = sanitizeEvaluation(parsed, fallback);
    console.log('[simulation/evaluate] OpenAI call succeeded');
    evaluation.apiStatus = 'success';
    return NextResponse.json(evaluation);
  } catch (error) {
    const fallbackReason = error?.name === 'AbortError' ? 'timeout' : 'api-error';
    console.log(`[simulation/evaluate] Using fallback: ${fallbackReason}`);
    return NextResponse.json({ ...fallback, apiStatus: 'fallback', fallbackReason });
  } finally {
    clearTimeout(timeout);
  }
}
