'use client';

import Image from 'next/image';
import Link from 'next/link';
import HumanEquationNav from '../components/HumanEquationNav';

const processSteps = [
  {
    title: '1. Take the Leadership Diagnostic',
    detail: 'Establish your baseline pressure profile and capture your current decision patterns under stress.',
  },
  {
    title: '2. Learn the 8 Factors',
    detail: 'Build the shared language for how leadership behaves under pressure and where breakdowns begin.',
  },
  {
    title: '3. Practice Under Pressure',
    detail: 'Use parent calls, leadership simulations, and student-perspective experiences to reveal live decision patterns.',
  },
  {
    title: '4. Build the Dashboard',
    detail: 'Every course module, diagnostic, and simulation adds evidence to your leadership profile.',
  },
  {
    title: '5. Strengthen Recovery',
    detail: 'Use the dashboard to identify pressure drift, growth targets, and recovery moves.',
  },
];

const modules = [
  {
    name: 'Leadership Diagnostic',
    what: 'Maps your baseline profile before and during training so you can see how pressure shapes your leadership defaults.',
    evidence: 'Baseline factor scores, pressure indicators, and early growth priorities.',
    cta: 'Take Diagnostic',
    href: '/human-equation-suite/diagnostic',
  },
  {
    name: '8 Factors Course',
    what: 'Teaches the core H.E.L.P. model with practical leadership psychology lessons tied to real decisions.',
    evidence: 'Factor mastery reflections, decision notes, and applied practice artifacts.',
    cta: 'Start Course',
    href: '/human-equation-suite/course',
  },
  {
    name: 'Parent Call Rehearsal',
    what: 'Lets you rehearse difficult family communication moments where tone, trust, and clarity are tested.',
    evidence: 'Communication choices, regulation responses, and trust construction signals.',
    cta: 'Enter Parent Call',
    href: '/human-equation',
  },
  {
    name: 'School Leadership Simulation',
    what: 'Places you in time-sensitive school leadership scenarios that require judgment across people and systems.',
    evidence: 'Priority decisions, systems thinking moves, and pressure-time tradeoff patterns.',
    cta: 'Run Leadership Sim',
    href: '/simulation-overview',
  },
  {
    name: 'Urban Student Perspective Simulation',
    what: 'Shifts perspective to the student experience to surface assumptions, empathy gaps, and equity implications.',
    evidence: 'Human awareness cues, perspective checks, and intervention quality indicators.',
    cta: 'Start Student Sim',
    href: '/day-in-the-life-urban-student',
  },
  {
    name: 'Master Dashboard',
    what: 'Unifies everything in one leadership profile so growth decisions are based on evidence, not memory.',
    evidence: 'Cross-module trends, recovery opportunities, and next-step coaching priorities.',
    cta: 'Open Dashboard',
    href: '/human-equation-suite/dashboard',
  },
];

const factors = [
  ['Regulation Under Pressure', 'Pressure changes your pace before it changes your words.', 'var(--help-blue)'],
  ['Human Awareness', 'Pressure changes what humans notice first.', 'var(--help-teal)'],
  ['Trust Construction', 'People trust what they can predict under pressure.', 'var(--help-gold)'],
  ['Reality Anchoring', 'Pressure makes stories feel like facts.', 'var(--help-coral)'],
  ['Gray Area Leadership', 'The hardest decisions usually contain more than one truth.', '#8ab5ff'],
  ['Team & Systems Leadership', 'If every problem needs you personally, the system is not holding.', '#53e3d0'],
  ['Instructional & Academic Leadership', 'Learning conditions are leadership conditions.', '#ffc56a'],
  ['Vision & Change Leadership', 'People follow change when purpose becomes trustworthy.', '#ff7a91'],
];

export default function HumanEquationSuitePage() {
  return (
    <section className="section help-page">
      <div className="container">
        <HumanEquationNav />

        <section className="help-hero top-space-sm">
          <div className="help-hero-lines" aria-hidden="true" />
          <div className="help-logo-wrap">
            <Image src="/images/help-main-logo.png" alt="H.E.L.P. main brand logo" width={900} height={520} className="help-main-logo" priority />
          </div>
          <p className="eyebrow">H.E.L.P. — Human Equation Leadership Psychology</p>
          <h1>Human Equation Leadership Psychology</h1>
          <p className="help-tagline">See people. Solve problems. Lead with humanity.</p>
          <p className="lead">A leadership operating system for the moments when pressure changes what people notice, trust, and do next.</p>
          <div className="button-row top-space-sm">
            <Link href="/human-equation-suite/dashboard" className="button primary">Enter Dashboard</Link>
            <Link href="/human-equation-suite/course" className="button secondary">Start the 8 Factors Course</Link>
            <Link href="/human-equation-suite/diagnostic" className="button secondary">Take Leadership Diagnostic</Link>
          </div>
        </section>

        <section className="help-section help-editorial">
          <h3>Why H.E.L.P. Exists</h3>
          <p>Most leadership failure does not happen because leaders lack values. It happens because pressure changes what people notice, how quickly they assign meaning, and how visible their reasoning becomes to others.</p>
          <p>This system helps leaders see those pressure patterns before trust, clarity, and human connection break down.</p>
        </section>

        <section className="help-section">
          <h3>What H.E.L.P. Means</h3>
          <p className="top-space-sm">H.E.L.P. gives leaders a shared language for reading people, problems, context, and pressure at the same time.</p>
          <div className="help-image-panel top-space-sm">
            <Image src="/images/help-definition.png" alt="H.E.L.P. definition: Human, Equation, Leadership, Psychology" width={1400} height={900} className="help-story-image" />
          </div>
        </section>

        <section className="help-section">
          <h3>Color Psychology and Visual Identity</h3>
          <div className="help-image-panel top-space-sm">
            <Image src="/images/help-color-code.png" alt="H.E.L.P. color psychology code" width={1400} height={900} className="help-story-image" />
          </div>
          <ul className="clean-list help-color-notes top-space-sm">
            <li><strong>Blue:</strong> trust, clarity, calm.</li>
            <li><strong>Teal/Green:</strong> balance, growth, empathy.</li>
            <li><strong>Gold:</strong> wisdom, confidence, judgment.</li>
            <li><strong>Coral/Red:</strong> courage, energy, action.</li>
          </ul>
        </section>

        <section className="help-section">
          <h3>How the Suite Works</h3>
          <p className="top-space-sm">Recommended path: <strong>Diagnostic → 8 Factors Course → Simulations → Dashboard Review.</strong> You can also start with the Course first if you want to learn the model before establishing your baseline.</p>
          <div className="help-process top-space-sm">
            {processSteps.map((step) => (
              <article key={step.title} className="card help-step"><h4>{step.title}</h4><p>{step.detail}</p></article>
            ))}
          </div>
        </section>

        <section className="help-section">
          <h3>Suite Modules</h3>
          <div className="card-grid top-space-sm">
            {modules.map((module) => (
              <article key={module.name} className="card help-module">
                <h4>{module.name}</h4>
                <p><strong>What it does:</strong> {module.what}</p>
                <p><strong>Evidence added:</strong> {module.evidence}</p>
                <Link href={module.href} className="text-link">{module.cta} →</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="help-section">
          <h3>The 8 Factors</h3>
          <div className="help-factors top-space-sm">
            {factors.map(([name, desc, color]) => (
              <article key={name} className="card help-factor" style={{ '--factor-color': color }}>
                <h4>{name}</h4><p>{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="help-section">
          <h3>Not a personality test. Not a PDF course. Not a generic simulation.</h3>
          <div className="card help-different top-space-sm">
            <p>H.E.L.P. combines course learning, diagnostic baseline, live pressure practice, behavioral evidence, dashboard intelligence, and recovery coaching into one leadership psychology system.</p>
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
