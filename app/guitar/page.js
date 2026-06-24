import Link from 'next/link';
import { GuitarNav } from './GuitarNav';
import { guitarSections } from './guitarData';

export const metadata = {
  title: 'Fretboard Freedom | Dr. Rob Furman',
  description:
    'Fretboard Freedom helps guitar players learn the neck, understand CAGED, connect chords to scales, and practice musical improvisation.',
};

export default function GuitarPage() {
  return (
    <div className="guitar-app-shell">
      <section className="guitar-hero" aria-labelledby="fretboard-freedom-title">
        <div className="container guitar-stage">
          <GuitarNav />
          <div className="guitar-hero-grid">
            <div className="guitar-hero-copy">
              <p className="guitar-kicker">Guitar learning app</p>
              <h1 id="fretboard-freedom-title">Fretboard Freedom</h1>
              <p className="guitar-tagline">Learn the neck. Understand CAGED. Play real music.</p>
              <p className="guitar-purpose">
                Fretboard Freedom is designed to help players understand the fretboard, learn the
                CAGED system, connect chords to scales, and learn to improvise through practical
                musical exercises rather than memorization alone.
              </p>
            </div>
            <div className="guitar-tv-panel" aria-label="Designed for phone casting and large screens">
              <span>Landscape-first</span>
              <strong>Phone · Desktop · TV</strong>
              <p>Large text, high contrast, and room-readable practice layouts.</p>
            </div>
          </div>

          <div className="guitar-card-grid" aria-label="Fretboard Freedom learning areas">
            {guitarSections.map((section, index) => (
              <Link className="guitar-card" href={section.href} key={section.href}>
                <span className="guitar-card-number">0{index + 1}</span>
                <h2>{section.title}</h2>
                <p>{section.description}</p>
                <span className="guitar-card-action">Open lesson →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
