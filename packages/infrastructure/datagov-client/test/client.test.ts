import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('@vizualni/datagov-client', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
    delete process.env.API_CACHE_ENABLED
    delete process.env.API_CACHE_TTL
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('fetches dataset listings through the canonical client', async () => {
    const page = {
      data: [
        {
          id: 'dataset-1',
          title: 'Population',
          slug: 'population',
          description: 'Population by municipality',
          created_at: '2024-01-01',
          last_modified: '2024-01-02',
          last_update: '2024-01-02',
          tags: [],
          badges: [],
          resources: [],
          frequency: 'annual',
          extras: {},
          harvest: {},
          metrics: { followers: 0, views: 0, reuses: 0 },
          license: 'cc-by',
          uri: '/datasets/population',
          page: '/datasets/population',
        },
      ],
      total: 1,
      page: 2,
      page_size: 5,
    }

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => page,
    })
    vi.stubGlobal('fetch', fetchMock)

    const { datasets } = await import('../src')
    const result = await datasets.list({ q: 'population', page: 2, page_size: 5 })

    expect(result).toEqual(page)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://data.gov.rs/api/1/datasets/?q=population&page=2&page_size=5',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
        },
      })
    )
  })

  it('retries failed requests before succeeding', async () => {
    vi.useFakeTimers()

    const page = {
      data: [],
      total: 0,
      page: 1,
      page_size: 20,
    }

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => page,
      })
    vi.stubGlobal('fetch', fetchMock)

    const { datasets } = await import('../src')
    const promise = datasets.list()

    await vi.advanceTimersByTimeAsync(1000)

    await expect(promise).resolves.toEqual(page)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('caches GET responses when cache is enabled', async () => {
    process.env.API_CACHE_ENABLED = 'true'
    process.env.API_CACHE_TTL = '300'

    const page = {
      data: [],
      total: 0,
      page: 1,
      page_size: 20,
    }

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => page,
    })
    vi.stubGlobal('fetch', fetchMock)

    const { clearCache, datasets } = await import('../src')

    await datasets.list({ q: 'cached' })
    await datasets.list({ q: 'cached' })

    expect(fetchMock).toHaveBeenCalledTimes(1)

    clearCache()
  })
})
