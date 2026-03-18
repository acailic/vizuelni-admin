/**
 * @file trend-analyzer.ts
 * @description Statistical trend analysis
 */

export interface TrendResult {
  direction: 'increasing' | 'decreasing' | 'stable';
  magnitude: number;
  confidence: number;
}

export class TrendAnalyzer {
  analyzeTrend(values: number[]): TrendResult {
    if (values.length < 2) {
      return { direction: 'stable', magnitude: 0, confidence: 0 };
    }

    const first = values[0];
    const last = values[values.length - 1];
    const magnitude = ((last - first) / first) * 100;

    const direction =
      magnitude > 1 ? 'increasing' : magnitude < -1 ? 'decreasing' : 'stable';

    return { direction, magnitude, confidence: 0.85 };
  }
}

export const trendAnalyzer = new TrendAnalyzer();
