import Link from 'next/link';

const labels = {
  diagnostic: 'Start Here: Diagnostic',
  factors: 'Understand Your Factors',
  simulation: 'Practice Under Pressure',
  dashboard: 'Review Your Evidence',
};

const steps = [
  { key: 'diagnostic', href: '/human-equation-suite/diagnostic' },
  { key: 'factors', href: '/human-equation-suite/course' },
  { key: 'simulation', href: '/simulation-overview' },
  { key: 'dashboard', href: '/human-equation-suite/dashboard' },
];

export default function HelpJourneyNav({ currentStep, explanation, primaryAction, secondaryAction, showDashboardReturn = false }) {
  return (
    <section className="card help-journey-nav" aria-label="H.E.L.P. guided journey">
      <p className="eyebrow">H.E.L.P. Guided Journey</p>
      <h2>{labels[currentStep]}</h2>
      <p>{explanation}</p>
      <div className="help-journey-track" role="list">
        {steps.map((step, index) => {
          const status = step.key === currentStep ? 'current' : index < steps.findIndex((s) => s.key === currentStep) ? 'complete' : 'upcoming';
          return (
            <div key={step.key} role="listitem" className={`help-journey-step ${status}`}>
              <span>{index + 1}</span>
              <Link href={step.href}>{labels[step.key]}</Link>
            </div>
          );
        })}
      </div>
      <div className="button-row top-space-sm">
        <Link href={primaryAction.href} className="button primary">{primaryAction.label}</Link>
        {secondaryAction ? <Link href={secondaryAction.href} className="button secondary">{secondaryAction.label}</Link> : null}
        {showDashboardReturn && primaryAction.href !== '/human-equation-suite/dashboard' ? (
          <Link href="/human-equation-suite/dashboard" className="button tertiary">Return to Dashboard</Link>
        ) : null}
      </div>
    </section>
  );
}
