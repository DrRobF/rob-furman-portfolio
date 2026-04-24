import VisualPlaceholder from '../components/VisualPlaceholder';

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>About Dr. Rob Furman</h1>
        <p className="lead">
          Dr. Rob Furman is a doctoral-prepared instructional leader (Ed.D. in Instructional
          Leadership), former principal, ISTE published author, TEDx speaker, instructional designer,
          and AI learning systems builder.
        </p>
        <div className="split-grid">
          <div>
            <p>
              Across 20+ years in education, he has led school operations and instructional systems,
              guided professional development, and supported meaningful technology adoption across
              teaching teams.
            </p>
            <p>
              Today, his work blends educational leadership credibility with future-facing innovation,
              including VIC and interactive simulations that help leaders and educators apply learning
              in complex real-world situations.
            </p>
          </div>
          <VisualPlaceholder
            title="Professional Biography Image"
            subtitle="Replace with portrait, school leadership, or consulting image"
            tag="About"
            variant="headshot"
          />
        </div>
        <div className="card-grid top-space">
          <article className="card"><h2>Instructional leadership</h2><p>Leads systems-level instructional improvement anchored in coherence, equity, and measurable student impact.</p></article>
          <article className="card"><h2>School administration</h2><p>Former principal with experience in operations, culture, staffing, and data-informed decision structures.</p></article>
          <article className="card"><h2>Professional learning</h2><p>Designs and delivers professional development that supports implementation, not just inspiration.</p></article>
          <article className="card"><h2>AI + learning systems</h2><p>Builds practical AI tools, simulations, and instructional supports that fit real school workflows.</p></article>
        </div>
      </div>
    </section>
  );
}
