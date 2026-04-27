import Image from 'next/image';
import Link from 'next/link';

const VIC_URL = 'https://vic-final.vercel.app/askvic';

const credibilityCards = [
  {
    title: 'Doctoral-Prepared Instructional Leader',
    detail:
      'Ed.D. in Instructional Leadership with a sustained focus on instruction, school improvement, and durable learning systems that scale across real schools.',
  },
  {
    title: 'Award-Winning School Administrator',
    detail:
      'Former principal and school administrator with 16+ years leading real school operations, instructional systems, and teams.',
  },
  {
    title: 'ISTE Author and TEDx Speaker',
    detail:
      'Published author and presenter known for translating future-ready ideas into real-world district and school implementation.',
  },
  {
    title: 'AI Learning Systems Builder',
    detail:
      'Builder of AI-powered instructional systems, including VIC, and leadership simulations designed for real-world classroom and administrative use.',
  },
];

const careerHighlights = [
  'Ed.D. in Instructional Leadership',
  'Former elementary principal and school administrator',
  'ISTE published author',
  'TEDx speaker and keynote presenter',
  'Builder of VIC, an AI-supported virtual co-teacher',
  'Creator of interactive leadership simulations',
];

const recognitionHighlights = [
  '2021 Albert Nelson Marquis Lifetime Achievement Award',
  '2020 Advocate for Public Education, Pennsylvania Association of Middle Level Education',
  '2020 Transformational Leader, PowerSchool Honor Roll',
  '2017 Best-Selling ISTE Author',
  '2015 Top 100 Educational Blogs recognition',
  '2015 Bammy Award Finalist',
  '2015 CREATE PGH Award Finalist for Art & Technology',
  '2014 Pittsburgh Tribune Review Total Media Newsmaker',
  '2013 NSBA “20 to Watch” in Instructional Technology',
];

const featuredProjects = [
  {
    title: 'A Day in the Life of a School Leader',
    description:
      'A real-time leadership simulation that places aspiring administrators inside a full school day — focused on decision-making, communication, and operational judgment under pressure.',
    href: '/simulation',
  },
  {
    title: 'Day in the Life of an Urban Student',
    description:
      'A perspective-driven simulation that helps educators understand the real conditions shaping student engagement, attendance, and performance.',
    href: '/simulations/urban-student',
  },
  {
    title: 'VIC: Virtual Co-Teacher',
    description:
      'An AI-powered instructional system designed to function as an additional teacher — guiding learning, adapting to students, and extending instruction beyond the classroom.',
    href: VIC_URL,
    linkText: 'Try VIC →',
    external: true,
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero section section-light">
        <div className="container hero-layout">
          <div className="hero-content">
            <p className="eyebrow">Dr. Rob Furman · Ed.D. · Leadership + AI + Learning Design</p>
            <h1>Building the Next Layer of School Leadership and AI-Powered Learning</h1>
            <p className="lead">
              Former principal, COO, and national education leader building real-world systems for
              schools. From AI-powered instruction to leadership simulations, my work focuses on
              how schools actually operate — not just how they&apos;re supposed to.
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
          <h2>Built from Leadership. Driven by Innovation.</h2>
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
            <p>TEDx Speaker | AI + Education Systems Builder | Former Principal</p>
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
              As a former principal and system-level leader, Rob has led the full reality of school
              operations — instruction, staff development, and performance under pressure.
            </p>
            <p className="top-space-sm">
              His work focuses on bridging the gap between vision and execution, building systems
              that actually function inside schools — not just on paper.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-soft compact-section">
        <div className="container">
          <h2>Recognition and Impact</h2>
          <div className="card award-card top-space-sm">
            <p>
              Recognized nationally for leadership, innovation, and contributions to educational
              technology.
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
          <h2>Featured Projects</h2>
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
              ISTE-published books and articles in educational technology, literacy, and
              future-ready learning highlight a track record of applied thought leadership connected
              to real school systems.
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
          <h2>Let&apos;s Build Something That Actually Works in Schools</h2>
          <p>
            Available for leadership consulting, AI system design, professional learning, and
            keynote speaking focused on real-world implementation.
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
