import Link from 'next/link';

export default function SimulationOverviewPage() {
  return (
    <section className="section section-light">
      <div className="container">
        <h1>School Leader Simulation Overview</h1>
        <p className="lead">
          The School Leader Simulation is a real-time leadership experience that places aspiring and
          current administrators inside a full school day.
        </p>
        <p>
          Participants must make decisions across instruction, student behavior, staff management,
          and parent communication — developing the judgment and communication skills required in
          real school leadership.
        </p>
        <p className="top-space-sm">Built from over 20 years of school leadership experience.</p>

        <div className="card top-space-sm">
          <h2>What You’ll Experience</h2>
          <ul className="clean-list top-space-sm">
            <li>Prioritizing instructional, operational, and culture decisions under pressure.</li>
            <li>Responding to stakeholder communication in realistic school contexts.</li>
            <li>Balancing urgency, ethics, and long-term leadership judgment.</li>
          </ul>
        </div>

        <div className="card top-space-sm">
          <h2>How It Works</h2>
          <p>
            You move through scenarios that mirror common leadership moments in schools. Each
            decision contributes to your day progression and helps surface your leadership patterns.
          </p>
          <Link href="/simulation" className="button primary top-space-sm inline-link">
            Launch Simulation →
          </Link>
        </div>
      </div>
    </section>
  );
}
