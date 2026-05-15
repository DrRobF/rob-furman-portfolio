import { buildSimulationPrompt } from '../../../../lib/human-equation/buildSimulationPrompt';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const offerSdp = body?.offerSdp;
    const setup = body?.setup || {};

    if (!offerSdp) {
      return Response.json({ error: 'Missing offerSdp in request body.' }, { status: 400 });
    }

    const simulation = await buildSimulationPrompt(setup);
    const sessionConfig = JSON.stringify({
      type: 'realtime',
      model: 'gpt-realtime',
      instructions: simulation.prompt,
      audio: {
        output: {
          voice: 'marin',
        },
      },
    });

    console.log('HUMAN_EQUATION_REALTIME_GA_REWRITE');
    console.log('endpoint used', 'https://api.openai.com/v1/realtime/calls');
    console.log('session config keys', ['type', 'model', 'instructions', 'audio']);
    console.log('model used', 'gpt-realtime');
    console.log('prompt source', simulation.promptSource);
    console.log('prompt length', simulation.prompt.length);

    const formData = new FormData();
    formData.append('sdp', offerSdp);
    formData.append('session', sessionConfig);

    const response = await fetch('https://api.openai.com/v1/realtime/calls', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    console.log('OpenAI response status', response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.log('OpenAI error body if failed', errorBody);
      return Response.json({ error: errorBody }, { status: response.status });
    }

    const answerSdp = await response.text();
    return Response.json({
      answerSdp,
      simulationPrompt: simulation.prompt,
      selectedCards: simulation.cards,
      promptSource: simulation.promptSource,
      promptPreview: simulation.prompt.slice(0, 1500),
      fallbackReason: simulation.fallbackReason || null,
      dataCounts: simulation.dataCounts || { parentArchetypes: 0, issueCards: 0 },
      sessionConfigModel: 'gpt-realtime',
      realtimeEndpointUsed: 'https://api.openai.com/v1/realtime/calls',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
