import Image from 'next/image';
import Link from 'next/link';
import { products } from './products';
import styles from './resources.module.css';

export const metadata = {
  title: 'Educator Resources & Digital Toolkits | Dr. Rob Furman',
  description: 'Shop Dr. Rob Furman’s digital resources for school leadership, practical AI, difficult conversations, and creative classrooms. Explore the details here, then check out securely on Gumroad.',
  alternates: { canonical: 'https://www.drrobfurman.com/resources' },
};

export default function ResourcesPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>Dr. Rob Furman’s resource store</p>
          <h1>Tools for the real work of education.</h1>
          <p className={styles.heroLead}>A decision to make. A conversation to prepare for. A lesson to teach. Find a resource you can put to work, then come back when the next challenge arrives.</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#shop">Explore the resources</a>
            <Link className={styles.outlineButton} href="#free-guides">Start with a free guide</Link>
          </div>
          <div className={styles.heroDetails} aria-label="Store details">
            <span>Instant digital downloads</span><span>Editable tools</span><span>Created by a practicing school leader</span>
          </div>
        </div>
      </section>

      <section className={styles.shopSection} id="shop" aria-labelledby="shop-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>Available now</p><h2 id="shop-title">Choose what you need today</h2></div>
            <p>Explore each resource here. When you are ready, its purchase button opens that product’s secure Gumroad checkout.</p>
          </div>
          <div className={styles.productGrid}>
            {products.map((product) => (
              <article className={styles.productCard} key={product.slug}>
                <Link href={`/resources/${product.slug}`} className={styles.cardImageLink} aria-label={`View ${product.name}`}>
                  <Image src={product.thumbnail} alt={`${product.name} cover`} width={680} height={680} className={styles.cardImage} />
                </Link>
                <div className={styles.cardBody}>
                  <p className={styles.cardCategory}>{product.category}</p>
                  <h3><Link href={`/resources/${product.slug}`}>{product.name}</Link></h3>
                  <p className={styles.cardSummary}>{product.summary}</p>
                  <div className={styles.cardBottom}>
                    <span className={styles.price}>${product.price}</span>
                    <Link className={styles.cardLink} href={`/resources/${product.slug}`}>See what’s inside <span aria-hidden="true">→</span></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className={styles.priceNote}>Prices shown in US dollars. Gumroad shows the final price, local currency, and any tax at checkout.</p>
        </div>
      </section>

      <section className={styles.freeSection} id="free-guides" aria-labelledby="free-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>Read and use freely</p><h2 id="free-title">Good ideas before any purchase</h2></div>
            <p>These guides stand on their own. Copy a prompt, try an activity, and return when you need the next step.</p>
          </div>
          <div className={styles.guideGrid}>
            <Link href="/ai-in-education"><span>01 / AI in education</span><strong>Start with learning, then choose the tool</strong><small>Explore the guide →</small></Link>
            <Link href="/ai-for-reading"><span>02 / Reading</span><strong>Help children become readers</strong><small>Explore the guide →</small></Link>
            <Link href="/ai-literacy-for-students"><span>03 / Student AI literacy</span><strong>Teach students to check an AI answer</strong><small>Explore the lesson →</small></Link>
          </div>
        </div>
      </section>

      <section className={styles.closingSection}>
        <div className="container"><div className={styles.closingPanel}>
          <div><p className={styles.eyebrow}>For a whole school or district</p><h2>Need broader use or a live conversation?</h2><p>Tell me which resource your team needs, how many schools will use it, or what you would like to work through together.</p></div>
          <div className={styles.closingActions}><Link className={styles.primaryButton} href="/contact">Ask about a license</Link><Link className={styles.outlineButton} href="/speaking">Explore workshops & keynotes</Link></div>
        </div></div>
      </section>
    </>
  );
}
