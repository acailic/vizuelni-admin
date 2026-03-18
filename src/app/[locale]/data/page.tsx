import { Suspense } from 'react';
import type { Metadata } from 'next';
import { resolveLocale } from '@/lib/i18n/messages';
import { InsightExplorer } from '@/components/insight-explorer/InsightExplorer';
import { DataSourceProvider } from '@/contexts/DataSourceContext';

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
        <Suspense fallback={<div className='text-slate-500'>Loading...</div>}>
          <InsightExplorer locale={locale} />
        </Suspense>
      </DataSourceProvider>
    </main>
  );
}
