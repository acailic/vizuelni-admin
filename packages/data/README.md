# @vizualni/data

Data preparation utilities for Serbian government data visualization.

## Installation
```bash
npm install @vizualni/data
```

## Features
- **Column Classification**: Automatically classify columns as dimensions, measures, or metadata
- **Geographic Matching**: Match Serbian geographic names (Cyrillic ↔ Latin ↔ English)
- **Dataset Joining**: Join datasets with automatic key suggestions

## Usage

### Column Classification

```typescript
import { classifyColumns } from '@vizualni/data'

const data = [
  { region: 'Beograd', population: 1500000, year: 2023 },
  { region: 'Novi Sad', population: 400000, year: 2023 },
]

const result = classifyColumns(data)
// result.dimensions = [{ key: 'region', type: 'geographic', ... }]
// result.measures = [{ key: 'population', ... }]
// result.profiles = [...]
```

### Geographic Matching

```typescript
import { matchGeoColumn, detectGeoLevel } from '@vizualni/data'

const values = ['Beograd', 'Novi Sad', 'Ниш']
const result = matchGeoColumn(values, 'municipality')
// result.matchRate = 1.0
// result.matched = Map { 'Beograd' => '007', 'Novi Sad' => '023', 'Ниш' => '048' }

// Auto-detect geographic level
const level = detectGeoLevel(['Vojvodina', 'Šumadija i zapadna Srbija'])
// level = 'region'
```

### Dataset Joining

```typescript
import { joinDatasets, autoSuggestJoin } from '@vizualni/data'

const primary = {
  observations: [{ region: 'Beograd', gdp: 100000 }],
  dimensions: [{ key: 'region', type: 'geographic' }],
  measures: [{ key: 'gdp' }],
  // ...
}

const secondary = {
  observations: [{ name: 'Београд', population: 1500000 }],
  dimensions: [{ key: 'name', type: 'geographic' }],
  measures: [{ key: 'population' }],
  // ...
}

// Get join suggestions
const suggestions = autoSuggestJoin(primary, secondary)

// Perform join
const joined = joinDatasets(primary, secondary, {
  primary: { datasetId: 'gdp', resourceId: '1', joinKey: 'region' },
  secondary: { datasetId: 'pop', resourceId: '1', joinKey: 'name' },
  joinType: 'left'
})
```

## API Reference

### `classifyColumns(observations, columns?)`
Classifies columns in a dataset.

**Parameters:**
- `observations`: Array of data records
- `columns`: Optional array of column names (defaults to all)

**Returns:** `ClassificationResult`
- `dimensions`: Array of `DimensionMeta`
- `measures`: Array of `MeasureMeta`
- `metadataColumns`: Array of column names
- `profiles`: Array of `ColumnProfile`

### `matchGeoColumn(values, geoLevel)`
Matches values to geographic IDs.

**Parameters:**
- `values`: Array of string values
- `geoLevel`: 'region' | 'district' | 'municipality'

**Returns:** `GeoMatchResult`
- `matchRate`: 0-1
- `matched`: Map of value → ID
- `unmatched`: Array of unmatched values

### `detectGeoLevel(values)`
Auto-detects geographic level.

**Parameters:**
- `values`: Array of string values

**Returns:** `GeoLevel | null`

### `joinDatasets(primary, secondary, config)`
Joins two datasets.

**Parameters:**
- `primary`: Primary `ParsedDataset`
- `secondary`: Secondary `ParsedDataset`
- `config`: `JoinConfig`

**Returns:** `JoinedDataset`

### `autoSuggestJoin(primary, secondary)`
Suggests join keys.

**Parameters:**
- `primary`: Primary `ParsedDataset`
- `secondary`: Secondary `ParsedDataset`

**Returns:** Array of `JoinSuggestion`

## License
MIT
