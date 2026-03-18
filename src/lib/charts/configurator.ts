import type { ChartOptions, ParsedDataset, SupportedChartType } from '@/types'

export interface ChartTypeAvailability {
  type: SupportedChartType
  disabled: boolean
  reason?: string
}

export function getChartTypeAvailability(dataset: ParsedDataset): ChartTypeAvailability[] {
  const dimensionCount = dataset.dimensions.length
  const measureCount = dataset.measures.length
  const columnCount = dataset.columns.length

  return [
    {
      type: 'line',
      disabled: dimensionCount < 1 || measureCount < 1,
      reason: 'Requires 1 dimension and 1 measure.',
    },
    {
      type: 'bar',
      disabled: dimensionCount < 1 || measureCount < 1,
      reason: 'Requires 1 dimension and 1 measure.',
    },
    {
      type: 'column',
      disabled: dimensionCount < 1 || measureCount < 1,
      reason: 'Requires 1 dimension and 1 measure.',
    },
    {
      type: 'area',
      disabled: dimensionCount < 1 || measureCount < 1,
      reason: 'Requires 1 dimension and 1 measure.',
    },
    {
      type: 'pie',
      disabled: dimensionCount < 1 || measureCount !== 1,
      reason: 'Requires exactly 1 dimension and 1 measure.',
    },
    { type: 'scatterplot', disabled: measureCount < 2, reason: 'Requires 2 numeric measures.' },
    {
      type: 'table',
      disabled: dataset.columns.length === 0,
      reason: 'Requires at least 1 column.',
    },
    {
      type: 'combo',
      disabled: dimensionCount < 1 || measureCount < 2,
      reason: 'Requires 1 dimension and 2 measures.',
    },
    {
      type: 'map',
      disabled: dimensionCount < 1 || measureCount < 1,
      reason: 'Requires 1 geographic dimension and 1 measure.',
    },
    {
      type: 'radar',
      disabled: dimensionCount < 1 || measureCount < 1,
      reason: 'Requires 1 dimension and at least 1 measure.',
    },
    {
      type: 'treemap',
      disabled: dimensionCount < 1 || measureCount < 1,
      reason: 'Requires 1 dimension and 1 measure.',
    },
    {
      type: 'funnel',
      disabled: dimensionCount < 1 || measureCount < 1,
      reason: 'Requires 1 dimension and 1 measure.',
    },
    {
      type: 'sankey',
      disabled: columnCount < 3,
      reason: 'Requires at least 3 columns for source, target, and value.',
    },
    {
      type: 'heatmap',
      disabled: dimensionCount < 2 || measureCount < 1,
      reason: 'Requires 2 dimensions and 1 measure.',
    },
    {
      type: 'population-pyramid',
      disabled: dimensionCount < 1 || measureCount < 2,
      reason: 'Requires 1 dimension and 2 measures.',
    },
    {
      type: 'waterfall',
      disabled: dimensionCount < 1 || measureCount < 1,
      reason: 'Requires 1 dimension and 1 measure.',
    },
    {
      type: 'gauge',
      disabled: measureCount < 1,
      reason: 'Requires 1 numeric measure.',
    },
    {
      type: 'box-plot',
      disabled: dimensionCount < 1 || measureCount < 1,
      reason: 'Requires 1 dimension and 1 measure.',
    },
  ]
}

export function getCompatibleChartTypes(dataset: ParsedDataset) {
  return getChartTypeAvailability(dataset)
    .filter(option => !option.disabled)
    .map(option => option.type)
}

export function getDefaultMappingForType(
  dataset: ParsedDataset,
  type: SupportedChartType
): {
  xField?: string
  yField?: string
  secondaryField?: string
  options?: Partial<ChartOptions>
} {
  const firstDimension = dataset.dimensions[0]?.key
  const secondDimension = dataset.dimensions[1]?.key
  const firstMeasure = dataset.measures[0]?.key
  const secondMeasure = dataset.measures[1]?.key

  if (type === 'table') {
    return {}
  }

  if (type === 'scatterplot') {
    return {
      xField: dataset.measures[0]?.key,
      yField: dataset.measures[1]?.key,
    }
  }

  if (type === 'combo') {
    return {
      xField: firstDimension,
      yField: firstMeasure,
      secondaryField: secondMeasure,
    }
  }

  if (type === 'heatmap') {
    return {
      xField: firstDimension,
      yField: firstMeasure,
      options: {
        heatmapXField: firstDimension,
        heatmapYField: secondDimension,
      },
    }
  }

  if (type === 'sankey') {
    return {
      xField: firstDimension,
      yField: firstMeasure,
      options: {
        sankeySourceField: firstDimension,
        sankeyTargetField: secondDimension ?? dataset.columns[1],
      },
    }
  }

  if (type === 'population-pyramid') {
    return {
      xField: firstDimension,
      yField: firstMeasure,
      options: {
        pyramidMaleField: firstMeasure,
        pyramidFemaleField: secondMeasure,
      },
    }
  }

  if (type === 'gauge') {
    return {
      xField: firstDimension ?? firstMeasure,
      yField: firstMeasure,
      options: {
        gaugeMin: 0,
        gaugeMax: Math.max(dataset.measures[0]?.max ?? 100, 100),
      },
    }
  }

  return {
    xField: firstDimension,
    yField: firstMeasure,
  }
}
