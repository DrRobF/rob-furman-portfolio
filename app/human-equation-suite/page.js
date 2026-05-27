'use client';

import Image from 'next/image';
import Link from 'next/link';
import HumanEquationNav from '../components/HumanEquationNav';

const pathwaySteps = [
  {
    title: '1. Diagnostic',
    detail: 'Find your current pressure baseline.',
  },
  {
    title: '2. 8 Factors Course',
    detail: 'Learn the leadership psychology language behind the system.',
  },
  {
    title: '3. Practice Under Pressure',
    detail: 'Use parent calls and simulations to reveal real-time decision patterns.',
  },
  {
    title: '4. Dashboard Review',
    detail: 'See your evidence-based leadership pressure profile.',
  },
  {
    title: '5. Recovery Practice',
    detail: 'Strengthen the moves that help others experience you as clear, steady, and trustworthy.',
  },
];

const evidenceBuilders = [
  {
    name: 'Diagnostic',
    contribution: 'Self-perception baseline.',
    cta: 'Take Diagnostic',
    href: '/human-equation-suite/diagnostic',
  },
  {
    name: '8 Factors Course',
    contribution: 'Learning and reflection evidence.',
    cta: 'Start Course',
    href: '/human-equation-suite/course',
  },
  {
    name: 'Parent Call Rehearsal',
    contribution: 'Communication under emotional pressure.',
    cta: 'Enter Parent Call',
    href: '/human-equation',
  },
  {
    name: 'Leadership Simulation',
    contribution: 'Decision-making under school urgency.',
    cta: 'Run Leadership Sim',
    href: '/simulation-overview',
  },
  {
    name: 'Urban Student Simulation',
    contribution: 'Perspective-taking and assumption checking.',
    cta: 'Start Student Sim',
    href: '/day-in-the-life-urban-student',
  },
  {
    name: 'Dashboard',
    contribution: 'Synthesis and recovery planning.',
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
          <p className="eyebrow">H.E.L.P.</p>
          <h1>Human Equation Leadership Psychology</h1>
          <p className="help-tagline">See people. Solve problems. Lead with humanity.</p>
          <p className="lead">A leadership operating system for the moments when pressure changes what people notice, trust, and do next.</p>
          <p className="help-new-note">If you are new, start with the H.E.L.P. Path.</p>
          <div className="button-row top-space-sm help-hero-cta">
            <Link href="/human-equation-suite/diagnostic" className="button primary">Start the H.E.L.P. Path</Link>
            <Link href="/human-equation-suite/dashboard" className="button tertiary">View Dashboard</Link>
            <Link href="/human-equation-suite/course" className="button tertiary">Explore the Course</Link>
          </div>
        </section>

        <section className="help-section help-pathway">
          <h3>Start Here: The H.E.L.P. Path</h3>
          <div className="help-process top-space-sm">
            {pathwaySteps.map((step) => (
              <article key={step.title} className="card help-step"><h4>{step.title}</h4><p>{step.detail}</p></article>
            ))}
          </div>
          <div className="top-space-sm">
            <Link href="/human-equation-suite/diagnostic" className="button primary">Start with Diagnostic</Link>
          </div>
        </section>

        <section className="help-section help-compact">
          <h3>What H.E.L.P. Means</h3>
          <div className="help-image-panel top-space-sm">
            <Image src="/images/help-definition.png" alt="H.E.L.P. definition: Human, Equation, Leadership, Psychology" width={1400} height={900} className="help-story-image" />
          </div>
          <ul className="clean-list help-definition-points top-space-sm">
            <li><strong>Human</strong> keeps people at the center.</li>
            <li><strong>Equation</strong> balances logic, emotion, and context.</li>
            <li><strong>Leadership</strong> turns clarity into action.</li>
            <li><strong>Psychology</strong> helps leaders understand what pressure does to behavior.</li>
          </ul>
        </section>

        <section className="help-section">
          <h3>Evidence Builders</h3>
          <p className="top-space-sm">Each module contributes evidence that strengthens your leadership pressure profile in the dashboard.</p>
          <div className="card-grid top-space-sm">
            {evidenceBuilders.map((module) => (
              <article key={module.name} className="card help-module slim">
                <h4>{module.name}</h4>
                <p>{module.contribution}</p>
                <Link href={module.href} className="text-link">{module.cta} →</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="help-section">
          <h3>The 8 Factors</h3>
          <div className="help-factors compact top-space-sm">
            {factors.map(([name, desc, color]) => (
              <article key={name} className="card help-factor" style={{ '--factor-color': color }}>
                <h4>{name}</h4><p>{desc}</p>
              </article>
            ))}
          </div>
          <div className="top-space-sm">
            <Link href="/human-equation-suite/course" className="button secondary">Start the 8 Factors Course</Link>
          </div>
        </section>

        <section className="help-section">
          <h3>Dashboard Review</h3>
          <div className="card help-different top-space-sm">
            <p>The dashboard becomes most useful after you complete at least one evidence source.</p>
            <p>Your dashboard is the home base for evidence, growth patterns, and recovery moves. Start with the diagnostic or course to activate it.</p>
          </div>
        </section>

        <section className="help-section">
          <h3>Not a personality test. A pressure practice system.</h3>
          <div className="card help-different top-space-sm">
            <p>H.E.L.P. does not label leaders and stop there. It teaches the model, captures a baseline, places leaders in realistic pressure moments, and turns those experiences into dashboard evidence and recovery practice.</p>
          </div>
        </section>

        <section className="help-section help-compact">
          <h3>Visual Identity</h3>
          <details className="help-visual-identity top-space-sm">
            <summary>View Color Psychology</summary>
            <div className="help-image-panel top-space-sm">
              <Image src="/images/help-color-code.png" alt="H.E.L.P. color psychology code" width={1400} height={900} className="help-story-image" />
            </div>
          </details>
        </section>

        <section className="help-final-cta">
          <h3>Ready to build your pressure profile?</h3>
          <div className="button-row center top-space-sm help-hero-cta">
            <Link href="/human-equation-suite/diagnostic" className="button primary">Start the H.E.L.P. Path</Link>
            <Link href="/human-equation-suite/dashboard" className="button tertiary">Open Dashboard</Link>
          </div>
        </section>
      </div>
    </section>
  );
}
