'use client';

import React, { useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { MunicipalCompareData } from '@/lib/comparison/types';

interface MunicipalCompareChartProps {
  data: MunicipalCompareData[];
  locale?: 'en' | 'sr' | 'srLat';
  height?: number;
  referenceMunicipality?: string;
  onMunicipalityClick?: (code: string) => void;
}

/**
 * Municipal Comparison Chart
 * Side-by-side comparison of municipalities
 */
export function MunicipalCompareChart({
  data,
  locale = 'srLat',
  height = 400,
  referenceMunicipality,
  onMunicipalityClick,
}: MunicipalCompareChartProps) {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const labels = {
    en: {
      municipality: 'Municipality',
      value: 'Value',
      rank: 'Rank',
      diff: 'Difference',
    },
    sr: {
      municipality: 'Општина',
      value: 'Вредност',
      rank: 'Ранг',
      diff: 'Разлика',
    },
    srLat: {
      municipality: 'Opština',
      value: 'Vrednost',
      rank: 'Rang',
      diff: 'Razlika',
    },
  };

  const t = labels[locale];
  const sortedData = useMemo(
    () => [...data].sort((a, b) => b.value - a.value),
    [data]
  );

  const chartData = useMemo(
    () => [
      {
        type: 'bar' as const,
        x: sortedData.map((d) => d.municipalityName),
        y: sortedData.map((d) => d.value),
        marker: {
          color: sortedData.map((d) =>
            d.municipalityCode === referenceMunicipality
              ? '#1e40af'
              : d.municipalityCode === selectedCode
                ? '#3b82f6'
                : '#60a5fa'
          ),
        },
        text: sortedData.map((d) => d.value.toLocaleString()),
        textposition: 'outside' as const,
        hoverinfo: 'x+y+text',
      },
    ],
    [sortedData, referenceMunicipality, selectedCode]
  );

  const layout = useMemo(
    () => ({
      margin: { l: 60, r: 20, t: 20, b: 100 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      xaxis: { tickangle: -45, gridcolor: 'rgba(0,0,0,0.1)' },
      yaxis: { gridcolor: 'rgba(0,0,0,0.1)' },
      height,
      showlegend: false,
    }),
    [height]
  );

  const handleClick = (e: { points?: Array<{ pointNumber: number }> }) => {
    if (e.points?.[0] !== undefined) {
      const idx = e.points[0].pointNumber;
      const code = sortedData[idx]?.municipalityCode;
      setSelectedCode(code);
      if (code && onMunicipalityClick) onMunicipalityClick(code);
    }
  };

  return (
    <div className='space-y-4'>
      <Plot
        data={chartData}
        layout={layout}
        config={{ displayModeBar: false, responsive: true }}
        {...({
          onClick: handleClick,
        })}
        className='w-full'
        style={{ height }}
      />

      {/* Data table */}
      <div className='overflow-x-auto max-h-64 overflow-y-auto'>
        <table className='w-full text-sm'>
          <thead className='sticky top-0 bg-white dark:bg-gray-900'>
            <tr className='border-b border-gray-200 dark:border-gray-700'>
              <th className='text-left py-2 px-3'>{t.rank}</th>
              <th className='text-left py-2 px-3'>{t.municipality}</th>
              <th className='text-right py-2 px-3'>{t.value}</th>
              <th className='text-right py-2 px-3'>{t.diff}</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row) => (
              <tr
                key={row.municipalityCode}
                onClick={() => onMunicipalityClick?.(row.municipalityCode)}
                className={`cursor-pointer border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  row.municipalityCode === referenceMunicipality
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : ''
                }`}
              >
                <td className='py-2 px-3'>{row.rank}</td>
                <td className='py-2 px-3 font-medium'>
                  {row.municipalityName}
                </td>
                <td className='py-2 px-3 text-right'>
                  {row.value.toLocaleString()}
                </td>
                <td
                  className={`py-2 px-3 text-right ${
                    (row.differencePercent || 0) > 0
                      ? 'text-green-600'
                      : (row.differencePercent || 0) < 0
                        ? 'text-red-600'
                        : 'text-gray-500'
                  }`}
                >
                  {row.differencePercent !== undefined
                    ? `${row.differencePercent > 0 ? '+' : ''}${row.differencePercent.toFixed(1)}%`
                    : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MunicipalCompareChart;
