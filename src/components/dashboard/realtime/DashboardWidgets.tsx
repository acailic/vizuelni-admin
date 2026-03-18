/**
 * Real-time Dashboard Widgets
 * Feature 41: Real-time Dashboards
 */

'use client';

import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { RealtimeMetric } from '@/lib/realtime/useRealtimeData';

// ============================================================
// WIDGET TYPES
// ============================================================

export type WidgetType =
  | 'metric-card'
  | 'line-chart'
  | 'sparkline'
  | 'gauge'
  | 'progress'
  | 'table';

export interface DashboardWidgetProps {
  metric: RealtimeMetric;
  type?: WidgetType;
  locale?: 'en' | 'sr' | 'srLat';
  showTrend?: boolean;
  showLastUpdated?: boolean;
  height?: number;
  className?: string;
}

// ============================================================
// METRIC CARD WIDGET
// ============================================================

export function MetricCardWidget({
  metric,
  locale = 'srLat',
  showTrend = true,
  showLastUpdated = true,
  className = '',
}: DashboardWidgetProps) {
  const formatValue = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    stable: 'text-gray-500 dark:text-gray-400',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    stable: '→',
  };

  const timeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return locale === 'en' ? 'Just now' : 'Upravo';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min`;
    return `${Math.floor(seconds / 3600)} h`;
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
        {metric.name}
      </p>
      <div className='flex items-end justify-between'>
        <div>
          <span className='text-2xl font-bold text-gray-900 dark:text-white'>
            {formatValue(metric.currentValue)}
            {metric.unit && (
              <span className='text-sm font-normal text-gray-500 ml-1'>
                {metric.unit}
              </span>
            )}
          </span>
        </div>
        {showTrend && metric.trend && (
          <div
            className={`flex items-center gap-1 text-sm ${trendColors[metric.trend]}`}
          >
            <span>{trendIcons[metric.trend]}</span>
            {metric.trendPercentage !== undefined && (
              <span>{Math.abs(metric.trendPercentage).toFixed(1)}%</span>
            )}
          </div>
        )}
      </div>
      {showLastUpdated && (
        <p className='text-xs text-gray-400 mt-2'>
          {locale === 'en' ? 'Updated' : 'Ažurirano'}{' '}
          {timeAgo(metric.lastUpdated)}
        </p>
      )}
    </div>
  );
}

// ============================================================
// SPARKLINE WIDGET
// ============================================================

export function SparklineWidget({
  metric,
  height = 60,
  className = '',
}: DashboardWidgetProps) {
  const data = useMemo(() => {
    return [
      {
        type: 'scatter',
        mode: 'lines',
        x: metric.data.map((d) => d.timestamp),
        y: metric.data.map((d) => d.value),
        line: {
          color:
            metric.trend === 'up'
              ? '#22c55e'
              : metric.trend === 'down'
                ? '#ef4444'
                : '#6b7280',
          width: 2,
        },
        fill: 'tozeroy',
        fillcolor:
          metric.trend === 'up'
            ? 'rgba(34, 197, 94, 0.1)'
            : metric.trend === 'down'
              ? 'rgba(239, 68, 68, 0.1)'
              : 'rgba(107, 114, 128, 0.1)',
        hoverinfo: 'none',
      },
    ];
  }, [metric]);

  const layout = useMemo(
    () => ({
      margin: { l: 0, r: 0, t: 0, b: 0 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      xaxis: { visible: false },
      yaxis: { visible: false },
      height,
    }),
    [height]
  );

  return (
    <div className={className}>
      <Plot
        data={data as any[]}
        layout={layout}
        config={{ displayModeBar: false, responsive: true }}
        className='w-full'
        style={{ height }}
      />
    </div>
  );
}

// ============================================================
// LINE CHART WIDGET
// ============================================================

export function LineChartWidget({
  metric,
  height = 200,
  locale: _locale = 'srLat',
  className = '',
}: DashboardWidgetProps) {
  const data = useMemo(() => {
    return [
      {
        type: 'scatter',
        mode: 'lines+markers',
        x: metric.data.map((d) => d.timestamp),
        y: metric.data.map((d) => d.value),
        line: { color: '#3b82f6', width: 2 },
        marker: { size: 4 },
        name: metric.name,
      },
    ];
  }, [metric]);

  const layout = useMemo(
    () => ({
      margin: { l: 50, r: 20, t: 20, b: 40 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      xaxis: {
        type: 'date',
        gridcolor: 'rgba(0,0,0,0.1)',
      },
      yaxis: {
        gridcolor: 'rgba(0,0,0,0.1)',
        tickprefix: metric.unit === '%' ? '%' : metric.unit === '€' ? '€' : '',
      },
      height,
      showlegend: false,
    }),
    [height, metric.unit]
  );

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
        {metric.name}
      </p>
      <Plot
        data={data as any[]}
        layout={layout}
        config={{ displayModeBar: false, responsive: true }}
        className='w-full'
        style={{ height: height - 40 }}
      />
    </div>
  );
}

// ============================================================
// GAUGE WIDGET
// ============================================================

export function GaugeWidget({
  metric,
  height = 150,
  className = '',
}: DashboardWidgetProps) {
  // Calculate gauge value (0-100 scale)
  const _min = 0;
  const max = Math.max(...metric.data.map((d) => d.value)) * 1.2;
  const normalizedValue = (metric.currentValue / max) * 100;

  const getColor = (value: number): string => {
    if (value < 33) return '#22c55e';
    if (value < 66) return '#eab308';
    return '#ef4444';
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <p className='text-sm text-gray-500 dark:text-gray-400 mb-2 text-center'>
        {metric.name}
      </p>
      <div className='relative w-full' style={{ height }}>
        <svg viewBox='0 0 200 120' className='w-full'>
          {/* Background arc */}
          <path
            d='M 20 100 A 80 80 0 0 1 180 100'
            fill='none'
            stroke='#e5e7eb'
            strokeWidth='16'
            strokeLinecap='round'
          />
          {/* Value arc */}
          <path
            d='M 20 100 A 80 80 0 0 1 180 100'
            fill='none'
            stroke={getColor(normalizedValue)}
            strokeWidth='16'
            strokeLinecap='round'
            strokeDasharray={`${normalizedValue * 2.51} 251`}
          />
        </svg>
        <div className='absolute inset-0 flex items-end justify-center pb-4'>
          <div className='text-center'>
            <span className='text-2xl font-bold text-gray-900 dark:text-white'>
              {metric.currentValue.toLocaleString()}
            </span>
            {metric.unit && (
              <span className='text-sm text-gray-500 ml-1'>{metric.unit}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PROGRESS BAR WIDGET
// ============================================================

export function ProgressWidget({
  metric,
  className = '',
}: DashboardWidgetProps) {
  const max = Math.max(...metric.data.map((d) => d.value)) * 1.1;
  const percentage = (metric.currentValue / max) * 100;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className='flex justify-between mb-2'>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          {metric.name}
        </p>
        <span className='text-sm font-medium text-gray-900 dark:text-white'>
          {metric.currentValue.toLocaleString()}
          {metric.unit && (
            <span className='text-gray-500 ml-1'>{metric.unit}</span>
          )}
        </span>
      </div>
      <div className='w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            percentage > 80
              ? 'bg-green-500'
              : percentage > 50
                ? 'bg-blue-500'
                : 'bg-yellow-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================
// COMBINED WIDGET (Card + Sparkline)
// ============================================================

export function MetricWithSparklineWidget(props: DashboardWidgetProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${props.className}`}
    >
      <div className='flex justify-between items-start'>
        <div>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
            {props.metric.name}
          </p>
          <div className='flex items-center gap-2'>
            <span className='text-2xl font-bold text-gray-900 dark:text-white'>
              {props.metric.currentValue.toLocaleString()}
              {props.metric.unit && (
                <span className='text-sm font-normal text-gray-500 ml-1'>
                  {props.metric.unit}
                </span>
              )}
            </span>
            {props.metric.trend && (
              <span
                className={`text-sm ${
                  props.metric.trend === 'up'
                    ? 'text-green-600'
                    : props.metric.trend === 'down'
                      ? 'text-red-600'
                      : 'text-gray-500'
                }`}
              >
                {props.metric.trend === 'up'
                  ? '↑'
                  : props.metric.trend === 'down'
                    ? '↓'
                    : '→'}
                {props.metric.trendPercentage?.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>
      <SparklineWidget {...props} height={40} className='mt-2' />
    </div>
  );
}

// ============================================================
// EXPORT ALL
// ============================================================

export default MetricCardWidget;
