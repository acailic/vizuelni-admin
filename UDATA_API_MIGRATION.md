# uData API Migration Summary

## Overview
Successfully migrated the vizualni-admin application from the CKAN API (`/api/action`) to the uData API (`/api/1`) endpoint of data.gov.rs.

## Changes Made

### 1. Data Ingestion Script (`scripts/fetch-udata-ids.js`)

**Created new script** to fetch dataset IDs from the uData API:
- **API Base URL**: Changed from `https://data.gov.rs/api/action` to `https://data.gov.rs/api/1`
- **Search Endpoint**: Updated from `/package_search` to `/datasets/`
- **Query Parameters**: Changed `rows` to `page_size`
- **Response Structure**: Updated parsing from `data.result.results` to `data.data`
- **Added Tag Search**: Implemented `searchByTag()` function for more precise dataset discovery
- **Enhanced Keywords**: Added Serbian diacritics and variations:
  - `budzet`, `budžet`
  - `vazduh`, `vazduha`, `kvalitet vazduha`
  - `skole`, `škole`, `obrazovanje`
  - `saobracaj`, `saobraćaj`

**Key Features**:
- Automatic fallback to tag search when keyword search fails
- Special handling for air quality data using `kvalitet-vazdukha` tag
- Output format compatible with `app/lib/demos/config.ts`

### 2. API Client (`app/domain/data-gov-rs/client.ts`)

**Added Excel Support**:
- New method: `getResourceArrayBuffer()` for binary file downloads
- Required for XLS/XLSX file processing

### 3. Data Utilities (`app/domain/data-gov-rs/utils.ts`)

**Extended Format Support**:
- Added `XLS` and `XLSX` to supported formats
- Updated priority: `CSV > JSON > GeoJSON > XML > XLS/XLSX`

### 4. Data Hook (`app/hooks/use-data-gov-rs.ts`)

**Excel Parsing Implementation**:
- Added `parseExcelData()` function using ExcelJS library
- Handles multiple cell types:
  - Rich text
  - Formulas
  - Hyperlinks
  - Regular values
- Dynamic import to optimize bundle size
- Converts Excel data to JSON format compatible with visualizations

### 5. Demo Configuration (`app/lib/demos/config.ts`)

**Updated Dataset IDs**:
- `air-quality`: `6616cc69e9cf23a1ec8096b5` → `692076d3d79dfb1930d75b90`
- `environment`: `6616cc69e9cf23a1ec8096b5` → `692076d3d79dfb1930d75b90`

These IDs correspond to the latest air quality datasets from the uData API.

### 6. Air Quality Demo (`app/pages/demos/air-quality.tsx`)

**Enhanced Data Processing**:
- **Dual Format Support**:
  - **Long Format** (NRIZ): Pollutant names in rows, single quantity column
  - **Wide Format** (Šabac/Automatic Stations): Pollutants as separate columns
- **Automatic Column Detection**:
  - Detects PM10 and PM2.5 columns regardless of format
  - Handles various naming conventions (case-insensitive)
- **Data Normalization**:
  - Converts both formats to unified structure for visualization
  - Extracts date/time information automatically

## Dataset Discovery Results

Successfully found **air quality datasets** from the uData API:

### Example Datasets (November 2025):
1. **ЗЈЗ Шабац, Ј.Цвијића 1** (10.11.-16.11.2025)
   - ID: `692076d3d79dfb1930d75b90`
   - Format: XLS
   - Tag: `kvalitet-vazdukha`

2. **Бенска бара** (10.11.-16.11.2025)
   - ID: `69207660311a081b000b0524`
   - Format: XLS
   - Tag: `kvalitet-vazdukha`

3. **Аутобуска станица** (10.11.-16.11.2025)
   - ID: `692075e07732f01c86479a14`
   - Format: XLS
   - Tag: `kvalitet-vazdukha`

## API Differences: CKAN vs uData

| Feature | CKAN API | uData API |
|---------|----------|-----------|
| Base URL | `/api/action` | `/api/1` |
| Search Endpoint | `/package_search` | `/datasets/` |
| Dataset Detail | `/package_show` | `/datasets/{id}/` |
| Page Size Param | `rows` | `page_size` |
| Response Root | `result.results` | `data` |
| Organization | `organization.name` | `organization.name` |
| Resources | `resources[]` | `resources[]` |
| Tags | `tags[].name` | `tags[]` (strings) |

## Testing Recommendations

1. **Run the fetch script**:
   ```bash
   node scripts/fetch-udata-ids.js
   ```

2. **Test air quality demo**:
   - Navigate to `/demos/air-quality`
   - Verify data loads from uData API
   - Check Excel parsing works correctly
   - Confirm visualizations render properly

3. **Test other demos**:
   - Update remaining demo configurations with new dataset IDs
   - Test each demo category

4. **Verify fallback behavior**:
   - Test with network disabled
   - Confirm fallback data displays correctly

## Next Steps

1. **Update Remaining Demos**:
   - Budget (`budget`)
   - Education (`education`)
   - Transport (`transport`)
   - Healthcare (`healthcare`)
   - etc.

2. **Search for Additional Datasets**:
   - Run fetch script with more keywords
   - Explore different tags on data.gov.rs
   - Update `preferredDatasetIds` in config

3. **Documentation**:
   - Update README with uData API information
   - Document Excel format requirements
   - Add troubleshooting guide

4. **Performance Optimization**:
   - Consider caching frequently accessed datasets
   - Optimize Excel parsing for large files
   - Implement progressive loading for large datasets

## Known Issues

1. **Limited Dataset Availability**:
   - Some keywords return no results
   - Not all datasets have CSV/JSON/XLS formats
   - May need to expand search criteria

2. **Format Variations**:
   - Different organizations use different Excel structures
   - Column naming is inconsistent
   - May require additional normalization logic

## Dependencies

- **ExcelJS**: `^4.4.0` (already in package.json)
  - Used for parsing XLS/XLSX files
  - Dynamic import to reduce bundle size

## Backward Compatibility

The application maintains backward compatibility:
- Old dataset IDs still work if they exist in uData
- Fallback data ensures demos work offline
- CKAN API client code preserved for reference

## Resources

- **uData API Documentation**: https://data.gov.rs/apidoc/
- **data.gov.rs Portal**: https://data.gov.rs/sr/datasets/
- **Air Quality Tag**: https://data.gov.rs/sr/datasets/?tag=kvalitet-vazdukha
