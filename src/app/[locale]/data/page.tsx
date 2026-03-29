import { Suspense } from 'react';
import type { Metadata } from 'next';
import { resolveLocale } from '@/lib/i18n/messages';
import { InsightExplorer } from '@/components/insight-explorer/InsightExplorer';
import { DataSourceProvider } from '@/contexts/DataSourceContext';
import { ChartSkeleton } from '@/components/ui/Skeleton';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  const titles = {
    'sr-Cyrl': 'Каталог података',
    'sr-Latn': 'Katalog podataka',
    en: 'Data catalog',
  };

  return {
    title: `${titles[locale]} | Визуелни Административни Подаци Србије`,
  };
}

export default async function DataPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  return (
    <main className='container-custom py-8'>
      <DataSourceProvider>
        <Suspense fallback={<ChartSkeleton />}>
          <InsightExplorer locale={locale} />
        </Suspense>
      </DataSourceProvider>
    </main>
  );
}
