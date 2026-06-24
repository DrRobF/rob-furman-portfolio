import { CagedSoloZones } from '../CagedSoloZones';
import { GuitarNav } from '../GuitarNav';

export const metadata = {
  title: 'CAGED Solo Zones | Fretboard Freedom',
  description: 'Learn how a CAGED chord shape becomes a practical soloing area on the guitar neck.',
};

export default function CagedSoloZonesPage() {
  return (
    <div className="guitar-app-shell">
      <section className="guitar-lesson-section">
        <div className="container guitar-stage">
          <GuitarNav currentHref="/guitar/caged-solo-zones" />
          <div className="guitar-lesson-intro">
            <p className="guitar-kicker">CAGED SOLO ZONES</p>
            <h1>CAGED Solo Zones</h1>
            <p className="guitar-tagline">See how a chord shape becomes a soloing area.</p>
          </div>
          <CagedSoloZones />
        </div>
      </section>
    </div>
  );
}
