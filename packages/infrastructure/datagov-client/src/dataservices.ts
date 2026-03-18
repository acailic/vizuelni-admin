import { buildQueryString, request } from './client'
import type { Dataservice, DataservicePage } from './types'

export interface DataserviceListParams {
  q?: string
  owner?: string
  organization?: string
  tag?: string
  contact_point?: string
  dataset?: string
  access_type?: 'open' | 'open_with_account' | 'restricted'
  sort?: string
  page?: number
  page_size?: number
}

export const dataservices = {
  list: async (params?: DataserviceListParams): Promise<DataservicePage> => {
    return request<DataservicePage>(`/dataservices/${buildQueryString(params)}`)
  },

  get: async (id: string): Promise<Dataservice> => {
    return request<Dataservice>(`/dataservices/${id}/`)
  },
}
