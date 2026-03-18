'use client';

import { cn } from '@/lib/utils/cn';
import type { DomainId } from '@/lib/analytics/types';

interface DomainTabsProps {
  active: DomainId;
  labels: Record<DomainId, string>;
  onChange: (id: DomainId) => void;
}

const DOMAIN_ORDER: DomainId[] = [
  'demographics',
  'economy',
  'education',
  'health',
];

export function DomainTabs({ active, labels, onChange }: DomainTabsProps) {
  return (
    <div
      role='tablist'
      aria-label='Analytics domain'
      className='flex gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1'
    >
      {DOMAIN_ORDER.map((id) => (
        <button
          key={id}
          role='tab'
          aria-selected={active === id}
          onClick={() => onChange(id)}
          className={cn(
            'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all',
            active === id
              ? 'bg-white text-[#0D4077] shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          )}
        >
          {labels[id]}
        </button>
      ))}
    </div>
  );
}
