import Image from 'next/image';

const featuredBooks = [
  {
    title: 'The Future Ready Challenge',
    description:
      'A practical framework for preparing schools and learning communities for rapidly changing futures.',
    image: '/images/book-future-ready.jpg',
    alt: 'The Future Ready Challenge book cover',
  },
  {
    title: 'Personalized Reading',
    description:
      'Strategies to improve reading outcomes through personalized pathways and instructional design.',
    image: '/images/book-reading.jpg',
    alt: 'Personalized Reading book cover',
  },
];

const additionalWorks = [
  {
    title: 'Technology, Reading & Digital Literacy',
    description:
      'Applied guidance for integrating digital tools into literacy instruction while keeping pedagogy at the center.',
  },
  {
    title: 'Engaging Young Readers',
    description:
      'Practical approaches that help educators improve reading engagement and student ownership in literacy growth.',
  },
];

export default function PublicationsPage() {
  return (
    <section className="section section-light">
      <div className="container">
        <h1>Publications</h1>
        <p className="lead">
          Dr. Rob Furman is an ISTE published author focused on educational technology, literacy, and
          practical innovation for teachers, leaders, and learning organizations.
        </p>

        <h2 className="top-space">Selected Books and Publications</h2>

        <div className="publication-cards top-space-sm">
          {featuredBooks.map((book) => (
            <article key={book.title} className="publication-card">
              <div className="publication-image-wrap">
                <Image
                  src={book.image}
                  alt={book.alt}
                  width={540}
                  height={760}
                  className="publication-image"
                />
              </div>
              <div className="publication-content">
                <h3>{book.title}</h3>
                <p>{book.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="card-grid top-space">
          {additionalWorks.map((work) => (
            <article key={work.title} className="card">
              <h3>{work.title}</h3>
              <p>{work.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
