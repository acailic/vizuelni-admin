import type {
  ClassificationMethod,
  ColorScaleType,
  MapPalette,
} from './chart-config'

export const COLOR_PALETTES: Record<MapPalette, string[]> = {
  blues: ['#E8F4FD', '#B8D9F7', '#7BBEF0', '#4B90F5', '#2E6BC4', '#0D4077'],
  reds: ['#FEE2E2', '#FECACA', '#F87171', '#EF4444', '#DC2626', '#991B1B'],
  greens: ['#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399', '#10B981', '#047857'],
  oranges: ['#FFEDD5', '#FED7AA', '#FDBA74', '#FB923C', '#F97316', '#C2410C'],
  purples: ['#EDE9FE', '#DDD6FE', '#C4B5FD', '#A78BFA', '#7C3AED', '#5B21B6'],
  viridis: ['#440154', '#482878', '#3E4A89', '#31688E', '#26828E', '#1F9E89', '#35B779', '#6DCD59', '#FDE725'],
  'orange-blue': ['#7B3294', '#C2A5CF', '#F7F7F7', '#A6DBA0', '#008837'],
  'red-blue': ['#B2182B', '#EF8A62', '#F7F7F7', '#67A9CF', '#2166AC'],
}

export const MISSING_DATA_COLORS = {
  fill: '#E5E7EB',
  stroke: '#D1D5DB',
  pattern: '#9CA3AF',
}

export interface ClassificationResult {
  breaks: number[]
  min: number
  max: number
}

export function classifyData(
  values: number[],
  method: ClassificationMethod,
  classCount = 5
): ClassificationResult {
  if (values.length === 0) {
    return { breaks: [], min: 0, max: 0 }
  }

  const validValues = values.filter(value => !Number.isNaN(value) && Number.isFinite(value))
  if (validValues.length === 0) {
    return { breaks: [], min: 0, max: 0 }
  }

  const min = Math.min(...validValues)
  const max = Math.max(...validValues)

  if (min === max) {
    return { breaks: [min], min, max }
  }

  let breaks: number[]

  switch (method) {
    case 'equal-intervals':
      breaks = equalIntervals(min, max, classCount)
      break
    case 'quantiles':
      breaks = quantiles(validValues, classCount)
      break
    case 'natural-breaks':
      breaks = naturalBreaks(validValues, classCount)
      break
    case 'custom':
      breaks = equalIntervals(min, max, classCount)
      break
    default:
      breaks = equalIntervals(min, max, classCount)
  }

  return { breaks, min, max }
}

function equalIntervals(min: number, max: number, classes: number): number[] {
  const breaks: number[] = []
  const step = (max - min) / classes

  for (let index = 0; index <= classes; index += 1) {
    breaks.push(min + step * index)
  }

  return breaks
}

function quantiles(values: number[], classes: number): number[] {
  const sorted = [...values].sort((a, b) => a - b)
  if (sorted.length === 0) {
    return []
  }

  const breaks: number[] = [sorted[0]!]

  for (let index = 1; index <= classes; index += 1) {
    const quantileIndex = Math.floor((sorted.length * index) / classes)
    breaks.push(sorted[Math.min(quantileIndex, sorted.length - 1)]!)
  }

  return breaks
}

function naturalBreaks(values: number[], classes: number): number[] {
  if (values.length <= classes) {
    return [...values].sort((a, b) => a - b)
  }

  const sorted = [...values].sort((a, b) => a - b)
  const count = sorted.length
  const lowerClassLimits: number[][] = Array.from({ length: count + 1 }, () =>
    Array(count + 1).fill(0)
  )
  const varianceCombinations: number[][] = Array.from({ length: count + 1 }, () =>
    Array(count + 1).fill(Infinity)
  )

  varianceCombinations[0]![0] = 0

  for (let total = 1; total <= count; total += 1) {
    let sum = 0
    let sumSquares = 0
    let bucketCount = 0
    let variance = 0

    for (let width = 1; width <= total; width += 1) {
      const index = total - width + 1
      const value = sorted[index - 1]!
      bucketCount += 1
      sum += value
      sumSquares += value * value
      variance = sumSquares - (sum * sum) / bucketCount

      for (let klass = 2; klass <= Math.min(total, classes); klass += 1) {
        if (varianceCombinations[klass - 1]![index - 1]! + variance < varianceCombinations[klass]![total]!) {
          varianceCombinations[klass]![total] = varianceCombinations[klass - 1]![index - 1]! + variance
          lowerClassLimits[klass]![total] = index
        }
      }
    }

    varianceCombinations[1]![total] = variance
    lowerClassLimits[1]![total] = 1
  }

  const breaks: number[] = []
  let current = count
  for (let klass = classes; klass >= 1; klass -= 1) {
    const start = lowerClassLimits[klass]![current]! - 1
    breaks.unshift(sorted[start]!)
    current = start
  }

  breaks.push(sorted[count - 1]!)
  return [...new Set(breaks)].slice(0, classes + 1)
}

export function getColorForValue(
  value: number | null,
  breaks: number[],
  palette: MapPalette,
  _scaleType: ColorScaleType = 'sequential'
): string {
  if (value === null || Number.isNaN(value)) {
    return MISSING_DATA_COLORS.fill
  }

  const colors = COLOR_PALETTES[palette]
  if (breaks.length === 0 || colors.length === 0) {
    return colors[Math.floor(colors.length / 2)] || '#4B90F5'
  }

  let classIndex = 0
  for (let index = 1; index < breaks.length; index += 1) {
    if (value >= breaks[index - 1]! && (index === breaks.length - 1 || value < breaks[index]!)) {
      classIndex = index - 1
      break
    }
  }

  const colorIndex = Math.min(
    Math.floor((classIndex / (breaks.length - 1)) * colors.length),
    colors.length - 1
  )

  return colors[colorIndex]!
}

export function createColorScale(
  breaks: number[],
  palette: MapPalette,
  scaleType: ColorScaleType = 'sequential'
) {
  return (value: number | null) => getColorForValue(value, breaks, palette, scaleType)
}

export function getLegendTicks(breaks: number[], maxTicks = 5): number[] {
  if (breaks.length <= maxTicks) {
    return breaks
  }

  const ticks: number[] = [breaks[0]!]
  const step = Math.floor((breaks.length - 1) / (maxTicks - 1))

  for (let index = step; index < breaks.length - 1; index += step) {
    if (ticks.length < maxTicks - 1) {
      ticks.push(breaks[index]!)
    }
  }

  ticks.push(breaks[breaks.length - 1]!)
  return ticks
}

export function formatNumberForMap(value: number, locale: string): string {
  if (Math.abs(value) >= 1000000) {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }

  if (Math.abs(value) >= 1000) {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (Math.abs(value) >= 1) {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 1,
    }).format(value)
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(value)
}

export function getPaletteInfo(palette: MapPalette): {
  name: string
  colors: string[]
  type: ColorScaleType
} {
  const names: Record<MapPalette, string> = {
    blues: 'Blues',
    reds: 'Reds',
    greens: 'Greens',
    oranges: 'Oranges',
    purples: 'Purples',
    viridis: 'Viridis',
    'orange-blue': 'Orange-Blue',
    'red-blue': 'Red-Blue',
  }

  const types: Record<MapPalette, ColorScaleType> = {
    blues: 'sequential',
    reds: 'sequential',
    greens: 'sequential',
    oranges: 'sequential',
    purples: 'sequential',
    viridis: 'sequential',
    'orange-blue': 'diverging',
    'red-blue': 'diverging',
  }

  return {
    name: names[palette],
    colors: COLOR_PALETTES[palette],
    type: types[palette],
  }
}

export function getPalettesByType(): Record<ColorScaleType, MapPalette[]> {
  return {
    sequential: ['blues', 'reds', 'greens', 'oranges', 'purples', 'viridis'],
    diverging: ['orange-blue', 'red-blue'],
    categorical: [],
  }
}
