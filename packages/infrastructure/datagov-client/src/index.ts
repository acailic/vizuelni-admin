export * from './types'
export * from './errors'
export * from './client'
export * from './datasets'
export * from './organizations'
export * from './reuses'
export * from './topics'
export * from './contacts'
export * from './discussions'
export * from './dataservices'
export * from './site'

import { clearCache, clearExpiredCache } from './client'
import { contacts } from './contacts'
import { dataservices } from './dataservices'
import { datasets } from './datasets'
import { discussions } from './discussions'
import { organizations } from './organizations'
import { reuses } from './reuses'
import { site } from './site'
import { topics } from './topics'

export interface DataGovAPI {
  datasets: typeof datasets
  organizations: typeof organizations
  reuses: typeof reuses
  topics: typeof topics
  contacts: typeof contacts
  discussions: typeof discussions
  dataservices: typeof dataservices
  site: typeof site
  clearCache: typeof clearCache
  clearExpiredCache: typeof clearExpiredCache
}

export const dataGovAPI: DataGovAPI = {
  datasets,
  organizations,
  reuses,
  topics,
  contacts,
  discussions,
  dataservices,
  site,
  clearCache,
  clearExpiredCache,
}

export default dataGovAPI
