import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { notFound } from 'next/navigation'
import { GalleryPage } from '@/components/gallery'

interface GalleryPageRouteProps {
  params: Promise<{ locale: string }>
}

export default async function GalleryPageRoute({ params }: GalleryPageRouteProps) {
  const resolvedParams = await params
  const locale = resolveLocale(resolvedParams.locale)

  if (locale !== resolvedParams.locale) {
    notFound()
  }

  const messages = getMessages(locale)

  // Extract gallery labels with fallbacks
  const galleryLabels = messages.gallery ?? {}
  const chartsLabels = messages.charts ?? {}
  const chartTypes = chartsLabels.types ?? {}

  const labels = {
    title: galleryLabels.title ?? 'Gallery',
    description: galleryLabels.description ?? 'Explore visualizations created by the community',
    searchPlaceholder: galleryLabels.searchPlaceholder ?? 'Search charts...',
    allTypes: galleryLabels.allTypes ?? 'All Types',
    filterByType: galleryLabels.filterByType ?? 'Filter by type',
    sortBy: galleryLabels.sortBy ?? 'Sort by',
    newest: galleryLabels.newest ?? 'Newest',
    mostViewed: galleryLabels.mostViewed ?? 'Most Viewed',
    noCharts: galleryLabels.noCharts ?? 'No charts found',
    tryDifferent: galleryLabels.tryDifferent ?? 'Try adjusting your search or filters',
    chartTypes: {
      line: chartTypes.line ?? 'Line',
      bar: chartTypes.bar ?? 'Bar',
      column: chartTypes.column ?? 'Column',
      area: chartTypes.area ?? 'Area',
      pie: chartTypes.pie ?? 'Pie',
      scatterplot: chartTypes.scatterplot ?? 'Scatterplot',
      combo: chartTypes.combo ?? 'Combo',
      table: chartTypes.table ?? 'Table',
    },
    views: galleryLabels.views ?? 'views',
    by: galleryLabels.by ?? 'by',
    loading: messages.common.loading ?? 'Loading...',
    error: messages.common.error ?? 'Error',
  }

  return <GalleryPage locale={locale} labels={labels} />
}
