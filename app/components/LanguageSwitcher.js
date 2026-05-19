'use client';

import { useLanguage } from './LanguageProvider';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div aria-label={t('language.interface')}>
      <button type="button" onClick={() => setLanguage('en')} aria-pressed={language === 'en'}>
        {t('language.english')}
      </button>
      {' | '}
      <button type="button" onClick={() => setLanguage('es')} aria-pressed={language === 'es'}>
        {t('language.spanish')}
      </button>
    </div>
  );
}
