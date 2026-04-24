import Image from 'next/image';
import Link from 'next/link';

const VIC_URL = 'https://vic-final.vercel.app/askvic';

const projects = [
  {
    title: 'Day in the Life of a Principal',
    description:
      'Interactive leadership simulation that places school administrators in time-sensitive instructional, operational, and culture decisions.',
    href: '/simulations/principal',
    linkText: 'Open project →',
  },
  {
    title: 'Day in the Life of an Urban Student',
    description:
      'Simulation designed to deepen perspective-taking and strengthen instructional planning around real student conditions.',
    href: '/simulations/urban-student',
    linkText: 'Open project →',
  },
  {
    title: 'VIC',
    description:
      'A virtual co-teacher framework for AI-supported instruction, differentiated pathways, and actionable teacher insight.',
    href: VIC_URL,
    linkText: 'Explore VIC →',
    external: true,
  },
  {
    title: 'Virtual Leadership Pathway for School Administrators',
    description:
      'A modular development pathway combining simulation, coaching, and reflection for aspiring and current school leaders.',
    href: '/simulations',
    linkText: 'Open project →',
  },
];

export default function ProjectsPage() {
  return (
    <section className="section section-light">
      <div className="container">
        <h1>Projects</h1>
        <p className="lead">
          Selected work at the intersection of school leadership, instructional design, professional
          learning, and AI-enabled learning systems.
        </p>
        <div className="card-grid">
          {projects.map((project) => (
            <article key={project.title} className="card project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <Link
                href={project.href}
                className="text-link"
                target={project.external ? '_blank' : undefined}
                rel={project.external ? 'noreferrer' : undefined}
              >
                {project.linkText}
              </Link>
            </article>
          ))}
        </div>
        <div className="card-grid top-space two-up">
          <div className="media-card">
            <Image
              src="/images/conference.jpg"
              alt="Rob Furman presenting to educators"
              width={1200}
              height={900}
              className="section-image"
            />
          </div>
          <div className="media-card">
            <Image
              src="/images/tedx-prime.jpg"
              alt="Rob Furman speaking on TEDx stage"
              width={1600}
              height={900}
              className="section-image tedx-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
