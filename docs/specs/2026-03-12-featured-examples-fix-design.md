# Homepage Featured Examples Fix

**Date:** 2026-03-12
**Status:** Draft
**Author:** Claude

## Problem Statement

The homepage displays 3 "Featured Visualizations" that fail to load because they reference placeholder URLs that don't exist. Each config has a TODO comment indicating the data source needs to be replaced with real data.

Current broken URLs:

- `/api/proxy?url=https://data.gov.rs/sr/datasets/youth-population-regions.csv`
- `/api/proxy?url=https://data.gov.rs/sr/datasets/health-indicators.csv`
- `/api/proxy?url=https://data.gov.rs/sr/datasets/population-age-gender.csv`

## Solution

Replace broken examples with 9 working examples using:

1. **5 existing JSON files** in `src/data/` (imported directly)
2. **4 new CSV files** in `public/data/` (statically served)

## Data Sources

### Existing JSON Files (5)

| File                        | Chart Type | Title              |
| --------------------------- | ---------- | ------------------ |
| `serbian-population.json`   | Column     | Population by City |
| `serbian-gdp.json`          | Column     | Regional GDP       |
| `serbian-time-series.json`  | Line       | GDP Over Time      |
| `serbian-budget.json`       | Pie        | Budget Allocation  |
| `serbian-unemployment.json` | Bar        | Unemployment Rate  |

### New CSV Files (4)

| File                       | Chart Type     | Title                |
| -------------------------- | -------------- | -------------------- |
| `health-indicators.csv`    | Line           | Health Indicators    |
| `education-enrollment.csv` | Area           | Education Enrollment |
| `energy-consumption.csv`   | Bar            | Energy by Sector     |
| `regional-comparison.csv`  | Grouped Column | Regional Comparison  |

## Architecture

### Data Loading Strategy

- **JSON files:** Imported directly in TypeScript configs (bundled at build time)
- **CSV files:** Placed in `public/data/`, fetched at runtime via static URL

### Why This Approach

1. **No API routes needed** - Simpler architecture
2. **Static file serving** - Fast, cacheable
3. **Build-time bundling for JSON** - No runtime fetch overhead
4. **Works with static export** - Compatible with Next.js static generation

## Implementation Details

### File Structure

```
src/lib/examples/configs/
├── population-regions.ts      # Update existing
├── gdp-regions.ts             # Update existing
├── gdp-time-series.ts         # Update existing
├── budget-allocation.ts       # Update existing
├── unemployment-rate.ts       # Update existing
├── health-indicators.ts       # Update to use CSV
├── education-enrollment.ts    # New
├── energy-consumption.ts      # New
└── regional-comparison.ts     # New

src/lib/examples/
├── index.ts                   # Export all 9 configs
└── types.ts                   # Existing types (unchanged)

src/data/
├── serbian-population.json    # Existing
├── serbian-gdp.json           # Existing
├── serbian-time-series.json   # Existing
├── serbian-budget.json        # Existing
└── serbian-unemployment.json  # Existing

public/data/
├── health-indicators.csv      # New
├── education-enrollment.csv   # New
├── energy-consumption.csv     # New
└── regional-comparison.csv    # New
```

### Config Structure

Each config includes:

- `id`: Unique identifier
- `title`: LocalizedText (sr, lat, en)
- `description`: LocalizedText (sr, lat, en)
- `datasetId`: Reference identifier
- `resourceUrl`: Path to data (import path or `/data/file.csv`)
- `chartConfig`: ChartConfig object

### CSV File Formats

**health-indicators.csv:**

```csv
year,life_expectancy,hospital_beds,doctors_per_1000
2018,75.2,5.8,2.9
2019,75.5,5.9,3.0
...
```

**education-enrollment.csv:**

```csv
year,primary,secondary,university
2018,95.2,85.3,45.2
2019,95.5,86.1,46.0
...
```

**energy-consumption.csv:**

```csv
sector,consumption_twh,year
Households,12.5,2023
Industry,18.2,2023
Transport,8.5,2023
...
```

**regional-comparison.csv:**

```csv
region,gdp_growth,unemployment,population_growth
Belgrade,5.2,8.1,0.5
Vojvodina,4.5,10.2,0.2
...
```

### Component Changes

**FeaturedExamples.tsx:**

- Display all 9 examples in 3-column responsive grid
- No functional changes needed (already handles dynamic number of configs)

**useExampleData.ts:**

- Handle both imported JSON data and fetched CSV data
- Existing logic already supports URL-based loading

**ExampleCard.tsx:**

- No changes needed (already renders based on status and dataset)

## Localization

All titles and descriptions in three locales:

- **sr-Cyrl:** Serbian Cyrillic
- **sr-Latn:** Serbian Latin
- **en:** English

## Testing

1. Verify all 9 examples load without errors
2. Verify charts render correctly
3. Verify localized titles/descriptions display correctly
4. Verify error states work (retry functionality)
5. Test on all three locale routes

## Rollback Plan

If issues arise, can quickly revert by:

1. Restoring original 3 configs from git history
2. Removing new CSV files from `public/data/`
3. Updating `featuredExamples` array in `index.ts`

## Success Criteria

- [ ] All 9 examples display on homepage
- [ ] No console errors when loading data
- [ ] Charts render with actual data
- [ ] Localized text shows correctly in all 3 locales
- [ ] Loading states work properly
- [ ] Error retry functionality works
