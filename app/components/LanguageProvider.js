'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { defaultLanguage, phraseTranslations, translations } from '../../lib/i18n/translations';

const STORAGE_KEY = 'rf_interface_language';
const ORIGINAL_TEXT = Symbol('originalText');

function translationLookupKey(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function restoreOrTranslateStaticText(root, language) {
  if (!root || typeof document === 'undefined') return;
  const dictionary = phraseTranslations[language] || {};
  const skipTags = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION', 'CODE', 'PRE']);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || skipTags.has(parent.tagName) || parent.closest('[data-no-translate]')) {
        return NodeFilter.FILTER_REJECT;
      }
      return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    if (node[ORIGINAL_TEXT] === undefined) node[ORIGINAL_TEXT] = node.nodeValue;
    const original = node[ORIGINAL_TEXT];
    if (language === defaultLanguage) {
      node.nodeValue = original;
      return;
    }
    const trimmed = translationLookupKey(original);
    const replacement = dictionary[trimmed];
    if (!replacement) {
      node.nodeValue = original;
      return;
    }
    const prefix = original.match(/^\s*/)?.[0] || '';
    const suffix = original.match(/\s*$/)?.[0] || '';
    node.nodeValue = `${prefix}${replacement}${suffix}`;
  });
}

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


  useEffect(() => {
    if (typeof document === 'undefined') return;
    const applyTranslations = () => restoreOrTranslateStaticText(document.body, normalizeLanguage(language));
    applyTranslations();
    const observer = new MutationObserver(() => applyTranslations());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
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
