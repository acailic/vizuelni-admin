# Vizualni Admin API Documentation

Complete reference for all components, hooks, and utilities in Vizualni Admin.

**API Stability Policy**: This package uses stability levels to communicate API
maturity. See [API Stability Policy](./API_STABILITY.md) for details on
stability levels, deprecation policy, and versioning.

**Stability Levels**:

- `@stable` - Production-ready, backward compatible within major versions
- `@experimental` - Under development, may change in future releases
- `@deprecated` - No longer recommended, will be removed in a future version

---

## 📚 Table of Contents

- [Installation](#installation)
- [API Stability](#api-stability)
- [Chart Components](#chart-components)
- [Chart Plugin System](#chart-plugin-system)
- [Data Hooks](#data-hooks)
- [Utility Functions](#utility-functions)
- [Type Definitions](#type-definitions)
- [Configuration](#configuration)
- [Data.gov.rs Client](#datagovrs-client)
- [Examples](#examples)

---

## Installation

```bash
npm install @acailic/vizualni-admin
# or
yarn add @acailic/vizualni-admin
```

---

## API Stability

This package follows semantic versioning with explicit stability levels for all
exported APIs. For detailed information about our stability policy, deprecation
process, and versioning guidelines, see the
[API Stability Policy](./API_STABILITY.md) document.

### Quick Reference

| Category                | Stable                                                                                                          | Experimental                                                                | Deprecated |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------- |
| **Chart Components**    | `ChartData`, `BaseChartConfig`                                                                                  | `LineChart`, `BarChart`, `ColumnChart`, `AreaChart`, `PieChart`, `MapChart` | -          |
| **Chart Plugin System** | -                                                                                                               | All plugin APIs (`registerChartPlugin`, `IChartPlugin`, etc.)               | -          |
| **React Hooks**         | `useLocale`                                                                                                     | `useDataGovRs`, `useChartConfig`                                            | -          |
| **Utilities**           | `sortByKey`, `filterData`, `groupByKey`, `aggregateByKey`, `formatNumber`, `formatCurrency`, `formatPercentage` | `transformData`, `formatScientific`                                         | -          |
| **Core**                | Locale utilities, D3 formatters                                                                                 | Config validation, config types                                             | -          |
| **Data.gov.rs Client**  | -                                                                                                               | All client APIs and types                                                   | -          |

**Legend**:

- `@stable` - Production-ready, covered by semantic versioning, backward
  compatible within major versions
- `@experimental` - Under active development, may change in future releases, not
  recommended for production use
- `@deprecated` - No longer recommended, will be removed in a future version

---

## Chart Components

### LineChart

> **@experimental** | Since: 0.1.0-beta.1

Creates line and area charts for time series and continuous data.

```jsx
import { LineChart } from "@acailic/vizualni-admin";

<LineChart
  data={data}
  xKey="date"
  yKey="value"
  title="Revenue Over Time"
  width={800}
  height={400}
/>;
```

#### Props

| Prop          | Type                               | Default      | Description                             |
| ------------- | ---------------------------------- | ------------ | --------------------------------------- |
| `data`        | `DataPoint[]`                      | **Required** | Array of data points                    |
| `xKey`        | `string`                           | **Required** | Key for x-axis values                   |
| `yKey`        | `string`                           | **Required** | Key for y-axis values                   |
| `width`       | `number \| string`                 | 800          | Chart width                             |
| `height`      | `number`                           | 400          | Chart height                            |
| `title`       | `string`                           | -            | Chart title                             |
| `color`       | `string`                           | '#0090ff'    | Line color                              |
| `curve`       | `'linear' \| 'monotone' \| 'step'` | 'linear'     | Line curve type                         |
| `showGrid`    | `boolean`                          | true         | Show grid lines                         |
| `showTooltip` | `boolean`                          | true         | Show tooltips                           |
| `showLegend`  | `boolean`                          | true         | Show legend                             |
| `strokeWidth` | `number`                           | 2            | Line stroke width                       |
| `fill`        | `boolean \| string`                | false        | Fill area under line                    |
| `locale`      | `string`                           | 'sr'         | Localization (sr, sr-Latn, sr-Cyrl, en) |
| `theme`       | `ChartTheme`                       | defaultTheme | Chart theme                             |

#### Example

```jsx
const temperatureData = [
  { date: "2024-01", temp: 5 },
  { date: "2024-02", temp: 7 },
  { date: "2024-03", temp: 12 },
  { date: "2024-04", temp: 18 },
];

<LineChart
  data={temperatureData}
  xKey="date"
  yKey="temp"
  title="Temperature Trend"
  color="#ff6b6b"
  fill="gradient"
  locale="sr"
/>;
```

### BarChart

> **@experimental** | Since: 0.1.0-beta.1

Creates vertical and horizontal bar charts for comparisons.

```jsx
import { BarChart } from "@acailic/vizualni-admin";

<BarChart data={data} xKey="category" yKey="value" orientation="vertical" />;
```

#### Props

| Prop          | Type                         | Default      | Description                  |
| ------------- | ---------------------------- | ------------ | ---------------------------- |
| `data`        | `DataPoint[]`                | **Required** | Array of data points         |
| `xKey`        | `string`                     | **Required** | Key for category axis        |
| `yKey`        | `string`                     | **Required** | Key for value axis           |
| `orientation` | `'vertical' \| 'horizontal'` | 'vertical'   | Bar orientation              |
| `colors`      | `string[]`                   | ['#0090ff']  | Bar colors                   |
| `barRadius`   | `number`                     | 0            | Bar border radius            |
| `showValues`  | `boolean`                    | true         | Show values on bars          |
| `sortBars`    | `boolean`                    | false        | Sort bars by value           |
| `...`         | _LineChart props_            | -            | Inherits all LineChart props |

### ColumnChart

> **@experimental** | Since: 0.1.0-beta.1

Creates vertical column charts for categorical data comparison.

```jsx
import { ColumnChart } from "@acailic/vizualni-admin";

<ColumnChart
  data={data}
  xKey="category"
  yKey="value"
  colors={["#0090ff", "#00d4ff"]}
/>;
```

#### Props

| Prop         | Type             | Default       | Description                 |
| ------------ | ---------------- | ------------- | --------------------------- |
| `data`       | `DataPoint[]`    | **Required**  | Array of data points        |
| `xKey`       | `string`         | **Required**  | Key for category axis       |
| `yKey`       | `string`         | **Required**  | Key for value axis          |
| `colors`     | `string[]`       | defaultColors | Column colors               |
| `showValues` | `boolean`        | true          | Show values on columns      |
| `...`        | _BarChart props_ | -             | Inherits all BarChart props |

### AreaChart

> **@experimental** | Since: 0.1.0-beta.1

Creates area charts for showing volume over time.

```jsx
import { AreaChart } from "@acailic/vizualni-admin";

<AreaChart
  data={data}
  xKey="date"
  yKey="value"
  color="#7c4dff"
  fill="gradient"
/>;
```

#### Props

| Prop       | Type                | Default      | Description                  |
| ---------- | ------------------- | ------------ | ---------------------------- |
| `data`     | `DataPoint[]`       | **Required** | Array of data points         |
| `xKey`     | `string`            | **Required** | Key for x-axis values        |
| `yKey`     | `string`            | **Required** | Key for y-axis values        |
| `fill`     | `boolean \| string` | true         | Fill area under line         |
| `gradient` | `boolean`           | false        | Use gradient fill            |
| `...`      | _LineChart props_   | -            | Inherits all LineChart props |

### PieChart

> **@experimental** | Since: 0.1.0-beta.1

Creates pie and donut charts for proportional data.

```jsx
import { PieChart } from "@acailic/vizualni-admin";

<PieChart
  data={data}
  nameKey="category"
  valueKey="percentage"
  innerRadius={60}
/>;
```

#### Props

| Prop              | Type          | Default       | Description                    |
| ----------------- | ------------- | ------------- | ------------------------------ |
| `data`            | `DataPoint[]` | **Required**  | Array of data points           |
| `nameKey`         | `string`      | **Required**  | Key for segment names          |
| `valueKey`        | `string`      | **Required**  | Key for segment values         |
| `innerRadius`     | `number`      | 0             | Inner radius (for donut chart) |
| `outerRadius`     | `number`      | 100           | Outer radius                   |
| `startAngle`      | `number`      | 0             | Starting angle                 |
| `endAngle`        | `number`      | 360           | Ending angle                   |
| `showLabels`      | `boolean`     | true          | Show segment labels            |
| `showPercentages` | `boolean`     | true          | Show percentages               |
| `colors`          | `string[]`    | defaultColors | Color palette                  |

### MapChart

> **@experimental** | Since: 0.1.0-beta.1

Creates a map of Serbia with regional data visualization using D3.

```jsx
import { MapChart } from "@acailic/vizualni-admin";

<MapChart
  data={regionalData}
  regionKey="okrug"
  valueKey="population"
  colorScale="blues"
/>;
```

#### Props

| Prop          | Type           | Default      | Description          |
| ------------- | -------------- | ------------ | -------------------- |
| `data`        | `RegionData[]` | **Required** | Regional data array  |
| `regionKey`   | `string`       | **Required** | Key for region names |
| `valueKey`    | `string`       | **Required** | Key for values       |
| `colorScale`  | `ColorScale`   | 'blues'      | Color scheme         |
| `showTooltip` | `boolean`      | true         | Show tooltips        |
| `showLabels`  | `boolean`      | true         | Show region labels   |
| `interactive` | `boolean`      | true         | Enable zoom/pan      |

---

## Chart Plugin System

> **@experimental** | Since: 0.1.0-beta.1

The chart plugin system enables dynamic registration of custom chart types
without modifying the core bundle. This prevents bundle size bloat and supports
a third-party chart ecosystem.

### Registration API

```typescript
import { registerChartPlugin, getChartPlugin } from '@acailic/vizualni-admin/charts';
import { myCustomChartPlugin } from 'my-custom-chart-plugin';

// Register the plugin
const result = registerChartPlugin(myCustomChartPlugin);

// Use the registered plugin
const plugin = getChartPlugin('my-custom-chart');
const ChartComponent = plugin.component;

<ChartComponent data={data} config={config} />
```

### Plugin Interface

A plugin is an object implementing `IChartPlugin<TConfig>` that includes:

- **Metadata**: `id`, `name`, `version`, `author`, `description`, `category`,
  `tags`, `license`, `minCoreVersion`
- **Component**: React component that accepts standard chart props (data,
  config, height, width, locale, callbacks)
- **Optional hooks**: `onRegister`, `onUnregister`, `validateData`,
  `transformData`, `transformConfig`
- **Optional helpers**: `defaultConfig`, `configSchema`, `exampleData`,
  `exampleConfig`

### Registry Functions

| Function                | Stability     | Description                                      |
| ----------------------- | ------------- | ------------------------------------------------ |
| `registerChartPlugin`   | @experimental | Register a plugin with validation                |
| `unregisterChartPlugin` | @experimental | Remove a plugin (built-in plugins are protected) |
| `getChartPlugin`        | @experimental | Retrieve a registered plugin                     |
| `listChartPlugins`      | @experimental | List all registered plugins                      |
| `hasChartPlugin`        | @experimental | Check if a plugin is registered                  |
| `clearChartPlugins`     | @experimental | Remove all external plugins                      |
| `getChartPluginStats`   | @experimental | Get plugin statistics                            |

### Plugin Types

| Type                       | Stability     | Description                 |
| -------------------------- | ------------- | --------------------------- |
| `IChartPlugin`             | @experimental | Plugin interface definition |
| `ChartPluginMetadata`      | @experimental | Plugin metadata structure   |
| `ChartPluginHooks`         | @experimental | Plugin lifecycle hooks      |
| `ChartValidationResult`    | @experimental | Validation result type      |
| `ChartRegistryEntry`       | @experimental | Internal registry entry     |
| `PluginRegistrationResult` | @experimental | Registration result type    |
| `RegisterPluginOptions`    | @experimental | Registration options        |
| `IChartRegistry`           | @experimental | Registry interface          |

**See**:
[Architecture: Chart Plugin System](./ARCHITECTURE.md#chart-plugin-system) for
detailed documentation and examples.

---

## Data Hooks

### useDataGovRs

> **@experimental** | Since: 0.1.0-beta.1

Fetches data from the Serbian Open Data Portal (data.gov.rs).

```jsx
import { useDataGovRs } from "@acailic/vizualni-admin";

function MyComponent() {
  const { data, isLoading, error, refetch } = useDataGovRs({
    params: { q: "ekonomija" },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{data?.length} datasets found</div>;
}
```

#### Parameters

- `options: UseDataGovRsOptions` - Configuration options including search params

#### Options

| Option            | Type           | Default      | Description                             |
| ----------------- | -------------- | ------------ | --------------------------------------- |
| `params`          | `SearchParams` | **Required** | Search parameters                       |
| `enabled`         | `boolean`      | true         | Enable automatic fetching               |
| `cacheTime`       | `number`       | 0            | Cache time in ms (0 = no cache)         |
| `refetchInterval` | `number`       | 0            | Refetch interval in ms (0 = no refetch) |

#### Returns

```typescript
{
  data: DatasetMetadata[] | null;
  count: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

### useChartConfig

> **@experimental** | Since: 0.1.0-beta.1

Manages chart configuration with validation and defaults.

```jsx
import { useChartConfig } from "@acailic/vizualni-admin";

function MyChart() {
  const [config, setConfig] = useChartConfig({
    xAxis: "date",
    yAxis: "value",
    color: "#0090ff",
  });

  return <LineChart config={config} />;
}
```

### useLocale

> **@stable** | Since: 0.1.0-beta.1

Manages locale state for internationalization.

```jsx
import { useLocale } from "@acailic/vizualni-admin";

function App() {
  const { locale, setLocale } = useLocale();

  return (
    <div>
      <button onClick={() => setLocale("sr-Latn")}>Latin</button>
      <button onClick={() => setLocale("sr-Cyrl")}>Cyrillic</button>
      <p>Current: {locale}</p>
    </div>
  );
}
```

---

## Utility Functions

### sortByKey

> **@stable** | Since: 0.1.0-beta.1

Sorts data array by a key in ascending or descending order.

```jsx
import { sortByKey } from "@acailic/vizualni-admin/utils";

const sorted = sortByKey(data, "year", "desc");
```

### filterData

> **@stable** | Since: 0.1.0-beta.1

Filters data array by a predicate function.

```jsx
import { filterData } from "@acailic/vizualni-admin/utils";

const filtered = filterData(data, (item) => item.value > 100);
```

### groupByKey

> **@stable** | Since: 0.1.0-beta.1

Groups data array by a key.

```jsx
import { groupByKey } from "@acailic/vizualni-admin/utils";

const grouped = groupByKey(data, "category");
// { "category1": [...items], "category2": [...items] }
```

### aggregateByKey

> **@stable** | Since: 0.1.0-beta.1

Aggregates data by a key with sum, avg, count, min, or max.

```jsx
import { aggregateByKey } from "@acailic/vizualni-admin/utils";

const totals = aggregateByKey(data, "category", "value", "sum");
// { "category1": 1500, "category2": 2300 }
```

### transformData

> **@experimental** | Since: 0.1.0-beta.1

Transforms data using a mapping function.

```jsx
import { transformData } from "@acailic/vizualni-admin/utils";

const transformed = transformData(data, (item) => ({
  ...item,
  normalized: item.value / 100,
}));
```

### formatNumber

> **@stable** | Since: 0.1.0-beta.1

Formats numbers with thousand separators and decimal places for Serbian locale.

```jsx
import { formatNumber } from "@acailic/vizualni-admin/utils";

formatNumber(1234.56); // "1.234,56"
formatNumber(1234567, { maximumFractionDigits: 0 }); // "1.234.567"
```

### formatCurrency

> **@stable** | Since: 0.1.0-beta.1

Formats numbers as Serbian Dinar (RSD) currency.

```jsx
import { formatCurrency } from "@acailic/vizualni-admin/utils";

formatCurrency(1234.56); // "RSD 1.234,56"
formatCurrency(1234567, { symbol: "дин." }); // "дин. 1.234.567"
```

### formatPercentage

> **@stable** | Since: 0.1.0-beta.1

Formats numbers as percentages.

```jsx
import { formatPercentage } from "@acailic/vizualni-admin/utils";

formatPercentage(0.1234); // "12,3%"
formatPercentage(0.1234, { decimals: 2 }); // "12,34%"
```

### formatScientific

> **@experimental** | Since: 0.1.0-beta.1

Formats numbers in scientific notation.

```jsx
import { formatScientific } from "@acailic/vizualni-admin/utils";

formatScientific(1234567); // "1,23e+6"
```

---

## Type Definitions

### ChartData

> **@stable** | Since: 0.1.0-beta.1

```typescript
type ChartData = Record<string, string | number | null | undefined>;
```

### BaseChartConfig

> **@stable** | Since: 0.1.0-beta.1

```typescript
interface BaseChartConfig {
  xAxis: string;
  yAxis: string | string[];
  color?: string;
  title?: string;
  seriesKeys?: string[];
}
```

### ChartProps

> **@experimental** | Since: 0.1.0-beta.1

```typescript
interface ChartProps extends InteractiveChartProps, ChartLoadingProps {
  id?: string;
  ariaLabel?: string;
  description?: string;
}
```

### ChartTheme

```typescript
interface ChartTheme {
  background: string;
  grid: string;
  text: string;
  colors: string[];
  fontFamily: string;
}
```

### RegionData

```typescript
interface RegionData {
  [region: string]: {
    [metric: string]: number | string;
  };
}
```

### Column

```typescript
interface Column {
  key: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any) => ReactNode;
}
```

---

## Configuration

> **@experimental** | Since: 0.1.0-beta.1

Configuration APIs are experimental and may change as the config system evolves.

### Locale Utilities

> **@stable** | Since: 0.1.0-beta.1

```typescript
import {
  defaultLocale,
  locales,
  parseLocaleString,
  i18n,
  getD3TimeFormatLocale,
  getD3FormatLocale,
  type Locale,
} from "@acailic/vizualni-admin/core";

// Get default locale
console.log(defaultLocale); // 'sr-Latn'

// Parse locale string
const locale = parseLocaleString("sr-Latn-RS");

// Get D3 format locale for Serbian number formatting
const fmt = getD3FormatLocale("sr-Latn");
const formatted = fmt.format(",.2f")(1234.56); // "1.234,56"
```

### Config Validation

> **@experimental** | Since: 0.1.0-beta.1

```typescript
import { validateConfig, DEFAULT_CONFIG } from "@acailic/vizualni-admin/core";
import type {
  VizualniAdminConfig,
  ValidationIssue,
} from "@acailic/vizualni-admin/core";

// Validate configuration
const result = validateConfig(myConfig);

if (result.success) {
  // Use validated config
  console.log(result.data);
} else {
  // Handle validation errors
  console.error(result.errors);
}
```

### Default Configuration

> **@experimental** | Since: 0.1.0-beta.1

```typescript
import { DEFAULT_CONFIG } from "@acailic/vizualni-admin/core";

// Start with default config and customize
const config = {
  ...DEFAULT_CONFIG,
  theme: {
    ...DEFAULT_CONFIG.theme,
    colors: ["#custom", "#colors"],
  },
};
```

---

## Data.gov.rs Client

> **@experimental** | Since: 0.1.0-beta.1

The Data.gov.rs client provides access to the Serbian Open Data Portal API. The
client API is experimental and may change based on updates to the data.gov.rs
API.

### Client Instance

```typescript
import {
  DataGovRsClient,
  createDataGovRsClient,
  dataGovRsClient,
} from "@acailic/vizualni-admin/client";

// Use default client
const datasets = await dataGovRsClient.searchDatasets({ q: "ekonomija" });

// Create custom client
const customClient = createDataGovRsClient({
  baseUrl: "https://data.gov.rs/api/1",
  timeout: 30000,
  retries: 3,
});
```

### Search Datasets

> **@experimental** | Since: 0.1.0-beta.1

```typescript
const result = await dataGovRsClient.searchDatasets({
  q: "ekonomija",
  rows: 20,
  start: 0,
});

console.log(result.datasets); // DatasetMetadata[]
console.log(result.count); // Total count
```

### Get Organization

> **@experimental** | Since: 0.1.0-beta.1

```typescript
const org = await dataGovRsClient.getOrganization("org-id");
console.log(org.title, org.description);
```

### Get Dataset

> **@experimental** | Since: 0.1.0-beta.1

```typescript
const dataset = await dataGovRsClient.getDataset("dataset-id");
console.log(dataset.title, dataset.resources);
```

### Client Types

| Type                | Stability     | Description                |
| ------------------- | ------------- | -------------------------- |
| `DatasetMetadata`   | @experimental | Dataset metadata structure |
| `Organization`      | @experimental | Organization structure     |
| `Resource`          | @experimental | File/resource structure    |
| `PaginatedResponse` | @experimental | Paginated response wrapper |
| `SearchParams`      | @experimental | Search parameters          |
| `DataGovRsConfig`   | @experimental | Client configuration       |
| `ApiError`          | @experimental | API error structure        |

---

## Examples

### Complete Dashboard Example

```jsx
import React from "react";
import {
  LineChart,
  BarChart,
  PieChart,
  useDataGovRs,
} from "@acailic/vizualni-admin";

function Dashboard() {
  const { data: budgetData, loading: loadingBudget } =
    useDataGovRs("budzet-srbije");
  const { data: populationData, loading: loadingPopulation } =
    useDataGovRs("stanovnistvo");

  if (loadingBudget || loadingPopulation) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Serbian Data Dashboard</h1>

      <div className="chart-grid">
        <div className="chart-container">
          <LineChart
            data={budgetData}
            xKey="godina"
            yKey="iznos"
            title="Буџет кроз године"
            width={600}
            height={300}
            locale="sr-Cyrl"
          />
        </div>

        <div className="chart-container">
          <BarChart
            data={populationData}
            xKey="region"
            yKey="population"
            title="Становништво по регионима"
            orientation="horizontal"
            colors={["#0090ff"]}
            locale="sr-Cyrl"
          />
        </div>
      </div>
    </div>
  );
}
```

### Custom Chart Component

```jsx
import React, { useState } from "react";
import { LineChart, useLocalStorage } from "@acailic/vizualni-admin";

function CustomLineChart({ initialData }) {
  const [data, setData] = useState(initialData);
  const [config, setConfig] = useLocalStorage("chart-config", {
    color: "#0090ff",
    showGrid: true,
    curve: "linear",
  });

  const handleDataPointClick = (point) => {
    alert(`Value: ${point.value}`);
  };

  return (
    <div>
      <div className="controls">
        <label>
          Color:
          <input
            type="color"
            value={config.color}
            onChange={(e) => setConfig({ ...config, color: e.target.value })}
          />
        </label>

        <label>
          Show Grid:
          <input
            type="checkbox"
            checked={config.showGrid}
            onChange={(e) =>
              setConfig({ ...config, showGrid: e.target.checked })
            }
          />
        </label>
      </div>

      <LineChart
        data={data}
        xKey="date"
        yKey="value"
        onClick={handleDataPointClick}
        {...config}
      />
    </div>
  );
}
```

---

## Next Steps

- [API Stability Policy](./API_STABILITY.md) - Learn about our stability levels
  and deprecation policy
- [Architecture](./ARCHITECTURE.md) - System architecture and design decisions
- [Getting Started](./GETTING_STARTED.md) - Quick start guide
- [Deployment Guide](./DEPLOYMENT.md) - How to deploy
- [Contributing](../CONTRIBUTING.md) - How to contribute

---

## Support

For API questions and issues:

- [API Stability Policy](./API_STABILITY.md) - Understand API maturity and
  deprecation
- [GitHub Discussions](https://github.com/acailic/vizualni-admin/discussions) -
  Community discussions
- [Report Bug](https://github.com/acailic/vizualni-admin/issues) - Bug reports
  and feature requests
