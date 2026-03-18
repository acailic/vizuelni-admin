# Chart QA Audit Design

**Date**: 2026-03-17
**Status**: Draft

## Problem Statement

The demo gallery and showcase charts have recurring quality issues that undermine trust and usability:

1. **Broken filter/selector labels** - Raw field names, numbers, dates shown instead of human-readable labels
2. **Wrong controls for metrics** - "Absolute vs Percentage" toggles shown where meaningless
3. **Year formatting** - Years rendered as "2.018" instead of "2018" due to locale number formatting
4. **Locale/capitalization inconsistencies** - Mixed casing, wrong language labels
5. **Missing data provenance** - No clickable source links or "last updated" dates

## Scope

- All charts in `demo-gallery-examples.ts` (28+ charts)
- All charts in `showcase-examples.ts` (5 charts)
- All charts in `demo-gallery-expansion.ts` (13 charts)
- Components: `ChartRenderer`, `FilterBar`, `ChartFrame`, `DemoGalleryModalEnhanced`

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Chart Rendering Pipeline                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FeaturedExampleConfig                                          │
│       │                                                         │
│       ▼                                                         │
│  ChartRenderer                                                  │
│       │                                                         │
│       ├── prepareChartData() ──► dimensions[], seriesKeys[]     │
│       │         │                                               │
│       │         └── getFilterableDimensions()                   │
│       │                   │                                     │
│       │                   └── label = key (RAW!)                │
│       │                                                         │
│       ├── FilterBar                                             │
│       │      ├── LegendFilter (seriesLabels)                    │
│       │      ├── DimensionFilter (dimension.label)              │
│       │      ├── TimeRangeFilter                                │
│       │      └── CalculationToggle                              │
│       │                                                         │
│       └── ChartFrame                                            │
│              └── [Chart Component]                              │
│                                                                 │
│  DemoGalleryModalEnhanced                                       │
│       └── Footer: dataSource (text), tags (no link)             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Root Causes

### 1. Dimension Labels (packages/charts/interactive-filters.ts)

```typescript
// Current: Uses raw key as label
return {
  key,
  label: key,  // <-- Problem: "year", "population", etc.
  options,
  mode: ...
}
```

### 2. Series Labels (ChartRenderer.tsx)

```typescript
// Current: Falls back to raw key
seriesLabels={Object.fromEntries(
  seriesKeys.map((key) => [
    key,
    key === parsedConfig.y_axis?.field
      ? getAxisLabel(parsedConfig.y_axis)  // Good if label exists
      : key === parsedConfig.options?.secondaryField
        ? parsedConfig.options?.secondaryField  // Bad: raw field
        : key,  // Bad: raw key
  ])
)}
```

### 3. Year Formatting (formatters.ts)

```typescript
// Current: Uses number formatter for all numbers
const integerFormatter = new Intl.NumberFormat(resolvedLocale, {
  maximumFractionDigits: 0,
});
// Serbian locale: 2018 → "2.018" (thousands separator)
```

### 4. Calculation Toggle (interactive-filters.ts)

```typescript
// Current: Shows for all bar/column/area charts
export function supportsCalculationToggle(config: ChartConfig) {
  return ['bar', 'column', 'area'].includes(config.type);
}
// Problem: GDP per capita shouldn't show "absolute vs percent"
```

### 5. Legend Filter (ChartRenderer.tsx)

```typescript
// Current: Shows if seriesKeys.length > 0
const showLegendFilter =
  supportsLegendFilter(parsedConfig) && seriesKeys.length > 0;
// Problem: Single-series charts show "show all/hide all" which is pointless
```

### 6. Source Attribution (DemoGalleryModalEnhanced.tsx)

```typescript
// Current: Just displays text
<dd className='mt-1 text-slate-700'>{example.dataSource}</dd>
// Missing: clickable link, lastUpdated date
```

## Solution Design

### 1. Fix Dimension Labels

**Location**: `packages/charts/src/domain/interactive-filters.ts`

Add a `dimensionLabels` option to chart config, or infer better labels from data:

```typescript
// Option A: Add label inference
function inferDimensionLabel(key: string, values: string[]): string {
  // Check if it looks like a year field
  if (
    key.toLowerCase().includes('year') ||
    values.every((v) => /^\d{4}$/.test(v))
  ) {
    return 'Year';
  }
  // Check if it looks like a region field
  if (key.toLowerCase().includes('region')) {
    return 'Region';
  }
  // Capitalize and prettify
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
```

**Decision**: Use Option A (infer from key patterns) + add `dimensionLabels` to config for overrides.

### 2. Fix Series Labels

**Location**: `src/components/charts/ChartRenderer.tsx`

Improve label resolution:

```typescript
function getSeriesLabel(key: string, config: ChartConfig): string {
  // Check explicit label in y_axis
  if (config.y_axis?.field === key && config.y_axis?.label) {
    return config.y_axis.label;
  }
  // Check secondary field
  if (config.options?.secondaryField === key) {
    return config.options.secondaryFieldLabel ?? prettifyKey(key);
  }
  // Check pyramid fields
  if (config.options?.pyramidMaleField === key) {
    return 'Male';
  }
  if (config.options?.pyramidFemaleField === key) {
    return 'Female';
  }
  return prettifyKey(key);
}
```

### 3. Fix Year Formatting

**Location**: `packages/charts/src/domain/formatters.ts`

Detect year values and skip locale formatting:

```typescript
function isYearValue(value: number): boolean {
  return value >= 1000 && value <= 2100 && Number.isInteger(value);
}

export function formatChartValue(value: unknown, locale?: string) {
  // ... existing checks ...

  if (typeof value === 'number' && Number.isFinite(value)) {
    // Don't format years with locale separators
    if (isYearValue(value)) {
      return String(value);
    }
    return formatNumber(value);
  }
  // ...
}
```

### 4. Fix Calculation Toggle Logic

**Location**: `packages/charts/src/domain/interactive-filters.ts`

Add config option to disable:

```typescript
export function supportsCalculationToggle(config: ChartConfig) {
  // Check explicit disable
  if (config.options?.disableCalculationToggle) {
    return false;
  }
  // Only for charts where it makes sense (part-of-whole data)
  return ['bar', 'column', 'area'].includes(config.type);
}
```

Update chart configs to set `disableCalculationToggle: true` for:

- GDP per capita charts
- Rate/percentage charts
- Index charts

### 5. Fix Legend Filter Display

**Location**: `src/components/charts/ChartRenderer.tsx`

```typescript
const showLegendFilter =
  supportsLegendFilter(parsedConfig) && seriesKeys.length > 1; // Changed from > 0 to > 1
```

### 6. Add Source Links and Last Updated

**Location**: `src/components/demo-gallery/DemoGalleryModalEnhanced.tsx`

Add to footer:

```tsx
<div className='min-w-0'>
  <dt className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
    {uiLabels.source}
  </dt>
  <dd className='mt-1 text-slate-700'>
    {example.resourceUrl ? (
      <a
        href={example.resourceUrl}
        target='_blank'
        rel='noopener noreferrer'
        className='text-gov-primary hover:underline'
      >
        {example.dataSource}
      </a>
    ) : (
      example.dataSource
    )}
  </dd>
</div>;
{
  example.lastUpdated && (
    <div className='min-w-0'>
      <dt className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>
        {uiLabels.lastUpdated}
      </dt>
      <dd className='mt-1 text-slate-700'>
        {formatDateLocale(example.lastUpdated, locale)}
      </dd>
    </div>
  );
}
```

### 7. Locale-Aware Label Translations

**Location**: `src/lib/examples/demo-gallery-examples.ts` + configs

Add locale-aware labels to chart configs:

```typescript
chartConfig: {
  type: 'line',
  title: 'Birth Rate Trend',
  x_axis: {
    field: 'year',
    type: 'linear',
    label: { sr: 'Година', lat: 'Godina', en: 'Year' }
  },
  y_axis: {
    field: 'rate',
    type: 'linear',
    label: { sr: 'Стопа (на 1000)', lat: 'Stopa (na 1000)', en: 'Rate (per 1000)' }
  },
  // ...
}
```

Update `ChartRenderer` to resolve locale-aware labels.

## Implementation Plan

### Phase 1: Core Fixes (High Impact)

1. **Fix year formatting** in formatters.ts
2. **Fix legend filter visibility** (seriesKeys.length > 1)
3. **Add source links + last updated** to modal

### Phase 2: Label Improvements

4. **Improve series label resolution** in ChartRenderer
5. **Add dimension label inference** in interactive-filters.ts
6. **Add locale-aware labels** to chart configs (start with 5 key charts)

### Phase 3: Calculation Toggle

7. **Add disableCalculationToggle option** to chart configs
8. **Update configs** for inappropriate charts

### Phase 4: Data Cleanup

9. **Audit all chart configs** for:
   - Correct field names
   - Proper labels
   - Resource URLs
10. **Generate QA report** CSV

## QA Report Format

| chart_id                | title              | metric_unit | selector_issues | axis_formatting | locale_casing | source_link | last_updated | notes        |
| ----------------------- | ------------------ | ----------- | --------------- | --------------- | ------------- | ----------- | ------------ | ------------ |
| demo-population-pyramid | Population Pyramid | Population  | No              | Yes             | No            | No          | Yes          | Fixed labels |
| ...                     | ...                | ...         | ...             | ...             | ...           | ...         | ...          | ...          |

## Acceptance Criteria

1. All dimension filters show human-readable labels (no raw field names)
2. Series legends show proper labels (Male/Female, not male/female)
3. Years display as "2018" not "2.018"
4. Single-series charts don't show legend filter
5. Calculation toggle hidden for rate/percentage/index charts
6. All charts show clickable source link (if resourceUrl provided)
7. All charts show "Last updated" date
8. Labels are locale-appropriate (Cyrillic for sr-Cyrl, Latin for sr-Latn)

## Risk Assessment

- **Low Risk**: Year formatting, legend filter visibility
- **Medium Risk**: Label inference (may produce odd results for edge cases)
- **High Risk**: Locale-aware labels (requires updating 40+ chart configs)

## Rollback Plan

All changes are additive or fix-specific. Can revert individual commits per phase.
