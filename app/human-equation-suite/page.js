'use client';

import Image from 'next/image';
import Link from 'next/link';
import HumanEquationShell from '../components/HumanEquationShell';

const pathwaySteps = [
  { title: '1. Diagnostic', detail: 'Establish your baseline pressure profile and identify your first growth edges.' },
  { title: '2. 8 Factors Course', detail: 'Learn the shared language behind leadership behavior under pressure.' },
  { title: '3. Practice Under Pressure', detail: 'Pressure-test decisions through realistic calls and simulations.' },
  { title: '4. Dashboard Review', detail: 'Review evidence patterns, distortions, and recovery signals across factors.' },
  { title: '5. Recovery Practice', detail: 'Strengthen repeatable moves that keep leadership clear, humane, and trusted.' },
];

const factors = [
  {
    name: 'Regulation Under Pressure',
    core: 'Stay paced, grounded, and clear when urgency rises.',
    color: 'var(--help-blue)',
    summary: 'This factor examines whether a leader can stay paced, grounded, and clear when urgency rises. It looks at how quickly tone, timing, and decision speed change under stress.',
  },
  {
    name: 'Human Awareness',
    core: 'Notice the human signal beneath behavior.',
    color: 'var(--help-teal)',
    summary: 'This factor focuses on what a leader notices first in people: emotion, threat, dignity, fear, context, or resistance. It helps distinguish behavior from the human signal underneath it.',
  },
  {
    name: 'Trust Construction',
    core: 'Build predictability and credibility when stakes rise.',
    color: 'var(--help-gold)',
    summary: 'This factor measures how predictable and credible a leader feels when stakes rise. Trust is built through visible reasoning, consistency, repair, and follow-through.',
  },
  { name: 'Reality Anchoring', core: 'Separate facts, fears, stories, and assumptions.', color: 'var(--help-coral)', summary: 'This factor examines whether a leader can separate facts, fears, stories, and assumptions when pressure makes one version of reality feel obvious.' },
  { name: 'Gray Area Leadership', core: 'Lead through competing truths and imperfect options.', color: 'var(--help-violet)', summary: 'This factor looks at how a leader handles competing truths, incomplete information, and decisions where fairness, humanity, policy, and timing all collide.' },
  { name: 'Team & Systems Leadership', core: 'Distribute leadership through people and routines.', color: 'var(--help-green)', summary: 'This factor examines whether leadership is distributed through people, routines, and systems — or whether too many problems depend on one person personally holding everything together.' },
  { name: 'Instructional & Academic Leadership', core: 'Protect learning conditions under pressure.', color: 'var(--help-gold)', summary: 'This factor focuses on how leaders protect learning conditions under pressure: rigor, support, teacher feedback, implementation, and instructional coherence.' },
  { name: 'Vision & Change Leadership', core: 'Make direction trustworthy during transition.', color: 'var(--help-coral)', summary: 'This factor examines whether people can trust the direction of change. It looks at how leaders create meaning, pace implementation, and protect morale during transition.' },
];

export default function HumanEquationSuitePage() {
  return (
    <HumanEquationShell activePath="Suite Home" showTopNav={false}>
        <section className="help-hero top-space-sm">
          <div className="help-hero-lines" aria-hidden="true" />
          <div className="help-logo-stage"><div className="help-logo-wrap"><Image src="/images/help-main-logo.png" alt="H.E.L.P. main brand logo" width={900} height={520} className="help-main-logo" priority /></div></div>
          <p className="eyebrow">H.E.L.P.</p>
          <h1>Human Equation Leadership Psychology</h1>
          <p className="help-tagline">See people. Solve problems. Lead with humanity.</p>
          <p className="lead">A pressure-practice leadership system that turns learning and simulations into dashboard evidence.</p>
          <div className="button-row top-space-sm help-hero-cta">
            <Link href="/human-equation-suite/diagnostic" className="button primary">Start the H.E.L.P. Path</Link>
            <Link href="/human-equation-suite/course" className="button secondary">Explore the 8 Factors Course</Link>
            <Link href="/human-equation-suite/dashboard" className="button tertiary">View Dashboard</Link>
          </div>
        </section>

        <section className="help-section">
          <h3>The 8 Factors</h3>
          <div className="help-factors top-space-sm">
            {factors.map((factor) => (
              <article key={factor.name} className="card help-factor" style={{ '--factor-color': factor.color }} tabIndex={0}>
                <h4>{factor.name}</h4>
                <p className="help-factor-core">{factor.core}</p>
                <p className="help-factor-summary">{factor.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="help-section help-pathway">
          <h3>Start Here: The H.E.L.P. Path</h3>
          <p className="top-space-sm">Each step adds evidence to the dashboard.</p>
          <div className="help-journey top-space-sm">
            {pathwaySteps.map((step, idx) => (
              <article key={step.title} className="card help-step"><span className="help-step-index">{idx + 1}</span><h4>{step.title.replace(/^\d+\.\s/, '')}</h4><p>{step.detail}</p></article>
            ))}
            <aside className="card help-path-note"><h4>Recommended starting point</h4><p>Begin with the Leadership Pressure Diagnostic to establish your baseline before course and simulation evidence begins to stack.</p></aside>
          </div>
          <div className="top-space-sm"><Link href="/human-equation-suite/diagnostic" className="button primary">Begin Diagnostic</Link></div>
        </section>

        <section className="help-section help-compact">
          <h3>What H.E.L.P. Means</h3>
          <div className="help-image-panel top-space-sm"><Image src="/images/help-definition.png" alt="H.E.L.P. definition: Human, Equation, Leadership, Psychology" width={1400} height={900} className="help-story-image" /></div>
        </section>

        <section className="help-section help-compact">
          <h3>Visual Identity</h3>
          <details className="help-visual-identity top-space-sm"><summary>View Color Psychology</summary><div className="help-image-panel top-space-sm"><Image src="/images/help-color-code.png" alt="H.E.L.P. color psychology code" width={1400} height={900} className="help-story-image" /></div></details>
        </section>

        <section className="help-final-cta">
          <h3>Start your leadership pressure profile.</h3>
          <p className="top-space-sm">H.E.L.P. is not a static personality test; it is a pressure-practice system that turns learning and simulations into dashboard evidence.</p>
          <div className="button-row center top-space-sm help-hero-cta">
            <Link href="/human-equation-suite/diagnostic" className="button primary">Start the H.E.L.P. Path</Link>
            <Link href="/human-equation-suite/course" className="button secondary">Explore Course</Link>
          </div>
        </section>
    </HumanEquationShell>
  );
}
