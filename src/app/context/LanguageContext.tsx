'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { loadMessages, type Locale, defaultLocale, locales } from '@/i18n';

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  if (!source) return target;
  if (!target) return source;

  if (typeof source !== 'object' || Array.isArray(source)) {
    return source;
  }

  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        );
      } else {
        result[key] = sourceValue;
      }
    }
  }

  return result;
}

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  messages: Record<string, unknown>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load locale from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('locale');
    if (stored && (locales as string[]).includes(stored)) {
      setLocaleState(stored as Locale);
    }
  }, []);

  // Load messages when locale changes
  useEffect(() => {
    setIsLoading(true);
    const load = async () => {
      try {
        const englishMessages = await loadMessages('en');

        if (locale === 'en') {
          setMessages(englishMessages);
        } else {
          try {
            const localeMessages = await loadMessages(locale);
            setMessages(deepMerge(englishMessages, localeMessages));
          } catch {
            setMessages(englishMessages);
          }
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
        setMessages({});
      }
      setIsLoading(false);
    };

    load();
  }, [locale]);

  const setLocale = async (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, messages }}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        onError={(error) => {
          if (error.code === 'MISSING_MESSAGE') {
            // Silently handle — English fallback covers most cases
          }
        }}
        getMessageFallback={({ key }) => key}
      >
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}
