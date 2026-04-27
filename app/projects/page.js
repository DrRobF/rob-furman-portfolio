import Image from 'next/image';
import Link from 'next/link';

const VIC_URL = 'https://askvic.ai';

const projects = [
  {
    title: 'School Leader Simulation',
    description:
      'A leadership training system that places administrators inside a full school day, requiring real decisions across instruction, behavior, and communication. Developed from real school leadership experience, this simulation focuses on judgment, writing, and decision-making under pressure.',
    href: '/simulation-overview',
    linkText: 'Learn About Simulation →',
  },
  {
    title: 'VIC: Virtual Co-Teacher',
    description:
      'An AI-supported instructional system that functions as an additional teacher — guiding learning, adapting to students, and extending support beyond the classroom. Built to operate inside real instructional environments, VIC focuses on improving student understanding and teacher capacity.',
    href: VIC_URL,
    linkText: 'Explore VIC →',
    external: true,
  },
  {
    title: 'Day in the Life of an Urban Student (In Development)',
    description:
      'A simulation in development focused on helping educators understand the real conditions shaping student engagement, attendance, and performance. Part of a broader system of perspective-driven training environments.',
    linkText: 'Coming Soon',
  },
];

export default function ProjectsPage() {
  return (
    <section className="section section-light">
      <div className="container">
        <h1>Systems I&apos;ve Built</h1>
        <p className="lead">
          These are applied systems designed to improve decision-making, learning, and performance
          in real-world environments.
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
