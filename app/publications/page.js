import VisualPlaceholder from '../components/VisualPlaceholder';

export default function PublicationsPage() {
  return (
    <section className="section">
      <div className="container">
        <h1>Publications</h1>
        <p className="lead">
          Dr. Rob Furman is an ISTE published educational technology author whose books and writing
          connect instructional leadership, literacy, and practical classroom innovation.
        </p>
        <div className="split-grid top-space">
          <div className="card-grid">
            <article className="card"><h2>The Future Ready Challenge</h2><p>A practical framework for preparing schools and learning communities for rapidly changing futures.</p></article>
            <article className="card"><h2>Personalized Reading</h2><p>Strategies to improve reading outcomes through personalized pathways and instructional design.</p></article>
            <article className="card"><h2>Reading, Technology, and Digital Literacy</h2><p>Approaches for integrating literacy growth with modern digital tools and thoughtful pedagogy.</p></article>
            <article className="card"><h2>Engaging Young Readers</h2><p>Evidence-informed methods for boosting engagement and reading identity in students.</p></article>
          </div>
          <VisualPlaceholder
            title="Books + Author Media"
            subtitle="Replace with publication covers and author profile imagery"
            tag="Books"
            variant="books"
          />
        </div>
      </div>
    </section>
  );
}
