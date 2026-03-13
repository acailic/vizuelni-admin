import { describe, expect, it } from 'vitest'

import {
  getAllDatasetMeta,
  getDatasetById,
  getDatasetsByCategory,
  isSerbianDataset,
} from '../registry'

describe('Serbian Dataset Registry', () => {
  describe('getAllDatasetMeta', () => {
    it('returns all dataset metadata', () => {
      const meta = getAllDatasetMeta()
      expect(meta).toHaveLength(7)
    })

    it('excludes observations from metadata', () => {
      const meta = getAllDatasetMeta()
      const first = meta[0]
      expect(first).not.toHaveProperty('observations')
      expect(first).not.toHaveProperty('dimensions')
      expect(first).not.toHaveProperty('measures')
    })

    it('includes required metadata fields', () => {
      const meta = getAllDatasetMeta()
      const first = meta[0]
      expect(first).toHaveProperty('id')
      expect(first).toHaveProperty('title')
      expect(first).toHaveProperty('description')
      expect(first).toHaveProperty('category')
      expect(first).toHaveProperty('tags')
      expect(first).toHaveProperty('source')
    })
  })

  describe('getDatasetById', () => {
    it('returns dataset for valid ID', () => {
      const dataset = getDatasetById('serbia-birth-rates')
      expect(dataset).toBeDefined()
      expect(dataset?.id).toBe('serbia-birth-rates')
      expect(dataset?.observations).toBeDefined()
    })

    it('returns undefined for invalid ID', () => {
      const dataset = getDatasetById('nonexistent')
      expect(dataset).toBeUndefined()
    })

    it('includes full dataset with observations', () => {
      const dataset = getDatasetById('serbia-population-decline')
      expect(dataset?.observations).toBeInstanceOf(Array)
      expect(dataset?.observations.length).toBeGreaterThan(0)
      expect(dataset?.dimensions).toBeInstanceOf(Array)
      expect(dataset?.measures).toBeInstanceOf(Array)
    })
  })

  describe('getDatasetsByCategory', () => {
    it('filters by demographics category', () => {
      const datasets = getDatasetsByCategory('demographics')
      expect(datasets.length).toBeGreaterThan(0)
      datasets.forEach(d => {
        expect(d.category).toBe('demographics')
      })
    })

    it('returns empty array for category with no datasets', () => {
      const datasets = getDatasetsByCategory('healthcare')
      expect(datasets).toHaveLength(0)
    })
  })

  describe('isSerbianDataset', () => {
    it('returns true for serbia- prefixed IDs', () => {
      expect(isSerbianDataset('serbia-birth-rates')).toBe(true)
      expect(isSerbianDataset('serbia-population-decline')).toBe(true)
    })

    it('returns false for non-serbia prefixed IDs', () => {
      expect(isSerbianDataset('other-dataset')).toBe(false)
      expect(isSerbianDataset('external-data')).toBe(false)
    })
  })
})
