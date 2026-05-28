import HumanEquationNav from '../../components/HumanEquationNav';
import HelpSuiteShell from '../../components/help/HelpSuiteShell';
import PrincipalSimulationClient from './PrincipalSimulationClient';

export default function PrincipalSimulationPage() {
  return (
    <section className="section help-suite-page help-suite-internal help-page-dark">
      <div className="container">
        <div className="help-suite-nav-wrap"><HumanEquationNav /></div><HelpSuiteShell currentArea="leadership-sim"><h1>Day in the Life of a Principal</h1>
        <p className="lead">
          A first-version interactive simulation for practicing educational leadership decisions under
          real constraints.
        </p>
        <PrincipalSimulationClient /></HelpSuiteShell>
      </div>
    </section>
  );
}
