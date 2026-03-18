'use client'

import { useState } from 'react'
import { Copy, Check, Code } from 'lucide-react'

interface EmbedCodeGeneratorProps {
  chartId: string
  baseUrl: string
  labels: {
    title: string
    width: string
    height: string
    copyCode: string
    copied: string
    preview: string
  }
}

export function EmbedCodeGenerator({ chartId, baseUrl, labels }: EmbedCodeGeneratorProps) {
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(500)
  const [copied, setCopied] = useState(false)

  const embedUrl = `${baseUrl}/embed/${chartId}`
  const embedCode = `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center gap-2">
        <Code className="h-5 w-5 text-slate-600" />
        <h3 className="font-semibold text-slate-900">{labels.title}</h3>
      </div>

      {/* Size inputs */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">{labels.width}</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value) || 400)}
            min={200}
            max={2000}
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">{labels.height}</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value) || 300)}
            min={200}
            max={2000}
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Code preview */}
      <div className="relative mb-4">
        <pre className="overflow-x-auto rounded bg-slate-100 p-3 text-xs text-slate-700">
          {embedCode}
        </pre>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            {labels.copied}
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            {labels.copyCode}
          </>
        )}
      </button>
    </div>
  )
}
