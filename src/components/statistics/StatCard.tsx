import type { ReactNode } from 'react';

export interface StatCardProps {
  value: number | string;
  label: string;
  subtitle?: string;
  icon?: ReactNode;
}

export function StatCard({ value, label, subtitle, icon }: StatCardProps) {
  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
      <div className='flex items-start justify-between'>
        <div>
          <p className='text-3xl font-bold text-[#0C1E42]'>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          <p className='mt-1 text-sm font-medium text-gray-600'>{label}</p>
          {subtitle && <p className='mt-1 text-xs text-gray-400'>{subtitle}</p>}
        </div>
        {icon && (
          <div className='rounded-full bg-gov-secondary/10 p-2 text-gov-secondary'>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
