import { describe, expect, it } from 'vitest'

import {
  applyInteractiveFilters,
  classifyColumns,
  computePercentages,
  decodeResourceBuffer,
  filterObservations,
  getBestJoinSuggestion,
  inferJoinDimensions,
  parseDatasetContent,
  pivotObservations,
  sortObservations,
  type InteractiveFiltersState,
  type Observation,
  type ParsedDataset,
} from '../src'

describe('classifyColumns', () => {
  it('classifies measures, dimensions, and metadata columns', () => {
    const observations: Observation[] = [
      {
        grad: 'Beograd',
        ukupno: 100,
        datum: new Date('2024-01-01'),
        url: 'https://data.gov.rs/a',
      },
      {
        grad: 'Novi Sad',
        ukupno: 120,
        datum: new Date('2024-02-01'),
        url: 'https://data.gov.rs/b',
      },
    ]

    const result = classifyColumns(observations, ['grad', 'ukupno', 'datum', 'url'])

    expect(result.measures.map(measure => measure.key)).toEqual(['ukupno'])
    expect(result.dimensions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'grad', type: 'geographic' }),
        expect.objectContaining({ key: 'datum', type: 'temporal' }),
      ])
    )
    expect(result.metadataColumns).toEqual(['url'])
  })
})

describe('loader pipeline', () => {
  it('parses CSV content with Serbian decimal formatting', () => {
    const dataset = parseDatasetContent('grad;ukupno;datum\nBeograd;1.234,56;01.02.2024.', {
      format: 'csv',
    })

    expect(dataset.columns).toEqual(['grad', 'ukupno', 'datum'])
    expect(dataset.observations[0]?.ukupno).toBe(1234.56)
    expect(dataset.observations[0]?.datum).toBeInstanceOf(Date)
  })

  it('strips BOM from decoded content', () => {
    const bomBuffer = Uint8Array.from([0xef, 0xbb, 0xbf, 0x61, 0x62, 0x63]).buffer

    expect(decodeResourceBuffer(bomBuffer)).toBe('abc')
  })
})

describe('transform pipeline', () => {
  const observations: Observation[] = [
    { grad: 'Beograd', region: 'Sever', ukupno: 10, mesec: new Date('2024-01-01') },
    { grad: 'Novi Sad', region: 'Sever', ukupno: 20, mesec: new Date('2024-02-01') },
    { grad: 'Nis', region: 'Jug', ukupno: 30, mesec: new Date('2024-03-01') },
  ]

  it('filters, sorts, pivots, and computes percentages', () => {
    expect(filterObservations(observations, { grad: 'Beograd' })).toHaveLength(1)
    expect(sortObservations(observations, 'ukupno', 'desc').map(item => item.grad)).toEqual([
      'Nis',
      'Novi Sad',
      'Beograd',
    ])

    const pivot = pivotObservations(observations, 'region', 'grad', 'ukupno')
    expect(pivot.values.Sever?.Beograd).toBe(10)

    const computed = computePercentages(observations, 'ukupno', 'region')
    expect(computed[0]?.ukupnoPercentage).toBeCloseTo(33.333, 2)
  })

  it('applies interactive filters using transform context', () => {
    const filters: InteractiveFiltersState = {
      legend: { ukupno: true },
      timeRange: { from: null, to: null },
      timeSlider: null,
      dataFilters: { region: 'Sever' },
      calculation: 'absolute',
    }

    const filtered = applyInteractiveFilters(observations, filters, {
      type: 'column',
      x_axis: { field: 'mesec', type: 'date' },
      y_axis: { field: 'ukupno', type: 'linear' },
    })

    expect(filtered).toHaveLength(2)
    expect(filtered.every(row => row.region === 'Sever')).toBe(true)
  })
})

describe('inferJoinDimensions', () => {
  const createMockDataset = (
    observations: Observation[],
    dimensions: Array<{ key: string; type?: 'categorical' | 'temporal' | 'geographic' }>,
    name = 'test'
  ): ParsedDataset => ({
    observations,
    dimensions: dimensions.map(d => ({
      key: d.key,
      label: d.key,
      type: d.type ?? 'categorical',
      values: [...new Set(observations.map(o => o[d.key]).filter(Boolean))] as string[],
      cardinality: new Set(observations.map(o => o[d.key]).filter(Boolean)).size,
    })),
    measures: [],
    metadataColumns: [],
    columns: dimensions.map(d => d.key),
    rowCount: observations.length,
    source: { format: 'csv', name },
  })

  it('detects exact name matches and returns the best suggestion', () => {
    const primary = createMockDataset(
      [
        { municipality: 'Beograd', value: 100 },
        { municipality: 'Novi Sad', value: 200 },
      ],
      [{ key: 'municipality' }]
    )

    const secondary = createMockDataset(
      [
        { municipality: 'Beograd', gdp: 50000 },
        { municipality: 'Novi Sad', gdp: 35000 },
      ],
      [{ key: 'municipality' }],
      'economy'
    )

    const suggestions = inferJoinDimensions(primary, secondary)
    const best = getBestJoinSuggestion(primary, secondary)

    expect(suggestions[0]?.matchType).toBe('exact-name')
    expect(best?.confidence).toBeGreaterThan(0.9)
  })
})
