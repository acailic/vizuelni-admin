'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils/cn'
import type { ShowcaseCategory } from '@/lib/examples/types'

import { featuredExamples } from '@/lib/examples'
import type { Locale } from '@/lib/i18n/config'

import { ExampleCard } from './ExampleCard'
import { useExampleData } from './useExampleData'

interface FeaturedExamplesProps {
  locale: Locale
}

// Localized section titles with categories
const sectionTitles: Record<
  Locale,
  {
    title: string
    description: string
    errorTitle: string
    retry: string
    categories: {
      all: string
      demographics: string
      economy: string
      healthcare: string
      migration: string
    }
    emptyCategory: string
  }
> = {
  'sr-Cyrl': {
    title: 'Примери визуелизација',
    description: 'Истражите визуелизације направљене од података српске владе',
    errorTitle: 'Није могуће учитати примере',
    retry: 'Понови све',
    categories: {
      all: 'Сви',
      demographics: 'Демографија',
      economy: 'Економија',
      healthcare: 'Здравство',
      migration: 'Миграције',
    },
    emptyCategory: 'Нема примера у овој категорији',
  },
  'sr-Latn': {
    title: 'Primeri vizuelizacija',
    description: 'Istražite vizuelizacije napravljene od podataka srpske vlade',
    errorTitle: 'Nije moguće učitati primere',
    retry: 'Ponovi sve',
    categories: {
      all: 'Svi',
      demographics: 'Demografija',
      economy: 'Ekonomija',
      healthcare: 'Zdravstvo',
      migration: 'Migracije',
    },
    emptyCategory: 'Nema primera u ovoj kategoriji',
  },
  en: {
    title: 'Featured Visualizations',
    description: 'Explore visualizations created from Serbian government data',
    errorTitle: 'Unable to load examples',
    retry: 'Retry all',
    categories: {
      all: 'All',
      demographics: 'Demographics',
      economy: 'Economy',
      healthcare: 'Healthcare',
      migration: 'Migration',
    },
    emptyCategory: 'No examples in this category',
  },
}

export function FeaturedExamples({ locale }: FeaturedExamplesProps) {
  const texts = sectionTitles[locale]

  // Track all example states
  const [globalRetryKey, setGlobalRetryKey] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<ShowcaseCategory | 'all'>('all')

  // Create hooks for each example (must be static number of hooks)
  const example1 = useExampleData(featuredExamples[0])
  const example2 = useExampleData(featuredExamples[1])
  const example3 = useExampleData(featuredExamples[2])
  const example4 = useExampleData(featuredExamples[3])
  const example5 = useExampleData(featuredExamples[4])
  const example6 = useExampleData(featuredExamples[5])
  const example7 = useExampleData(featuredExamples[6])
  const example8 = useExampleData(featuredExamples[7])
  const example9 = useExampleData(featuredExamples[8])

  const examples = [
    example1,
    example2,
    example3,
    example4,
    example5,
    example6,
    example7,
    example8,
    example9,
  ]

  // Filter by category
  const categoryExamples = featuredExamples.filter(
    (config) =>
      selectedCategory === 'all' || config.category === selectedCategory
  )

  // Get example states for filtered configs and filter out failed cards
  const visibleExamples = categoryExamples
    .map((config) => {
      const index = featuredExamples.indexOf(config)
      return { config, state: examples[index] }
    })
    .filter(({ state }) => state?.status !== 'error')

  // Global retry function
  const _retryAll = () => {
    setGlobalRetryKey((k) => k + 1)
    examples.forEach((e) => e?.retry?.())
  }

  return (
    <section className="py-12" aria-labelledby="featured-examples-title">
      {/* Section header */}
      <header className="mb-8 text-center">
        <h2 id="featured-examples-title" className="text-2xl font-bold text-gray-900">
          {texts.title}
        </h2>
        <p className="mt-2 text-gray-600">{texts.description}</p>
      </header>

      {/* Category filter tabs */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {(
          ['all', 'demographics', 'economy', 'healthcare', 'migration'] as const
        ).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              selectedCategory === cat
                ? 'bg-gov-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {texts.categories[cat]}
          </button>
        ))}
      </div>

      {/* Empty state for category */}
      {visibleExamples.length === 0 && categoryExamples.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-500">{texts.emptyCategory}</p>
        </div>
      )}

      {/* Examples grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleExamples.map(({ config, state }) => {
          if (!config || !state) return null
          return (
            <ExampleCard
              key={`${config.id}-${globalRetryKey}`}
              config={config}
              locale={locale}
              dataset={state.dataset}
              status={state.status}
              onRetry={state.retry}
            />
          )
        })}
      </div>
    </section>
  )
}
