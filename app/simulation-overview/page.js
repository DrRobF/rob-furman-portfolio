import Link from 'next/link';

export default function SimulationOverviewPage() {
  return (
    <section className="section section-light">
      <div className="container">
        <h1>School Leader Simulation Overview</h1>
        <p className="lead">Most leadership training talks about what you should do.</p>
        <p>This simulation puts you in the moment where you actually have to decide.</p>
        <p>
          The School Leader Simulation places you inside a full school day — where priorities
          conflict, communication matters, and every decision carries consequences.
        </p>
        <p>
          You will respond to real-world scenarios across instruction, student behavior, staff
          dynamics, and parent communication, building the judgment and communication skills
          required in actual school leadership.
        </p>
        <p className="top-space-sm">Built from over 20 years of real leadership experience.</p>

        <div className="card top-space-sm">
          <h2>What You’ll Experience</h2>
          <ul className="clean-list top-space-sm">
            <li>Making real decisions under time pressure and competing priorities</li>
            <li>
              Writing responses to parent, staff, and student situations that require clarity and
              professionalism
            </li>
            <li>
              Navigating moments where there is no perfect answer — only better judgment
            </li>
            <li>Seeing how your decisions shape outcomes across a full school day</li>
          </ul>
        </div>

        <div className="card top-space-sm">
          <h2>How It Works</h2>
          <p>You move through a full school day made up of realistic leadership scenarios.</p>
          <p>Each situation requires you to:</p>
          <ul className="clean-list">
            <li>assess the context</li>
            <li>make a decision</li>
            <li>communicate your response when needed</li>
          </ul>
          <p>
            Your choices move the day forward — revealing patterns in how you prioritize, respond,
            and lead under pressure.
          </p>
          <p>This is not passive learning. It is applied decision-making.</p>
          <Link href="/simulation" className="button primary top-space-sm inline-link">
            Launch Simulation →
          </Link>
        </div>
      </div>
    </section>
  );
}
