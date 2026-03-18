import type { ChartConfig, ChartRendererDataRow } from '@/types'

export interface QualityCheckResult {
  id: string
  title: string
  score: number
  maxScore: number
  passed: boolean
  message: string
  suggestion?: string
}

export interface QualityReport {
  overallScore: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  checks: QualityCheckResult[]
}

interface ChartQualityInput {
  config: Partial<ChartConfig>
  data: ChartRendererDataRow[]
  height?: number
  exportFormats?: Array<'png' | 'svg' | 'csv' | 'excel'>
  hasTableToggle?: boolean
}

function clampScore(value: number, maxScore: number) {
  return Math.max(0, Math.min(maxScore, value))
}

function getGrade(overallScore: number): QualityReport['grade'] {
  if (overallScore >= 90) return 'A'
  if (overallScore >= 80) return 'B'
  if (overallScore >= 70) return 'C'
  if (overallScore >= 60) return 'D'
  return 'F'
}

function hasMissingMappedValues(
  data: ChartRendererDataRow[],
  fields: Array<string | undefined>
) {
  const activeFields = fields.filter((field): field is string => Boolean(field))
  if (!activeFields.length || !data.length) return false

  return data.some(row =>
    activeFields.some(field => row[field] === null || row[field] === undefined || row[field] === '')
  )
}

function isTypeAppropriate(config: Partial<ChartConfig>, data: ChartRendererDataRow[]) {
  switch (config.type) {
    case 'pie':
      return data.length <= 8
    case 'combo':
      return Boolean(config.options?.secondaryField)
    case 'scatterplot':
      return Boolean(config.x_axis?.field && config.y_axis?.field && config.x_axis.field !== config.y_axis.field)
    case 'heatmap':
      return Boolean(config.options?.heatmapYField)
    case 'sankey':
      return Boolean(config.options?.sankeySourceField ?? config.x_axis?.field) && Boolean(config.options?.sankeyTargetField)
    case 'population-pyramid':
      return Boolean(config.options?.pyramidMaleField) && Boolean(config.options?.pyramidFemaleField)
    default:
      return true
  }
}

export function evaluateChartQuality({
  config,
  data,
  height = 400,
  exportFormats = ['png', 'csv', 'excel'],
  hasTableToggle = false,
}: ChartQualityInput): QualityReport {
  const titleScore =
    (config.title?.trim() ? 5 : 0) +
    (config.x_axis?.label?.trim() ? 5 : 0) +
    (config.y_axis?.label?.trim() ? 5 : 0) +
    (config.description?.trim() ? 5 : 0)

  const titleAndLabels: QualityCheckResult = {
    id: 'title-labels',
    title: 'Title & labels',
    score: clampScore(titleScore, 20),
    maxScore: 20,
    passed: titleScore >= 15,
    message:
      titleScore >= 15
        ? 'The chart has enough descriptive context for readers.'
        : 'Add a title, axis labels, or a short description to improve clarity.',
    suggestion:
      titleScore >= 20
        ? undefined
        : 'Prefer a clear title plus explicit X and Y labels.',
  }

  const mappedFields = [
    config.x_axis?.field,
    config.y_axis?.field,
    config.options?.secondaryField,
    config.options?.heatmapYField,
    config.options?.sankeyTargetField,
    config.options?.pyramidFemaleField,
  ]
  const noMissingMappedValues = !hasMissingMappedValues(data, mappedFields)
  const enoughRows = data.length >= 2
  const appropriateType = isTypeAppropriate(config, data)
  const integrityScore =
    (enoughRows ? 6 : 0) + (noMissingMappedValues ? 7 : 0) + (appropriateType ? 7 : 0)

  const dataIntegrity: QualityCheckResult = {
    id: 'data-integrity',
    title: 'Data integrity',
    score: clampScore(integrityScore, 20),
    maxScore: 20,
    passed: integrityScore >= 14,
    message:
      integrityScore >= 14
        ? 'The mapped fields look valid for the chosen chart type.'
        : 'The current mapping or data completeness weakens this chart.',
    suggestion:
      integrityScore >= 20
        ? undefined
        : 'Check mapped fields for nulls and verify the chart type fits the dataset shape.',
  }

  const seriesCount =
    1 +
    Number(Boolean(config.options?.secondaryField)) +
    Number(Boolean(config.options?.pyramidFemaleField))
  const paletteSize = config.options?.colors?.length ?? 0
  const visualScore =
    ((paletteSize === 0 || paletteSize <= 6) ? 7 : 0) +
    (height >= 320 ? 7 : 0) +
    (seriesCount <= 6 ? 6 : 0)

  const visualClarity: QualityCheckResult = {
    id: 'visual-clarity',
    title: 'Visual clarity',
    score: clampScore(visualScore, 20),
    maxScore: 20,
    passed: visualScore >= 14,
    message:
      visualScore >= 14
        ? 'The chart has a reasonable density and presentation footprint.'
        : 'The chart risks becoming crowded or too compressed.',
    suggestion:
      visualScore >= 20
        ? undefined
        : 'Keep palettes compact and give complex charts more vertical space.',
  }

  const accessibilityScore =
    (config.title?.trim() ? 5 : 0) +
    (config.description?.trim() ? 5 : 0) +
    (config.x_axis?.label?.trim() || config.y_axis?.label?.trim() ? 5 : 0) +
    (hasTableToggle ? 5 : 0)

  const accessibility: QualityCheckResult = {
    id: 'accessibility',
    title: 'Accessibility',
    score: clampScore(accessibilityScore, 20),
    maxScore: 20,
    passed: accessibilityScore >= 10,
    message:
      accessibilityScore >= 10
        ? 'Basic accessibility signals are present.'
        : 'Readers need more descriptive and accessible support.',
    suggestion:
      hasTableToggle
        ? 'Add explicit labels and descriptions for assistive technology.'
        : 'Consider exposing the accessible table toggle in the final chart view.',
  }

  const interactivityScore =
    (config.options?.responsive ?? true ? 7 : 0) +
    (exportFormats.length >= 2 ? 7 : 0) +
    (config.options?.animation ?? true ? 6 : 0)

  const interactivity: QualityCheckResult = {
    id: 'interactivity',
    title: 'Interactivity',
    score: clampScore(interactivityScore, 20),
    maxScore: 20,
    passed: interactivityScore >= 14,
    message:
      interactivityScore >= 14
        ? 'The chart has a healthy baseline for responsive exportable use.'
        : 'The interaction surface is present but still thin.',
    suggestion:
      exportFormats.includes('svg')
        ? 'Responsive behavior and export coverage are in place.'
        : 'Add SVG export and keep responsiveness enabled.',
  }

  const checks = [
    titleAndLabels,
    dataIntegrity,
    visualClarity,
    accessibility,
    interactivity,
  ]
  const overallScore = checks.reduce((sum, check) => sum + check.score, 0)

  return {
    overallScore,
    grade: getGrade(overallScore),
    checks,
  }
}

export const generateQualityReport = (
  config: Partial<ChartConfig>,
  data: ChartRendererDataRow[]
) => evaluateChartQuality({ config, data, exportFormats: ['png', 'svg', 'csv'] })

export const assessChartQuality = (
  config: ChartConfig,
  data: ChartRendererDataRow[]
) =>
  evaluateChartQuality({
    config,
    data,
    exportFormats: ['png', 'svg', 'csv'],
    hasTableToggle: true,
  })
