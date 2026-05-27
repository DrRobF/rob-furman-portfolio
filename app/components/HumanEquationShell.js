'use client';

import Link from 'next/link';
import HumanEquationNav from './HumanEquationNav';

export default function HumanEquationShell({ title, intro, children, heroActions, activePath, showTopNav = true, footerNote = 'See people. Solve problems. Lead with humanity.' }) {
  return (
    <section className="section help-suite-shell help-shell">
      <div className="container help-suite-container">
        {showTopNav ? <HumanEquationNav /> : null}
        <div className="help-subnav">
          <span className="help-mini-brand">H.E.L.P.</span>
          <span className="help-current-path">{activePath || 'Human Equation Suite'}</span>
          <Link href="/human-equation-suite/dashboard" className="button secondary">Open Dashboard</Link>
        </div>
        {(title || intro || heroActions) && (
          <header className="help-hero-panel help-dark-panel top-space-sm">
            {title && <h1>{title}</h1>}
            {intro && <p className="lead">{intro}</p>}
            {heroActions && <div className="button-row top-space-sm">{heroActions}</div>}
          </header>
        )}
        {children}
        <footer className="help-suite-footer">
          <p>{footerNote}</p>
        </footer>
      </div>
    </section>
  );
}
