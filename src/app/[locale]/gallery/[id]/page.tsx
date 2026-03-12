import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { notFound } from 'next/navigation'
import { ChartDetailClient } from './client'

interface ChartDetailPageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function ChartDetailPage({ params }: ChartDetailPageProps) {
  const resolvedParams = await params
  const locale = resolveLocale(resolvedParams.locale)

  if (locale !== resolvedParams.locale) {
    notFound()
  }

  const messages = getMessages(locale)

  // Extract gallery labels with fallbacks
  const galleryLabels = messages.gallery ?? {}

  const labels = {
    backToGallery: galleryLabels.backToGallery ?? 'Back to Gallery',
    views: galleryLabels.views ?? 'views',
    by: galleryLabels.by ?? 'by',
    published: galleryLabels.published ?? 'Published',
    lastUpdated: galleryLabels.lastUpdated ?? 'Last updated',
    loading: messages.common.loading ?? 'Loading...',
    notFound: galleryLabels.notFound ?? 'Chart not found',
    embedTitle: galleryLabels.embedTitle ?? 'Embed Code',
    embedWidth: galleryLabels.embedWidth ?? 'Width',
    embedHeight: galleryLabels.embedHeight ?? 'Height',
    copyCode: galleryLabels.copyCode ?? 'Copy Code',
    copied: galleryLabels.copied ?? 'Copied!',
    preview: galleryLabels.preview ?? 'Preview',
  }

  // Get base URL for embed code
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}`

  return (
    <ChartDetailClient
      chartId={resolvedParams.id}
      locale={locale}
      labels={labels}
      baseUrl={baseUrl}
    />
  )
}
