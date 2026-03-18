/**
 * Comparison Calculations
 * Feature 43: Comparison Tools
 */

import {
  YearOverYearData,
  MunicipalCompareData,
  ComparisonResult,
  calculateCAGR,
  calculatePercentChange,
} from './types';

/**
 * Calculate year-over-year comparison
 */
export function calculateYearOverYear(
  data: Array<{ year: number; metric: string; value: number }>,
  baseYear: number,
  compareYear: number
): YearOverYearData[] {
  const results: YearOverYearData[] = [];
  const metrics = [...new Set(data.map((d) => d.metric))];

  for (const metric of metrics) {
    const baseData = data.find(
      (d) => d.year === baseYear && d.metric === metric
    );
    const compareData = data.find(
      (d) => d.year === compareYear && d.metric === metric
    );

    if (baseData && compareData) {
      const absoluteChange = compareData.value - baseData.value;
      const percentChange = calculatePercentChange(
        baseData.value,
        compareData.value
      );
      const cagr = calculateCAGR(
        baseData.value,
        compareData.value,
        compareYear - baseYear
      );

      results.push({
        metric,
        baseValue: baseData.value,
        compareValue: compareData.value,
        absoluteChange,
        percentChange,
        cagr,
      });
    }
  }

  return results;
}

/**
 * Calculate municipal comparison
 */
export function calculateMunicipalComparison(
  data: Array<{ code: string; name: string; value: number }>,
  referenceCode?: string
): MunicipalCompareData[] {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const _maxValue = sorted[0]?.value || 1;
  const _minValue = sorted[sorted.length - 1]?.value || 0;
  const avgValue = data.reduce((sum, d) => sum + d.value, 0) / data.length;

  const reference = referenceCode
    ? data.find((d) => d.code === referenceCode)
    : null;
  const referenceValue = reference?.value || avgValue;

  return sorted.map((d, index) => ({
    municipalityCode: d.code,
    municipalityName: d.name,
    value: d.value,
    rank: index + 1,
    percentile: Math.round(((data.length - index) / data.length) * 100),
    difference: d.value - referenceValue,
    differencePercent: calculatePercentChange(referenceValue, d.value),
  }));
}

/**
 * Generate comparison summary
 */
export function generateComparisonSummary(
  data: (YearOverYearData | MunicipalCompareData)[]
): ComparisonResult['summary'] {
  if (data.length === 0) return {};

  // Check if YearOverYear or MunicipalCompare
  if ('metric' in data[0]) {
    const yoyData = data as YearOverYearData[];
    const improving = yoyData.filter((d) => d.percentChange > 0);
    const declining = yoyData.filter((d) => d.percentChange < 0);

    return {
      bestPerformer: yoyData.reduce(
        (best, d) =>
          d.percentChange > (best?.percentChange || -Infinity) ? d : best,
        yoyData[0]
      )?.metric,
      worstPerformer: yoyData.reduce(
        (worst, d) =>
          d.percentChange < (worst?.percentChange || Infinity) ? d : worst,
        yoyData[0]
      )?.metric,
      averageChange:
        yoyData.reduce((sum, d) => sum + d.percentChange, 0) / yoyData.length,
      trend:
        improving.length > declining.length
          ? 'improving'
          : declining.length > improving.length
            ? 'declining'
            : 'stable',
    };
  } else {
    const munData = data as MunicipalCompareData[];
    return {
      bestPerformer: munData[0]?.municipalityName,
      worstPerformer: munData[munData.length - 1]?.municipalityName,
      averageChange:
        munData.reduce((sum, d) => sum + (d.differencePercent || 0), 0) /
        munData.length,
    };
  }
}

/**
 * Full comparison analysis
 */
export function analyzeComparison(
  data: (YearOverYearData | MunicipalCompareData)[]
): ComparisonResult {
  return {
    data,
    summary: generateComparisonSummary(data),
  };
}

export { calculateCAGR, calculatePercentChange };
