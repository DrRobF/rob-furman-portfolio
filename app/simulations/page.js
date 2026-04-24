import Image from 'next/image';
import Link from 'next/link';

const simCards = [
  {
    title: 'A Day in the Life of a School Leader',
    description:
      "Simulation shell inspired by Dr. Furman's original principal training experience with decision pressure and leadership prioritization.",
    href: '/simulation',
  },
  {
    title: 'Day in the Life of a Principal',
    description:
      'Practice leadership decisions under realistic constraints with immediate feedback across instruction, operations, and school culture.',
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
    <section className="section section-light">
      <div className="container">
        <h1>Simulations</h1>
        <p className="lead">
          These interactive learning simulations are built from an instructional design approach that
          blends authentic school leadership challenges, reflection, and AI-supported feedback.
        </p>
        <div className="card-grid">
          {simCards.map((sim) => (
            <article className="card project-card" key={sim.title}>
              <h3>{sim.title}</h3>
              <p>{sim.description}</p>
              <Link href={sim.href} className="text-link">
                Launch page →
              </Link>
            </article>
          ))}
        </div>
        <div className="card-grid two-up top-space">
          <div className="media-card">
            <Image
              src="/images/conference.jpg"
              alt="Facilitated professional learning session"
              width={1200}
              height={900}
              className="section-image"
            />
          </div>
          <div className="media-card">
            <Image
              src="/images/headshot-gray.jpg"
              alt="Instructional leadership simulation development"
              width={900}
              height={1100}
              className="section-image about-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
