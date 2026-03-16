import { buildQueryString, request } from './client'
import type {
  DatasetPage,
  DatasetQueryParams,
  Organization,
  OrganizationPage,
  OrganizationQueryParams,
  Reuse,
} from './types'

export const organizations = {
  list: async (params?: OrganizationQueryParams): Promise<OrganizationPage> => {
    return request<OrganizationPage>(`/organizations/${buildQueryString(params)}`)
  },

  get: async (id: string): Promise<Organization> => {
    return request<Organization>(`/organizations/${id}/`)
  },

  datasets: async (orgId: string, params?: DatasetQueryParams): Promise<DatasetPage> => {
    return request<DatasetPage>(`/organizations/${orgId}/datasets/${buildQueryString(params)}`)
  },

  reuses: async (orgId: string): Promise<Reuse[]> => {
    return request<Reuse[]>(`/organizations/${orgId}/reuses/`)
  },

  suggest: async (query: string, size = 10): Promise<Organization[]> => {
    return request<Organization[]>(
      `/organizations/suggest/${buildQueryString({ q: query, size })}`
    )
  },

  badges: async (): Promise<Record<string, string>> => {
    return request<Record<string, string>>('/organizations/badges/')
  },
}
