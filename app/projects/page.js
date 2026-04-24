import Link from 'next/link';
import VisualPlaceholder from '../components/VisualPlaceholder';

const projects = [
  {
    title: 'Day in the Life of a Principal',
    description:
      'Interactive leadership simulation that places school administrators in time-sensitive instructional, operational, and culture decisions.',
    href: '/simulations/principal',
  },
  {
    title: 'Day in the Life of an Urban Student',
    description:
      'Simulation designed to deepen perspective-taking and strengthen instructional planning around real student conditions.',
    href: '/simulations/urban-student',
  },
  {
    title: 'VIC',
    description:
      'A Virtual Co-Teacher framework for AI-supported instruction, differentiated pathways, and actionable teacher insight.',
    href: '/vic',
  },
  {
    title: 'Virtual Leadership Pathway for School Administrators',
    description:
      'A modular development pathway combining simulation, coaching, and reflection for aspiring and current school leaders.',
    href: '/simulations',
  },
];

export default function ProjectsPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Projects</h1>
        <p className="lead">
          Selected work at the intersection of school leadership, instructional design, professional
          learning, and AI-enabled learning systems.
        </p>
        <div className="card-grid">
          {projects.map((project) => (
            <article key={project.title} className="card project-card">
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <Link href={project.href} className="text-link">Open project →</Link>
            </article>
          ))}
        </div>
        <div className="card-grid top-space two-up">
          <VisualPlaceholder
            title="Simulation Product Imagery"
            subtitle="Replace with simulation interface screenshots"
            tag="Project Visual"
            variant="simulation"
          />
          <VisualPlaceholder
            title="VIC Platform Visual"
            subtitle="Replace with VIC workflow or dashboard image"
            tag="AI System"
            variant="vic"
          />
        </div>
      </div>
    </section>
  );
}
