import { DataGovAPIError } from './errors'

const API_BASE_URL = process.env.NEXT_PUBLIC_DATA_GOV_API_URL || 'https://data.gov.rs/api/1'
const API_TIMEOUT = Number.parseInt(process.env.API_TIMEOUT || '30000', 10)
const API_RETRY_ATTEMPTS = Number.parseInt(process.env.API_RETRY_ATTEMPTS || '3', 10)
const API_CACHE_ENABLED = process.env.API_CACHE_ENABLED === 'true'
const API_CACHE_TTL = Number.parseInt(process.env.API_CACHE_TTL || '300', 10) * 1000

interface CacheEntry<T> {
  data: T
  timestamp: number
}

export interface RequestOptions extends RequestInit {
  timeout?: number
}

type QueryPrimitive = string | number | boolean
type QueryValue = QueryPrimitive | QueryPrimitive[] | null | undefined

const cache = new Map<string, CacheEntry<unknown>>()

function normalizeEndpoint(endpoint: string) {
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`
}

function getCacheKey(url: string, options?: RequestOptions) {
  return `${url}:${options ? JSON.stringify(options) : ''}`
}

function getFromCache<T>(key: string): T | null {
  if (!API_CACHE_ENABLED) {
    return null
  }

  const entry = cache.get(key) as CacheEntry<T> | undefined
  if (!entry) {
    return null
  }

  if (Date.now() - entry.timestamp > API_CACHE_TTL) {
    cache.delete(key)
    return null
  }

  return entry.data
}

function setCache<T>(key: string, data: T) {
  if (!API_CACHE_ENABLED) {
    return
  }

  cache.set(key, {
    data,
    timestamp: Date.now(),
  })
}

export function buildQueryString<T extends object>(params?: T) {
  if (!params) {
    return ''
  }

  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params as Record<string, QueryValue>)) {
    if (value === undefined || value === null) {
      continue
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        searchParams.append(key, String(item))
      }
      continue
    }

    searchParams.set(key, String(value))
  }

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export async function fetchWithTimeout(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { timeout = API_TIMEOUT, ...fetchOptions } = options
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    })

    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error && error.name === 'AbortError') {
      throw new DataGovAPIError('Request timeout', undefined, undefined, url)
    }

    if (error instanceof DataGovAPIError) {
      throw error
    }

    throw new DataGovAPIError(
      error instanceof Error ? error.message : 'Request failed',
      undefined,
      undefined,
      url
    )
  }
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
  retryCount = 0
): Promise<T> {
  const normalizedEndpoint = normalizeEndpoint(endpoint)
  const url = `${API_BASE_URL}${normalizedEndpoint}`
  const cacheKey = getCacheKey(url, options)

  if (!options.method || options.method === 'GET') {
    const cached = getFromCache<T>(cacheKey)
    if (cached) {
      return cached
    }
  }

  try {
    const response = await fetchWithTimeout(url, options)

    if (!response.ok) {
      throw new DataGovAPIError(
        `API request failed: ${response.statusText}`,
        response.status,
        response.statusText,
        normalizedEndpoint
      )
    }

    const data = (await response.json()) as T

    if (!options.method || options.method === 'GET') {
      setCache(cacheKey, data)
    }

    return data
  } catch (error) {
    const normalizedError =
      error instanceof DataGovAPIError
        ? error
        : new DataGovAPIError(
            error instanceof Error ? error.message : 'Request failed',
            undefined,
            undefined,
            normalizedEndpoint
          )

    if (retryCount < API_RETRY_ATTEMPTS) {
      console.warn(
        `Retrying request to ${normalizedEndpoint} (attempt ${retryCount + 1}/${API_RETRY_ATTEMPTS})`
      )
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
      return request<T>(normalizedEndpoint, options, retryCount + 1)
    }

    throw normalizedError
  }
}

export function clearCache() {
  cache.clear()
}

export function clearExpiredCache() {
  const now = Date.now()

  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > API_CACHE_TTL) {
      cache.delete(key)
    }
  }
}
