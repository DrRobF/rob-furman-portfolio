import HumanEquationNav from '../components/HumanEquationNav';
import SimulationShellClient from './SimulationShellClient';

export default function SimulationPage() {
  return (
    <section className="section section-light">
      <div className="container">
        <HumanEquationNav />
        <SimulationShellClient />
      </div>
    </section>
  );
}
