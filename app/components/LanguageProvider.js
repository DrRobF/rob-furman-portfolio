'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultLanguage, translations } from '../../lib/i18n/translations';

const STORAGE_KEY = 'rf_interface_language';

const LanguageContext = createContext({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }) {
  const normalizeLanguage = (value) => (typeof value === 'string' && translations[value] ? value : defaultLanguage);
  const [language, setLanguageState] = useState(defaultLanguage);

  const setLanguage = (value) => {
    setLanguageState(normalizeLanguage(value));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
    setLanguageState(normalizeLanguage(savedLanguage));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, normalizeLanguage(language));
  }, [language]);

  const value = useMemo(() => ({
    language: normalizeLanguage(language),
    setLanguage,
    t: (key) => translations[normalizeLanguage(language)]?.[key] ?? translations[defaultLanguage]?.[key] ?? key,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
