import { describe, expect, it } from 'vitest'

import {
  canProceedFromStep,
  getFilterableDimensions,
  getPaletteColors,
  getPaletteInfo,
  getSuggestedChartConfig,
  getSuggestedChartType,
  isConfigReady,
  stepOrder,
  type ParsedDataset,
  type Observation,
} from '../src'

const dataset: ParsedDataset = {
  observations: [
    { month: 'Jan', revenue: 100, cost: 50, region: 'Beograd' },
    { month: 'Feb', revenue: 150, cost: 60, region: 'Novi Sad' },
  ],
  dimensions: [
    { key: 'month', label: 'Month', type: 'temporal', values: [], cardinality: 2 },
    { key: 'region', label: 'Region', type: 'geographic', values: [], cardinality: 2 },
  ],
  measures: [
    { key: 'revenue', label: 'Revenue', min: 100, max: 150, hasNulls: false },
    { key: 'cost', label: 'Cost', min: 50, max: 60, hasNulls: false },
  ],
  metadataColumns: [],
  columns: ['month', 'revenue', 'cost', 'region'],
  rowCount: 2,
  source: { format: 'csv' },
}

describe('interactive filter helpers', () => {
  it('exposes filterable dimensions excluding configured axes', () => {
    const dimensions = getFilterableDimensions(
      {
        type: 'column',
        title: 'Revenue by month',
        x_axis: { field: 'month', type: 'date' },
        y_axis: { field: 'revenue', type: 'linear' },
      },
      dataset.observations as Observation[]
    )

    expect(dimensions.map(dimension => dimension.key)).toEqual(['cost', 'region'])
  })
})

describe('palette helpers', () => {
  it('interpolates and describes palettes', () => {
    expect(getPaletteColors('blues', 5)).toHaveLength(5)
    expect(getPaletteInfo('blues')).toMatchObject({
      name: 'Blues',
      type: 'sequential',
    })
  })
})

describe('suggestions', () => {
  it('suggests chart type and config from dataset shape', () => {
    expect(getSuggestedChartType(dataset)).toBe('line')
    expect(
      getSuggestedChartConfig('dataset-1', 'Budget dataset', dataset)
    ).toMatchObject({
      type: 'line',
      dataset_id: 'dataset-1',
      x_axis: { field: 'month', type: 'date' },
      y_axis: { field: 'revenue', type: 'linear' },
    })
  })

  it('detects population pyramid datasets from age and sex measures', () => {
    const populationDataset: ParsedDataset = {
      observations: [
        { age_group: '0-4', male: 100, female: 95 },
        { age_group: '5-9', male: 98, female: 93 },
      ],
      dimensions: [
        {
          key: 'age_group',
          label: 'Age group',
          type: 'categorical',
          values: [],
          cardinality: 2,
        },
      ],
      measures: [
        { key: 'male', label: 'Male', min: 98, max: 100, hasNulls: false },
        { key: 'female', label: 'Female', min: 93, max: 95, hasNulls: false },
      ],
      metadataColumns: [],
      columns: ['age_group', 'male', 'female'],
      rowCount: 2,
      source: { format: 'json' },
    }

    expect(getSuggestedChartType(populationDataset)).toBe('population-pyramid')
    expect(
      getSuggestedChartConfig('dataset-2', 'Population pyramid', populationDataset)
    ).toMatchObject({
      type: 'population-pyramid',
      x_axis: { field: 'age_group', type: 'category' },
      y_axis: { field: 'male', type: 'linear' },
      options: {
        pyramidMaleField: 'male',
        pyramidFemaleField: 'female',
      },
    })
  })
})

describe('configurator rules', () => {
  it('keeps mapping rules and step order stable', () => {
    expect(stepOrder).toEqual(['dataset', 'chartType', 'mapping', 'customize', 'review'])
    expect(isConfigReady({ type: 'table' })).toBe(true)
    expect(
      canProceedFromStep(
        'mapping',
        {
          type: 'column',
          x_axis: { field: 'month' },
          y_axis: { field: 'revenue' },
        },
        dataset
      )
    ).toBe(true)
  })
})
