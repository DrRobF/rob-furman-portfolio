import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
  ['Services', '#services'],
  ['Gallery', '#gallery'],
  ['About', '#about'],
  ['Journal', '#journal'],
  ['Contact', '#contact'],
];

const highlights = [
  {
    title: 'Thoughtful Design',
    text: 'Every detail is intentionally considered and beautifully curated.',
  },
  {
    title: 'Seamless Planning',
    text: 'We guide each milestone with calm precision so you can be fully present.',
  },
  {
    title: 'Memories That Last',
    text: 'Modern tables. Meaningful Moments. Unforgettable experiences.',
  },
];

export default function HomePage() {
  return (
    <div className="ml-home">
      <section className="ml-hero" id="top">
        <div className="container ml-hero-shell">
          <header className="ml-inline-nav" aria-label="Maison Lucia">
            <Link href="#top" className="ml-brand-mark">
              <span className="ml-monogram">ML</span>
              <span className="ml-brand-copy">Maison Lucia</span>
            </Link>
            <nav aria-label="Homepage navigation">
              <ul className="ml-nav-list">
                {navLinks.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
                <li>
                  <Link href="#contact" className="ml-nav-button">
                    Inquire
                  </Link>
                </li>
              </ul>
            </nav>
          </header>

          <div className="ml-hero-grid">
            <div className="ml-hero-copy">
              <p className="ml-kicker">Luxury Event Styling</p>
              <h1>Modern Tables. Meaningful Moments.</h1>
              <p className="ml-intro">
                Refined tablescapes and elevated event styling for celebrations, milestones,
                intimate gatherings, and unforgettable events.
              </p>
              <div className="ml-button-row">
                <Link href="#contact" className="ml-button ml-button-primary">
                  Inquire Today
                </Link>
                <Link href="#gallery" className="ml-button ml-button-secondary">
                  View Our Work
                </Link>
              </div>
            </div>

            <div className="ml-hero-image-wrap">
              <Image
                src="/green-purple-gold.PNG"
                alt="Maison Lucia hero table styling"
                width={1200}
                height={1100}
                className="ml-hero-image"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="ml-mosaic" aria-label="Editorial showcase">
        <div className="ml-mosaic-item">
          <Image
            src="/casual-table-setting-ml.PNG"
            alt="Casual luxury table setting styled by Maison Lucia"
            width={900}
            height={900}
            className="ml-mosaic-image"
          />
        </div>
        <article className="ml-mosaic-card">
          <p className="ml-kicker">Event Styling</p>
          <h2>Curated With Intention</h2>
          <p>
            Maison Lucia designs elevated tablescapes with modern restraint, layered texture, and
            editorial composition.
          </p>
        </article>
        <div className="ml-mosaic-item">
          <Image
            src="/formal-table-setting-ml.PNG"
            alt="Formal black and ivory place setting styled by Maison Lucia"
            width={900}
            height={900}
            className="ml-mosaic-image"
          />
        </div>
      </section>

      <section className="ml-values" id="services">
        <div className="container ml-values-grid">
          {highlights.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ml-feature" id="about">
        <div className="container ml-feature-grid">
          <div>
            <p className="ml-kicker">Maison Lucia</p>
            <h2>Luxury Event Styling</h2>
            <p>
              From intimate dinners to milestone celebrations, each environment is tailored to feel
              intentional, elegant, and deeply personal.
            </p>
          </div>
          <div className="ml-feature-image-wrap">
            <Image
              src="/formal-table-setting-ml.PNG"
              alt="Elegant formal tablescape with black accents"
              width={1100}
              height={700}
              className="ml-feature-image"
            />
          </div>
        </div>
      </section>

      <section className="ml-cta" id="contact">
        <div className="container ml-cta-panel">
          <p className="ml-kicker">Let&apos;s create something beautiful together</p>
          <h2>Reserve your date with Maison Lucia.</h2>
          <div className="ml-button-row">
            <Link href="mailto:hello@maisonlucia.com" className="ml-button ml-button-primary">
              Inquire
            </Link>
            <Link href="#gallery" id="gallery" className="ml-button ml-button-secondary">
              Browse Gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="ml-journal-anchor" id="journal" aria-hidden="true" />
    </div>
  );
}
