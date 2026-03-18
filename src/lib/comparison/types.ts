/**
 * Comparison Tools Types
 * Feature 43: Comparison Tools
 */

export interface ComparisonDataPoint {
  label: string;
  value1: number;
  value2: number;
  change?: number;
  changePercent?: number;
}

export interface YearOverYearConfig {
  baseYear: number;
  comparisonYear: number;
  metrics: string[];
}

export interface YearOverYearData {
  metric: string;
  baseValue: number;
  compareValue: number;
  absoluteChange: number;
  percentChange: number;
  cagr?: number; // Compound Annual Growth Rate
}

export interface MunicipalCompareConfig {
  municipalities: string[];
  metric: string;
  year?: number;
}

export interface MunicipalCompareData {
  municipalityCode: string;
  municipalityName: string;
  value: number;
  rank?: number;
  percentile?: number;
  difference?: number;
  differencePercent?: number;
}

export interface ComparisonResult {
  data: (YearOverYearData | MunicipalCompareData)[];
  summary: {
    bestPerformer?: string;
    worstPerformer?: string;
    averageChange?: number;
    trend?: 'improving' | 'declining' | 'stable';
  };
}

// CAGR calculation helper
export function calculateCAGR(
  startValue: number,
  endValue: number,
  years: number
): number {
  if (startValue <= 0 || years <= 0) return 0;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}

// Percent change helper
export function calculatePercentChange(
  oldValue: number,
  newValue: number
): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / oldValue) * 100;
}
