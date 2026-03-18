import type { ObservationValue } from '@vizualni/shared-kernel'

import { formatChartValue } from './formatters'
import type { ChartConfig, ChartRendererDataRow } from './chart-config'

/**
 * Infers a human-readable label from a dimension key and its values.
 * Detects common patterns like year fields, region fields, gender/sex fields, etc.
 * Falls back to prettifying the key (capitalize, replace underscores with spaces).
 */
export function inferDimensionLabel(key: string, values: string[]): string {
  const keyLower = key.toLowerCase()

  // Detect year fields
  if (keyLower.includes('year') || keyLower.includes('godina')) {
    return 'Year'
  }
  if (values.every(v => /^\d{4}$/.test(v))) {
    return 'Year'
  }

  // Detect region/area fields
  if (keyLower.includes('region') || keyLower.includes('oblast') || keyLower.includes('okrug')) {
    return 'Region'
  }

  // Detect municipality fields
  if (keyLower.includes('municipality') || keyLower.includes('opstina') || keyLower.includes('grad')) {
    return 'Municipality'
  }

  // Detect gender/sex fields
  if (keyLower.includes('gender') || keyLower.includes('sex') || keyLower.includes('pol')) {
    return 'Gender'
  }

  // Detect type/category fields
  if (keyLower.includes('type') || keyLower.includes('tip') || keyLower.includes('vrsta')) {
    return 'Type'
  }
  if (keyLower.includes('category') || keyLower.includes('kategorija')) {
    return 'Category'
  }

  // Detect age fields
  if (keyLower.includes('age') || keyLower.includes('starost') || keyLower.includes('uzrast')) {
    return 'Age'
  }

  // Detect name fields
  if (keyLower === 'name' || keyLower === 'ime' || keyLower === 'naziv') {
    return 'Name'
  }

  // Detect country fields
  if (keyLower.includes('country') || keyLower.includes('zemlja') || keyLower.includes('drzava')) {
    return 'Country'
  }

  // Fallback: prettify the key
  return prettifyKey(key)
}

/**
 * Prettifies a key by replacing underscores/hyphens with spaces and capitalizing words.
 * Examples: "age_group" -> "Age Group", "populationType" -> "Population Type"
 */
function prettifyKey(key: string): string {
  // Handle camelCase by inserting spaces before uppercase letters
  const spaced = key.replace(/([a-z])([A-Z])/g, '$1 $2')

  // Replace underscores and hyphens with spaces
  const normalized = spaced.replace(/[_-]/g, ' ')

  // Capitalize first letter of each word
  return normalized
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim()
}

export interface FilterOption {
  value: string
  label: string
}

export interface FilterableDimension {
  key: string
  label: string
  options: FilterOption[]
  mode: 'single' | 'multi' | 'checkbox'
}

function serializeFilterValue(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString()
  }

  if (value == null) {
    return null
  }

  return String(value)
}

function parseTemporalValue(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }
  }

  return null
}

export function getChartId(config: ChartConfig) {
  return config.id ?? `${config.dataset_id ?? 'chart'}:${config.type}:${config.title}`
}

export function getChartSeriesKeys(config: ChartConfig) {
  const keys = [
    config.y_axis?.field,
    config.options?.secondaryField,
    config.options?.pyramidMaleField,
    config.options?.pyramidFemaleField,
  ].filter(
    (value): value is string => !!value
  )

  return [...new Set(keys)]
}

export function supportsLegendFilter(config: ChartConfig) {
  return ['line', 'bar', 'column', 'area', 'combo', 'radar', 'population-pyramid'].includes(
    config.type
  )
}

export function supportsCalculationToggle(config: ChartConfig) {
  // Check if explicitly disabled for rate/percentage/index metrics
  if (config.options?.disableCalculationToggle) {
    return false
  }
  return ['bar', 'column', 'area'].includes(config.type)
}

export function isTemporalChart(config: ChartConfig, data: ChartRendererDataRow[]) {
  if (config.x_axis?.type === 'date') {
    return true
  }

  const xField = config.x_axis?.field
  if (!xField) {
    return false
  }

  return data.some(row => parseTemporalValue(row[xField]) !== null)
}

export function getTemporalValues(config: ChartConfig, data: ChartRendererDataRow[]) {
  const xField = config.x_axis?.field
  if (!xField) {
    return []
  }

  return [
    ...new Set(
      data
        .map(row => parseTemporalValue(row[xField]))
        .filter((value): value is Date => value !== null)
        .sort((left, right) => left.getTime() - right.getTime())
        .map(value => value.toISOString())
    ),
  ]
}

export function getFilterableDimensions(
  config: ChartConfig,
  data: ChartRendererDataRow[],
  locale?: string
): FilterableDimension[] {
  const excluded = new Set(
    [
      config.x_axis?.field,
      config.y_axis?.field,
      config.options?.secondaryField,
      config.options?.sankeySourceField,
      config.options?.sankeyTargetField,
      config.options?.heatmapXField,
      config.options?.heatmapYField,
      config.options?.pyramidMaleField,
      config.options?.pyramidFemaleField,
    ].filter(
      (value): value is string => !!value
    )
  )
  const rows = data.slice(0, 500)
  const keys = [...new Set(rows.flatMap(row => Object.keys(row)))].filter(key => !excluded.has(key))

  return keys
    .map(key => {
      const values = [
        ...new Set(
          rows
            .map(row => row[key])
            .filter(
              (value): value is Exclude<ObservationValue, null> =>
                value !== null && value !== undefined
            )
            .map(value => serializeFilterValue(value))
            .filter((value): value is string => value !== null)
        ),
      ]

      if (values.length <= 1) {
        return null
      }

      const options = values.sort((left, right) => left.localeCompare(right, 'sr')).map(value => ({
        value,
        label: formatChartValue(value, locale),
      }))

      return {
        key,
        label: inferDimensionLabel(key, values),
        options,
        mode: options.length >= 10 ? 'multi' : options.length >= 3 ? 'checkbox' : 'single',
      } satisfies FilterableDimension
    })
    .filter((dimension): dimension is FilterableDimension => dimension !== null)
}

export function matchesFilterSearch(input: string, query: string) {
  return input.toLocaleLowerCase('sr').includes(query.trim().toLocaleLowerCase('sr'))
}
