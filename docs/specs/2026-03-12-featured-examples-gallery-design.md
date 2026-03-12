# Featured Examples Fix + Gallery Section

**Date:** 2026-03-12
**Status:** Approved
**Author:** Claude

## Problem Statement

1. **Homepage:** ~~3 "Featured Visualizations" fail to load~~ **ALREADY FIXED** - 9 working examples are in place
2. **Gallery:** No featured examples visible, only user-created charts from database

## Solution Overview

~~Replace 3 broken homepage examples with 9 working examples, and~~ Add a "Featured Examples" section to the gallery page.

### Homepage (Already Complete)

- 5 examples using existing JSON files (inline data, no fetch) ✅
- 4 examples using new CSV files (served from `/public/data/`) ✅

### Gallery (To Implement)

- New "Featured Examples" section at top of page
- Reuses same config files as homepage
- User charts appear below in existing grid

---

## Architecture

### Data Loading Strategy

**Two approaches for data:**

1. **JSON files:** Import JSON, transform using `parseDatasetContent()` at module load time, store full `ParsedDataset` in config (inline data - no network fetch)

2. **CSV files:** Keep existing `resourceUrl` approach. Files are fetched at runtime from `/data/[filename].csv`

### Type Changes

Add optional `inlineData` field to `FeaturedExampleConfig`:

```typescript
// src/lib/examples/types.ts
export interface FeaturedExampleConfig {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  datasetId: string;
  resourceUrl: string; // For CSV files (URL path)
  chartConfig: ChartConfig;
  inlineData?: ParsedDataset; // NEW: For JSON imports (bypasses fetch)
}
```

### Hook Changes

Update `useExampleData.ts` to check for `inlineData` first:

```typescript
export function useExampleData(
  config: FeaturedExampleConfig
): UseExampleDataResult {
  // If inline data provided, use it directly (no fetch needed)
  if (config.inlineData) {
    return {
      dataset: config.inlineData,
      status: 'success',
      error: null,
      retry: () => {}, // No-op for inline data
    };
  }
  // Otherwise, fetch from URL (existing logic)
}
```

---

## Data Sources

### Existing JSON Files (5) - Inline Data

| File                        | Chart Type | Title              |
| --------------------------- | ---------- | ------------------ |
| `serbian-population.json`   | Column     | Population by City |
| `serbian-gdp.json`          | Column     | Regional GDP       |
| `serbian-time-series.json`  | Line       | GDP Over Time      |
| `serbian-budget.json`       | Pie        | Budget Allocation  |
| `serbian-unemployment.json` | Bar        | Unemployment Rate  |

### New CSV Files (4) - URL Fetch

| File                       | Chart Type | Title                |
| -------------------------- | ---------- | -------------------- |
| `health-indicators.csv`    | Line       | Health Indicators    |
| `education-enrollment.csv` | Area       | Education Enrollment |
| `energy-consumption.csv`   | Bar        | Energy by Sector     |
| `regional-comparison.csv`  | Column     | Regional Comparison  |

---

## File Structure

**Already Implemented (✅):**
```
src/lib/examples/
├── index.ts                   # ✅ Exports all 9 configs
├── types.ts                   # ✅ Has inlineData field
├── configs/
│   ├── population-regions.ts      # ✅
│   ├── gdp-regions.ts             # ✅
│   ├── gdp-time-series.ts         # ✅
│   ├── budget-allocation.ts       # ✅
│   ├── unemployment-rate.ts       # ✅
│   ├── health-indicators.ts       # ✅
│   ├── education-enrollment.ts    # ✅
│   ├── energy-consumption.ts      # ✅
│   └── regional-comparison.ts     # ✅

src/components/home/
├── useExampleData.ts          # ✅ Checks for inlineData first

public/data/
├── health-indicators.csv      # ✅
├── education-enrollment.csv   # ✅
├── energy-consumption.csv     # ✅
└── regional-comparison.csv    # ✅
```

**To Implement:**
```
src/components/gallery/
├── GalleryPage.tsx            # Update: add featured section
├── GalleryFeaturedSection.tsx # NEW: featured examples component

src/lib/i18n/locales/
├── en.json                    # Update: add gallery.featuredTitle
├── sr-Cyrl.json               # Update: add gallery.featuredTitle
└── sr-Latn.json               # Update: add gallery.featuredTitle
```

---

## Implementation Details

### Config Examples

**JSON-based config (inline data):**

```typescript
// configs/population-regions.ts
import { parseDatasetContent } from '@/lib/data/loader';
import { parseChartConfig } from '@/types/chart-config';
import type { FeaturedExampleConfig } from '../types';
import populationRaw from '@/data/serbian-population.json';

const populationDataset = parseDatasetContent(JSON.stringify(populationRaw), {
  format: 'json',
  datasetId: 'serbian-population',
});

export const populationRegionsConfig: FeaturedExampleConfig = {
  id: 'population-regions',
  title: {
    sr: 'Популација по градовима',
    lat: 'Populacija po gradovima',
    en: 'Population by City',
  },
  description: {
    sr: 'Број становника по градовима Србије',
    lat: 'Broj stanovnika po gradovima Srbije',
    en: 'Population count by Serbian cities',
  },
  datasetId: 'serbian-population',
  resourceUrl: '', // Not used when inlineData is present
  chartConfig: parseChartConfig({
    type: 'column',
    title: 'Population',
    x_axis: { field: 'name', type: 'category', label: 'City' },
    y_axis: { field: 'value', type: 'linear', label: 'Population' },
  }),
  inlineData: populationDataset,
};
```

**CSV-based config (URL fetch):**

```typescript
// configs/health-indicators.ts
import { parseChartConfig } from '@/types/chart-config';
import type { FeaturedExampleConfig } from '../types';

export const healthIndicatorsConfig: FeaturedExampleConfig = {
  id: 'health-indicators',
  title: {
    sr: 'Здравствени показатељи',
    lat: 'Zdravstveni pokazatelji',
    en: 'Health Indicators',
  },
  description: {
    sr: 'Кључни здравствени показатељи током времена',
    lat: 'Ključni zdravstveni pokazatelji tokom vremena',
    en: 'Key health indicators over time',
  },
  datasetId: 'health-indicators',
  resourceUrl: '/data/health-indicators.csv',
  chartConfig: parseChartConfig({
    type: 'line',
    title: 'Health Indicators',
    x_axis: { field: 'year', type: 'category', label: 'Year' },
    y_axis: {
      field: 'life_expectancy',
      type: 'linear',
      label: 'Life Expectancy',
    },
  }),
};
```

### CSV File Contents

**health-indicators.csv:**

```csv
year,life_expectancy,hospital_beds,doctors_per_1000
2018,75.2,5.8,2.9
2019,75.5,5.9,3.0
2020,75.1,6.2,3.1
2021,74.8,6.5,3.2
2022,75.3,6.4,3.3
2023,75.8,6.6,3.4
```

**education-enrollment.csv:**

```csv
year,primary,secondary,university
2018,95.2,85.3,45.2
2019,95.5,86.1,46.0
2020,94.8,84.2,44.5
2021,95.1,85.8,47.2
2022,95.4,86.5,48.1
2023,95.7,87.2,49.0
```

**energy-consumption.csv:**

```csv
sector,consumption_twh,year
Households,12.5,2023
Industry,18.2,2023
Transport,8.5,2023
Agriculture,3.2,2023
Services,6.8,2023
Public,4.1,2023
```

**regional-comparison.csv:**

```csv
region,gdp_growth,unemployment_rate,population_growth
Belgrade,5.2,8.1,0.5
Vojvodina,4.5,10.2,0.2
Sumadija,3.8,11.5,-0.1
Western Serbia,3.2,12.8,-0.3
Southern Serbia,2.9,14.1,-0.4
Eastern Serbia,2.5,13.5,-0.5
```

### Gallery Featured Section

**New component: `GalleryFeaturedSection.tsx`**

```typescript
'use client'

import { featuredExamples } from '@/lib/examples'
import type { Locale } from '@/lib/i18n/config'
import { ExampleCard } from '@/components/home/ExampleCard'
import { useExampleData } from '@/components/home/useExampleData'

interface GalleryFeaturedSectionProps {
  locale: Locale
  title: string
}

export function GalleryFeaturedSection({ locale, title }: GalleryFeaturedSectionProps) {
  // Create hooks for each example
  const exampleStates = featuredExamples.map((config) => useExampleData(config))

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xl font-semibold text-slate-800">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredExamples.map((config, index) => (
          <ExampleCard
            key={config.id}
            config={config}
            locale={locale}
            dataset={exampleStates[index].dataset}
            status={exampleStates[index].status}
            onRetry={exampleStates[index].retry}
          />
        ))}
      </div>
    </section>
  )
}
```

**Updated `GalleryPage.tsx`:**

- Import `GalleryFeaturedSection`
- Add localized title for "Featured Examples"
- Render section above the filter bar

### Localization

Add to locale files:

```json
{
  "gallery": {
    "featuredTitle": "Featured Examples"
  }
}
```

| Key           | sr-Cyrl           | sr-Latn           | en                |
| ------------- | ----------------- | ----------------- | ----------------- |
| featuredTitle | Издвојени примери | Izdvojeni primeri | Featured Examples |

---

## Testing

1. Homepage: All 9 examples load without errors
2. Homepage: Charts render correctly with real data
3. Gallery: Featured section appears at top
4. Gallery: Featured cards match homepage cards
5. Gallery: User charts still work below featured section
6. All three locales display correctly
7. Network tab: JSON-based configs don't trigger fetch requests
8. CSV-based configs fetch successfully from `/data/`

---

## Success Criteria

- [x] All 9 examples display on homepage
- [ ] All 9 examples display in gallery featured section
- [x] No console errors when loading data
- [x] Charts render with actual data
- [ ] Localized text shows correctly in all 3 locales (need to add gallery.featuredTitle)
- [x] JSON-based examples load instantly (no network request)
- [x] CSV-based examples fetch successfully
- [ ] Gallery user charts still work
- [ ] Build succeeds without errors
