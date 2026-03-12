'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BarChart3,
  LineChart,
  PieChart,
  Map,
  TrendingUp,
  Grid3X3,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Plus,
  LayoutDashboard,
  Star,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { srLatn, enUS } from 'date-fns/locale'

interface SavedChartMeta {
  id: string
  title: string
  description?: string | null
  chartType: string
  status: string
  views: number
  thumbnail?: string | null
  createdAt: string
  updatedAt: string
  publishedAt?: string | null
}

interface DashboardLabels {
  title: string
  subtitle: string
  tab_my_charts: string
  tab_my_dashboards: string
  tab_favorites: string
  create_chart: string
  create_dashboard: string
  no_charts: string
  no_charts_hint: string
  no_dashboards: string
  no_dashboards_hint: string
  no_favorites: string
  no_favorites_hint: string
  last_updated: string
  views: string
  edit: string
  delete: string
  view: string
  delete_confirm: string
  draft: string
  published: string
  coming_soon: string
}

interface DashboardContentProps {
  locale: string
  labels: DashboardLabels
}

type TabType = 'charts' | 'dashboards' | 'favorites'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chartTypeIcons: Record<string, React.ComponentType<any>> = {
  line: LineChart,
  bar: BarChart3,
  column: BarChart3,
  area: TrendingUp,
  pie: PieChart,
  scatterplot: TrendingUp,
  combo: BarChart3,
  table: Grid3X3,
  map: Map,
}

export function DashboardContent({ locale, labels }: DashboardContentProps) {
  const { status } = useSession()
  const router = useRouter()
  const [charts, setCharts] = useState<SavedChartMeta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('charts')

  // Redirect if not authenticated (fallback for client-side)
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login?callbackUrl=/${locale}/dashboard`)
    }
  }, [status, router, locale])

  // Fetch user's charts
  useEffect(() => {
    if (status === 'authenticated') {
      fetchCharts()
    }
  }, [status])

  const fetchCharts = async () => {
    try {
      const response = await fetch('/api/charts/mine')
      if (!response.ok) throw new Error('Failed to fetch charts')
      const data = await response.json()
      setCharts(data.charts || [])
    } catch (err) {
      setError('Failed to load charts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (chartId: string) => {
    if (!confirm(labels.delete_confirm)) return

    try {
      const response = await fetch(`/api/charts/${chartId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete')
      setCharts(charts.filter(c => c.id !== chartId))
    } catch (err) {
      alert('Failed to delete chart')
    }
  }

  const dateLocale = locale === 'sr-Latn' ? srLatn : locale === 'en' ? enUS : undefined

  // Filter out archived charts
  const visibleCharts = charts.filter(chart => chart.status !== 'ARCHIVED')
  const chartCount = visibleCharts.length
  const draftCount = visibleCharts.filter(c => c.status === 'DRAFT').length
  const publishedCount = visibleCharts.filter(c => c.status === 'PUBLISHED').length

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    )
  }

  if (status !== 'authenticated') {
    return null
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{labels.title}</h1>
          <p className="mt-2 text-slate-600">{labels.subtitle}</p>
        </div>
        <Link
          href={`/${locale}/create`}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          {labels.create_chart}
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-slate-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('charts')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'charts'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            {labels.tab_my_charts}
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeTab === 'charts'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {chartCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('dashboards')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'dashboards'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            {labels.tab_my_dashboards}
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeTab === 'dashboards'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              0
            </span>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'favorites'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            <Star className="h-4 w-4" />
            {labels.tab_favorites}
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeTab === 'favorites'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              0
            </span>
          </button>
        </nav>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Tab content */}
      {activeTab === 'charts' && (
        <>
          {/* Stats summary */}
          <div className="mb-6 flex gap-4">
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs text-slate-500">{labels.draft}</p>
              <p className="text-xl font-semibold text-slate-900">{draftCount}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
              <p className="text-xs text-slate-500">{labels.published}</p>
              <p className="text-xl font-semibold text-slate-900">{publishedCount}</p>
            </div>
          </div>

          {/* Charts grid or empty state */}
          {visibleCharts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BarChart3 className="h-16 w-16 text-slate-300" />
              <p className="mt-4 text-lg font-medium text-slate-900">{labels.no_charts}</p>
              <p className="mt-2 text-slate-600">{labels.no_charts_hint}</p>
              <Link
                href={`/${locale}/create`}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                {labels.create_chart}
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleCharts.map(chart => {
                const Icon = chartTypeIcons[chart.chartType] || BarChart3
                const timeAgo = formatDistanceToNow(new Date(chart.updatedAt), {
                  addSuffix: true,
                  ...(dateLocale && { locale: dateLocale }),
                })

                return (
                  <div
                    key={chart.id}
                    className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-slate-100">
                      {chart.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`data:image/png;base64,${chart.thumbnail}`}
                          alt={chart.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Icon className="h-12 w-12 text-slate-300" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="line-clamp-1 font-semibold text-slate-900">{chart.title}</h3>
                        <span
                          className={`ml-2 shrink-0 rounded px-2 py-0.5 text-xs font-medium ${
                            chart.status === 'PUBLISHED'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {chart.status === 'PUBLISHED' ? labels.published : labels.draft}
                        </span>
                      </div>

                      <div className="mb-3 flex items-center gap-3 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Icon className="h-3 w-3" />
                          {chart.chartType}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {chart.views} {labels.views}
                        </span>
                      </div>

                      <p className="mb-3 text-xs text-slate-400">
                        {labels.last_updated}: {timeAgo}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href={`/${locale}/v/${chart.id}`}
                          className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {labels.view}
                        </Link>
                        <Link
                          href={`/${locale}/create?chartId=${chart.id}`}
                          className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                          <Edit className="h-3 w-3" />
                          {labels.edit}
                        </Link>
                        <button
                          onClick={() => handleDelete(chart.id)}
                          className="flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                          aria-label={labels.delete}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {activeTab === 'dashboards' && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <LayoutDashboard className="h-16 w-16 text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-900">{labels.no_dashboards}</p>
          <p className="mt-2 text-slate-600">{labels.no_dashboards_hint}</p>
          <p className="mt-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            {labels.coming_soon}
          </p>
          <button
            disabled
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-300 px-6 py-2 text-slate-500 cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            {labels.create_dashboard}
          </button>
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Star className="h-16 w-16 text-slate-300" />
          <p className="mt-4 text-lg font-medium text-slate-900">{labels.no_favorites}</p>
          <p className="mt-2 text-slate-600">{labels.no_favorites_hint}</p>
          <p className="mt-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            {labels.coming_soon}
          </p>
        </div>
      )}
    </div>
  )
}
