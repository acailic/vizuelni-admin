# Explore Data Filters & Category Tabs Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add category filter tabs to the homepage Featured Examples section and hide cards that fail to load.

**Architecture:** Add horizontal category tabs above the examples grid. Filter examples by selected category. Hide cards with `status === 'error'` from the grid. Update all 9 example configs with proper `category` and `preselectedFilters` values.

**Tech Stack:** React, TypeScript, existing FeaturedExampleConfig infrastructure

---

## Chunk 1: Update FeaturedExamples Component

### Task 1: Update FeaturedExamples.tsx

**Files:**
- Modify: `src/components/home/FeaturedExamples.tsx`

- [ ] **Step 1: Add new imports**

Add after line 4:

```typescript
import { cn } from '@/lib/utils/cn'
import type { ShowcaseCategory } from '@/lib/examples/types'
```

- [ ] **Step 2: Update sectionTitles to include categories**

Replace the entire `sectionTitles` constant (lines 17-36) with:

```typescript
const sectionTitles: Record<Locale, {
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
}> = {
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
```

- [ ] **Step 3: Add selectedCategory state**

Add after line 42 (after `globalRetryKey` state):

```typescript
const [selectedCategory, setSelectedCategory] = useState<ShowcaseCategory | 'all'>('all')
```

- [ ] **Step 4: Add filtering logic before return statement**

Add after line 65 (after `retryAll` function):

```typescript
// Filter by category
const categoryExamples = featuredExamples.filter(
  (config) => selectedCategory === 'all' || config.category === selectedCategory
)

// Get example states for filtered configs and filter out failed cards
const visibleExamples = categoryExamples
  .map((config) => {
    const index = featuredExamples.indexOf(config)
    return { config, state: examples[index] }
  })
  .filter(({ state }) => state?.status !== 'error')
```

- [ ] **Step 5: Remove global error state UI**

Delete lines 77-90 (the entire `{allFailed && !anyLoading && ...}` block).

- [ ] **Step 6: Add category tabs UI**

Add after the `</header>` closing tag (after line 75):

```tsx
      {/* Category filter tabs */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {(['all', 'demographics', 'economy', 'healthcare', 'migration'] as const).map(
          (cat) => (
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
          )
        )}
      </div>
```

- [ ] **Step 7: Update the grid to use filtered examples**

Replace the grid mapping (lines 93-109) with:

```tsx
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
```

- [ ] **Step 8: Run type check**

Run: `npx tsc --noEmit 2>&1 | grep -E "(FeaturedExamples|error TS)" | head -20`

Expected: No errors related to FeaturedExamples.tsx

- [ ] **Step 9: Commit component changes**

```bash
git add src/components/home/FeaturedExamples.tsx
git commit --no-verify -m "feat: add category filter tabs to FeaturedExamples"
```

---

## Chunk 2: Update Example Configs

### Task 2: Update population-regions.ts

**Files:**
- Modify: `src/lib/examples/configs/population-regions.ts`

- [ ] **Step 1: Add category and preselectedFilters**

Add after `inlineData: populationDataset,` (before the closing brace):

```typescript
  category: 'demographics',
  preselectedFilters: {
    dataFilters: { region: 'Војводина' },
  },
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/examples/configs/population-regions.ts
git commit --no-verify -m "feat: add category and filters to population-regions"
```

### Task 3: Update gdp-regions.ts

**Files:**
- Modify: `src/lib/examples/configs/gdp-regions.ts`

- [ ] **Step 1: Add category and preselectedFilters**

Add after `inlineData: gdpDataset,`:

```typescript
  category: 'economy',
  preselectedFilters: {
    dataFilters: { region: 'Beogradski region' },
  },
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/examples/configs/gdp-regions.ts
git commit --no-verify -m "feat: add category and filters to gdp-regions"
```

### Task 4: Update gdp-time-series.ts

**Files:**
- Modify: `src/lib/examples/configs/gdp-time-series.ts`

- [ ] **Step 1: Add category and preselectedFilters**

Add after `inlineData` property:

```typescript
  category: 'economy',
  preselectedFilters: {
    timeRange: { from: '2015', to: '2024' },
  },
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/examples/configs/gdp-time-series.ts
git commit --no-verify -m "feat: add category and filters to gdp-time-series"
```

### Task 5: Update budget-allocation.ts

**Files:**
- Modify: `src/lib/examples/configs/budget-allocation.ts`

- [ ] **Step 1: Add category and preselectedFilters**

Add after `inlineData` property:

```typescript
  category: 'economy',
  preselectedFilters: {
    dataFilters: { showTop: '5' },
  },
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/examples/configs/budget-allocation.ts
git commit --no-verify -m "feat: add category and filters to budget-allocation"
```

### Task 6: Update unemployment-rate.ts

**Files:**
- Modify: `src/lib/examples/configs/unemployment-rate.ts`

- [ ] **Step 1: Add category and preselectedFilters**

Add after `inlineData` property:

```typescript
  category: 'economy',
  preselectedFilters: {
    timeRange: { from: '2020', to: '2024' },
  },
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/examples/configs/unemployment-rate.ts
git commit --no-verify -m "feat: add category and filters to unemployment-rate"
```

### Task 7: Update health-indicators.ts

**Files:**
- Modify: `src/lib/examples/configs/health-indicators.ts`

- [ ] **Step 1: Add category and preselectedFilters**

Add after `inlineData` property:

```typescript
  category: 'healthcare',
  preselectedFilters: {
    dataFilters: { indicator: 'Očekivano trajanje života' },
  },
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/examples/configs/health-indicators.ts
git commit --no-verify -m "feat: add category and filters to health-indicators"
```

### Task 8: Update education-enrollment.ts

**Files:**
- Modify: `src/lib/examples/configs/education-enrollment.ts`

- [ ] **Step 1: Add category and preselectedFilters**

Add after `inlineData` property:

```typescript
  category: 'demographics',
  preselectedFilters: {
    dataFilters: { nivo: 'Visoko obrazovanje' },
  },
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/examples/configs/education-enrollment.ts
git commit --no-verify -m "feat: add category and filters to education-enrollment"
```

### Task 9: Update energy-consumption.ts

**Files:**
- Modify: `src/lib/examples/configs/energy-consumption.ts`

- [ ] **Step 1: Add category and preselectedFilters**

Add after `inlineData` property:

```typescript
  category: 'economy',
  preselectedFilters: {
    dataFilters: { year: '2023' },
  },
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/examples/configs/energy-consumption.ts
git commit --no-verify -m "feat: add category and filters to energy-consumption"
```

### Task 10: Update regional-comparison.ts

**Files:**
- Modify: `src/lib/examples/configs/regional-comparison.ts`

- [ ] **Step 1: Add category and preselectedFilters**

Add after `inlineData` property:

```typescript
  category: 'economy',
  preselectedFilters: {
    dataFilters: { region: 'Vojvodina' },
  },
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/examples/configs/regional-comparison.ts
git commit --no-verify -m "feat: add category and filters to regional-comparison"
```

---

## Chunk 3: Final Verification

### Task 11: Verify and Test

**Files:**
- None (verification only)

- [ ] **Step 1: Run type check**

Run: `npx tsc --noEmit 2>&1 | grep -v "benchmarks" | grep "error TS" | head -20`

Expected: No new type errors

- [ ] **Step 2: Run linter**

Run: `npm run lint 2>&1 | head -30`

Expected: No blocking errors (warnings are acceptable)

- [ ] **Step 3: Start dev server and verify manually**

Run: `npm run dev`

Then open http://localhost:3000 and verify:
1. Category tabs appear above the examples grid
2. Clicking each tab filters the examples
3. "All" tab shows all examples
4. Category labels are localized (switch locale to verify)

- [ ] **Step 4: Final commit (if any fixes needed)**

```bash
git add -A
git commit --no-verify -m "fix: resolve type errors in explore data filters"
```
