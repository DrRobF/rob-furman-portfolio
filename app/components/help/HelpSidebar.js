import Link from 'next/link';

const insights = [
  'Pressure narrows perception before it narrows decision-making.',
  'Avoidance can feel calm in the moment and expensive later.',
  'Regulation is not softness; it is access to better judgment.',
  'Under pressure, leaders do not just make decisions. They reveal patterns.',
  'The first job of leadership pressure is to stay anchored to reality.',
  'Evidence grows when reflection follows pressure.',
];

const sections = [
  {
    title: 'Foundation',
    items: [
      { key: 'course', label: '8 Factors Course', href: '/human-equation-suite/course', areas: ['course', 'learn'] },
      { key: 'diagnostic', label: 'Leadership Diagnostic', href: '/human-equation-suite/diagnostic', areas: ['diagnostic'] },
      { key: 'dashboard', label: 'Dashboard Evidence Profile', href: '/human-equation-suite/dashboard', areas: ['dashboard', 'growth'] },
    ],
  },
  {
    title: 'Practice Labs',
    items: [
      { key: 'parent-call', label: 'Parent Call Rehearsal', href: '/human-equation-suite/parent-call', areas: ['parent-call', 'practice'] },
      { key: 'urban-student', label: 'Urban Student Simulation', href: '/human-equation-suite/urban-student-sim', areas: ['urban-student'] },
      { key: 'leadership-sim', label: 'Leadership Simulation', href: '/human-equation-suite/leadership-sim', areas: ['leadership-sim', 'simulation'] },
    ],
  },
  {
    title: 'Growth Center',
    items: [
      { key: 'pressure-distortions', label: 'Pressure Distortions', comingSoon: true },
      { key: 'recovery-practices', label: 'Recovery Practices', comingSoon: true },
      { key: 'evidence-timeline', label: 'Evidence Timeline', comingSoon: true },
      { key: 'executive-reports', label: 'Executive Reports', comingSoon: true },
    ],
  },
];

function isActive(item, currentArea) {
  return item.areas?.includes(currentArea) || item.key === currentArea;
}

export default function HelpSidebar({ currentStep = 'growth', currentArea, growthActions = [] }) {
  const activeArea = currentArea || currentStep;
  const insight = insights[Math.abs(activeArea.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % insights.length];

  return (
    <aside className="help-shell-sidebar" aria-label="H.E.L.P. progression navigation">
      <div className="help-sidebar-panel">
        <p className="eyebrow">H.E.L.P. Progression</p>
        <div className="help-sidebar-sections">
          {sections.map((section) => (
            <section key={section.title} className="help-sidebar-section">
              <h3>{section.title}</h3>
              <div className="help-sidebar-links">
                {section.title === 'Growth Center' && growthActions.length ? growthActions.map((action) => (
                  <button
                    key={action.key}
                    type="button"
                    className={`help-sidebar-link help-sidebar-button ${action.active ? 'active' : ''}`}
                    aria-pressed={action.active}
                    onClick={action.onClick}
                  >
                    <span>{action.label}</span>
                  </button>
                )) : section.items.map((item) => {
                  const active = isActive(item, activeArea);
                  if (item.comingSoon) {
                    return (
                      <div key={item.key} className="help-sidebar-link muted" aria-disabled="true">
                        <span>{item.label}</span>
                        <small>Coming Soon</small>
                      </div>
                    );
                  }
                  return (
                    <Link key={item.key} href={item.href} className={`help-sidebar-link ${active ? 'active' : ''}`} aria-current={active ? 'page' : undefined}>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
      <div className="help-sidebar-signal">
        <h3>Leadership Signal</h3>
        <p>{insight}</p>
        <Link href="/human-equation-suite/dashboard" className="button tertiary">Review Dashboard</Link>
      </div>
    </aside>
  );
}
