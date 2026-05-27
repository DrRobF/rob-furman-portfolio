import { NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const headers = () => ({ Authorization: `Bearer ${OPENAI_API_KEY}` });
const openai = {
  chat: {
    completions: {
      create: async ({ model, messages }) => {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { ...headers(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, messages }),
        });

        if (!res.ok) {
          const detail = await safeDetail(res, 'Translation failed.');
          throw new Error(detail);
        }

        return res.json();
      },
    },
  },
};

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
    if (!OPENAI_API_KEY) {
      console.error('[translate-turn] missing OPENAI_API_KEY');
      return NextResponse.json({ error: 'Server misconfigured.', step: 'config', detail: 'OPENAI_API_KEY is not set.' }, { status: 500 });
    }
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

    const sanitizeTranslationResponse = (response) => ({
      id: response?.id || null,
      model: response?.model || null,
      created: response?.created || null,
      usage: response?.usage || null,
      choices: Array.isArray(response?.choices)
        ? response.choices.map((choice, index) => ({
            index: choice?.index ?? index,
            finish_reason: choice?.finish_reason || null,
            message: {
              role: choice?.message?.role || null,
              contentType: typeof choice?.message?.content,
              hasContent: Boolean(choice?.message?.content),
            },
          }))
        : [],
    });

    let translation = '';
    let usedFallbackTranslation = false;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a translation engine. Return only the translated text. Do not explain.',
          },
          {
            role: 'user',
            content: `Translate this from ${sourceLanguage} to ${targetLanguage}: ${transcript}`,
          },
        ],
      });

      translation = response.choices?.[0]?.message?.content?.trim() || '';

      if (!translation) {
        console.error('[translate-turn] blank translation response shape', {
          transcript,
          response: sanitizeTranslationResponse(response),
        });

        if (transcript) {
          usedFallbackTranslation = true;
          translation = `[Translation unavailable] ${transcript}`;
        } else {
          return NextResponse.json(
            { error: 'Translation failed', step: 'translation', detail: 'Model returned blank translation.', transcript },
            { status: 400 }
          );
        }
      }
    } catch (error) {
      console.error('[translate-turn] translation request failed', { detail: error?.message || 'Unknown translation error.' });
      return NextResponse.json(
        { error: 'Translation failed', step: 'translation', detail: error?.message || 'Unknown translation error.', transcript },
        { status: 500 }
      );
    }

    if (usedFallbackTranslation) {
      return NextResponse.json({
        transcript,
        translation,
        speaker,
        sourceLanguage,
        targetLanguage,
        step: 'translation_fallback',
      });
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
      console.error('[translate-turn] tts request failed', { detail: error?.message || 'Unknown speech error.' });
      return NextResponse.json({ error: 'Speech generation failed', step: 'tts', detail: error?.message || 'Unknown speech error.' }, { status: 500 });
    }
  } catch (error) {
    console.error('[translate-turn] server failure', { detail: error?.message || 'Unknown server error.' });
    return NextResponse.json({ error: 'Translation request failed.', step: 'server', detail: error?.message || 'Unknown server error.' }, { status: 500 });
  }
}
