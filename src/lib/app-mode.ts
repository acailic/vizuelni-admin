import type { Locale } from '@/lib/i18n/config';

export const isStaticMode =
  process.env.NEXT_PUBLIC_STATIC_MODE === 'true' ||
  Boolean(process.env.NEXT_PUBLIC_BASE_PATH);

export const isDemoMode =
  process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || isStaticMode;

export const appFeatures = {
  auth: !isStaticMode && process.env.NEXT_PUBLIC_AUTH_ENABLED !== 'false',
  persistence:
    !isStaticMode && process.env.NEXT_PUBLIC_SAVE_ENABLED !== 'false',
  serverSearch: !isStaticMode,
  communityGallery: !isStaticMode,
  statistics: !isStaticMode,
} as const;

export function getSampleDataLabel(locale: Locale): string {
  switch (locale) {
    case 'sr-Cyrl':
      return 'Примери података';
    case 'sr-Latn':
      return 'Primeri podataka';
    case 'en':
    default:
      return 'Sample Data';
  }
}

export function getAccessibilityLabel(locale: Locale): string {
  switch (locale) {
    case 'sr-Cyrl':
      return 'Приступачност';
    case 'sr-Latn':
      return 'Pristupačnost';
    case 'en':
    default:
      return 'Accessibility';
  }
}

export function getStaticModeBadge(locale: Locale): string {
  switch (locale) {
    case 'sr-Cyrl':
      return 'GitHub Pages демо';
    case 'sr-Latn':
      return 'GitHub Pages demo';
    case 'en':
    default:
      return 'GitHub Pages demo';
  }
}

export function getStaticModeMessage(locale: Locale): string {
  switch (locale) {
    case 'sr-Cyrl':
      return 'Ово је статичка демо верзија. Пријава, чување графика, контролне табле и галерија заједнице нису доступни.';
    case 'sr-Latn':
      return 'Ovo je statička demo verzija. Prijava, čuvanje grafikona, kontrolne table i galerija zajednice nisu dostupni.';
    case 'en':
    default:
      return 'This is the static demo build. Sign-in, chart saving, dashboards, and the community gallery are unavailable.';
  }
}

export function getStaticModeCtaLabel(locale: Locale): string {
  switch (locale) {
    case 'sr-Cyrl':
      return 'Отворите примере';
    case 'sr-Latn':
      return 'Otvorite primere';
    case 'en':
    default:
      return 'Open examples';
  }
}
