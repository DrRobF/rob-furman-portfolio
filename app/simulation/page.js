// Deprecated route retained for redirect/backward compatibility.
// Current canonical route: /human-equation-suite/leadership-sim
import HumanEquationNav from '../components/HumanEquationNav';
import HelpSuiteShell from '../components/help/HelpSuiteShell';
import SimulationShellClient from './SimulationShellClient';

export default function SimulationPage() {
  return (
    <section className="section help-suite-page help-suite-internal help-page-dark">
      <div className="container">
        <div className="help-suite-nav-wrap"><HumanEquationNav /></div>
        <HelpSuiteShell currentArea="leadership-sim"><SimulationShellClient /></HelpSuiteShell>
      </div>
    </section>
  );
}
