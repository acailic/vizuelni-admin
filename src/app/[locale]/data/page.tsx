import type { Metadata } from 'next';
import { getMessages, resolveLocale } from '@/lib/i18n/messages';
import type { Locale } from '@/lib/i18n/config';
import { SampleDataBrowser } from '@/components/data/SampleDataBrowser';

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

  const titles = {
    'sr-Cyrl': 'Примери података',
    'sr-Latn': 'Primeri podataka',
    en: 'Sample Data',
  };

  return {
    title: `${titles[locale]} | Визуелни Административни Подаци Србије`,
    description:
      'Browse and explore sample Serbian datasets for visualization.',
  };
}

export default async function DataPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  const _messages = getMessages(locale);

  return (
    <main className='container-custom py-8'>
      <SampleDataBrowser locale={locale} />
    </main>
  );
}
