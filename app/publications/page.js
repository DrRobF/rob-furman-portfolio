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
    title: 'Technology, Reading & Digital Literacy',
    description:
      'Applied guidance for integrating digital tools into literacy instruction while keeping pedagogy at the center.',
    image: '/images/book-reading.jpg',
    alt: 'Technology, Reading & Digital Literacy book cover',
  },
  {
    title: 'Personalized Reading',
    description:
      'Strategies to improve reading outcomes through personalized pathways and instructional design.',
    image: '/images/personalized-reading.jpeg',
    alt: 'Personalized Reading book cover',
  },
  {
    title: 'Engaging Young Readers',
    description:
      'Practical approaches that help educators improve reading engagement and student ownership in literacy growth.',
    image: '/images/engaging-young-readers.jpeg',
    alt: 'Engaging Young Readers book cover',
  },
];

export default function PublicationsPage() {
  return (
    <section className="section section-light">
      <div className="container">
        <h1>Publications</h1>
        <p className="lead">
          Dr. Rob Furman is an ISTE-published author and national contributor whose work spans
          books, articles, and media focused on educational technology, literacy, leadership, and
          practical innovation in schools.
        </p>
        <p className="top-space-sm">
          His writing has appeared in outlets including K12Digest, Authority Magazine, EdTech
          Review, and other national education platforms, connecting instructional practice with
          real-world application.
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
      </div>
    </section>
  );
}
