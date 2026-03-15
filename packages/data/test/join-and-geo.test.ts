import { describe, expect, it } from 'vitest';

import { matchGeoColumn } from '../src/geo-matcher';
import { normalizeJoinValue } from '../src/join';

describe('normalizeJoinValue', () => {
  it('normalizes Cyrillic and Latin variants to the same join key', () => {
    expect(normalizeJoinValue('Ниш')).toBe(normalizeJoinValue('Nis'));
    expect(normalizeJoinValue('Čačak')).toBe(normalizeJoinValue('Cacak'));
  });
});

describe('matchGeoColumn', () => {
  it('matches region codes from numeric and RS-prefixed values', () => {
    const result = matchGeoColumn(['10', 'RS10'], 'region');

    expect(result.matched.get('10')).toBe('RS10');
    expect(result.matched.get('RS10')).toBe('RS10');
  });

  it('matches municipality codes using three-digit normalization', () => {
    const result = matchGeoColumn(['7', '048'], 'municipality');

    expect(result.matched.get('7')).toBe('007');
    expect(result.matched.get('048')).toBe('048');
  });
});
