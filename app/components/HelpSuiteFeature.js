import Image from 'next/image';
import Link from 'next/link';
import styles from './HelpSuiteFeature.module.css';

export default function HelpSuiteFeature() {
  return (
    <section className="section section-dark">
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.content}>
            <div className={styles.copy}>
              <p className={styles.eyebrow}>Flagship Platform</p>
              <h2>H.E.L.P. — Human Equation Leadership Psychology</h2>
              <p className={styles.tagline}>See people. Solve problems. Lead with humanity.</p>
              <p className={styles.body}>
                A pressure-practice leadership psychology system for educators and school
                leaders. H.E.L.P. helps leaders understand how they respond under pressure,
                practice difficult human moments, and build an evolving evidence profile through
                diagnostics, learning, simulations, and dashboard reflection.
              </p>
              <ul className={styles.featureList}>
                <li>Leadership Pressure Diagnostic</li>
                <li>8 Factors Course</li>
                <li>Parent Call and Leadership Simulations</li>
                <li>Evolving Dashboard Evidence Profile</li>
              </ul>
              <div className={styles.buttonRow}>
                <Link href="/human-equation-suite" className={`button primary ${styles.primary}`}>
                  Enter the H.E.L.P. Suite
                </Link>
                <Link
                  href="/human-equation-suite/diagnostic"
                  className={`button secondary ${styles.secondary}`}
                >
                  Start with the Diagnostic
                </Link>
              </div>
            </div>

            <div className={styles.logoWrap}>
              <Image
                src="/images/help-main-logo.png"
                alt="H.E.L.P. Human Equation Leadership Psychology logo"
                width={720}
                height={720}
                className={styles.logo}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
