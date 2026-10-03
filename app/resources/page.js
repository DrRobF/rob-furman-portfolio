import Image from 'next/image';
import Link from 'next/link';
import { products } from './products';
import styles from './resources.module.css';

export const metadata = {
  title: 'Educator Resources & Digital Toolkits | Dr. Rob Furman',
  description: 'Explore Dr. Rob Furman’s educator store: digital downloads, the H.E.L.P. leadership suite, and Ask VIC, a virtual co-teacher for schools.',
  alternates: { canonical: 'https://www.drrobfurman.com/resources' },
};

export default function ResourcesPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>Dr. Rob Furman’s resource store</p>
          <h1>Tools for the real work of education.</h1>
          <p className={styles.heroLead}>A decision to make. A conversation to prepare for. A lesson to teach. Find downloads, leadership practice, and AI-supported learning tools you can put to work.</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#shop">Explore the resources</a>
            <Link className={styles.outlineButton} href="#free-guides">Start with a free guide</Link>
          </div>
          <div className={styles.heroDetails} aria-label="Store details">
            <span>Instant digital downloads</span><span>School tools and platforms</span><span>Created by a practicing school leader</span>
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

      <section className={styles.freeSection} aria-labelledby="teacher-prompts-title">
        <div className="container"><div className={styles.detailLayout}>
          <Link href="/resources/teacher-directed-ai-prompts" aria-label="Explore Teacher Directed AI Prompts Across Subjects"><Image className={styles.detailImage} src="/products/teacher-prompts-cover.svg" alt="Teacher Directed AI Prompts Across Subjects cover" width={1280} height={720} /></Link>
          <div><p className={styles.eyebrow}>New teacher resource · Preview and inquire</p><h2 id="teacher-prompts-title">Teacher Directed AI Prompts Across Subjects</h2><p>Six complete prompts and 36 subject adaptations for grades 6–12, with student handouts, a worked example, and a teacher review rubric.</p><p>Explore the contents and try a free sample. Online checkout is coming soon.</p><Link className={styles.featureLink} href="/resources/teacher-directed-ai-prompts">See the pack and free sample →</Link></div>
        </div></div>
      </section>

      <section className={styles.platformSection} id="platforms" aria-labelledby="platform-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>More ways to work together</p><h2 id="platform-title">Leadership and learning platforms</h2></div>
            <p>Explore the experience and ask about access for your school or team. These offerings do not have a self-serve checkout here.</p>
          </div>
          <div className={styles.platformGrid}>
            <article className={`${styles.platformCard} ${styles.helpCard}`}>
              <p className={styles.platformKicker}>Leadership development · H.E.L.P.</p>
              <h3>Human Equation Leadership Psychology</h3>
              <p>Practice the human decisions school leaders face under pressure through a diagnostic, eight-factor course, simulations, and a reflection dashboard.</p>
              <p className={styles.platformStatus}>Explore the suite · Ask about team use</p>
              <div className={styles.platformActions}>
                <Link href="/human-equation-suite" className={styles.platformPrimary}>Explore H.E.L.P. <span aria-hidden="true">→</span></Link>
                <Link href="/contact" className={styles.platformSecondary}>Ask about team access</Link>
              </div>
            </article>
            <article className={`${styles.platformCard} ${styles.vicCard}`}>
              <p className={styles.platformKicker}>AI-supported instruction · Ask VIC</p>
              <h3>VIC: Virtual Co-Teacher</h3>
              <p>See how VIC guides students step by step and supports teachers with instruction, scaffolds, and useful learning information.</p>
              <p className={styles.platformStatus}>Approved school accounts · Request access</p>
              <div className={styles.platformActions}>
                <Link href="/vic" className={styles.platformPrimary}>Explore VIC <span aria-hidden="true">→</span></Link>
                <a href="https://askvic.ai" target="_blank" rel="noopener noreferrer" className={styles.platformSecondary}>Visit AskVic.ai <span aria-hidden="true">↗</span></a>
              </div>
            </article>
          </div>
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
