import { GuitarNav } from '../GuitarNav';
import { NoteFinderGame } from '../NoteFinderGame';

export const metadata = {
  title: 'Learn the Notes | Fretboard Freedom',
  description: 'Interactive fretboard note-learning games and exercises.',
};

export default function LearnTheNotesPage() {
  return (
    <div className="guitar-app-shell">
      <section className="guitar-lesson-section">
        <div className="container guitar-stage">
          <GuitarNav currentHref="/guitar/learn-the-notes" />
          <div className="guitar-lesson-intro">
            <p className="guitar-kicker">LEARN THE NOTES</p>
            <h1>Learn the Notes</h1>
            <p className="guitar-tagline">Interactive fretboard note-learning games and exercises.</p>
          </div>
          <NoteFinderGame />
        </div>
      </section>
    </div>
  );
}
