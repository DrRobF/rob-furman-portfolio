import { NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const headers = () => ({ Authorization: `Bearer ${OPENAI_API_KEY}` });

const MIME_EXTENSION_MAP = {
  'audio/webm;codecs=opus': 'webm',
  'audio/webm': 'webm',
  'audio/mp4': 'mp4',
  'audio/wav': 'wav',
  'audio/wave': 'wav',
  'audio/x-wav': 'wav',
};

const normalizeMimeType = (mimeType = '') => mimeType.toLowerCase().split(';')[0].trim();

const base64ByteLength = (base64 = '') => {
  const sanitized = base64.replace(/\s/g, '');
  const padding = sanitized.endsWith('==') ? 2 : sanitized.endsWith('=') ? 1 : 0;
  return Math.floor((sanitized.length * 3) / 4) - padding;
};

const getAudioFileName = (mimeType = '') => {
  const normalized = mimeType.toLowerCase().trim();
  const base = normalizeMimeType(normalized);
  const extension = MIME_EXTENSION_MAP[normalized] || MIME_EXTENSION_MAP[base] || 'webm';
  return `turn.${extension}`;
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { audioBase64, mimeType, sourceLanguage, targetLanguage, speaker } = body || {};

    if (!audioBase64 || !sourceLanguage || !targetLanguage || !speaker) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const audioBytes = Buffer.from(audioBase64, 'base64');
    const safeMimeType = normalizeMimeType(mimeType) || 'audio/webm';

    console.log('[translate-turn] received audioBase64 length', audioBase64.length);
    console.log('[translate-turn] decoded audio buffer size', audioBytes.byteLength);
    console.log('[translate-turn] expected decoded bytes from base64', base64ByteLength(audioBase64));
    console.log('[translate-turn] selected languages', { sourceLanguage, targetLanguage });

    console.log('[translate-turn] Incoming audio payload', {
      blobSize: audioBytes.byteLength,
      mimeType: safeMimeType,
    });

    if (!audioBytes.byteLength) {
      return NextResponse.json({ error: 'No speech detected. Please try again.' }, { status: 400 });
    }

    const audioFile = new File([audioBytes], getAudioFileName(safeMimeType), { type: safeMimeType });
    console.log('[translate-turn] file reconstruction', { fileType: audioFile.type, fileSize: audioFile.size });

    const form = new FormData();
    form.append('file', audioFile);
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
