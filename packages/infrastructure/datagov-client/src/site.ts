import { request } from './client'
import type { Dataset, Reuse } from './types'

export const site = {
  info: async (): Promise<{ id: string; title: string; metrics: Record<string, number> }> => {
    return request<{ id: string; title: string; metrics: Record<string, number> }>('/site/')
  },

  homeDatasets: async (): Promise<Dataset[]> => {
    return request<Dataset[]>('/site/home/datasets/')
  },

  homeReuses: async (): Promise<Reuse[]> => {
    return request<Reuse[]>('/site/home/reuses/')
  },
}
