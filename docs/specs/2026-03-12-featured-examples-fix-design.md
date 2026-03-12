# Homepage Featured Examples Fix

**Date:** 2026-03-12
**Status:** Draft
**Author:** Claude

## Problem Statement

The homepage displays 3 "Featured Visualizations" that fail to load because they reference placeholder URLs that don't exist. Each config has a TODO comment indicating the data source needs to be replaced with real data.

Current broken configs:
- `youth-demographics.ts` → placeholder URL
- `health-statistics.ts` → placeholder URL
- `population-pyramid.ts` → placeholder URL

## Solution

Replace broken examples with 9 working examples using:
1. **5 existing JSON files** in `src/data/` (imported directly)
2. **4 new CSV files** in `public/data/` (statically served)

## Data Sources

### Existing JSON Files (5)

| File | Chart Type | Title |
|------|------------|-------|
| `serbian-population.json` | Column | Population by City |
| `serbian-gdp.json` | Column | Regional GDP |
| `serbian-time-series.json` | Line | GDP Over Time |
| `serbian-budget.json` | Pie | Budget Allocation |
| `serbian-unemployment.json` | Bar | Unemployment Rate |

### New CSV Files (4)

| File | Chart Type | Title |
|------|------------|-------|
| `health-indicators.csv` | Line | Health Indicators |
| `education-enrollment.csv` | Area | Education Enrollment |
| `energy-consumption.csv` | Bar | Energy by Sector |
| `regional-comparison.csv` | Grouped Column | Regional Comparison |

## Architecture

### Data Loading Strategy

**Two approaches:**

1. **JSON files:** Add new `inlineData` field to `FeaturedExampleConfig` type. Data is imported at build time and passed directly to the hook.

2. **CSV files:** Keep existing `resourceUrl` approach. Files are fetched at runtime from `/data/[filename].csv`.

### Type Changes

Add optional `inlineData` field to `FeaturedExampleConfig`:

```typescript
export interface FeaturedExampleConfig {
  id: string
  title: LocalizedText
  description: LocalizedText
  datasetId: string
  resourceUrl: string  // For CSV files (URL path)
  chartConfig: ChartConfig
  inlineData?: ParsedDataset  // NEW: For JSON imports (bypasses fetch)
}
```

### Hook Changes

Update `useExampleData.ts` to check for `inlineData` first:

```typescript
export function useExampleData(config: FeaturedExampleConfig): UseExampleDataResult {
  // If inline data provided, use it directly (no fetch needed)
  if (config.inlineData) {
    return {
      dataset: config.inlineData,
      status: 'success',
      error: null,
      retry: () => {}, // No-op for inline data
    }
  }

  // Otherwise, fetch from URL (existing logic)
  // ... existing fetch logic ...
}
```

### Why This Approach

1. **No API routes needed** - Simpler architecture
2. **Static file serving** - Fast, cacheable
3. **Build-time bundling for JSON** - No runtime fetch overhead
4. **Works with static export** - Compatible with Next.js static generation

## Implementation Details

### Config File Migration

| Action | Old File | New File |
|--------|----------|----------|
| DELETE | `configs/youth-demographics.ts` | - |
| DELETE | `configs/health-statistics.ts` | - |
| DELETE | `configs/population-pyramid.ts` | - |
| CREATE | - | `configs/population-regions.ts` |
| CREATE | - | `configs/gdp-regions.ts` |
| CREATE | - | `configs/gdp-time-series.ts` |
| CREATE | - | `configs/budget-allocation.ts` |
| CREATE | - | `configs/unemployment-rate.ts` |
| CREATE | - | `configs/health-indicators.ts` |
| CREATE | - | `configs/education-enrollment.ts` |
| CREATE | - | `configs/energy-consumption.ts` |
| CREATE | - | `configs/regional-comparison.ts` |

### File Structure

```
src/lib/examples/configs/
├── population-regions.ts      # NEW - uses serbian-population.json
├── gdp-regions.ts             # NEW - uses serbian-gdp.json
├── gdp-time-series.ts         # NEW - uses serbian-time-series.json
├── budget-allocation.ts       # NEW - uses serbian-budget.json
├── unemployment-rate.ts       # NEW - uses serbian-unemployment.json
├── health-indicators.ts       # NEW - uses CSV
├── education-enrollment.ts    # NEW - uses CSV
├── energy-consumption.ts      # NEW - uses CSV
└── regional-comparison.ts     # NEW - uses CSV

src/lib/examples/
├── index.ts                   # Update: export all 9 configs
└── types.ts                   # Update: add inlineData field

src/data/
├── serbian-population.json    # Existing
├── serbian-gdp.json           # Existing
├── serbian-time-series.json   # Existing
├── serbian-budget.json        # Existing
└── serbian-unemployment.json  # Existing

public/data/
├── health-indicators.csv      # NEW
├── education-enrollment.csv   # NEW
├── energy-consumption.csv     # NEW
└── regional-comparison.csv    # NEW
```

### Config Examples

**JSON-based config (inline data):**
```typescript
// configs/population-regions.ts
import populationData from '@/data/serbian-population.json'

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
  inlineData: {
    observations: populationData.data,
  },
}
```

**CSV-based config (URL fetch):**
```typescript
// configs/health-indicators.ts
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
    y_axis: { field: 'life_expectancy', type: 'linear', label: 'Life Expectancy' },
  }),
  // No inlineData - will fetch from URL
}
```

### CSV File Formats (Complete Data)

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

### Component Changes

**FeaturedExamples.tsx:**
- Update to display 9 examples in 3x3 grid (already uses responsive grid)
- No layout changes needed - existing `sm:grid-cols-2 lg:grid-cols-3` handles 9 cards

**useExampleData.ts:**
- Add check for `config.inlineData` at the start
- If present, return immediately with success status
- Otherwise, use existing fetch logic

**ExampleCard.tsx:**
- No changes needed

**types.ts:**
- Add optional `inlineData?: ParsedDataset` field

## Localization

All titles and descriptions in three locales:
- **sr-Cyrl:** Serbian Cyrillic
- **sr-Latn:** Serbian Latin
- **en:** English

## Testing

1. Verify all 9 examples load without errors
2. Verify charts render correctly with real data
3. Verify localized titles/descriptions display correctly
4. Verify error states work (retry functionality for CSV-based)
5. Test on all three locale routes
6. Verify inline data configs don't trigger network requests

## Rollback Plan

If issues arise, can quickly revert by:
1. Restore original 3 configs from git history
2. Remove new CSV files from `public/data/`
3. Revert `types.ts` and `useExampleData.ts` changes
4. Update `featuredExamples` array in `index.ts`

## Success Criteria

- [ ] All 9 examples display on homepage
- [ ] No console errors when loading data
- [ ] Charts render with actual data
- [ ] Localized text shows correctly in all 3 locales
- [ ] Loading states work properly
- [ ] Error retry functionality works for CSV-based examples
- [ ] JSON-based examples load instantly (no network request)
