# Serbian Government Data Library - Design Document

**Date:** 2026-03-13
**Status:** Draft
**Approach:** Curated Data Library (Hybrid)

## Overview

Create a curated Serbian government data library that integrates real data from the `serbia_deep_insights.py` Python scripts into the Vizuelni Admin Srbije platform. Users will be able to browse and select these datasets directly from the Browse page and use them in the chart configurator.

## Goals

1. Make real Serbian government data accessible within the platform
2. Enable users to create visualizations from curated demographics and migration datasets
3. Provide a hybrid approach: embedded data with optional API refresh capability
4. Integrate seamlessly with the existing configurator workflow

## Non-Goals

- Live API integration in Phase 1 (data will be embedded)
- Automatic data synchronization
- User-uploaded datasets (already exists separately)

## Architecture

### Directory Structure

```
src/lib/data/serbian-datasets/
├── index.ts              # Public exports
├── types.ts              # Type definitions for SerbianDataset
├── registry.ts           # Dataset registration and lookup
├── converter.ts          # SerbianDataset → ParsedDataset conversion
├── demographics/
│   ├── population-pyramid.json
│   ├── birth-rates.json
│   ├── fertility-rates.json
│   ├── natural-change.json
│   ├── population-decline.json
│   ├── diaspora-destinations.json
│   └── migration-balance.json
└── regional/
    └── (future: GDP by region, life expectancy)
```

### Type Definitions

```typescript
// src/lib/data/serbian-datasets/types.ts

import type { LocalizedText } from '@/lib/examples/types';
import type { DimensionMeta, MeasureMeta } from '@/types/observation';

// Re-export LocalizedText as LocalizedString for backward compatibility
export type LocalizedString = LocalizedText;

export type DataCategory =
  | 'demographics'
  | 'regional'
  | 'healthcare'
  | 'economic';

export interface SerbianDatasetMeta {
  id: string;
  title: LocalizedText; // Reuses existing type from @/lib/examples/types
  description: LocalizedText;
  category: DataCategory;
  tags: string[];
  source: {
    name: string;
    url: string;
  };
  lastUpdated: string; // ISO date
  suggestedChartType: string;
}

export interface SerbianDataset extends SerbianDatasetMeta {
  observations: Record<string, unknown>[];
  dimensions: DimensionMeta[]; // Uses existing type from @/types/observation
  measures: MeasureMeta[]; // Uses existing type from @/types/observation
}
```

### Registry Implementation

```typescript
// src/lib/data/serbian-datasets/registry.ts

import type { SerbianDataset, SerbianDatasetMeta, DataCategory } from './types';
import type { ParsedDataset } from '@/types/observation';
import { convertToParsedDataset } from './converter';

// Static imports for fast loading
import birthRatesData from './demographics/birth-rates.json';
import fertilityRatesData from './demographics/fertility-rates.json';
// ... other datasets

const ALL_DATASETS: SerbianDataset[] = [
  birthRatesData as SerbianDataset,
  fertilityRatesData as SerbianDataset,
  // ... other datasets
];

/**
 * Get all dataset metadata (lightweight, no observations)
 */
export function getAllDatasetMeta(): SerbianDatasetMeta[] {
  return ALL_DATASETS.map(
    ({ observations, dimensions, measures, ...meta }) => meta
  );
}

/**
 * Get datasets filtered by category
 */
export function getDatasetsByCategory(
  category: DataCategory
): SerbianDatasetMeta[] {
  return getAllDatasetMeta().filter((d) => d.category === category);
}

/**
 * Get full dataset by ID (includes observations)
 */
export function getDatasetById(id: string): SerbianDataset | undefined {
  return ALL_DATASETS.find((d) => d.id === id);
}

/**
 * Get dataset as ParsedDataset for configurator compatibility
 */
export function getDatasetAsParsed(
  id: string,
  locale: Locale
): ParsedDataset | undefined {
  const dataset = getDatasetById(id);
  if (!dataset) return undefined;
  return convertToParsedDataset(dataset, locale);
}
```

### Conversion Utility

```typescript
// src/lib/data/serbian-datasets/converter.ts

import type { SerbianDataset } from './types';
import type {
  ParsedDataset,
  DimensionMeta,
  MeasureMeta,
} from '@/types/observation';
import type { Locale } from '@/lib/i18n/config';
import { getLocalizedText } from '@/lib/examples/types';

/**
 * Convert SerbianDataset to ParsedDataset for configurator
 */
export function convertToParsedDataset(
  dataset: SerbianDataset,
  locale: Locale
): ParsedDataset {
  const columns = [
    ...dataset.dimensions.map((d) => d.key),
    ...dataset.measures.map((m) => m.key),
  ];

  return {
    observations: dataset.observations,
    dimensions: dataset.dimensions,
    measures: dataset.measures,
    metadataColumns: [],
    columns,
    rowCount: dataset.observations.length,
    source: {
      datasetId: dataset.id,
      resourceId: dataset.id,
      format: 'json',
      fetchedAt: dataset.lastUpdated,
      name: getLocalizedText(dataset.title, locale),
    },
  };
}
```

## Phase 1 Datasets

### Demographics & Migration (7 datasets)

| ID                             | Title                         | Suggested Chart | Source                           |
| ------------------------------ | ----------------------------- | --------------- | -------------------------------- |
| `serbia-population-pyramid`    | Population Pyramid 2024       | Horizontal Bar  | Statistical Office of Serbia     |
| `serbia-birth-rates`           | Birth Rate Decline 1950-2024  | Line            | Statistical Office of Serbia     |
| `serbia-fertility-rates`       | Fertility Rate vs Replacement | Line            | Statistical Office of Serbia, UN |
| `serbia-natural-change`        | Births vs Deaths 2015-2024    | Grouped Bar     | Statistical Office of Serbia     |
| `serbia-population-decline`    | Population Trend 1991-2024    | Area            | Census data                      |
| `serbia-diaspora-destinations` | Serbian Diaspora by Country   | Horizontal Bar  | UNDESA 2024, Eurostat            |
| `serbia-migration-balance`     | Migration Balance 2015-2024   | Combo           | Statistical Office of Serbia     |

### Data Mapping

Each dataset from `serbia_deep_insights.py` will be converted to JSON format compatible with `ParsedDataset`:

**Example - Birth Rates:**

```json
{
  "id": "serbia-birth-rates",
  "title": {
    "sr": "Пад наталитета 1950-2024",
    "lat": "Pad nataliteta 1950-2024",
    "en": "Birth Rate Decline 1950-2024"
  },
  "description": {
    "sr": "Број рођених на 1.000 становника",
    "lat": "Broj rođenih na 1.000 stanovnika",
    "en": "Births per 1,000 population"
  },
  "category": "demographics",
  "tags": ["population", "births", "demographics", "time-series"],
  "source": {
    "name": "Statistical Office of Serbia",
    "url": "https://www.stat.gov.rs/"
  },
  "lastUpdated": "2024-12-01",
  "suggestedChartType": "line",
  "observations": [
    { "year": 1950, "birthRate": 30.5 },
    { "year": 1955, "birthRate": 27.2 },
    { "year": 1960, "birthRate": 22.1 },
    { "year": 1965, "birthRate": 18.4 },
    { "year": 1970, "birthRate": 15.8 },
    { "year": 1975, "birthRate": 14.2 },
    { "year": 1980, "birthRate": 12.5 },
    { "year": 1985, "birthRate": 11.2 },
    { "year": 1990, "birthRate": 10.4 },
    { "year": 1995, "birthRate": 9.8 },
    { "year": 2000, "birthRate": 9.3 },
    { "year": 2005, "birthRate": 9.1 },
    { "year": 2010, "birthRate": 8.9 },
    { "year": 2020, "birthRate": 9.2 },
    { "year": 2024, "birthRate": 9.1 }
  ],
  "dimensions": [
    {
      "key": "year",
      "label": "Year",
      "type": "temporal",
      "values": [
        1950, 1955, 1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005,
        2010, 2020, 2024
      ],
      "cardinality": 15
    }
  ],
  "measures": [
    {
      "key": "birthRate",
      "label": "Birth Rate (per 1,000)",
      "min": 8.9,
      "max": 30.5,
      "hasNulls": false
    }
  ]
}
```

## UI Integration

### Browse Page Changes

Add `SerbianDataLibrary` component to the Browse page (`src/app/[locale]/browse/page.client.tsx`).

**Component Hierarchy:**

```tsx
<BrowseClient>
  <div className='grid'>
    <FilterSidebar />
    <section>
      {/* NEW: Serbian Data Library at top */}
      <SerbianDataLibrary locale={locale} />
      <Separator />
      {/* Existing content */}
      <ResultsCount />
      <DatasetList />
      <Pagination />
    </section>
  </div>
</BrowseClient>
```

**Wireframe:**

```
┌─────────────────────────────────────────────────────────────┐
│  Browse Datasets                                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🇷🇸 Serbian Government Data Library                  │   │
│  │ Curated datasets from official sources              │   │
│  │ ─────────────────────────────────────────────────── │   │
│  │ [All] [Demographics] [Regional] [Healthcare]        │   │
│  │ ─────────────────────────────────────────────────── │   │
│  │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │   │
│  │ │Dataset 1│ │Dataset 2│ │Dataset 3│ │Dataset 4│    │   │
│  │ │[Create] │ │[Create] │ │[Create] │ │[Create] │    │   │
│  │ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Data.gov.rs Datasets                                │   │
│  │ [Search external datasets...]                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component: SerbianDataLibrary

**File:** `src/components/browse/SerbianDataLibrary.tsx`

**Props:**

- `locale: Locale` - for i18n
- `onSelectDataset?: (id: string) => void` - optional callback (defaults to navigation)

**Features:**

- Category filter tabs
- Dataset cards with title, description, source badge
- "Create Chart" button navigates to `/[locale]/create?dataset=<id>`
- Responsive grid layout
- WCAG 2.1 AA compliant (follows Feature 18 patterns)

**Source Badge Design:**

```
┌─────────────────────────────────────┐
│ Population Pyramid 2024             │
│ Age distribution by gender          │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📊 Statistical Office of Serbia │ │ <- Source badge
│ └─────────────────────────────────┘ │
│                                     │
│            [Create Chart →]         │
└─────────────────────────────────────┘
```

### Create Page Integration

Update create page to handle Serbian datasets via `?dataset=<id>` query parameter:

```typescript
// In src/app/[locale]/create/page.tsx

// Detect if dataset ID is a Serbian embedded dataset (prefix: serbia-)
const isSerbianDataset = datasetId?.startsWith('serbia-');

if (isSerbianDataset) {
  // Load from local registry (no network request)
  const parsedDataset = getDatasetAsParsed(datasetId, locale);
  if (!parsedDataset) {
    // Handle error: redirect to browse with error message
    redirect(`/${locale}/browse?error=dataset-not-found`);
  }
  // Pass to ConfiguratorShell as preselectedParsedDataset
  return <ConfiguratorShell preselectedParsedDataset={parsedDataset} />;
} else {
  // Existing flow: load from data.gov.rs API
  const data = await getDatasetDetailData(datasetId);
  // ...
}
```

### Error Handling

| Scenario                     | Action                                         |
| ---------------------------- | ---------------------------------------------- |
| Invalid dataset ID in URL    | Redirect to `/browse?error=dataset-not-found`  |
| Dataset JSON fails to load   | Show error toast, fall back to empty state     |
| Category has no datasets     | Show "Coming soon" message                     |
| Network error on API refresh | Show cached data with "Last updated: X" notice |

```typescript
// Error handling in registry
export function getDatasetById(
  id: string
): Result<SerbianDataset, DatasetError> {
  const dataset = ALL_DATASETS.find((d) => d.id === id);
  if (!dataset) {
    return {
      ok: false,
      error: { code: 'NOT_FOUND', message: `Dataset ${id} not found` },
    };
  }
  return { ok: true, value: dataset };
}
```

## i18n Integration

Add translations to existing locale files (`src/lib/i18n/locales/*.json`):

**Keys to add:**

```json
{
  "browse": {
    "serbianLibrary": {
      "title": "Serbian Government Data Library",
      "description": "Curated datasets from official sources",
      "createChart": "Create Chart",
      "categories": {
        "all": "All",
        "demographics": "Demographics",
        "regional": "Regional",
        "healthcare": "Healthcare"
      },
      "errors": {
        "notFound": "Dataset not found",
        "loadFailed": "Failed to load dataset"
      }
    }
  }
}
```

## Test Specifications

### Unit Tests

| Test Case                                 | File                | Expected Result                                                   |
| ----------------------------------------- | ------------------- | ----------------------------------------------------------------- |
| Registry returns dataset by ID            | `registry.test.ts`  | `getDatasetById('serbia-birth-rates')` returns full dataset       |
| Registry returns undefined for invalid ID | `registry.test.ts`  | `getDatasetById('invalid')` returns undefined                     |
| Category filter works                     | `registry.test.ts`  | `getDatasetsByCategory('demographics')` returns only demographics |
| Conversion preserves observations         | `converter.test.ts` | `convertToParsedDataset()` preserves all observation data         |
| Conversion sets correct source            | `converter.test.ts` | Source includes localized name                                    |

### Component Tests

| Test Case                         | File                          | Expected Result                           |
| --------------------------------- | ----------------------------- | ----------------------------------------- |
| Renders all datasets by default   | `SerbianDataLibrary.test.tsx` | All 7 datasets visible                    |
| Category filter changes displayed | `SerbianDataLibrary.test.tsx` | Only filtered category shown              |
| Create button navigates correctly | `SerbianDataLibrary.test.tsx` | Click navigates to `/create?dataset=<id>` |
| Locale changes card text          | `SerbianDataLibrary.test.tsx` | Title/description in correct locale       |

### Integration Tests

| Test Case                           | File                               | Expected Result                    |
| ----------------------------------- | ---------------------------------- | ---------------------------------- |
| Create page loads Serbian dataset   | `create-page.test.ts`              | No network request, dataset loaded |
| Invalid dataset redirects to browse | `create-page.test.ts`              | Redirect to `/browse?error=...`    |
| Chart can be created from dataset   | `e2e/serbian-dataset-flow.spec.ts` | Full flow works end-to-end         |

## Implementation Steps

1. **Create type definitions** (`types.ts`) - reuse existing types where possible
2. **Create conversion utility** (`converter.ts`) - SerbianDataset → ParsedDataset
3. **Create dataset registry** (`registry.ts`) - static imports, lookup functions
4. **Extract and convert data** from Python scripts to JSON files
5. **Create SerbianDataLibrary component** with category filtering
6. **Update Browse page** to include the library above existing content
7. **Update Create page** to handle `serbia-*` dataset IDs
8. **Add i18n translations** for UI labels
9. **Write unit tests** for registry and converter
10. **Write component tests** for SerbianDataLibrary
11. **Write E2E test** for full flow

## Bundle Size Budget

Total embedded JSON size should not exceed **100KB** for Phase 1 (7 datasets).

If size exceeds budget, implement lazy loading:

```typescript
// Lazy load dataset observations
export async function getDatasetById(
  id: string
): Promise<SerbianDataset | undefined> {
  const meta = METADATA.find((d) => d.id === id);
  if (!meta) return undefined;

  const data = await import(`./${meta.category}/${id}.json`);
  return data.default as SerbianDataset;
}
```

## Future Enhancements

- Phase 2: Regional datasets (GDP by region, life expectancy)
- Phase 3: Healthcare datasets (cancer stats, healthcare workers)
- API refresh capability for live data updates
- Dataset versioning and update notifications
- Favorite/bookmark datasets

## Success Criteria

- All 7 demographics/migration datasets accessible from Browse page
- Users can create charts from any dataset in < 3 clicks
- Datasets load in < 500ms (embedded data)
- Full i18n support (sr-Cyrl, sr-Latn, en)
- Responsive design works on mobile
- WCAG 2.1 AA compliance for new components
- Test coverage > 80% for new code
