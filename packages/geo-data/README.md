# @vizualni/geo-data

Serbian geographic data for visualization - regions, districts, and municipalities GeoJSON with utility functions.

## Installation
```bash
npm install @vizualni/geo-data
```

## Features
- **GeoJSON Data**: Regions, districts, and municipalities of Serbia
- **Utility Functions**: Centroid calculation, feature lookup, name search
- **Multilingual Names**: Serbian Cyrillic, Serbian Latin, and English
- **TypeScript Types**: Full type definitions included

## Usage

### Import GeoJSON Data

```typescript
import { serbiaRegions, serbiaDistricts, serbiaMunicipalities } from '@vizualni/geo-data'

// Use with mapping libraries like Leaflet, D3, or Plotly
```

### Get Feature by Name

```typescript
import { findFeatureByName, serbiaDistricts } from '@vizualni/geo-data'

// Supports Serbian Cyrillic, Latin, and English
const beograd = findFeatureByName(serbiaDistricts, 'Београд')
const belgrade = findFeatureByName(serbiaDistricts, 'Belgrade')
const gradBeograd = findFeatureByName(serbiaDistricts, 'Grad Beograd')
```

### Calculate Centroid

```typescript
import { getCentroid, serbiaRegions } from '@vizualni/geo-data'

const vojvodina = serbiaRegions.features.find(f => f.properties.id === 'RS10')
const center = getCentroid(vojvodina)
// center = [19.7, 45.4] (approximate)
```

### Create Lookup Map

```typescript
import { createFeatureLookup, serbiaDistricts } from '@vizualni/geo-data'

const lookup = createFeatureLookup(serbiaDistricts)
const district = lookup.get('05') // North Banat District
```

### Get All Names

```typescript
import { getAllFeatureNames, serbiaRegions } from '@vizualni/geo-data'

const englishNames = getAllFeatureNames(serbiaRegions, 'en')
// ['Belgrade Region', 'Vojvodina', 'Šumadija and Western Serbia', ...]

const cyrillicNames = getAllFeatureNames(serbiaRegions, 'sr_cyrl')
// ['Београдски регион', 'Војводина', 'Шумадија и Западна Србија', ...]
```

## API Reference

### GeoJSON Data

- `serbiaRegions`: FeatureCollection of 5 statistical regions (NUTS 2)
- `serbiaDistricts`: FeatureCollection of 31 administrative districts (okruzi)
- `serbiaMunicipalities`: FeatureCollection of municipalities (opštine)

### Utility Functions

#### `getCentroid(feature)`
Calculate the centroid of a polygon feature.
- **Parameters**: `feature: Feature`
- **Returns**: `[lng, lat]` tuple or `null`

#### `getFeatureProperties(feature)`
Get typed properties from a feature.
- **Parameters**: `feature: Feature`
- **Returns**: `SerbiaGeoProperties`

#### `findFeatureById(collection, id)`
Find a feature by its ID.
- **Parameters**: `collection: FeatureCollection`, `id: string`
- **Returns**: `Feature | undefined`

#### `findFeatureByName(collection, name)`
Find a feature by name (supports all three name variants).
- **Parameters**: `collection: FeatureCollection`, `name: string`
- **Returns**: `Feature | undefined`

#### `getAllFeatureNames(collection, lang)`
Get all feature names in a specific language.
- **Parameters**: `collection: FeatureCollection`, `lang: 'sr_cyrl' | 'sr_latn' | 'en'`
- **Returns**: `string[]`

#### `createFeatureLookup(collection)`
Create a Map for fast feature lookup by ID.
- **Parameters**: `collection: FeatureCollection`
- **Returns**: `Map<string, Feature>`

#### `getFeaturesByLevel(level)`
Get the appropriate GeoJSON for a geographic level.
- **Parameters**: `level: 'region' | 'district' | 'municipality'`
- **Returns**: `FeatureCollection`

## Feature Properties

Each feature has the following properties:
- `id`: Standard identifier (e.g., "RS00", "00", "001")
- `code`: Administrative code
- `name_sr_cyrl`: Serbian name in Cyrillic
- `name_sr_latn`: Serbian name in Latin script
- `name_en`: English name

## License
MIT
