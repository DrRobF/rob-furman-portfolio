import HelpSidebar from './HelpSidebar';

export default function HelpSuiteShell({ children, currentStep = 'growth', currentArea }) {
  const activeArea = currentArea || currentStep;

  return (
    <div className="help-shell-layout">
      <details className="help-shell-mobile-toggle">
        <summary>H.E.L.P. Menu</summary>
        <HelpSidebar currentStep={currentStep} currentArea={activeArea} />
      </details>
      <div className="help-shell-desktop">
        <HelpSidebar currentStep={currentStep} currentArea={activeArea} />
      </div>
      <div className="help-shell-content">{children}</div>
    </div>
  );
}
