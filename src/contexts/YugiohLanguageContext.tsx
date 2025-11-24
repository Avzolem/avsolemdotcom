'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { es, TranslationKey } from '@/locales/yugioh/es';
import { en } from '@/locales/yugioh/en';

type Language = 'es' | 'en';

interface TranslationParams {
  [key: string]: string | number;
}

interface YugiohLanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
}

const YugiohLanguageContext = createContext<YugiohLanguageContextType | undefined>(undefined);

const translations = {
  es,
  en,
};

// Simple interpolation function
function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template;

  let result = template;

  // Replace simple {key} placeholders
  Object.entries(params).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, String(value));
  });

  // Handle simple plural forms: {count, plural, one {singular} other {plural}}
  const pluralRegex = /\{(\w+),\s*plural,\s*one\s*\{([^}]+)\}\s*other\s*\{([^}]+)\}\}/g;
  result = result.replace(pluralRegex, (match, countKey, singular, plural) => {
    const count = params[countKey];
    return typeof count === 'number' && count === 1 ? singular : plural;
  });

  return result;
}

export function YugiohLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es'); // Default to Spanish
  const [isClient, setIsClient] = useState(false);

  // Initialize from localStorage on client
  useEffect(() => {
    setIsClient(true);
    const savedLanguage = localStorage.getItem('yugioh-language') as Language;
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (isClient) {
      localStorage.setItem('yugioh-language', lang);
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
    <YugiohLanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </YugiohLanguageContext.Provider>
  );
}

export function useYugiohLanguage() {
  const context = useContext(YugiohLanguageContext);
  if (context === undefined) {
    throw new Error('useYugiohLanguage must be used within a YugiohLanguageProvider');
  }
  return context;
}
