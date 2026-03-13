# Explore Data Filters & Category Tabs Design

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan.

**Goal:** Add category filter tabs to the homepage Featured Examples section and hide cards that fail to load.

**Architecture:** Add horizontal category tabs above the examples grid. Filter examples by selected category. Hide cards with `status === 'error'` from the grid. Update all 9 example configs with proper `category` and `preselectedFilters` values.

**Tech Stack:** React, TypeScript, existing FeaturedExampleConfig infrastructure

---

## Component Changes

### FeaturedExamples.tsx

**New imports:**

```typescript
import { cn } from '@/lib/utils/cn';
import type { ShowcaseCategory } from '@/lib/examples/types';
```

**New localized labels (add to existing `sectionTitles` object):**

```typescript
const sectionTitles: Record<
  Locale,
  {
    title: string;
    description: string;
    errorTitle: string;
    retry: string;
    categories: {
      all: string;
      demographics: string;
      economy: string;
      healthcare: string;
      migration: string;
    };
    emptyCategory: string;
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
};
```

**Accessing localized texts:**

```typescript
// In the component, after props are destructured:
const texts = sectionTitles[locale];
```

**New state:**

```typescript
const [selectedCategory, setSelectedCategory] = useState<
  ShowcaseCategory | 'all'
>('all');
```

**Filtering logic:**

```typescript
// Filter by category
const categoryExamples = featuredExamples.filter(
  (config) => selectedCategory === 'all' || config.category === selectedCategory
);

// Get example states for filtered configs
const visibleExamples = categoryExamples.map((config) => {
  const index = featuredExamples.indexOf(config);
  return { config, state: examples[index] };
});

// Filter out failed cards
const loadedExamples = visibleExamples.filter(
  ({ state }) => state?.status !== 'error'
);
```

**Rendering changes:**

- Add horizontal tab bar above the grid
- Skip cards where `exampleState.status === 'error'`
- Remove the global "all failed" error state UI (no longer needed)
- Add empty state when category has no loaded examples

**Tab structure:**

```tsx
{
  /* Category filter tabs */
}
<div className='mb-6 flex flex-wrap gap-2'>
  {(['all', 'demographics', 'economy', 'healthcare', 'migration'] as const).map(
    (cat) => (
      <button
        key={cat}
        type='button'
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
</div>;

{
  /* Empty state for category */
}
{
  loadedExamples.length === 0 && categoryExamples.length > 0 && (
    <div className='rounded-xl border border-gray-200 bg-gray-50 p-8 text-center'>
      <p className='text-gray-500'>{texts.emptyCategory}</p>
    </div>
  );
}
```

---

## Config Updates

All 9 example configs need `category` and `preselectedFilters` added:

### 1. population-regions.ts

```typescript
category: 'demographics',
preselectedFilters: {
  dataFilters: { region: 'Војводина' },
},
```

### 2. gdp-regions.ts

```typescript
category: 'economy',
preselectedFilters: {
  dataFilters: { region: 'Beogradski region' },
},
```

### 3. gdp-time-series.ts

```typescript
category: 'economy',
preselectedFilters: {
  timeRange: { from: '2015', to: '2024' },
},
```

### 4. budget-allocation.ts

```typescript
category: 'economy',
preselectedFilters: {
  dataFilters: { showTop: '5' }, // Top 5 budget items by value
},
```

### 5. unemployment-rate.ts

```typescript
category: 'economy',
preselectedFilters: {
  timeRange: { from: '2020', to: '2024' },
},
```

### 6. health-indicators.ts

```typescript
category: 'healthcare',
preselectedFilters: {
  dataFilters: { indicator: 'Očekivano trajanje života' },
},
```

### 7. education-enrollment.ts

```typescript
category: 'demographics',
preselectedFilters: {
  dataFilters: { nivo: 'Visoko obrazovanje' },
},
```

### 8. energy-consumption.ts

```typescript
category: 'economy',
preselectedFilters: {
  dataFilters: { year: '2023' },
},
```

### 9. regional-comparison.ts

```typescript
category: 'economy', // Regional economic comparison data
preselectedFilters: {
  dataFilters: { region: 'Vojvodina' },
},
```

---

## Files to Modify

1. `src/components/home/FeaturedExamples.tsx` - Add tabs, filter logic, hide errors, empty state
2. `src/lib/examples/configs/population-regions.ts` - Add category + filters
3. `src/lib/examples/configs/gdp-regions.ts` - Add category + filters
4. `src/lib/examples/configs/gdp-time-series.ts` - Add category + filters
5. `src/lib/examples/configs/budget-allocation.ts` - Add category + filters
6. `src/lib/examples/configs/unemployment-rate.ts` - Add category + filters
7. `src/lib/examples/configs/health-indicators.ts` - Add category + filters
8. `src/lib/examples/configs/education-enrollment.ts` - Add category + filters
9. `src/lib/examples/configs/energy-consumption.ts` - Add category + filters
10. `src/lib/examples/configs/regional-comparison.ts` - Add category + filters

---

## Testing

1. **Tab filtering:**
   - Click each category tab, verify only matching examples show
   - Click "All", verify all examples show

2. **Error handling:**
   - Verify failed cards are hidden (no error state shown)
   - Verify if all cards in a category fail, empty state shows

3. **i18n:**
   - Switch locales, verify category labels update
   - Verify empty category message in all locales

4. **Keyboard accessibility:**
   - Tab through category buttons
   - Verify Enter/Space activates buttons

5. **Edge cases:**
   - Category with no examples defined (should show empty)
   - Switching categories while examples are loading (should show loading state)

6. **preselectedFilters:**
   - Click into a chart, verify preselected filters are applied
