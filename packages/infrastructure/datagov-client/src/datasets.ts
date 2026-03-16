import { buildQueryString, request } from './client'
import type {
  CommunityResource,
  Dataset,
  DatasetPage,
  DatasetQueryParams,
  Frequency,
  License,
  Resource,
  ResourceType,
} from './types'

export interface CommunityResourceQueryParams {
  dataset?: string
  organization?: string
  owner?: string
  sort?: string
  page?: number
  page_size?: number
}

export const datasets = {
  list: async (params?: DatasetQueryParams): Promise<DatasetPage> => {
    return request<DatasetPage>(`/datasets/${buildQueryString(params)}`)
  },

  get: async (id: string): Promise<Dataset> => {
    return request<Dataset>(`/datasets/${id}/`)
  },

  resources: async (datasetId: string): Promise<Resource[]> => {
    const dataset = await request<Dataset>(`/datasets/${datasetId}/`)
    return dataset.resources
  },

  getResource: async (datasetId: string, resourceId: string): Promise<Resource> => {
    return request<Resource>(`/datasets/${datasetId}/resources/${resourceId}/`)
  },

  suggest: async (query: string, size = 10): Promise<Dataset[]> => {
    return request<Dataset[]>(`/datasets/suggest/${buildQueryString({ q: query, size })}`)
  },

  frequencies: async (): Promise<Frequency[]> => {
    return request<Frequency[]>('/datasets/frequencies/')
  },

  licenses: async (): Promise<License[]> => {
    return request<License[]>('/datasets/licenses/')
  },

  resourceTypes: async (): Promise<ResourceType[]> => {
    return request<ResourceType[]>('/datasets/resource_types/')
  },

  badges: async (): Promise<Record<string, string>> => {
    return request<Record<string, string>>('/datasets/badges/')
  },

  communityResources: async (
    params?: CommunityResourceQueryParams
  ): Promise<{ data: CommunityResource[]; total: number }> => {
    return request<{ data: CommunityResource[]; total: number }>(
      `/datasets/community_resources/${buildQueryString(params)}`
    )
  },
}
