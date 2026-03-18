/**
 * Real-time Data Hook
 * Provides simulated real-time updates for dashboard widgets
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface RealtimeDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
}

export interface RealtimeMetric {
  id: string;
  name: string;
  currentValue: number;
  previousValue?: number;
  trend?: 'up' | 'down' | 'stable';
  trendPercentage?: number;
  unit?: string;
  data: RealtimeDataPoint[];
  lastUpdated: Date;
}

export interface RealtimeConfig {
  refreshInterval?: number; // milliseconds
  maxDataPoints?: number;
  simulateData?: boolean;
}

/**
 * Hook for managing real-time metric data
 * Can connect to WebSocket or simulate data for demos
 */
export function useRealtimeMetric(
  metricId: string,
  config: RealtimeConfig = {}
): {
  metric: RealtimeMetric | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
} {
  const {
    refreshInterval = 5000,
    maxDataPoints = 100,
    simulateData = true,
  } = config;

  const [metric, setMetric] = useState<RealtimeMetric | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, _setError] = useState<Error | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate simulated data
  const generateSimulatedData = useCallback(() => {
    const now = new Date();
    const data: RealtimeDataPoint[] = [];

    // Generate historical data points
    for (let i = maxDataPoints - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * refreshInterval);
      const baseValue = getBaseValueForMetric(metricId);
      const variance = baseValue * 0.1;
      const value = baseValue + (Math.random() - 0.5) * variance;

      data.push({
        timestamp,
        value: Math.round(value * 100) / 100,
      });
    }

    return data;
  }, [metricId, maxDataPoints, refreshInterval]);

  // Get base value for different metric types
  const getBaseValueForMetric = (id: string): number => {
    const bases: Record<string, number> = {
      population: 6900000,
      gdp: 60000,
      unemployment: 10,
      inflation: 5,
      budget: 1500000000,
      visitors: 5000,
      transactions: 15000,
      requests: 1000,
    };
    return bases[id] || 100;
  };

  // Update metric with new data point
  const updateMetric = useCallback(() => {
    setMetric((prev) => {
      if (!prev) {
        // Initialize metric
        const initialData = simulateData ? generateSimulatedData() : [];
        const currentValue = initialData[initialData.length - 1]?.value || 0;

        return {
          id: metricId,
          name: getMetricName(metricId),
          currentValue,
          data: initialData,
          lastUpdated: new Date(),
          unit: getUnitForMetric(metricId),
        };
      }

      // Add new data point
      const newValue = simulateData
        ? prev.currentValue + (Math.random() - 0.5) * prev.currentValue * 0.02
        : prev.currentValue;

      const newData = [
        ...prev.data,
        {
          timestamp: new Date(),
          value: Math.round(newValue * 100) / 100,
        },
      ].slice(-maxDataPoints);

      const previousValue = prev.currentValue;
      const trendValue = newValue - previousValue;
      const trendPercentage =
        previousValue !== 0 ? (trendValue / previousValue) * 100 : 0;

      return {
        ...prev,
        currentValue: Math.round(newValue * 100) / 100,
        previousValue,
        trend: trendValue > 0 ? 'up' : trendValue < 0 ? 'down' : 'stable',
        trendPercentage: Math.round(trendPercentage * 100) / 100,
        data: newData,
        lastUpdated: new Date(),
      };
    });
  }, [metricId, maxDataPoints, simulateData, generateSimulatedData]);

  // Manual refresh
  const refresh = useCallback(() => {
    updateMetric();
  }, [updateMetric]);

  // Initialize and set up interval
  useEffect(() => {
    setIsLoading(true);

    // Initial load
    updateMetric();
    setIsLoading(false);

    // Set up refresh interval
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(updateMetric, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval, updateMetric]);

  return { metric, isLoading, error, refresh };
}

/**
 * Hook for multiple real-time metrics
 */
export function useRealtimeMetrics(
  metricIds: string[],
  config: RealtimeConfig = {}
): {
  metrics: Record<string, RealtimeMetric>;
  isLoading: boolean;
  refresh: () => void;
} {
  const [metrics, setMetrics] = useState<Record<string, RealtimeMetric>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Update individual metric
  const updateMetrics = useCallback(() => {
    setMetrics((prev) => {
      const newMetrics: Record<string, RealtimeMetric> = {};
      const now = new Date();

      for (const metricId of metricIds) {
        const prevMetric = prev[metricId];

        if (!prevMetric) {
          // Initialize new metric
          const baseValue = getBaseValue(metricId);
          newMetrics[metricId] = {
            id: metricId,
            name: getMetricName(metricId),
            currentValue: baseValue,
            data: [
              {
                timestamp: now,
                value: baseValue,
              },
            ],
            lastUpdated: now,
            unit: getUnitForMetric(metricId),
          };
        } else {
          // Update existing metric
          const variance = prevMetric.currentValue * 0.02;
          const newValue =
            prevMetric.currentValue + (Math.random() - 0.5) * variance;
          const trendValue = newValue - prevMetric.currentValue;

          newMetrics[metricId] = {
            ...prevMetric,
            currentValue: Math.round(newValue * 100) / 100,
            previousValue: prevMetric.currentValue,
            trend: trendValue > 0 ? 'up' : trendValue < 0 ? 'down' : 'stable',
            trendPercentage:
              prevMetric.currentValue !== 0
                ? Math.round((trendValue / prevMetric.currentValue) * 10000) /
                  100
                : 0,
            data: [
              ...prevMetric.data,
              {
                timestamp: now,
                value: Math.round(newValue * 100) / 100,
              },
            ].slice(-100),
            lastUpdated: now,
          };
        }
      }

      return newMetrics;
    });
  }, [metricIds]);

  const refresh = useCallback(() => {
    updateMetrics();
  }, [updateMetrics]);

  useEffect(() => {
    setIsLoading(true);
    updateMetrics();
    setIsLoading(false);

    if (config.refreshInterval && config.refreshInterval > 0) {
      const interval = setInterval(updateMetrics, config.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [config.refreshInterval, updateMetrics]);

  return { metrics, isLoading, refresh };
}

// Helper functions
function getBaseValue(metricId: string): number {
  const bases: Record<string, number> = {
    population: 6900000,
    gdp: 60000,
    unemployment: 10,
    inflation: 5,
    budget: 1500000000,
    visitors: 5000,
    transactions: 15000,
  };
  return bases[metricId] || 100;
}

function getMetricName(metricId: string): string {
  const names: Record<string, string> = {
    population: 'Ukupno stanovnika',
    gdp: 'BDP po glavi stanovnika',
    unemployment: 'Stopa nezaposlenosti',
    inflation: 'Stopa inflacije',
    budget: 'Budžet',
    visitors: 'Posetilaca dnevno',
    transactions: 'Transakcija',
  };
  return names[metricId] || metricId;
}

function getUnitForMetric(metricId: string): string | undefined {
  const units: Record<string, string> = {
    population: '',
    gdp: '€',
    unemployment: '%',
    inflation: '%',
    budget: 'RSD',
    visitors: '',
    transactions: '',
  };
  return units[metricId];
}

export default useRealtimeMetric;
