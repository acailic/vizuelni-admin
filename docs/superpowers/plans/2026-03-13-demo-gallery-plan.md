# Demo Gallery Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive demo gallery page with 28 chart visualizations organized by category tabs.

**Architecture:** New page at `/[locale]/demo-gallery` with tabbed interface, static preview cards opening full charts in modals with data tables.

**Tech Stack:** Next.js 14, TypeScript, existing ChartRenderer, Tailwind CSS

---

## File Structure

### New Files

| File | Purpose |
|------|---------|
| `src/app/[locale]/demo-gallery/page.tsx` | Server component for demo gallery page |
| `src/components/demo-gallery/DemoGalleryClient.tsx` | Client component with tab/modal state |
| `src/components/demo-gallery/DemoGalleryCard.tsx` | Preview card with chart |
| `src/components/demo-gallery/DemoGalleryModal.tsx` | Modal with full chart + data table |
| `src/components/demo-gallery/DemoGalleryTabs.tsx` | Category tab buttons |
| `src/components/demo-gallery/index.ts` | Barrel exports |
| `src/lib/examples/demo-gallery-examples.ts` | All 28 chart configurations |
| `src/data/demo-gallery/demographics/*.json` | 6 data files |
| `src/data/demo-gallery/healthcare/*.json` | 7 data files |
| `src/data/demo-gallery/economy/*.json` | 5 data files |
| `src/data/demo-gallery/migration/*.json` | 4 data files |
| `src/data/demo-gallery/society/*.json` | 6 data files |

### Modified Files

| File | Changes |
|------|---------|
| `src/lib/examples/types.ts` | Add 'society' to ShowcaseCategory |
| `src/components/showcase/CategoryBadge.tsx` | Add 'society' category |
| `src/components/layout/Sidebar.tsx` | Add demo gallery nav link |
| `src/lib/i18n/locales/en/common.json` | Add demoGallery keys |
| `src/lib/i18n/locales/sr/common.json` | Add demoGallery keys |
| `src/lib/i18n/locales/lat/common.json` | Add demoGallery keys |

---

## Tasks

### Task 1: Extend Types

- [ ] Add 'society' to ShowcaseCategory in `src/lib/examples/types.ts`

```typescript
export type ShowcaseCategory = 'demographics' | 'healthcare' | 'economy' | 'migration' | 'society';
```

- [ ] Update CategoryBadge in `src/components/showcase/CategoryBadge.tsx` to include 'society'

```typescript
const categoryLabels: Record<ShowcaseCategory, Record<Locale, string>> = {
  // ... existing
  society: {
    'sr-Cyrl': 'Друштво',
    'sr-Latn': 'Društvo',
    en: 'Society',
  },
}

const categoryColors: Record<ShowcaseCategory, string> = {
  // ... existing
  society: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
}
```

- [ ] Run: `npm run type-check`
- [ ] Commit: `feat(demo-gallery): extend types with society category`

### Task 2: Create Data Files

- [ ] Create directory structure:
```bash
mkdir -p src/data/demo-gallery/{demographics,healthcare,economy,migration,society}
```

- [ ] Create `src/data/demo-gallery/demographics/population-pyramid.json`:
```json
{
  "data": [
    { "ageGroup": "0-4", "male": -140000, "female": 135000 },
    { "ageGroup": "5-9", "male": -145000, "female": 140000 },
    { "ageGroup": "10-14", "male": -150000, "female": 145000 },
    { "ageGroup": "15-19", "male": -155000, "female": 150000 },
    { "ageGroup": "20-24", "male": -165000, "female": 160000 },
    { "ageGroup": "25-29", "male": -175000, "female": 170000 },
    { "ageGroup": "30-34", "male": -180000, "female": 175000 },
    { "ageGroup": "35-39", "male": -185000, "female": 180000 },
    { "ageGroup": "40-44", "male": -195000, "female": 190000 },
    { "ageGroup": "45-49", "male": -200000, "female": 195000 },
    { "ageGroup": "50-54", "male": -210000, "female": 205000 },
    { "ageGroup": "55-59", "male": -220000, "female": 215000 },
    { "ageGroup": "60-64", "male": -230000, "female": 235000 },
    { "ageGroup": "65-69", "male": -200000, "female": 220000 },
    { "ageGroup": "70-74", "male": -160000, "female": 190000 },
    { "ageGroup": "75-79", "male": -110000, "female": 140000 },
    { "ageGroup": "80-84", "male": -70000, "female": 100000 },
    { "ageGroup": "85+", "male": -45000, "female": 75000 }
  ]
}
```

- [ ] Create `src/data/demo-gallery/demographics/birth-rates.json`:
```json
{
  "data": [
    { "year": 1950, "rate": 30.5 },
    { "year": 1955, "rate": 27.2 },
    { "year": 1960, "rate": 22.1 },
    { "year": 1965, "rate": 18.4 },
    { "year": 1970, "rate": 15.8 },
    { "year": 1975, "rate": 14.2 },
    { "year": 1980, "rate": 12.5 },
    { "year": 1985, "rate": 11.2 },
    { "year": 1990, "rate": 10.4 },
    { "year": 1995, "rate": 9.8 },
    { "year": 2000, "rate": 9.3 },
    { "year": 2005, "rate": 9.1 },
    { "year": 2010, "rate": 8.9 },
    { "year": 2015, "rate": 9.2 },
    { "year": 2020, "rate": 9.1 },
    { "year": 2024, "rate": 9.1 }
  ]
}
```

- [ ] Create `src/data/demo-gallery/demographics/fertility-rates.json`:
```json
{
  "data": [
    { "year": 2000, "fertility": 1.70, "replacement": 2.1 },
    { "year": 2005, "fertility": 1.64, "replacement": 2.1 },
    { "year": 2010, "fertility": 1.45, "replacement": 2.1 },
    { "year": 2015, "fertility": 1.46, "replacement": 2.1 },
    { "year": 2020, "fertility": 1.48, "replacement": 2.1 },
    { "year": 2023, "fertility": 1.61, "replacement": 2.1 },
    { "year": 2024, "fertility": 1.42, "replacement": 2.1 }
  ]
}
```

- [ ] Create `src/data/demo-gallery/demographics/natural-change.json`:
```json
{
  "data": [
    { "year": 2015, "births": 66004, "deaths": 101559 },
    { "year": 2016, "births": 65638, "deaths": 103702 },
    { "year": 2017, "births": 64875, "deaths": 102620 },
    { "year": 2018, "births": 63505, "deaths": 101573 },
    { "year": 2019, "births": 61597, "deaths": 101541 },
    { "year": 2020, "births": 61447, "deaths": 116829 },
    { "year": 2021, "births": 62180, "deaths": 136622 },
    { "year": 2022, "births": 60512, "deaths": 109203 },
    { "year": 2023, "births": 61052, "deaths": 97081 },
    { "year": 2024, "births": 60845, "deaths": 98230 }
  ]
}
```

- [ ] Create `src/data/demo-gallery/demographics/age-distribution.json`:
```json
{
  "data": [
    { "ageGroup": "0-14", "percentage": 14.2 },
    { "ageGroup": "15-29", "percentage": 15.8 },
    { "ageGroup": "30-44", "percentage": 18.5 },
    { "ageGroup": "45-59", "percentage": 21.3 },
    { "ageGroup": "60-74", "percentage": 19.2 },
    { "ageGroup": "75+", "percentage": 11.0 }
  ]
}
```

- [ ] Copy existing `src/data/showcase/serbia-demographics.json` to `src/data/demo-gallery/demographics/population-decline.json`

- [ ] Create `src/data/demo-gallery/healthcare/cancer-incidence.json`:
```json
{
  "data": [
    { "type": "Lung", "cases": 4200 },
    { "type": "Colorectal", "cases": 3200 },
    { "type": "Breast", "cases": 3200 },
    { "type": "Prostate", "cases": 2200 },
    { "type": "Skin", "cases": 1600 },
    { "type": "Bladder", "cases": 1500 }
  ]
}
```

- [ ] Create `src/data/demo-gallery/healthcare/cancer-by-sex.json`:
```json
{
  "data": [
    { "type": "Lung", "male": 2800, "female": 1400 },
    { "type": "Colorectal", "male": 1800, "female": 1400 },
    { "type": "Breast", "male": 0, "female": 3200 },
    { "type": "Prostate", "male": 2200, "female": 0 },
    { "type": "Skin", "male": 900, "female": 700 },
    { "type": "Bladder", "male": 1100, "female": 400 }
  ]
}
```

- [ ] Create `src/data/demo-gallery/healthcare/cancer-mortality.json`:
```json
{
  "data": [
    { "type": "Lung", "mortality": 185 },
    { "type": "Colorectal", "mortality": 75 },
    { "type": "Breast", "mortality": 45 },
    { "type": "Prostate", "mortality": 38 },
    { "type": "Pancreas", "mortality": 52 },
    { "type": "Stomach", "mortality": 28 }
  ]
}
```

- [ ] Create `src/data/demo-gallery/healthcare/cancer-trends.json`:
```json
{
  "data": [
    { "year": 2015, "rate": 185 },
    { "year": 2016, "rate": 183 },
    { "year": 2017, "rate": 180 },
    { "year": 2018, "rate": 178 },
    { "year": 2019, "rate": 176 },
    { "year": 2020, "rate": 182 },
    { "year": 2021, "rate": 179 },
    { "year": 2022, "rate": 175 }
  ]
}
```

- [ ] Copy existing healthcare data to `src/data/demo-gallery/healthcare/healthcare-workers.json`

- [ ] Create `src/data/demo-gallery/healthcare/screening-rates.json`:
```json
{
  "data": [
    { "type": "Cervical (Visual)", "serbia": 35, "eu": 70 },
    { "type": "Cervical (Pap)", "serbia": 25, "eu": 75 },
    { "type": "Breast (Mammography)", "serbia": 30, "eu": 72 },
    { "type": "Colorectal (FIT)", "serbia": 15, "eu": 55 }
  ]
}
```

- [ ] Create `src/data/demo-gallery/healthcare/survival-rates.json`:
```json
{
  "data": [
    { "cancer": "Breast", "serbia": 75, "eu": 83 },
    { "cancer": "Prostate", "serbia": 82, "eu": 87 },
    { "cancer": "Colorectal", "serbia": 55, "eu": 62 },
    { "cancer": "Lung", "serbia": 15, "eu": 20 },
    { "cancer": "Pancreas", "serbia": 8, "eu": 10 }
  ]
}
```

- [ ] Create `src/data/demo-gallery/economy/gdp-growth.json`:
```json
{
  "data": [
    { "year": 2018, "gdp": 4.4 },
    { "year": 2019, "gdp": 4.2 },
    { "year": 2020, "gdp": -0.9 },
    { "year": 2021, "gdp": 7.7 },
    { "year": 2022, "gdp": 2.5 },
    { "year": 2023, "gdp": 2.1 },
    { "year": 2024, "gdp": 3.0 },
    { "year": 2025, "gdp": 3.5 }
  ]
}
```

- [ ] Create `src/data/demo-gallery/economy/inflation.json`:
```json
{
  "data": [
    { "year": 2018, "inflation": 2.0, "gdp": 4.4, "industrial": 2.8 },
    { "year": 2019, "inflation": 1.9, "gdp": 4.2, "industrial": 0.5 },
    { "year": 2020, "inflation": 1.6, "gdp": -0.9, "industrial": -2.3 },
    { "year": 2021, "inflation": 4.1, "gdp": 7.7, "industrial": 5.8 },
    { "year": 2022, "inflation": 11.9, "gdp": 2.5, "industrial": -1.1 },
    { "year": 2023, "inflation": 12.4, "gdp": 2.1, "industrial": -3.5 },
    { "year": 2024, "inflation": 4.2, "gdp": 3.0, "industrial": 3.0 },
    { "year": 2025, "inflation": 3.5, "gdp": 3.5, "industrial": 2.2 }
  ]
}
```

- [ ] Create `src/data/demo-gallery/economy/wages.json`:
```json
{
  "data": [
    { "year": 2018, "salary": 46335 },
    { "year": 2019, "salary": 51128 },
    { "year": 2020, "salary": 54356 },
    { "year": 2021, "salary": 62021 },
    { "year": 2022, "salary": 76904 },
    { "year": 2023, "salary": 91712 },
    { "year": 2024, "salary": 107486 },
    { "year": 2025, "salary": 124089 }
  ]
}
```

- [ ] Create `src/data/demo-gallery/economy/employment.json`:
```json
{
  "data": [
    { "year": 2018, "unemployment": 12.9, "employment": 47.4 },
    { "year": 2019, "unemployment": 10.5, "employment": 49.0 },
    { "year": 2020, "unemployment": 9.9, "employment": 48.4 },
    { "year": 2021, "unemployment": 10.0, "employment": 49.2 },
    { "year": 2022, "unemployment": 9.0, "employment": 50.5 },
    { "year": 2023, "unemployment": 9.3, "employment": 51.0 },
    { "year": 2024, "unemployment": 8.2, "employment": 51.4 },
    { "year": 2025, "unemployment": 8.2, "employment": 51.3 }
  ]
}
```

- [ ] Copy existing regions data to `src/data/demo-gallery/society/regional-disparities.json`

- [ ] Copy existing diaspora data to `src/data/demo-gallery/migration/diaspora-destinations.json`

- [ ] Copy existing migration data to `src/data/demo-gallery/migration/migration-balance.json`

- [ ] Create `src/data/demo-gallery/migration/immigration-trends.json`:
```json
{
  "data": [
    { "year": 2015, "immigrants": 28000 },
    { "year": 2016, "immigrants": 29000 },
    { "year": 2017, "immigrants": 27000 },
    { "year": 2018, "immigrants": 30000 },
    { "year": 2019, "immigrants": 32000 },
    { "year": 2020, "immigrants": 25000 },
    { "year": 2021, "immigrants": 28000 },
    { "year": 2022, "immigrants": 35000 },
    { "year": 2023, "immigrants": 41273 },
    { "year": 2024, "immigrants": 38000 }
  ]
}
```

- [ ] Create `src/data/demo-gallery/migration/emigration-trends.json`:
```json
{
  "data": [
    { "year": 2015, "emigrants": 40000 },
    { "year": 2016, "emigrants": 42000 },
    { "year": 2017, "emigrants": 38000 },
    { "year": 2018, "emigrants": 41000 },
    { "year": 2019, "emigrants": 45000 },
    { "year": 2020, "emigrants": 35000 },
    { "year": 2021, "emigrants": 32000 },
    { "year": 2022, "emigrants": 29000 },
    { "year": 2023, "emigrants": 37000 },
    { "year": 2024, "emigrants": 46132 }
  ]
}
```

- [ ] Create `src/data/demo-gallery/society/education-levels.json`:
```json
{
  "data": [
    { "level": "Preschool", "students": 165000 },
    { "level": "Primary", "students": 480000 },
    { "level": "Secondary", "students": 290000 },
    { "level": "University", "students": 211000 },
    { "level": "Master/PhD", "students": 42000 }
  ]
}
```

- [ ] Create `src/data/demo-gallery/society/tourism.json`:
```json
{
  "data": [
    { "month": "Jan", "tourists2024": 78500, "tourists2023": 72100 },
    { "month": "Feb", "tourists2024": 82300, "tourists2023": 76400 },
    { "month": "Mar", "tourists2024": 105400, "tourists2023": 102800 },
    { "month": "Apr", "tourists2024": 128600, "tourists2023": 125200 },
    { "month": "May", "tourists2024": 145200, "tourists2023": 142800 },
    { "month": "Jun", "tourists2024": 168400, "tourists2023": 163500 },
    { "month": "Jul", "tourists2024": 198500, "tourists2023": 192400 },
    { "month": "Aug", "tourists2024": 215600, "tourists2023": 208300 },
    { "month": "Sep", "tourists2024": 156300, "tourists2023": 149800 },
    { "month": "Oct", "tourists2024": 124800, "tourists2023": 118600 },
    { "month": "Nov", "tourists2024": 92400, "tourists2023": 89200 },
    { "month": "Dec", "tourists2024": 88700, "tourists2023": 84500 }
  ]
}
```

- [ ] Create `src/data/demo-gallery/society/crime-statistics.json`:
```json
{
  "data": [
    { "type": "Property crimes", "cases": 24500 },
    { "type": "Traffic violations", "cases": 18900 },
    { "type": "Drug offenses", "cases": 8200 },
    { "type": "Violent crimes", "cases": 6800 },
    { "type": "Economic crimes", "cases": 9100 },
    { "type": "Other offenses", "cases": 6090 }
  ]
}
```

- [ ] Create `src/data/demo-gallery/society/vital-statistics.json`:
```json
{
  "data": [
    { "year": 2015, "births": 66004, "deaths": 101559 },
    { "year": 2016, "births": 65638, "deaths": 103702 },
    { "year": 2017, "births": 64875, "deaths": 102620 },
    { "year": 2018, "births": 63505, "deaths": 101573 },
    { "year": 2019, "births": 61597, "deaths": 101541 },
    { "year": 2020, "births": 61447, "deaths": 116829 },
    { "year": 2021, "births": 62180, "deaths": 136622 },
    { "year": 2022, "births": 60512, "deaths": 109203 },
    { "year": 2023, "births": 61052, "deaths": 97081 },
    { "year": 2024, "births": 60845, "deaths": 98230 }
  ]
}
```

- [ ] Create `src/data/demo-gallery/society/labour-market.json`:
```json
{
  "data": [
    { "year": 2018, "unemployment": 12.9, "employment": 47.4, "salary": 46335 },
    { "year": 2019, "unemployment": 10.5, "employment": 49.0, "salary": 51128 },
    { "year": 2020, "unemployment": 9.9, "employment": 48.4, "salary": 54356 },
    { "year": 2021, "unemployment": 10.0, "employment": 49.2, "salary": 62021 },
    { "year": 2022, "unemployment": 9.0, "employment": 50.5, "salary": 76904 },
    { "year": 2023, "unemployment": 9.3, "employment": 51.0, "salary": 91712 },
    { "year": 2024, "unemployment": 8.2, "employment": 51.4, "salary": 107486 },
    { "year": 2025, "unemployment": 8.2, "employment": 51.3, "salary": 124089 }
  ]
}
```

- [ ] Commit: `feat(demo-gallery): add data files for all 28 charts`

### Task 3: Create Demo Gallery Examples

- [ ] Create `src/lib/examples/demo-gallery-examples.ts` with all 28 chart configurations
- [ ] Import all data files
- [ ] Create FeaturedExampleConfig for each chart with localized titles/descriptions
- [ ] Export `demoGalleryExamples` array
- [ ] Export helper functions: `getDemoExamplesByCategory()`, `getDemoExampleById()`
- [ ] Run: `npm run type-check`
- [ ] Commit: `feat(demo-gallery): add chart configurations`

### Task 4: Create Demo Gallery Components

- [ ] Create `src/components/demo-gallery/` directory

- [ ] Create `src/components/demo-gallery/DemoGalleryTabs.tsx`:
```typescript
'use client'

import type { Locale } from '@/lib/i18n/config'
import type { ShowcaseCategory } from '@/lib/examples/types'

interface DemoGalleryTabsProps {
  activeCategory: ShowcaseCategory | 'all'
  onCategoryChange: (category: ShowcaseCategory | 'all') => void
  locale: Locale
  labels: Record<string, string>
}

const categories: (ShowcaseCategory | 'all')[] = ['all', 'demographics', 'healthcare', 'economy', 'migration', 'society']

export function DemoGalleryTabs({ activeCategory, onCategoryChange, locale, labels }: DemoGalleryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeCategory === cat
              ? 'bg-gov-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {labels[cat]}
        </button>
      ))}
    </div>
  )
}
```

- [ ] Create `src/components/demo-gallery/DemoGalleryCard.tsx`:
```typescript
'use client'

import type { FeaturedExampleConfig } from '@/lib/examples/types'
import { getLocalizedText } from '@/lib/examples/types'
import type { Locale } from '@/lib/i18n/config'
import { ChartRenderer } from '@/components/charts/ChartRenderer'

interface DemoGalleryCardProps {
  example: FeaturedExampleConfig
  locale: Locale
  onClick: () => void
}

export function DemoGalleryCard({ example, locale, onClick }: DemoGalleryCardProps) {
  const title = getLocalizedText(example.title, locale)

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer hover:border-blue-300"
    >
      <div className="h-48 bg-gray-50 dark:bg-gray-900 p-2">
        {example.inlineData ? (
          <ChartRenderer
            config={example.chartConfig}
            data={example.inlineData.observations}
            locale={locale}
            showInternalLegend={false}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No preview
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
          {title}
        </h3>
      </div>
    </div>
  )
}
```

- [ ] Create `src/components/demo-gallery/DemoGalleryModal.tsx`:
```typescript
'use client'

import { useState } from 'react'
import type { FeaturedExampleConfig } from '@/lib/examples/types'
import { getLocalizedText } from '@/lib/examples/types'
import type { Locale } from '@/lib/i18n/config'
import { ChartRenderer } from '@/components/charts/ChartRenderer'

interface DemoGalleryModalProps {
  example: FeaturedExampleConfig | null
  isOpen: boolean
  onClose: () => void
  locale: Locale
  labels: {
    close: string
    viewData: string
    hideData: string
  }
}

export function DemoGalleryModal({ example, isOpen, onClose, locale, labels }: DemoGalleryModalProps) {
  const [showData, setShowData] = useState(false)

  if (!isOpen || !example) return null

  const title = getLocalizedText(example.title, locale)
  const description = getLocalizedText(example.description, locale)
  const data = example.inlineData?.observations ?? []
  const columns = data.length > 0 ? Object.keys(data[0]) : []

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen px-4 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" />
        <div
          className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chart */}
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
            <div className="h-96 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              {example.inlineData && (
                <ChartRenderer
                  config={example.chartConfig}
                  data={example.inlineData.observations}
                  locale={locale}
                />
              )}
            </div>
          </div>

          {/* Data Toggle */}
          <div className="px-6 pb-4">
            <button
              onClick={() => setShowData(!showData)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {showData ? labels.hideData : labels.viewData}
            </button>
          </div>

          {/* Data Table */}
          {showData && data.length > 0 && (
            <div className="px-6 pb-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.slice(0, 20).map((row, i) => (
                    <tr key={i}>
                      {columns.map((col) => (
                        <td key={col} className="px-3 py-2 text-sm text-gray-900">
                          {String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length > 20 && (
                <p className="text-xs text-gray-400 mt-2">Showing first 20 of {data.length} rows</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] Create `src/components/demo-gallery/DemoGalleryClient.tsx`:
```typescript
'use client'

import { useState } from 'react'
import type { FeaturedExampleConfig, ShowcaseCategory } from '@/lib/examples/types'
import type { Locale } from '@/lib/i18n/config'
import { DemoGalleryTabs } from './DemoGalleryTabs'
import { DemoGalleryCard } from './DemoGalleryCard'
import { DemoGalleryModal } from './DemoGalleryModal'

interface DemoGalleryClientProps {
  examples: FeaturedExampleConfig[]
  locale: Locale
  labels: {
    title: string
    subtitle: string
    categories: Record<string, string>
    modal: {
      close: string
      viewData: string
      hideData: string
    }
  }
}

export function DemoGalleryClient({ examples, locale, labels }: DemoGalleryClientProps) {
  const [activeCategory, setActiveCategory] = useState<ShowcaseCategory | 'all'>('all')
  const [selectedExample, setSelectedExample] = useState<FeaturedExampleConfig | null>(null)

  const filteredExamples = activeCategory === 'all'
    ? examples
    : examples.filter((ex) => ex.category === activeCategory)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {labels.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {labels.subtitle}
        </p>
      </div>

      {/* Tabs */}
      <DemoGalleryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        locale={locale}
        labels={labels.categories}
      />

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredExamples.map((example) => (
          <DemoGalleryCard
            key={example.id}
            example={example}
            locale={locale}
            onClick={() => setSelectedExample(example)}
          />
        ))}
      </div>

      {/* Modal */}
      <DemoGalleryModal
        example={selectedExample}
        isOpen={!!selectedExample}
        onClose={() => setSelectedExample(null)}
        locale={locale}
        labels={labels.modal}
      />
    </div>
  )
}
```

- [ ] Create `src/components/demo-gallery/index.ts`:
```typescript
export { DemoGalleryClient } from './DemoGalleryClient'
export { DemoGalleryCard } from './DemoGalleryCard'
export { DemoGalleryModal } from './DemoGalleryModal'
export { DemoGalleryTabs } from './DemoGalleryTabs'
```

- [ ] Run: `npm run type-check`
- [ ] Commit: `feat(demo-gallery): add components`

### Task 5: Create Demo Gallery Page

- [ ] Create `src/app/[locale]/demo-gallery/page.tsx`:
```typescript
import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { demoGalleryExamples } from '@/lib/examples/demo-gallery-examples'
import { DemoGalleryClient } from '@/components/demo-gallery'

export default async function DemoGalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params
  const locale = resolveLocale(localeParam)
  const messages = getMessages(locale)

  return (
    <main className="container-custom py-8">
      <DemoGalleryClient
        examples={demoGalleryExamples}
        locale={locale}
        labels={{
          title: messages.demoGallery?.title ?? 'Serbia Data Gallery',
          subtitle: messages.demoGallery?.subtitle ?? 'Interactive visualizations',
          categories: messages.demoGallery?.categories ?? {},
          modal: messages.demoGallery?.modal ?? {
            close: 'Close',
            viewData: 'View Data',
            hideData: 'Hide Data',
          },
        }}
      />
    </main>
  )
}
```

- [ ] Run: `npm run type-check`
- [ ] Commit: `feat(demo-gallery): add page route`

### Task 6: Add i18n Keys

- [ ] Add to `src/lib/i18n/locales/en/common.json`:
```json
{
  "demoGallery": {
    "title": "Serbia Data Gallery",
    "subtitle": "28 interactive visualizations with real government data",
    "categories": {
      "all": "All",
      "demographics": "Demographics",
      "healthcare": "Healthcare",
      "economy": "Economy",
      "migration": "Migration",
      "society": "Society"
    },
    "modal": {
      "close": "Close",
      "viewData": "View Data",
      "hideData": "Hide Data"
    }
  }
}
```

- [ ] Add to `src/lib/i18n/locales/sr/common.json`:
```json
{
  "demoGallery": {
    "title": "Галерија података Србије",
    "subtitle": "28 интерактивних визуализација са стварним владиним подацима",
    "categories": {
      "all": "Све",
      "demographics": "Демографија",
      "healthcare": "Здравство",
      "economy": "Економија",
      "migration": "Миграција",
      "society": "Друштво"
    },
    "modal": {
      "close": "Затвори",
      "viewData": "Погледај податке",
      "hideData": "Сакриј податке"
    }
  }
}
```

- [ ] Add to `src/lib/i18n/locales/lat/common.json`:
```json
{
  "demoGallery": {
    "title": "Galerija podataka Srbije",
    "subtitle": "28 interaktivnih vizualizacija sa stvarnim vladinim podacima",
    "categories": {
      "all": "Sve",
      "demographics": "Demografija",
      "healthcare": "Zdravstvo",
      "economy": "Ekonomija",
      "migration": "Migracija",
      "society": "Društvo"
    },
    "modal": {
      "close": "Zatvori",
      "viewData": "Pogledaj podatke",
      "hideData": "Sakrij podatke"
    }
  }
}
```

- [ ] Commit: `feat(demo-gallery): add i18n translations`

### Task 7: Update Sidebar Navigation

- [ ] Modify `src/components/layout/Sidebar.tsx` to add demo gallery link:
  - Import `BarChart3` icon from lucide-react
  - Add `demoGallery` to messages interface
  - Add demo gallery nav item after gallery
  - Update any parent components that pass messages

- [ ] Run: `npm run type-check`
- [ ] Commit: `feat(demo-gallery): add sidebar navigation link`

### Task 8: Final Verification

- [ ] Run: `npm run build`
- [ ] Run: `npm run type-check`
- [ ] Run: `npm run lint`
- [ ] Manual test: Open http://localhost:3000/en/demo-gallery
- [ ] Manual test: Verify all 6 tabs work
- [ ] Manual test: Click a chart to open modal
- [ ] Manual test: Toggle data table in modal
- [ ] Manual test: Check sr-Cyrl and sr-Latn locales
- [ ] Commit: `feat(demo-gallery): complete implementation`
