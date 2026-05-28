import HelpSidebar from './HelpSidebar';

export default function HelpSuiteShell({ children, currentStep = 'growth' }) {
  return (
    <div className="help-shell-layout">
      <details className="help-shell-mobile-toggle">
        <summary>Progression Flow</summary>
        <HelpSidebar currentStep={currentStep} />
      </details>
      <div className="help-shell-desktop">
        <HelpSidebar currentStep={currentStep} />
      </div>
      <div className="help-shell-content">{children}</div>
    </div>
  );
}
