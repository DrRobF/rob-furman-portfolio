'use client';

import Link from 'next/link';
import { useLanguage } from '../components/LanguageProvider';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

const pathwayStepsEn = [
  {
    title: '1. Leadership Diagnostic',
    detail:
      'Discover your leadership pressure patterns before entering the simulations.',
  },
  {
    title: '2. Parent Call Rehearsal',
    detail:
      'Practice emotionally realistic parent conversations with live AI voice and post-call coaching.',
  },
  {
    title: '3. School Leadership Simulation',
    detail:
      'Move through a pressure-filled school day and see how your decisions shape trust, safety, and follow-through.',
  },
  {
    title: '4. Urban Student Perspective Simulation',
    detail:
      'Experience school through a student’s day and reflect on empathy, systems, and leadership decisions.',
  },
  {
    title: '5. Master Human Equation Report',
    detail:
      'Combine quiz results, simulation performance, and reflection notes into a full leadership growth profile.',
  },
];

const simulationCardsEn = [
  {
    title: 'Leadership Diagnostic',
    description: 'Begin with the full pathway entry point and profile baseline.',
    href: '/human-equation-suite/diagnostic',
    linkText: 'Start Diagnostic →',
  },
  {
    title: 'Parent Call Rehearsal',
    description:
      'Rehearse difficult parent conversations with realistic AI interaction and coaching.',
    href: '/human-equation',
    linkText: 'Open Parent Call Rehearsal →',
  },
  {
    title: 'School Leadership Simulation',
    description:
      'Step into a school leadership scenario where each decision changes outcomes.',
    href: '/simulation-overview',
    linkText: 'Launch School Leadership Simulation →',
  },
  {
    title: 'Urban Student Perspective Simulation',
    description:
      'Experience student realities and reflect on system-level leadership implications.',
    href: '/day-in-the-life-urban-student',
    linkText: 'Launch Urban Student Perspective →',
  },
];

export default function HumanEquationSuitePage() {
  const { language } = useLanguage();
  const es = language === 'es';
  const copy = es
    ? {
      title: 'The Human Equation', subtitle: 'Ensayo de liderazgo con IA para los momentos que ponen a prueba el juicio, la confianza y el control emocional.',
      body: 'The Human Equation ayuda a líderes escolares a practicar el lado humano del liderazgo: conversaciones difíciles con familias, decisiones bajo presión, perspectiva estudiantil y crecimiento reflexivo. Comienza con el Diagnóstico de Liderazgo para la ruta completa o entra directamente a cualquier simulación.',
      startDiagnostic: 'Iniciar diagnóstico de liderazgo', trySim: 'Probar una simulación', recommended: 'Ruta recomendada', jump: 'Entrar directamente a la suite',
      eyebrow: 'Human Equation Suite'
    }
    : {
      title: 'The Human Equation', subtitle: 'AI-powered leadership rehearsal for the moments that test judgment, trust, and emotional control.',
      body: 'The Human Equation helps school leaders practice the human side of leadership: difficult parent conversations, pressure-filled decisions, student-centered perspective, and reflective growth. Start with the Leadership Diagnostic for the full pathway, or jump directly into any simulation.',
      startDiagnostic: 'Start the Leadership Diagnostic', trySim: 'Try a Simulation', recommended: 'Recommended Path', jump: 'Jump Directly into the Suite',
      eyebrow: 'Human Equation Suite'
    };
  const pathwaySteps = es ? [
    { title: '1. Diagnóstico de liderazgo', detail: 'Descubre tus patrones de presión de liderazgo antes de entrar en las simulaciones.' },
    { title: '2. Ensayo de llamada con familia', detail: 'Practica conversaciones familiares emocionalmente realistas con voz de IA en vivo y coaching posterior.' },
    { title: '3. Simulación de liderazgo escolar', detail: 'Recorre un día escolar bajo presión y observa cómo tus decisiones moldean confianza, seguridad y seguimiento.' },
    { title: '4. Simulación de perspectiva estudiantil urbana', detail: 'Vive la escuela desde el día de un estudiante y reflexiona sobre empatía, sistemas y decisiones de liderazgo.' },
    { title: '5. Informe maestro de Human Equation', detail: 'Combina resultados, desempeño y notas de reflexión en un perfil completo de crecimiento.' },
  ] : pathwayStepsEn;
  const simulationCards = es ? [
    { title: 'Diagnóstico de liderazgo', description: 'Empieza por la entrada principal de la ruta y establece tu línea base.', href: '/human-equation-suite/diagnostic', linkText: 'Iniciar diagnóstico →' },
    { title: 'Ensayo de llamada con familia', description: 'Ensaya conversaciones difíciles con interacción realista de IA y coaching.', href: '/human-equation', linkText: 'Abrir ensayo de llamada →' },
    { title: 'Simulación de liderazgo escolar', description: 'Entra en un escenario escolar donde cada decisión cambia resultados.', href: '/simulation-overview', linkText: 'Iniciar simulación escolar →' },
    { title: 'Simulación de perspectiva estudiantil urbana', description: 'Experimenta realidades estudiantiles y reflexiona sobre implicaciones sistémicas.', href: '/day-in-the-life-urban-student', linkText: 'Iniciar perspectiva estudiantil →' },
  ] : simulationCardsEn;
  return (
    <section className="section section-light">
      <div className="container">
        <LanguageSwitcher />
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p className="lead">{copy.subtitle}</p>
        <p>{copy.body}</p>

        <div className="button-row top-space-sm">
          <Link href="/human-equation-suite/diagnostic" className="button primary">
            {copy.startDiagnostic}
          </Link>
          <Link href="#suite-simulations" className="button secondary">
            {copy.trySim}
          </Link>
        </div>
      </div>

      <div className="container top-space">
        <div className="card project-card">
          <h2>{copy.recommended}</h2>
          <p>
            Start with the diagnostic to establish your profile, then progress through rehearsal,
            school-day leadership scenarios, and student perspective before reviewing your full
            growth report.
          </p>
          <div className="card-grid top-space-sm">
            {pathwaySteps.map((step) => (
              <article key={step.title} className="card card-featured equal-card">
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="container top-space" id="suite-simulations">
        <h2>{copy.jump}</h2>
        <div className="card-grid">
          {simulationCards.map((card) => (
            <article key={card.title} className="card project-card equal-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <Link href={card.href} className="text-link">
                {card.linkText}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
