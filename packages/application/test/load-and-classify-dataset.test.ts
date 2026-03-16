import { describe, expect, it, vi } from 'vitest'

import { loadAndClassifyDataset } from '../src'

describe('loadAndClassifyDataset', () => {
  it('loads and classifies dataset rows through @vizualni/data', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'text/csv' }),
        arrayBuffer: async () =>
          new TextEncoder().encode('opstina,broj\nZemun,12\nNovi Beograd,8').buffer,
      })
    )

    const dataset = await loadAndClassifyDataset('https://data.gov.rs/example.csv', {
      format: 'csv',
    })

    expect(dataset.rowCount).toBe(2)
    expect(dataset.measures.map(measure => measure.key)).toEqual(['broj'])
    expect(dataset.dimensions.map(dimension => dimension.key)).toContain('opstina')
  })
})
