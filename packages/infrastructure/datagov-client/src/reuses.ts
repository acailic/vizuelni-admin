import { buildQueryString, request } from './client'
import type { Reuse, ReusePage, ReuseQueryParams } from './types'

export const reuses = {
  list: async (params?: ReuseQueryParams): Promise<ReusePage> => {
    return request<ReusePage>(`/reuses/${buildQueryString(params)}`)
  },

  get: async (id: string): Promise<Reuse> => {
    return request<Reuse>(`/reuses/${id}/`)
  },

  suggest: async (query: string, size = 10): Promise<Reuse[]> => {
    return request<Reuse[]>(`/reuses/suggest/${buildQueryString({ q: query, size })}`)
  },

  topics: async (): Promise<Record<string, string>> => {
    return request<Record<string, string>>('/reuses/topics/')
  },

  types: async (): Promise<Record<string, string>> => {
    return request<Record<string, string>>('/reuses/types/')
  },
}
