import type { Metadata } from 'next';
import { resolveLocale, getMessages } from '@/lib/i18n/messages';
import { AnalyticsDashboard } from './AnalyticsDashboard';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  const titles = {
    'sr-Cyrl': 'Аналитички преглед',
    'sr-Latn': 'Analitički pregled',
    en: 'Analytics Overview',
  };

  return {
    title: `${titles[locale]} | Визуелни Административни Подаци Србије`,
  };
}

export default async function AnalyticsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const messages = getMessages(locale);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analytics = (messages as any).analytics ?? {};

  return (
    <AnalyticsDashboard
      locale={locale}
      messages={{
        title: analytics.title ?? 'Analytics Overview',
        subtitle:
          analytics.subtitle ??
          'Year-over-year comparison across Serbian districts',
        yearA: analytics.yearA ?? 'Base year',
        yearB: analytics.yearB ?? 'Compare year',
        domains: {
          demographics: analytics.domains?.demographics ?? 'Demographics',
          economy: analytics.domains?.economy ?? 'Economy',
          education: analytics.domains?.education ?? 'Education',
          health: analytics.domains?.health ?? 'Health',
        },
        kpi: {
          population: analytics.kpi?.population ?? 'Population',
          gdp: analytics.kpi?.gdp ?? 'GDP per Capita',
          employment: analytics.kpi?.employment ?? 'Employment Rate',
          districts: analytics.kpi?.districts ?? 'Districts',
        },
        chart: {
          title: analytics.chart?.title ?? 'Year Comparison',
          mapTitle: analytics.chart?.mapTitle ?? 'Geographic Distribution',
        },
        table: {
          rank: analytics.table?.rank ?? '#',
          region: analytics.table?.region ?? 'Region',
          delta: analytics.table?.delta ?? 'Change',
        },
      }}
    />
  );
}
