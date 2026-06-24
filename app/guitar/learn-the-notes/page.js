import Link from 'next/link';
import { GuitarNav } from '../GuitarNav';

export const metadata = {
  title: 'Learn the Notes | Fretboard Freedom',
  description: 'Interactive fretboard note-learning games and exercises.',
};

export default function learnthenotesPage() {
  return (
    <div className="guitar-app-shell">
      <section className="guitar-lesson-section">
        <div className="container guitar-stage">
          <GuitarNav currentHref="/guitar/learn-the-notes" />
          <div className="guitar-placeholder-layout">
            <div>
              <p className="guitar-kicker">LEARN THE NOTES</p>
              <h1>Learn the Notes</h1>
              <p className="guitar-tagline">Interactive fretboard note-learning games and exercises.</p>
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
