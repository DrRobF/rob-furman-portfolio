import Link from 'next/link';
import HelpSidebar from './HelpSidebar';

const areaTitles = {
  dashboard: 'Dashboard Evidence Profile',
  growth: 'Dashboard Evidence Profile',
  course: 'The 8 Factors Course',
  learn: 'The 8 Factors Course',
  diagnostic: 'Leadership Pressure Diagnostic',
  'parent-call': 'Parent Call Rehearsal',
  practice: 'Parent Call Rehearsal',
  'urban-student': 'Urban Student Simulation',
  'leadership-sim': 'Leadership Simulation',
  simulation: 'Leadership Simulation',
};

export default function HelpSuiteShell({ children, currentStep = 'growth', currentArea, title, showHeader = true, growthActions = [] }) {
  const activeArea = currentArea || currentStep;
  const pageTitle = title || areaTitles[activeArea] || 'Human Equation Suite';

  return (
    <>
      {showHeader ? (
        <div className="help-suite-page-header" aria-label="Current H.E.L.P. area">
          <div>
            <p className="help-suite-page-kicker">H.E.L.P.</p>
            <p className="help-suite-page-title">{pageTitle}</p>
          </div>
          <Link href="/human-equation-suite/dashboard" className="button secondary">Open Dashboard</Link>
        </div>
      ) : null}
      <div className="help-shell-layout">
      <details className="help-shell-mobile-toggle">
        <summary>H.E.L.P. Menu</summary>
        <HelpSidebar currentStep={currentStep} currentArea={activeArea} growthActions={growthActions} />
      </details>
      <div className="help-shell-desktop">
        <HelpSidebar currentStep={currentStep} currentArea={activeArea} growthActions={growthActions} />
      </div>
      <div className="help-shell-content">{children}</div>
      </div>
    </>
  );
}
