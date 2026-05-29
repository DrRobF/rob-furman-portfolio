import Image from 'next/image';
import Link from 'next/link';
import HelpSuiteFeature from './components/HelpSuiteFeature';

const VIC_URL = 'https://askvic.ai';
const SCHOOL_LEADER_SIMULATION_URL = '/human-equation-suite/leadership-sim';
const URBAN_STUDENT_SIMULATION_URL = '/human-equation-suite/urban-student-sim';

const proofCards = [
  {
    icon: '01',
    title: 'School Leadership',
    detail:
      'Former principal and school administrator with deep experience leading instruction, culture, staffing, operations, and improvement work.',
  },
  {
    icon: '02',
    title: 'Instructional Leadership',
    detail:
      'Focused on improving teaching, learning conditions, literacy, digital learning, and real-world implementation.',
  },
  {
    icon: '03',
    title: 'Author & Speaker',
    detail:
      'Published author and national presenter on education, technology integration, literacy, and future-ready learning.',
  },
  {
    icon: '04',
    title: 'Systems Builder',
    detail:
      'Creator of practical simulations, AI-supported learning tools, and leadership practice environments for educators.',
  },
  {
    icon: '05',
    title: 'Organizational Performance',
    detail:
      'Experience connecting strategy, people, operations, communication, and execution in complex environments.',
  },
];

const credentialStack = [
  'Ed.D. Instructional Leadership',
  '16+ Years School Leadership',
  'Author & National Presenter',
  'AI + Learning Systems Builder',
];

const leadershipDomains = [
  {
    title: 'Principal-Level Leadership',
    detail:
      'I understand schools from the inside — the pressure, people, politics, pace, and responsibility of leading real educators, students, and families.',
  },
  {
    title: 'Instructional Systems Thinking',
    detail:
      'I design learning systems that connect curriculum, teaching practice, assessment, technology, and implementation rather than treating them as separate initiatives.',
  },
  {
    title: 'Human-Centered Change',
    detail:
      'I help leaders move people through complexity with clarity, trust, communication, and emotional intelligence — not just plans on paper.',
  },
  {
    title: 'Practical AI and Simulation Design',
    detail:
      'I build tools that help educators practice, reflect, and improve in realistic conditions, including leadership simulations, student-support tools, and AI-assisted learning environments.',
  },
];

const professionalCredibility = [
  'Ed.D. in Instructional Leadership',
  '16+ years as principal and school administrator',
  'Experience leading instruction, culture, staffing, family communication, and school operations',
  'COO-level organizational leadership experience',
  'University teaching experience in educational leadership',
  'Florida-certified educator and school leader',
];

const innovationCredibility = [
  'Published author and national presenter',
  'ISTE-published education voice',
  'Builder of VIC: Virtual Co-Teacher',
  'Creator of H.E.L.P. leadership psychology suite',
  'Developer of school leadership and student-perspective simulations',
  'Google AI Professional Certificate',
];

const featuredProjects = [
  {
    title: 'H.E.L.P. — Human Equation Leadership Psychology',
    description:
      'A leadership practice suite for educators that combines diagnostic insight, factor-based learning, simulations, and dashboard evidence.',
    why: 'It gives leaders a structured way to rehearse pressure, interpret human dynamics, and grow from evidence instead of guesswork.',
    href: '/human-equation-suite',
    linkText: 'Explore H.E.L.P. →',
  },
  {
    title: 'VIC: Virtual Co-Teacher',
    description:
      'An AI-supported instructional tool designed to guide students through learning, provide adaptive support, and extend teacher capacity.',
    why: 'It demonstrates how responsible AI can support teachers and students without replacing the human work of instruction.',
    href: VIC_URL,
    linkText: 'See VIC in Action →',
    external: true,
  },
  {
    title: 'School Leader Simulation',
    description:
      'A pressure-based leadership simulation that places users inside realistic school decision moments involving staff, students, families, and operations.',
    why: 'It helps educators practice judgment, communication, and systems thinking before the stakes are real.',
    href: SCHOOL_LEADER_SIMULATION_URL,
    linkText: 'Open the Simulation →',
  },
  {
    title: 'A Day in the Life of an Urban Student',
    description:
      'A student-perspective simulation designed to build empathy, sharpen systems awareness, and help educators examine the conditions students carry into school.',
    why: 'It turns equity-centered reflection into an interactive experience grounded in student context and school realities.',
    href: URBAN_STUDENT_SIMULATION_URL,
    linkText: 'Experience the Student Perspective →',
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero section section-light leadership-hero">
        <div className="container hero-layout">
          <div className="hero-content">
            <p className="eyebrow">DR. ROB FURMAN · ED.D. · EDUCATIONAL LEADER</p>
            <h1>Educational Leadership for Schools, Systems, and the Human Moments That Shape Both</h1>
            <p className="lead">
              I help schools and organizations improve how people lead, learn, communicate, and
              perform under real-world pressure — drawing from decades of experience as a
              principal, instructional leader, author, speaker, and builder of practical learning
              systems.
            </p>
            <p>
              My work sits at the intersection of school leadership, instructional design,
              organizational performance, and responsible AI. Whether leading schools, developing
              educators, writing and speaking nationally, or building tools like H.E.L.P. and VIC,
              my focus is the same: helping people make better decisions when the work is complex,
              human, and high-stakes.
            </p>
            <div className="button-row">
              <Link href="#leadership-work" className="button primary">
                Explore My Leadership Work
              </Link>
              <Link href="/human-equation-suite" className="button secondary">
                View H.E.L.P. Suite
              </Link>
              <Link href={VIC_URL} className="button secondary" target="_blank" rel="noreferrer">
                See VIC in Action
              </Link>
              <Link href="/contact" className="button secondary">
                Contact Me
              </Link>
            </div>
          </div>

          <div className="hero-portrait-card">
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
            <div className="credential-stack" aria-label="Dr. Rob Furman credentials">
              {credentialStack.map((credential) => (
                <span key={credential}>{credential}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section proof-strip-section compact-section" aria-labelledby="leadership-proof">
        <div className="container">
          <div className="proof-strip-heading">
            <p className="eyebrow">Leadership proof</p>
            <h2 id="leadership-proof">Credibility Built in Real Schools and Real Systems</h2>
          </div>
          <div className="proof-strip-grid">
            {proofCards.map((card) => (
              <article key={card.title} className="proof-card">
                <span className="proof-icon">{card.icon}</span>
                <h3>{card.title}</h3>
                <p>{card.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <HelpSuiteFeature />

      <section className="section section-dark what-i-bring" id="leadership-work">
        <div className="container">
          <div className="section-intro inverted">
            <p className="eyebrow">Leadership domains</p>
            <h2>What I Bring to Schools and Organizations</h2>
            <p>
              A rare combination of leadership experience, instructional expertise, communication
              skill, and practical innovation.
            </p>
          </div>
          <div className="card-grid four-up leadership-domain-grid">
            {leadershipDomains.map((domain) => (
              <article key={domain.title} className="leadership-domain-card equal-card">
                <h3>{domain.title}</h3>
                <p>{domain.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-light experience-transfer compact-section">
        <div className="container">
          <div className="section-intro">
            <p className="eyebrow">Experience → Application</p>
            <h2>Experience That Transfers Into Real School Leadership</h2>
            <p>
              My background is not theoretical. I have led schools, supported educators, developed
              instructional systems, written nationally published education books, presented to
              professional audiences, and built tools designed around the real decisions educators
              face every day.
            </p>
          </div>
          <div className="vita-grid top-space">
            <article className="vita-card">
              <h3>Professional Credibility</h3>
              <ul className="clean-list">
                {professionalCredibility.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="vita-card accent-vita-card">
              <h3>Innovation Credibility</h3>
              <ul className="clean-list">
                {innovationCredibility.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-light featured-work-section">
        <div className="container">
          <div className="section-intro">
            <p className="eyebrow">Portfolio evidence</p>
            <h2>Featured Work and Leadership Systems</h2>
            <p>
              H.E.L.P., VIC, and the simulation work are not separate from my leadership identity —
              they are practical evidence of how I translate school experience into tools educators
              can use.
            </p>
          </div>
          <div className="card-grid featured-work-grid">
            {featuredProjects.map((project) => (
              <article key={project.title} className="featured-work-card equal-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <p className="why-it-matters">
                  <strong>Why it matters:</strong> {project.why}
                </p>
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
        </div>
      </section>

      <section className="section section-soft accent-panel publications-section">
        <div className="container split-grid publication-layout">
          <div>
            <p className="eyebrow">Writing and professional learning</p>
            <h2>Publications and Professional Voice</h2>
            <p>
              My writing and speaking focus on practical educational improvement: literacy,
              instructional leadership, technology integration, digital learning, and the future of
              schools. Across books, articles, conference presentations, and professional learning,
              my goal has always been to make complex ideas usable for educators.
            </p>
            <Link href="/publications" className="text-link top-space-sm inline-link">
              View Publications →
            </Link>
          </div>
          <div className="media-card publication-preview book-card">
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

      <section className="section section-light speaking-application compact-section">
        <div className="container split-grid">
          <div className="media-card keynote-card">
            <Image
              src="/images/tedx-umd.jpg"
              alt="Dr. Rob Furman speaking on a TEDx stage"
              width={1600}
              height={900}
              className="section-image keynote-image"
            />
          </div>
          <div>
            <p className="eyebrow">Speaking · Consulting · Application</p>
            <h2>Leadership Ideas Designed for Real Implementation</h2>
            <p>
              I work with schools and organizations on the practical side of improvement: helping
              leaders communicate vision, support educators, use technology responsibly, and build
              systems that move from strategy to execution.
            </p>
            <div className="button-row top-space-sm">
              <Link href="/speaking" className="button primary">
                View Speaking
              </Link>
              <Link href="/projects" className="button secondary">
                View Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta executive-cta compact-section">
        <div className="container">
          <p className="eyebrow">Connect</p>
          <h2>
            Looking for an educational leader who can connect vision, people, systems, and
            execution?
          </h2>
          <p>
            I bring school leadership experience, instructional expertise, communication skill, and
            practical innovation to organizations working to improve learning, leadership, and
            performance.
          </p>
          <div className="button-row center top-space-sm">
            <Link href="/contact" className="button primary">
              Contact Me
            </Link>
            <Link href="/speaking" className="button secondary">
              View Speaking
            </Link>
            <Link href="/human-equation-suite" className="button secondary">
              Explore H.E.L.P.
            </Link>
            <Link href="/projects" className="button secondary">
              View Projects
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
