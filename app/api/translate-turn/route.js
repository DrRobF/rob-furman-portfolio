import { NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const headers = () => ({ Authorization: `Bearer ${OPENAI_API_KEY}` });

export async function POST(request) {
  try {
    const formData = await request.formData();
    const audio = formData.get('audio');
    const sourceLanguage = formData.get('sourceLanguage');
    const targetLanguage = formData.get('targetLanguage');
    const speaker = formData.get('speaker');

    if (!audio || !sourceLanguage || !targetLanguage || !speaker) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    if (!(audio instanceof File)) {
      return NextResponse.json({ error: 'Invalid audio upload.' }, { status: 400 });
    }

    if (audio.size <= 0) {
      return NextResponse.json({ error: 'No speech detected. Please try again.' }, { status: 400 });
    }

    console.log('[translate-turn] uploaded file', {
      audioFileName: audio.name,
      audioFileType: audio.type,
      audioFileSize: audio.size,
    });
    console.log('[translate-turn] selected languages', { sourceLanguage, targetLanguage });

    const form = new FormData();
    form.append('file', audio);
    form.append('model', 'gpt-4o-transcribe');
    form.append('response_format', 'text');

    const transcriptionRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: headers(),
      body: form,
    });

    const transcriptionText = await transcriptionRes.text();
    console.log('[translate-turn] Transcription API response', {
      ok: transcriptionRes.ok,
      status: transcriptionRes.status,
      body: transcriptionText,
    });

    const transcript = transcriptionText?.trim() || '';
    console.log('[translate-turn] transcription text', transcript);
    if (!transcriptionRes.ok) {
      throw new Error(transcript || 'Transcription failed.');
    }

    if (!transcript) {
      return NextResponse.json({ error: 'No speech detected. Please try again.' }, { status: 400 });
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

    if (!translation.length) {
      return NextResponse.json({ error: 'Translation failed. Please try again.' }, { status: 400 });
    }

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

    return NextResponse.json({ transcript, translation, audioBase64: ttsBase64, speaker, sourceLanguage, targetLanguage });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Translation request failed.' }, { status: 500 });
  }
}
