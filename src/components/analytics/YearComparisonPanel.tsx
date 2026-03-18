'use client';

import { useMemo } from 'react';
import { PlotlyWrapper } from '@/components/charts/shared/PlotlyWrapper';
import type { YearDataset } from '@/lib/analytics/types';
import type { Locale } from '@/lib/i18n/config';

interface YearComparisonPanelProps {
  datasetA: YearDataset;
  datasetB: YearDataset;
  metricLabel: string;
  unit: string;
  locale: Locale;
  title: string;
}

function getLocalizedName(
  point: YearDataset['points'][0],
  locale: Locale
): string {
  if (locale === 'sr-Cyrl') return point.nameCyrl;
  if (locale === 'sr-Latn') return point.nameLatn;
  return point.name;
}

export function YearComparisonPanel({
  datasetA,
  datasetB,
  metricLabel,
  unit,
  locale,
  title,
}: YearComparisonPanelProps) {
  const { plotData, layout } = useMemo(() => {
    // Sort by yearB value descending, show top 15
    const sorted = [...datasetB.points]
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);

    const codes = sorted.map((p) => p.code);
    const names = sorted.map((p) => getLocalizedName(p, locale));

    const aValues = codes.map(
      (code) => datasetA.points.find((p) => p.code === code)?.value ?? 0
    );
    const bValues = sorted.map((p) => p.value);

    const data = [
      {
        type: 'bar' as const,
        name: String(datasetA.year),
        x: names,
        y: aValues,
        marker: { color: '#1a5290' },
        hovertemplate: `%{x}<br>${datasetA.year}: %{y} ${unit}<extra></extra>`,
      },
      {
        type: 'bar' as const,
        name: String(datasetB.year),
        x: names,
        y: bValues,
        marker: { color: '#C6363C' },
        hovertemplate: `%{x}<br>${datasetB.year}: %{y} ${unit}<extra></extra>`,
      },
    ];

    const chartLayout: Record<string, unknown> = {
      barmode: 'group',
      xaxis: {
        tickangle: -40,
        tickfont: { size: 10 },
        automargin: true,
      },
      yaxis: {
        title: { text: `${metricLabel} (${unit})`, font: { size: 11 } },
        gridcolor: '#f1f5f9',
      },
      legend: {
        orientation: 'h',
        y: 1.08,
        x: 0,
        font: { size: 11 },
      },
      margin: { l: 56, r: 16, t: 40, b: 80 },
    };

    return { plotData: data, layout: chartLayout };
  }, [datasetA, datasetB, metricLabel, unit, locale]);

  return (
    <div className='flex h-full flex-col'>
      <h3 className='mb-2 text-sm font-semibold text-slate-700'>{title}</h3>
      <div className='min-h-0 flex-1' style={{ minHeight: 280 }}>
        <PlotlyWrapper
          data={plotData}
          layout={layout}
          ariaLabel={`${title}: grouped bar chart comparing ${datasetA.year} and ${datasetB.year}`}
          className='h-full w-full'
        />
      </div>
    </div>
  );
}
