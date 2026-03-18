'use client';

import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { YearDataset } from '@/lib/analytics/types';
import type { Locale } from '@/lib/i18n/config';

interface MetricRankingTableProps {
  datasetA: YearDataset;
  datasetB: YearDataset;
  unit: string;
  locale: Locale;
  labels: {
    rank: string;
    region: string;
    delta: string;
  };
}

function getLocalizedName(
  point: YearDataset['points'][0],
  locale: Locale
): string {
  if (locale === 'sr-Cyrl') return point.nameCyrl;
  if (locale === 'sr-Latn') return point.nameLatn;
  return point.name;
}

export function MetricRankingTable({
  datasetA,
  datasetB,
  unit,
  locale,
  labels,
}: MetricRankingTableProps) {
  const rows = useMemo(() => {
    return [...datasetB.points]
      .sort((a, b) => b.value - a.value)
      .map((bPt, idx) => {
        const aPt = datasetA.points.find((p) => p.code === bPt.code);
        const aVal = aPt?.value ?? 0;
        const delta = aVal !== 0 ? ((bPt.value - aVal) / aVal) * 100 : 0;
        return {
          rank: idx + 1,
          code: bPt.code,
          name: getLocalizedName(bPt, locale),
          valueA: aVal,
          valueB: bPt.value,
          delta,
        };
      });
  }, [datasetA, datasetB, locale]);

  const fmt = (v: number) =>
    v.toLocaleString('en', { maximumFractionDigits: 1 });

  return (
    <div className='overflow-x-auto rounded-xl border border-slate-200 bg-white'>
      <table
        className='w-full text-sm'
        aria-label='Metric ranking by district'
      >
        <thead>
          <tr className='border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500'>
            <th scope='col' className='w-10 py-3 pl-4 pr-2'>
              {labels.rank}
            </th>
            <th scope='col' className='px-2 py-3'>
              {labels.region}
            </th>
            <th scope='col' className='px-2 py-3 text-right tabular-nums'>
              {datasetA.year}
            </th>
            <th scope='col' className='px-2 py-3 text-right tabular-nums'>
              {datasetB.year}
            </th>
            <th scope='col' className='py-3 pl-2 pr-4 text-right'>
              {labels.delta}
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-slate-50'>
          {rows.map((row) => {
            const isUp = row.delta > 0.05;
            const isDown = row.delta < -0.05;
            return (
              <tr key={row.code} className='transition-colors hover:bg-slate-50'>
                <td className='py-2.5 pl-4 pr-2 text-xs font-medium text-slate-400'>
                  {row.rank}
                </td>
                <td className='px-2 py-2.5 font-medium text-slate-800'>
                  {row.name}
                </td>
                <td className='px-2 py-2.5 text-right tabular-nums text-slate-500'>
                  {fmt(row.valueA)} {unit}
                </td>
                <td className='px-2 py-2.5 text-right tabular-nums font-semibold text-slate-800'>
                  {fmt(row.valueB)} {unit}
                </td>
                <td className='py-2.5 pl-2 pr-4 text-right'>
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 text-xs font-medium',
                      isUp
                        ? 'text-emerald-600'
                        : isDown
                          ? 'text-red-600'
                          : 'text-slate-400'
                    )}
                    aria-label={`${row.delta >= 0 ? '+' : ''}${row.delta.toFixed(1)}%`}
                  >
                    {isUp ? (
                      <TrendingUp className='h-3 w-3' aria-hidden='true' />
                    ) : isDown ? (
                      <TrendingDown className='h-3 w-3' aria-hidden='true' />
                    ) : (
                      <Minus className='h-3 w-3' aria-hidden='true' />
                    )}
                    {row.delta >= 0 ? '+' : ''}
                    {row.delta.toFixed(1)}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className='border-t border-slate-100 px-4 py-2 text-right text-xs text-slate-400'>
        Source: data.gov.rs — RZS curated estimates
      </p>
    </div>
  );
}
