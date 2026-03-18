'use client'

import { useMemo, useState } from 'react'

import type { QualityReport } from '@/lib/charts/quality-check'

interface QualityIndicatorProps {
  report: QualityReport
  labels?: {
    title?: string
    showDetails?: string
    hideDetails?: string
    score?: string
  }
}

const gradeClasses: Record<QualityReport['grade'], string> = {
  A: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  B: 'bg-blue-100 text-blue-800 border-blue-200',
  C: 'bg-amber-100 text-amber-800 border-amber-200',
  D: 'bg-orange-100 text-orange-800 border-orange-200',
  F: 'bg-rose-100 text-rose-800 border-rose-200',
}

export function QualityIndicator({
  report,
  labels,
}: QualityIndicatorProps) {
  const [expanded, setExpanded] = useState(false)
  const mergedLabels = {
    title: 'Chart quality',
    showDetails: 'Show details',
    hideDetails: 'Hide details',
    score: 'Score',
    ...labels,
  }

  const passedCount = useMemo(
    () => report.checks.filter(check => check.passed).length,
    [report.checks]
  )

  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <p className='text-sm font-semibold text-slate-900'>{mergedLabels.title}</p>
          <p className='mt-1 text-xs text-slate-500'>
            {mergedLabels.score}: {report.overallScore}/100 · {passedCount}/{report.checks.length}{' '}
            checks passed
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${gradeClasses[report.grade]}`}
          >
            {report.grade}
          </span>
          <button
            type='button'
            onClick={() => setExpanded(value => !value)}
            className='rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50'
          >
            {expanded ? mergedLabels.hideDetails : mergedLabels.showDetails}
          </button>
        </div>
      </div>

      {expanded ? (
        <div className='mt-4 space-y-3'>
          {report.checks.map(check => (
            <div key={check.id} className='rounded-xl bg-slate-50 p-3'>
              <div className='flex items-center justify-between gap-3'>
                <p className='text-sm font-semibold text-slate-900'>{check.title}</p>
                <span className='text-xs font-medium text-slate-500'>
                  {check.score}/{check.maxScore}
                </span>
              </div>
              <p className='mt-1 text-sm text-slate-600'>{check.message}</p>
              {check.suggestion ? (
                <p className='mt-1 text-xs text-slate-500'>{check.suggestion}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
