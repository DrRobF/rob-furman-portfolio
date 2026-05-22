import HumanEquationExperience from './HumanEquationExperience';
import HumanEquationNav from '../components/HumanEquationNav';

export const metadata = {
  title: 'The Human Equation | Rob Furman',
  description: 'Prototype leadership simulation for difficult parent/school conversations under pressure.',
};

export default function HumanEquationPage() {
  return (
    <>
      <section className="section section-light" style={{ paddingBottom: 0 }}>
        <div className="container">
          <HumanEquationNav />
        </div>
      </section>
      <HumanEquationExperience />
    </>
  );
}
