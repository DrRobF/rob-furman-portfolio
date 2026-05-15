import { buildSimulationPrompt } from '../../../../lib/human-equation/buildSimulationPrompt';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const voice = body?.voice || 'alloy';
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
    return Response.json({
      ...data,
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
