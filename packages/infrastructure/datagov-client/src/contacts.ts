import { request } from './client'

export const contacts = {
  roles: async (): Promise<Record<string, string>> => {
    return request<Record<string, string>>('/contacts/roles/')
  },
}
