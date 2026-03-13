'use client'

import { useState } from 'react'
import type { FeaturedExampleConfig } from '@/lib/examples/types'
import { getLocalizedText } from '@/lib/examples/types'
import type { Locale } from '@/lib/i18n/config'
import { ShowcaseCard } from './ShowcaseCard'

interface TemplatesPanelProps {
  examples: FeaturedExampleConfig[]
  onSelectTemplate: (example: FeaturedExampleConfig) => void
  locale: Locale
  onClose: () => void
}

export function TemplatesPanel({
  examples,
  onSelectTemplate,
  locale,
  onClose,
}: TemplatesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredExamples = examples.filter((ex) => {
    const title = getLocalizedText(ex.title, locale).toLowerCase()
    const description = getLocalizedText(ex.description, locale).toLowerCase()
    const tags = ex.tags?.join(' ').toLowerCase() ?? ''
    const query = searchQuery.toLowerCase()

    return title.includes(query) || description.includes(query) || tags.includes(query)
  })

  const titles: Record<Locale, { title: string; search: string; close: string }> = {
    'sr-Cyrl': {
      title: 'Шаблони',
      search: 'Претражи шаблоне...',
      close: 'Затвори',
    },
    'sr-Latn': {
      title: 'Šabloni',
      search: 'Pretraži šablone...',
      close: 'Zatvori',
    },
    en: {
      title: 'Templates',
      search: 'Search templates...',
      close: 'Close',
    },
  }

  const t = titles[locale]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
      <div className="min-h-screen px-4 py-8 flex items-start justify-center">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t.title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredExamples.map((example) => (
                <button
                  key={example.id}
                  onClick={() => {
                    onSelectTemplate(example)
                    onClose()
                  }}
                  className="text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ShowcaseCard
                    example={example}
                    locale={locale}
                    showEditButton={false}
                  />
                </button>
              ))}
            </div>

            {filteredExamples.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                {locale === 'sr-Cyrl'
                  ? 'Нема резултата'
                  : locale === 'sr-Latn'
                  ? 'Nema rezultata'
                  : 'No results found'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
