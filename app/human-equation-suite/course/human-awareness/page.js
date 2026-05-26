import FactorModulePage from '../FactorModulePage';

export default function Page() {
  return <FactorModulePage
    factorKey='humanAwareness'
    title='Human Awareness'
    quote='Pressure changes what humans notice first.'
    teaching='Leaders miss human cues when urgency narrows attention. In real schools, that can sound like over-focusing on compliance while people are signaling fear, identity threat, or trust rupture. Staff may feel reduced to performance. Parents may feel dismissed before understood. Students may feel judged before seen. Recovery is possible: name that you moved too fast, reopen interpretation, and reset with both care and clarity.'
    recoveryGuide='What to practice this week: in one high-pressure interaction each day, pause ten seconds, name one observable fact, one probable human experience, and one next step. This protects dignity without losing direction.'
    reflections={[
      'Where do you interpret too quickly: parent conflict, staff resistance, or student behavior moments?',
      'What might staff be feeling in your hardest meetings that is easy to miss?',
      'When have you been technically correct but emotionally incomplete as a leader?',
      'How will you recover the next time you move too fast?'
    ]}
    interactions={[
      { prompt: 'A veteran teacher gets defensive in a curriculum meeting after you ask about student engagement. What do you notice first?', options: [
        { label: 'Fear of losing credibility', feedback: 'This read protects dignity and may surface identity-threat dynamics quickly.' },
        { label: 'Resistance to accountability', feedback: 'This read protects standards, but may close curiosity too early.' },
        { label: 'Concern about implementation pace', feedback: 'This read can unlock practical barriers and reduce personalization.' },
        { label: 'Past history with evaluation', feedback: 'This read broadens context and may explain intensity without excusing behavior.' },
      ]},
      { prompt: 'A parent arrives angry, repeating “nobody listens here.” What do you attend to first?', options: [
        { label: 'The factual complaint', feedback: 'Facts matter, but trust messaging may still drive the escalation.' },
        { label: 'The repeated trust message', feedback: 'Attending to trust first can lower heat and open facts.' },
        { label: 'The public escalation risk', feedback: 'Risk awareness protects operations, though it can feel impersonal.' },
        { label: 'The staff member being accused', feedback: 'Protecting staff is valid, but parent trust may need parallel attention.' },
      ]},
      { prompt: 'A quiet student suddenly refuses to enter class. What do you notice first?', options: [
        { label: 'Defiance', feedback: 'Can trigger fast compliance moves; check for hidden context before concluding.' },
        { label: 'Fear', feedback: 'Opens a safety-informed intervention pathway.' },
        { label: 'Peer dynamics', feedback: 'Highlights social pressure as a likely driver.' },
        { label: 'Adult relationship rupture', feedback: 'Surfaces possible trust break with a key adult.' },
      ]},
      { prompt: 'Staff nod through a new initiative but leave silently. What do you notice first?', options: [
        { label: 'Agreement', feedback: 'Possible, but silence can mask uncertainty or fatigue.' },
        { label: 'Compliance without belief', feedback: 'Useful read when implementation energy feels flat.' },
        { label: 'Unclear implementation', feedback: 'Targets practical clarity and ownership.' },
        { label: 'Fatigue from prior changes', feedback: 'Names change burden and protects long-term trust.' },
      ]},
      { prompt: 'A teacher follows policy perfectly but the situation still gets worse. What do you notice first?', options: [
        { label: 'Policy fidelity', feedback: 'Important baseline, but not the full diagnostic.' },
        { label: 'Relational breakdown', feedback: 'Centers the human channel that policy alone cannot solve.' },
        { label: 'Missing context', feedback: 'Keeps inquiry alive before assigning blame.' },
        { label: 'Lack of student readiness', feedback: 'Highlights developmental mismatch and support design.' },
      ]},
      { prompt: 'Your AP brings a discipline recommendation that is technically correct but emotionally incomplete. What do you notice first?', options: [
        { label: 'Consistency', feedback: 'Protects fairness, but may miss lived impact.' },
        { label: 'Missing student context', feedback: 'Expands judgment quality and response fit.' },
        { label: 'Parent optics', feedback: 'Useful external lens; still needs internal equity lens.' },
        { label: 'Staff precedent', feedback: 'Protects coherence across cases and team trust.' },
      ]},
    ]}
  />;
}
