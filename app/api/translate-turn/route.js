import { NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const headers = () => ({ Authorization: `Bearer ${OPENAI_API_KEY}` });

const safeDetail = async (response, fallback) => {
  const text = await response.text();
  try {
    const json = JSON.parse(text);
    return json?.error?.message || text || fallback;
  } catch {
    return text || fallback;
  }
};

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
      return NextResponse.json({ error: 'Invalid audio upload.', step: 'transcription' }, { status: 400 });
    }
    if (audio.size <= 0) {
      return NextResponse.json({ error: 'No speech detected. Please try again.', step: 'transcription' }, { status: 400 });
    }

    const normalizedBuffer = await audio.arrayBuffer();
    const normalizedAudio = new File([normalizedBuffer], 'recording.webm', { type: 'audio/webm' });

    let transcriptionText = '';
    const transcriptionModels = ['whisper-1', 'gpt-4o-transcribe'];
    let transcriptionError = '';

    for (const model of transcriptionModels) {
      console.log('[translate-turn] transcription attempt', {
        audioFileName: normalizedAudio.name,
        audioFileType: normalizedAudio.type,
        audioFileSize: normalizedAudio.size,
        model,
      });
      const transcriptionForm = new FormData();
      transcriptionForm.append('file', normalizedAudio);
      transcriptionForm.append('model', model);
      transcriptionForm.append('response_format', 'text');

      const transcriptionRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: headers(),
        body: transcriptionForm,
      });

      if (transcriptionRes.ok) {
        transcriptionText = (await transcriptionRes.text())?.trim() || '';
        break;
      }

      transcriptionError = await safeDetail(transcriptionRes, 'Transcription failed.');
      console.error('[translate-turn] transcription model failed', { model, transcriptionError });
    }

    const transcript = transcriptionText?.trim() || '';
    if (!transcript) {
      if (transcriptionError) {
        return NextResponse.json({ error: 'Transcription failed', step: 'transcription', detail: transcriptionError }, { status: 500 });
      }
      return NextResponse.json({ error: 'No speech detected. Please try again.', step: 'transcription' }, { status: 400 });
    }

    console.log('[translate-turn] transcript text', { transcript });

    const extractTranslationText = (payload) => {
      if (!payload || typeof payload !== 'object') return '';
      if (typeof payload.output_text === 'string' && payload.output_text.trim()) return payload.output_text.trim();
      if (Array.isArray(payload.choices)) {
        const content = payload.choices?.[0]?.message?.content;
        if (typeof content === 'string' && content.trim()) return content.trim();
      }
      return '';
    };

    const requestTranslation = async (prompt) => {
      const translationRes = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: { ...headers(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          input: [
            {
              role: 'system',
              content: 'You are a translation engine. Return only the translated text. Do not explain.',
            },
            { role: 'user', content: prompt },
          ],
        }),
      });
      return translationRes;
    };

    let translation = '';
    try {
      const primaryPrompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}: ${transcript}`;
      const translationRes = await requestTranslation(primaryPrompt);

      if (!translationRes.ok) {
        const detail = await safeDetail(translationRes, 'Translation failed.');
        return NextResponse.json({ error: 'Translation failed', step: 'translation', detail, transcript }, { status: 500 });
      }

      const translationJson = await translationRes.json();
      translation = extractTranslationText(translationJson);
      if (!translation) {
        console.error('[translate-turn] blank translation on primary prompt', { translationJson });
        const retryPrompt = `Translate to ${targetLanguage}: ${transcript}`;
        const retryRes = await requestTranslation(retryPrompt);
        if (!retryRes.ok) {
          const detail = await safeDetail(retryRes, 'Translation failed.');
          return NextResponse.json({ error: 'Translation failed', step: 'translation', detail, transcript }, { status: 500 });
        }
        const retryJson = await retryRes.json();
        translation = extractTranslationText(retryJson);
        if (!translation) {
          console.error('[translate-turn] blank translation on retry prompt', { retryJson });
          return NextResponse.json(
            { error: 'Translation failed', step: 'translation', detail: 'Model returned blank translation.', transcript },
            { status: 400 }
          );
        }
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Translation failed', step: 'translation', detail: error?.message || 'Unknown translation error.', transcript },
        { status: 500 }
      );
    }

    try {
      const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: { ...headers(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-4o-mini-tts', voice: 'alloy', input: translation, format: 'mp3' }),
      });

      if (!ttsRes.ok) {
        const detail = await safeDetail(ttsRes, 'Speech generation failed.');
        return NextResponse.json({ error: 'Speech generation failed', step: 'tts', detail }, { status: 500 });
      }

      const ttsBase64 = Buffer.from(await ttsRes.arrayBuffer()).toString('base64');
      return NextResponse.json({ transcript, translation, audioBase64: ttsBase64, speaker, sourceLanguage, targetLanguage });
    } catch (error) {
      return NextResponse.json({ error: 'Speech generation failed', step: 'tts', detail: error?.message || 'Unknown speech error.' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Translation request failed.', step: 'server', detail: error?.message || 'Unknown server error.' }, { status: 500 });
  }
}
