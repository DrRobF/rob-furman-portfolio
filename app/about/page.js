export default function AboutPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>About</h1>
        <p className="lead">
          Dr. Rob Furman is an educational leader, instructional innovation specialist, author,
          speaker, and AI learning systems builder. His work focuses on helping educators and
          organizations turn complex ideas into practical learning experiences through technology,
          simulation, and real-world application.
        </p>
        <div className="card-grid">
          <article className="card"><h2>Educational leadership</h2><p>Former principal and systems-level leader with a focus on implementation and outcomes.</p></article>
          <article className="card"><h2>Instructional design</h2><p>Designs scenario-based learning that moves from concept understanding to practical transfer.</p></article>
          <article className="card"><h2>AI and learning systems</h2><p>Builds AI-supported learning structures that prioritize usability, clarity, and adoption.</p></article>
          <article className="card"><h2>Publications and speaking</h2><p>Combines thought leadership with actionable practices through writing and presentations.</p></article>
        </div>
      </div>
    </section>
  );
}
