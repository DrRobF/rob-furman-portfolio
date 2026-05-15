import { buildSimulationPrompt } from '../../../../lib/human-equation/buildSimulationPrompt';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const offerSdp = body?.offerSdp;
    const setup = body?.setup || {};
    const simulation = await buildSimulationPrompt(setup);

    console.log('HUMAN_EQUATION_DATA_COUNTS');
    console.log('parentArchetypes count', simulation.dataCounts?.parentArchetypes || 0);
    console.log('issueCards count', simulation.dataCounts?.issueCards || 0);

    console.log('HUMAN_EQUATION_PROMPT_USED');
    console.log('promptSource', simulation.promptSource);
    console.log('prompt length', simulation.prompt.length);
    console.log('selected archetype', simulation.cards?.openingArchetype?.name || 'fallback');
    console.log('selected issue card', simulation.cards?.issue?.title || 'fallback');
    console.log('error', simulation.fallbackReason || null);

    console.log('HUMAN_EQUATION_PROMPT_METADATA', {
      promptSource: simulation.promptSource,
      selectedScenarioTitle: simulation.cards?.issue?.title || 'fallback',
      selectedParentArchetype: simulation.cards?.openingArchetype?.name || 'fallback',
      selectedTactics: simulation.cards?.tactics || [],
      selectedVulnerabilities: simulation.cards?.vulnerabilities || [],
      selectedLeadershipSkills: simulation.cards?.leadershipSkills || [],
      promptLength: simulation.prompt.length,
      promptPreview: simulation.prompt.slice(0, 1000),
      fallbackReason: simulation.fallbackReason || null,
    });

    if (!offerSdp) {
      return Response.json({ error: 'Missing offerSdp in request body.' }, { status: 400 });
    }

    const realtimeCallPayload = {
      model: 'gpt-realtime',
      sdp: offerSdp,
      instructions: simulation.prompt,
    };

    console.log('HUMAN_EQUATION_REALTIME_CALL_PAYLOAD_KEYS', Object.keys(realtimeCallPayload));
    console.log('HUMAN_EQUATION_REALTIME_CALL_FORMDATA_KEYS', ['model', 'sdp', 'instructions']);

    const formData = new FormData();
    formData.append('model', realtimeCallPayload.model);
    formData.append('sdp', realtimeCallPayload.sdp);
    formData.append('instructions', realtimeCallPayload.instructions);

    const response = await fetch('https://api.openai.com/v1/realtime/calls', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      return Response.json({ error }, { status: response.status });
    }

    const answerSdp = await response.text();
    return Response.json({
      answerSdp,
      realtimeApi: 'v1/realtime',
      realtimeModel: 'gpt-realtime',
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
