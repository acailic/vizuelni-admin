// tests/integration/data/patterns/demo.test.ts
/**
 * Integration tests demonstrating the Serbian Data Detection Pattern Library
 * with realistic government data examples.
 */
import {
  detectPatterns,
  analyzeQuality,
  suggestCharts,
} from '@/lib/data/patterns';
import type {
  Observation,
  DimensionMeta,
  MeasureMeta,
} from '@/types/observation';
import type { ChartSuggestionContext } from '@/lib/data/patterns/chart-suggestions';

describe('Serbian Data Detection Demo', () => {
  describe('Population Pyramid Data', () => {
    it('detects age groups and gender, suggests bar chart', () => {
      // Realistic Serbian population data by age and gender
      const data: Observation[] = [
        { starost: '0-14', pol: 'muški', broj: 352421 },
        { starost: '0-14', pol: 'ženski', broj: 335812 },
        { starost: '15-29', pol: 'muški', broj: 489234 },
        { starost: '15-29', pol: 'ženski', broj: 472156 },
        { starost: '30-44', pol: 'muški', broj: 512345 },
        { starost: '30-44', pol: 'ženski', broj: 498234 },
        { starost: '45-59', pol: 'muški', broj: 423456 },
        { starost: '45-59', pol: 'ženski', broj: 412345 },
        { starost: '60-74', pol: 'muški', broj: 298234 },
        { starost: '60-74', pol: 'ženski', broj: 323456 },
        { starost: '75+', pol: 'muški', broj: 123456 },
        { starost: '75+', pol: 'ženski', broj: 178234 },
      ];

      const dimensions: DimensionMeta[] = [
        {
          key: 'starost',
          label: 'Starosna grupa',
          type: 'categorical',
          values: ['0-14', '15-29', '30-44', '45-59', '60-74', '75+'],
          cardinality: 6,
        },
        {
          key: 'pol',
          label: 'Pol',
          type: 'categorical',
          values: ['muški', 'ženski'],
          cardinality: 2,
        },
      ];

      const measures: MeasureMeta[] = [
        {
          key: 'broj',
          label: 'Broj stanovnika',
          min: 123456,
          max: 512345,
          hasNulls: false,
        },
      ];

      const result = detectPatterns(data, dimensions, measures);

      // Verify semantic detection
      expect(
        result.dimensions.find((d) => d.key === 'starost')?.semanticType
      ).toBe('age-group');
      expect(result.dimensions.find((d) => d.key === 'pol')?.semanticType).toBe(
        'gender'
      );

      // Verify chart suggestion
      expect(result.suggestedCharts[0].type).toBe('population-pyramid');
      expect(result.suggestedCharts[0].confidence).toBeGreaterThan(0.9);
      expect(result.suggestedCharts[0].reason).toContain('Population pyramid');

      // Verify quality
      expect(result.quality.completeness).toBe(1);
      expect(result.quality.warnings).toHaveLength(0);

      console.log('\n📊 Population Pyramid Detection:');
      console.log(
        '  Dimensions:',
        result.dimensions.map((d) => `${d.key}(${d.semanticType})`).join(', ')
      );
      console.log(
        '  Top suggestion:',
        result.suggestedCharts[0].type,
        `(${(result.suggestedCharts[0].confidence * 100).toFixed(0)}%)`
      );
      console.log('  Reason:', result.suggestedCharts[0].reason);
    });
  });

  describe('Time Series Data', () => {
    it('detects year dimension and suggests line chart', () => {
      // GDP growth data
      const data: Observation[] = [
        { godina: '2018', stopa_rasta: 4.4, bdp_milijardi: 51.2 },
        { godina: '2019', stopa_rasta: 4.2, bdp_milijardi: 53.4 },
        { godina: '2020', stopa_rasta: -0.9, bdp_milijardi: 53.0 },
        { godina: '2021', stopa_rasta: 7.5, bdp_milijardi: 57.0 },
        { godina: '2022', stopa_rasta: 2.3, bdp_milijardi: 58.3 },
        { godina: '2023', stopa_rasta: 2.1, bdp_milijardi: 59.5 },
      ];

      const dimensions: DimensionMeta[] = [
        {
          key: 'godina',
          label: 'Godina',
          type: 'categorical',
          values: ['2018', '2019', '2020', '2021', '2022', '2023'],
          cardinality: 6,
        },
      ];

      const measures: MeasureMeta[] = [
        {
          key: 'stopa_rasta',
          label: 'Stopa rasta (%)',
          min: -0.9,
          max: 7.5,
          hasNulls: false,
        },
        {
          key: 'bdp_milijardi',
          label: 'BDP (milijardi EUR)',
          min: 51.2,
          max: 59.5,
          hasNulls: false,
        },
      ];

      const result = detectPatterns(data, dimensions, measures);

      // Verify temporal detection
      expect(
        result.dimensions.find((d) => d.key === 'godina')?.semanticType
      ).toBe('year');

      // Verify combo chart for multiple measures
      expect(result.suggestedCharts[0].type).toBe('combo');
      expect(result.suggestedCharts[0].reason).toContain(
        'Multi-measure time series'
      );

      console.log('\n📈 Time Series Detection:');
      console.log(
        '  Dimensions:',
        result.dimensions.map((d) => `${d.key}(${d.semanticType})`).join(', ')
      );
      console.log('  Measures:', measures.length);
      console.log(
        '  Top suggestion:',
        result.suggestedCharts[0].type,
        `(${(result.suggestedCharts[0].confidence * 100).toFixed(0)}%)`
      );
    });
  });

  describe('Geographic Data', () => {
    it('detects regions and suggests map visualization', () => {
      // Population by region (single measure for map)
      const data: Observation[] = [
        { region: 'Beogradski', stanovnika: 1742422 },
        { region: 'Vojvodina', stanovnika: 1893895 },
        { region: 'Šumadija i Zapadna Srbija', stanovnika: 1980603 },
        { region: 'Južna i Istočna Srbija', stanovnika: 1475654 },
      ];

      const dimensions: DimensionMeta[] = [
        {
          key: 'region',
          label: 'Region',
          type: 'categorical',
          values: [
            'Beogradski',
            'Vojvodina',
            'Šumadija i Zapadna Srbija',
            'Južna i Istočna Srbija',
          ],
          cardinality: 4,
        },
      ];

      const measures: MeasureMeta[] = [
        {
          key: 'stanovnika',
          label: 'Broj stanovnika',
          min: 1475654,
          max: 1980603,
          hasNulls: false,
        },
      ];

      const result = detectPatterns(data, dimensions, measures);

      // Verify geographic detection
      expect(
        result.dimensions.find((d) => d.key === 'region')?.semanticType
      ).toBe('region');

      // Map should be suggested (single geographic dimension + single measure)
      const mapSuggestion = result.suggestedCharts.find(
        (s) => s.type === 'map'
      );
      expect(mapSuggestion).toBeDefined();
      expect(mapSuggestion?.reason).toContain('Geographic');

      console.log('\n🗺️ Geographic Detection:');
      console.log(
        '  Dimensions:',
        result.dimensions.map((d) => `${d.key}(${d.semanticType})`).join(', ')
      );
      console.log(
        '  Map suggestion:',
        mapSuggestion
          ? `${mapSuggestion.type} (${(mapSuggestion.confidence * 100).toFixed(0)}%)`
          : 'Not found'
      );
    });
  });

  describe('Health Data (ICD Codes)', () => {
    it('detects ICD diagnosis codes', () => {
      // Morbidity data by diagnosis
      const data: Observation[] = [
        {
          dijagnoza: 'I10',
          naziv: 'Essential hypertension',
          broj_slučajeva: 45234,
        },
        { dijagnoza: 'E11', naziv: 'Type 2 diabetes', broj_slučajeva: 32456 },
        { dijagnoza: 'J45', naziv: 'Asthma', broj_slučajeva: 28934 },
        {
          dijagnoza: 'I25',
          naziv: 'Chronic ischemic heart disease',
          broj_slučajeva: 25678,
        },
        { dijagnoza: 'F41', naziv: 'Anxiety disorders', broj_slučajeva: 22345 },
      ];

      const dimensions: DimensionMeta[] = [
        {
          key: 'dijagnoza',
          label: 'Šifra dijagnoze',
          type: 'categorical',
          values: ['I10', 'E11', 'J45', 'I25', 'F41'],
          cardinality: 5,
        },
      ];

      const measures: MeasureMeta[] = [
        {
          key: 'broj_slučajeva',
          label: 'Broj slučajeva',
          min: 22345,
          max: 45234,
          hasNulls: false,
        },
      ];

      const result = detectPatterns(data, dimensions, measures);

      // Verify ICD code detection
      expect(
        result.dimensions.find((d) => d.key === 'dijagnoza')?.semanticType
      ).toBe('icd-code');

      console.log('\n🏥 Health Data Detection:');
      console.log(
        '  Detected ICD codes:',
        result.dimensions.find((d) => d.key === 'dijagnoza')?.semanticType
      );
    });
  });

  describe('Economic Data (NACE Codes)', () => {
    it('detects NACE activity codes', () => {
      // Employment by industry (using proper NACE 2-digit codes)
      const data: Observation[] = [
        {
          delatnost: 'C25',
          naziv: 'Manufacturing of fabricated metal products',
          zaposlenih: 324567,
        },
        { delatnost: 'G47', naziv: 'Retail trade', zaposlenih: 289345 },
        {
          delatnost: 'F41',
          naziv: 'Construction of buildings',
          zaposlenih: 156234,
        },
        { delatnost: 'I55', naziv: 'Accommodation', zaposlenih: 98765 },
        { delatnost: 'J62', naziv: 'Computer programming', zaposlenih: 87654 },
      ];

      const dimensions: DimensionMeta[] = [
        {
          key: 'delatnost',
          label: 'Delatnost',
          type: 'categorical',
          values: ['C25', 'F41', 'G47', 'I55', 'J62'],
          cardinality: 5,
        },
      ];

      const measures: MeasureMeta[] = [
        {
          key: 'zaposlenih',
          label: 'Broj zaposlenih',
          min: 87654,
          max: 324567,
          hasNulls: false,
        },
      ];

      const result = detectPatterns(data, dimensions, measures);

      // Verify NACE code detection
      expect(
        result.dimensions.find((d) => d.key === 'delatnost')?.semanticType
      ).toBe('nace-code');

      console.log('\n🏭 Economic Data Detection:');
      console.log(
        '  Detected NACE codes:',
        result.dimensions.find((d) => d.key === 'delatnost')?.semanticType
      );
    });
  });

  describe('Quarterly Data', () => {
    it('detects quarterly time periods', () => {
      // Quarterly unemployment rate
      const data: Observation[] = [
        { kvartal: 'Q1', godina: '2023', stopa: 10.2 },
        { kvartal: 'Q2', godina: '2023', stopa: 9.8 },
        { kvartal: 'Q3', godina: '2023', stopa: 9.5 },
        { kvartal: 'Q4', godina: '2023', stopa: 9.3 },
        { kvartal: 'Q1', godina: '2024', stopa: 9.1 },
        { kvartal: 'Q2', godina: '2024', stopa: 8.8 },
      ];

      const dimensions: DimensionMeta[] = [
        {
          key: 'kvartal',
          label: 'Kvartal',
          type: 'categorical',
          values: ['Q1', 'Q2', 'Q3', 'Q4'],
          cardinality: 4,
        },
        {
          key: 'godina',
          label: 'Godina',
          type: 'categorical',
          values: ['2023', '2024'],
          cardinality: 2,
        },
      ];

      const measures: MeasureMeta[] = [
        {
          key: 'stopa',
          label: 'Stopa nezaposlenosti (%)',
          min: 8.8,
          max: 10.2,
          hasNulls: false,
        },
      ];

      const result = detectPatterns(data, dimensions, measures);

      // Verify quarter and year detection
      expect(
        result.dimensions.find((d) => d.key === 'kvartal')?.semanticType
      ).toBe('quarter');
      expect(
        result.dimensions.find((d) => d.key === 'godina')?.semanticType
      ).toBe('year');

      console.log('\n📅 Quarterly Data Detection:');
      console.log(
        '  Detected:',
        result.dimensions.map((d) => `${d.key}(${d.semanticType})`).join(', ')
      );
    });
  });

  describe('Data Quality Analysis', () => {
    it('detects missing values and outliers', () => {
      // Data with quality issues
      const data: Observation[] = [
        { opština: 'Beograd', stanovnika: 1383000, prosečna_plata: 85000 },
        { opština: 'Novi Sad', stanovnika: 250000, prosečna_plata: 72000 },
        { opština: 'Niš', stanovnika: 187544, prosečna_plata: null }, // Missing
        { opština: 'Kragujevac', stanovnika: 146315, prosečna_plata: 61000 },
        { opština: 'Subotica', stanovnika: 96443, prosečna_plata: 58000 },
        { opština: 'Zrenjanin', stanovnika: 76357, prosečna_plata: 55000 },
        { opština: 'Pančevo', stanovnika: 76524, prosečna_plata: 9999999 }, // Outlier!
      ];

      const dimensions: DimensionMeta[] = [
        {
          key: 'opština',
          label: 'Opština',
          type: 'categorical',
          values: [
            'Beograd',
            'Novi Sad',
            'Niš',
            'Kragujevac',
            'Subotica',
            'Zrenjanin',
            'Pančevo',
          ],
          cardinality: 7,
        },
      ];

      const measures: MeasureMeta[] = [
        {
          key: 'stanovnika',
          label: 'Broj stanovnika',
          min: 76357,
          max: 1383000,
          hasNulls: false,
        },
        {
          key: 'prosečna_plata',
          label: 'Prosečna plata (RSD)',
          min: 55000,
          max: 9999999,
          hasNulls: true,
        },
      ];

      const result = detectPatterns(data, dimensions, measures);

      // Verify quality issues detected
      expect(result.quality.completeness).toBeLessThan(1);

      const missingWarning = result.quality.warnings.find(
        (w) => w.type === 'missing-values'
      );
      expect(missingWarning).toBeDefined();
      expect(missingWarning?.column).toBe('prosečna_plata');

      const outlierWarning = result.quality.warnings.find(
        (w) => w.type === 'outliers'
      );
      expect(outlierWarning).toBeDefined();

      // Verify suggestions
      expect(result.quality.suggestions.length).toBeGreaterThan(0);

      console.log('\n⚠️ Quality Analysis:');
      console.log(
        '  Completeness:',
        (result.quality.completeness * 100).toFixed(1) + '%'
      );
      console.log(
        '  Warnings:',
        result.quality.warnings.map((w) => `${w.type}(${w.column})`).join(', ')
      );
      console.log('  Suggestions:', result.quality.suggestions);
    });
  });

  describe('Chart Suggestion Context', () => {
    it('builds context correctly for complex data', () => {
      // Build context manually for testing
      const ctx: ChartSuggestionContext = {
        hasAgeGroup: true,
        hasGender: true,
        hasTemporal: true,
        hasGeography: false,
        measureCount: 2,
        dimensionCount: 3,
        maxCardinality: 25,
      };

      const suggestions = suggestCharts(ctx);

      // Should have multiple suggestions
      expect(suggestions.length).toBeGreaterThan(1);

      // Should be sorted by confidence
      for (let i = 1; i < suggestions.length; i++) {
        expect(suggestions[i].confidence).toBeLessThanOrEqual(
          suggestions[i - 1].confidence
        );
      }

      console.log('\n🎨 Chart Suggestions for complex context:');
      suggestions.slice(0, 5).forEach((s, i) => {
        console.log(
          `  ${i + 1}. ${s.type}: ${(s.confidence * 100).toFixed(0)}% - ${s.reason}`
        );
      });
    });
  });
});
