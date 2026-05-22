'use client';

import Link from 'next/link';
import { useLanguage } from '../components/LanguageProvider';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import HumanEquationNav from '../components/HumanEquationNav';

const moduleCards = [
  { title: 'Leadership Diagnostic', description: 'Create your pressure-profile baseline and unlock your initial dashboard profile.', href: '/human-equation-suite/diagnostic', cta: 'Start Diagnostic →' },
  { title: 'Parent Call Rehearsal', description: 'Practice high-stakes parent calls with real-time AI voice and coaching.', href: '/human-equation', cta: 'Launch Parent Call →' },
  { title: 'Leadership Simulation', description: 'Run a pressure-filled school leadership day and capture behavioral evidence.', href: '/simulation-overview', cta: 'Launch Leadership Sim →' },
  { title: 'Urban Student Perspective', description: 'Experience school from a student lens and surface empathy and systems evidence.', href: '/day-in-the-life-urban-student', cta: 'Launch Urban Sim →' },
];

export default function HumanEquationSuitePage() {
  const { language } = useLanguage();
  const isEs = (language || 'en') === 'es';
  return (
    <section className="section section-light">
      <div className="container">
        <LanguageSwitcher />
        <HumanEquationNav />

        <div className="dashboard-shell top-space-sm">
          <p className="eyebrow">Human Equation Suite</p>
          <h1>{isEs ? 'Suite Human Equation' : 'Human Equation Suite'}</h1>
          <p className="lead">{isEs ? 'Una entrada unificada para diagnóstico, simulaciones y crecimiento de liderazgo.' : 'One front door for diagnostic, simulation evidence, and executive leadership growth reporting.'}</p>

          <article className="card leadership-snapshot top-space-sm">
            <h2>Start Here</h2>
            <p><strong>1.</strong> Open Dashboard to view your current profile.</p>
            <p><strong>2.</strong> Start Diagnostic to establish baseline confidence.</p>
            <p><strong>3.</strong> Launch simulations from Dashboard to build evidence.</p>
            <div className="button-row top-space-sm">
              <Link href="/human-equation-suite/dashboard" className="button primary">Open Dashboard</Link>
              <Link href="/human-equation-suite/diagnostic" className="button secondary">Start Diagnostic</Link>
            </div>
          </article>

          <div className="card-grid top-space-sm">
            {moduleCards.map((card) => (
              <article key={card.title} className="card project-card equal-card">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <Link href={card.href} className="text-link">{card.cta}</Link>
              </article>
            ))}
          </div>

          <article className="card report-panel top-space">
            <h2>Ready to track growth across every evidence source?</h2>
            <p>Use the Dashboard as your command center for profile shifts, report tabs, and trend tracking.</p>
            <div className="button-row top-space-sm"><Link href="/human-equation-suite/dashboard" className="button primary">Go to Dashboard</Link></div>
          </article>
        </div>
      </div>
    </section>
  );
}
