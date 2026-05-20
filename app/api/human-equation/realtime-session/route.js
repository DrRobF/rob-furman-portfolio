import { buildSimulationPrompt } from '../../../../lib/human-equation/buildSimulationPrompt';

export async function POST(request) {
  try {
    const rawSdp = await request.text();

    if (!rawSdp || typeof rawSdp !== 'string') {
      return new Response('Missing SDP offer.', { status: 400 });
    }

    const setupHeader = request.headers.get('x-simulation-setup');
    const canonicalScenarioHeader = request.headers.get('x-canonical-scenario');
    const setup = setupHeader ? JSON.parse(setupHeader) : {};
    const canonicalScenario = canonicalScenarioHeader ? JSON.parse(canonicalScenarioHeader) : null;
    if (!canonicalScenario || typeof canonicalScenario !== 'object') {
      return new Response('Please generate and review a briefing before starting the call.', { status: 400 });
    }
    if (process.env.NODE_ENV !== 'production') {
      console.log('HUMAN_EQUATION_REALTIME_CANONICAL_SCENARIO', {
        scenarioId: canonicalScenario.scenarioId || setup.scenarioNonce || null,
        issueSummary: canonicalScenario.issueSummary || null,
        scenarioType: setup.scenarioType || null,
        parentArchetype: canonicalScenario.parentArchetype || null,
        hasCanonicalScenario: true,
      });
    }
    const simulation = await buildSimulationPrompt(setup);
    const canonicalScenarioBlock = `CANONICAL_SCENARIO:\n${JSON.stringify(canonicalScenario)}`;
    const canonicalGuardrails = [
      'You are the parent/guardian in this exact school incident.',
      'You must stay consistent with the provided CANONICAL_SCENARIO block.',
      'Do not invent a different incident, location, staff member, student concern, or timeline.',
      'If the administrator mentions facts that do not match the scenario, respond naturally by correcting them from the parent perspective.',
    ].join(' ');

    const session = {
      type: 'realtime',
      model: 'gpt-realtime',
      instructions: `${simulation.prompt}\n\n${canonicalGuardrails}\n\n${canonicalScenarioBlock}`,
      audio: {
        input: {
          transcription: {
            model: 'gpt-4o-mini-transcribe',
          },
        },
        output: { voice: 'marin' },
      },
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
