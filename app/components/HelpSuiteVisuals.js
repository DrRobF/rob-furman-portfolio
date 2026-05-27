export function HelpSuiteShell({ className = '', children }) {
  return <div className={className}>{children}</div>;
}

export function HelpHeroPanel({ className = '', children }) {
  return <section className={className}>{children}</section>;
}

export function HelpCard({ className = '', children, as: Component = 'div' }) {
  return <Component className={className}>{children}</Component>;
}

export function HelpButton({ className = '', children, as: Component = 'button', ...props }) {
  return <Component className={className} {...props}>{children}</Component>;
}

export function HelpSubnav({ className = '', children }) {
  return <p className={className}>{children}</p>;
}

export function HelpSection({ className = '', children }) {
  return <section className={className}>{children}</section>;
}

export function HelpReadingPanel({ className = '', children }) {
  return <aside className={className}>{children}</aside>;
}
