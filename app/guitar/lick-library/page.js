import { GuitarNav } from '../GuitarNav';
import { LickLibrary } from '../LickLibrary';

export const metadata = {
  title: 'Lick Library | Fretboard Freedom',
  description: 'A TV-friendly library of imported guitar licks with source and license attribution.',
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
            <p className="guitar-tagline">Imported guitar language with visible source and license attribution under every lick.</p>
          </div>
          <LickLibrary />
        </div>
      </section>
    </div>
  );
}
