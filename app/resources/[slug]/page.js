import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, products } from '../products';
import styles from '../resources.module.css';

export function generateStaticParams() {
  // The teacher prompt pack has a dedicated page with its free sample.
  return products.filter((product) => product.slug !== 'teacher-directed-ai-prompts').map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }) {
  const product = getProduct(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} | Dr. Rob Furman`,
    description: `${product.summary} See the contents, intended audience, and license before buying.`,
    alternates: { canonical: `https://www.drrobfurman.com/resources/${product.slug}` },
  };
}

export default function ProductPage({ params }) {
  const product = getProduct(params.slug);
  if (!product) notFound();
  const otherProducts = products.filter((item) => item.slug !== product.slug).slice(0, 2);

  return (
    <>
      <section className={styles.detailHero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/resources">Resources</Link><span aria-hidden="true">/</span><span>{product.name}</span></nav>
          <div className={styles.detailLayout}>
            <div className={styles.detailImageWrap}><Image src={product.cover} alt={`${product.name} product cover`} width={1280} height={720} className={styles.detailImage} priority /></div>
            <div className={styles.detailInfo}>
              <p className={styles.eyebrow}>{product.category}</p>
              <h1>{product.name}</h1>
              <p className={styles.detailLead}>{product.summary}</p>
              <p className={styles.audience}>For {product.audience.toLowerCase()}</p>
              <div className={styles.purchaseBox}>
                <div><span>Digital download</span><strong>${product.price}</strong></div>
                <a className={styles.primaryButton} href={product.checkout} target="_blank" rel="noopener noreferrer">Buy on Gumroad <span aria-hidden="true">↗</span></a>
                <small>Secure checkout and instant delivery through Gumroad. Final tax and currency appear there.</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.detailContent}>
        <div className="container"><div className={styles.detailColumns}>
          <div className={styles.detailStory}>
            <p className={styles.eyebrow}>The idea</p><h2>What this helps you do</h2><p>{product.intro}</p>
            {product.slug === 'principal-ai-starter-kit' && (
              <div className={styles.pilotFeature}>
                <p className={styles.eyebrow}>See the first pilot before you run yours</p>
                <h2>A complete example you can adapt</h2>
                <p>The kit includes a worked first pilot for a 45-minute staff meeting. See the safe inputs, a filled prompt, an illustrative AI draft with mistakes, the principal’s corrections, and a seven-day go, revise, or stop check.</p>
                <ul>
                  <li>Choose a low-risk first task and keep confidential information out of the prompt.</li>
                  <li>Catch invented assumptions and measure preparation time, including corrections.</li>
                  <li>Stop the pilot when it adds more risk or work than value.</li>
                </ul>
                <p><strong>The tool supplies a draft. The principal supplies the judgment.</strong></p>
                <a href={product.checkout} target="_blank" rel="noopener noreferrer" className={styles.featureLink}>Get the Principal AI Starter Kit — $29 <span aria-hidden="true">↗</span></a>
              </div>
            )}
            {product.slug === 'what-would-you-do' && (
              <div className={styles.pilotFeature}>
                <p className={styles.eyebrow}>Try one decision</p>
                <h2>Would you move the child—or build the plan?</h2>
                <p>A teacher asks to move a third grader with significant behavior needs to another classroom. The move may help the current teacher and classmates, but no one can explain how it would help the child.</p>
                <p>Before seeing my decision, ask yourself:</p>
                <ul>
                  <li>What problem would the classroom change actually solve?</li>
                  <li>What would be different for the student after the move?</li>
                  <li>What responsibility would transfer to the receiving teacher?</li>
                  <li>What support plan would the child need either way?</li>
                </ul>
                <p><strong>A classroom move should solve a problem—not relocate it.</strong></p>
                <p>Make your call first, then compare it with how I handled this case and eleven other school leadership decisions.</p>
                <a href={product.checkout} target="_blank" rel="noopener noreferrer" className={styles.featureLink}>Practice all 12 scenarios — $19 <span aria-hidden="true">↗</span></a>
                <p><Link href="/contact">Ask about a district or multi-school license</Link></p>
              </div>
            )}
            <h2>What is inside</h2><ul>{product.includes.map((line) => <li key={line}>{line}</li>)}</ul>
            <h2>When to use it</h2><ul>{product.usefulFor.map((line) => <li key={line}>{line}</li>)}</ul>
          </div>
          <aside className={styles.detailAside}>
            <h3>Use and licensing</h3><p>{product.license}</p><p>{product.note}</p>
            <Link className={styles.relatedLink} href={product.related}>{product.relatedLabel} <span aria-hidden="true">→</span></Link>
            <p className={styles.contactLine}>Need a district license? <Link href="/contact">Contact Dr. Rob</Link>.</p>
          </aside>
        </div></div>
      </section>

      <section className={styles.moreSection}>
        <div className="container">
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Keep exploring</p><h2>Other practical resources</h2></div><Link href="/resources" className={styles.allLink}>View the whole store →</Link></div>
          <div className={styles.miniGrid}>{otherProducts.map((item) => <Link href={`/resources/${item.slug}`} className={styles.miniCard} key={item.slug}><Image src={item.thumbnail} alt="" width={100} height={100} /><span><small>{item.category}</small><strong>{item.name}</strong></span><b aria-hidden="true">→</b></Link>)}</div>
        </div>
      </section>
    </>
  );
}
