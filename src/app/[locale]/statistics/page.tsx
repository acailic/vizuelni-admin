// src/app/[locale]/statistics/page.tsx
import { notFound } from 'next/navigation';
import { getMessages, resolveLocale } from '@/lib/i18n/messages';
import { StatisticsClient } from './StatisticsClient';

export default async function StatisticsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = resolveLocale(params.locale);

  if (locale !== params.locale) {
    notFound();
  }

  const messages = getMessages(locale);

  return <StatisticsClient locale={locale} messages={messages} />;
}
