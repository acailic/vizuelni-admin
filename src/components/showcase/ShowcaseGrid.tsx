'use client'

import { useState } from 'react'
import type { FeaturedExampleConfig } from '@/lib/examples/types'
import type { Locale } from '@/lib/i18n/config'
import { ShowcaseCard } from './ShowcaseCard'

interface ShowcaseGridProps {
  examples: FeaturedExampleConfig[]
  locale: Locale
  columns?: 2 | 3 | 4
  showEditButton?: boolean
  showCategoryFilter?: boolean
}

const filterLabels: Record<Locale, Record<string, string>> = {
  'sr-Cyrl': {
    all: 'Све',
    demographics: 'Демографија',
    healthcare: 'Здравство',
    economy: 'Економија',
    migration: 'Миграција',
  },
  'sr-Latn': {
    all: 'Sve',
    demographics: 'Demografija',
    healthcare: 'Zdravstvo',
    economy: 'Ekonomija',
    migration: 'Migracija',
  },
  en: {
    all: 'All',
    demographics: 'Demographics',
    healthcare: 'Healthcare',
    economy: 'Economy',
    migration: 'Migration',
  },
}

const categoryColors: Record<string, string> = {
  all: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200',
  demographics: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200',
  healthcare: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200',
  economy: 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-200',
  migration: 'bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200',
}

export function ShowcaseGrid({
  examples,
  locale,
  columns = 3,
  showEditButton = true,
  showCategoryFilter = true,
}: ShowcaseGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filteredExamples =
    activeCategory === 'all'
      ? examples
      : examples.filter((ex) => ex.category === activeCategory)

  const categories = ['all', 'demographics', 'healthcare', 'economy', 'migration'] as const

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div>
      {/* Category Filter Pills */}
      {showCategoryFilter && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => {
            const isActive = activeCategory === cat
            const label = filterLabels[locale]?.[cat] ?? cat
            const colorClass = categoryColors[cat]

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? `${colorClass} ring-2 ring-offset-1`
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {/* Grid */}
      <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
        {filteredExamples.map((example) => (
          <ShowcaseCard
            key={example.id}
            example={example}
            locale={locale}
            showEditButton={showEditButton}
          />
        ))}
      </div>

      {filteredExamples.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {locale === 'sr-Cyrl'
            ? 'Нема примера у овој категорији'
            : locale === 'sr-Latn'
            ? 'Nema primera u ovoj kategoriji'
            : 'No examples in this category'}
        </div>
      )}
    </div>
  )
}
