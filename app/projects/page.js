import Image from 'next/image';
import Link from 'next/link';

const SCHOOL_LEADER_SIMULATION_URL = 'https://drrobfurman.com/simulation';
const VIC_URL = 'https://askvic.ai';

const projects = [
  {
    title: 'School Leader Simulation',
    description:
      'A real-time leadership simulation that places aspiring administrators inside a full school day — focused on decision-making, communication, and operational judgment under pressure.',
    href: SCHOOL_LEADER_SIMULATION_URL,
    linkText: 'Open Simulation →',
    external: true,
  },
  {
    title: 'VIC: Virtual Co-Teacher',
    description:
      'An AI-powered instructional system designed to function as an additional teacher — guiding learning, adapting to students, and extending instruction beyond the classroom.',
    href: VIC_URL,
    linkText: 'Explore VIC →',
    external: true,
  },
  {
    title: 'Day in the Life of an Urban Student (In Development)',
    description:
      'A future simulation designed to deepen perspective-taking and help educators better understand the conditions shaping student engagement and achievement.',
    linkText: 'Coming Soon',
  },
];

export default function ProjectsPage() {
  return (
    <section className="section section-light">
      <div className="container">
        <h1>Projects</h1>
        <p className="lead">
          Core systems and simulations focused on real-world school leadership, instructional
          decision-making, and AI-supported learning.
        </p>
        <div className="card-grid">
          {projects.map((project) => (
            <article key={project.title} className="card project-card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {project.href ? (
                <Link
                  href={project.href}
                  className="text-link"
                  target={project.external ? '_blank' : undefined}
                  rel={project.external ? 'noreferrer' : undefined}
                >
                  {project.linkText}
                </Link>
              ) : (
                <span className="text-link" aria-disabled="true">
                  {project.linkText}
                </span>
              )}
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
