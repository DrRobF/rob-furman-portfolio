import { buildSimulationPrompt } from '../../../../lib/human-equation/buildSimulationPrompt';

export async function POST(request) {
  try {
    const rawSdp = await request.text();

    if (!rawSdp || typeof rawSdp !== 'string') {
      return new Response('Missing SDP offer.', { status: 400 });
    }

    const setupHeader = request.headers.get('x-simulation-setup');
    const setup = setupHeader ? JSON.parse(setupHeader) : {};
    const simulation = await buildSimulationPrompt(setup);

    const session = {
      type: 'realtime',
      model: 'gpt-realtime',
      instructions: simulation.prompt,
      audio: { output: { voice: 'marin' } },
    };

    const fd = new FormData();
    fd.set('sdp', rawSdp);
    fd.set('session', JSON.stringify(session));

    const response = await fetch('https://api.openai.com/v1/realtime/calls', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: fd,
    });

    const answerText = await response.text();

    return new Response(answerText, {
      status: response.status,
      headers: {
        'Content-Type': 'application/sdp',
      },
    });
  } catch (error) {
    return new Response(error.message || 'Server error', { status: 500 });
  }
}
