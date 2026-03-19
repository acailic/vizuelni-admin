# Dataset to Visualization Flow

This guide explains the full working flow for this project:

1. discover a dataset
2. inspect its structure
3. decide whether it can be visualized directly
4. transform it if needed
5. generate or configure a chart
6. iterate until the result is publishable

It is written for the current repo, not as a generic data-viz essay.

## Core idea

A good visualization flow is not "pick chart first, data second".

The stable order is:

1. find the right dataset
2. inspect the resource format and field structure
3. normalize the data shape
4. map dimensions and measures
5. choose the chart library layer
6. render and refine

If you skip step 3, you usually end up forcing a chart onto data that is not ready for it.

## The decision tree

Use this quick rule:

- If the dataset already has one clear dimension and one or more clear measures, you can often visualize it directly.
- If the dataset has repeated headers, wide format, mixed encodings, merged categories, or multiple tables in one file, transform it first.
- If the dataset is mostly text, identifiers, or notes, use a table or summary view before trying a chart.

In practice, the flow is:

```text
Dataset search
  -> dataset detail
  -> preview first rows
  -> parse into ParsedDataset
  -> direct visualization? yes -> chart suggestion/config
  -> direct visualization? no  -> transform/aggregate/pivot/filter
  -> render with chart component or published chart flow
```

## Stage 1: Discover the dataset

There are two main entry paths in this repo.

### A. Browse real datasets

Use the browse flow when the source is `data.gov.rs`.

Relevant files:

- [src/components/browse/SerbianDataLibrary.tsx](/home/nistrator/vizuelni-admin-srbije/src/components/browse/SerbianDataLibrary.tsx)
- [src/components/browse/DatasetPreview.tsx](/home/nistrator/vizuelni-admin-srbije/src/components/browse/DatasetPreview.tsx)
- [src/hooks/useDataset.ts](/home/nistrator/vizuelni-admin-srbije/src/hooks/useDataset.ts)
- [src/lib/data-gov-api.ts](/home/nistrator/vizuelni-admin-srbije/src/lib/data-gov-api.ts)

What happens:

- the user searches or filters datasets
- the app fetches metadata, topics, formats, and organizations
- the app chooses a previewable resource, usually CSV or JSON
- the user gets a preview table before committing to a chart

This stage answers: "Is this the right source at all?"

### B. Use local or curated demo datasets

Use this when you want stable examples, offline demos, or known-good schemas.

Relevant files:

- [src/data/](/home/nistrator/vizuelni-admin-srbije/src/data)
- [src/data/demo-gallery/](/home/nistrator/vizuelni-admin-srbije/src/data/demo-gallery)
- [src/data/demo-catalog/](/home/nistrator/vizuelni-admin-srbije/src/data/demo-catalog)

This stage answers: "Do I need live public data, or a controlled dataset for a known story?"

## Stage 2: Inspect before visualizing

Do not go directly from metadata to chart.

Inspect:

- file format: CSV and JSON are the easiest preview path in the current app
- row count and column count
- likely dimensions: time, geography, category, age group, gender
- likely measures: counts, rates, currency, percentages
- quality problems: missing headers, mixed delimiters, null-heavy columns, duplicated categories

The current preview pipeline is built around:

- `findPreviewableResource(...)` in [src/lib/data-gov-api.ts](/home/nistrator/vizuelni-admin-srbije/src/lib/data-gov-api.ts)
- `buildPreviewRows(...)` in [src/lib/data-gov-api.ts](/home/nistrator/vizuelni-admin-srbije/src/lib/data-gov-api.ts)
- `PreviewTable` usage in [src/components/browse/DatasetPreview.tsx](/home/nistrator/vizuelni-admin-srbije/src/components/browse/DatasetPreview.tsx)

This stage answers: "What shape is the data really in?"

## Stage 3: Parse into a normalized dataset

The important internal contract is not raw CSV rows. It is `ParsedDataset`.

Relevant files:

- [packages/data/src/index.ts](/home/nistrator/vizuelni-admin-srbije/packages/data/src/index.ts)
- [src/lib/api/datagov.ts](/home/nistrator/vizuelni-admin-srbije/src/lib/api/datagov.ts)
- [src/lib/data-gov-api.ts](/home/nistrator/vizuelni-admin-srbije/src/lib/data-gov-api.ts)

Typical path:

1. fetch the resource
2. detect or pass the resource format
3. load it through `loadDatasetFromUrl(...)`
4. classify columns into dimensions and measures
5. work from the parsed result instead of ad hoc row objects

Why this matters:

- chart suggestion logic depends on dimensions and measures
- transformations become predictable
- the same dataset can feed table preview, chart preview, and published rendering

## Stage 4: Decide direct use vs transformation

This is the key branching point.

### Use the dataset directly when

- there is a clean time field and one numeric measure
- there is one category field and one numeric measure
- there are two numeric measures and no strong category dimension
- the parsed dimensions/measures already match the intended chart mapping

Typical direct cases:

- yearly inflation rate -> line chart
- budget by ministry -> column chart
- age bracket with male and female counts -> population pyramid

### Transform first when

- the dataset is in wide format, such as one column per year
- values need aggregation by region, ministry, or period
- percentages need to be computed from raw counts
- multiple fields need pivoting to become chart series
- missing values need cleanup before rendering
- the chart should use a derived metric rather than a raw field

Typical transform-first cases:

- monthly values spread across `jan`, `feb`, `mar` columns
- budget line items that need grouping by ministry
- municipality data that needs percentage-of-total views
- raw event rows that should be counted per category

## Stage 5: Apply transformations

The reusable transformation utilities already live in the data package.

Relevant file:

- [packages/data/src/domain/transforms.ts](/home/nistrator/vizuelni-admin-srbije/packages/data/src/domain/transforms.ts)

The main operations available now are:

- `filterObservations(...)`
- `sortObservations(...)`
- `aggregateObservations(...)`
- `pivotObservations(...)`
- `computePercentages(...)`
- `applyInteractiveFilters(...)`

Use them as building blocks:

```ts
import {
  aggregateObservations,
  computePercentages,
  pivotObservations,
} from '@vizualni/data'
```

Example transformation patterns:

### A. Aggregate raw rows into chart-ready totals

Use when the source is transactional or too granular.

```ts
const totals = aggregateObservations(
  dataset.observations,
  'region',
  'amount',
  'sum'
)
```

### B. Convert values into percentages

Use when part-to-whole or normalized comparison is more meaningful than raw totals.

```ts
const withPercentages = computePercentages(
  dataset.observations,
  'population',
  'region'
)
```

### C. Pivot long data into matrix-like data

Use when you need categories on one axis and series on another.

```ts
const pivot = pivotObservations(
  dataset.observations,
  'year',
  'sector',
  'value'
)
```

Rule of thumb:

- aggregate when there are too many raw rows
- pivot when series are implicit
- compute percentages when totals mislead
- filter before charting when the full dataset is too broad

## Stage 6: Suggest or choose the chart

Once the data is parsed and, if necessary, transformed, choose the chart type.

Relevant files:

- [src/lib/charts/suggestions.ts](/home/nistrator/vizuelni-admin-srbije/src/lib/charts/suggestions.ts)
- [packages/charts/src/domain/suggestions.ts](/home/nistrator/vizuelni-admin-srbije/packages/charts/src/domain/suggestions.ts)

The current suggestion layer does a few practical things:

- population-pyramid detection from age and gender structure
- line suggestion for temporal first dimensions
- column suggestion for categorical first dimensions
- scatterplot fallback for measure-vs-measure data
- table fallback when the data does not present a good chart mapping

Use:

```ts
import {
  getSuggestedChartConfig,
  getSuggestedChartType,
} from '@/lib/charts/suggestions'
```

This stage answers: "What is the fastest credible first chart?"

## Stage 7: Pick the rendering layer

This repo supports more than one rendering level.

### A. Full application flow

Use this when the user is browsing, configuring, and publishing charts in the app.

Relevant overview:

- [docs/VISUALIZATION_TOOL_CORE_FLOW.md](/home/nistrator/vizuelni-admin-srbije/docs/VISUALIZATION_TOOL_CORE_FLOW.md)

Choose this layer when you need:

- browsing and preview
- configuration UI
- saved chart state
- published and embedded charts

### B. React chart components directly

Use this when you already know the shape of the data and just want to render a chart in code.

Relevant guide:

- [packages/react/README.md](/home/nistrator/vizuelni-admin-srbije/packages/react/README.md)

Choose this layer when you need:

- direct component usage
- custom app integration
- local transformed data passed straight into chart props

## Stage 8: Validate the result

A chart that renders is not automatically a good chart.

Check:

- do the mapped fields actually answer the intended question
- are dates parsed correctly
- are categories duplicated because of formatting differences
- is aggregation level correct
- would a table be clearer than the chosen chart
- are labels and units understandable in Serbian and English contexts

If the answer is no, go back one step. Most bad charts come from a bad mapping or a missed transformation, not from the rendering library.

## Recommended end-to-end workflow

For most real work in this repo, this is the practical default:

1. Search for a dataset and inspect metadata.
2. Select the best CSV or JSON resource for preview.
3. Parse it into `ParsedDataset`.
4. Check whether dimensions and measures already match the intended story.
5. If yes, use `getSuggestedChartType(...)` or `getSuggestedChartConfig(...)` to get a strong default.
6. If no, transform the observations first with aggregate, pivot, filter, or percentage utilities.
7. Render the first version.
8. Validate whether the chart is clearer than a table.
9. Refine labels, formatting, and interaction.

## A simple mental model

Think of the flow as three contracts:

1. source contract: "Can I fetch and preview this resource?"
2. data contract: "Can I parse this into dimensions, measures, and observations?"
3. chart contract: "Does this shape support a truthful chart?"

If any contract fails, stop and fix that layer instead of pushing forward blindly.

## Summary

The whole process should be treated as a pipeline, not a single charting step:

```text
Discover -> Preview -> Parse -> Decide -> Transform -> Suggest -> Render -> Validate
```

That is the safest way to handle both kinds of datasets:

- datasets that are already chart-ready
- datasets that need structural cleanup before they can be visualized well
