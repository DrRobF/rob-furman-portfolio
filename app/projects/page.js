import Image from 'next/image';
import Link from 'next/link';

const projectSections = [
  {
    eyebrow: 'Featured leadership systems',
    title: 'Practical Systems for Educational Leadership',
    description:
      'These systems show how Dr. Rob Furman translates principal-level experience, instructional leadership, and responsible innovation into tools educators can use.',
    projects: [
      {
        title: 'H.E.L.P. — Human Equation Leadership Psychology',
        what:
          'A leadership development suite with diagnostics, factor-based learning, simulations, and dashboard evidence.',
        solves:
          'School leaders need safe ways to practice pressure, interpret human dynamics, and build judgment before real stakes escalate.',
        matters:
          'H.E.L.P. turns leadership growth into a structured practice environment grounded in school realities.',
        href: '/human-equation-suite',
        linkText: 'Explore H.E.L.P. →',
      },
      {
        title: 'VIC: Virtual Co-Teacher',
        what:
          'An AI-supported instructional system designed to work alongside teachers and guide student learning.',
        solves:
          'Teachers need scalable support that reinforces instruction, helps students persist, and stays aligned to learning goals.',
        matters:
          'VIC demonstrates responsible AI as an instructional support system, not a replacement for educators.',
        href: '/vic',
        linkText: 'Learn about VIC →',
      },
    ],
  },
  {
    eyebrow: 'Simulation-based learning',
    title: 'Practice Environments for Real School Decisions',
    description:
      'These simulations help educators rehearse leadership judgment, build empathy, and improve communication before the stakes are real.',
    projects: [
      {
        title: 'School Leader Simulation',
        what:
          'A principal-level simulation that places users inside realistic school decision moments involving staff, students, families, instruction, and operations.',
        solves:
          'Administrators often learn high-pressure leadership through live consequences instead of guided practice.',
        matters:
          'It gives leaders a practical way to rehearse communication, prioritization, and systems thinking.',
        href: '/human-equation-suite/leadership-sim',
        linkText: 'Open School Leader Simulation →',
      },
      {
        title: 'Urban Student Simulation',
        what:
          'A student-perspective experience that follows a learner through a school day shaped by stress, assumptions, relationships, and missed intervention points.',
        solves:
          'Educators need concrete ways to examine how adult responses and school systems affect student experience.',
        matters:
          'It turns empathy and equity reflection into an interactive professional learning experience.',
        href: '/human-equation-suite/urban-student-sim',
        linkText: 'Open Urban Student Simulation →',
      },
      {
        title: 'Parent Call Rehearsal',
        what:
          'A communication practice tool for difficult family conversations and emotionally charged school situations.',
        solves:
          'School leaders and educators need structured rehearsal for calls where tone, clarity, listening, and trust matter.',
        matters:
          'It helps educators practice human-centered communication before a real family conversation is on the line.',
        href: '/human-equation-suite/parent-call',
        linkText: 'Open Parent Call Rehearsal →',
      },
    ],
  },
  {
    eyebrow: 'Publications and professional voice',
    title: 'Writing, Speaking, and Field Contribution',
    description:
      'Rob’s books, articles, and speaking work connect literacy, educational technology, leadership, and future-ready learning to practical implementation.',
    projects: [
      {
        title: 'Books and Selected Articles',
        what:
          'A curated collection of Rob’s education books, national articles, and professional contributions.',
        solves:
          'Educators and organizations need clear, usable thinking on instructional improvement, literacy, technology, and change.',
        matters:
          'This body of work shows a sustained professional voice beyond tools and applications.',
        href: '/publications',
        linkText: 'View Publications →',
      },
      {
        title: 'Speaking and Professional Learning',
        what:
          'Keynotes, conference presentations, workshops, and consulting-style learning experiences for educators and organizations.',
        solves:
          'Teams need ideas translated into action, with practical examples that can move from inspiration to implementation.',
        matters:
          'Speaking and professional learning extend Rob’s leadership work into rooms where educators are planning real change.',
        href: '/speaking',
        linkText: 'View Speaking →',
      },
    ],
  },
];

export default function ProjectsPage() {
  return (
    <>
      <section className="section section-light projects-hero-section">
        <div className="container split-grid publication-layout">
          <div>
            <p className="eyebrow">Leadership portfolio</p>
            <h1>Systems, Simulations, Publications, and Professional Learning</h1>
            <p className="lead">
              This portfolio is organized around educational leadership work: tools that strengthen
              instructional practice, leadership judgment, communication, student understanding, and
              responsible innovation in schools.
            </p>
            <p className="top-space-sm">
              H.E.L.P., VIC, the simulations, and Rob&apos;s publications are connected by the same goal:
              helping educators and leaders make better decisions in complex, human environments.
            </p>
          </div>
          <div className="media-card">
            <Image
              src="/images/conference.jpg"
              alt="Rob Furman presenting to educators"
              width={1200}
              height={900}
              className="section-image"
              priority
            />
          </div>
        </div>
      </section>

      {projectSections.map((section, index) => (
        <section
          key={section.title}
          className={`section compact-section ${index % 2 === 0 ? 'section-soft' : 'section-light'}`}
        >
          <div className="container">
            <div className="section-intro">
              <p className="eyebrow">{section.eyebrow}</p>
              <h2>{section.title}</h2>
              <p>{section.description}</p>
            </div>
            <div className="card-grid project-portfolio-grid top-space">
              {section.projects.map((project) => (
                <article key={project.title} className="card project-card project-portfolio-card equal-card">
                  <h3>{project.title}</h3>
                  <p>
                    <strong>What it is:</strong> {project.what}
                  </p>
                  <p>
                    <strong>Problem it solves:</strong> {project.solves}
                  </p>
                  <p>
                    <strong>Why it matters:</strong> {project.matters}
                  </p>
                  <Link href={project.href} className="text-link">
                    {project.linkText}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section section-light compact-section projects-cta-section">
        <div className="container split-grid publication-layout">
          <div className="media-card">
            <Image
              src="/images/tedx-prime.jpg"
              alt="Rob Furman speaking on TEDx stage"
              width={1600}
              height={900}
              className="section-image tedx-image"
            />
          </div>
          <div>
            <p className="eyebrow">Connect the work</p>
            <h2>A Portfolio Built Around Practical Educational Improvement</h2>
            <p>
              The throughline is not technology for its own sake. It is leadership: designing systems,
              supports, and learning experiences that help educators act with clarity when the work is
              complex.
            </p>
            <div className="button-row top-space-sm">
              <Link href="/contact" className="button primary">
                Contact Rob
              </Link>
              <Link href="/about" className="button secondary">
                Read About Rob
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
