import type { Metadata } from 'next'
import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { getTranslations, getTranslationsAs } from '@/lib/i18n/translations'
import DemoPageClient from './page.client'
import type { Locale } from '@/types'

export async function generateStaticParams() {
  return [{ locale: 'sr-Cyrl' }, { locale: 'sr-Latn' }, { locale: 'en' }]
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale }
}): Promise<Metadata> {
  const locale = resolveLocale(params.locale)
  const t = await getTranslations(locale)

  return {
    title: `${t('demo.title', 'Demo')} | Визуелни Административни Подаци Србије`,
    description: t(
      'demo.description',
      'Explore interactive visualizations of Serbian government data with sample charts and datasets.'
    ),
  }
}

export default async function DemoPage({ params }: { params: { locale: Locale } }) {
  const locale = resolveLocale(params.locale)
  const messages = getMessages(locale)
  const translations = await getTranslationsAs(locale, ['demo'])

  return (
    <DemoPageClient
      locale={locale}
      messages={messages}
      translations={translations}
    />
  )
}
