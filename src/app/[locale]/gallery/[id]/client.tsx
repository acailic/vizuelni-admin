'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, Calendar, User } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { srLatn, enUS } from 'date-fns/locale'
import { ChartRenderer } from '@/components/charts/ChartRenderer'
import { EmbedCodeGenerator } from '@/components/gallery/EmbedCodeGenerator'
import type { ChartConfig } from '@/types/chart-config'

interface ChartDetail {
  id: string
  title: string
  description?: string | null
  config: ChartConfig
  chartType: string
  views: number
  createdAt: string
  updatedAt: string
  publishedAt?: string | null
  author?: {
    name?: string | null
    image?: string | null
  } | null
}

interface ChartDetailClientProps {
  chartId: string
  locale: string
  labels: {
    backToGallery: string
    views: string
    by: string
    published: string
    lastUpdated: string
    loading: string
    notFound: string
    embedTitle: string
    embedWidth: string
    embedHeight: string
    copyCode: string
    copied: string
    preview: string
  }
  baseUrl: string
}

export function ChartDetailClient({ chartId, locale, labels, baseUrl }: ChartDetailClientProps) {
  const [chart, setChart] = useState<ChartDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const dateLocale = locale === 'sr-Latn' ? srLatn : locale === 'en' ? enUS : undefined

  useEffect(() => {
    fetchChart()
  }, [chartId])

  const fetchChart = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/gallery/${chartId}`)
      if (!response.ok) {
        if (response.status === 404) {
          setError(labels.notFound)
        } else {
          throw new Error('Failed to fetch chart')
        }
        return
      }
      const data = await response.json()
      setChart(data)
    } catch (err) {
      setError(labels.notFound)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-slate-500">{labels.loading}</div>
      </div>
    )
  }

  if (error || !chart) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href={`/${locale}/gallery`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {labels.backToGallery}
        </Link>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg text-slate-600">{error || labels.notFound}</p>
        </div>
      </div>
    )
  }

  const publishedDate = chart.publishedAt
    ? formatDistanceToNow(new Date(chart.publishedAt), {
        addSuffix: true,
        ...(dateLocale && { locale: dateLocale }),
      })
    : null

  const updatedDate = chart.updatedAt
    ? format(new Date(chart.updatedAt), 'PPP', dateLocale ? { locale: dateLocale } : undefined)
    : null

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Back link */}
      <Link
        href={`/${locale}/gallery`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        {labels.backToGallery}
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main chart area */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900">{chart.title}</h1>
            {chart.description && (
              <p className="mt-2 text-slate-600">{chart.description}</p>
            )}
          </div>

          {/* Author and meta */}
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {chart.author && (
              <div className="flex items-center gap-2">
                {chart.author.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={chart.author.image}
                    alt={chart.author.name || ''}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200">
                    <User className="h-3 w-3 text-slate-500" />
                  </div>
                )}
                <span>
                  {labels.by} {chart.author.name || 'Anonymous'}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>
                {chart.views} {labels.views}
              </span>
            </div>
            {publishedDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {labels.published} {publishedDate}
                </span>
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <ChartRenderer
              config={chart.config}
              data={[]}
              height={500}
              locale={locale}
            />
          </div>

          {/* Last updated */}
          {updatedDate && (
            <p className="mt-4 text-xs text-slate-400">
              {labels.lastUpdated}: {updatedDate}
            </p>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <EmbedCodeGenerator
            chartId={chart.id}
            baseUrl={baseUrl}
            labels={{
              title: labels.embedTitle,
              width: labels.embedWidth,
              height: labels.embedHeight,
              copyCode: labels.copyCode,
              copied: labels.copied,
              preview: labels.preview,
            }}
          />
        </div>
      </div>
    </div>
  )
}
