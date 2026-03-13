'use client'

import { forwardRef, type ReactNode } from 'react'

interface ChartFrameProps {
  title: string
  description?: string
  height?: number
  /** Use aspect ratio instead of fixed height for responsive charts */
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto'
  children?: ReactNode
  emptyMessage?: string
  errorMessage?: string
  filterBar?: ReactNode
}

export const ChartFrame = forwardRef<HTMLDivElement, ChartFrameProps>(
  (
    {
      title,
      description,
      height,
      aspectRatio = 'auto',
      children,
      emptyMessage,
      errorMessage,
      filterBar,
    },
    ref
  ) => {
    const content = errorMessage ? (
      <div
        className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 text-center"
        role="alert"
        aria-live="polite"
      >
        <p className="text-sm font-medium text-red-700">{errorMessage}</p>
        <p className="text-xs text-red-600">Покушајте поново учитавајте страницу или проверите податке.</p>
      </div>
    ) : emptyMessage ? (
      <div
        className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm text-slate-600">{emptyMessage}</p>
        <p className="text-xs text-slate-500">Изаберите друге филтере или промените параметре.</p>
      </div>
    ) : (
      children
    )

    // Responsive height: use aspect-ratio on mobile, fixed on desktop
    const containerStyle = aspectRatio !== 'auto' && !height
      ? { aspectRatio: aspectRatio === '16/9' ? '16/9' : aspectRatio === '4/3' ? '4/3' : '1/1' }
      : { height: height ?? '100%' }

    return (
      <section
        ref={ref}
        className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm"
      >
        <header className="mb-4 space-y-1">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {description ? (
            <p className="text-sm leading-6 text-slate-600">{description}</p>
          ) : null}
        </header>
        {filterBar}
        <div style={containerStyle} className="@container">{content}</div>
      </section>
    )
  }
)

ChartFrame.displayName = 'ChartFrame'
