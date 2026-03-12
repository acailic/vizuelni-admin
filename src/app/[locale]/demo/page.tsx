import type { Metadata } from 'next'
import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import DemoPageClient from './page.client'
import type { Locale } from '@/types'

export async function generateStaticParams() {
  return [{ locale: 'sr-Cyrl' }, { locale: 'sr-Latn' }, { locale: 'en' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = resolveLocale(localeParam)
  const messages = getMessages(locale)

  return {
    title: `${messages.demo?.title || 'Demo'} | Визуелни Административни Подаци Србије`,
    description: messages.demo?.description || 'Explore interactive visualizations of Serbian government data.',
  }
}

export default async function DemoPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale: localeParam } = await params
  const locale = resolveLocale(localeParam)
  const messages = getMessages(locale)

  // Extract demo translations
  const translations: Record<string, string> = messages.demo ? Object.entries(messages.demo).reduce((acc, [key, value]) => {
    acc[key] = String(value)
    return acc
  }, {} as Record<string, string>) : {}

  return (
    <DemoPageClient
      locale={locale}
      translations={translations}
    />
  )
}
