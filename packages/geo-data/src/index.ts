/**
 * @vizualni/geo-data
 *
 * Serbian geographic data for visualization.
 *
 * @packageDocumentation
 */

import type { Feature, FeatureCollection, Position } from 'geojson';

import type { GeoLevel } from '@vizualni/shared-kernel';

import serbiaRegions from './geo/regions.json' with { type: 'json' };
import serbiaDistricts from './geo/districts.json' with { type: 'json' };
import serbiaMunicipalities from './geo/municipalities.json' with { type: 'json' };

export { serbiaRegions, serbiaDistricts, serbiaMunicipalities };

// Re-export GeoLevel from shared-kernel for convenience
export type { GeoLevel };

/**
 * Properties for a Serbian geographic feature
 */
export interface SerbiaGeoProperties {
  id: string;
  code: string;
  name_sr_cyrl: string;
  name_sr_latn: string;
  name_en: string;
  district?: string; // For municipalities, the parent district code
  [key: string]: unknown; // Allow additional properties from GeoJSON
}

/**
 * Get the centroid of a feature as [longitude, latitude]
 */
export function getCentroid(feature: Feature): Position | null {
  const { geometry } = feature;

  if (geometry.type === 'Point') {
    return geometry.coordinates as Position;
  }

  if (geometry.type === 'Polygon') {
    const coords = geometry.coordinates[0];
    if (!coords || coords.length === 0) return null;

    let sumLng = 0;
    let sumLat = 0;
    for (const coord of coords) {
      sumLng += coord[0];
      sumLat += coord[1];
    }
    return [sumLng / coords.length, sumLat / coords.length];
  }

  return null;
}

/**
 * Get properties from a feature
 */
export function getFeatureProperties(feature: Feature): SerbiaGeoProperties {
  return feature.properties as SerbiaGeoProperties;
}

/**
 * Find a feature by ID
 */
export function findFeatureById(
  collection: FeatureCollection,
  id: string
): Feature | undefined {
  return collection.features.find((f) => f.properties?.id === id);
}

/**
 * Find a feature by name (supports Cyrillic, Latin, and English)
 */
export function findFeatureByName(
  collection: FeatureCollection,
  name: string
): Feature | undefined {
  const normalized = name.toLowerCase().trim();

  return collection.features.find((f) => {
    const props = f.properties as SerbiaGeoProperties;
    return (
      props.name_sr_cyrl?.toLowerCase() === normalized ||
      props.name_sr_latn?.toLowerCase() === normalized ||
      props.name_en?.toLowerCase() === normalized ||
      props.id?.toLowerCase() === normalized
    );
  });
}

/**
 * Get all feature names for a collection
 */
export function getAllFeatureNames(
  collection: FeatureCollection,
  lang: 'sr_cyrl' | 'sr_latn' | 'en' = 'en'
): string[] {
  const key =
    lang === 'sr_cyrl'
      ? 'name_sr_cyrl'
      : lang === 'sr_latn'
        ? 'name_sr_latn'
        : 'name_en';

  return collection.features
    .map((f) => (f.properties as SerbiaGeoProperties)[key] as string)
    .filter(Boolean);
}

/**
 * Create a lookup map from feature ID to feature
 */
export function createFeatureLookup(
  collection: FeatureCollection
): Map<string, Feature> {
  return new Map(
    collection.features.map((f) => [f.properties?.id as string, f])
  );
}

/**
 * Get features by level
 */
export function getFeaturesByLevel(level: GeoLevel): FeatureCollection {
  switch (level) {
    case 'region':
      return serbiaRegions as FeatureCollection;
    case 'district':
      return serbiaDistricts as FeatureCollection;
    case 'municipality':
      return serbiaMunicipalities as FeatureCollection;
    default:
      throw new Error(`Unknown geo level: ${level}`);
  }
}
