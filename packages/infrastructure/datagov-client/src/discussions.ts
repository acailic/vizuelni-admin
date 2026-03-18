import { buildQueryString, request } from './client'
import type { Discussion, DiscussionPage } from './types'

export interface DiscussionListParams {
  sort?: string
  closed?: boolean
  for?: string[]
  org?: string
  user?: string
  page?: number
  page_size?: number
}

export const discussions = {
  list: async (params?: DiscussionListParams): Promise<DiscussionPage> => {
    return request<DiscussionPage>(`/discussions/${buildQueryString(params)}`)
  },

  get: async (id: string): Promise<Discussion> => {
    return request<Discussion>(`/discussions/${id}/`)
  },
}
