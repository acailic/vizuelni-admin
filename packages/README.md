# @vizualni Packages

Monorepo packages for Serbian government data visualization.

## Packages

### Core Packages

| Package                                | Description                                                           |
| -------------------------------------- | --------------------------------------------------------------------- |
| [`@vizualni/core`](./core)             | Framework-agnostic visualization primitives (scales, layouts, shapes) |
| [`@vizualni/react`](./react)           | React bindings for @vizualni/core                                     |
| [`@vizualni/connectors`](./connectors) | Data connectors for loading datasets                                  |

### Data Packages

| Package                            | Description                                                               |
| ---------------------------------- | ------------------------------------------------------------------------- |
| [`@vizualni/data`](./data)         | Data preparation utilities (classification, geographic matching, joining) |
| [`@vizualni/geo-data`](./geo-data) | Serbian geographic data (regions, districts, municipalities GeoJSON)      |

### Visualization Packages

| Package                        | Description                                                         |
| ------------------------------ | ------------------------------------------------------------------- |
| [`@vizualni/charts`](./charts) | Chart configuration schemas, shared types, and validation utilities |

## Installation

```bash
# Install all packages in the monorepo
npm install

# Build all packages
npm run build:packages
```

## Usage Examples

### Data Preparation

```typescript
import { classifyColumns, joinDatasets } from '@vizualni/data';

// Classify columns in your dataset
const { dimensions, measures } = classifyColumns(rawData);

// Join datasets on geographic keys
const joined = joinDatasets(primary, secondary, config);
```

### Geographic Data

```typescript
import { serbiaDistricts, findFeatureByName } from '@vizualni/geo-data';

// Find a district by name (supports Cyrillic, Latin, English)
const district = findFeatureByName(serbiaDistricts, 'Београд');
```

### Chart Configuration

```typescript
import type { ChartConfig } from '@vizualni/charts';
import { parseChartConfig, getDefaultOptions } from '@vizualni/charts';

const config: ChartConfig = {
  type: 'bar',
  title: 'Population by Region',
  x_axis: { field: 'region' },
  y_axis: { field: 'population' },
  options: getDefaultOptions('bar'),
};
```

## Development

```bash
# Build a specific package
npm run build --workspace=@vizualni/data

# Run tests for a package
npm test --workspace=@vizualni/data

# Type check all packages
npm run typecheck
```

## Publishing

This monorepo uses Changesets for versioning and publishing.

```bash
# Create a changeset
npx changeset

# Version packages
npx changeset version

# Publish to npm
npx changeset publish
```

## License

MIT
