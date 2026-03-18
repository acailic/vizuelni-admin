# Serbian Government Data Library Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a curated Serbian government data library with 7 demographics/migration datasets accessible from the Browse page.

**Architecture:** Create a dataset registry with embedded JSON files, a SerbianDataLibrary component on the Browse page, and integration with the Create page via query parameters.

**Tech Stack:** TypeScript, React, Next.js, existing i18n system, JSON data files

---

## File Structure

```
src/lib/data/serbian-datasets/
├── index.ts                    # Public exports
├── types.ts                    # Type definitions
├── registry.ts                 # Dataset lookup functions
├── converter.ts                # SerbianDataset → ParsedDataset
└── data/
    ├── population-pyramid.json
    ├── birth-rates.json
    ├── fertility-rates.json
    ├── natural-change.json
    ├── population-decline.json
    ├── diaspora-destinations.json
    └── migration-balance.json

src/components/browse/
└── SerbianDataLibrary.tsx     # New component for Browse page

src/lib/i18n/locales/
├── en/common.json              # Add serbianLibrary keys
├── sr/common.json              # Add serbianLibrary keys
└── lat/common.json             # Add serbianLibrary keys
```

---

## Chunk 1: Types and Registry

### Task 1.1: Type Definitions

**Files:**

- Create: `src/lib/data/serbian-datasets/types.ts`

- [ ] **Step 1: Create types file**

```typescript
// src/lib/data/serbian-datasets/types.ts

import type { LocalizedText } from '@/lib/examples/types';
import type { DimensionMeta, MeasureMeta } from '@/types/observation';

export type DataCategory =
  | 'demographics'
  | 'regional'
  | 'healthcare'
  | 'economic';

export interface SerbianDatasetMeta {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  category: DataCategory;
  tags: string[];
  source: {
    name: string;
    url: string;
  };
  lastUpdated: string;
  suggestedChartType: string;
}

export interface SerbianDataset extends SerbianDatasetMeta {
  observations: Record<string, unknown>[];
  dimensions: DimensionMeta[];
  measures: MeasureMeta[];
}
```

- [ ] **Step 2: Run type check**

Run: `npm run type-check`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/serbian-datasets/types.ts
git commit -m "feat(serbian-data): add types for Serbian dataset registry"
```

### Task 1.2: Registry Functions

**Files:**

- Create: `src/lib/data/serbian-datasets/registry.ts`
- Create: `src/lib/data/serbian-datasets/index.ts`

- [ ] **Step 1: Create registry with placeholder datasets**

```typescript
// src/lib/data/serbian-datasets/registry.ts

import type { SerbianDataset, SerbianDatasetMeta, DataCategory } from './types';

// Placeholder - will be populated with actual datasets
const ALL_DATASETS: SerbianDataset[] = [];

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
 * Get full dataset by ID
 */
export function getDatasetById(id: string): SerbianDataset | undefined {
  return ALL_DATASETS.find((d) => d.id === id);
}

/**
 * Check if a dataset ID is a Serbian dataset
 */
export function isSerbianDataset(id: string): boolean {
  return id.startsWith('serbia-');
}
```

- [ ] **Step 2: Create index.ts exports**

```typescript
// src/lib/data/serbian-datasets/index.ts

export * from './types';
export * from './registry';
export * from './converter';
```

- [ ] **Step 3: Run type check**

Run: `npm run type-check`
Expected: PASS (converter doesn't exist yet, so will fail - create stub)

- [ ] **Step 4: Create converter stub**

```typescript
// src/lib/data/serbian-datasets/converter.ts

import type { SerbianDataset } from './types';
import type { ParsedDataset } from '@/types/observation';
import type { Locale } from '@/lib/i18n/config';

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
      format: 'json',
      fetchedAt: new Date().toISOString(),
      name: dataset.title[
        locale === 'sr-Cyrl' ? 'sr' : locale === 'sr-Latn' ? 'lat' : 'en'
      ],
    },
  };
}
```

- [ ] **Step 5: Run type check**

Run: `npm run type-check`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/data/serbian-datasets/
git commit -m "feat(serbian-data): add registry and converter stubs"
```

---

## Chunk 2: Data Files

### Task 2.1: Birth Rates Dataset

**Files:**

- Create: `src/lib/data/serbian-datasets/data/birth-rates.json`

- [ ] **Step 1: Create birth-rates.json**

```json
{
  "id": "serbia-birth-rates",
  "title": {
    "sr": "Пад наталитета 1950-2024",
    "lat": "Pad nataliteta 1950-2024",
    "en": "Birth Rate Decline 1950-2024"
  },
  "description": {
    "sr": "Број рођених на 1.000 становника у Србији",
    "lat": "Broj rođenih na 1.000 stanovnika u Srbiji",
    "en": "Births per 1,000 population in Serbia"
  },
  "category": "demographics",
  "tags": [
    "population",
    "births",
    "demographics",
    "time-series",
    "vital-statistics"
  ],
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
    { "year": 2015, "birthRate": 9.2 },
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
        2010, 2015, 2020, 2024
      ],
      "cardinality": 16
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

- [ ] **Step 2: Commit**

```bash
git add src/lib/data/serbian-datasets/data/birth-rates.json
git commit -m "feat(serbian-data): add birth rates dataset"
```

### Task 2.2: Fertility Rates Dataset

**Files:**

- Create: `src/lib/data/serbian-datasets/data/fertility-rates.json`

- [ ] **Step 1: Create fertility-rates.json**

```json
{
  "id": "serbia-fertility-rates",
  "title": {
    "sr": "Стопа фертилитета vs ниво замене",
    "lat": "Stopa fertilitteta vs nivo zamene",
    "en": "Fertility Rate vs Replacement Level"
  },
  "description": {
    "sr": "Укупна стопа фертилитета у поређењу са нивом замене од 2.1",
    "lat": "Ukupna stopa fertilitteta u poređenju sa nivom zamene od 2.1",
    "en": "Total fertility rate compared to replacement level of 2.1"
  },
  "category": "demographics",
  "tags": ["fertility", "demographics", "time-series", "population"],
  "source": {
    "name": "Statistical Office of Serbia / UN",
    "url": "https://www.stat.gov.rs/"
  },
  "lastUpdated": "2024-12-01",
  "suggestedChartType": "line",
  "observations": [
    { "year": 2000, "fertilityRate": 1.7, "replacementLevel": 2.1 },
    { "year": 2005, "fertilityRate": 1.64, "replacementLevel": 2.1 },
    { "year": 2010, "fertilityRate": 1.45, "replacementLevel": 2.1 },
    { "year": 2015, "fertilityRate": 1.46, "replacementLevel": 2.1 },
    { "year": 2020, "fertilityRate": 1.48, "replacementLevel": 2.1 },
    { "year": 2023, "fertilityRate": 1.61, "replacementLevel": 2.1 },
    { "year": 2024, "fertilityRate": 1.42, "replacementLevel": 2.1 }
  ],
  "dimensions": [
    {
      "key": "year",
      "label": "Year",
      "type": "temporal",
      "values": [2000, 2005, 2010, 2015, 2020, 2023, 2024],
      "cardinality": 7
    }
  ],
  "measures": [
    {
      "key": "fertilityRate",
      "label": "Total Fertility Rate",
      "min": 1.42,
      "max": 1.7,
      "hasNulls": false
    },
    {
      "key": "replacementLevel",
      "label": "Replacement Level",
      "min": 2.1,
      "max": 2.1,
      "hasNulls": false
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/data/serbian-datasets/data/fertility-rates.json
git commit -m "feat(serbian-data): add fertility rates dataset"
```

### Task 2.3: Natural Change Dataset

**Files:**

- Create: `src/lib/data/serbian-datasets/data/natural-change.json`

- [ ] **Step 1: Create natural-change.json**

```json
{
  "id": "serbia-natural-change",
  "title": {
    "sr": "Рођени vs умрли 2015-2024",
    "lat": "Rođeni vs umrli 2015-2024",
    "en": "Births vs Deaths 2015-2024"
  },
  "description": {
    "sr": "Број рођених и умрлих у Србији по годинама",
    "lat": "Broj rođenih i umrlih u Srbiji po godinama",
    "en": "Number of births and deaths in Serbia by year"
  },
  "category": "demographics",
  "tags": [
    "births",
    "deaths",
    "vital-statistics",
    "demographics",
    "time-series"
  ],
  "source": {
    "name": "Statistical Office of Serbia",
    "url": "https://www.stat.gov.rs/"
  },
  "lastUpdated": "2024-12-01",
  "suggestedChartType": "bar",
  "observations": [
    { "year": 2015, "births": 68004, "deaths": 101559 },
    { "year": 2016, "births": 65638, "deaths": 103702 },
    { "year": 2017, "births": 64875, "deaths": 102620 },
    { "year": 2018, "births": 63505, "deaths": 101573 },
    { "year": 2019, "births": 61597, "deaths": 101541 },
    { "year": 2020, "births": 61447, "deaths": 116829 },
    { "year": 2021, "births": 62180, "deaths": 136622 },
    { "year": 2022, "births": 60512, "deaths": 109203 },
    { "year": 2023, "births": 61052, "deaths": 97081 },
    { "year": 2024, "births": 60845, "deaths": 98230 }
  ],
  "dimensions": [
    {
      "key": "year",
      "label": "Year",
      "type": "temporal",
      "values": [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      "cardinality": 10
    }
  ],
  "measures": [
    {
      "key": "births",
      "label": "Live Births",
      "min": 60512,
      "max": 68004,
      "hasNulls": false
    },
    {
      "key": "deaths",
      "label": "Deaths",
      "min": 97081,
      "max": 136622,
      "hasNulls": false
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/data/serbian-datasets/data/natural-change.json
git commit -m "feat(serbian-data): add natural change dataset"
```

### Task 2.4: Population Decline Dataset

**Files:**

- Create: `src/lib/data/serbian-datasets/data/population-decline.json`

- [ ] **Step 1: Create population-decline.json**

```json
{
  "id": "serbia-population-decline",
  "title": {
    "sr": "Популација Србије 1991-2024",
    "lat": "Populacija Srbije 1991-2024",
    "en": "Serbia Population Trend 1991-2024"
  },
  "description": {
    "sr": "Укупан број становника Србије по пописима",
    "lat": "Ukupan broj stanovnika Srbije po popisima",
    "en": "Total population of Serbia from census data"
  },
  "category": "demographics",
  "tags": ["population", "census", "demographics", "time-series"],
  "source": {
    "name": "Census Data / Statistical Office of Serbia",
    "url": "https://popis2022.stat.gov.rs/"
  },
  "lastUpdated": "2024-12-01",
  "suggestedChartType": "area",
  "observations": [
    { "year": 1991, "population": 7580000 },
    { "year": 2002, "population": 7498001 },
    { "year": 2011, "population": 7186862 },
    { "year": 2022, "population": 6647135 },
    { "year": 2024, "population": 6586476 }
  ],
  "dimensions": [
    {
      "key": "year",
      "label": "Year",
      "type": "temporal",
      "values": [1991, 2002, 2011, 2022, 2024],
      "cardinality": 5
    }
  ],
  "measures": [
    {
      "key": "population",
      "label": "Population",
      "min": 6586476,
      "max": 7580000,
      "hasNulls": false
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/data/serbian-datasets/data/population-decline.json
git commit -m "feat(serbian-data): add population decline dataset"
```

### Task 2.5: Diaspora Destinations Dataset

**Files:**

- Create: `src/lib/data/serbian-datasets/data/diaspora-destinations.json`

- [ ] **Step 1: Create diaspora-destinations.json**

```json
{
  "id": "serbia-diaspora-destinations",
  "title": {
    "sr": "Српска дијаспора по државама",
    "lat": "Srpska dijaspora po državama",
    "en": "Serbian Diaspora by Country"
  },
  "description": {
    "sr": "Број емиграната из Србије по државама пребивалишта",
    "lat": "Broj emigranata iz Srbije po državama prebivališta",
    "en": "Number of Serbian emigrants by country of residence"
  },
  "category": "demographics",
  "tags": ["diaspora", "migration", "emigration", "demographics"],
  "source": {
    "name": "UNDESA 2024 / Eurostat",
    "url": "https://www.stat.gov.rs/"
  },
  "lastUpdated": "2024-12-01",
  "suggestedChartType": "bar",
  "observations": [
    { "country": "Germany", "percentage": 32, "number": 308258 },
    { "country": "Austria", "percentage": 15, "number": 144496 },
    { "country": "France", "percentage": 10, "number": 96331 },
    { "country": "Italy", "percentage": 9, "number": 86698 },
    { "country": "Switzerland", "percentage": 7, "number": 67431 },
    { "country": "USA", "percentage": 6, "number": 57798 },
    { "country": "Canada", "percentage": 5, "number": 48165 },
    { "country": "Australia", "percentage": 4, "number": 38532 },
    { "country": "Sweden", "percentage": 3, "number": 28899 },
    { "country": "Other", "percentage": 9, "number": 86699 }
  ],
  "dimensions": [
    {
      "key": "country",
      "label": "Country",
      "type": "categorical",
      "values": [
        "Germany",
        "Austria",
        "France",
        "Italy",
        "Switzerland",
        "USA",
        "Canada",
        "Australia",
        "Sweden",
        "Other"
      ],
      "cardinality": 10
    }
  ],
  "measures": [
    {
      "key": "percentage",
      "label": "Percentage (%)",
      "min": 3,
      "max": 32,
      "hasNulls": false
    },
    {
      "key": "number",
      "label": "Number of Emigrants",
      "min": 28899,
      "max": 308258,
      "hasNulls": false
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/data/serbian-datasets/data/diaspora-destinations.json
git commit -m "feat(serbian-data): add diaspora destinations dataset"
```

### Task 2.6: Migration Balance Dataset

**Files:**

- Create: `src/lib/data/serbian-datasets/data/migration-balance.json`

- [ ] **Step 1: Create migration-balance.json**

```json
{
  "id": "serbia-migration-balance",
  "title": {
    "sr": "Миграциони биланс 2015-2024",
    "lat": "Migracioni bilans 2015-2024",
    "en": "Migration Balance 2015-2024"
  },
  "description": {
    "sr": "Имигранти и емигранти у Србији по годинама",
    "lat": "Imigranti i emigranti u Srbiji po godinama",
    "en": "Immigrants and emigrants in Serbia by year"
  },
  "category": "demographics",
  "tags": [
    "migration",
    "immigration",
    "emigration",
    "demographics",
    "time-series"
  ],
  "source": {
    "name": "Statistical Office of Serbia",
    "url": "https://www.stat.gov.rs/"
  },
  "lastUpdated": "2024-12-01",
  "suggestedChartType": "bar",
  "observations": [
    {
      "year": 2015,
      "immigrants": 28000,
      "emigrants": 40000,
      "netMigration": -12000
    },
    {
      "year": 2016,
      "immigrants": 29000,
      "emigrants": 42000,
      "netMigration": -13000
    },
    {
      "year": 2017,
      "immigrants": 27000,
      "emigrants": 38000,
      "netMigration": -11000
    },
    {
      "year": 2018,
      "immigrants": 30000,
      "emigrants": 41000,
      "netMigration": -11000
    },
    {
      "year": 2019,
      "immigrants": 32000,
      "emigrants": 45000,
      "netMigration": -13000
    },
    {
      "year": 2020,
      "immigrants": 25000,
      "emigrants": 35000,
      "netMigration": -10000
    },
    {
      "year": 2021,
      "immigrants": 28000,
      "emigrants": 32000,
      "netMigration": -4000
    },
    {
      "year": 2022,
      "immigrants": 35000,
      "emigrants": 29000,
      "netMigration": 6000
    },
    {
      "year": 2023,
      "immigrants": 41273,
      "emigrants": 37000,
      "netMigration": 4273
    },
    {
      "year": 2024,
      "immigrants": 38000,
      "emigrants": 46132,
      "netMigration": -8132
    }
  ],
  "dimensions": [
    {
      "key": "year",
      "label": "Year",
      "type": "temporal",
      "values": [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      "cardinality": 10
    }
  ],
  "measures": [
    {
      "key": "immigrants",
      "label": "Immigrants",
      "min": 25000,
      "max": 41273,
      "hasNulls": false
    },
    {
      "key": "emigrants",
      "label": "Emigrants",
      "min": 29000,
      "max": 46132,
      "hasNulls": false
    },
    {
      "key": "netMigration",
      "label": "Net Migration",
      "min": -13000,
      "max": 6000,
      "hasNulls": false
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/data/serbian-datasets/data/migration-balance.json
git commit -m "feat(serbian-data): add migration balance dataset"
```

### Task 2.7: Population Pyramid Dataset

**Files:**

- Create: `src/lib/data/serbian-datasets/data/population-pyramid.json`

- [ ] **Step 1: Create population-pyramid.json**

```json
{
  "id": "serbia-population-pyramid",
  "title": {
    "sr": "Пирамида популације 2024",
    "lat": "Piramida populacije 2024",
    "en": "Population Pyramid 2024"
  },
  "description": {
    "sr": "Старосна структура становништва Србије по полу",
    "lat": "Starosna struktura stanovništva Srbije po polu",
    "en": "Age structure of Serbia's population by sex"
  },
  "category": "demographics",
  "tags": ["population", "age", "gender", "demographics", "pyramid"],
  "source": {
    "name": "Statistical Office of Serbia",
    "url": "https://www.stat.gov.rs/"
  },
  "lastUpdated": "2024-12-01",
  "suggestedChartType": "bar",
  "observations": [
    { "ageGroup": "0-14", "sex": "Male", "percentage": 6.8 },
    { "ageGroup": "0-14", "sex": "Female", "percentage": 6.5 },
    { "ageGroup": "15-29", "sex": "Male", "percentage": 7.2 },
    { "ageGroup": "15-29", "sex": "Female", "percentage": 6.8 },
    { "ageGroup": "30-44", "sex": "Male", "percentage": 7.5 },
    { "ageGroup": "30-44", "sex": "Female", "percentage": 7.4 },
    { "ageGroup": "45-59", "sex": "Male", "percentage": 8.0 },
    { "ageGroup": "45-59", "sex": "Female", "percentage": 8.1 },
    { "ageGroup": "60-74", "sex": "Male", "percentage": 5.8 },
    { "ageGroup": "60-74", "sex": "Female", "percentage": 6.8 },
    { "ageGroup": "75+", "sex": "Male", "percentage": 2.8 },
    { "ageGroup": "75+", "sex": "Female", "percentage": 4.3 }
  ],
  "dimensions": [
    {
      "key": "ageGroup",
      "label": "Age Group",
      "type": "categorical",
      "values": ["0-14", "15-29", "30-44", "45-59", "60-74", "75+"],
      "cardinality": 6
    },
    {
      "key": "sex",
      "label": "Sex",
      "type": "categorical",
      "values": ["Male", "Female"],
      "cardinality": 2
    }
  ],
  "measures": [
    {
      "key": "percentage",
      "label": "Percentage of Population",
      "min": 2.8,
      "max": 8.1,
      "hasNulls": false
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/data/serbian-datasets/data/population-pyramid.json
git commit -m "feat(serbian-data): add population pyramid dataset"
```

### Task 2.8: Wire Up Registry

**Files:**

- Modify: `src/lib/data/serbian-datasets/registry.ts`

- [ ] **Step 1: Update registry to import all datasets**

Read the current registry.ts file, then replace with:

```typescript
// src/lib/data/serbian-datasets/registry.ts

import type { SerbianDataset, SerbianDatasetMeta, DataCategory } from './types';

// Import all datasets
import birthRatesData from './data/birth-rates.json';
import fertilityRatesData from './data/fertility-rates.json';
import naturalChangeData from './data/natural-change.json';
import populationDeclineData from './data/population-decline.json';
import diasporaDestinationsData from './data/diaspora-destinations.json';
import migrationBalanceData from './data/migration-balance.json';
import populationPyramidData from './data/population-pyramid.json';

const ALL_DATASETS: SerbianDataset[] = [
  birthRatesData as SerbianDataset,
  fertilityRatesData as SerbianDataset,
  naturalChangeData as SerbianDataset,
  populationDeclineData as SerbianDataset,
  diasporaDestinationsData as SerbianDataset,
  migrationBalanceData as SerbianDataset,
  populationPyramidData as SerbianDataset,
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
 * Get full dataset by ID
 */
export function getDatasetById(id: string): SerbianDataset | undefined {
  return ALL_DATASETS.find((d) => d.id === id);
}

/**
 * Check if a dataset ID is a Serbian dataset
 */
export function isSerbianDataset(id: string): boolean {
  return id.startsWith('serbia-');
}
```

- [ ] **Step 2: Run type check**

Run: `npm run type-check`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/serbian-datasets/registry.ts
git commit -m "feat(serbian-data): wire up all datasets in registry"
```

---

## Chunk 3: UI Component

### Task 3.1: Create SerbianDataLibrary Component

**Files:**

- Create: `src/components/browse/SerbianDataLibrary.tsx`

- [ ] **Step 1: Create component**

```tsx
// src/components/browse/SerbianDataLibrary.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Database, ArrowRight } from 'lucide-react';

import { getLocalizedText } from '@/lib/examples/types';
import {
  getAllDatasetMeta,
  getDatasetsByCategory,
  type DataCategory,
  type SerbianDatasetMeta,
} from '@/lib/data/serbian-datasets';
import type { Locale } from '@/lib/i18n/config';

interface SerbianDataLibraryProps {
  locale: Locale;
  labels: {
    title: string;
    description: string;
    createChart: string;
    categories: {
      all: string;
      demographics: string;
      regional: string;
      healthcare: string;
    };
  };
}

const CATEGORY_KEYS: (DataCategory | 'all')[] = [
  'all',
  'demographics',
  'regional',
  'healthcare',
];

export function SerbianDataLibrary({
  locale,
  labels,
}: SerbianDataLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    DataCategory | 'all'
  >('all');

  const datasets =
    selectedCategory === 'all'
      ? getAllDatasetMeta()
      : getDatasetsByCategory(selectedCategory);

  return (
    <section className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
      <div className='mb-4 flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gov-primary/10'>
          <Database className='h-5 w-5 text-gov-primary' />
        </div>
        <div>
          <h2 className='text-lg font-bold text-gray-900'>{labels.title}</h2>
          <p className='text-sm text-gray-600'>{labels.description}</p>
        </div>
      </div>

      <div className='mb-4 flex flex-wrap gap-2'>
        {CATEGORY_KEYS.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-gov-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {labels.categories[cat]}
          </button>
        ))}
      </div>

      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {datasets.map((dataset) => (
          <article
            key={dataset.id}
            className='rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-gov-primary/30 hover:bg-gray-100'
          >
            <h3 className='mb-1 font-semibold text-gray-900'>
              {getLocalizedText(dataset.title, locale)}
            </h3>
            <p className='mb-3 line-clamp-2 text-xs text-gray-600'>
              {getLocalizedText(dataset.description, locale)}
            </p>
            <div className='mb-3 flex flex-wrap gap-1'>
              {dataset.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className='rounded bg-white px-1.5 py-0.5 text-[10px] text-gray-500'
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href={`/${locale}/create?dataset=${dataset.id}`}
              className='inline-flex items-center gap-1 text-sm font-medium text-gov-secondary hover:underline'
            >
              {labels.createChart}
              <ArrowRight className='h-3.5 w-3.5' />
            </Link>
          </article>
        ))}
      </div>

      {datasets.length === 0 && (
        <p className='py-8 text-center text-sm text-gray-500'>
          No datasets in this category yet.
        </p>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Run type check**

Run: `npm run type-check`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/browse/SerbianDataLibrary.tsx
git commit -m "feat(serbian-data): add SerbianDataLibrary component"
```

### Task 3.2: Add to Browse Page

**Files:**

- Modify: `src/app/[locale]/browse/BrowseClient.tsx`

- [ ] **Step 1: Add import and component**

Add import at top:

```tsx
import { SerbianDataLibrary } from '@/components/browse/SerbianDataLibrary';
```

Add component in render, after SearchBar and before the grid:

```tsx
<SerbianDataLibrary
  locale={locale}
  labels={{
    title: messages.browse.serbianLibrary?.title || 'Serbian Government Data Library',
    description: messages.browse.serbianLibrary?.description || 'Curated datasets from official sources',
    createChart: messages.browse.serbianLibrary?.createChart || 'Create Chart',
    categories: {
      all: messages.browse.serbianLibrary?.categories?.all || 'All',
      demographics: messages.browse.serbianLibrary?.categories?.demographics || 'Demographics',
      regional: messages.browse.serbianLibrary?.categories?.regional || 'Regional',
      healthcare: messages.browse.serbianLibrary?.categories?.healthcare || 'Healthcare',
    },
  }}
/>

<div className="h-6" />
```

- [ ] **Step 2: Run type check**

Run: `npm run type-check`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/browse/BrowseClient.tsx
git commit -m "feat(serbian-data): integrate SerbianDataLibrary into browse page"
```

---

## Chunk 4: i18n Translations

### Task 4.1: Add English Translations

**Files:**

- Modify: `src/lib/i18n/locales/en/common.json`

- [ ] **Step 1: Add serbianLibrary keys to browse section**

Find the `"browse"` section and add the `serbianLibrary` keys:

```json
"browse": {
  ...existing keys...,
  "serbianLibrary": {
    "title": "Serbian Government Data Library",
    "description": "Curated datasets from official sources",
    "createChart": "Create Chart",
    "categories": {
      "all": "All",
      "demographics": "Demographics",
      "regional": "Regional",
      "healthcare": "Healthcare"
    }
  }
}
```

- [ ] **Step 2: Validate JSON syntax**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/locales/en.json', 'utf8'))"`
Expected: No error output

- [ ] **Step 3: Commit**

```bash
git add src/locales/en.json
git commit -m "feat(i18n): add Serbian Data Library English translations"
```

### Task 4.2: Add Serbian Cyrillic Translations

**Files:**

- Modify: `src/locales/sr-cyr.json`

- [ ] **Step 1: Add serbianLibrary keys**

```json
"browse": {
  ...existing keys...,
  "serbianLibrary": {
    "title": "Библиотека података Владе Србије",
    "description": "Курирани скупови података из званичних извора",
    "createChart": "Креирај график",
    "categories": {
      "all": "Све",
      "demographics": "Демографија",
      "regional": "Регионално",
      "healthcare": "Здравство"
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/locales/sr-cyr.json
git commit -m "feat(i18n): add Serbian Data Library Cyrillic translations"
```

### Task 4.3: Add Serbian Latin Translations

**Files:**

- Modify: `src/locales/sr-lat.json`

- [ ] **Step 1: Add serbianLibrary keys**

```json
"browse": {
  ...existing keys...,
  "serbianLibrary": {
    "title": "Biblioteka podataka Vlade Srbije",
    "description": "Kurirani skupovi podataka iz zvaničnih izvora",
    "createChart": "Kreiraj grafik",
    "categories": {
      "all": "Sve",
      "demographics": "Demografija",
      "regional": "Regionalno",
      "healthcare": "Zdravstvo"
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/locales/sr-lat.json
git commit -m "feat(i18n): add Serbian Data Library Latin translations"
```

---

## Chunk 5: Create Page Integration

### Task 5.1: Handle Serbian Dataset Parameter

**Files:**

- Modify: `src/app/[locale]/create/page.tsx`

- [ ] **Step 1: Add Serbian dataset handling**

Add import:

```tsx
import {
  getDatasetById,
  isSerbianDataset,
  convertToParsedDataset,
} from '@/lib/data/serbian-datasets';
```

Update the dataset handling logic (after the datasetId check):

```tsx
// Check if it's a Serbian embedded dataset
if (isSerbianDataset(datasetId)) {
  const serbianDataset = getDatasetById(datasetId);
  if (!serbianDataset) {
    redirect(`/${locale}/browse?error=dataset-not-found`);
  }

  const parsedDataset = convertToParsedDataset(serbianDataset, locale);

  return (
    <ConfiguratorShell
      locale={locale}
      labels={
        {
          // ... existing labels
        }
      }
      preselectedParsedDataset={parsedDataset}
      initialConfig={{
        type: 'table',
        title: getLocalizedText(serbianDataset.title, locale),
        dataset_id: datasetId,
      }}
    />
  );
}
```

Add import for getLocalizedText:

```tsx
import { getLocalizedText } from '@/lib/examples/types';
```

- [ ] **Step 2: Run type check**

Run: `npm run type-check`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/create/page.tsx
git commit -m "feat(serbian-data): integrate Serbian datasets with create page"
```

---

## Chunk 6: Testing

### Task 6.1: Registry Unit Tests

**Files:**

- Create: `src/lib/data/serbian-datasets/__tests__/registry.test.ts`

- [ ] **Step 1: Create test file**

```typescript
// src/lib/data/serbian-datasets/__tests__/registry.test.ts

import { describe, it, expect } from 'vitest';
import {
  getAllDatasetMeta,
  getDatasetById,
  getDatasetsByCategory,
  isSerbianDataset,
} from '../registry';

describe('Serbian Dataset Registry', () => {
  describe('getAllDatasetMeta', () => {
    it('returns all dataset metadata', () => {
      const meta = getAllDatasetMeta();
      expect(meta.length).toBe(7);
      expect(meta[0]).toHaveProperty('id');
      expect(meta[0]).toHaveProperty('title');
      expect(meta[0]).not.toHaveProperty('observations');
    });
  });

  describe('getDatasetById', () => {
    it('returns dataset for valid ID', () => {
      const dataset = getDatasetById('serbia-birth-rates');
      expect(dataset).toBeDefined();
      expect(dataset?.id).toBe('serbia-birth-rates');
      expect(dataset?.observations).toBeDefined();
    });

    it('returns undefined for invalid ID', () => {
      const dataset = getDatasetById('invalid-id');
      expect(dataset).toBeUndefined();
    });
  });

  describe('getDatasetsByCategory', () => {
    it('filters by demographics category', () => {
      const datasets = getDatasetsByCategory('demographics');
      expect(datasets.length).toBe(7);
      expect(datasets.every((d) => d.category === 'demographics')).toBe(true);
    });

    it('returns empty array for regional category (Phase 1)', () => {
      const datasets = getDatasetsByCategory('regional');
      expect(datasets.length).toBe(0);
    });
  });

  describe('isSerbianDataset', () => {
    it('returns true for serbia- prefixed IDs', () => {
      expect(isSerbianDataset('serbia-birth-rates')).toBe(true);
      expect(isSerbianDataset('serbia-anything')).toBe(true);
    });

    it('returns false for non-serbia prefixed IDs', () => {
      expect(isSerbianDataset('other-dataset')).toBe(false);
      expect(isSerbianDataset('dataset-123')).toBe(false);
    });
  });
});
```

- [ ] **Step 2: Run tests**

Run: `npm run test -- src/lib/data/serbian-datasets/__tests__/registry.test.ts`
Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/serbian-datasets/__tests__/registry.test.ts
git commit -m "test(serbian-data): add registry unit tests"
```

### Task 6.2: Converter Unit Tests

**Files:**

- Create: `src/lib/data/serbian-datasets/__tests__/converter.test.ts`

- [ ] **Step 1: Create test file**

```typescript
// src/lib/data/serbian-datasets/__tests__/converter.test.ts

import { describe, it, expect } from 'vitest';
import { convertToParsedDataset } from '../converter';
import { getDatasetById } from '../registry';
import type { Locale } from '@/lib/i18n/config';

describe('Serbian Dataset Converter', () => {
  it('converts SerbianDataset to ParsedDataset', () => {
    const dataset = getDatasetById('serbia-birth-rates');
    if (!dataset) throw new Error('Dataset not found');

    const parsed = convertToParsedDataset(dataset, 'en');

    expect(parsed.observations).toEqual(dataset.observations);
    expect(parsed.dimensions).toEqual(dataset.dimensions);
    expect(parsed.measures).toEqual(dataset.measures);
    expect(parsed.rowCount).toBe(dataset.observations.length);
    expect(parsed.source.datasetId).toBe('serbia-birth-rates');
  });

  it('localizes source name for Serbian Cyrillic', () => {
    const dataset = getDatasetById('serbia-birth-rates');
    if (!dataset) throw new Error('Dataset not found');

    const parsed = convertToParsedDataset(dataset, 'sr-Cyrl');
    expect(parsed.source.name).toBe(dataset.title.sr);
  });

  it('localizes source name for Serbian Latin', () => {
    const dataset = getDatasetById('serbia-birth-rates');
    if (!dataset) throw new Error('Dataset not found');

    const parsed = convertToParsedDataset(dataset, 'sr-Latn');
    expect(parsed.source.name).toBe(dataset.title.lat);
  });

  it('includes all dimension and measure keys in columns', () => {
    const dataset = getDatasetById('serbia-birth-rates');
    if (!dataset) throw new Error('Dataset not found');

    const parsed = convertToParsedDataset(dataset, 'en');
    expect(parsed.columns).toContain('year');
    expect(parsed.columns).toContain('birthRate');
  });
});
```

- [ ] **Step 2: Run tests**

Run: `npm run test -- src/lib/data/serbian-datasets/__tests__/converter.test.ts`
Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/serbian-datasets/__tests__/converter.test.ts
git commit -m "test(serbian-data): add converter unit tests"
```

---

## Final Steps

### Task 7.1: Run Full Test Suite

- [ ] **Step 1: Run all tests**

Run: `npm run test`
Expected: All tests pass

- [ ] **Step 2: Run type check**

Run: `npm run type-check`
Expected: PASS

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: No errors

### Task 7.2: Create Feature Branch and PR

- [ ] **Step 1: Create feature branch**

```bash
git checkout -b feature/37-serbian-data-library
```

- [ ] **Step 2: Push and create PR**

```bash
git push -u origin feature/37-serbian-data-library
gh pr create --title "feat: Serbian Government Data Library" --body "## Summary
Implements a curated Serbian government data library with 7 demographics/migration datasets accessible from the Browse page.

## Implementation
- Created dataset types, registry, and converter utilities
- Added 7 JSON data files from serbia_deep_insights.py
- Created SerbianDataLibrary component for Browse page
- Integrated with Create page via ?dataset= query parameter
- Added i18n translations (en, sr-cyr, sr-lat)

## Test Results
All unit tests pass for registry and converter functions.

## Requires Human Action
None"
```

---

## Success Criteria Checklist

- [ ] All 7 datasets appear in Browse page SerbianDataLibrary section
- [ ] Category filter works correctly
- [ ] "Create Chart" links navigate to create page with dataset pre-loaded
- [ ] Full i18n support (sr-Cyrl, sr-Latn, en)
- [ ] Type check passes
- [ ] All tests pass
- [ ] No lint errors
