/**
 * GeoJSON Types for Serbian Municipalities
 * Feature 40: Geographic Visualizations
 */

export type GeoLevel = 'country' | 'province' | 'district' | 'municipality';

export interface SerbianAdministrativeUnit {
  code: string;
  name: {
    en: string;
    sr: string; // Cyrillic
    srLat: string; // Latin
  };
  level: GeoLevel;
  parentCode?: string;
  population?: number;
  area?: number; // km²
}

export interface Province extends SerbianAdministrativeUnit {
  level: 'province';
  districts: string[];
}

export interface District extends SerbianAdministrativeUnit {
  level: 'district';
  provinceCode: string;
  municipalities: string[];
}

export interface Municipality extends SerbianAdministrativeUnit {
  level: 'municipality';
  districtCode: string;
  type: 'city' | 'municipality' | 'urban' | 'rural';
}

// GeoJSON types
export interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    code: string;
    name: string;
    nameSr?: string;
    nameSrLat?: string;
    [key: string]: unknown;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface GeoJSONCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

// Map data for visualization
export interface MapDataPoint {
  code: string;
  value: number;
  label?: string;
}

// Color scale configuration
export interface ColorScaleConfig {
  type: 'sequential' | 'diverging' | 'categorical';
  colors: string[];
  domain?: [number, number];
  midPoint?: number;
}
