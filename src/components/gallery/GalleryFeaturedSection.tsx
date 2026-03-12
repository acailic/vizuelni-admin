'use client'

import { featuredExamples } from '@/lib/examples'
import { ExampleCard } from '@/components/home/ExampleCard'
import { useExampleData } from '@/components/home/useExampleData'
import type { Locale } from '@/lib/i18n/config'

interface GalleryFeaturedSectionProps {
  locale: string
  title: string
}

export function GalleryFeaturedSection({ locale, title }: GalleryFeaturedSectionProps) {
  // Cast locale to Locale type (validated by route)
  const typedLocale = locale as Locale
  // Create hooks for each example
  const exampleStates = featuredExamples.map((config) => useExampleData(config))

  return (
    <section className="mb-8" aria-labelledby="featured-examples-gallery">
      <h2 id="featured-examples-gallery" className="mb-4 text-xl font-semibold text-slate-800">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredExamples.map((config, index) => (
          <ExampleCard
            key={config.id}
            config={config}
            locale={typedLocale}
            dataset={exampleStates[index].dataset}
            status={exampleStates[index].status}
            onRetry={exampleStates[index].retry}
          />
        ))}
      </div>
    </section>
  )
}
