// tests/unit/data/patterns/chart-suggestions.test.ts
import {
  suggestCharts,
  type ChartSuggestionContext,
} from '@/lib/data/patterns/chart-suggestions';

describe('chart-suggestions', () => {
  describe('suggestCharts', () => {
    it('suggests bar chart for population pyramid pattern', () => {
      const ctx: ChartSuggestionContext = {
        hasAgeGroup: true,
        hasGender: true,
        hasTemporal: false,
        hasGeography: false,
        measureCount: 1,
        dimensionCount: 2,
        maxCardinality: 10,
      };
      const suggestions = suggestCharts(ctx);
      expect(suggestions[0]).toMatchObject({
        type: 'bar',
        confidence: expect.any(Number),
      });
      expect(suggestions[0].confidence).toBeGreaterThan(0.9);
    });

    it('suggests map for geographic data', () => {
      const ctx: ChartSuggestionContext = {
        hasAgeGroup: false,
        hasGender: false,
        hasTemporal: false,
        hasGeography: true,
        measureCount: 1,
        dimensionCount: 1,
        maxCardinality: 30,
      };
      const suggestions = suggestCharts(ctx);
      expect(suggestions[0].type).toBe('map');
    });

    it('suggests line chart for time series', () => {
      const ctx: ChartSuggestionContext = {
        hasAgeGroup: false,
        hasGender: false,
        hasTemporal: true,
        hasGeography: false,
        measureCount: 1,
        dimensionCount: 1,
        maxCardinality: 100,
      };
      const suggestions = suggestCharts(ctx);
      expect(suggestions[0].type).toBe('line');
    });

    it('suggests combo for multi-measure time series', () => {
      const ctx: ChartSuggestionContext = {
        hasAgeGroup: false,
        hasGender: false,
        hasTemporal: true,
        hasGeography: false,
        measureCount: 2,
        dimensionCount: 1,
        maxCardinality: 50,
      };
      const suggestions = suggestCharts(ctx);
      expect(suggestions[0].type).toBe('combo');
    });

    it('suggests column for simple categorical data', () => {
      const ctx: ChartSuggestionContext = {
        hasAgeGroup: false,
        hasGender: false,
        hasTemporal: false,
        hasGeography: false,
        measureCount: 1,
        dimensionCount: 1,
        maxCardinality: 15,
      };
      const suggestions = suggestCharts(ctx);
      expect(suggestions[0].type).toBe('column');
    });

    it('suggests pie for low cardinality part-to-whole', () => {
      const ctx: ChartSuggestionContext = {
        hasAgeGroup: false,
        hasGender: false,
        hasTemporal: false,
        hasGeography: false,
        measureCount: 1,
        dimensionCount: 1,
        maxCardinality: 5,
      };
      const suggestions = suggestCharts(ctx);
      const pieSuggestion = suggestions.find((s) => s.type === 'pie');
      expect(pieSuggestion).toBeDefined();
    });

    it('returns suggestions sorted by confidence', () => {
      const ctx: ChartSuggestionContext = {
        hasAgeGroup: true,
        hasGender: true,
        hasTemporal: true,
        hasGeography: false,
        measureCount: 1,
        dimensionCount: 3,
        maxCardinality: 20,
      };
      const suggestions = suggestCharts(ctx);
      for (let i = 1; i < suggestions.length; i++) {
        expect(suggestions[i].confidence).toBeLessThanOrEqual(
          suggestions[i - 1].confidence
        );
      }
    });
  });
});
