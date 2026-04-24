import VisualPlaceholder from '../components/VisualPlaceholder';

export default function SpeakingPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Speaking</h1>
        <p className="lead">
          TEDx speaker and keynote presenter focused on instructional leadership, educational
          innovation, AI-enabled learning, and practical implementation for schools and organizations.
        </p>
        <div className="card-grid two-up top-space">
          <VisualPlaceholder
            title="TEDx Stage Photo"
            subtitle="Replace with TEDx speaking image"
            tag="TEDx"
            variant="speaking"
          />
          <VisualPlaceholder
            title="Conference Keynote Photo"
            subtitle="Replace with keynote or district workshop image"
            tag="Keynote"
            variant="speaking"
          />
        </div>
        <div className="card-grid top-space">
          <article className="card"><h2>TEDx Speaker</h2><p>Talks centered on educational transformation, literacy, and future-ready learning systems.</p></article>
          <article className="card"><h2>Keynote presentations</h2><p>Conference and district keynotes for principals, leadership teams, and educator audiences.</p></article>
          <article className="card"><h2>Professional development</h2><p>Action-oriented sessions on technology adoption, instructional systems, and implementation planning.</p></article>
          <article className="card"><h2>AI in education</h2><p>Practical frameworks for responsible AI integration that support teachers and learners.</p></article>
        </div>
      </div>
    </section>
  );
}
