'use client';

import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { YearOverYearData } from '@/lib/comparison/types';

interface YearOverYearChartProps {
  data: YearOverYearData[];
  baseYear: number;
  compareYear: number;
  locale?: 'en' | 'sr' | 'srLat';
  height?: number;
  showCAGR?: boolean;
}

/**
 * Year-over-Year Comparison Chart
 * Displays changes between two years for multiple metrics
 */
export function YearOverYearChart({
  data,
  baseYear,
  compareYear,
  locale = 'srLat',
  height = 400,
  showCAGR = true,
}: YearOverYearChartProps) {
  const labels = {
    en: {
      metric: 'Metric',
      change: 'Change',
      baseValue: `${baseYear} Value`,
      compareValue: `${compareYear} Value`,
      percentChange: '% Change',
      cagr: 'CAGR',
    },
    sr: {
      metric: 'Метрика',
      change: 'Промена',
      baseValue: `${baseYear} Вредност`,
      compareValue: `${compareYear} Вредност`,
      percentChange: '% Промена',
      cagr: 'CAGR',
    },
    srLat: {
      metric: 'Metrika',
      change: 'Promena',
      baseValue: `${baseYear} Vrednost`,
      compareValue: `${compareYear} Vrednost`,
      percentChange: '% Promena',
      cagr: 'CAGR',
    },
  };

  const t = labels[locale];

  const chartData = useMemo(() => {
    const metrics = data.map((d) => d.metric);

    // Create grouped bar chart
    return [
      {
        type: 'bar' as const,
        name: t.baseValue,
        x: metrics,
        y: data.map((d) => d.baseValue),
        marker: { color: '#3b82f6' },
      },
      {
        type: 'bar' as const,
        name: t.compareValue,
        x: metrics,
        y: data.map((d) => d.compareValue),
        marker: { color: '#10b981' },
      },
    ];
  }, [data, t]);

  const layout = useMemo(
    () => ({
      barmode: 'group' as const,
      margin: { l: 60, r: 20, t: 20, b: 80 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      xaxis: {
        tickangle: -45,
        gridcolor: 'rgba(0,0,0,0.1)',
      },
      yaxis: {
        gridcolor: 'rgba(0,0,0,0.1)',
      },
      height,
      showlegend: true,
      legend: { x: 0, y: 1.1, orientation: 'h' as const },
    }),
    [height]
  );

  return (
    <div className='space-y-4'>
      <Plot
        data={chartData}
        layout={layout}
        config={{ displayModeBar: false, responsive: true }}
        className='w-full'
        style={{ height }}
      />

      {/* Change summary table */}
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-gray-200 dark:border-gray-700'>
              <th className='text-left py-2 px-3'>{t.metric}</th>
              <th className='text-right py-2 px-3'>{t.baseValue}</th>
              <th className='text-right py-2 px-3'>{t.compareValue}</th>
              <th className='text-right py-2 px-3'>{t.percentChange}</th>
              {showCAGR && <th className='text-right py-2 px-3'>{t.cagr}</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-gray-100 dark:border-gray-800 ${
                  row.percentChange > 0
                    ? 'bg-green-50 dark:bg-green-900/10'
                    : row.percentChange < 0
                      ? 'bg-red-50 dark:bg-red-900/10'
                      : ''
                }`}
              >
                <td className='py-2 px-3 font-medium'>{row.metric}</td>
                <td className='py-2 px-3 text-right'>
                  {row.baseValue.toLocaleString()}
                </td>
                <td className='py-2 px-3 text-right'>
                  {row.compareValue.toLocaleString()}
                </td>
                <td
                  className={`py-2 px-3 text-right font-medium ${
                    row.percentChange > 0
                      ? 'text-green-600'
                      : row.percentChange < 0
                        ? 'text-red-600'
                        : 'text-gray-500'
                  }`}
                >
                  {row.percentChange > 0 ? '+' : ''}
                  {row.percentChange.toFixed(1)}%
                </td>
                {showCAGR && (
                  <td className='py-2 px-3 text-right'>
                    {row.cagr !== undefined ? `${row.cagr.toFixed(2)}%` : '-'}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface YearOverYearSparklineProps {
  historicalData: Array<{ year: number; value: number }>;
  metric: string;
  locale?: 'en' | 'sr' | 'srLat';
}

/**
 * Sparkline showing historical trend
 */
export function YearOverYearSparkline({
  historicalData,
  metric,
  locale: _locale = 'srLat',
}: YearOverYearSparklineProps) {
  const data = useMemo(
    () => [
      {
        type: 'scatter',
        mode: 'lines+markers',
        x: historicalData.map((d) => d.year),
        y: historicalData.map((d) => d.value),
        line: { color: '#3b82f6', width: 2 },
        marker: { size: 6 },
        hoverinfo: 'x+y',
      },
    ],
    [historicalData]
  );

  const layout = useMemo(
    () => ({
      margin: { l: 30, r: 10, t: 10, b: 30 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      xaxis: { visible: false },
      yaxis: { visible: false },
      height: 60,
      showlegend: false,
    }),
    []
  );

  return (
    <div className='flex items-center gap-2'>
      <span className='text-xs text-gray-500 w-24 truncate'>{metric}</span>
      <Plot
        data={data as any[]}
        layout={layout}
        config={{ displayModeBar: false }}
        style={{ width: 100, height: 60 }}
      />
    </div>
  );
}

export default YearOverYearChart;
