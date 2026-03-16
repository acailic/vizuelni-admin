import {
  DataGovAPIError,
  datasets,
  organizations,
  reuses,
  site,
  type Dataset,
  type Organization,
  type Reuse,
} from '@vizualni/datagov-client'

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  page_size: number
  totalPages?: number
  next_page?: string
  previous_page?: string
}

function toPaginatedResponse<T>(page: {
  data: T[]
  total: number
  page: number
  page_size: number
  next_page?: string
  previous_page?: string
}): PaginatedResponse<T> {
  return {
    data: page.data,
    total: page.total,
    page: page.page,
    page_size: page.page_size,
    totalPages: page.total === 0 ? 0 : Math.ceil(page.total / page.page_size),
    next_page: page.next_page,
    previous_page: page.previous_page,
  }
}

function unsupported(endpoint: string): never {
  throw new DataGovAPIError(
    `The ${endpoint} endpoint is not implemented in the canonical data.gov.rs client`,
    501,
    'Not Implemented',
    endpoint
  )
}

export const DatasetService = {
  async getAll(page = 1, pageSize = 20): Promise<PaginatedResponse<Dataset>> {
    const response = await datasets.list({ page, page_size: pageSize })
    return toPaginatedResponse(response)
  },

  async getById(id: string): Promise<Dataset> {
    return datasets.get(id)
  },

  async search(query: string, page = 1, pageSize = 20): Promise<PaginatedResponse<Dataset>> {
    const response = await datasets.list({ q: query, page, page_size: pageSize })
    return toPaginatedResponse(response)
  },

  async getFeatured(): Promise<Dataset[]> {
    return site.homeDatasets()
  },

  async suggest(query: string, size = 10): Promise<Dataset[]> {
    return datasets.suggest(query, size)
  },

  async getByOrganization(
    orgId: string,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Dataset>> {
    const response = await organizations.datasets(orgId, { page, page_size: pageSize })
    return toPaginatedResponse(response)
  },

  async getResources(datasetId: string): Promise<Dataset['resources']> {
    return datasets.resources(datasetId)
  },
}

export const OrganizationService = {
  async getAll(page = 1, pageSize = 20): Promise<PaginatedResponse<Organization>> {
    const response = await organizations.list({ page, page_size: pageSize })
    return toPaginatedResponse(response)
  },

  async getById(id: string): Promise<Organization> {
    return organizations.get(id)
  },

  async search(
    query: string,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Organization>> {
    const response = await organizations.list({ q: query, page, page_size: pageSize })
    return toPaginatedResponse(response)
  },
}

export const ReuseService = {
  async getAll(page = 1, pageSize = 20): Promise<PaginatedResponse<Reuse>> {
    const response = await reuses.list({ page, page_size: pageSize })
    return toPaginatedResponse(response)
  },

  async getFeatured(): Promise<Reuse[]> {
    return site.homeReuses()
  },
}

export const SpatialService = {
  async getZone(id: string): Promise<never> {
    unsupported(`/spatial/zones/${id}/`)
  },

  async suggestZones(_query: string, _size = 10): Promise<never> {
    unsupported('/spatial/suggest/')
  },
}

export const TagsService = {
  async suggest(_query: string, _size = 10): Promise<never> {
    unsupported('/tags/suggest/')
  },
}

export const ActivityService = {
  async getRecent(_page = 1, _pageSize = 20): Promise<never> {
    unsupported('/activity/')
  },
}

export const SiteService = {
  async getInfo(): Promise<unknown> {
    return site.info()
  },
}
