import { pageMeta } from '../../lib/seo';
import HumanEquationExperience from '../../human-equation/HumanEquationExperience';
import HumanEquationShell from '../../components/HumanEquationShell';
import HelpSuiteShell from '../../components/help/HelpSuiteShell';

export const metadata = pageMeta({
  title: 'Parent Call Rehearsal | Practice Difficult Parent Conversations | H.E.L.P.',
  description: 'Rehearse a difficult parent phone call with a realistic AI parent, then get coaching on tone, trust, and next steps. Free practice for principals and teachers.',
  path: '/human-equation-suite/parent-call',
  image: '/images/og/help.png',
});

export default function ParentCallSuitePage() {
  return (
    <HumanEquationShell activePath="Parent Call Rehearsal">
      <HelpSuiteShell currentArea="parent-call" showHeader={false}>
        <HumanEquationExperience />
      </HelpSuiteShell>
    </HumanEquationShell>
  );
}
