import { describe, expect, it } from '@jest/globals';

import {
  loadDemoDataset,
  loadDemoDatasetList,
  toBrowseDataset,
} from '../demo-datasets';

describe('demo-datasets', () => {
  describe('loadDemoDatasetList', () => {
    it('loads all demo datasets', () => {
      const result = loadDemoDatasetList({});

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.total).toBe(result.data.length);
      expect(result.page).toBe(1);
      expect(result.page_size).toBe(12);
    });

    it('filters by search query in title', () => {
      const result = loadDemoDatasetList({ q: 'GDP' });

      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((dataset) => {
        const searchableText = [
          dataset.title,
          dataset.description,
          ...dataset.tags,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        expect(searchableText).toContain('gdp');
      });
    });

    it('filters by search query case-insensitively', () => {
      const result = loadDemoDatasetList({ q: 'инфлација' });

      expect(result.data.length).toBeGreaterThan(0);
    });

    it('filters by topic', () => {
      const result = loadDemoDatasetList({ topic: 'economy' });

      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((dataset) => {
        expect(dataset.tags).toContain('economy');
      });
    });

    it('filters by organization', () => {
      const result = loadDemoDatasetList({ organization: 'rsz' });

      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((dataset) => {
        expect(dataset.organization?.slug).toBe('rsz');
      });
    });

    it('filters by format', () => {
      const result = loadDemoDatasetList({ format: 'csv' });

      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((dataset) => {
        const hasCsv = dataset.resources.some(
          (r) => r.format.toLowerCase() === 'csv'
        );
        expect(hasCsv).toBe(true);
      });
    });

    it('paginates results correctly', () => {
      const page1 = loadDemoDatasetList({ pageSize: 3, page: 1 });
      const page2 = loadDemoDatasetList({ pageSize: 3, page: 2 });

      expect(page1.data.length).toBe(3);
      expect(page2.data.length).toBeLessThanOrEqual(3);
      expect(page1.page).toBe(1);
      expect(page2.page).toBe(2);
      // Ensure no overlap
      const page1Ids = new Set(page1.data.map((d) => d.id));
      const page2Ids = new Set(page2.data.map((d) => d.id));
      const intersection = [...page1Ids].filter((id) => page2Ids.has(id));
      expect(intersection).toHaveLength(0);
    });

    it('sorts by title ascending', () => {
      const result = loadDemoDatasetList({ sort: 'title', pageSize: 20 });

      const titles = result.data.map((d) => d.title);
      const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b));
      expect(titles).toEqual(sortedTitles);
    });

    it('sorts by last_modified descending by default', () => {
      const result = loadDemoDatasetList({
        sort: '-last_update',
        pageSize: 20,
      });

      const dates = result.data
        .map((d) => d.last_modified)
        .filter(Boolean) as string[];
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i - 1] >= dates[i]).toBe(true);
      }
    });
  });

  describe('loadDemoDataset', () => {
    it('returns single dataset by ID', () => {
      const result = loadDemoDataset('demo-gdp');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('demo-gdp');
      expect(result?.title).toContain('GDP');
    });

    it('returns null for non-existent ID', () => {
      const result = loadDemoDataset('non-existent-dataset');

      expect(result).toBeNull();
    });
  });

  describe('toBrowseDataset', () => {
    it('normalizes demo dataset to BrowseDataset format', () => {
      const demoData = {
        id: 'test-dataset',
        title: 'Test Dataset',
        description: 'A test dataset',
        organization: { name: 'Test Org', slug: 'test-org' },
        topic: 'economy',
        tags: ['economy', 'statistics'],
        resources: [
          {
            id: 'res-1',
            title: 'CSV File',
            format: 'csv',
            url: 'https://example.com/data.csv',
          },
        ],
        last_modified: '2024-01-15',
        page: 'https://example.com/dataset',
        data: [{ year: 2024, value: 100 }],
      };

      const result = toBrowseDataset(demoData);

      expect(result.id).toBe('test-dataset');
      expect(result.slug).toBe('test-dataset');
      expect(result.title).toBe('Test Dataset');
      expect(result.description).toBe('A test dataset');
      expect(result.organization?.name).toBe('Test Org');
      expect(result.organization?.slug).toBe('test-org');
      expect(result.tags).toContain('economy');
      expect(result.tags).toContain('statistics');
      expect(result.resources).toHaveLength(1);
      expect(result.resources[0].format).toBe('csv');
      expect(result.page).toBe('https://example.com/dataset');
      expect(result.last_modified).toBe('2024-01-15');
      expect(result.created_at).toBeDefined();
    });

    it('includes all required BrowseDataset fields', () => {
      const demoData = {
        id: 'minimal-dataset',
        title: 'Minimal Dataset',
        description: 'Minimal',
        organization: { name: 'Org', slug: 'org' },
        topic: 'test',
        tags: [],
        resources: [],
        last_modified: '2024-01-01',
        data: [],
      };

      const result = toBrowseDataset(demoData);

      // Required fields
      expect(result.id).toBeDefined();
      expect(result.slug).toBeDefined();
      expect(result.title).toBeDefined();
      expect(result.created_at).toBeDefined();
      expect(Array.isArray(result.resources)).toBe(true);
      expect(Array.isArray(result.tags)).toBe(true);

      // Optional fields should be present (even if null/undefined)
      expect('description' in result).toBe(true);
      expect('last_modified' in result).toBe(true);
      expect('organization' in result).toBe(true);
    });
  });

  describe('filter combinations', () => {
    it('combines search query and topic filters', () => {
      const result = loadDemoDatasetList({ q: 'growth', topic: 'economy' });

      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((dataset) => {
        expect(dataset.tags).toContain('economy');
      });
    });

    it('returns empty array when no matches', () => {
      const result = loadDemoDatasetList({ q: 'zzzzzzznonexistent' });

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });
});
