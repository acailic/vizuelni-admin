import { describe, expect, it } from 'vitest';

import {
  findFeatureByName,
  getFeaturesByLevel,
  serbiaDistricts,
} from '../src/index';

describe('@vizualni/geo-data', () => {
  it('returns collections by geographic level', () => {
    expect(getFeaturesByLevel('district')).toBe(serbiaDistricts);
  });

  it('finds features by multilingual name', () => {
    const feature = findFeatureByName(serbiaDistricts, 'City of Belgrade');

    expect(feature?.properties?.id).toBe('00');
  });
});
