'use client'

import { Search, Filter, ArrowUpDown } from 'lucide-react'

export type SortOption = 'newest' | 'mostViewed'
export type ChartTypeFilter = 'all' | 'line' | 'bar' | 'column' | 'area' | 'pie' | 'scatterplot' | 'combo' | 'table'

interface GalleryFilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  chartType: ChartTypeFilter
  onChartTypeChange: (value: ChartTypeFilter) => void
  sort: SortOption
  onSortChange: (value: SortOption) => void
  labels: {
    searchPlaceholder: string
    allTypes: string
    filterByType: string
    sortBy: string
    newest: string
    mostViewed: string
    chartTypes: {
      line: string
      bar: string
      column: string
      area: string
      pie: string
      scatterplot: string
      combo: string
      table: string
    }
  }
}

export function GalleryFilterBar({
  search,
  onSearchChange,
  chartType,
  onChartTypeChange,
  sort,
  onSortChange,
  labels,
}: GalleryFilterBarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3">
        {/* Chart Type Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={chartType}
            onChange={(e) => onChartTypeChange(e.target.value as ChartTypeFilter)}
            className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-8 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">{labels.allTypes}</option>
            <option value="line">{labels.chartTypes.line}</option>
            <option value="bar">{labels.chartTypes.bar}</option>
            <option value="column">{labels.chartTypes.column}</option>
            <option value="area">{labels.chartTypes.area}</option>
            <option value="pie">{labels.chartTypes.pie}</option>
            <option value="scatterplot">{labels.chartTypes.scatterplot}</option>
            <option value="combo">{labels.chartTypes.combo}</option>
            <option value="table">{labels.chartTypes.table}</option>
          </select>
        </div>

        {/* Sort */}
        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-8 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="newest">{labels.newest}</option>
            <option value="mostViewed">{labels.mostViewed}</option>
          </select>
        </div>
      </div>
    </div>
  )
}
