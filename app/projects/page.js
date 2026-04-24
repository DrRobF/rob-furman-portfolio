import Link from 'next/link';

const projects = [
  {
    title: 'Day in the Life of a Principal',
    description:
      'Interactive leadership simulation that places school administrators in time-sensitive decisions with reflective feedback.',
    href: '/simulations/principal',
  },
  {
    title: 'Day in the Life of an Urban Student',
    description:
      'Simulation concept designed to build empathy and decision-awareness around student experiences in urban contexts.',
    href: '/simulations/urban-student',
  },
  {
    title: 'VIC',
    description:
      'A virtual co-teacher framework for AI-supported instruction, student support, and differentiated pathways.',
    href: '/vic',
  },
  {
    title: 'Virtual Leadership Pathway for School Administrators',
    description:
      'A modular pathway focused on applied leadership skills through simulation, coaching structures, and scenario analysis.',
    href: '/simulations',
  },
];

export default function ProjectsPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Projects</h1>
        <p className="lead">Selected initiatives in simulation-based learning, AI support systems, and leadership development.</p>
        <div className="card-grid">
          {projects.map((project) => (
            <article key={project.title} className="card">
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <Link href={project.href} className="text-link">Open project →</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
