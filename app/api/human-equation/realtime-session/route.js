import { buildSimulationPrompt } from '../../../../lib/human-equation/buildSimulationPrompt';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const setup = body?.setup || {};
    const sdp = body?.sdp;

    if (!sdp || typeof sdp !== 'string') {
      return Response.json({ error: 'Missing SDP offer.' }, { status: 400 });
    }

    const simulation = await buildSimulationPrompt(setup);

    const session = {
      type: 'realtime',
      model: 'gpt-realtime',
      instructions: simulation.prompt,
    };

    const formData = new FormData();
    formData.append('sdp', sdp);
    formData.append('session', JSON.stringify(session));

    const response = await fetch('https://api.openai.com/v1/realtime/calls', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    const answerSdp = await response.text();

    if (!response.ok) {
      return Response.json({ error: answerSdp }, { status: response.status });
    }

    return Response.json({
      answerSdp,
      simulationPrompt: simulation.prompt,
      selectedCards: simulation.cards,
      promptSource: simulation.promptSource,
      promptPreview: simulation.prompt.slice(0, 1500),
      fallbackReason: simulation.fallbackReason || null,
      dataCounts: simulation.dataCounts || { parentArchetypes: 0, issueCards: 0 },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
