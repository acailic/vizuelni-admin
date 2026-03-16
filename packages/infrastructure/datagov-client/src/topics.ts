import { buildQueryString, request } from './client'
import type { Topic, TopicPage } from './types'

export interface TopicListParams {
  q?: string
  tag?: string[]
  geozone?: string
  organization?: string
  owner?: string
  sort?: string
  page?: number
  page_size?: number
}

export const topics = {
  list: async (params?: TopicListParams): Promise<TopicPage> => {
    return request<TopicPage>(`/topics/${buildQueryString(params)}`)
  },

  get: async (id: string): Promise<Topic> => {
    return request<Topic>(`/topics/${id}/`)
  },
}
