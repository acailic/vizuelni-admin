'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface KPICardProps {
  label: string;
  value: number;
  previousValue: number;
  unit: string;
  currentYear: number;
  previousYear: number;
}

function defaultFormat(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toLocaleString('en', { maximumFractionDigits: 1 });
}

export function KPICard({ label, value, previousValue, unit, currentYear, previousYear }: KPICardProps) {
  const delta =
    previousValue !== 0 ? ((value - previousValue) / previousValue) * 100 : 0;
  const isUp = delta > 0.05;
  const isDown = delta < -0.05;

  return (
    <div className='flex flex-col gap-1 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm'>
      <span className='text-xs font-medium uppercase tracking-wider text-slate-500'>
        {label}
      </span>
      <span className='text-2xl font-bold tabular-nums text-slate-900'>
        {defaultFormat(value)}
        <span className='ml-1 text-sm font-normal text-slate-500'>{unit}</span>
      </span>
      <div
        className={cn(
          'flex items-center gap-1 text-xs font-medium',
          isUp ? 'text-emerald-600' : isDown ? 'text-red-600' : 'text-slate-500'
        )}
        aria-label={`Change: ${delta >= 0 ? '+' : ''}${delta.toFixed(1)}% (${currentYear} vs ${previousYear})`}
      >
        {isUp ? (
          <TrendingUp className='h-3.5 w-3.5' aria-hidden='true' />
        ) : isDown ? (
          <TrendingDown className='h-3.5 w-3.5' aria-hidden='true' />
        ) : (
          <Minus className='h-3.5 w-3.5' aria-hidden='true' />
        )}
        <span>
          {delta >= 0 ? '+' : ''}
          {delta.toFixed(1)}% {currentYear} vs {previousYear}
        </span>
        <span className='sr-only'>
          {isUp ? 'increasing' : isDown ? 'decreasing' : 'stable'}
        </span>
      </div>
    </div>
  );
}
