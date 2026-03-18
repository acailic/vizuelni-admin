/**
 * Internationalization Configuration
 *
 * Supports Serbian Cyrillic, Serbian Latin, and English
 */

import { getRequestConfig } from 'next-intl/server';

export const locales = ['sr-Cyrl', 'sr-Latn', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'sr-Cyrl';

export default getRequestConfig(async ({ locale }) => {
  // Validate locale
  const validLocale = locales.includes(locale as Locale) ? locale as Locale : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`../public/locales/${validLocale}/common.json`)).default,
    timeZone: 'Europe/Belgrade',
    now: new Date(),
  };
});
