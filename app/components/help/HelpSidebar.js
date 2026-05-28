import Link from 'next/link';

const insights = [
  'Pressure narrows perception before it narrows decision-making.',
  'Avoidance can feel calm in the moment and expensive later.',
  'Regulation is not softness; it is access to better judgment.',
  'Under pressure, leaders do not just make decisions. They reveal patterns.',
  'The first job of leadership pressure is to stay anchored to reality.',
];

const flow = [
  { key: 'learn', title: 'Learn the 8 Factors', description: 'Build a shared language for leadership psychology.' },
  { key: 'diagnostic', title: 'Leadership Diagnostic', description: 'Establish self-report baseline and early profile signal.' },
  { key: 'practice', title: 'Practice Lab', description: 'Add behavioral evidence through simulations.' },
  { key: 'growth', title: 'Growth Center', description: 'Translate patterns into recovery and growth moves.' },
];

function getStatus(stepKey, currentStep) {
  if (stepKey === 'learn') return 'Complete';
  if (stepKey === 'diagnostic') return currentStep === 'diagnostic' ? 'Start' : 'Complete';
  if (stepKey === 'practice') return 'Upcoming';
  return 'Active';
}

export default function HelpSidebar({ currentStep = 'growth' }) {
  const insight = insights[Math.abs(currentStep.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % insights.length];
  return (
    <aside className="help-shell-sidebar">
      <div className="help-sidebar-panel">
        <p className="eyebrow">Progression Flow</p>
        <div className="help-sidebar-flow">
          {flow.map((item, idx) => (
            <article key={item.key} className="help-sidebar-flow-item">
              <div className="help-sidebar-flow-head">
                <span>{idx + 1}</span>
                <h3>{item.title}</h3>
              </div>
              <small>{getStatus(item.key, currentStep)}</small>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="help-sidebar-signal">
        <h3>Leadership Signal</h3>
        <p>{insight}</p>
        <Link href="/human-equation-suite/dashboard" className="button tertiary">Review Evidence</Link>
      </div>
    </aside>
  );
}
