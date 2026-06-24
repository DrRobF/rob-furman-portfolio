import Link from 'next/link';
import { GuitarNav } from '../GuitarNav';

export const metadata = {
  title: 'Simple Solos | Fretboard Freedom',
  description: 'Beginner-friendly blues, rock, country, and melodic solos with tablature and practice tools.',
};

export default function simplesolosPage() {
  return (
    <div className="guitar-app-shell">
      <section className="guitar-lesson-section">
        <div className="container guitar-stage">
          <GuitarNav currentHref="/guitar/simple-solos" />
          <div className="guitar-placeholder-layout">
            <div>
              <p className="guitar-kicker">SIMPLE SOLOS</p>
              <h1>Simple Solos</h1>
              <p className="guitar-tagline">Beginner-friendly blues, rock, country, and melodic solos with tablature and practice tools.</p>
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
