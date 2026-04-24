import VisualPlaceholder from '../components/VisualPlaceholder';

export default function VicPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>VIC: Virtual Co-Teacher</h1>
        <p className="lead">
          VIC is an AI-supported instructional system designed to work alongside educators and school
          leaders, extending instructional capacity while staying aligned to learning goals.
        </p>
        <div className="split-grid">
          <div>
            <p>
              Built by a former principal with deep instructional leadership experience, VIC reflects
              real school priorities: quality instruction, clear supports, useful data, and practical
              adoption by teachers.
            </p>
            <p>
              It is intentionally designed as a co-teacher framework rather than a standalone chatbot,
              so it can support classroom practice, intervention planning, and professional learning.
            </p>
          </div>
          <VisualPlaceholder
            title="VIC Interface Mockup"
            subtitle="Replace with VIC product screenshot"
            tag="VIC"
            variant="vic"
          />
        </div>
        <div className="card-grid top-space">
          <article className="card"><h2>Guided instruction</h2><p>Step-by-step support that reinforces lesson goals, pacing, and instructional sequencing.</p></article>
          <article className="card"><h2>Student support</h2><p>On-demand explanations, prompts, and scaffolds that strengthen persistence and confidence.</p></article>
          <article className="card"><h2>Teacher reports</h2><p>Actionable snapshots of student progress, misconceptions, and response patterns.</p></article>
          <article className="card"><h2>Differentiated help</h2><p>Adaptive pathways for varied readiness levels, language needs, and learning profiles.</p></article>
          <article className="card"><h2>School-system alignment</h2><p>Supports technology adoption and professional development goals led by instructional leaders.</p></article>
        </div>
        <button className="button primary top-space" type="button">View VIC Demo (Placeholder)</button>
      </div>
    </section>
  );
}
