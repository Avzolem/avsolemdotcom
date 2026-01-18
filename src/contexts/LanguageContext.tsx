'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Import translations
import { en } from '@/locales/portfolio/en';
import { es } from '@/locales/portfolio/es';

const translations: Record<Language, Record<string, string>> = { en, es };

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
}

export function LanguageProvider({
  children,
  defaultLanguage = 'en',
  storageKey = 'portfolio-language',
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  // Translation function
  const t = useCallback((key: string): string => {
    const translation = translations[language]?.[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation;
  }, [language]);

  // Set language and persist
  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, newLanguage);
    }
  }, [storageKey]);

  // Initialize language from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Language | null;
    if (stored && (stored === 'en' || stored === 'es')) {
      setLanguageState(stored);
    }
    setMounted(true);
  }, [storageKey]);

  // Prevent flash by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
