import Image from 'next/image';
import Link from 'next/link';
import { pageMeta } from '../lib/seo';
import { products } from '../resources/products';
import styles from './start.module.css';

export const metadata = pageMeta({
  title: 'Start Here | Dr. Rob Furman: Free School Tools & Leadership Resources',
  description: 'Free tools for teachers and school leaders from principal and author Dr. Rob Furman: Ask VIC, leadership simulations, and practical downloads.',
  path: '/start',
});

const freeTools = [
  { href: 'https://www.askvic.ai/', title: 'Ask VIC', text: 'Free AI co-teacher: lessons, parent messages, and a refresh for an old lesson.', external: true },
  { href: '/human-equation-suite/leadership-sim', title: 'A Day in the Life of a Principal', text: 'Free simulation. Make the calls on a full day in the principal’s chair.' },
  { href: '/human-equation-suite/urban-student-sim', title: 'A Day in the Life of an Urban Student', text: 'Free simulation. Live one student’s school day from the inside.' },
  { href: '/human-equation-suite', title: 'H.E.L.P. Leadership Suite', text: 'Practice hard conversations, parent calls, and tough decisions before they’re real.' },
];

export default function StartPage() {
  return (
    <div className={styles.page}>
      <section className={styles.top}>
        <Image src="/images/headshot-blue.jpg" alt="Dr. Rob Furman" width={160} height={160} className={styles.avatar} priority />
        <h1>Dr. Rob Furman</h1>
        <p className={styles.sub}>Principal for 20 years. Author. TEDx speaker.</p>
        <p className={styles.lead}>Free tools and practical resources for teachers and school leaders.</p>
      </section>

      <section aria-labelledby="free-title">
        <h2 id="free-title" className={styles.label}>Start free</h2>
        <div className={styles.stack}>
          {freeTools.map((t) => (
            t.external
              ? <a key={t.title} className={styles.card} href={t.href} rel="noopener"><strong>{t.title}</strong><span>{t.text}</span></a>
              : <Link key={t.title} className={styles.card} href={t.href}><strong>{t.title}</strong><span>{t.text}</span></Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="shop-title">
        <h2 id="shop-title" className={styles.label}>Downloads</h2>
        <div className={styles.stack}>
          {products.map((p) => (
            <a key={p.slug} className={styles.product} href={p.checkout} rel="noopener">
              <Image src={p.thumbnail} alt="" width={96} height={96} className={styles.thumb} />
              <span className={styles.productText}>
                <strong>{p.name}</strong>
                <span>{p.summary}</span>
              </span>
              <span className={styles.price}>${p.price}</span>
            </a>
          ))}
        </div>
        <p className={styles.note}>Instant digital downloads. Secure checkout on Gumroad. <Link href="/resources">See what’s inside each one</Link>.</p>
      </section>

      <section aria-labelledby="more-title">
        <h2 id="more-title" className={styles.label}>More</h2>
        <div className={styles.row}>
          <Link href="/speaking" className={styles.pill}>Book a speaking event</Link>
          <Link href="/publications" className={styles.pill}>Books</Link>
          <Link href="/contact" className={styles.pill}>Contact</Link>
        </div>
      </section>
    </div>
  );
}
