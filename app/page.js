import Image from 'next/image';
import Link from 'next/link';
import HelpSuiteFeature from './components/HelpSuiteFeature';

const VIC_URL = '/vic';
const SCHOOL_LEADER_SIMULATION_URL = '/human-equation-suite/leadership-sim';
const URBAN_STUDENT_SIMULATION_URL = '/human-equation-suite/urban-student-sim';
const PRINCIPAL_AI_KIT_URL = 'https://drrobfurman.gumroad.com/l/principal_ai_kit?layout=profile';

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
  'TEDx Speaker & National Presenter',
  'AI + Learning Systems Builder',
];

const signatureIdeas = [
  {
    title: 'What Would You Do?',
    detail:
      'Real school dilemmas that place leaders, teachers, and families inside the decision—before revealing the leadership principle underneath it.',
  },
  {
    title: 'The Human Test',
    detail:
      'A practical standard for AI, policy, and school innovation: Does it deepen learning, strengthen educators, protect dignity, and solve a real human problem?',
  },
  {
    title: 'AI That Actually Helps Schools',
    detail:
      'A grounded approach to using AI to extend human judgment and student thinking rather than replacing either one.',
  },
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
    linkText: 'Learn About VIC →',
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
            <p className="eyebrow">NATIONAL EDUCATION SPEAKER · SCHOOL LEADER · HUMAN-CENTERED AI</p>
            <h1>Better Human Decisions for the Future of Education</h1>
            <p className="lead">
              Dr. Rob Furman helps educators lead under pressure and use AI to strengthen—not
              replace—human judgment, professional expertise, and student thinking.
            </p>
            <p>
              Drawing from decades as a principal, instructional leader, author, TEDx speaker, and
              systems builder, I turn difficult school realities into memorable stories,
              practical frameworks, and actions educators can use immediately.
            </p>
            <div className="button-row">
              <Link href="/speaking" className="button primary">
                Bring Dr. Rob to Your Event
              </Link>
              <Link href="#signature-ideas" className="button secondary">
                Explore the Big Ideas
              </Link>
              <Link href={VIC_URL} className="button secondary">
                See AI That Helps
              </Link>
              <a
                href={PRINCIPAL_AI_KIT_URL}
                className="button secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get the AI Starter Kit
              </a>
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

      <section className="section section-dark resource-cta-section" aria-labelledby="principal-ai-kit">
        <div className="container resource-cta-layout">
          <div>
            <p className="eyebrow">Practical resource for school leaders</p>
            <h2 id="principal-ai-kit">Principal AI Starter Kit</h2>
            <p>
              A practical starting point for school leaders who want to use AI with clarity,
              purpose, and sound professional judgment—not hype or generic prompts.
            </p>
          </div>
          <div className="resource-cta-actions">
            <a
              href={PRINCIPAL_AI_KIT_URL}
              className="button primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get the Starter Kit →
            </a>
            <span>Instant digital access through Gumroad</span>
          </div>
        </div>
      </section>

      <section className="section section-soft signature-ideas-section" id="signature-ideas">
        <div className="container">
          <div className="section-intro">
            <p className="eyebrow">Ideas educators remember and use</p>
            <h2>A Distinctive Voice for Leadership in the Age of AI</h2>
            <p>
              The future of education is not a technology problem alone. It is a human judgment
              problem—and school leaders need practical ways to think clearly when the pressure is
              real.
            </p>
          </div>
          <div className="card-grid three-up top-space">
            {signatureIdeas.map((idea) => (
              <article className="card signature-idea-card" key={idea.title}>
                <h3>{idea.title}</h3>
                <p>{idea.detail}</p>
              </article>
            ))}
          </div>
          <div className="button-row top-space">
            <Link href="/speaking" className="button primary">
              Explore Keynotes and Workshops
            </Link>
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
            <p className="eyebrow">Keynotes · Leadership Institutes · Professional Learning</p>
            <h2>Give Educators More Than Inspiration</h2>
            <p>
              Rob combines the energy and storytelling of a keynote with the credibility of a
              leader who has made difficult decisions in real schools. Audiences leave with
              language, frameworks, and questions they can use the next day.
            </p>
            <div className="button-row top-space-sm">
              <Link href="/speaking" className="button primary">
                Explore Speaking Programs
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
            Planning a conference for educators who need more than another generic keynote?
          </h2>
          <p>
            Bring Dr. Rob Furman to your stage for a practical, provocative, deeply human
            conversation about leadership and the future of education.
          </p>
          <div className="button-row center top-space-sm">
            <Link href="/contact" className="button primary">
              Start a Speaking Conversation
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
