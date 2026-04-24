import Image from 'next/image';
import Link from 'next/link';

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
      <section className="hero section section-light">
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

          <div className="media-card hero-image-wrap">
            <Image
              src="/images/headshot-gray.jpg"
              alt="Dr. Rob Furman professional headshot"
              width={760}
              height={900}
              className="section-image hero-image"
              priority
            />
          </div>
        </div>
      </section>

      <section className="section section-soft credibility-panel">
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

      <section className="section section-dark keynote-section">
        <div className="container keynote-grid">
          <Image
            src="/images/tedx-umd.jpg"
            alt="Dr. Rob Furman speaking on a TEDx stage"
            width={1600}
            height={900}
            className="section-image keynote-image"
          />
          <div className="keynote-overlay">
            <p>TEDx Speaker | Keynote Presenter | Instructional Leader</p>
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container split-grid about-layout">
          <div className="media-card">
            <Image
              src="/images/headshot-blue.jpg"
              alt="Dr. Rob Furman leadership portrait"
              width={900}
              height={1100}
              className="section-image about-image"
            />
          </div>
          <div>
            <h2>Leadership That Balances Vision and Implementation</h2>
            <p>
              As a former principal and instructional leader, Rob has led school operations,
              instructional systems, professional development, and technology adoption efforts that
              improve teacher practice and student outcomes.
            </p>
            <p>
              His leadership approach is personal, practical, and people-centered: aligning bold
              instructional vision with coaching, systems thinking, and consistent execution.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container split-grid professional-layout">
          <div>
            <h2>Professional Presence in Real-World Contexts</h2>
            <p>
              From district sessions to conference collaborations, Rob translates research and
              innovation into concrete next steps teams can use immediately. His work is grounded in
              authentic leadership and trusted professional partnerships.
            </p>
          </div>
          <div className="media-card">
            <Image
              src="/images/conference.jpg"
              alt="Dr. Rob Furman collaborating with peers at a professional conference"
              width={1200}
              height={900}
              className="section-image"
            />
          </div>
        </div>
      </section>

      <section className="section section-light">
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

      <section className="section section-soft accent-panel">
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
          <div className="media-card publication-preview">
            <Image
              src="/images/book-future-ready.jpg"
              alt="The Future Ready Challenge book cover"
              width={600}
              height={800}
              className="section-image"
            />
          </div>
        </div>
      </section>

      <section className="section cta section-light">
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
