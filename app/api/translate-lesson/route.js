const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const headers = () => ({ Authorization: `Bearer ${OPENAI_API_KEY}` });

export async function POST(request) {
  try {
    const body = await request.json();
    const { turns, learningLanguage } = body || {};

    if (!Array.isArray(turns) || !turns.length || !learningLanguage) {
      return Response.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { ...headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        text: { format: { type: 'json_object' } },
        input: [
          {
            role: 'system',
            content:
              'Create a compact language lesson from a bilingual conversation. Return valid JSON with keys vocabulary, phrases, pattern, practice, quiz, reviewNextTime.',
          },
          { role: 'user', content: JSON.stringify({ turns, learningLanguage }) },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || 'Lesson creation failed.');
    }

    const lesson = JSON.parse(data.output_text || '{}');

    return Response.json({
      vocabulary: lesson.vocabulary || [],
      phrases: lesson.phrases || [],
      pattern: lesson.pattern || '',
      practice: lesson.practice || [],
      quiz: lesson.quiz || [],
      reviewNextTime: lesson.reviewNextTime || [],
    });
  } catch (error) {
    return Response.json({ error: error.message || 'Lesson creation failed.' }, { status: 500 });
  }
}
