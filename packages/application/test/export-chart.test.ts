import { describe, expect, it, vi } from 'vitest'

import { exportChart } from '../src'

describe('exportChart', () => {
  it('creates CSV exports with inferred headers', async () => {
    const csvBlob = new Blob(['csv'])

    const result = await exportChart(
      {
        format: 'csv',
        title: 'Pregled',
        data: [{ opstina: 'Zemun', broj: 12 }],
      },
      {
        createFilename: (title, extension) => `${title}.${extension}`,
        createPngBlob: vi.fn(),
        createSvgBlob: vi.fn(),
        createCsvBlob: vi.fn().mockReturnValue(csvBlob),
        createExcelBlob: vi.fn(),
      }
    )

    expect(result.filename).toBe('Pregled.csv')
    expect(result.blob).toBe(csvBlob)
  })

  it('requires a chart element for PNG export', async () => {
    await expect(
      exportChart(
        {
          format: 'png',
          title: 'Pregled',
          data: [],
        },
        {
          createFilename: (title, extension) => `${title}.${extension}`,
          createPngBlob: vi.fn(),
          createSvgBlob: vi.fn(),
          createCsvBlob: vi.fn(),
          createExcelBlob: vi.fn(),
        }
      )
    ).rejects.toThrow('Chart element is required for PNG export')
  })

  it('creates SVG exports with inferred filename', async () => {
    const svgBlob = new Blob(['svg'])

    const result = await exportChart(
      {
        format: 'svg',
        title: 'Pregled',
        data: [{ opstina: 'Zemun', broj: 12 }],
        chartElement: {} as HTMLElement,
      },
      {
        createFilename: (title, extension) => `${title}.${extension}`,
        createPngBlob: vi.fn(),
        createSvgBlob: vi.fn().mockResolvedValue(svgBlob),
        createCsvBlob: vi.fn(),
        createExcelBlob: vi.fn(),
      }
    )

    expect(result.filename).toBe('Pregled.svg')
    expect(result.blob).toBe(svgBlob)
    expect(result.mimeType).toBe('image/svg+xml')
  })
})
