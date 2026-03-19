# Developer Dataset Workflow

This document explains the implementation-oriented version of the dataset-to-visualization flow in this repo.

Use it when you need to build features around:

- dataset discovery
- preview loading
- parsed dataset normalization
- transformation utilities
- chart suggestion
- direct rendering with the chart library

For the conceptual overview, see [DATASET_TO_VISUALIZATION_FLOW.md](/home/nistrator/vizuelni-admin-srbije/docs/DATASET_TO_VISUALIZATION_FLOW.md).

## Workflow overview

The developer pipeline is:

```text
Search dataset
  -> load dataset metadata
  -> choose previewable resource
  -> fetch and parse resource
  -> inspect dimensions and measures
  -> direct chart or transform first
  -> build chart config
  -> render with app flow or React chart component
```

## 1. Search and load dataset metadata

The main client-side entry points are in:

- [src/hooks/useDataset.ts](/home/nistrator/vizuelni-admin-srbije/src/hooks/useDataset.ts)
- [src/lib/data-gov-api.ts](/home/nistrator/vizuelni-admin-srbije/src/lib/data-gov-api.ts)

Important hooks:

- `useDatasetList(params)`
- `useDataset(datasetId)`
- `useBrowseFacets(datasets, selectedFormat)`
- `useResourceData(resourceUrl, format, options)`

Example:

```ts
import { useDatasetList } from '@/hooks/useDataset'

const query = useDatasetList({
  q: 'inflation',
  page: 1,
  pageSize: 12,
  format: 'csv',
})
```

What this gives you:

- official `data.gov.rs` dataset results
- demo fallback support through the data source context
- React Query caching and retry behavior

## 2. Choose a previewable resource

Not every resource is equally useful for visualization.

Current preview logic prefers CSV and JSON.

Relevant functions in [src/lib/data-gov-api.ts](/home/nistrator/vizuelni-admin-srbije/src/lib/data-gov-api.ts):

- `isPreviewableFormat(format)`
- `isAllowedPreviewHost(hostname)`
- `findPreviewableResource(resources)`
- `buildPreviewRows(dataset, limit)`

Typical usage:

```ts
import { findPreviewableResource } from '@/lib/data-gov-api'

const previewable = findPreviewableResource(dataset.resources)
```

This is the right point to reject resources that are:

- not machine-readable
- too awkward for the preview pipeline
- hosted on unsupported domains for preview fetching

## 3. Parse resource data into `ParsedDataset`

The key internal type is `ParsedDataset`, not raw CSV text and not untyped row arrays.

Primary paths:

- [src/lib/api/datagov.ts](/home/nistrator/vizuelni-admin-srbije/src/lib/api/datagov.ts)
- [packages/data/src/index.ts](/home/nistrator/vizuelni-admin-srbije/packages/data/src/index.ts)

The low-level loader is exported from `@vizualni/data`:

```ts
import { loadDatasetFromUrl } from '@vizualni/data'
```

Repo usage already wraps this:

```ts
import { fetchResourceData } from '@/lib/api/datagov'

const parsed = await fetchResourceData(resource.url, resource.format)
```

What you get in `ParsedDataset`:

- `columns`
- `dimensions`
- `measures`
- `observations`

That is the contract used by suggestion and transform logic.

## 4. Decide direct rendering vs transform-first

Base the decision on parsed structure, not on assumptions from metadata.

Direct rendering is usually enough when:

- `dimensions[0]` is temporal and you have one strong measure
- `dimensions[0]` is categorical and you have one strong measure
- you have two numeric measures for a scatterplot-like mapping

Transform first when:

- the dataset is too granular
- measures are implicit and need aggregation
- a part-to-whole chart needs computed percentages
- categories need grouping, sorting, or pivoting

This check should happen immediately after parse, before chart config generation.

## 5. Apply reusable data transforms

The reusable utilities live in:

- [packages/data/src/domain/transforms.ts](/home/nistrator/vizuelni-admin-srbije/packages/data/src/domain/transforms.ts)

Available helpers include:

- `filterObservations`
- `sortObservations`
- `aggregateObservations`
- `pivotObservations`
- `computePercentages`
- `applyInteractiveFilters`

### Aggregate example

```ts
import { aggregateObservations } from '@vizualni/data'

const aggregated = aggregateObservations(
  parsed.observations,
  'region',
  'amount',
  'sum'
)
```

### Percentage example

```ts
import { computePercentages } from '@vizualni/data'

const normalized = computePercentages(
  parsed.observations,
  'population',
  'region'
)
```

### Filter example

```ts
import { filterObservations } from '@vizualni/data'

const filtered = filterObservations(parsed.observations, {
  year: 2024,
})
```

### Practical pattern

When you transform observations, keep the original parsed dataset metadata and replace only the observation layer if the schema still matches.

If the transformation changes the schema itself, build a new dataset object with updated dimensions and measures instead of pretending the old metadata is still valid.

## 6. Generate a suggested chart

Current suggestion helpers are re-exported from:

- [src/lib/charts/suggestions.ts](/home/nistrator/vizuelni-admin-srbije/src/lib/charts/suggestions.ts)

Underlying rules live in:

- [packages/charts/src/domain/suggestions.ts](/home/nistrator/vizuelni-admin-srbije/packages/charts/src/domain/suggestions.ts)

Example:

```ts
import {
  getSuggestedChartType,
  getSuggestedChartConfig,
} from '@/lib/charts/suggestions'

const type = getSuggestedChartType(parsed)

const config = getSuggestedChartConfig(
  dataset.id,
  dataset.title,
  parsed
)
```

Current built-in heuristics include:

- `population-pyramid` when age and gender structure is detected
- `line` when the first dimension is temporal
- `column` when the first dimension is categorical
- `scatterplot` when there are multiple measures and no strong dimension
- `table` when chart mapping is weak

This is a solid default layer, but not a substitute for domain-specific transforms.

## 7. Render with the appropriate layer

There are two main rendering paths.

### A. App-level visualization flow

Use this for the full product workflow:

- browse
- preview
- configurator
- publish
- embed

Reference:

- [docs/VISUALIZATION_TOOL_CORE_FLOW.md](/home/nistrator/vizuelni-admin-srbije/docs/VISUALIZATION_TOOL_CORE_FLOW.md)

### B. Direct chart component usage

Use this when you want to pass data and config directly into a chart.

Reference:

- [packages/react/README.md](/home/nistrator/vizuelni-admin-srbije/packages/react/README.md)

Example:

```tsx
import { LineChart } from '@vizualni/react'

export function InflationChart({ data, config }) {
  return (
    <LineChart
      data={data}
      config={config}
      width={800}
      height={400}
    />
  )
}
```

If you are already in the application flow, prefer staying inside the existing configurator and published rendering contracts instead of building a second parallel rendering path.

## 8. Recommended feature-building pattern

For new product work in this repo, the safest order is:

1. Use `useDatasetList(...)` or `useDataset(...)` to get metadata.
2. Use `findPreviewableResource(...)` to pick a sensible CSV or JSON resource.
3. Use `useResourceData(...)` or `fetchResourceData(...)` to obtain a `ParsedDataset`.
4. Inspect `dimensions`, `measures`, and `observations.length`.
5. Decide direct chart vs transform-first.
6. If needed, apply transforms from `@vizualni/data`.
7. Generate a starter config with `getSuggestedChartConfig(...)`.
8. Render with either the app flow or `@vizualni/react`.
9. Validate output against the actual user question, not just against type safety.

## 9. Common implementation mistakes

- Choosing chart type from dataset title alone
- Rendering directly from raw rows without `ParsedDataset`
- Applying transforms without updating the schema contract
- Treating all machine-readable resources as equally previewable
- Assuming a rendered chart is correct because the component did not throw

## Summary

From a developer perspective, the core rule is simple:

- metadata helps you discover
- `ParsedDataset` helps you reason
- transforms help you fix structure
- chart suggestions help you start
- rendering is the last step, not the first
