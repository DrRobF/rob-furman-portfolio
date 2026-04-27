import Image from 'next/image';

const featuredBooks = [
  {
    title: 'The Future Ready Challenge',
    description:
      'A practical framework for helping schools and organizations adapt to change, improve decision-making, and prepare for evolving learning environments.',
    image: '/images/book-future-ready.jpg',
    alt: 'The Future Ready Challenge book cover',
  },
  {
    title: 'Technology, Reading & Digital Literacy',
    description:
      'A guide to integrating digital tools into literacy instruction while maintaining strong pedagogy, instructional clarity, and student engagement.',
    image: '/images/book-reading.jpg',
    alt: 'Technology, Reading & Digital Literacy book cover',
  },
  {
    title: 'Personalized Reading',
    description:
      'Strategies for improving reading outcomes through personalization, instructional design, and systems that meet learners where they are.',
    image: '/images/personalized-reading.jpeg',
    alt: 'Personalized Reading book cover',
  },
  {
    title: 'Engaging Young Readers',
    description:
      'Approaches for increasing student engagement, ownership, and motivation in reading through practical classroom strategies.',
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
          Dr. Rob Furman is an ISTE-published author and national contributor whose work focuses on
          improving how learning, instruction, and leadership function in real-world environments.
        </p>
        <p className="top-space-sm">
          His writing spans books, articles, and media contributions across educational technology,
          literacy, leadership, and applied innovation — connecting ideas directly to practice in
          schools and organizations.
        </p>
        <p className="top-space-sm">
          His work has appeared in outlets including K12Digest, Authority Magazine, EdTech Review,
          and other national education platforms.
        </p>

        <h2 className="top-space">Books and Selected Work</h2>

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

        <h2 className="top-space">Selected Articles</h2>
        <ul className="top-space-sm">
          <li>
            <a href="https://www.k12digest.com/3-predictions-about-the-future-of-education/">
              3 Predictions About the Future of Education
            </a>
          </li>
          <li>
            <a href="https://medium.com/authority-magazine/author-dr-l-robert-furman-on-the-5-things-parents-can-do-to-help-their-children-thrive-and-excel-d4c3aab54a84">
              5 Things Parents Can Do To Help Their Children Thrive and Excel
            </a>
          </li>
        </ul>

        <p className="top-space-sm">
          Additional work includes national articles, blog contributions, and media features focused
          on instructional design, leadership, and educational innovation.
        </p>
      </div>
    </section>
  );
}
