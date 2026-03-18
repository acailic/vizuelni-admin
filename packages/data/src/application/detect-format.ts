import { TextDecoder as NodeTextDecoder } from 'util'

import type { DatasetLoadError } from '../types'

const SUPPORTED_FORMATS = new Set(['csv', 'json', 'ndjson'])
const SafeTextDecoder = globalThis.TextDecoder ?? NodeTextDecoder

export function createLoadError(
  code: DatasetLoadError['code'],
  message: string,
  cause?: unknown
): DatasetLoadError {
  const error = new Error(message) as DatasetLoadError
  error.code = code
  error.cause = cause
  return error
}

function supportsEncoding(encoding: string) {
  try {
    new SafeTextDecoder(encoding)
    return true
  } catch {
    return false
  }
}

export function stripBom(content: string) {
  return content.replace(/^\uFEFF/, '')
}

export function detectResourceFormat(
  format?: string,
  resourceUrl?: string,
  contentType?: string | null
) {
  const normalizedFormat = format?.trim().toLowerCase()
  if (normalizedFormat && SUPPORTED_FORMATS.has(normalizedFormat)) {
    return normalizedFormat
  }

  const normalizedContentType = contentType?.toLowerCase() ?? ''
  if (normalizedContentType.includes('application/json')) {
    return 'json'
  }

  if (normalizedContentType.includes('ndjson')) {
    return 'ndjson'
  }

  if (normalizedContentType.includes('csv') || normalizedContentType.includes('text/plain')) {
    return 'csv'
  }

  const pathname = resourceUrl ? new URL(resourceUrl).pathname.toLowerCase() : ''

  if (pathname.endsWith('.json')) {
    return 'json'
  }

  if (pathname.endsWith('.ndjson')) {
    return 'ndjson'
  }

  if (pathname.endsWith('.csv') || pathname.endsWith('.tsv') || pathname.endsWith('.txt')) {
    return 'csv'
  }

  throw createLoadError('UNSUPPORTED_FORMAT', 'Unsupported resource format')
}

export function decodeResourceBuffer(buffer: ArrayBuffer, encoding?: string) {
  const bytes = new Uint8Array(buffer)

  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return stripBom(new SafeTextDecoder('utf-8').decode(bytes))
  }

  if (encoding) {
    if (!supportsEncoding(encoding)) {
      throw createLoadError('UNKNOWN_ENCODING', `Unsupported encoding: ${encoding}`)
    }

    return stripBom(new SafeTextDecoder(encoding).decode(bytes))
  }

  const utf8 = stripBom(new SafeTextDecoder('utf-8').decode(bytes))

  if (utf8.includes('\uFFFD') && supportsEncoding('windows-1250')) {
    return stripBom(new SafeTextDecoder('windows-1250').decode(bytes))
  }

  return utf8
}
