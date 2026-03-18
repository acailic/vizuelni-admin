'use client';

import { cn } from '@/lib/utils/cn';

interface YearSelectorProps {
  labelA: string;
  labelB: string;
  yearA: number;
  yearB: number;
  years: number[];
  onYearAChange: (year: number) => void;
  onYearBChange: (year: number) => void;
}

export function YearSelector({
  labelA,
  labelB,
  yearA,
  yearB,
  years,
  onYearAChange,
  onYearBChange,
}: YearSelectorProps) {
  return (
    <div className='flex items-center gap-3'>
      <div className='flex flex-col gap-0.5'>
        <label className='text-xs font-medium text-slate-500' htmlFor='year-a'>
          {labelA}
        </label>
        <select
          id='year-a'
          value={yearA}
          onChange={(e) => onYearAChange(Number(e.target.value))}
          className={cn(
            'rounded-lg border border-slate-200 bg-white px-3 py-1.5',
            'text-sm font-semibold text-[#0D4077] shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-[#0D4077]/30'
          )}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <span className='mt-4 text-sm font-medium text-slate-400'>vs</span>

      <div className='flex flex-col gap-0.5'>
        <label className='text-xs font-medium text-slate-500' htmlFor='year-b'>
          {labelB}
        </label>
        <select
          id='year-b'
          value={yearB}
          onChange={(e) => onYearBChange(Number(e.target.value))}
          className={cn(
            'rounded-lg border border-slate-200 bg-white px-3 py-1.5',
            'text-sm font-semibold text-[#C6363C] shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-[#C6363C]/30'
          )}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
