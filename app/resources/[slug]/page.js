import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, products } from '../products';
import styles from '../resources.module.css';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
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
