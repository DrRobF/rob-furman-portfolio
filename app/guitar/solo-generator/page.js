import Link from 'next/link';
import { GuitarNav } from '../GuitarNav';

export const metadata = {
  title: 'Solo Generator Retired | Fretboard Freedom',
  description: 'Musical-content generation has been retired. Use the imported Lick Library instead.',
};

export default function SoloGeneratorPage() {
  return (
    <div className="guitar-app-shell">
      <section className="guitar-lesson-section">
        <div className="container guitar-stage">
          <GuitarNav currentHref="/guitar/solo-generator" />
          <div className="guitar-lesson-intro">
            <p className="guitar-kicker">SOLO GENERATOR RETIRED</p>
            <h1>Solo Generator</h1>
            <p className="guitar-tagline">Musical-content generation is turned off. Practice material now comes from imported, attributed lick data only.</p>
          </div>
          <div className="guitar-placeholder-card">
            <span>No generated solos</span>
            <p>Fake solo generation has been removed. Add licensed lick data in the admin/dev import file and practice it in the Lick Library.</p>
            <Link className="button primary" href="/guitar/lick-library">
              Open Lick Library
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
