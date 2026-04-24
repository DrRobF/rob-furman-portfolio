import Image from 'next/image';

const publicationCards = [
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

export default function PublicationsPage() {
  return (
    <section className="section section-light">
      <div className="container">
        <h1>Publications</h1>
        <p className="lead">
          Dr. Rob Furman is an ISTE published educational technology author whose books and writing
          connect instructional leadership, literacy, and practical classroom innovation.
        </p>

        <div className="publication-cards top-space">
          {publicationCards.map((book) => (
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
                <h2>{book.title}</h2>
                <p>{book.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
