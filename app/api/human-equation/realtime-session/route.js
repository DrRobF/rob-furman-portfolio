import { buildSimulationPrompt } from '../../../../lib/human-equation/buildSimulationPrompt';

const HUMAN_EQUATION_BUILD_VERSION = '2026-05-15 GA-CLEAN-1';

export async function POST(request) {
  try {
    console.log('HUMAN_EQUATION_BUILD_VERSION GA-CLEAN-1');
    const sdp = await request.text();

    if (!sdp || typeof sdp !== 'string') {
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

    const formData = new FormData();
    formData.set('sdp', sdp);
    formData.set('session', JSON.stringify(session));

    const response = await fetch('https://api.openai.com/v1/realtime/calls', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    const answerSdp = await response.text();

    return new Response(answerSdp, {
      status: response.status,
      headers: {
        'Content-Type': 'application/sdp',
        'x-human-equation-build': HUMAN_EQUATION_BUILD_VERSION,
      },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
