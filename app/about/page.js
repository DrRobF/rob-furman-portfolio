import Image from 'next/image';
import Link from 'next/link';

const leadershipPillars = [
  {
    title: 'Leadership Philosophy',
    detail:
      'Effective schools are built through trust, clarity, disciplined systems, and human-centered decision-making. Rob focuses on helping leaders create conditions where educators can do strong work and students can thrive.',
  },
  {
    title: 'Principal-Level Practice',
    detail:
      'His perspective is grounded in the reality of school leadership — instruction, culture, staffing, family communication, operations, conflict, accountability, and the daily decisions that shape a school community.',
  },
  {
    title: 'Instructional Leadership',
    detail:
      'Rob connects curriculum, pedagogy, literacy, assessment, professional learning, and technology implementation so improvement work becomes usable in classrooms rather than remaining a plan on paper.',
  },
  {
    title: 'Professional Voice',
    detail:
      'As an ISTE-published author, national presenter, TEDx speaker, and education contributor, he translates complex ideas into practical guidance for educators, leaders, and organizations.',
  },
];

const leadershipCredentials = [
  'Ed.D. in Instructional Leadership',
  'Experienced principal and school administrator',
  'Author of education books on literacy, technology, and future-ready learning',
  'National speaker and professional learning facilitator',
  'Builder of practical simulations and AI-supported learning systems',
  'COO-level organizational leadership experience',
];

const systemsWork = [
  {
    title: 'H.E.L.P. — Human Equation Leadership Psychology',
    detail:
      'A leadership development suite that helps educators rehearse pressure, read human dynamics, and strengthen decision-making through diagnostics, courses, simulations, and dashboard evidence.',
    href: '/human-equation-suite',
    linkText: 'Explore H.E.L.P. →',
  },
  {
    title: 'VIC: Virtual Co-Teacher',
    detail:
      'An AI-supported instructional system designed to extend teacher capacity, guide student learning, and keep technology anchored to sound instructional practice.',
    href: '/vic',
    linkText: 'Learn about VIC →',
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="section section-light about-hero-section">
        <div className="container split-grid about-layout">
          <div>
            <p className="eyebrow">About Dr. Rob Furman</p>
            <h1>Educational Leader, Principal-Level Operator, Author, Speaker, and Systems Builder</h1>
            <p className="lead">
              Dr. Rob Furman brings together school leadership experience, instructional expertise,
              professional writing and speaking, and practical tool-building for educators.
            </p>
            <p className="top-space-sm">
              His work is rooted in the reality of schools: the pressure of leadership, the complexity
              of instruction, the importance of trust, and the need for systems that help people make
              better decisions when the work is human and high-stakes.
            </p>
            <p className="top-space-sm">
              Rather than presenting technology as the story, Rob treats responsible AI, simulations,
              and learning systems as extensions of educational leadership — tools that should support
              teachers, strengthen practice, and improve outcomes without replacing the human judgment
              at the center of schools.
            </p>
            <div className="button-row">
              <Link href="/projects" className="button primary">
                View Leadership Portfolio
              </Link>
              <Link href="/publications" className="button secondary">
                View Publications
              </Link>
            </div>
          </div>
          <div className="media-card">
            <Image
              src="/images/headshot-gray.jpg"
              alt="Dr. Rob Furman professional biography portrait"
              width={900}
              height={1100}
              className="section-image about-image"
              priority
            />
          </div>
        </div>
      </section>

      <section className="section section-soft compact-section">
        <div className="container">
          <div className="section-intro">
            <p className="eyebrow">Leadership stance</p>
            <h2>Built From Real School Leadership</h2>
            <p>
              Rob&apos;s approach combines the practical judgment of a principal, the instructional lens of
              an educational leader, and the communication discipline of an author and speaker.
            </p>
          </div>
          <div className="card-grid four-up top-space">
            {leadershipPillars.map((pillar) => (
              <article className="card equal-card" key={pillar.title}>
                <h3>{pillar.title}</h3>
                <p>{pillar.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-light compact-section">
        <div className="container split-grid publication-layout">
          <div>
            <p className="eyebrow">Experience and credibility</p>
            <h2>Principal Background, Instructional Expertise, and Professional Voice</h2>
            <p>
              Across his career, Rob has led schools and organizations, developed educators, written
              for national audiences, presented professionally, and designed practical systems for
              teaching, leadership, and learning.
            </p>
            <ul className="clean-list credential-list top-space-sm">
              {leadershipCredentials.map((credential) => (
                <li key={credential}>{credential}</li>
              ))}
            </ul>
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

      <section className="section section-dark what-i-bring compact-section">
        <div className="container">
          <div className="section-intro inverted">
            <p className="eyebrow">Responsible innovation</p>
            <h2>H.E.L.P. and VIC Extend the Leadership Work</h2>
            <p>
              The tools Rob builds are not random apps. They are applied leadership systems designed
              around school realities: decision-making, adult learning, student support, instructional
              clarity, and responsible use of AI.
            </p>
          </div>
          <div className="card-grid two-up top-space">
            {systemsWork.map((system) => (
              <article className="leadership-domain-card equal-card" key={system.title}>
                <h3>{system.title}</h3>
                <p>{system.detail}</p>
                <Link href={system.href} className="text-link top-space-sm inline-link">
                  {system.linkText}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
