// tests/unit/data/patterns/serbian-vocabulary.test.ts
import { detectSemanticType, isAgeGroupColumn, isAgeGroupValue } from '@/lib/data/patterns/serbian-vocabulary'
import type { Observation } from '@/types/observation'

describe('serbian-vocabulary', () => {
  describe('isAgeGroupValue', () => {
    it('matches standard age ranges', () => {
      expect(isAgeGroupValue('0-14')).toBe(true)
      expect(isAgeGroupValue('15-29')).toBe(true)
      expect(isAgeGroupValue('65+')).toBe(true)
      expect(isAgeGroupValue('0-14 god')).toBe(true)
    })

    it('rejects non-age values', () => {
      expect(isAgeGroupValue('Beograd')).toBe(false)
      expect(isAgeGroupValue('2024')).toBe(false)
      expect(isAgeGroupValue('muški')).toBe(false)
    })
  })

  describe('isAgeGroupColumn', () => {
    it('matches age column names', () => {
      expect(isAgeGroupColumn('starost')).toBe(true)
      expect(isAgeGroupColumn('godine')).toBe(true)
      expect(isAgeGroupColumn('age')).toBe(true)
      expect(isAgeGroupColumn('uzrast')).toBe(true)
    })

    it('rejects non-age columns', () => {
      expect(isAgeGroupColumn('grad')).toBe(false)
      expect(isAgeGroupColumn('godina')).toBe(false)
    })
  })

  describe('detectSemanticType', () => {
    it('detects age-group from column name', () => {
      const data: Observation[] = [
        { starost: '0-14', broj: 100 },
        { starost: '15-29', broj: 200 },
      ]
      expect(detectSemanticType('starost', data)).toBe('age-group')
    })

    it('detects age-group from values', () => {
      const data: Observation[] = [
        { grupa: '0-14', broj: 100 },
        { grupa: '15-29', broj: 200 },
        { grupa: '30-44', broj: 150 },
      ]
      expect(detectSemanticType('grupa', data)).toBe('age-group')
    })

    it('detects gender from values', () => {
      const data: Observation[] = [
        { pol: 'muški', broj: 100 },
        { pol: 'ženski', broj: 120 },
      ]
      expect(detectSemanticType('pol', data)).toBe('gender')
    })

    it('detects year from values', () => {
      const data: Observation[] = [
        { godina: '2020', broj: 100 },
        { godina: '2021', broj: 120 },
        { godina: '2022', broj: 130 },
      ]
      expect(detectSemanticType('godina', data)).toBe('year')
    })

    it('detects quarter from values', () => {
      const data: Observation[] = [
        { period: 'Q1', broj: 100 },
        { period: 'Q2', broj: 120 },
        { period: 'Q3', broj: 90 },
      ]
      expect(detectSemanticType('period', data)).toBe('quarter')
    })

    it('returns unknown for unrecognized patterns', () => {
      const data: Observation[] = [
        { naziv: 'Proizvod A', broj: 100 },
        { naziv: 'Proizvod B', broj: 120 },
      ]
      expect(detectSemanticType('naziv', data)).toBe('unknown')
    })
  })
})
