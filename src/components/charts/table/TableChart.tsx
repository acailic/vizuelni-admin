'use client'

import { useCallback, useMemo, useState } from 'react'

import { getTableColumns } from '@/components/charts/shared/chart-data'
import { formatChartValue } from '@/components/charts/shared/chart-formatters'
import { ChartFrame } from '@/components/charts/shared/ChartFrame'
import type { ChartRendererComponentProps } from '@/types'
import type { SortDirection } from '@/types/table-chart'
import { getMessages, resolveLocale } from '@/lib/i18n/messages'

export function TableChart({
  config,
  data,
  height = 400,
  locale,
  filterBar,
  previewMode = false,
}: ChartRendererComponentProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [currentPage, setCurrentPage] = useState(0)

  const columns = getTableColumns(data, config)
  const pageSize = config.options?.pageSize ?? 10
  const localeMessages = getMessages(resolveLocale(locale))

  const handleSort = useCallback(
    (column: string) => {
      if (sortColumn === column) {
        if (sortDirection === 'asc') {
          setSortDirection('desc')
        } else if (sortDirection === 'desc') {
          setSortColumn(null)
          setSortDirection(null)
        }
      } else {
        setSortColumn(column)
        setSortDirection('asc')
      }
      setCurrentPage(0)
    },
    [sortColumn, sortDirection]
  )

  const sortedRows = useMemo(() => {
    if (!sortColumn || !sortDirection) return data

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]

      if (aVal == null && bVal == null) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1

      let comparison = 0
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal
      } else {
        comparison = String(aVal).localeCompare(String(bVal), locale)
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [data, sortColumn, sortDirection, locale])

  const paginatedRows = useMemo(() => {
    return sortedRows.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
  }, [sortedRows, currentPage, pageSize])

  const totalPages = Math.ceil(sortedRows.length / pageSize)

  if (!data.length || !columns.length) {
    return (
      <ChartFrame
        title={config.title}
        description={config.description}
        filterBar={filterBar}
        height={height}
        emptyMessage="No rows available for this table."
        previewMode={previewMode}
      />
    )
  }

  return (
    <ChartFrame
      title={config.title}
      description={config.description}
      filterBar={filterBar}
      height={height}
      previewMode={previewMode}
    >
      <div className="h-full overflow-auto rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-4 py-3 font-medium text-slate-700"
                  aria-sort={sortColumn === column ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <button
                    type="button"
                    onClick={() => handleSort(column)}
                    className="flex w-full items-center gap-2 rounded-md px-0 text-left hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-primary focus:ring-offset-2"
                    aria-label={`${column} ${sortColumn === column && sortDirection === 'asc' ? localeMessages.common.next : localeMessages.common.previous}`}
                  >
                    <span>{column}</span>
                    {sortColumn === column && (
                      <span className="text-gov-primary" aria-hidden="true">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {paginatedRows.map((row, index) => (
              <tr key={`${config.title}-${index}`} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column} className="px-4 py-3 text-slate-600">
                    {formatChartValue(row[column], locale)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, sortedRows.length)}{' '}
              of {sortedRows.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                aria-label={localeMessages.common.previous}
                className="px-3 py-1 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                {localeMessages.common.previous}
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage >= totalPages - 1}
                aria-label={localeMessages.common.next}
                className="px-3 py-1 text-sm border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                {localeMessages.common.next}
              </button>
            </div>
          </div>
        )}
      </div>
    </ChartFrame>
  )
}
