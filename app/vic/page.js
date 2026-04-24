export default function VicPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>VIC: Virtual Co-Teacher</h1>
        <p className="lead">
          VIC is designed as a Virtual Co-Teacher that supports learning experiences in partnership
          with educators—not as a standalone chatbot.
        </p>
        <div className="card-grid">
          <article className="card"><h2>Guided instruction</h2><p>Step-by-step guidance that reinforces lesson goals and sequencing.</p></article>
          <article className="card"><h2>Student support</h2><p>On-demand explanations, prompts, and scaffolds for learner persistence.</p></article>
          <article className="card"><h2>Teacher reports</h2><p>Actionable snapshots of student progress, misconceptions, and response patterns.</p></article>
          <article className="card"><h2>Differentiated help</h2><p>Adaptive support pathways to meet varied readiness levels and learning preferences.</p></article>
          <article className="card"><h2>AI-supported learning</h2><p>Responsible AI integration focused on clarity, confidence, and transfer to real tasks.</p></article>
        </div>
        <button className="button primary" type="button">View VIC Demo (Placeholder)</button>
      </div>
    </section>
  );
}
