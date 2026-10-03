import Link from 'next/link';
import Image from 'next/image';
import styles from './articles.module.css';

export const metadata = {
  title: 'Articles on AI in Education and School Leadership | Dr. Rob Furman',
  description: 'Original articles from Dr. Rob Furman on teaching with AI, student learning, school leadership, and the human decisions behind education.',
  alternates: { canonical: 'https://www.drrobfurman.com/articles' },
};

const articles = [
  {
    title: 'AI and Independent Reading: Start With What Kids Love',
    description: 'Find reading that connects with a child’s interests, make the page approachable, and protect the pleasure. A practical role for AI in building a reading life.',
    href: '/articles/ai-independent-reading',
    date: 'October 3, 2026',
    topic: 'AI & literacy',
    image: '/images/articles/ai-independent-reading.webp',
  },
  {
    title: 'Teachers Are Using AI. Why Haven’t Schools Told Them How?',
    description: 'A principal’s practical starting point for teacher AI use: save planning time, personalize practice, keep children and teaching at the center, and model it for staff.',
    href: '/articles/teachers-using-ai-school-guidance',
    date: 'October 3, 2026',
    topic: 'AI in education',
    image: '/images/articles/teachers-ai-guidance.webp',
  },
];

export default function ArticlesPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <p className="eyebrow">Dr. Rob Furman’s writing</p>
          <h1>Articles for the People Doing the Work in Schools</h1>
          <p className={`lead ${styles.intro}`}>
            Ideas from a principal’s desk on AI, learning, literacy, and leading people.
            Read an article, try an idea, and make it your own.
          </p>
        </div>
      </section>
      <section className="section section-light">
        <div className="container">
          <div className={styles.grid}>
            {articles.map((article) => (
              <article className={styles.card} key={article.href}>
                <Link className={styles.coverLink} href={article.href} aria-label={`Read ${article.title}`}>
                  <Image className={styles.coverImage} src={article.image} alt={`Magazine-style cover: ${article.title}`} width={1734} height={907} sizes="(max-width: 768px) 100vw, 560px" />
                </Link>
                <span className={styles.tag}>{article.topic}</span>
                <h2><Link href={article.href}>{article.title}</Link></h2>
                <p>{article.description}</p>
                <p className={styles.meta}>Dr. Rob Furman · {article.date}</p>
                <Link href={article.href} aria-label={`Read ${article.title}`}>Read the article →</Link>
              </article>
            ))}
          </div>
          <p className="top-space">For books and articles published elsewhere, visit my <Link className="text-link" href="/publications">Publications page →</Link></p>
        </div>
      </section>
    </>
  );
}
