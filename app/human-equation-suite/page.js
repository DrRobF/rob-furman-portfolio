import Link from 'next/link';

const pathwaySteps = [
  {
    title: '1. Leadership Diagnostic',
    detail:
      'Discover your leadership pressure patterns before entering the simulations.',
  },
  {
    title: '2. Parent Call Rehearsal',
    detail:
      'Practice emotionally realistic parent conversations with live AI voice and post-call coaching.',
  },
  {
    title: '3. School Leadership Simulation',
    detail:
      'Move through a pressure-filled school day and see how your decisions shape trust, safety, and follow-through.',
  },
  {
    title: '4. Urban Student Perspective Simulation',
    detail:
      'Experience school through a student’s day and reflect on empathy, systems, and leadership decisions.',
  },
  {
    title: '5. Master Human Equation Report',
    detail:
      'Combine quiz results, simulation performance, and reflection notes into a full leadership growth profile.',
  },
];

const simulationCards = [
  {
    title: 'Leadership Diagnostic',
    description: 'Begin with the full pathway entry point and profile baseline.',
    href: '/human-equation-suite/diagnostic',
    linkText: 'Start Diagnostic →',
  },
  {
    title: 'Parent Call Rehearsal',
    description:
      'Rehearse difficult parent conversations with realistic AI interaction and coaching.',
    href: '/human-equation',
    linkText: 'Open Parent Call Rehearsal →',
  },
  {
    title: 'School Leadership Simulation',
    description:
      'Step into a school leadership scenario where each decision changes outcomes.',
    href: '/simulation-overview',
    linkText: 'Launch School Leadership Simulation →',
  },
  {
    title: 'Urban Student Perspective Simulation',
    description:
      'Experience student realities and reflect on system-level leadership implications.',
    href: '/day-in-the-life-urban-student',
    linkText: 'Launch Urban Student Perspective →',
  },
];

export default function HumanEquationSuitePage() {
  return (
    <section className="section section-light">
      <div className="container">
        <p className="eyebrow">Human Equation Suite</p>
        <h1>The Human Equation</h1>
        <p className="lead">
          AI-powered leadership rehearsal for the moments that test judgment, trust, and emotional
          control.
        </p>
        <p>
          The Human Equation helps school leaders practice the human side of leadership: difficult
          parent conversations, pressure-filled decisions, student-centered perspective, and
          reflective growth. Start with the Leadership Diagnostic for the full pathway, or jump
          directly into any simulation.
        </p>

        <div className="button-row top-space-sm">
          <Link href="/human-equation-suite/diagnostic" className="button primary">
            Start the Leadership Diagnostic
          </Link>
          <Link href="#suite-simulations" className="button secondary">
            Try a Simulation
          </Link>
        </div>
      </div>

      <div className="container top-space">
        <div className="card project-card">
          <h2>Recommended Path</h2>
          <p>
            Start with the diagnostic to establish your profile, then progress through rehearsal,
            school-day leadership scenarios, and student perspective before reviewing your full
            growth report.
          </p>
          <div className="card-grid top-space-sm">
            {pathwaySteps.map((step) => (
              <article key={step.title} className="card card-featured equal-card">
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="container top-space" id="suite-simulations">
        <h2>Jump Directly into the Suite</h2>
        <div className="card-grid">
          {simulationCards.map((card) => (
            <article key={card.title} className="card project-card equal-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <Link href={card.href} className="text-link">
                {card.linkText}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
