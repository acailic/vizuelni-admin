import Papa from 'papaparse'

import { classifyColumns } from '../domain/classifier'
import { coerceObservationValue } from '../domain/value-coercion'
import type {
  DatasetLoadOptions,
  Observation,
  ParsedDataset,
} from '../types'
import {
  createLoadError,
  decodeResourceBuffer,
  detectResourceFormat,
  stripBom,
} from './detect-format'

const CSV_SAMPLE_BYTE_LIMIT = 2 * 1024 * 1024

function buildColumnNames(headers: string[]) {
  const seen = new Map<string, number>()

  return headers.map((header, index) => {
    const trimmed = header.trim() || `column_${index + 1}`
    const count = seen.get(trimmed) ?? 0
    seen.set(trimmed, count + 1)

    return count === 0 ? trimmed : `${trimmed}_${count + 1}`
  })
}

function normalizeObjectValue(value: unknown) {
  if (value == null) {
    return ''
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

function parseCsvRows(content: string) {
  const parsed = Papa.parse<string[]>(stripBom(content), {
    delimiter: '',
    skipEmptyLines: 'greedy',
  })

  if (parsed.errors.length > 0 && parsed.data.length === 0) {
    throw createLoadError('PARSE_FAILED', parsed.errors[0]?.message || 'Failed to parse CSV')
  }

  const [rawHeaders = [], ...rows] = parsed.data
  const columns = buildColumnNames(rawHeaders)

  return {
    columns,
    rows: rows.map(row =>
      Object.fromEntries(columns.map((column, index) => [column, row[index] ?? '']))
    ),
  }
}

function normalizeJsonRows(parsed: unknown) {
  const items = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object' && Array.isArray((parsed as { data?: unknown }).data)
      ? ((parsed as { data: unknown[] }).data ?? [])
      : [parsed]

  const normalizedRows = items.map(item => {
    if (item == null || typeof item !== 'object' || Array.isArray(item)) {
      return { value: normalizeObjectValue(item) }
    }

    return Object.fromEntries(
      Object.entries(item).map(([key, value]) => [key, normalizeObjectValue(value)])
    )
  })

  const columns = [...new Set(normalizedRows.flatMap(row => Object.keys(row)))]

  return {
    columns,
    rows: normalizedRows.map(row =>
      Object.fromEntries(columns.map(column => [column, row[column] ?? '']))
    ),
  }
}

function parseNdjsonRows(content: string) {
  const rows = stripBom(content)
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => JSON.parse(line) as unknown)

  return normalizeJsonRows(rows)
}

function parseJsonRows(content: string) {
  try {
    const parsed = JSON.parse(stripBom(content)) as unknown
    return normalizeJsonRows(parsed)
  } catch (error) {
    try {
      return parseNdjsonRows(content)
    } catch {
      throw createLoadError('INVALID_JSON', 'Failed to parse JSON resource', error)
    }
  }
}

function coerceRows(
  rows: Array<Record<string, string>>,
  columns: string[],
  rowLimit?: number
): Observation[] {
  const limitedRows = rowLimit ? rows.slice(0, rowLimit) : rows

  return limitedRows.map(row =>
    Object.fromEntries(columns.map(column => [column, coerceObservationValue(row[column] ?? null)]))
  )
}

export function parseDatasetContent(
  content: string,
  options: DatasetLoadOptions = {}
): ParsedDataset {
  const format = detectResourceFormat(options.format, options.resourceUrl, options.contentType)
  const parsed = format === 'csv' ? parseCsvRows(content) : parseJsonRows(content)
  const observations = coerceRows(parsed.rows, parsed.columns, options.rowLimit)
  const classification = classifyColumns(observations, parsed.columns)

  return {
    observations,
    dimensions: classification.dimensions,
    measures: classification.measures,
    metadataColumns: classification.metadataColumns,
    columns: parsed.columns,
    rowCount: observations.length,
    source: {
      datasetId: options.datasetId,
      resourceId: options.resourceId,
      resourceUrl: options.resourceUrl,
      format,
      fetchedAt: new Date().toISOString(),
    },
  }
}

export async function loadDatasetFromUrl(
  resourceUrl: string,
  options: DatasetLoadOptions = {}
): Promise<ParsedDataset> {
  const controller = new AbortController()
  const timeoutMs = options.timeoutMs ?? 30000
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  const fetchInit = {
    ...options.fetchInit,
    ...(options.rowLimit && !options.fetchInit?.cache ? { cache: 'no-store' as const } : {}),
  }

  try {
    const response = await fetch(resourceUrl, {
      ...fetchInit,
      headers: {
        Accept: '*/*',
        ...(fetchInit.headers ?? {}),
      },
      signal: fetchInit.signal ?? controller.signal,
    })

    if (!response.ok) {
      throw createLoadError('FETCH_FAILED', `Failed to fetch resource: ${response.status}`)
    }

    const contentType = response.headers.get('content-type') ?? undefined
    const format = detectResourceFormat(options.format, resourceUrl, contentType)

    let content: string
    if (format === 'csv' && options.rowLimit && response.body) {
      const reader = response.body.getReader()
      const chunks: Uint8Array[] = []
      let totalBytes = 0
      let newlineCount = 0

      while (totalBytes < CSV_SAMPLE_BYTE_LIMIT && newlineCount < options.rowLimit + 1) {
        const { value, done } = await reader.read()
        if (done || !value) {
          break
        }

        chunks.push(value)
        totalBytes += value.byteLength

        for (const byte of value) {
          if (byte === 0x0a) {
            newlineCount += 1
          }
        }
      }

      await reader.cancel()

      const sampleBuffer = new Uint8Array(totalBytes)
      let offset = 0
      for (const chunk of chunks) {
        sampleBuffer.set(chunk, offset)
        offset += chunk.byteLength
      }

      content = decodeResourceBuffer(sampleBuffer.buffer, options.encoding)

      const lastLineBreak = Math.max(content.lastIndexOf('\n'), content.lastIndexOf('\r'))
      if (lastLineBreak > 0 && lastLineBreak < content.length - 1) {
        content = content.slice(0, lastLineBreak)
      }
    } else {
      const buffer = await response.arrayBuffer()
      content = decodeResourceBuffer(buffer, options.encoding)
    }

    return parseDatasetContent(content, {
      ...options,
      resourceUrl,
      contentType,
    })
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw createLoadError('FETCH_FAILED', 'Resource request timed out', error)
    }

    if ((error as { code?: string }).code) {
      throw error
    }

    throw createLoadError('FETCH_FAILED', 'Failed to fetch resource data', error)
  } finally {
    clearTimeout(timeout)
  }
}
