'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { es, TranslationKey } from '@/locales/magic/es';
import { en } from '@/locales/magic/en';

type Language = 'es' | 'en';

interface TranslationParams {
  [key: string]: string | number;
}

interface MagicLanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
}

const MagicLanguageContext = createContext<MagicLanguageContextType | undefined>(undefined);

const translations = {
  es,
  en,
};

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template;

  let result = template;

  Object.entries(params).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, String(value));
  });

  const pluralRegex = /\{(\w+),\s*plural,\s*one\s*\{([^}]+)\}\s*other\s*\{([^}]+)\}\}/g;
  result = result.replace(pluralRegex, (match, countKey, singular, plural) => {
    const count = params[countKey];
    return typeof count === 'number' && count === 1 ? singular : plural;
  });

  return result;
}

export function MagicLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedLanguage = localStorage.getItem('magic-language') as Language;
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (isClient) {
      localStorage.setItem('magic-language', lang);
    }
  };

  const t = (key: TranslationKey, params?: TranslationParams): string => {
    const translation = translations[language][key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }
    return interpolate(translation, params);
  };

  return (
    <MagicLanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </MagicLanguageContext.Provider>
  );
}

export function useMagicLanguage() {
  const context = useContext(MagicLanguageContext);
  if (context === undefined) {
    throw new Error('useMagicLanguage must be used within a MagicLanguageProvider');
  }
  return context;
}
