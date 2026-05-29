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

const selectedArticles = [
  {
    title: '3 Predictions About the Future of Education',
    source: 'K12Digest',
    description:
      'A forward-looking article on the shifts, opportunities, and challenges shaping the next era of teaching and learning.',
    href: 'https://www.k12digest.com/3-predictions-about-the-future-of-education/',
  },
  {
    title: 'Reimagine What Learning Looks Like in a Classroom',
    source: 'Digital Promise',
    description:
      'A reflection on redesigning learning experiences, student engagement, and classroom environments to better meet the needs of modern learners.',
    href: 'https://digitalpromise.org/2020/05/28/guest-post-reimagine-what-learning-looks-like-in-a-classroom/',
  },
  {
    title: 'Is Public Education Endangered?',
    source: 'HuffPost',
    description:
      'An examination of the challenges facing public education and why strengthening public schools remains critical to the future of communities and learners.',
    href: 'https://www.huffpost.com/entry/is-public-education-endangered_b_12753594',
  },
  {
    title: '5 Things Teachers Can Learn from Their Band Director',
    source: 'Edutopia',
    description:
      'A practical look at leadership, teamwork, culture, performance, and continuous improvement through the lens of music education.',
    href: 'https://www.edutopia.org/discussion/5-things-teachers-can-learn-their-band-director',
  },
  {
    title: '5 Things Parents Can Do To Help Their Children Thrive and Excel',
    source: 'Authority Magazine',
    description:
      'Practical guidance for parents supporting children as they build the habits, confidence, and resilience needed to thrive.',
    href: 'https://medium.com/authority-magazine/author-dr-l-robert-furman-on-the-5-things-parents-can-do-to-help-their-children-thrive-and-excel-d4c3aab54a84',
  },
  {
    title: "It's Time for an Education Revolution",
    source: 'TEDx Talk',
    description:
      'A TEDx presentation exploring innovation, learning systems, and the future of education in a rapidly changing world.',
    href: 'https://www.youtube.com/watch?v=Syun3J290GE',
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
        <div className="card-grid two-up top-space-sm">
          {selectedArticles.map((article) => (
            <article key={article.title} className="card project-card equal-card">
              <p className="eyebrow">{article.source}</p>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <a
                className="text-link"
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read or watch →
              </a>
            </article>
          ))}
        </div>

        <p className="top-space-sm">
          Additional work includes national articles, blog contributions, and media features focused
          on instructional design, leadership, and educational innovation.
        </p>
      </div>
    </section>
  );
}
