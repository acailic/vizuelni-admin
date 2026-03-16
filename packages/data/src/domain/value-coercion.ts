import type { ObservationValue } from '../types'

export function parseNumberValue(value: string): number | null {
  const normalized = value
    .replace(/\u00A0/g, ' ')
    .trim()
    .replace(/[%€$]/g, '')
    .replace(/\b(RSD|EUR|USD|DIN)\b/gi, '')
    .replace(/\s+/g, '')

  if (!normalized) {
    return null
  }

  if (/^-?\d{1,3}(\.\d{3})+,\d+$/.test(normalized)) {
    return Number.parseFloat(normalized.replace(/\./g, '').replace(',', '.'))
  }

  if (/^-?\d+,\d+$/.test(normalized)) {
    return Number.parseFloat(normalized.replace(',', '.'))
  }

  if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(normalized)) {
    return Number.parseFloat(normalized.replace(/,/g, ''))
  }

  if (/^-?\d+(\.\d+)?$/.test(normalized)) {
    return Number.parseFloat(normalized)
  }

  return null
}

export function parseDateValue(value: string): Date | null {
  const trimmed = value.trim()

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const date = new Date(trimmed)
    return Number.isNaN(date.getTime()) ? null : date
  }

  const localDateMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/)
  if (localDateMatch) {
    const [, day, month, year] = localDateMatch
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
  }

  const monthYearMatch = trimmed.match(/^(\d{1,2})\/(\d{4})$/)
  if (monthYearMatch) {
    const [, month, year] = monthYearMatch
    return new Date(Date.UTC(Number(year), Number(month) - 1, 1))
  }

  const yearMatch = trimmed.match(/^\d{4}$/)
  if (yearMatch) {
    return new Date(Date.UTC(Number(trimmed), 0, 1))
  }

  return null
}

export function coerceObservationValue(value: unknown): ObservationValue {
  if (value == null) {
    return null
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (value instanceof Date) {
    return value
  }

  if (typeof value !== 'string') {
    return String(value)
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  const numeric = parseNumberValue(trimmed)
  if (numeric !== null) {
    return numeric
  }

  const date = parseDateValue(trimmed)
  if (date) {
    return date
  }

  return trimmed
}
