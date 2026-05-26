'use client';

import Link from 'next/link';
import { useLanguage } from '../components/LanguageProvider';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import HumanEquationNav from '../components/HumanEquationNav';

const moduleOverview = ['0. Dashboard', '1. Leadership Diagnostic', '2. 8 Factors Course', '3. Parent Call Rehearsal', '4. School Leadership Simulation', '5. Urban Student Perspective Simulation', '6. Cumulative Human Equation Profile'];

export default function HumanEquationSuitePage() {
  const { language } = useLanguage();
  const isEs = (language || 'en') === 'es';

  return (
    <section className="section section-light">
      <div className="container">
        <LanguageSwitcher />
        <HumanEquationNav />

        <div className="hes-suite-frontdoor top-space-sm">
          <p className="eyebrow">Human Equation Suite</p>
          <h1>{isEs ? 'Centro de Inteligencia de Liderazgo' : 'Leadership Intelligence Suite'}</h1>
          <p className="lead">
            {isEs
              ? 'Una sola entrada para medir, practicar y hacer seguimiento de tu crecimiento de liderazgo bajo presión.'
              : 'A progression-based leadership operating system. Recommended full path: Diagnostic → 8 Factors Course → Simulations → Dashboard Review. The course can be taken before or after the diagnostic.'}
          </p>
          <div className="button-row top-space-sm">
            <Link href="/human-equation-suite/learn" className="button primary">Begin 8 Factors Course</Link>
            <Link href="/human-equation-suite/dashboard" className="button secondary">Open Executive Dashboard</Link>
          </div>
          <div className="hes-suite-modules top-space-sm">
            {moduleOverview.map((item) => <span key={item} className="status-chip">{item}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}
