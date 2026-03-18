/**
 * Geographic Utilities Index
 * Feature 40: Geographic Visualizations
 */

// Types
export * from './types';

// Administrative units data
export {
  PROVINCES,
  DISTRICTS,
  SAMPLE_MUNICIPALITIES,
  getProvinceByCode,
  getDistrictByCode,
  getMunicipalityByCode,
  getDistrictsByProvince,
  normalizeName,
} from './administrative-units';

// Choropleth utilities
export {
  COLOR_SCALES,
  getColorForValue,
  generateLegendItems,
  createColorScaleFromData,
} from './choropleth';
