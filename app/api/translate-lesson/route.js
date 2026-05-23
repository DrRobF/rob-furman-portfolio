const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const headers = () => ({ Authorization: `Bearer ${OPENAI_API_KEY}` });

const stripCodeFences = (value = '') => value.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

export async function POST(request) {
  try {
    const body = await request.json();
    const { turns } = body || {};

    if (!Array.isArray(turns) || turns.length === 0) {
      return Response.json(
        { error: 'Add at least one translated turn before creating a lesson.' },
        { status: 400 },
      );
    }

    const validTurns = turns
      .map((turn) => ({
        speaker: turn?.speaker || '',
        sourceLanguage: turn?.sourceLanguage || '',
        targetLanguage: turn?.targetLanguage || '',
        transcript: turn?.transcript || '',
        translation: turn?.translation || '',
      }))
      .filter((turn) => turn.transcript.trim() && turn.translation.trim());

    if (!validTurns.length) {
      return Response.json(
        { error: 'Add at least one translated turn before creating a lesson.' },
        { status: 400 },
      );
    }

    const prompt = {
      instruction:
        'Use only the conversation turns provided. Keep the lesson honest and compact. If content is minimal, return a small practical lesson without inventing unrelated topics.',
      outputShape: {
        vocabulary: [{ word: '...', meaning: '...', example: '...' }],
        phrases: [{ phrase: '...', meaning: '...' }],
        pattern: '...',
        practice: ['...', '...'],
        quiz: [{ question: '...', answer: '...' }],
        reviewNextTime: ['...', '...'],
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
          {
            role: 'system',
            content:
              'You are a language coach. Return strict JSON only with keys: vocabulary, phrases, pattern, practice, quiz, reviewNextTime. Never include markdown or code fences.',
          },
          { role: 'user', content: JSON.stringify(prompt) },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || 'Lesson creation failed.');
    }

    const rawContent = data?.choices?.[0]?.message?.content || '{}';
    const safeContent = stripCodeFences(rawContent);

    let lesson;
    try {
      lesson = JSON.parse(safeContent);
    } catch (parseError) {
      return Response.json(
        {
          error: 'Lesson response could not be parsed as JSON.',
          detail: parseError?.message || 'Invalid JSON structure.',
        },
        { status: 502 },
      );
    }

    return Response.json({
      vocabulary: Array.isArray(lesson.vocabulary) ? lesson.vocabulary : [],
      phrases: Array.isArray(lesson.phrases) ? lesson.phrases : [],
      pattern: typeof lesson.pattern === 'string' ? lesson.pattern : '',
      practice: Array.isArray(lesson.practice) ? lesson.practice : [],
      quiz: Array.isArray(lesson.quiz) ? lesson.quiz : [],
      reviewNextTime: Array.isArray(lesson.reviewNextTime) ? lesson.reviewNextTime : [],
    });
  } catch (error) {
    return Response.json(
      { error: error.message || 'Lesson creation failed.' },
      { status: 500 },
    );
  }
}
