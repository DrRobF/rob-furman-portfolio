import HumanEquationExperience from '../../human-equation/HumanEquationExperience';
import HumanEquationShell from '../../components/HumanEquationShell';
import HelpSuiteShell from '../../components/help/HelpSuiteShell';

export const metadata = {
  title: 'Parent Call Rehearsal | H.E.L.P.',
  description: 'Practice difficult parent and school conversations inside the H.E.L.P. suite shell.',
};

export default function ParentCallSuitePage() {
  return (
    <HumanEquationShell activePath="Parent Call Rehearsal">
      <HelpSuiteShell currentArea="parent-call" showHeader={false}>
        <HumanEquationExperience />
      </HelpSuiteShell>
    </HumanEquationShell>
  );
}
