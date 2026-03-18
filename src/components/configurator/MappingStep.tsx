'use client'

import { useMemo } from 'react'

import { useConfiguratorStore } from '@/stores/configurator'

interface MappingStepProps {
  labels?: {
    x_axis?: string
    y_axis?: string
    target_field?: string
    secondary_dimension?: string
    male_measure?: string
    female_measure?: string
    value_field?: string
    label_field?: string
    color_by?: string
    segment_by?: string
    select_field?: string
    dimensions?: string
    measures?: string
    validation?: {
      required_dimension?: string
      required_measure?: string
      pie_single_measure?: string
      scatter_two_measures?: string
      combo_two_measures?: string
    }
  }
}

export function MappingStep(props: MappingStepProps) {
  const labels = {
    x_axis: 'X axis',
    y_axis: 'Y axis',
    target_field: 'Target field',
    secondary_dimension: 'Secondary dimension',
    male_measure: 'Male measure',
    female_measure: 'Female measure',
    value_field: 'Value field',
    label_field: 'Label field',
    color_by: 'Color by',
    segment_by: 'Segment by',
    select_field: 'Select field',
    dimensions: 'Dimensions',
    measures: 'Measures',
    validation: {
      required_dimension: 'Dimension is required',
      required_measure: 'Measure is required',
      pie_single_measure: 'Pie chart requires exactly one measure',
      scatter_two_measures: 'Scatterplot requires two measures',
      combo_two_measures: 'Combo chart requires two measures',
      ...props?.labels?.validation,
    },
    ...props,
  }

  const { parsedDataset, config, updateConfig } = useConfiguratorStore()

  const dimensionFields = useMemo(() => parsedDataset?.dimensions ?? [], [parsedDataset])
  const measureFields = useMemo(() => parsedDataset?.measures ?? [], [parsedDataset])
  const allColumns = useMemo(() => parsedDataset?.columns ?? [], [parsedDataset])

  const handleXAxisChange = (field: string) => {
    updateConfig({
      x_axis: field ? { field } : undefined,
    })
  }

  const handleYAxisChange = (field: string) => {
    updateConfig({
      y_axis: field ? { field } : undefined,
    })
  }

  const handleColorByChange = (field: string) => {
    updateConfig({
      options: {
        ...config.options,
        colors: field ? undefined : config.options?.colors,
      },
    })
  }

  const handleSecondaryFieldChange = (field: string) => {
    updateConfig({
      options: {
        ...config.options,
        secondaryField: field || undefined,
      },
    })
  }

  const handleOptionFieldChange = (
    key: 'heatmapYField' | 'sankeyTargetField' | 'pyramidMaleField' | 'pyramidFemaleField',
    field: string
  ) => {
    updateConfig({
      options: {
        ...config.options,
        [key]: field || undefined,
      },
      ...(key === 'pyramidMaleField'
        ? {
            y_axis: field
              ? {
                  field,
                  type: 'linear',
                }
              : undefined,
          }
        : {}),
    })
  }

  // Validation
  const validationErrors = useMemo(() => {
    const errors: string[] = []
    const chartType = config.type

    if (chartType === 'table') return errors

    if (!config.x_axis?.field) {
      errors.push(labels.validation!.required_dimension!)
    }
    if (!config.y_axis?.field) {
      errors.push(labels.validation!.required_measure!)
    }

    if (chartType === 'heatmap' && !config.options?.heatmapYField) {
      errors.push('Heatmap requires a second dimension.')
    }

    if (chartType === 'sankey' && !config.options?.sankeyTargetField) {
      errors.push('Sankey diagram requires a target field.')
    }

    if (
      chartType === 'population-pyramid' &&
      (!config.options?.pyramidMaleField || !config.options?.pyramidFemaleField)
    ) {
      errors.push('Population pyramid requires male and female measures.')
    }

    if (chartType === 'pie' && measureFields.length !== 1) {
      // Pie chart is only valid with one measure
    }

    return errors
  }, [config, measureFields.length, labels.validation])

  if (!parsedDataset) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Please select a dataset first.
      </div>
    )
  }

  // Table chart doesn't need mapping
  if (config.type === 'table') {
    return (
      <div className="space-y-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">
            Table view will display all {allColumns.length} columns from the dataset.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {allColumns.slice(0, 8).map(col => (
              <span
                key={col}
                className="rounded-full bg-white px-2 py-1 text-xs text-slate-600"
              >
                {col}
              </span>
            ))}
            {allColumns.length > 8 && (
              <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-500">
                +{allColumns.length - 8} more
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  const isScatterplot = config.type === 'scatterplot'
  const isCombo = config.type === 'combo'
  const isHeatmap = config.type === 'heatmap'
  const isSankey = config.type === 'sankey'
  const isPopulationPyramid = config.type === 'population-pyramid'
  const isGauge = config.type === 'gauge'

  return (
    <div className="space-y-5">
      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3">
          <ul className="space-y-1 text-sm text-red-700">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* X Axis */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {labels.x_axis}
          <span className="ml-1 text-red-500">*</span>
        </label>
        <select
          value={config.x_axis?.field || ''}
          onChange={e => handleXAxisChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-gov-primary focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
        >
          <option value="">{labels.select_field}</option>
          {isScatterplot ? (
            // Scatterplot uses measures for both axes
            measureFields.map(field => (
              <option key={field.key} value={field.key}>
                {field.label} ({labels.measures})
              </option>
            ))
          ) : isGauge ? (
            allColumns.map(field => (
              <option key={field} value={field}>
                {field}
              </option>
            ))
          ) : (
            // Other charts use dimensions for X axis
            dimensionFields.map(field => (
              <option key={field.key} value={field.key}>
                {field.label} ({field.type})
              </option>
            ))
          )}
        </select>
        {config.x_axis?.field && (
          <p className="mt-1 text-xs text-slate-500">
            {dimensionFields.find(d => d.key === config.x_axis?.field)?.cardinality ?? 0} unique values
          </p>
        )}
      </div>

      {!isPopulationPyramid && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {isSankey || isHeatmap || isGauge ? labels.value_field : labels.y_axis}
            <span className="ml-1 text-red-500">*</span>
          </label>
          <select
            value={config.y_axis?.field || ''}
            onChange={e => handleYAxisChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-gov-primary focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
          >
            <option value="">{labels.select_field}</option>
            {measureFields.map(field => (
              <option key={field.key} value={field.key}>
                {field.label}
                {field.unit ? ` (${field.unit})` : ''}
              </option>
            ))}
          </select>
          {config.y_axis?.field && (
            <p className="mt-1 text-xs text-slate-500">
              Range: {measureFields.find(m => m.key === config.y_axis?.field)?.min ?? 0} - {measureFields.find(m => m.key === config.y_axis?.field)?.max ?? 0}
            </p>
          )}
        </div>
      )}

      {isHeatmap && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {labels.secondary_dimension}
            <span className="ml-1 text-red-500">*</span>
          </label>
          <select
            value={config.options?.heatmapYField || ''}
            onChange={e => handleOptionFieldChange('heatmapYField', e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-gov-primary focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
          >
            <option value="">{labels.select_field}</option>
            {dimensionFields
              .filter(field => field.key !== config.x_axis?.field)
              .map(field => (
                <option key={field.key} value={field.key}>
                  {field.label} ({field.type})
                </option>
              ))}
          </select>
        </div>
      )}

      {isSankey && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {labels.target_field}
            <span className="ml-1 text-red-500">*</span>
          </label>
          <select
            value={config.options?.sankeyTargetField || ''}
            onChange={e => handleOptionFieldChange('sankeyTargetField', e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-gov-primary focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
          >
            <option value="">{labels.select_field}</option>
            {dimensionFields
              .filter(field => field.key !== config.x_axis?.field)
              .map(field => (
                <option key={field.key} value={field.key}>
                  {field.label} ({field.type})
                </option>
              ))}
          </select>
        </div>
      )}

      {isPopulationPyramid && (
        <>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {labels.male_measure}
              <span className="ml-1 text-red-500">*</span>
            </label>
            <select
              value={config.options?.pyramidMaleField || config.y_axis?.field || ''}
              onChange={e => handleOptionFieldChange('pyramidMaleField', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-gov-primary focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
            >
              <option value="">{labels.select_field}</option>
              {measureFields.map(field => (
                <option key={field.key} value={field.key}>
                  {field.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {labels.female_measure}
              <span className="ml-1 text-red-500">*</span>
            </label>
            <select
              value={config.options?.pyramidFemaleField || ''}
              onChange={e => handleOptionFieldChange('pyramidFemaleField', e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-gov-primary focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
            >
              <option value="">{labels.select_field}</option>
              {measureFields
                .filter(field => field.key !== (config.options?.pyramidMaleField || config.y_axis?.field))
                .map(field => (
                  <option key={field.key} value={field.key}>
                    {field.label}
                  </option>
                ))}
            </select>
          </div>
        </>
      )}

      {/* Secondary field for combo charts */}
      {isCombo && (
        <div>
          <label htmlFor="secondary-measure" className="mb-2 block text-sm font-medium text-slate-700">
            Secondary measure
          </label>
          <select
            id="secondary-measure"
            value={config.options?.secondaryField || ''}
            onChange={e => handleSecondaryFieldChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-gov-primary focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
          >
            <option value="">{labels.select_field}</option>
            {measureFields
              .filter(field => field.key !== config.y_axis?.field)
              .map(field => (
                <option key={field.key} value={field.key}>
                  {field.label}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Color by (optional) - for categorical dimensions */}
      {dimensionFields.length > 1 && !isScatterplot && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {labels.color_by}
            <span className="ml-1 text-slate-400">(optional)</span>
          </label>
          <select
            onChange={e => handleColorByChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-gov-primary focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
          >
            <option value="">None</option>
            {dimensionFields
              .filter(d => d.key !== config.x_axis?.field)
              .map(field => (
                <option key={field.key} value={field.key}>
                  {field.label}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Column info */}
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {labels.dimensions}
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{dimensionFields.length}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {labels.measures}
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{measureFields.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
