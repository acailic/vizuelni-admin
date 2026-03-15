# @vizualni/charts

Chart configuration schemas, shared types, and validation utilities for Serbian government data visualization.

## Installation

```bash
npm install @vizualni/charts
```

## Features

- **9 Chart Types**: Line, Bar, Column, Area, Pie, Scatterplot, Table, Combo, Map
- **TypeScript Types**: Shared chart configuration contracts
- **Zod Validation**: Runtime parsing for chart configs
- **Geographic Options**: Map-specific config for Serbian regions, districts, and municipalities
- **Data Package Integration**: Re-exports key data and geo-data types for consumer apps

## Quick Start

### Basic Chart Configuration

```typescript
import type { ChartConfig } from '@vizualni/charts';
import { parseChartConfig, getDefaultOptions } from '@vizualni/charts';

const config: ChartConfig = {
  type: 'bar',
  title: 'Population by Region',
  x_axis: { field: 'region', label: 'Region' },
  y_axis: { field: 'population', label: 'Population' },
  options: getDefaultOptions('bar'),
};

// Validate configuration
const validated = parseChartConfig(config);
```

### Using with Chart Data

```typescript
import type { ChartRendererProps } from '@vizualni/charts';
import { classifyColumns } from '@vizualni/data';

// Prepare your data
const rawData = [
  { region: 'Beograd', population: 1500000, year: 2023 },
  { region: 'Novi Sad', population: 400000, year: 2023 },
];

// Classify columns
const { dimensions, measures } = classifyColumns(rawData);

// Pass validated config into your own renderer or UI layer
const props: ChartRendererProps = {
  config: validated,
  data: rawData,
  height: 400,
  locale: 'sr_latn', // Serbian Latin
};
```

### Map Chart with Geographic Data

```typescript
import type { ChartConfig } from '@vizualni/charts';
import { serbiaDistricts } from '@vizualni/geo-data';

const mapConfig: ChartConfig = {
  type: 'map',
  title: 'Unemployment by District',
  x_axis: { field: 'district_code' },
  y_axis: { field: 'unemployment_rate' },
  options: {
    geoLevel: 'district',
    colorScaleType: 'sequential',
    colorPalette: 'blues',
    classificationMethod: 'quantiles',
    classCount: 5,
  },
};
```

## Chart Types

### Line Chart

Best for: Time series, trends over continuous data

```typescript
const config: ChartConfig = {
  type: 'line',
  title: 'GDP Growth',
  x_axis: { field: 'year', type: 'date' },
  y_axis: { field: 'gdp', type: 'linear' },
  options: { curveType: 'monotone', showDots: true },
};
```

### Bar/Column Chart

Best for: Comparing discrete categories

```typescript
const config: ChartConfig = {
  type: 'bar', // or 'column'
  title: 'Budget Allocation',
  x_axis: { field: 'category' },
  y_axis: { field: 'amount' },
  options: { grouping: 'stacked' }, // or 'grouped', 'percent-stacked'
};
```

### Pie Chart

Best for: Part-to-whole relationships

```typescript
const config: ChartConfig = {
  type: 'pie',
  title: 'Market Share',
  x_axis: { field: 'company' },
  y_axis: { field: 'percentage' },
  options: { innerRadius: 50, showLabels: true }, // innerRadius > 0 for donut
};
```

### Scatterplot

Best for: Correlation between two measures

```typescript
const config: ChartConfig = {
  type: 'scatterplot',
  title: 'GDP vs Education',
  x_axis: { field: 'gdp_per_capita' },
  y_axis: { field: 'education_index' },
  options: { dotSize: 8, opacity: 0.7 },
};
```

### Map Chart

Best for: Geographic distribution

```typescript
const config: ChartConfig = {
  type: 'map',
  title: 'Population Density',
  x_axis: { field: 'municipality_code' },
  y_axis: { field: 'density' },
  options: {
    geoLevel: 'municipality',
    colorPalette: 'viridis',
    showSymbols: true,
  },
};
```

## Scope

`@vizualni/charts` currently ships chart config/types utilities, not prebuilt React renderer components.
Use it to validate configs, infer defaults, and share chart contracts across apps/packages.

## API Reference

### Types

#### `ChartConfig`

Main configuration object for any chart.

- `type`: Chart type
- `title`: Chart title
- `x_axis`, `y_axis`: Axis configurations
- `options`: Chart-specific options
- `referenceLines`: Optional reference lines
- `annotations`: Optional annotations

#### `ChartOptions`

Chart-specific styling and behavior options.

#### `ChartRendererProps`

Props for chart renderer components.

- `config`: ChartConfig
- `data`: Array of data records
- `height`: Chart height in pixels
- `locale`: 'sr_cyrl' | 'sr_latn' | 'en'

### Functions

#### `parseChartConfig(config)`

Validate and parse a chart configuration.

#### `getDefaultOptions(type)`

Get default options for a chart type.

#### `getChartCapabilities(type)`

Get capabilities (stacking, grouping, etc.) for a chart type.

#### `normalizeChartType(type)`

Normalize chart type string (e.g., 'scatter' → 'scatterplot').

## Integration with @vizualni/data

```typescript
import { classifyColumns, joinDatasets } from '@vizualni/data';
import type { ChartConfig } from '@vizualni/charts';

// Prepare data
const { dimensions, measures } = classifyColumns(rawData);

// Build chart config dynamically
const config: ChartConfig = {
  type: 'bar',
  title: `${measures[0].label} by ${dimensions[0].label}`,
  x_axis: { field: dimensions[0].key },
  y_axis: { field: measures[0].key },
};
```

## License

MIT
