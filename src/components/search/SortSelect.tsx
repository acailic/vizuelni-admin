'use client'

import { useSearch } from '@/lib/hooks/useSearch'

interface SortOption {
  value: string
  label: string
}

interface SortSelectProps {
  locale: string
  sortLabel: string
  options: SortOption[]
}

export function SortSelect({ locale: _locale, sortLabel, options }: SortSelectProps) {
  const { searchParams, setSearchParams } = useSearch()
  const currentSort = searchParams.get('sort') || 'relevance'

  const handleSortChange = (value: string) => {
    setSearchParams({ sort: value === 'relevance' ? undefined : value }, true)
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm text-slate-600">
        {sortLabel}:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-gov-primary focus:ring-1 focus:ring-gov-primary/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
