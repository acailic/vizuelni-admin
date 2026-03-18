/**
 * Comparison Components Index
 * Feature 43: Comparison Tools
 */

export { YearOverYearChart, YearOverYearSparkline } from './YearOverYearChart';
export { MunicipalCompareChart } from './MunicipalCompareChart';
export { ComparisonPanel } from './ComparisonPanel';

// Re-export types
export type {
  ComparisonDataPoint,
  YearOverYearConfig,
  YearOverYearData,
  MunicipalCompareConfig,
  MunicipalCompareData,
  ComparisonResult,
} from '@/lib/comparison/types';

// Re-export calculations
export {
  calculateYearOverYear,
  calculateMunicipalComparison,
  calculateCAGR,
  calculatePercentChange,
} from '@/lib/comparison/calculations';
