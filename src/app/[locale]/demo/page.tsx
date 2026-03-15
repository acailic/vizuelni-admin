import type { Metadata } from 'next';
import { resolveLocale } from '@/lib/i18n/messages';
import type { Locale } from '@/lib/i18n/config';
import DemoPageClient from './page.client';

export async function generateStaticParams() {
  return [{ locale: 'sr-Cyrl' }, { locale: 'sr-Latn' }, { locale: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const copy = getDemoPageCopy(locale);

  return {
    title: `${copy.title} | Визуелни Административни Подаци Србије`,
    description: copy.subtitle,
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const copy = getDemoPageCopy(locale);

  return (
    <DemoPageClient
      locale={locale}
      translations={{
        title: copy.title,
        subtitle: copy.subtitle,
      }}
    />
  );
}

function getDemoPageCopy(locale: Locale) {
  switch (locale) {
    case 'sr-Cyrl':
      return {
        title: 'Визуелни Админ Србије',
        subtitle: 'Интерактивне визуелизације државних података Републике Србије',
      };
    case 'sr-Latn':
      return {
        title: 'Vizuelni Admin Srbije',
        subtitle: 'Interaktivne vizuelizacije državnih podataka Republike Srbije',
      };
    default:
      return {
        title: 'Vizuelni Admin Srbije',
        subtitle: 'Interactive visualizations of Serbian government data',
      };
  }
}
