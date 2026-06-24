import Link from 'next/link';
import { GuitarNav } from '../GuitarNav';

export const metadata = {
  title: 'Practice Mode | Fretboard Freedom',
  description: 'Interactive exercises that teach targeting roots, thirds, fifths, and chord tones during chord changes.',
};

export default function practicemodePage() {
  return (
    <div className="guitar-app-shell">
      <section className="guitar-lesson-section">
        <div className="container guitar-stage">
          <GuitarNav currentHref="/guitar/practice-mode" />
          <div className="guitar-placeholder-layout">
            <div>
              <p className="guitar-kicker">PRACTICE MODE</p>
              <h1>Practice Mode</h1>
              <p className="guitar-tagline">Interactive exercises that teach targeting roots, thirds, fifths, and chord tones during chord changes.</p>
            </div>
            <div className="guitar-placeholder-card">
              <span>Coming soon</span>
              <p>
                This section is ready for interactive practice tools and visual guitar lessons in
                the next build phase.
              </p>
              <Link className="button primary" href="/guitar">
                Back to Fretboard Freedom
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
