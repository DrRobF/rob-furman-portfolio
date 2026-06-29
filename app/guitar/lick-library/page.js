import { GuitarNav } from '../GuitarNav';
import { LickLibrary } from '../LickLibrary';
import { guitarLicks } from '../lickData';

export const metadata = {
  title: 'Lick Library | Fretboard Freedom',
  description: 'A TV-friendly library of hand-written original guitar licks for focused practice.',
};

export default function LickLibraryPage() {
  return (
    <div className="guitar-app-shell">
      <section className="guitar-lesson-section">
        <div className="container guitar-stage">
          <GuitarNav currentHref="/guitar/lick-library" />
          <div className="guitar-lesson-intro">
            <p className="guitar-kicker">LICK LIBRARY</p>
            <h1>Lick Library</h1>
            <p className="guitar-tagline">TV-friendly guitar language: one clean, original lick at a time.</p>
          </div>
          <LickLibrary licks={guitarLicks} />
        </div>
      </section>
    </div>
  );
}
