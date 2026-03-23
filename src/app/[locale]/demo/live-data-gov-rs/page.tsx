import type { Metadata } from 'next';
import { resolveLocale } from '@/lib/i18n/messages';
import type { Locale } from '@/lib/i18n/config';
import LiveDataDemoClient from './page.client';
import { getDemoTranslations } from './translations';

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
  const copy = getDemoTranslations(locale);

  return {
    title: `${copy.title} | Визуелни Административни Подаци Србије`,
    description: copy.subtitle,
  };
}

export default async function LiveDataDemoPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const translations = getDemoTranslations(locale);

  return <LiveDataDemoClient locale={locale} translations={translations} />;
}
