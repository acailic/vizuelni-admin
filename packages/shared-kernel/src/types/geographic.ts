export type GeoLevel = 'region' | 'district' | 'municipality'

export interface GeoMatchResult {
  matchRate: number
  matched: Map<string, string>
  unmatched: string[]
}
