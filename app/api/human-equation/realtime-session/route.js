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
    const sessionUpdatePayload = {
      type: 'realtime',
      model: 'gpt-realtime',
      instructions: simulation.prompt,
    };

    const sessionConfig = JSON.stringify(sessionUpdatePayload);

    console.log('HUMAN_EQUATION_CALLS_MINIMAL_PAYLOAD');
    console.log('session keys', Object.keys(sessionUpdatePayload));
    console.log('model', sessionUpdatePayload.model);
    console.log('prompt source', simulation.promptSource);
    console.log('prompt length', simulation.prompt.length);

    const realtimeEndpointUsed = 'https://api.openai.com/v1/realtime/calls';
    const formData = new FormData();
    formData.append('sdp', offerSdp);
    formData.append('session', sessionConfig);

    const response = await fetch(realtimeEndpointUsed, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    console.log('OpenAI status', response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.log('OpenAI error body if failed', errorBody);
      return Response.json({ error: errorBody }, { status: response.status });
    }

    const answerSdp = await response.text();
    console.log('answer starts with v=0', answerSdp.trim().startsWith('v=0'));
    return Response.json({
      answerSdp,
      simulationPrompt: simulation.prompt,
      selectedCards: simulation.cards,
      promptSource: simulation.promptSource,
      promptPreview: simulation.prompt.slice(0, 1500),
      fallbackReason: simulation.fallbackReason || null,
      dataCounts: simulation.dataCounts || { parentArchetypes: 0, issueCards: 0 },
      sessionConfigModel: 'gpt-realtime',
      sessionUpdatePayload,
      realtimeEndpointUsed,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
