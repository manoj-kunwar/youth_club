'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Language, TranslationDictionary, translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (keyPath: string, fallback?: string) => string;
  dict: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'hsyc_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (savedLang === 'en' || savedLang === 'ne') {
        setLanguageState(savedLang);
        document.documentElement.lang = savedLang;
      } else {
        document.documentElement.lang = 'en';
      }
    } catch {
      // localStorage disabled / private mode
    }
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore storage error
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'ne' : 'en');
  }, [language, setLanguage]);

  const dict = useMemo(() => translations[language], [language]);

  /**
   * Type-safe nested key lookup, e.g. t('nav.home'), t('hero.titleStart')
   */
  const t = useCallback(
    (keyPath: string, fallback?: string): string => {
      const parts = keyPath.split('.');
      let current: any = translations[language];

      for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          // Fallback to english if missing in current language
          let enFallback: any = translations['en'];
          for (const p of parts) {
            if (enFallback && typeof enFallback === 'object' && p in enFallback) {
              enFallback = enFallback[p];
            } else {
              enFallback = undefined;
              break;
            }
          }
          return typeof enFallback === 'string' ? enFallback : (fallback ?? keyPath);
        }
      }

      return typeof current === 'string' ? current : (fallback ?? keyPath);
    },
    [language]
  );

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      dict,
    }),
    [language, setLanguage, toggleLanguage, t, dict]
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
