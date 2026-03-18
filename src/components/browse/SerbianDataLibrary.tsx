'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BarChart2, LineChart, Users, Globe, TrendingDown, ArrowRightCircle } from 'lucide-react'

import { cn } from '@/lib/utils/cn'
import { getAllDatasetMeta, type SerbianDatasetMeta, type DataCategory } from '@/lib/data/serbian-datasets'
import type { Locale } from '@/lib/i18n/config'

interface SerbianDataLibraryProps {
  locale: Locale
  labels: {
    title: string
    description: string
    useDataset: string
    viewDetails: string
    categories: {
      all: string
      demographics: string
      regional: string
      healthcare: string
      economic: string
    }
    chartTypes: {
      bar: string
      line: string
    }
    tags: string
    source: string
    lastUpdated: string
  }
}

const CATEGORY_ICONS: Record<DataCategory, React.ComponentType<{ className?: string }>> = {
  demographics: Users,
  regional: Globe,
  healthcare: BarChart2,
  economic: TrendingDown,
}

const CATEGORY_COLORS: Record<DataCategory, string> = {
  demographics: 'bg-blue-50 border-blue-200 hover:border-blue-400',
  regional: 'bg-green-50 border-green-200 hover:border-green-400',
  healthcare: 'bg-red-50 border-red-200 hover:border-red-400',
  economic: 'bg-amber-50 border-amber-200 hover:border-amber-400',
}

const CATEGORY_BADGE_COLORS: Record<DataCategory, string> = {
  demographics: 'bg-blue-100 text-blue-700',
  regional: 'bg-green-100 text-green-700',
  healthcare: 'bg-red-100 text-red-700',
  economic: 'bg-amber-100 text-amber-700',
}

export function SerbianDataLibrary({ locale, labels }: SerbianDataLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<DataCategory | 'all'>('all')

  const allDatasets = getAllDatasetMeta()
  const filteredDatasets = selectedCategory === 'all'
    ? allDatasets
    : allDatasets.filter(d => d.category === selectedCategory)

  const categories: (DataCategory | 'all')[] = ['all', 'demographics', 'regional', 'healthcare', 'economic']

  const getTitle = (dataset: SerbianDatasetMeta): string => {
    if (locale === 'sr-Cyrl') return dataset.title.sr
    if (locale === 'sr-Latn') return dataset.title.lat
    return dataset.title.en
  }

  const getDescription = (dataset: SerbianDatasetMeta): string => {
    if (locale === 'sr-Cyrl') return dataset.description.sr
    if (locale === 'sr-Latn') return dataset.description.lat
    return dataset.description.en
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{labels.title}</h2>
          <p className="mt-1 text-sm text-gray-600">{labels.description}</p>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                selectedCategory === category
                  ? 'bg-gov-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {labels.categories[category]}
            </button>
          ))}
        </div>
      </div>

      {/* Dataset grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDatasets.map(dataset => {
          const Icon = CATEGORY_ICONS[dataset.category]
          return (
            <div
              key={dataset.id}
              className={cn(
                'rounded-xl border-2 p-4 transition-all',
                CATEGORY_COLORS[dataset.category]
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className={cn(
                      'rounded px-2 py-0.5 text-xs font-medium',
                      CATEGORY_BADGE_COLORS[dataset.category]
                    )}>
                      {labels.categories[dataset.category]}
                    </span>
                  </div>
                  <h3 className="mt-2 font-semibold text-gray-900">{getTitle(dataset)}</h3>
                </div>
                {dataset.suggestedChartType === 'bar' ? (
                  <BarChart2 className="h-5 w-5 text-gray-400" />
                ) : (
                  <LineChart className="h-5 w-5 text-gray-400" />
                )}
              </div>

              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{getDescription(dataset)}</p>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-1">
                {dataset.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="rounded bg-white/50 px-1.5 py-0.5 text-xs text-gray-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer with source and action */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-200/50 pt-3">
                <div className="text-xs text-gray-500">
                  <span>{labels.source}: </span>
                  <span className="font-medium">{dataset.source.name}</span>
                </div>
                <Link
                  href={`/${locale}/create?dataset=${dataset.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-gov-primary hover:text-gov-secondary"
                >
                  {labels.useDataset}
                  <ArrowRightCircle className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {filteredDatasets.length === 0 && (
        <div className="rounded-lg bg-gray-50 py-12 text-center text-gray-500">
          No datasets found for this category.
        </div>
      )}
    </section>
  )
}
