# Swiss UI Enhancements Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Swiss-inspired browse filters, statistics dashboard, and feedback system to the Serbian government data visualization platform.

**Architecture:** Three independent components that can be implemented in parallel. Enhanced browse uses existing `FilterSidebar.tsx` as base. Statistics uses existing `SavedChart` model with `views` field. Feedback adds to existing `Footer.tsx`.

**Tech Stack:** Next.js 14 App Router, TypeScript, Prisma, Tailwind CSS, React Query

**Spec:** `docs/plans/2026-03-13-swiss-ui-enhancements-design.md`

---

## File Structure

### Enhanced Browse (Modify Existing)
```
src/
├── app/[locale]/browse/
│   └── page.tsx              # Add sidebar layout wrapper
├── components/browse/
│   ├── FilterSidebar.tsx     # Enhance with collapsible sections
│   ├── FilterSection.tsx     # NEW: Collapsible filter panel
│   └── SearchBar.tsx         # Existing (no changes)
└── types/
    └── browse.ts             # Add FilterSectionProps type
```

### Statistics Dashboard (New)
```
src/
├── app/
│   ├── [locale]/statistics/
│   │   └── page.tsx          # NEW: Statistics page
│   └── api/statistics/
│       └── route.ts          # NEW: API endpoint
├── components/statistics/
│   ├── StatCard.tsx          # NEW: Metric display card
│   ├── StatsOverview.tsx     # NEW: Key metrics section
│   ├── PopularChartsGrid.tsx # NEW: Charts grid
│   └── PopularChartCard.tsx  # NEW: Chart thumbnail card
└── lib/statistics/
    ├── types.ts              # NEW: TypeScript types
    └── queries.ts            # NEW: Database queries
```

### Feedback System (Modify Existing)
```
src/
├── components/layout/
│   ├── Footer.tsx            # Add FeedbackSection
│   └── FeedbackSection.tsx   # NEW: Feedback cards
└── lib/feedback/
    ├── types.ts              # NEW: TypeScript types
    └── email-templates.ts    # NEW: Email generator

public/locales/
├── sr-Cyrl/common.json       # Add feedback keys
├── sr-Latn/common.json       # Add feedback keys
└── en/common.json            # Add feedback keys
```

---

## Chunk 1: Enhanced Browse Page

### Task 1.1: Add FilterSection Component

**Files:**
- Create: `src/components/browse/FilterSection.tsx`
- Test: `src/components/browse/__tests__/FilterSection.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/browse/__tests__/FilterSection.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterSection } from '../FilterSection'

const mockOptions = [
  { value: 'admin', label: 'Administration', count: 55 },
  { value: 'health', label: 'Health', count: 25 },
]

describe('FilterSection', () => {
  it('renders title and options with counts', () => {
    render(
      <FilterSection
        title="Themes"
        options={mockOptions}
        selectedValue={undefined}
        onSelect={jest.fn()}
        labels={{ showAll: 'Show all' }}
      />
    )

    expect(screen.getByText('Themes')).toBeInTheDocument()
    expect(screen.getByText('Administration (55)')).toBeInTheDocument()
    expect(screen.getByText('Health (25)')).toBeInTheDocument()
  })

  it('calls onSelect when option is clicked', () => {
    const onSelect = jest.fn()
    render(
      <FilterSection
        title="Themes"
        options={mockOptions}
        selectedValue={undefined}
        onSelect={onSelect}
        labels={{ showAll: 'Show all' }}
      />
    )

    fireEvent.click(screen.getByText('Administration (55)'))
    expect(onSelect).toHaveBeenCalledWith('admin')
  })

  it('highlights selected option', () => {
    render(
      <FilterSection
        title="Themes"
        options={mockOptions}
        selectedValue="health"
        onSelect={jest.fn()}
        labels={{ showAll: 'Show all' }}
      />
    )

    const healthOption = screen.getByText('Health (25)').closest('button')
    expect(healthOption).toHaveClass('bg-gov-secondary/10')
  })

  it('collapses and expands when header is clicked', () => {
    render(
      <FilterSection
        title="Themes"
        options={mockOptions}
        selectedValue={undefined}
        onSelect={jest.fn()}
        labels={{ showAll: 'Show all' }}
        defaultExpanded={true}
      />
    )

    // Initially expanded - options visible
    expect(screen.getByText('Administration (55)')).toBeVisible()

    // Click header to collapse
    fireEvent.click(screen.getByText('Themes'))
    expect(screen.queryByText('Administration (55)')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/browse/__tests__/FilterSection.test.tsx`
Expected: FAIL with "Cannot find module '../FilterSection'"

- [ ] **Step 3: Write minimal implementation**

```tsx
// src/components/browse/FilterSection.tsx
'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { FacetOption } from '@/types/browse'

export interface FilterSectionProps {
  title: string
  options: FacetOption[]
  selectedValue: string | undefined
  onSelect: (value: string | undefined) => void
  labels: { showAll: string }
  defaultExpanded?: boolean
}

export function FilterSection({
  title,
  options,
  selectedValue,
  onSelect,
  labels,
  defaultExpanded = true,
}: FilterSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className="border-b border-gray-100 py-3 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {title}
        </span>
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="mt-3 space-y-1">
          <button
            type="button"
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
              !selectedValue
                ? 'bg-gov-secondary/10 font-medium text-gov-secondary'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => onSelect(undefined)}
          >
            {labels.showAll}
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                selectedValue === option.value
                  ? 'bg-gov-secondary/10 font-medium text-gov-secondary'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => onSelect(option.value)}
            >
              <span>{option.label}</span>
              {option.count !== undefined && (
                <span className="text-xs text-gray-400">({option.count})</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/browse/__tests__/FilterSection.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/browse/FilterSection.tsx src/components/browse/__tests__/FilterSection.test.tsx
git commit -m "feat(browse): add FilterSection component for collapsible filters"
```

---

### Task 1.2: Enhance FilterSidebar with Collapsible Sections

**Files:**
- Modify: `src/components/browse/FilterSidebar.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// Add to src/components/browse/__tests__/FilterSidebar.test.tsx
import { render, screen } from '@testing-library/react'
import { FilterSidebar } from '../FilterSidebar'

const mockFacets = {
  organizations: [
    { value: 'org1', label: 'Organization 1', count: 10 },
  ],
  topics: [
    { value: 'topic1', label: 'Topic 1', count: 5 },
  ],
  formats: [],
  frequencies: [],
}

const mockLabels = {
  title: 'Filters',
  organization: 'Organizations',
  topic: 'Topics',
  format: 'Format',
  frequency: 'Frequency',
  clear: 'Clear',
  all: 'All',
  showAll: 'Show all',
}

describe('FilterSidebar', () => {
  it('renders collapsible sections for themes and organizations', () => {
    render(
      <FilterSidebar
        facets={mockFacets}
        labels={mockLabels}
        selected={{}}
      />
    )

    expect(screen.getByText('Topics')).toBeInTheDocument()
    expect(screen.getByText('Organizations')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/browse/__tests__/FilterSidebar.test.tsx`
Expected: FAIL (test file doesn't exist yet)

- [ ] **Step 3: Update FilterSidebar to use FilterSection**

```tsx
// src/components/browse/FilterSidebar.tsx
'use client'

import { useSearch } from '@/lib/hooks/useSearch'
import { FilterSection } from './FilterSection'
import type { BrowseFacets, BrowseSearchParams } from '@/types/browse'

interface FilterSidebarLabels {
  title: string
  organization: string
  topic: string
  format: string
  frequency: string
  clear: string
  all: string
  showAll: string
}

interface FilterSidebarProps {
  facets: BrowseFacets
  labels: FilterSidebarLabels
  selected: BrowseSearchParams
}

export function FilterSidebar({ facets, labels, selected }: FilterSidebarProps) {
  const { setSearchParams } = useSearch()

  const handleSelect = (key: keyof BrowseSearchParams, value: string | undefined) => {
    setSearchParams({ [key]: value }, true)
  }

  const clearFilters = () => {
    setSearchParams(
      {
        organization: undefined,
        topic: undefined,
        format: undefined,
        frequency: undefined,
      },
      true
    )
  }

  return (
    <aside className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-gray-500">
          {labels.title}
        </h2>
        <button
          className="text-sm font-medium text-gov-primary transition hover:text-gov-accent"
          onClick={clearFilters}
          type="button"
        >
          {labels.clear}
        </button>
      </div>

      <div className="space-y-1">
        <FilterSection
          title={labels.topic}
          options={facets.topics}
          selectedValue={selected.topic}
          onSelect={(value) => handleSelect('topic', value)}
          labels={{ showAll: labels.showAll }}
          defaultExpanded={true}
        />

        <FilterSection
          title={labels.organization}
          options={facets.organizations}
          selectedValue={selected.organization}
          onSelect={(value) => handleSelect('organization', value)}
          labels={{ showAll: labels.showAll }}
          defaultExpanded={true}
        />

        <FilterSection
          title={labels.format}
          options={facets.formats}
          selectedValue={selected.format}
          onSelect={(value) => handleSelect('format', value)}
          labels={{ showAll: labels.showAll }}
          defaultExpanded={false}
        />

        <FilterSection
          title={labels.frequency}
          options={facets.frequencies}
          selectedValue={selected.frequency}
          onSelect={(value) => handleSelect('frequency', value)}
          labels={{ showAll: labels.showAll }}
          defaultExpanded={false}
        />
      </div>
    </aside>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/browse/__tests__/FilterSidebar.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/browse/FilterSidebar.tsx src/components/browse/__tests__/FilterSidebar.test.tsx
git commit -m "feat(browse): enhance FilterSidebar with collapsible filter sections"
```

---

### Task 1.3: Add Translation Keys for Browse Filters

**Files:**
- Modify: `public/locales/sr-Cyrl/common.json`
- Modify: `public/locales/sr-Latn/common.json`
- Modify: `public/locales/en/common.json`

- [ ] **Step 1: Add Serbian Cyrillic translations**

Add to `public/locales/sr-Cyrl/common.json` under `browse` key:

```json
{
  "browse": {
    "filters": {
      "title": "Филтери",
      "themes": "Теме",
      "organizations": "Организације",
      "formats": "Формати",
      "frequencies": "Учесталост",
      "showAll": "Прикажи све",
      "clear": "Очисти",
      "sortBy": "Сортирај по",
      "newest": "Најновије",
      "popular": "Популарно",
      "name": "Назив"
    }
  }
}
```

- [ ] **Step 2: Add Serbian Latin translations**

Add to `public/locales/sr-Latn/common.json`:

```json
{
  "browse": {
    "filters": {
      "title": "Filteri",
      "themes": "Teme",
      "organizations": "Organizacije",
      "formats": "Formati",
      "frequencies": "Učestalost",
      "showAll": "Prikaži sve",
      "clear": "Očisti",
      "sortBy": "Sortiraj po",
      "newest": "Najnovije",
      "popular": "Popularno",
      "name": "Naziv"
    }
  }
}
```

- [ ] **Step 3: Add English translations**

Add to `public/locales/en/common.json`:

```json
{
  "browse": {
    "filters": {
      "title": "Filters",
      "themes": "Themes",
      "organizations": "Organizations",
      "formats": "Formats",
      "frequencies": "Frequency",
      "showAll": "Show all",
      "clear": "Clear",
      "sortBy": "Sort by",
      "newest": "Newest",
      "popular": "Popular",
      "name": "Name"
    }
  }
}
```

- [ ] **Step 4: Verify JSON is valid**

Run: `npm run lint` or `node -e "JSON.parse(require('fs').readFileSync('public/locales/en/common.json'))"`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add public/locales/*/common.json
git commit -m "feat(i18n): add browse filter translation keys for all locales"
```

---

## Chunk 2: Statistics Dashboard

### Task 2.1: Create Statistics Types

**Files:**
- Create: `src/lib/statistics/types.ts`

- [ ] **Step 1: Write types file**

```typescript
// src/lib/statistics/types.ts
export interface ChartStatistics {
  total: number
  perMonthAverage: number
  dashboards: number
}

export interface ViewStatistics {
  total: number
  perMonthAverage: number
  previews: number
}

export interface PopularChart {
  id: string
  title: string
  thumbnail: string | null
  views: number
  createdAt: Date
  createdBy: string | null
}

export interface DatasetStatistics {
  total: number
  usedInCharts: number
  organizations: number
}

export interface StatisticsResponse {
  charts: ChartStatistics
  views: ViewStatistics
  popularCharts: {
    allTime: PopularChart[]
    last30Days: PopularChart[]
  }
  datasets: DatasetStatistics
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/statistics/types.ts
git commit -m "feat(statistics): add statistics types"
```

---

### Task 2.2: Create Statistics Queries

**Files:**
- Create: `src/lib/statistics/queries.ts`
- Test: `src/lib/statistics/__tests__/queries.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/statistics/__tests__/queries.test.ts
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { getChartStatistics, getPopularCharts } from '../queries'
import { prisma } from '@/lib/db/prisma'

// Mock data setup would go here
describe('Statistics Queries', () => {
  it('getChartStatistics returns total count and monthly average', async () => {
    const stats = await getChartStatistics()

    expect(stats).toHaveProperty('total')
    expect(stats).toHaveProperty('perMonthAverage')
    expect(stats.total).toBeGreaterThanOrEqual(0)
    expect(stats.perMonthAverage).toBeGreaterThanOrEqual(0)
  })

  it('getPopularCharts returns charts sorted by views', async () => {
    const charts = await getPopularCharts(5)

    expect(charts.length).toBeLessThanOrEqual(5)
    // Verify sorted by views descending
    for (let i = 1; i < charts.length; i++) {
      expect(charts[i - 1].views).toBeGreaterThanOrEqual(charts[i].views)
    }
  })

  it('getPopularCharts with since parameter filters by date', async () => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const charts = await getPopularCharts(5, thirtyDaysAgo)

    charts.forEach(chart => {
      expect(chart.createdAt).toBeInstanceOf(Date)
      expect(chart.createdAt.getTime()).toBeGreaterThanOrEqual(thirtyDaysAgo.getTime())
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/statistics/__tests__/queries.test.ts`
Expected: FAIL with "Cannot find module '../queries'"

- [ ] **Step 3: Write implementation**

```typescript
// src/lib/statistics/queries.ts
import { prisma } from '@/lib/db/prisma'
import type {
  ChartStatistics,
  ViewStatistics,
  PopularChart,
  DatasetStatistics,
} from './types'

/**
 * Calculate months between two dates
 */
function monthsBetween(start: Date, end: Date): number {
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
  return Math.max(1, months)
}

/**
 * Get chart creation statistics
 */
export async function getChartStatistics(): Promise<ChartStatistics> {
  const [total, oldestChart] = await Promise.all([
    prisma.savedChart.count({
      where: { status: 'PUBLISHED' },
    }),
    prisma.savedChart.findFirst({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    }),
  ])

  const monthsActive = oldestChart
    ? monthsBetween(oldestChart.createdAt, new Date())
    : 1

  const perMonthAverage = Math.round(total / monthsActive)

  // Dashboards would be charts with specific layout type
  const dashboards = await prisma.savedChart.count({
    where: {
      status: 'PUBLISHED',
      // Assuming dashboards have a specific marker, adjust as needed
      // layoutType: 'dashboard',
    },
  })

  return {
    total,
    perMonthAverage,
    dashboards,
  }
}

/**
 * Get view statistics
 */
export async function getViewStatistics(): Promise<ViewStatistics> {
  const result = await prisma.savedChart.aggregate({
    where: { status: 'PUBLISHED' },
    _sum: { views: true },
  })

  const total = result._sum.views || 0

  // Calculate months since first chart
  const oldestChart = await prisma.savedChart.findFirst({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true },
  })

  const monthsActive = oldestChart
    ? monthsBetween(oldestChart.createdAt, new Date())
    : 1

  const perMonthAverage = Math.round(total / monthsActive)

  // Previews would need a separate field or model
  const previews = 0 // Placeholder until preview tracking is implemented

  return {
    total,
    perMonthAverage,
    previews,
  }
}

/**
 * Get popular charts
 */
export async function getPopularCharts(
  limit: number = 25,
  since?: Date
): Promise<PopularChart[]> {
  const charts = await prisma.savedChart.findMany({
    where: {
      status: 'PUBLISHED',
      ...(since && { createdAt: { gte: since } }),
    },
    orderBy: { views: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      thumbnail: true,
      views: true,
      createdAt: true,
      userId: true,
    },
  })

  return charts.map((chart) => ({
    id: chart.id,
    title: chart.title,
    thumbnail: chart.thumbnail,
    views: chart.views,
    createdAt: chart.createdAt,
    createdBy: chart.userId,
  }))
}

/**
 * Get dataset statistics
 */
export async function getDatasetStatistics(): Promise<DatasetStatistics> {
  // This would query actual dataset sources
  // Placeholder implementation
  const total = 0
  const usedInCharts = 0
  const organizations = 0

  return {
    total,
    usedInCharts,
    organizations,
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/statistics/__tests__/queries.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/statistics/queries.ts src/lib/statistics/__tests__/queries.test.ts
git commit -m "feat(statistics): add statistics database queries"
```

---

### Task 2.3: Create Statistics API Endpoint

**Files:**
- Create: `src/app/api/statistics/route.ts`

- [ ] **Step 1: Write API route**

```typescript
// src/app/api/statistics/route.ts
import { NextResponse } from 'next/server'
import {
  getChartStatistics,
  getViewStatistics,
  getPopularCharts,
  getDatasetStatistics,
} from '@/lib/statistics/queries'

export async function GET() {
  try {
    const [charts, views, popularChartsAllTime, popularChartsLast30Days, datasets] =
      await Promise.all([
        getChartStatistics(),
        getViewStatistics(),
        getPopularCharts(25),
        getPopularCharts(25, getDate30DaysAgo()),
        getDatasetStatistics(),
      ])

    return NextResponse.json({
      charts,
      views,
      popularCharts: {
        allTime: popularChartsAllTime,
        last30Days: popularChartsLast30Days,
      },
      datasets,
    })
  } catch (error) {
    console.error('Failed to fetch statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}

function getDate30DaysAgo(): Date {
  const date = new Date()
  date.setDate(date.getDate() - 30)
  return date
}
```

- [ ] **Step 2: Test endpoint manually**

Run: `curl http://localhost:3000/api/statistics`
Expected: JSON response with statistics data

- [ ] **Step 3: Commit**

```bash
git add src/app/api/statistics/route.ts
git commit -m "feat(api): add statistics API endpoint"
```

---

### Task 2.4: Create StatCard Component

**Files:**
- Create: `src/components/statistics/StatCard.tsx`

- [ ] **Step 1: Write component**

```tsx
// src/components/statistics/StatCard.tsx
import type { ReactNode } from 'react'

export interface StatCardProps {
  value: number | string
  label: string
  subtitle?: string
  icon?: ReactNode
}

export function StatCard({ value, label, subtitle, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-3xl font-bold text-[#0C1E42]">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          <p className="mt-1 text-sm font-medium text-gray-600">{label}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="rounded-full bg-gov-secondary/10 p-2 text-gov-secondary">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/statistics/StatCard.tsx
git commit -m "feat(statistics): add StatCard component"
```

---

### Task 2.5: Create PopularChartCard Component

**Files:**
- Create: `src/components/statistics/PopularChartCard.tsx`

- [ ] **Step 1: Write component**

```tsx
// src/components/statistics/PopularChartCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import type { PopularChart } from '@/lib/statistics/types'

export interface PopularChartCardProps {
  chart: PopularChart
  locale: string
  labels: {
    views: string
  }
}

export function PopularChartCard({ chart, locale, labels }: PopularChartCardProps) {
  return (
    <Link
      href={`/${locale}/chart/${chart.id}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-video bg-gray-100">
        {chart.thumbnail ? (
          <Image
            src={chart.thumbnail}
            alt={chart.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-gov-secondary">
          {chart.title}
        </h3>
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
          <Eye className="h-3 w-3" />
          <span>
            {chart.views.toLocaleString()} {labels.views}
          </span>
        </div>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/statistics/PopularChartCard.tsx
git commit -m "feat(statistics): add PopularChartCard component"
```

---

### Task 2.6: Create PopularChartsGrid Component

**Files:**
- Create: `src/components/statistics/PopularChartsGrid.tsx`

- [ ] **Step 1: Write component**

```tsx
// src/components/statistics/PopularChartsGrid.tsx
import { PopularChartCard } from './PopularChartCard'
import type { PopularChart } from '@/lib/statistics/types'

export interface PopularChartsGridProps {
  charts: PopularChart[]
  title: string
  subtitle?: string
  locale: string
  labels: {
    views: string
  }
}

export function PopularChartsGrid({
  charts,
  title,
  subtitle,
  locale,
  labels,
}: PopularChartsGridProps) {
  if (charts.length === 0) {
    return null
  }

  return (
    <section className="py-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#0C1E42]">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {charts.map((chart) => (
          <PopularChartCard
            key={chart.id}
            chart={chart}
            locale={locale}
            labels={labels}
          />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/statistics/PopularChartsGrid.tsx
git commit -m "feat(statistics): add PopularChartsGrid component"
```

---

### Task 2.7: Create StatsOverview Component

**Files:**
- Create: `src/components/statistics/StatsOverview.tsx`

- [ ] **Step 1: Write component**

```tsx
// src/components/statistics/StatsOverview.tsx
import { BarChart3, Eye, LayoutDashboard, Database } from 'lucide-react'
import { StatCard } from './StatCard'
import type { StatisticsResponse } from '@/lib/statistics/types'

export interface StatsOverviewProps {
  stats: StatisticsResponse
  labels: {
    chartsCreated: string
    totalViews: string
    perMonth: (count: number) => string
    dashboards: string
    datasetsUsed: string
  }
}

export function StatsOverview({ stats, labels }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        value={stats.charts.total}
        label={labels.chartsCreated}
        subtitle={labels.perMonth(stats.charts.perMonthAverage)}
        icon={<BarChart3 className="h-5 w-5" />}
      />
      <StatCard
        value={stats.views.total}
        label={labels.totalViews}
        subtitle={labels.perMonth(stats.views.perMonthAverage)}
        icon={<Eye className="h-5 w-5" />}
      />
      <StatCard
        value={stats.charts.dashboards}
        label={labels.dashboards}
        icon={<LayoutDashboard className="h-5 w-5" />}
      />
      <StatCard
        value={stats.datasets.usedInCharts}
        label={labels.datasetsUsed}
        icon={<Database className="h-5 w-5" />}
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/statistics/StatsOverview.tsx
git commit -m "feat(statistics): add StatsOverview component"
```

---

### Task 2.8: Create Statistics Page

**Files:**
- Create: `src/app/[locale]/statistics/page.tsx`

- [ ] **Step 1: Write page component**

```tsx
// src/app/[locale]/statistics/page.tsx
import { notFound } from 'next/navigation'
import { getMessages, resolveLocale } from '@/lib/i18n/messages'
import { StatisticsClient } from './StatisticsClient'

export default async function StatisticsPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = resolveLocale(params.locale)

  if (locale !== params.locale) {
    notFound()
  }

  const messages = getMessages(locale)

  return <StatisticsClient locale={locale} messages={messages} />
}
```

- [ ] **Step 2: Create client component**

```tsx
// src/app/[locale]/statistics/StatisticsClient.tsx
'use client'

import useSWR from 'swr'
import { StatsOverview } from '@/components/statistics/StatsOverview'
import { PopularChartsGrid } from '@/components/statistics/PopularChartsGrid'
import type { StatisticsResponse } from '@/lib/statistics/types'
import type { Locale } from '@/lib/i18n/config'

interface StatisticsMessages {
  statistics: {
    title: string
    chartsCreated: string
    totalViews: string
    perMonth: string
    popularChartsAllTime: string
    popularChartsLast30Days: string
    views: string
    dashboards: string
    datasetsUsed: string
  }
}

interface StatisticsClientProps {
  locale: Locale
  messages: StatisticsMessages
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function StatisticsClient({ locale, messages }: StatisticsClientProps) {
  const { data: stats, error, isLoading } = useSWR<StatisticsResponse>(
    '/api/statistics',
    fetcher,
    { revalidateOnFocus: false }
  )

  const t = messages.statistics

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-red-500">Failed to load statistics</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-[#0C1E42]">{t.title}</h1>

      <StatsOverview
        stats={stats}
        labels={{
          chartsCreated: t.chartsCreated,
          totalViews: t.totalViews,
          perMonth: (count) => t.perMonth.replace('{{count}}', String(count)),
          dashboards: t.dashboards,
          datasetsUsed: t.datasetsUsed,
        }}
      />

      <div className="mt-12">
        <PopularChartsGrid
          charts={stats.popularCharts.allTime}
          title={t.popularChartsAllTime}
          locale={locale}
          labels={{ views: t.views }}
        />
      </div>

      <div className="mt-8">
        <PopularChartsGrid
          charts={stats.popularCharts.last30Days}
          title={t.popularChartsLast30Days}
          locale={locale}
          labels={{ views: t.views }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Add translations for statistics page**

Add to each locale file:

```json
// public/locales/sr-Cyrl/common.json
{
  "statistics": {
    "title": "Статистике",
    "chartsCreated": "Креирано графикона",
    "totalViews": "Укупно прегледа",
    "perMonth": "~{{count}}/месечно",
    "popularChartsAllTime": "Најпопуларнији графикони (икада)",
    "popularChartsLast30Days": "Најпопуларнији графикони (последњих 30 дана)",
    "views": "прегледа",
    "dashboards": "Контролне табле",
    "datasetsUsed": "Коришћени скупови података"
  }
}
```

```json
// public/locales/sr-Latn/common.json
{
  "statistics": {
    "title": "Statistike",
    "chartsCreated": "Kreirano grafikona",
    "totalViews": "Ukupno pregleda",
    "perMonth": "~{{count}}/mesečno",
    "popularChartsAllTime": "Najpopularniji grafikoni (ikada)",
    "popularChartsLast30Days": "Najpopularniji grafikoni (poslednjih 30 dana)",
    "views": "pregleda",
    "dashboards": "Kontrolne table",
    "datasetsUsed": "Korišćeni skupovi podataka"
  }
}
```

```json
// public/locales/en/common.json
{
  "statistics": {
    "title": "Statistics",
    "chartsCreated": "Charts created",
    "totalViews": "Total views",
    "perMonth": "~{{count}}/month",
    "popularChartsAllTime": "Most Popular Charts (All Time)",
    "popularChartsLast30Days": "Most Popular Charts (Last 30 Days)",
    "views": "views",
    "dashboards": "Dashboards",
    "datasetsUsed": "Datasets used"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/statistics/ public/locales/*/common.json
git commit -m "feat(statistics): add statistics page with overview and popular charts"
```

---

## Chunk 3: Feedback System

### Task 3.1: Create Feedback Types

**Files:**
- Create: `src/lib/feedback/types.ts`

- [ ] **Step 1: Write types**

```typescript
// src/lib/feedback/types.ts
import type { Locale } from '@/lib/i18n/config'

export interface EmailTemplate {
  to: string
  subject: string
  body: string
}

export type FeedbackType = 'bug' | 'feature'

export interface FeedbackLabels {
  foundBug: string
  reportBugDescription: string
  reportBug: string
  newFeature: string
  featureDescription: string
  submit: string
}

export function generateMailtoLink(template: EmailTemplate): string {
  const subject = encodeURIComponent(template.subject)
  const body = encodeURIComponent(template.body)
  return `mailto:${template.to}?subject=${subject}&body=${body}`
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/feedback/types.ts
git commit -m "feat(feedback): add feedback types and mailto generator"
```

---

### Task 3.2: Create Email Templates

**Files:**
- Create: `src/lib/feedback/email-templates.ts`

- [ ] **Step 1: Write email template generator**

```typescript
// src/lib/feedback/email-templates.ts
import type { Locale } from '@/lib/i18n/config'
import type { EmailTemplate } from './types'

const FEEDBACK_EMAIL = 'feedback@vizuelni-admin.rs' // Replace with actual email

const templates: Record<
  Locale,
  {
    bug: { subject: string; body: string }
    feature: { subject: string; body: string }
  }
> = {
  'sr-Cyrl': {
    bug: {
      subject: 'Пријава грешке - Визуелни Админ',
      body: `Опис грешке:
[Опишите шта се десило]

Кораци за репродукцију:
1.
2.
3.

Очекивано понашање:
[Шта сте очекивали да се деси]

Претраживач и верзија:
[нпр. Chrome 120]

Ваша контакт информација (опционално):
Име:
Е-пошта:
`,
    },
    feature: {
      subject: 'Предлог нове функције - Визуелни Админ',
      body: `Опис проблема:
[Који проблем ова функција треба да реши?]

Предложено решење:
[Опишите функцију коју бисте желели]

Алтернативе:
[Да ли сте разматрали друге опције?]

Утицај:
[Колико би ово било корисно?]

Ваша контакт информација (опционално):
Име:
Е-пошта:
`,
    },
  },
  'sr-Latn': {
    bug: {
      subject: 'Prijava greške - Vizuelni Admin',
      body: `Opis greške:
[Opišite šta se desilo]

Koraci za reprodukciju:
1.
2.
3.

Očekivano ponašanje:
[Šta ste očekivali da se desi]

Pretraživač i verzija:
[npr. Chrome 120]

Vaša kontakt informacija (opcionalno):
Ime:
E-pošta:
`,
    },
    feature: {
      subject: 'Predlog nove funkcije - Vizuelni Admin',
      body: `Opis problema:
[Koji problem ova funkcija treba da reši?]

Predloženo rešenje:
[Opišite funkciju koju biste želeli]

Alternative:
[Da li ste razmatrali druge opcije?]

Uticaj:
[Koliko bi ovo bilo korisno?]

Vaša kontakt informacija (opcionalno):
Ime:
E-pošta:
`,
    },
  },
  en: {
    bug: {
      subject: 'Bug Report - Vizuelni Admin',
      body: `Bug Description:
[Describe what happened]

Steps to Reproduce:
1.
2.
3.

Expected Behavior:
[What did you expect to happen?]

Browser and Version:
[e.g., Chrome 120]

Your Contact Information (optional):
Name:
Email:
`,
    },
    feature: {
      subject: 'Feature Request - Vizuelni Admin',
      body: `Problem Description:
[What problem would this feature solve?]

Proposed Solution:
[Describe the feature you'd like]

Alternatives Considered:
[Have you considered other options?]

Impact:
[How useful would this be?]

Your Contact Information (optional):
Name:
Email:
`,
    },
  },
}

export function generateBugReportEmail(locale: Locale): EmailTemplate {
  const template = templates[locale].bug
  return {
    to: FEEDBACK_EMAIL,
    subject: template.subject,
    body: template.body,
  }
}

export function generateFeatureRequestEmail(locale: Locale): EmailTemplate {
  const template = templates[locale].feature
  return {
    to: FEEDBACK_EMAIL,
    subject: template.subject,
    body: template.body,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/feedback/email-templates.ts
git commit -m "feat(feedback): add email template generator for bug reports and feature requests"
```

---

### Task 3.3: Create FeedbackSection Component

**Files:**
- Create: `src/components/layout/FeedbackSection.tsx`

- [ ] **Step 1: Write component**

```tsx
// src/components/layout/FeedbackSection.tsx
import { Bug, Lightbulb } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { FeedbackLabels } from '@/lib/feedback/types'
import { generateMailtoLink } from '@/lib/feedback/types'
import { generateBugReportEmail, generateFeatureRequestEmail } from '@/lib/feedback/email-templates'

interface FeedbackSectionProps {
  locale: Locale
  labels: FeedbackLabels
}

export function FeedbackSection({ locale, labels }: FeedbackSectionProps) {
  const bugEmail = generateBugReportEmail(locale)
  const featureEmail = generateFeatureRequestEmail(locale)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Bug Report Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-red-100 p-2">
            <Bug className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="font-semibold text-[#0C1E42]">{labels.foundBug}</h3>
        </div>
        <p className="mb-4 text-sm text-gray-600">{labels.reportBugDescription}</p>
        <a
          href={generateMailtoLink(bugEmail)}
          className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          {labels.reportBug}
        </a>
      </div>

      {/* Feature Request Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-amber-100 p-2">
            <Lightbulb className="h-5 w-5 text-amber-600" />
          </div>
          <h3 className="font-semibold text-[#0C1E42]">{labels.newFeature}</h3>
        </div>
        <p className="mb-4 text-sm text-gray-600">{labels.featureDescription}</p>
        <a
          href={generateMailtoLink(featureEmail)}
          className="inline-flex items-center rounded-lg bg-gov-secondary px-4 py-2 text-sm font-medium text-white transition hover:bg-gov-accent"
        >
          {labels.submit}
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/FeedbackSection.tsx
git commit -m "feat(feedback): add FeedbackSection component"
```

---

### Task 3.4: Update Footer with Feedback Section

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Add FeedbackSection to Footer**

Update `src/components/layout/Footer.tsx`:

```tsx
'use client'

import { memo } from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { FeedbackSection } from './FeedbackSection'
import type { Locale } from '@/lib/i18n/config'

interface FooterProps {
  locale: Locale
  messages: {
    siteName: string
    about: string
    privacy: string
    terms: string
    accessibility: string
    dataSources: string
    version: string
    allRightsReserved: string
    usefulLinks: string
    resources: string
    furtherInfo?: string
  }
  feedbackLabels?: {
    foundBug: string
    reportBugDescription: string
    reportBug: string
    newFeature: string
    featureDescription: string
    submit: string
  }
}

function FooterComponent({ locale, messages, feedbackLabels }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const version = process.env.npm_package_version || '1.0.0'

  const footerLinks = [
    { href: `/${locale}/about`, label: messages.about },
    { href: `/${locale}/privacy`, label: messages.privacy },
    { href: `/${locale}/terms`, label: messages.terms },
    { href: `/${locale}/accessibility`, label: messages.accessibility },
  ]

  const externalLinks = [
    { href: 'https://www.data.gov.rs', label: 'data.gov.rs' },
  ]

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Feedback Section */}
        {feedbackLabels && (
          <div className="mb-8">
            <h3 className="mb-4 text-sm font-semibold text-[#0C1E42]">
              {messages.furtherInfo || 'Further Information'}
            </h3>
            <FeedbackSection locale={locale} labels={feedbackLabels} />
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          {/* About section */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#0C1E42]">{messages.siteName}</h3>
            <p className="text-sm text-slate-600">
              {locale === 'sr-Cyrl'
                ? 'Отворена платформа за визуелизацију података'
                : locale === 'sr-Latn'
                  ? 'Otvorena platforma za vizualizaciju podataka'
                  : 'Open platform for data visualization'}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#0C1E42]">{messages.usefulLinks}</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-600 transition-colors hover:text-[#C6363C]">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/${locale}/statistics`} className="text-sm text-slate-600 transition-colors hover:text-[#C6363C]">
                  {locale === 'sr-Cyrl' ? 'Статистике' : locale === 'sr-Latn' ? 'Statistike' : 'Statistics'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#0C1E42]">{messages.resources}</h3>
            <ul className="space-y-2">
              {externalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-slate-600 transition-colors hover:text-[#C6363C]"
                  >
                    {link.label}
                    <ExternalLink className="ml-1 h-3 w-3" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 bg-[#0C1E42] text-white">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex flex-col items-center justify-between gap-2 md:flex-row md:gap-4">
            <div className="text-xs text-slate-300">
              © {currentYear} {messages.siteName}. {messages.allRightsReserved}.
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>
                {messages.dataSources}: data.gov.rs
              </span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">
                {messages.version}: {version}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export const Footer = memo(FooterComponent)
```

- [ ] **Step 2: Add feedback translations to locale files**

Add to each locale file:

```json
// Add to public/locales/sr-Cyrl/common.json
{
  "feedback": {
    "foundBug": "Пронашли сте грешку?",
    "reportBugDescription": "Пријавите је да бисмо је брзо исправили",
    "reportBug": "Пријави грешку",
    "newFeature": "Нова функција?",
    "featureDescription": "Пошаљите предлоге да обликујете будућност",
    "submit": "Пошаљи"
  },
  "footer": {
    "furtherInfo": "Додатне информације"
  }
}
```

```json
// Add to public/locales/sr-Latn/common.json
{
  "feedback": {
    "foundBug": "Pronašli ste grešku?",
    "reportBugDescription": "Prijavite je da bismo je brzo ispravili",
    "reportBug": "Prijavi grešku",
    "newFeature": "Nova funkcija?",
    "featureDescription": "Pošaljite predloge da oblikujete budućnost",
    "submit": "Pošalji"
  },
  "footer": {
    "furtherInfo": "Dodatne informacije"
  }
}
```

```json
// Add to public/locales/en/common.json
{
  "feedback": {
    "foundBug": "Found a bug?",
    "reportBugDescription": "Report it so we can fix it fast",
    "reportBug": "Report a bug",
    "newFeature": "New feature?",
    "featureDescription": "Submit requests to shape the future",
    "submit": "Submit"
  },
  "footer": {
    "furtherInfo": "Further Information"
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.tsx public/locales/*/common.json
git commit -m "feat(feedback): integrate FeedbackSection into Footer with translations"
```

---

## Final Steps

### Task 4.1: Integration Testing

- [ ] **Step 1: Run full test suite**

Run: `npm test`
Expected: All tests pass

- [ ] **Step 2: Run type check**

Run: `npm run type-check`
Expected: No type errors

- [ ] **Step 3: Run linter**

Run: `npm run lint`
Expected: No lint errors

- [ ] **Step 4: Manual testing**

1. Navigate to `/browse` - verify filter sidebar with collapsible sections
2. Navigate to `/statistics` - verify stats display and popular charts
3. Scroll to footer - verify feedback section links work
4. Test all 3 locales (sr-Cyrl, sr-Latn, en)

---

### Task 4.2: Create Goose Recipe Input

**Files:**
- Create: `recipes/inputs/feature-swiss-ui-enhancements.md`

- [ ] **Step 1: Write recipe input**

```yaml
id: swiss-ui-enhancements
name: Swiss UI Enhancements
description: Add Swiss-inspired browse filters, statistics dashboard, and feedback system
priority: high
status: ready

spec: docs/plans/2026-03-13-swiss-ui-enhancements-design.md
plan: docs/plans/2026-03-13-swiss-ui-enhancements-implementation.md

components:
  - name: enhanced-browse
    priority: primary
    files:
      - src/components/browse/FilterSection.tsx
      - src/components/browse/FilterSidebar.tsx

  - name: statistics-dashboard
    priority: secondary
    files:
      - src/app/[locale]/statistics/page.tsx
      - src/app/[locale]/statistics/StatisticsClient.tsx
      - src/app/api/statistics/route.ts
      - src/components/statistics/*.tsx
      - src/lib/statistics/*.ts

  - name: feedback-system
    priority: tertiary
    files:
      - src/components/layout/Footer.tsx
      - src/components/layout/FeedbackSection.tsx
      - src/lib/feedback/*.ts
      - public/locales/*/common.json
```

- [ ] **Step 2: Commit**

```bash
git add recipes/inputs/feature-swiss-ui-enhancements.md
git commit -m "feat(recipes): add Swiss UI enhancements recipe input"
```

---

### Task 4.3: Final Commit and Summary

- [ ] **Step 1: Create summary commit**

```bash
git add -A
git commit -m "feat: implement Swiss UI enhancements

- Add collapsible filter sections to browse page
- Add statistics dashboard with popular charts
- Add feedback system with email templates
- Add translations for all 3 locales (sr-Cyrl, sr-Latn, en)

Closes: Swiss UI Enhancements feature

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

- [ ] **Step 2: Verify all files committed**

Run: `git status`
Expected: "nothing to commit, working tree clean"

---

## Success Criteria Checklist

- [ ] Browse page shows theme categories with counts
- [ ] Browse page shows organizations with counts
- [ ] Filtering by theme/organization works correctly
- [ ] Statistics page displays all metrics accurately
- [ ] Popular charts grid shows top 25 charts
- [ ] Footer has bug report and feature request links
- [ ] Email templates are properly formatted
- [ ] All text localized in sr-Cyrl, sr-Latn, en
- [ ] All components pass accessibility checks
- [ ] All tests pass
