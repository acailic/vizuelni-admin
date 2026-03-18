'use client'

import { useEffect, useRef, useState } from 'react'

interface PlotlyLike {
  react: (
    element: HTMLDivElement,
    data: unknown[],
    layout?: Record<string, unknown>,
    config?: Record<string, unknown>
  ) => Promise<unknown>
  purge: (element: HTMLDivElement) => void
  Plots?: {
    resize?: (element: HTMLDivElement) => void
  }
}

interface PlotlyWrapperProps {
  data: unknown[]
  layout?: Record<string, unknown>
  config?: Record<string, unknown>
  ariaLabel: string
  className?: string
}

let plotlyPromise: Promise<PlotlyLike> | null = null

function loadPlotly() {
  if (!plotlyPromise) {
    plotlyPromise = import('plotly.js-dist-min').then((module) => {
      const plotlyModule = (module.default ?? module) as unknown
      return plotlyModule as PlotlyLike
    })
  }

  return plotlyPromise
}

export function PlotlyWrapper({
  data,
  layout,
  config,
  ariaLabel,
  className = '',
}: PlotlyWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    let plotly: PlotlyLike | null = null
    const element = containerRef.current

    const render = async () => {
      if (!element) return

      try {
        plotly = await loadPlotly()

        if (!active || !element) {
          return
        }

        await plotly.react(
          element,
          data,
          {
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: {
              family: 'var(--font-family-body)',
              color: '#334155',
            },
            margin: {
              l: 48,
              r: 24,
              t: 36,
              b: 48,
            },
            ...layout,
          },
          {
            displayModeBar: false,
            responsive: true,
            ...config,
          }
        )

        element.setAttribute('role', 'img')
        element.setAttribute('aria-label', ariaLabel)
        setError(null)
      } catch (nextError) {
        setError(
          nextError instanceof Error
            ? nextError.message
            : 'Failed to render Plotly chart.'
        )
      }
    }

    void render()

    const handleResize = () => {
      if (element) {
        plotly?.Plots?.resize?.(element)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      active = false
      window.removeEventListener('resize', handleResize)
      if (plotly && element) {
        plotly.purge(element)
      }
    }
  }, [ariaLabel, config, data, layout])

  if (error) {
    return (
      <div className='flex h-full items-center justify-center rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
        {error}
      </div>
    )
  }

  return <div ref={containerRef} className={`h-full w-full ${className}`} />
}
