'use client';

interface ChartTypeBadgeProps {
  label: string;
}

export function ChartTypeBadge({ label }: ChartTypeBadgeProps) {
  return (
    <span className='inline-flex items-center rounded-full bg-gov-primary/10 px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] text-gov-primary'>
      {label}
    </span>
  );
}
