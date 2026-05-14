import { promises as fs } from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data', 'human-equation');

const loadJson = async (file) => JSON.parse(await fs.readFile(path.join(dataDir, file), 'utf8'));

export async function buildSimulationPrompt(setup = {}) {
  const [
    parentArchetypes,
    tacticPatterns,
    leadershipSkills,
    vulnerabilities,
    issues,
    behaviorRules,
    interactionWeighting,
    developmentalDynamics,
    scenarioPrototypes,
    promptFramework,
    coachingEngine,
  ] = await Promise.all([
    loadJson('parent-archetypes.json'),
    loadJson('tactic-patterns.json'),
    loadJson('leadership-skills.json'),
    loadJson('hidden-vulnerabilities.json'),
    loadJson('issue-cards.json'),
    loadJson('ai-behavior-rules.json'),
    loadJson('interaction-weighting.json'),
    loadJson('developmental-dynamics.json'),
    loadJson('scenario-prototypes.json'),
    loadJson('ai-prompt-framework.json'),
    loadJson('coaching-engine.json'),
  ]);

  const scenario = scenarioPrototypes.scenarios[0];
  const issue = issues.issues.find((x) => x.id === scenario.issueId);
  const openingArchetype = parentArchetypes.archetypes.find((x) => x.id === scenario.startingArchetypeId);
  const midCallArchetype = parentArchetypes.archetypes.find((x) => x.id === scenario.midCallArchetypeId);
  const endingArchetype = parentArchetypes.archetypes.find((x) => x.id === scenario.possibleEndingArchetypeId);
  const developmentalDynamic = developmentalDynamics.dynamics.find((x) => x.id === scenario.developmentalDynamicId);

  const callTiming = setup.callTiming || 'Unexpected live parent call during school day';
  const voiceProfile = `${setup.parentVoice || 'Female'} voice, tone ${setup.parentTone || 'Escalated'}, style ${setup.communicationStyle || 'Direct but respectful'}`;

  const prompt = `You are roleplaying one real parent in a live school phone call.

Issue Context:
- ${issue.title}
- ${issue.summary}
- Developmental dynamic: ${developmentalDynamic.name} (${developmentalDynamic.traits.join('; ')})
- Call timing/context selected by school leader: ${callTiming}

Archetype Progression:
- Start as ${openingArchetype.name}: ${openingArchetype.description}
- Shift toward ${midCallArchetype.name}: ${midCallArchetype.description}
- Possible ending state: ${endingArchetype.name}: ${endingArchetype.description}

Tactics to use under pressure:
- ${tacticPatterns.tactics.join('\n- ')}

Hidden vulnerabilities driving reactions:
- ${vulnerabilities.vulnerabilities.join('\n- ')}

Leadership skills being tested:
- ${leadershipSkills.skills.join('\n- ')}

Behavior rules:
- ${behaviorRules.rules.join('\n- ')}

Voice realism rules:
- ${promptFramework.framework.voiceRealism.join('\n- ')}
- Voice/persona profile: ${voiceProfile}

Interaction weighting guidance:
- ${Object.entries(interactionWeighting.weighting).map(([k, v]) => `${k}: ${v}`).join(', ')}

Coaching objective:
- ${coachingEngine.coachingEngine.leadershipObjective}
- Success signals: ${coachingEngine.coachingEngine.successSignals.join('; ')}`;

  return {
    prompt,
    cards: {
      issue,
      openingArchetype,
      midCallArchetype,
      endingArchetype,
      tactics: tacticPatterns.tactics,
      vulnerabilities: vulnerabilities.vulnerabilities,
      leadershipSkills: leadershipSkills.skills,
      developmentalDynamic,
      callTiming,
    },
  };
}
