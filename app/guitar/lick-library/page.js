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
          <section aria-labelledby="imported-licks-title">
            <div className="guitar-lesson-intro lick-imported-section-intro">
              <p className="guitar-kicker">LICENSED PRACTICE MATERIAL</p>
              <h2 id="imported-licks-title">Imported Licks</h2>
              <p className="guitar-tagline">Only licks with clear reuse permission are shown. Tabs appear only when tablature reuse is allowed; otherwise the library keeps audio and attribution visible.</p>
            </div>
            <LickLibrary />
          </section>
        </div>
      </section>
    </div>
  );
}
