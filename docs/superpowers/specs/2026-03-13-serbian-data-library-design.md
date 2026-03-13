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
├── index.ts              # Registry and exports
├── types.ts              # Type definitions for SerbianDataset
├── registry.ts           # Dataset registration and lookup
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

export type DataCategory =
  | 'demographics'
  | 'regional'
  | 'healthcare'
  | 'economic';

export interface LocalizedString {
  sr: string; // Serbian Cyrillic
  lat: string; // Serbian Latin
  en: string; // English
}

export interface SerbianDatasetMeta {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
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
  dimensions: DimensionMeta[];
  measures: MeasureMeta[];
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

Add `SerbianDataLibrary` component to the Browse page (`src/app/[locale]/browse/page.client.tsx`):

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
- `onSelectDataset?: (id: string) => void` - callback when dataset selected

**Features:**

- Category filter tabs
- Dataset cards with title, description, source badge
- "Create Chart" button navigates to `/[locale]/create?dataset=<id>`
- Responsive grid layout

### Create Page Integration

Update create page to accept `?dataset=<id>` query parameter:

1. If `dataset` param exists, load dataset from registry
2. Pre-populate the configurator with the loaded data
3. Skip the initial dataset selection step

## Implementation Steps

1. **Create type definitions** (`types.ts`)
2. **Create dataset registry** (`registry.ts`)
3. **Extract and convert data** from Python scripts to JSON files
4. **Create SerbianDataLibrary component**
5. **Update Browse page** to include the library
6. **Update Create page** to accept dataset parameter
7. **Add i18n translations** for UI labels
8. **Write tests** for registry and components

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
