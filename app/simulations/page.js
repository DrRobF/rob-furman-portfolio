import Link from 'next/link';

const simCards = [
  {
    title: 'Day in the Life of a Principal',
    description:
      'Practice leadership decisions under realistic constraints with immediate feedback and leadership insights.',
    href: '/simulations/principal',
  },
  {
    title: 'Day in the Life of an Urban Student',
    description:
      'A narrative simulation designed to strengthen empathy, perspective-taking, and responsive instructional planning.',
    href: '/simulations/urban-student',
  },
];

export default function SimulationsPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Simulations</h1>
        <p className="lead">
          My instructional design approach uses short-cycle scenarios, authentic stakes, and
          practical reflection to move learners from awareness to real-world application.
        </p>
        <div className="card-grid">
          {simCards.map((sim) => (
            <article className="card" key={sim.title}>
              <h2>{sim.title}</h2>
              <p>{sim.description}</p>
              <Link href={sim.href} className="text-link">Launch page →</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
