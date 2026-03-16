export type ChartExportFormat = 'png' | 'csv' | 'excel'

export interface ExportChartPngOptions {
  title: string
  scale?: number
  backgroundColor?: string
  source?: string
}

export interface ExportChartCsvOptions {
  title: string
  headers?: string[]
  delimiter?: string
  includeBOM?: boolean
}

export interface ExportChartExcelOptions {
  title: string
  headers: string[]
  source?: string
  filters?: string
}

export interface ExportChartInput {
  format: ChartExportFormat
  title: string
  data: Record<string, unknown>[]
  headers?: string[]
  source?: string
  pngSource?: string
  filtersApplied?: string
  chartElement?: HTMLElement | null
}

export interface ExportChartResult {
  blob: Blob
  filename: string
  extension: 'png' | 'csv' | 'xlsx'
  mimeType: string
}

export interface ExportChartDependencies {
  createFilename: (title: string, extension: string) => string
  createPngBlob: (
    element: HTMLElement,
    options: ExportChartPngOptions
  ) => Promise<Blob>
  createCsvBlob: (
    data: Record<string, unknown>[],
    options: ExportChartCsvOptions
  ) => Blob
  createExcelBlob: (
    data: Record<string, unknown>[],
    options: ExportChartExcelOptions
  ) => Promise<Blob>
}

function resolveHeaders(data: Record<string, unknown>[], headers?: string[]) {
  if (headers && headers.length > 0) {
    return headers
  }

  return data[0] ? Object.keys(data[0]) : []
}

export async function exportChart(
  input: ExportChartInput,
  dependencies: ExportChartDependencies
): Promise<ExportChartResult> {
  const headers = resolveHeaders(input.data, input.headers)

  switch (input.format) {
    case 'png': {
      if (!input.chartElement) {
        throw new Error('Chart element is required for PNG export')
      }

      const blob = await dependencies.createPngBlob(input.chartElement, {
        title: input.title,
        scale: 2,
        backgroundColor: '#ffffff',
        source: input.pngSource ?? input.source,
      })

      return {
        blob,
        filename: dependencies.createFilename(input.title, 'png'),
        extension: 'png',
        mimeType: 'image/png',
      }
    }

    case 'csv': {
      const blob = dependencies.createCsvBlob(input.data, {
        title: input.title,
        headers,
        delimiter: ';',
        includeBOM: true,
      })

      return {
        blob,
        filename: dependencies.createFilename(input.title, 'csv'),
        extension: 'csv',
        mimeType: 'text/csv;charset=utf-8',
      }
    }

    case 'excel': {
      const blob = await dependencies.createExcelBlob(input.data, {
        title: input.title,
        headers,
        source: input.source,
        filters: input.filtersApplied,
      })

      return {
        blob,
        filename: dependencies.createFilename(input.title, 'xlsx'),
        extension: 'xlsx',
        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }
    }
  }
}
