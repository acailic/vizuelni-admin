import type { Metadata } from 'next';
import { resolveLocale } from '@/lib/i18n/messages';
import { ChartTypesGuideContent } from './ChartTypesGuideContent';
import type { Locale } from '@/lib/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam) as Locale;

  const titles: Record<Locale, string> = {
    'sr-Cyrl': 'Водич кроз типове графикона',
    'sr-Latn': 'Vodič kroz tipove grafikona',
    en: 'Chart Types Guide',
  };
  const descriptions: Record<Locale, string> = {
    'sr-Cyrl':
      'Научите како да изаберете прави тип графикона за визуализацију јавних података Србије.',
    'sr-Latn':
      'Naučite kako da izaberete pravi tip grafikona za vizualizaciju javnih podataka Srbije.',
    en: 'Learn how to choose the right chart type for visualizing Serbian government data.',
  };

  return { title: titles[locale], description: descriptions[locale] };
}

interface ChartTypesGuidePageProps {
  params: Promise<{ locale: string }>;
}

export default async function ChartTypesGuidePage({
  params,
}: ChartTypesGuidePageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return <ChartTypesGuideContent locale={locale} />;
}
