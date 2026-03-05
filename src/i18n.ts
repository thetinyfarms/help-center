export const localeConfig = {
  en: { name: 'English' },
  de: { name: 'Deutsch' },
  nl: { name: 'Nederlands' },
  lt: { name: 'Lietuvių' },
  da: { name: 'Dansk' },
  hr: { name: 'Hrvatski' },
  mt: { name: 'Malti' },
} as const;

export const locales = Object.keys(localeConfig) as (keyof typeof localeConfig)[];
export type Locale = keyof typeof localeConfig;

export const defaultLocale: Locale = 'en';

export function getLanguageOptions() {
  return locales.map(code => ({
    code,
    name: localeConfig[code].name,
  })).sort((a, b) => a.name.localeCompare(b.name));
}

export async function loadMessages(locale: Locale) {
  try {
    const messages = await import(`../messages/${locale}/main.json`);
    return messages.default || messages;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    if (locale !== 'en') {
      return loadMessages('en');
    }
    throw error;
  }
}
