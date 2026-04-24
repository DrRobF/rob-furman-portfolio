import Link from 'next/link';
import VisualPlaceholder from './components/VisualPlaceholder';

const credibilityCards = [
  {
    title: 'Doctoral-Prepared Instructional Leader',
    detail:
      'Ed.D. in Instructional Leadership with a long-term focus on instruction, school improvement, and sustainable learning systems.',
  },
  {
    title: 'Award-Winning School Administrator',
    detail:
      'Former principal with direct experience leading school operations, instructional systems, and team development under real constraints.',
  },
  {
    title: 'ISTE Published Author + TEDx Speaker',
    detail:
      'Published educational technology author and speaker who translates future-ready ideas into practical district and school action.',
  },
  {
    title: 'AI Learning Systems Builder',
    detail:
      'Builder of VIC and interactive simulations that combine AI, instructional design, and professional learning for measurable adoption.',
  },
];

const featuredProjects = [
  {
    title: 'Day in the Life of a Principal',
    description:
      'Scenario-based leadership simulation for principals and aspiring administrators focused on instructional judgment, communication, and operations.',
    href: '/simulations/principal',
  },
  {
    title: 'Day in the Life of an Urban Student',
    description:
      'Interactive simulation that develops empathy-informed planning by surfacing student realities affecting attendance, engagement, and achievement.',
    href: '/simulations/urban-student',
  },
  {
    title: 'VIC: Virtual Co-Teacher',
    description:
      'AI-supported learning system designed to support teachers with differentiated guidance, formative insight, and instructionally aligned supports.',
    href: '/vic',
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero section">
        <div className="container hero-layout">
          <div className="hero-content">
            <p className="eyebrow">Dr. Rob Furman · Ed.D. · Leadership + AI + Learning Design</p>
            <h1>Instructional Leadership, AI, and Learning Design That Move Schools Forward</h1>
            <p className="lead">
              Dr. Rob Furman brings 20+ years of school leadership, instructional technology,
              professional learning, and AI-supported innovation to help schools and organizations
              build better learning systems.
            </p>
            <div className="button-row">
              <Link href="/projects" className="button primary">
                View Projects
              </Link>
              <Link href="/vic" className="button secondary">
                Explore VIC
              </Link>
              <Link href="/contact" className="button secondary">
                Contact Me
              </Link>
            </div>
          </div>
          <VisualPlaceholder
            title="Professional Headshot"
            subtitle="Replace with Dr. Rob Furman portrait"
            tag="Headshot"
            variant="headshot"
          />
        </div>
      </section>

      <section className="section credibility-panel">
        <div className="container">
          <h2>Leadership Credibility + Innovation Focus</h2>
          <div className="card-grid four-up">
            {credibilityCards.map((card) => (
              <article key={card.title} className="card card-featured">
                <h3>{card.title}</h3>
                <p>{card.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section muted">
        <div className="container split-grid">
          <div>
            <h2>Educational Leadership Foundation</h2>
            <p>
              As a former principal and instructional leader, Rob has led school operations,
              instructional systems, professional development, and technology adoption efforts that
              improve teacher practice and student outcomes.
            </p>
            <p>
              His Ed.D. in Instructional Leadership grounds every innovation effort in what schools
              actually need: coherent systems, practical implementation, and measurable results.
            </p>
          </div>
          <VisualPlaceholder
            title="TEDx / Keynote Stage"
            subtitle="Replace with TEDx or keynote speaking image"
            tag="Speaking"
            variant="speaking"
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Featured Projects</h2>
          <div className="card-grid">
            {featuredProjects.map((project) => (
              <article key={project.title} className="card project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <Link href={project.href} className="text-link">
                  Learn more →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section accent-panel">
        <div className="container split-grid">
          <div>
            <h2>Publications and Professional Voice</h2>
            <p>
              ISTE-published books and articles in educational technology, literacy, and future-ready
              learning highlight a track record of thought leadership tied to real school practice.
            </p>
            <Link href="/publications" className="text-link">
              View Publications →
            </Link>
          </div>
          <VisualPlaceholder
            title="Books + Publications"
            subtitle="Replace with book covers or publication collage"
            tag="Publications"
            variant="books"
          />
        </div>
      </section>

      <section className="section">
        <div className="container split-grid">
          <VisualPlaceholder
            title="Simulation Experience"
            subtitle="Replace with simulation dashboard image"
            tag="Simulations"
            variant="simulation"
          />
          <div>
            <h2>AI + Instructional Design in Practice</h2>
            <p>
              Rob builds practical AI-supported learning systems, including VIC and interactive
              simulations, to strengthen instructional decision-making, learner engagement, and
              professional growth across schools and organizations.
            </p>
            <Link href="/simulations" className="text-link">
              Explore Simulations →
            </Link>
          </div>
        </div>
      </section>

      <section className="section cta">
        <div className="container">
          <h2>Partner with Dr. Rob Furman</h2>
          <p>
            Available for school leadership consulting, AI-enabled instructional design, professional
            learning, and keynote speaking.
          </p>
          <Link href="/contact" className="button primary">
            Contact Me
          </Link>
        </div>
      </section>
    </>
  );
}
