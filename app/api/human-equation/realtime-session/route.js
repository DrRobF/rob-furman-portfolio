import { buildSimulationPrompt } from '../../../../lib/human-equation/buildSimulationPrompt';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const voice = body?.voice || 'alloy';
    const setup = body?.setup || {};
    const simulation = await buildSimulationPrompt(setup);

    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview',
        voice,
        instructions: simulation.prompt,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return Response.json({ error }, { status: response.status });
    }

    const data = await response.json();
    return Response.json({ ...data, simulationPrompt: simulation.prompt, selectedCards: simulation.cards });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
