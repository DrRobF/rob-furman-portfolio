import Image from 'next/image';
import Link from 'next/link';

const VIC_URL = 'https://askvic.ai';
const SCHOOL_LEADER_SIMULATION_OVERVIEW_URL = '/simulation-overview';

const credibilityCards = [
  {
    title: 'Leadership and Operations',
    detail:
      'Led full organizational systems including instruction, staffing, culture, and performance in high-pressure, real-world environments.',
  },
  {
    title: 'Instructional Design and Learning Systems',
    detail:
      'Designs scalable learning systems that improve decision-making, communication, and performance across teams and organizations.',
  },
  {
    title: 'Publishing and Thought Leadership',
    detail:
      'Author of multiple books and national publications focused on literacy, technology integration, and applied innovation.',
  },
  {
    title: 'AI and Simulation Systems',
    detail:
      'Builder of AI-supported learning tools and interactive simulations designed for real-world use in classrooms and leadership environments.',
  },
];

const careerHighlights = [
  'Ed.D. in Instructional Leadership',
  '16+ years as a principal and school administrator',
  'Organizational leadership experience including COO-level work',
  'ISTE-published author and national presenter',
  'Builder of AI-supported learning systems (VIC)',
  'Creator of real-time leadership simulations',
];

const recognitionHighlights = [
  'Many organizations struggle not with ideas, but with execution. My work focuses on closing that gap — designing systems that help people make better decisions, communicate more effectively, and perform under real-world conditions.',
  'Rather than relying on theory alone, I build tools, simulations, and learning environments that reflect how systems actually operate.',
];

const featuredProjects = [
  {
    title: 'School Leader Simulation',
    description:
      'A leadership training system that places administrators inside a full school day, requiring real decisions across instruction, behavior, and communication.',
    href: SCHOOL_LEADER_SIMULATION_OVERVIEW_URL,
    linkText: 'Learn About Simulation →',
  },
  {
    title: 'VIC: Virtual Co-Teacher',
    description:
      'An AI-supported co-teacher that guides instruction, adapts to students, and extends learning beyond the classroom.',
    href: VIC_URL,
    linkText: 'Try VIC →',
    external: true,
  },
  {
    title: 'Day in the Life of an Urban Student (In Development)',
    description:
      'A future simulation designed to help educators better understand the real conditions shaping student engagement and performance.',
    href: '/simulations/urban-student',
    linkText: 'Coming Soon',
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero section section-light">
        <div className="container hero-layout">
          <div className="hero-content">
            <p className="eyebrow">Dr. Rob Furman · Ed.D.</p>
            <h1>Learning Systems That Improve Performance in Real-World Environments</h1>
            <p className="lead">
              I design and build systems that help people perform better in complex settings —
              from school leadership and instructional design to AI-powered learning and
              decision-making.
            </p>
            <p>
              With over 20 years of experience as a principal, school administrator, and
              organizational leader, my work focuses on improving how systems actually function —
              not just how they&apos;re designed to work. From leadership simulations to AI-supported
              learning tools, everything I build is grounded in real-world conditions, pressure,
              and performance.
            </p>
            <div className="button-row">
              <Link href="/projects" className="button primary">
                Explore My Work
              </Link>
              <Link href={VIC_URL} className="button secondary" target="_blank" rel="noreferrer">
                See VIC in Action
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
          <h2>Built from Leadership. Focused on Performance.</h2>
          <div className="card-grid four-up">
            {credibilityCards.map((card) => (
              <article key={card.title} className="card card-featured equal-card">
                <h3>{card.title}</h3>
                <p>{card.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-light compact-section">
        <div className="container">
          <h2>Where Experience Meets Application</h2>
          <ul className="clean-list top-space-sm">
            {careerHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-dark keynote-section compact-section">
        <div className="container keynote-grid">
          <Image
            src="/images/tedx-umd.jpg"
            alt="Dr. Rob Furman speaking on a TEDx stage"
            width={1600}
            height={900}
            className="section-image keynote-image"
          />
          <div className="keynote-overlay">
            <p>From Strategy to Execution</p>
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
            <h2>From Strategy to Execution</h2>
            <p>
              Many organizations struggle not with ideas, but with execution. My work focuses on
              closing that gap — designing systems that help people make better decisions,
              communicate more effectively, and perform under real-world conditions.
            </p>
            <p className="top-space-sm">
              Rather than relying on theory alone, I build tools, simulations, and learning
              environments that reflect how systems actually operate.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-soft compact-section">
        <div className="container">
          <h2>From Strategy to Execution</h2>
          <div className="card award-card top-space-sm">
            <p>
              Many organizations struggle not with ideas, but with execution. My work focuses on
              closing that gap — designing systems that help people make better decisions,
              communicate more effectively, and perform under real-world conditions.
            </p>
            <ul className="clean-list two-column-list">
              {recognitionHighlights.map((award) => (
                <li key={award}>{award}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <h2>Featured Work</h2>
          <div className="card-grid">
            {featuredProjects.map((project) => (
              <article key={project.title} className="card project-card equal-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <Link
                  href={project.href}
                  className="text-link"
                  target={project.external ? '_blank' : undefined}
                  rel={project.external ? 'noreferrer' : undefined}
                >
                  {project.linkText || 'Learn more →'}
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
              My work includes books, articles, and national publications focused on instructional
              design, literacy, technology integration, and real-world application in schools and
              organizations.
            </p>
            <Link href="/publications" className="text-link top-space-sm inline-link">
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

      <section className="section cta section-light compact-section">
        <div className="container">
          <h2>Let&apos;s Build Systems That Actually Work</h2>
          <p>
            Available for leadership consulting, instructional design, AI learning systems, and
            professional development focused on real-world performance and implementation.
          </p>
          <div className="button-row center top-space-sm">
            <Link href="/contact" className="button primary">
              Contact Me
            </Link>
            <Link href={VIC_URL} className="button secondary" target="_blank" rel="noreferrer">
              Try VIC
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
