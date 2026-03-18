import type { Locale } from '@/lib/i18n/config';
import type { EmailTemplate } from './types';

const FEEDBACK_EMAIL = 'feedback@vizuelni-admin.rs'; // Replace with actual email

const templates: Record<
  Locale,
  {
    bug: { subject: string; body: string };
    feature: { subject: string; body: string };
  }
> = {
  'sr-Cyrl': {
    bug: {
      subject: 'Пријава грешке - Визуелни Админ',
      body: `Опис грешке:
[Опишите шта се десило]

Кораци за репродукцију:
1.
2.

Очекивано понашање:
[Шта сте очекивали да се деси]

Претраживач и верзија:
[нпр. Chrome 120]

Ваша контакт информација (опционално):
Име:
Е-пошта:
`,
    },
    feature: {
      subject: 'Предлог нове функције - Визуелни Админ',
      body: `Опис проблема:
[Који проблем ова функција треба да реши?]

Предложено решење:
[Опишите функцију коју бисте желели]

Алтернативе:
[Да ли сте разматрали друге опције?]

Утицај:
[Колико би ово било корисно?]

Ваша контакт информација (опционално):
Име:
Е-пошта:
`,
    },
  },
  'sr-Latn': {
    bug: {
      subject: 'Prijava greške - Vizuelni Admin',
      body: `Opis greške:
[Opišite šta se desilo]

Koraci za reprodukciju:
1.
2.

Očekivano ponašanje:
[Šta ste očekivali da se desi]

Pretraživač i verzija:
[npr. Chrome 120]

Vaša kontakt informacija (opcionalno):
Ime:
E-pošta:
`,
    },
    feature: {
      subject: 'Predlog nove funkcije - Vizuelni Admin',
      body: `Opis problema:
[Koji problem ova funkcija treba da reši?]

Predloženo rešenje:
[Opišite funkciju koju biste želeli]

Alternative:
[Da li ste razmatrali druge opcije?]

Uticaj:
[Koliko bi ovo bilo korisno?]

Vaša kontakt informacija (opcionalno):
Ime:
E-pošta:
`,
    },
  },
  en: {
    bug: {
      subject: 'Bug Report - Vizuelni Admin',
      body: `Bug Description:
[Describe what happened]

Steps to Reproduce:
1.
2.

Expected Behavior:
[What did you expect to happen?]

Browser and Version:
[e.g., Chrome 120]

Your Contact Information (optional):
Name:
Email:
`,
    },
    feature: {
      subject: 'Feature Request - Vizuelni Admin',
      body: `Problem Description:
[What problem would this feature solve?]

Proposed Solution:
[Describe the feature you'd like]

Alternatives Considered:
[Have you considered other options?]

Impact:
[How useful would this be?]

Your Contact Information (optional):
Name:
Email:
`,
    },
  },
};

export function generateBugReportEmail(locale: Locale): EmailTemplate {
  const template = templates[locale].bug;
  return {
    to: FEEDBACK_EMAIL,
    subject: template.subject,
    body: template.body,
  };
}

export function generateFeatureRequestEmail(locale: Locale): EmailTemplate {
  const template = templates[locale].feature;
  return {
    to: FEEDBACK_EMAIL,
    subject: template.subject,
    body: template.body,
  };
}
