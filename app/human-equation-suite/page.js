'use client';

import Link from 'next/link';
import { useLanguage } from '../components/LanguageProvider';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import HumanEquationNav from '../components/HumanEquationNav';

const moduleOverview = [
  'Diagnostic baseline',
  'Parent call rehearsal',
  'Leadership simulation',
  'Urban student evidence',
  'Executive growth reporting',
];

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
              : 'A single front door to measure, rehearse, and track leadership performance under pressure.'}
          </p>
          <div className="button-row top-space-sm">
            <Link href="/human-equation-suite/dashboard" className="button primary">Enter Dashboard</Link>
            <Link href="/human-equation-suite/diagnostic" className="button secondary">Start Diagnostic</Link>
          </div>
          <div className="hes-suite-modules top-space-sm">
            {moduleOverview.map((item) => <span key={item} className="status-chip">{item}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}
