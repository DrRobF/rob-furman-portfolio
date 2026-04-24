import PrincipalSimulationClient from './PrincipalSimulationClient';

export default function PrincipalSimulationPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Day in the Life of a Principal</h1>
        <p className="lead">
          A first-version interactive simulation for practicing educational leadership decisions under
          real constraints.
        </p>
        <PrincipalSimulationClient />
      </div>
    </section>
  );
}
