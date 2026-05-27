'use client';

import Link from 'next/link';
import HumanEquationNav from '../components/HumanEquationNav';

const meaningCards = [
  {
    title: 'Human',
    description: 'People at the center of every decision.',
    accent: 'var(--help-blue)',
    icon: '●',
  },
  {
    title: 'Equation',
    description: 'Balancing logic, emotion, and context.',
    accent: 'var(--help-teal)',
    icon: '≡',
  },
  {
    title: 'Leadership',
    description: 'Guiding with clarity, courage, and conviction.',
    accent: 'var(--help-gold)',
    icon: '↗',
  },
  {
    title: 'Psychology',
    description: 'Understanding the human behavior behind every moment.',
    accent: 'var(--help-coral)',
    icon: '◔',
  },
];

const steps = [
  ['Step 1 — Learn the 8 Factors', 'Build the shared language for how leadership behaves under pressure.'],
  ['Step 2 — Take the Diagnostic', 'Create a baseline profile of how you believe you lead under stress.'],
  ['Step 3 — Practice Under Pressure', 'Use simulations and rehearsals to reveal what happens when conflict, urgency, and ambiguity rise.'],
  ['Step 4 — Build the Dashboard', 'Every course module, diagnostic, and simulation adds evidence to your leadership profile.'],
  ['Step 5 — Strengthen Recovery', 'Use the dashboard to identify pressure drift, growth targets, and recovery moves.'],
];

const modules = [
  ['8 Factors Course', 'Build leadership language and decision patterns under pressure.', 'Factor mastery, reflection notes, and growth priorities.', '/human-equation-suite/course'],
  ['Leadership Diagnostic', 'Capture your baseline profile before or during training.', 'Self-perception data across all 8 factors.', '/human-equation-suite/diagnostic'],
  ['Parent Call Rehearsal', 'Practice difficult communication with families in realistic conditions.', 'Communication choices, regulation patterns, and trust signals.', '/human-equation'],
  ['School Leadership Simulation', 'Lead through time-sensitive school decisions and conflict.', 'Judgment evidence, systems decisions, and pressure responses.', '/simulation-overview'],
  ['Urban Student Perspective Simulation', 'Examine school decisions through a student-centered lens.', 'Human-awareness evidence and equity-centered reflection.', '/day-in-the-life-urban-student'],
  ['Master Dashboard', 'See all evidence in one leadership pressure profile.', 'Trends, recovery moves, and next practice targets.', '/human-equation-suite/dashboard'],
];

const factors = [
  ['Regulation Under Pressure', 'Pressure changes your pace before it changes your words.'],
  ['Human Awareness', 'Pressure changes what humans notice first.'],
  ['Trust Construction', 'People trust what they can predict under pressure.'],
  ['Reality Anchoring', 'Pressure makes stories feel like facts.'],
  ['Gray Area Leadership', 'The hardest decisions usually contain more than one truth.'],
  ['Team & Systems Leadership', 'If every problem needs you personally, the system is not holding.'],
  ['Instructional & Academic Leadership', 'Learning conditions are leadership conditions.'],
  ['Vision & Change Leadership', 'People follow change when purpose becomes trustworthy.'],
];

export default function HumanEquationSuitePage() {
  return (
    <section className="section help-page">
      <div className="container">
        <HumanEquationNav />

        <section className="help-hero top-space-sm">
          <div className="help-brand-mark" aria-hidden="true">
            <span className="dot blue" />
            <span className="dot teal" />
            <span className="dot gold" />
            <span className="dot coral" />
            <div className="core">H</div>
          </div>
          <p className="eyebrow">Human Equation Leadership Suite</p>
          <h1>H.E.L.P.</h1>
          <h2>Human Equation Leadership Psychology</h2>
          <p className="lead">A leadership operating system for the moments when pressure changes what people notice, trust, and do next.</p>
          <p className="help-tagline">See people. Solve problems. Lead with humanity.</p>
          <div className="button-row top-space-sm">
            <Link href="/human-equation-suite/dashboard" className="button primary">Enter Dashboard</Link>
            <Link href="/human-equation-suite/course" className="button secondary">Start the 8 Factors Course</Link>
            <Link href="/human-equation-suite/diagnostic" className="button secondary">Take Leadership Diagnostic</Link>
          </div>
        </section>

        <section className="help-section">
          <h3>What H.E.L.P. Means</h3>
          <div className="card-grid four-up top-space-sm">
            {meaningCards.map((card) => (
              <article key={card.title} className="card help-card">
                <div className="help-icon" style={{ color: card.accent }}>{card.icon}</div>
                <h4>{card.title}</h4>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="help-section">
          <h3>How the Suite Works</h3>
          <div className="help-process top-space-sm">
            {steps.map(([title, detail]) => (
              <article key={title} className="card help-step"><h4>{title}</h4><p>{detail}</p></article>
            ))}
          </div>
          <div className="button-row top-space-sm">
            <Link href="/human-equation-suite/dashboard" className="button primary">Open Dashboard</Link>
          </div>
        </section>

        <section className="help-section">
          <h3>Suite Modules</h3>
          <div className="card-grid top-space-sm">
            {modules.map(([name, what, evidence, href]) => (
              <article key={name} className="card help-module">
                <h4>{name}</h4>
                <p><strong>What it does:</strong> {what}</p>
                <p><strong>Evidence added:</strong> {evidence}</p>
                <Link href={href} className="text-link">Go next →</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="help-section">
          <h3>The 8 Factors</h3>
          <div className="card-grid two-up top-space-sm">
            {factors.map(([name, desc]) => <article key={name} className="card help-factor"><h4>{name}</h4><p>{desc}</p></article>)}
          </div>
        </section>

        <section className="help-section">
          <h3>Why This Is Different</h3>
          <div className="card help-different top-space-sm">
            <p>This is not a personality test. This is not a PDF course. This is not a generic simulation.</p>
            <p>H.E.L.P. combines course learning, diagnostic baseline, live pressure practice, behavioral evidence, a leadership psychology dashboard, and recovery coaching in one operating system.</p>
          </div>
        </section>

        <section className="help-final-cta">
          <h3>Build your leadership pressure profile.</h3>
          <div className="button-row center top-space-sm">
            <Link href="/human-equation-suite/dashboard" className="button primary">Enter Dashboard</Link>
            <Link href="/human-equation-suite/course" className="button secondary">Start Course</Link>
            <Link href="/human-equation-suite/diagnostic" className="button secondary">Take Diagnostic</Link>
          </div>
        </section>
      </div>
    </section>
  );
}
