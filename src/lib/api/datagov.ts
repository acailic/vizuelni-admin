import { loadDatasetFromUrl } from '@/lib/data'
import { datasets, organizations, site, topics } from '@vizualni/datagov-client'

import type { Dataset, Resource, Organization, SearchResult } from '@/types'
import type { ParsedDataset } from '@/types/observation'

function toSearchResult<T>(page: {
  data: T[]
  total: number
  page: number
  page_size: number
}): SearchResult {
  return {
    datasets: page.data as unknown as SearchResult['datasets'],
    total: page.total,
    page: page.page,
    page_size: page.page_size,
  }
}

export async function searchDatasets(
  query?: string,
  page = 1,
  pageSize = 20,
  filters?: {
    organization?: string
    tag?: string
    topic?: string
    format?: string
  }
): Promise<SearchResult> {
  try {
    const result = await datasets.list({
      q: query,
      page,
      page_size: pageSize,
      organization: filters?.organization,
      tag: filters?.tag ? [filters.tag] : undefined,
      topic: filters?.topic,
      format: filters?.format,
    })

    return toSearchResult(result)
  } catch (error) {
    console.error('Error searching datasets:', error)
    throw error
  }
}

export async function getDataset(id: string): Promise<Dataset> {
  try {
    return (await datasets.get(id)) as unknown as Dataset
  } catch (error) {
    console.error(`Error fetching dataset ${id}:`, error)
    throw error
  }
}

export async function getDatasetResources(datasetId: string): Promise<Resource[]> {
  try {
    return (await datasets.resources(datasetId)) as unknown as Resource[]
  } catch (error) {
    console.error(`Error fetching resources for dataset ${datasetId}:`, error)
    throw error
  }
}

export async function getOrganizations(): Promise<Organization[]> {
  try {
    const response = await organizations.list({ page_size: 100 })
    return response.data as unknown as Organization[]
  } catch (error) {
    console.error('Error fetching organizations:', error)
    throw error
  }
}

export async function getTopics(): Promise<
  Array<{ id: string; name: string; name_en: string; slug: string }>
> {
  try {
    const response = await topics.list()
    return response.data.map(topic => ({
      id: topic.id,
      name: topic.name,
      name_en: topic.name,
      slug: topic.slug,
    }))
  } catch (error) {
    console.error('Error fetching topics:', error)
    throw error
  }
}

export async function fetchResourceData(url: string, format?: string): Promise<ParsedDataset> {
  try {
    return await loadDatasetFromUrl(url, {
      format,
      resourceUrl: url,
    })
  } catch (error) {
    console.error(`Error fetching resource data from ${url}:`, error)
    throw error
  }
}

export async function getFeaturedDatasets(): Promise<Dataset[]> {
  try {
    return (await site.homeDatasets()) as unknown as Dataset[]
  } catch (error) {
    console.error('Error fetching featured datasets:', error)
    return []
  }
}

export async function getRecentDatasets(limit = 20): Promise<Dataset[]> {
  try {
    const response = await datasets.list({
      page_size: limit,
      sort: '-created',
    })
    return response.data as unknown as Dataset[]
  } catch (error) {
    console.error('Error fetching recent datasets:', error)
    return []
  }
}
