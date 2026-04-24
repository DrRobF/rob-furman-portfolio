import Link from 'next/link';

const featuredProjects = [
  {
    title: 'Day in the Life of a Principal',
    description:
      'A scenario-driven leadership simulation built for decision making under pressure in school contexts.',
    href: '/simulations/principal',
  },
  {
    title: 'Day in the Life of an Urban Student',
    description:
      'An empathy-building simulation experience focused on student realities inside and outside school walls.',
    href: '/simulations/urban-student',
  },
  {
    title: 'Virtual Leadership Pathway for School Administrators',
    description:
      'A practice-based learning pathway that combines mentorship, simulation, and reflective leadership artifacts.',
    href: '/projects',
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero section">
        <div className="container hero-content">
          <p className="eyebrow">Dr. Rob Furman · AI Learning Systems · Instructional Innovation</p>
          <h1>AI + Learning Design That Drives Real Adoption</h1>
          <p className="lead">
            I build simulations, training systems, and AI-supported tools that help people understand
            complex ideas and apply them in real-world settings.
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
      </section>

      <section className="section credibility">
        <div className="container credibility-grid">
          <span>TEDx Speaker</span>
          <span>ISTE Published Author</span>
          <span>Former Principal</span>
          <span>AI Learning Systems Builder</span>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Featured Projects</h2>
          <div className="card-grid">
            {featuredProjects.map((project) => (
              <article key={project.title} className="card">
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

      <section className="section muted">
        <div className="container split-grid">
          <div>
            <h2>VIC: Virtual Co-Teacher</h2>
            <p>
              VIC supports classroom instruction with guided prompts, differentiated assistance, and
              actionable teacher-facing reports designed for real adoption in schools.
            </p>
            <Link href="/vic" className="text-link">
              Explore VIC →
            </Link>
          </div>
          <div>
            <h2>Publications</h2>
            <p>
              Includes <em>The Future Ready Challenge</em>, <em>Personalized Reading</em>,{' '}
              <em>Reading, Technology, and Digital Literacy</em>, and <em>Engaging Young Readers</em>.
            </p>
            <Link href="/publications" className="text-link">
              View Publications →
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-grid">
          <div>
            <h2>Speaking & Professional Learning</h2>
            <p>
              TEDx talks, keynotes, virtual presentations, and workshops for educators and
              organizational leaders navigating AI-enabled learning.
            </p>
            <Link href="/speaking" className="text-link">
              Speaking profile →
            </Link>
          </div>
          <div className="quote-block">
            <p>
              “Rob translates complex ideas into practical experiences that people can apply
              immediately.”
            </p>
            <span>— Professional learning partner testimonial</span>
          </div>
        </div>
      </section>

      <section className="section cta">
        <div className="container">
          <h2>Let’s Build the Next Learning Experience</h2>
          <p>
            Available for speaking, consulting, simulation design, and AI-supported instructional
            initiatives.
          </p>
          <Link href="/contact" className="button primary">
            Contact Me
          </Link>
        </div>
      </section>
    </>
  );
}
