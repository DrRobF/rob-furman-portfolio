import Link from 'next/link';
import { GuitarNav } from '../GuitarNav';

export const metadata = {
  title: 'CAGED Shapes | Fretboard Freedom',
  description: 'Visual lessons showing how chord shapes connect across the neck and how scales fit around those shapes.',
};

export default function cagedshapesPage() {
  return (
    <div className="guitar-app-shell">
      <section className="guitar-lesson-section">
        <div className="container guitar-stage">
          <GuitarNav currentHref="/guitar/caged-shapes" />
          <div className="guitar-placeholder-layout">
            <div>
              <p className="guitar-kicker">CAGED SHAPES</p>
              <h1>CAGED Shapes</h1>
              <p className="guitar-tagline">Visual lessons showing how chord shapes connect across the neck and how scales fit around those shapes.</p>
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
