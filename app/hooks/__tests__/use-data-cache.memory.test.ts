import { describe, it, expect, beforeEach } from 'vitest';

import { clearAllMemoryCache, getCacheStats } from '../use-data-cache';

describe('useDataCache Memory Management', () => {
  beforeEach(() => {
    clearAllMemoryCache();
  });

  it('should clear all memory cache properly', () => {
    // Clear all cache
    clearAllMemoryCache();

    const stats = getCacheStats();

    expect(stats.memoryEntries).toBe(0);
    expect(stats.memorySize).toBe(0);
    expect(stats.memoryUsagePercent).toBe(0);
  });

  it('should provide correct cache statistics', () => {
    const stats = getCacheStats();

    expect(stats.memoryEntries).toBeDefined();
    expect(stats.memorySize).toBeDefined();
    expect(stats.memoryLimit).toBe(50 * 1024 * 1024); // 50MB
    expect(stats.memoryUsagePercent).toBeDefined();
    expect(typeof stats.memoryUsagePercent).toBe('number');
  });

  it('should have memory limit of 50MB', () => {
    const stats = getCacheStats();
    expect(stats.memoryLimit).toBe(50 * 1024 * 1024);
  });
});