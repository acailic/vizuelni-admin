'use client'

import { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'

interface PdfDownloadButtonProps {
  title: string
  description?: string
  chartImage?: string
  chartType: string
  datasets: string[]
  organization?: string
  license?: string
  locale: string
  labels: {
    downloadPdf: string
    generateReport: string
    exportError: string
  }
}

export function PdfDownloadButton({
  title,
  description,
  chartImage,
  chartType,
  datasets,
  organization,
  license,
  locale,
  labels,
}: PdfDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          chartImage,
          chartType,
          datasets,
          organization,
          license,
          locale,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title.replace(/[^a-zA-Z0-9\u0400-\u04FF\u0100-\u017F\s-]/g, '').replace(/\s+/g, '-')}-report.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('PDF generation error:', err)
      setError(labels.exportError)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="inline-flex items-center gap-2 rounded-lg bg-gov-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gov-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {labels.generateReport}
          </>
        ) : (
          <>
            <FileDown className="h-4 w-4" />
            {labels.downloadPdf}
          </>
        )}
      </button>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
