import { promises as fs } from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data', 'human-equation');

const loadJson = async (file) => JSON.parse(await fs.readFile(path.join(dataDir, file), 'utf8'));

const rudeEducatorGuardrail =
  'If the educator is rude, sarcastic, dismissive, or insulting, you must immediately call it out and escalate. Do not remain polite.';

const pickRandom = (items = []) => items[Math.floor(Math.random() * items.length)];
const pickFirst = (...values) => values.find((value) => typeof value === 'string' && value.trim());

const issueMatchesGradeBand = (issue = {}, gradeBand = '') => {
  if (!gradeBand) return true;
  const ageGroup = (issue.studentAgeGroup || issue.gradeBand || '').toLowerCase();
  return ageGroup.includes(gradeBand.toLowerCase());
};

const sampleItems = (items = [], count = 1) => {
  const copy = [...items];
  const selected = [];
  while (copy.length && selected.length < count) {
    selected.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return selected;
};

const buildFallbackPrompt = (setup = {}) => `You are roleplaying one real parent in a live school phone call. Stay emotionally realistic and responsive to the educator's tone.

${rudeEducatorGuardrail}

Call timing/context selected by school leader: ${setup.callTiming || 'Unexpected live parent call during school day'}.`; 

export async function buildSimulationPrompt(setup = {}) {
  try {
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

    const issueDeck = Array.isArray(issues) ? issues : issues.issues || [];
    const archetypeDeck = Array.isArray(parentArchetypes) ? parentArchetypes : parentArchetypes.archetypes || [];
    const scenarioDeck = scenarioPrototypes?.scenarios || [];

    console.log('HUMAN_EQUATION_DATA_COUNTS');
    console.log('parentArchetypes count', archetypeDeck.length);
    console.log('issueCards count', issueDeck.length);

    const scenarioCandidates = scenarioDeck.filter((scenario) => {
      const issueDeck = Array.isArray(issues) ? issues : issues.issues || [];
      const issue = issueDeck.find((x) => (x.id || x.cardId) === scenario.issueId);
      return issueMatchesGradeBand(issue, setup.gradeBand);
    });
    const scenario = pickRandom(scenarioCandidates.length ? scenarioCandidates : scenarioDeck);

    const normalizedIssues = issueDeck.map((x) => ({
      ...x,
      id: x.id || x.cardId || '',
      title: pickFirst(x.issueType, x.title, x.name) || '',
      summary: pickFirst(x.scenarioSummary, x.summary, x.description) || '',
      gradeBand: x.gradeBand || x.studentAgeGroup || '',
    }));
    const issueCandidates = normalizedIssues.filter((x) => issueMatchesGradeBand(x, setup.gradeBand));
    const issue = pickRandom(issueCandidates.length ? issueCandidates : normalizedIssues);

    const normalizeArchetype = (archetype) => ({
      ...archetype,
      id: archetype.id || archetype.cardId || '',
      name: pickFirst(archetype.archetypeName, archetype.name, archetype.title) || '',
      description:
        archetype.description ||
        [archetype.emotionalStyle, archetype.primaryGoal, archetype.commonTacticsUsed].filter(Boolean).join(' | '),
    });

    const normalizedArchetypes = archetypeDeck.map(normalizeArchetype);

    const openingArchetype = normalizedArchetypes.find((x) => x.id === scenario?.startingArchetypeId) || pickRandom(normalizedArchetypes);
    const midCallArchetype = normalizedArchetypes.find((x) => x.id === scenario?.midCallArchetypeId) || pickRandom(normalizedArchetypes);
    const endingArchetype = normalizedArchetypes.find((x) => x.id === scenario?.possibleEndingArchetypeId) || pickRandom(normalizedArchetypes);

    const dynamicsDeck = developmentalDynamics?.dynamics || [];
    const developmentalByGrade = dynamicsDeck.filter((d) => d.name.toLowerCase().includes((setup.gradeBand || '').split(' ')[0]?.toLowerCase()));
    const developmentalDynamic = dynamicsDeck.find((x) => x.id === scenario?.developmentalDynamicId) || pickRandom(developmentalByGrade.length ? developmentalByGrade : dynamicsDeck);

    const tacticDeck = tacticPatterns?.tactics || [];
    const vulnerabilityDeck = vulnerabilities?.vulnerabilities || [];
    const leadershipDeck = leadershipSkills?.skills || [];
    const selectedTactics = sampleItems(tacticDeck, Math.min(3, tacticDeck.length));
    const selectedVulnerabilities = sampleItems(vulnerabilityDeck, Math.min(2, vulnerabilityDeck.length));
    const selectedLeadershipSkills = sampleItems(leadershipDeck, Math.min(3, leadershipDeck.length));

    if (!issue?.title || !issue?.summary || !openingArchetype?.name) {
      throw new Error('Missing issue/archetype data after normalization');
    }

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
- ${selectedTactics.join('\n- ')}

Hidden vulnerabilities driving reactions:
- ${selectedVulnerabilities.join('\n- ')}

Leadership skills being tested:
- ${selectedLeadershipSkills.join('\n- ')}

Behavior rules:
- ${behaviorRules.rules.join('\n- ')}

Voice realism rules:
- ${promptFramework.framework.voiceRealism.join('\n- ')}
- Voice/persona profile: ${voiceProfile}

Interaction weighting guidance:
- ${Object.entries(interactionWeighting.weighting).map(([k, v]) => `${k}: ${v}`).join(', ')}

Coaching objective:
- ${coachingEngine.coachingEngine.leadershipObjective}
- Success signals: ${coachingEngine.coachingEngine.successSignals.join('; ')}

Critical behavior instruction:
- ${rudeEducatorGuardrail}`;

    return {
      prompt: prompt || buildFallbackPrompt(setup),
      promptSource: 'json',
      dataCounts: {
        parentArchetypes: archetypeDeck.length,
        issueCards: issueDeck.length,
      },
      cards: {
        issue,
        openingArchetype,
        midCallArchetype,
        endingArchetype,
        tactics: selectedTactics,
        vulnerabilities: selectedVulnerabilities,
        leadershipSkills: selectedLeadershipSkills,
        developmentalDynamic,
        callTiming,
      },
    };
  } catch (error) {
    return {
      prompt: buildFallbackPrompt(setup),
      promptSource: 'fallback',
      fallbackReason: error.message,
      dataCounts: {
        parentArchetypes: 0,
        issueCards: 0,
      },
      cards: {
        issue: null,
        openingArchetype: null,
        midCallArchetype: null,
        endingArchetype: null,
        tactics: [],
        vulnerabilities: [],
        leadershipSkills: [],
        developmentalDynamic: null,
        callTiming: setup.callTiming || 'Unexpected live parent call during school day',
      },
    };
  }
}
