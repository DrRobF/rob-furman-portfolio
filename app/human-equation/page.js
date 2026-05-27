import HumanEquationExperience from './HumanEquationExperience';
import HumanEquationShell from '../components/HumanEquationShell';

export const metadata = {
  title: 'The Human Equation | Rob Furman',
  description: 'Prototype leadership simulation for difficult parent/school conversations under pressure.',
};

export default function HumanEquationPage() {
  return (
    <>
      <HumanEquationShell activePath="Parent Call Rehearsal" />
      <HumanEquationExperience />
    </>
  );
}
