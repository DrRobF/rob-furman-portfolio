const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const headers = () => ({ Authorization: `Bearer ${OPENAI_API_KEY}` });

export async function POST(request) {
  try {
    const body = await request.json();
    const { audioBase64, sourceLanguage, targetLanguage, speaker } = body || {};

    if (!audioBase64 || !sourceLanguage || !targetLanguage || !speaker) {
      return Response.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const audioBytes = Buffer.from(audioBase64, 'base64');
    const form = new FormData();
    form.append('file', new Blob([audioBytes], { type: 'audio/webm' }), 'turn.webm');
    form.append('model', 'gpt-4o-transcribe');
    form.append('response_format', 'text');

    const transcriptionRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: headers(),
      body: form,
    });

    const transcript = (await transcriptionRes.text()).trim();
    if (!transcriptionRes.ok) {
      throw new Error(transcript || 'Transcription failed.');
    }

    const translationRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { ...headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content:
              'You are a concise translator. Translate only, no explanation. Preserve meaning and tone.',
          },
          { role: 'user', content: `Translate from ${sourceLanguage} to ${targetLanguage}: ${transcript}` },
        ],
      }),
    });

    const translationJson = await translationRes.json();
    if (!translationRes.ok) {
      throw new Error(translationJson?.error?.message || 'Translation failed.');
    }

    const translation = translationJson.output_text?.trim() || '';

    const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { ...headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4o-mini-tts', voice: 'alloy', input: translation, format: 'mp3' }),
    });

    if (!ttsRes.ok) {
      const errorText = await ttsRes.text();
      throw new Error(errorText || 'Speech generation failed.');
    }

    const ttsBase64 = Buffer.from(await ttsRes.arrayBuffer()).toString('base64');

    return Response.json({ transcript, translation, audioBase64: ttsBase64, speaker, sourceLanguage, targetLanguage });
  } catch (error) {
    return Response.json({ error: error.message || 'Translation request failed.' }, { status: 500 });
  }
}
