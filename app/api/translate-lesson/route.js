const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const headers = () => ({ Authorization: `Bearer ${OPENAI_API_KEY}` });
const stripCodeFences = (value = '') => value.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

export async function POST(request) {
  try {
    if (!OPENAI_API_KEY) {
      console.error('[translate-lesson] missing OPENAI_API_KEY');
      return Response.json({ error: 'Server misconfigured: OPENAI_API_KEY is not set.' }, { status: 500 });
    }
    const body = await request.json();
    const { turns, learningLanguage = 'Spanish' } = body || {};

    if (!Array.isArray(turns) || turns.length === 0) {
      return Response.json({ error: 'Add at least one translated turn before creating a lesson.' }, { status: 400 });
    }

    const validTurns = turns.map((turn) => ({ speaker: turn?.speaker || '', sourceLanguage: turn?.sourceLanguage || '', targetLanguage: turn?.targetLanguage || '', transcript: turn?.transcript || '', translation: turn?.translation || '' })).filter((turn) => turn.transcript.trim() && turn.translation.trim());
    if (!validTurns.length) return Response.json({ error: 'Add at least one translated turn before creating a lesson.' }, { status: 400 });

    const prompt = {
      instruction: `Build a practical ${learningLanguage} mini-lesson from these turns. Focus on practical phrases, quick replies, pronunciation support, and active recall. Keep grammar jargon minimal.`,
      outputShape: {
        phrases: [{ learningText: '...', englishMeaning: '...', pronunciationHint: '...' }],
        quickReplies: [{ learningText: '...', englishMeaning: '...', whenToUse: '...' }],
        practice: [{ promptEnglish: '...', answerLearningLanguage: '...' }],
        quiz: [{ questionEnglish: '...', answerLearningLanguage: '...', hint: '...' }],
        reviewLater: [{ learningText: '...', englishMeaning: '...' }],
        sayThisNext: [{ learningText: '...', englishMeaning: '...', tone: 'friendly' }],
      },
      turns: validTurns,
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { ...headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'Return strict JSON only. Include both learning-language text and English meaning for phrases/quickReplies/reviewLater/sayThisNext. Include at least 5 combined practice+quiz items when possible. Never include markdown.' },
          { role: 'user', content: JSON.stringify(prompt) },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      const detail = data?.error?.message || data?.error || 'Lesson creation failed.';
      console.error('[translate-lesson] openai request failed', { detail });
      throw new Error(detail);
    }

    const lesson = JSON.parse(stripCodeFences(data?.choices?.[0]?.message?.content || '{}'));
    return Response.json({
      phrases: Array.isArray(lesson.phrases) ? lesson.phrases : [],
      quickReplies: Array.isArray(lesson.quickReplies) ? lesson.quickReplies : [],
      practice: Array.isArray(lesson.practice) ? lesson.practice : [],
      quiz: Array.isArray(lesson.quiz) ? lesson.quiz : [],
      reviewLater: Array.isArray(lesson.reviewLater) ? lesson.reviewLater : [],
      sayThisNext: Array.isArray(lesson.sayThisNext) ? lesson.sayThisNext : [],
    });
  } catch (error) {
    console.error('[translate-lesson] server failure', { detail: error?.message || 'Lesson creation failed.' });
    return Response.json({ error: error.message || 'Lesson creation failed.' }, { status: 500 });
  }
}
