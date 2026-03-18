import { describe, expect, it } from '@jest/globals';

import { convertToParsedDataset } from '../converter';
import { getDatasetById } from '../registry';

describe('Serbian Dataset Converter', () => {
  describe('convertToParsedDataset', () => {
    it('converts birth rates dataset to ParsedDataset format', () => {
      const dataset = getDatasetById('serbia-birth-rates');
      if (!dataset) throw new Error('Dataset not found');

      const parsed = convertToParsedDataset(dataset, 'en');

      expect(parsed).toHaveProperty('observations');
      expect(parsed).toHaveProperty('dimensions');
      expect(parsed).toHaveProperty('measures');
      expect(parsed).toHaveProperty('columns');
      expect(parsed).toHaveProperty('rowCount');
      expect(parsed).toHaveProperty('source');
    });

    it('includes correct columns from dimensions and measures', () => {
      const dataset = getDatasetById('serbia-birth-rates');
      if (!dataset) throw new Error('Dataset not found');

      const parsed = convertToParsedDataset(dataset, 'en');

      expect(parsed.columns).toContain('year');
      expect(parsed.columns).toContain('birthRate');
    });

    it('sets correct rowCount', () => {
      const dataset = getDatasetById('serbia-birth-rates');
      if (!dataset) throw new Error('Dataset not found');

      const parsed = convertToParsedDataset(dataset, 'en');
      expect(parsed.rowCount).toBe(dataset.observations.length);
    });

    it('uses English title for en locale', () => {
      const dataset = getDatasetById('serbia-birth-rates');
      if (!dataset) throw new Error('Dataset not found');

      const parsed = convertToParsedDataset(dataset, 'en');
      expect(parsed.source.name).toBe(dataset.title.en);
    });

    it('uses Cyrillic title for sr-Cyrl locale', () => {
      const dataset = getDatasetById('serbia-birth-rates');
      if (!dataset) throw new Error('Dataset not found');

      const parsed = convertToParsedDataset(dataset, 'sr-Cyrl');
      expect(parsed.source.name).toBe(dataset.title.sr);
    });

    it('uses Latin title for sr-Latn locale', () => {
      const dataset = getDatasetById('serbia-birth-rates');
      if (!dataset) throw new Error('Dataset not found');

      const parsed = convertToParsedDataset(dataset, 'sr-Latn');
      expect(parsed.source.name).toBe(dataset.title.lat);
    });

    it('sets datasetId in source', () => {
      const dataset = getDatasetById('serbia-natural-change');
      if (!dataset) throw new Error('Dataset not found');

      const parsed = convertToParsedDataset(dataset, 'en');
      expect(parsed.source.datasetId).toBe('serbia-natural-change');
    });

    it('handles datasets with multiple measures', () => {
      const dataset = getDatasetById('serbia-natural-change');
      if (!dataset) throw new Error('Dataset not found');

      const parsed = convertToParsedDataset(dataset, 'en');

      expect(parsed.columns).toContain('births');
      expect(parsed.columns).toContain('deaths');
      expect(parsed.columns).toContain('naturalChange');
    });

    it('normalizes raw Serbian dimension metadata to ParsedDataset types', () => {
      const dataset = getDatasetById('serbia-birth-rates');
      if (!dataset) throw new Error('Dataset not found');

      const parsed = convertToParsedDataset(dataset, 'en');

      expect(parsed.dimensions[0]?.type).toBe('temporal');
      expect(parsed.dimensions[0]?.values[0]).toBeInstanceOf(Date);
    });
  });
});
