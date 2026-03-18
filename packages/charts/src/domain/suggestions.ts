import type { ParsedDataset } from '@vizualni/shared-kernel';

import type { ChartConfig, SupportedChartType } from './chart-config';

function matchesAny(value: string | undefined, patterns: RegExp[]) {
  if (!value) {
    return false;
  }

  return patterns.some((pattern) => pattern.test(value));
}

function looksLikePopulationPyramid(dataset: ParsedDataset) {
  const agePatterns = [/age/i, /starost/i, /uzrast/i];
  const malePatterns = [/male/i, /muskar/i, /мушкар/i, /^m$/i];
  const femalePatterns = [/female/i, /zensk/i, /женск/i, /^f$/i];
  const genderPatterns = [/gender/i, /pol/i, /spol/i];

  const hasAgeDimension = dataset.dimensions.some(
    (dimension) =>
      matchesAny(dimension.key, agePatterns) || matchesAny(dimension.label, agePatterns)
  );
  const hasMaleMeasure = dataset.measures.some(
    (measure) =>
      matchesAny(measure.key, malePatterns) || matchesAny(measure.label, malePatterns)
  );
  const hasFemaleMeasure = dataset.measures.some(
    (measure) =>
      matchesAny(measure.key, femalePatterns) || matchesAny(measure.label, femalePatterns)
  );
  const hasGenderDimension = dataset.dimensions.some(
    (dimension) =>
      matchesAny(dimension.key, genderPatterns) || matchesAny(dimension.label, genderPatterns)
  );

  return hasAgeDimension && ((hasMaleMeasure && hasFemaleMeasure) || hasGenderDimension);
}

function getFallbackTitle(datasetTitle: string) {
  return datasetTitle ? `Chart: ${datasetTitle}` : 'Chart preview';
}

function getFallbackDimension(dataset: ParsedDataset) {
  return dataset.dimensions[0]?.key ?? dataset.columns[0];
}

function getFallbackMeasure(dataset: ParsedDataset) {
  return (
    dataset.measures[0]?.key ??
    dataset.columns.find((column) => column !== getFallbackDimension(dataset))
  );
}

export function getSuggestedChartType(
  dataset: ParsedDataset
): SupportedChartType {
  if (looksLikePopulationPyramid(dataset)) {
    return 'population-pyramid';
  }

  const firstDimension = getFallbackDimension(dataset);
  const firstMeasure = getFallbackMeasure(dataset);

  if (!firstMeasure) {
    return 'table';
  }

  if (!firstDimension && dataset.measures.length >= 2) {
    return 'scatterplot';
  }

  const dimensionMeta = dataset.dimensions.find(
    (dimension) => dimension.key === firstDimension
  );
  return dimensionMeta?.type === 'temporal' ? 'line' : 'column';
}

export function getSuggestedChartConfig(
  datasetId: string,
  datasetTitle: string,
  dataset: ParsedDataset
): Partial<ChartConfig> {
  const suggestedType = getSuggestedChartType(dataset);
  const firstDimension = getFallbackDimension(dataset);
  const firstMeasure = getFallbackMeasure(dataset);
  const secondMeasure = dataset.measures[1]?.key;

  if (suggestedType === 'table') {
    return {
      type: 'table',
      title: getFallbackTitle(datasetTitle),
      dataset_id: datasetId,
      options: {
        pageSize: 12,
        showGrid: false,
        showLegend: false,
        responsive: true,
      },
    };
  }

  if (suggestedType === 'scatterplot' && dataset.measures.length >= 2) {
    return {
      type: 'scatterplot',
      title: getFallbackTitle(datasetTitle),
      dataset_id: datasetId,
      x_axis: {
        field: dataset.measures[0]!.key,
        label: dataset.measures[0]!.label,
        type: 'linear',
      },
      y_axis: {
        field: dataset.measures[1]!.key,
        label: dataset.measures[1]!.label,
        type: 'linear',
      },
      options: {
        dotSize: 6,
        opacity: 0.7,
        showLegend: false,
        showGrid: false,
        responsive: true,
      },
    };
  }

  if (suggestedType === 'population-pyramid') {
    const ageDimension = dataset.dimensions.find(
      (dimension) =>
        matchesAny(dimension.key, [/age/i, /starost/i, /uzrast/i]) ||
        matchesAny(dimension.label, [/age/i, /starost/i, /uzrast/i])
    );
    const maleMeasure = dataset.measures.find(
      (measure) =>
        matchesAny(measure.key, [/male/i, /muskar/i, /мушкар/i, /^m$/i]) ||
        matchesAny(measure.label, [/male/i, /muskar/i, /мушкар/i, /^m$/i])
    );
    const femaleMeasure = dataset.measures.find(
      (measure) =>
        matchesAny(measure.key, [/female/i, /zensk/i, /женск/i, /^f$/i]) ||
        matchesAny(measure.label, [/female/i, /zensk/i, /женск/i, /^f$/i])
    );

    return {
      type: 'population-pyramid',
      title: getFallbackTitle(datasetTitle),
      dataset_id: datasetId,
      x_axis: {
        field: ageDimension?.key ?? firstDimension ?? dataset.columns[0] ?? 'category',
        label: ageDimension?.label ?? ageDimension?.key ?? 'Category',
        type: 'category',
      },
      y_axis: {
        field: maleMeasure?.key ?? firstMeasure ?? dataset.columns[1] ?? 'value',
        label: maleMeasure?.label ?? maleMeasure?.key ?? 'Male',
        type: 'linear',
      },
      options: {
        showLegend: true,
        showGrid: true,
        responsive: true,
        grouping: 'grouped',
        pyramidMaleField: maleMeasure?.key ?? firstMeasure,
        pyramidFemaleField: femaleMeasure?.key ?? dataset.measures[1]?.key,
      },
    };
  }

  return {
    type: suggestedType,
    title: getFallbackTitle(datasetTitle),
    dataset_id: datasetId,
    x_axis: firstDimension
      ? {
          field: firstDimension,
          label:
            dataset.dimensions.find(
              (dimension) => dimension.key === firstDimension
            )?.label ?? firstDimension,
          type:
            dataset.dimensions.find(
              (dimension) => dimension.key === firstDimension
            )?.type === 'temporal'
              ? 'date'
              : 'category',
        }
      : undefined,
    y_axis: firstMeasure
      ? {
          field: firstMeasure,
          label:
            dataset.measures.find((measure) => measure.key === firstMeasure)
              ?.label ?? firstMeasure,
          type: 'linear',
        }
      : undefined,
    options: {
      showLegend: true,
      showGrid: true,
      animation: true,
      responsive: true,
      secondaryField: suggestedType === 'combo' ? secondMeasure : undefined,
    },
  };
}
