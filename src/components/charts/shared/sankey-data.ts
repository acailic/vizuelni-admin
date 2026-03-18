import { toNumericValue } from '@/components/charts/shared/chart-data'
import type { ChartConfig, ChartRendererDataRow } from '@/types'

export interface SankeyNode {
  name: string
}

export interface SankeyLink {
  source: number
  target: number
  value: number
}

export interface SankeyGraph {
  nodes: SankeyNode[]
  links: SankeyLink[]
}

export function getSankeyData(
  data: ChartRendererDataRow[],
  config: Pick<ChartConfig, 'x_axis' | 'y_axis' | 'options'>
): SankeyGraph {
  const sourceField = config.options?.sankeySourceField ?? config.x_axis?.field
  const targetField = config.options?.sankeyTargetField
  const valueField = config.y_axis?.field

  if (!sourceField || !targetField || !valueField) {
    return { nodes: [], links: [] }
  }

  const nodes: SankeyNode[] = []
  const nodeIndex = new Map<string, number>()
  const linkIndex = new Map<string, SankeyLink>()

  const ensureNode = (name: string) => {
    const existing = nodeIndex.get(name)
    if (existing !== undefined) {
      return existing
    }

    const nextIndex = nodes.length
    nodes.push({ name })
    nodeIndex.set(name, nextIndex)
    return nextIndex
  }

  for (const row of data) {
    const source = String(row[sourceField] ?? '').trim()
    const target = String(row[targetField] ?? '').trim()
    const value = toNumericValue(row[valueField])

    if (!source || !target || value === null) {
      continue
    }

    const sourceIndex = ensureNode(source)
    const targetIndex = ensureNode(target)
    const key = `${sourceIndex}:${targetIndex}`
    const existingLink = linkIndex.get(key)

    if (existingLink) {
      existingLink.value += value
    } else {
      linkIndex.set(key, {
        source: sourceIndex,
        target: targetIndex,
        value,
      })
    }
  }

  return {
    nodes,
    links: Array.from(linkIndex.values()),
  }
}
