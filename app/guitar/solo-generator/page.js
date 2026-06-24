import { GuitarNav } from '../GuitarNav';
import { SoloGenerator } from '../SoloGenerator';

export const metadata = {
  title: 'Solo Generator | Fretboard Freedom',
  description: 'Generate beginner-friendly 8-bar guitar solos for TV Practice Mode.',
};

export default function SoloGeneratorPage() {
  return (
    <div className="guitar-app-shell">
      <section className="guitar-lesson-section">
        <div className="container guitar-stage">
          <GuitarNav currentHref="/guitar/solo-generator" />
          <div className="guitar-lesson-intro">
            <p className="guitar-kicker">SOLO GENERATOR</p>
            <h1>Solo Generator</h1>
            <p className="guitar-tagline">Press one big button and get a short, cool-sounding solo to practice.</p>
          </div>
          <SoloGenerator />
        </div>
      </section>
    </div>
  );
}
