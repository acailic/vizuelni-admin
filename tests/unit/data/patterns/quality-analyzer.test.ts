// tests/unit/data/patterns/quality-analyzer.test.ts
import { analyzeQuality } from '@/lib/data/patterns/quality-analyzer';
import type { Observation } from '@/types/observation';
import type {
  EnrichedDimensionMeta,
  EnrichedMeasureMeta,
} from '@/lib/data/patterns/types';

describe('quality-analyzer', () => {
  describe('analyzeQuality', () => {
    it('detects missing values', () => {
      const data: Observation[] = [
        { name: 'A', value: 100 },
        { name: 'B', value: null },
        { name: 'C', value: 150 },
      ];
      const dimensions: EnrichedDimensionMeta[] = [
        {
          key: 'name',
          label: 'Name',
          type: 'categorical',
          values: ['A', 'B', 'C'],
          cardinality: 3,
        },
      ];
      const measures: EnrichedMeasureMeta[] = [
        { key: 'value', label: 'Value', min: 100, max: 150, hasNulls: true },
      ];

      const result = analyzeQuality(data, dimensions, measures);

      expect(result.completeness).toBeLessThan(1);
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          column: 'value',
          type: 'missing-values',
        })
      );
    });

    it('detects outliers using IQR method', () => {
      const data: Observation[] = [
        { name: 'A', value: 10 },
        { name: 'B', value: 12 },
        { name: 'C', value: 11 },
        { name: 'D', value: 13 },
        { name: 'E', value: 1000 }, // outlier
      ];
      const dimensions: EnrichedDimensionMeta[] = [
        {
          key: 'name',
          label: 'Name',
          type: 'categorical',
          values: ['A', 'B', 'C', 'D', 'E'],
          cardinality: 5,
        },
      ];
      const measures: EnrichedMeasureMeta[] = [
        { key: 'value', label: 'Value', min: 10, max: 1000, hasNulls: false },
      ];

      const result = analyzeQuality(data, dimensions, measures);

      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          column: 'value',
          type: 'outliers',
        })
      );
    });

    it('calculates completeness correctly', () => {
      const data: Observation[] = [
        { a: 1, b: 2 },
        { a: 1, b: null },
        { a: null, b: 3 },
      ];
      const dimensions: EnrichedDimensionMeta[] = [
        {
          key: 'a',
          label: 'A',
          type: 'categorical',
          values: ['1'],
          cardinality: 1,
        },
      ];
      const measures: EnrichedMeasureMeta[] = [
        { key: 'b', label: 'B', min: 2, max: 3, hasNulls: true },
      ];

      const result = analyzeQuality(data, dimensions, measures);

      // 2 nulls out of 6 total cells = 4/6 = 0.667 completeness
      expect(result.completeness).toBeCloseTo(4 / 6, 1);
    });

    it('returns no warnings for clean data', () => {
      const data: Observation[] = [
        { name: 'A', value: 100 },
        { name: 'B', value: 120 },
        { name: 'C', value: 110 },
      ];
      const dimensions: EnrichedDimensionMeta[] = [
        {
          key: 'name',
          label: 'Name',
          type: 'categorical',
          values: ['A', 'B', 'C'],
          cardinality: 3,
        },
      ];
      const measures: EnrichedMeasureMeta[] = [
        { key: 'value', label: 'Value', min: 100, max: 120, hasNulls: false },
      ];

      const result = analyzeQuality(data, dimensions, measures);

      expect(result.warnings.filter((w) => w.severity !== 'info')).toHaveLength(
        0
      );
    });

    it('generates helpful suggestions', () => {
      const data: Observation[] = [{ name: 'A', value: null }];
      const dimensions: EnrichedDimensionMeta[] = [
        {
          key: 'name',
          label: 'Name',
          type: 'categorical',
          values: ['A'],
          cardinality: 1,
        },
      ];
      const measures: EnrichedMeasureMeta[] = [
        { key: 'value', label: 'Value', min: 0, max: 0, hasNulls: true },
      ];

      const result = analyzeQuality(data, dimensions, measures);

      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });
});
