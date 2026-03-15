'use client'

import { X } from 'lucide-react'
import { useSearch } from '@/lib/hooks/useSearch'

interface FilterPill {
  key: string
  value: string
  label: string
}

interface FilterPillsProps {
  locale: string
  clearAllLabel: string
  organizationLabel: string
  topicLabel: string
  formatLabel: string
  frequencyLabel: string
}

const _keyLabels: Record<string, string> = {}

export function FilterPills({
  locale: _locale,
  clearAllLabel,
  organizationLabel,
  topicLabel,
  formatLabel,
  frequencyLabel,
}: FilterPillsProps) {
  const { searchParams, setSearchParams } = useSearch()

  const keyToLabel: Record<string, string> = {
    organization: organizationLabel,
    topic: topicLabel,
    format: formatLabel,
    frequency: frequencyLabel,
  }

  const activeFilters: FilterPill[] = []
  searchParams.forEach((value, key) => {
    if (['organization', 'topic', 'format', 'frequency'].includes(key)) {
      activeFilters.push({
        key,
        value,
        label: `${keyToLabel[key] || key}: ${value}`,
      })
    }
  })

  if (activeFilters.length === 0) {
    return null
  }

  const removeFilter = (key: string) => {
    setSearchParams({ [key]: undefined }, true)
  }

  const clearAll = () => {
    setSearchParams(
      {
        organization: undefined,
        topic: undefined,
        format: undefined,
        frequency: undefined,
      },
      true
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeFilters.map((filter) => (
        <span
          key={`${filter.key}-${filter.value}`}
          className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
        >
          {filter.label}
          <button
            onClick={() => removeFilter(filter.key)}
            className="ml-1 rounded-full p-0.5 hover:bg-slate-200"
            aria-label={`Remove ${filter.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      {activeFilters.length > 1 && (
        <button
          onClick={clearAll}
          className="text-sm text-gov-primary hover:underline"
        >
          {clearAllLabel}
        </button>
      )}
    </div>
  )
}
