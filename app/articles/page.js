import Link from 'next/link';
import styles from './articles.module.css';

export const metadata = {
  title: 'Articles on AI in Education and School Leadership | Dr. Rob Furman',
  description: 'Original articles from Dr. Rob Furman on teaching with AI, student learning, school leadership, and the human decisions behind education.',
  alternates: { canonical: 'https://www.drrobfurman.com/articles' },
};

const articles = [
  {
    title: 'Teachers Are Using AI. Why Haven’t Schools Told Them How?',
    description: 'A principal’s practical starting point for teacher AI use: save planning time, personalize practice, keep children and teaching at the center, and model it for staff.',
    href: '/articles/teachers-using-ai-school-guidance',
    date: 'October 3, 2026',
    topic: 'AI in education',
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
