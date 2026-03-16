import type { ObservationValue } from '../types/observation'

const cyrillicToLatin: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  ђ: 'đ',
  е: 'e',
  ж: 'ž',
  з: 'z',
  и: 'i',
  ј: 'j',
  к: 'k',
  л: 'l',
  љ: 'lj',
  м: 'm',
  н: 'n',
  њ: 'nj',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  ћ: 'ć',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'c',
  ч: 'č',
  џ: 'dž',
  ш: 'š',
}

export function normalizeJoinValue(value: ObservationValue | undefined): string {
  if (value === null || value === undefined) {
    return ''
  }

  const input = String(value).toLowerCase().trim()
  let normalized = ''

  for (const char of input) {
    normalized += cyrillicToLatin[char] ?? char
  }

  normalized = normalized.replace(/\s*\([^)]*\)/g, '')
  normalized = normalized.replace(/\s+/g, ' ').trim()

  return normalized
}
