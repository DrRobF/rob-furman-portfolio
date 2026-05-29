// Deprecated route retained for redirect/backward compatibility.
// Current canonical route: /human-equation-suite/parent-call
import HumanEquationExperience from './HumanEquationExperience';
import HumanEquationShell from '../components/HumanEquationShell';
import HelpSuiteShell from '../components/help/HelpSuiteShell';

export const metadata = {
  title: 'The Human Equation | Rob Furman',
  description: 'Prototype leadership simulation for difficult parent/school conversations under pressure.',
};

export default function HumanEquationPage() {
  return (
    <HumanEquationShell activePath="Parent Call Rehearsal">
      <HelpSuiteShell currentArea="parent-call" showHeader={false}>
        <HumanEquationExperience />
      </HelpSuiteShell>
    </HumanEquationShell>
  );
}
