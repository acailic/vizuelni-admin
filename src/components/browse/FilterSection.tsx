'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { FacetOption } from '@/types/browse';

export interface FilterSectionProps {
  title: string;
  options: FacetOption[];
  selectedValue: string | undefined;
  onSelect: (value: string | undefined) => void;
  labels: { showAll: string };
  defaultExpanded?: boolean;
}

export function FilterSection({
  title,
  options,
  selectedValue,
  onSelect,
  labels,
  defaultExpanded = true,
}: FilterSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className='border-b border-gray-100 py-3 last:border-b-0'>
      <button
        type='button'
        className='flex w-full items-center justify-between text-left'
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span className='text-sm font-semibold uppercase tracking-wide text-gray-500'>
          {title}
        </span>
        {expanded ? (
          <ChevronDown className='h-4 w-4 text-gray-400' />
        ) : (
          <ChevronRight className='h-4 w-4 text-gray-400' />
        )}
      </button>

      {expanded && (
        <div className='mt-3 space-y-1'>
          <button
            type='button'
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
              !selectedValue
                ? 'bg-gov-secondary/10 font-medium text-gov-secondary'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => onSelect(undefined)}
          >
            {labels.showAll}
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              type='button'
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                selectedValue === option.value
                  ? 'bg-gov-secondary/10 font-medium text-gov-secondary'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => onSelect(option.value)}
            >
              <span>{option.label}</span>
              {option.count !== undefined && (
                <span className='text-xs text-gray-400'>({option.count})</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
