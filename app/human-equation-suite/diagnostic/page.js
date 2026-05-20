'use client';

import { useLanguage } from '../../components/LanguageProvider';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

export default function HumanEquationDiagnosticPlaceholderPage() {
  const { language } = useLanguage();
  const es = language === 'es';
  return (
    <section className="section section-light">
      <div className="container">
        <LanguageSwitcher />
        <p className="eyebrow">Human Equation Suite</p>
        <h1>{es ? 'Diagnóstico de liderazgo' : 'Leadership Diagnostic'}</h1>
        <p className="lead">
          {es
            ? 'El Diagnóstico de Liderazgo estará disponible pronto. Este será el punto de inicio de tu perfil completo de Human Equation.'
            : 'The Leadership Diagnostic is coming soon. This will be the starting point for your full Human Equation profile.'}
        </p>
      </div>
    </section>
  );
}
