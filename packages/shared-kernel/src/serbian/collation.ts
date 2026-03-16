import type { ObservationValue } from '../types/observation'

export function compareSerbianText(left: string, right: string): number {
  return left.localeCompare(right, 'sr')
}

export function compareObservationValues(
  left: ObservationValue,
  right: ObservationValue
): number {
  if (left == null && right == null) {
    return 0
  }

  if (left == null) {
    return 1
  }

  if (right == null) {
    return -1
  }

  if (left instanceof Date && right instanceof Date) {
    return left.getTime() - right.getTime()
  }

  if (typeof left === 'number' && typeof right === 'number') {
    return left - right
  }

  return compareSerbianText(String(left), String(right))
}
