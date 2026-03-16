import { describe, expect, it } from 'vitest'

import {
  DataGovAPIError,
  clearCache,
  dataGovAPI,
  datasets,
  organizations,
  reuses,
  site,
  topics,
} from '../src'

describe('datagov client package', () => {
  it('exports the canonical API modules', () => {
    expect(typeof datasets.list).toBe('function')
    expect(typeof organizations.list).toBe('function')
    expect(typeof reuses.list).toBe('function')
    expect(typeof topics.list).toBe('function')
    expect(typeof site.info).toBe('function')
  })

  it('exports cache controls and singleton object', () => {
    expect(typeof clearCache).toBe('function')
    expect(dataGovAPI.datasets).toBe(datasets)
    expect(dataGovAPI.organizations).toBe(organizations)
    expect(dataGovAPI.reuses).toBe(reuses)
    expect(dataGovAPI.topics).toBe(topics)
    expect(typeof dataGovAPI.clearExpiredCache).toBe('function')
  })

  it('exports the typed error', () => {
    const error = new DataGovAPIError('Test error', 404, 'Not Found', '/test')
    expect(error.name).toBe('DataGovAPIError')
    expect(error.status).toBe(404)
    expect(error.statusText).toBe('Not Found')
    expect(error.endpoint).toBe('/test')
  })
})
