// tests/scrape/benchmarks/performance.ts
import { fetchPage, fetchParallel } from '../lightpanda';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const ITERATIONS = 5;

interface BenchmarkResult {
  label: string;
  avg: number;
  min: number;
  max: number;
}

async function benchmarkSinglePage(
  url: string,
  label: string
): Promise<BenchmarkResult> {
  console.log(`\nBenchmarking: ${label}`);
  console.log('─'.repeat(40));

  const times: number[] = [];

  for (let i = 0; i < ITERATIONS; i++) {
    const result = await fetchPage(url);
    times.push(result.timing);
    console.log(
      `  Run ${i + 1}: ${result.timing}ms (${result.success ? 'OK' : 'FAIL'})`
    );
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  console.log(`\n  Average: ${avg.toFixed(0)}ms`);
  console.log(`  Min: ${min}ms | Max: ${max}ms`);

  return { label, avg, min, max };
}

export async function runBenchmarks(): Promise<void> {
  console.log('Lightpanda Performance Benchmarks');
  console.log('='.repeat(40));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Iterations: ${ITERATIONS}`);

  // Benchmark individual pages
  const pages = [
    { url: `${BASE_URL}/sr-Latn`, label: 'Homepage' },
    { url: `${BASE_URL}/sr-Latn/browse`, label: 'Browse' },
    { url: `${BASE_URL}/sr-Latn/create`, label: 'Create Chart' },
    { url: `${BASE_URL}/api/browse?page=1&limit=10`, label: 'API Browse' },
  ];

  const results: BenchmarkResult[] = [];
  for (const page of pages) {
    results.push(await benchmarkSinglePage(page.url, page.label));
  }

  // Benchmark parallel fetch
  console.log('\n\nParallel fetch: Main Pages');
  console.log('─'.repeat(40));
  const parallelUrls = pages.slice(0, 3).map((p) => p.url);
  const { results: parallelResults, totalTime } =
    await fetchParallel(parallelUrls);

  console.log(`  Total time: ${totalTime}ms`);
  console.log(`  Pages fetched: ${parallelResults.length}`);
  console.log(
    `  Avg per page: ${(totalTime / parallelResults.length).toFixed(0)}ms`
  );

  // Summary
  console.log('\n' + '='.repeat(40));
  console.log('Summary:');
  console.log('─'.repeat(40));

  const overallAvg =
    results.reduce((sum, r) => sum + r.avg, 0) / results.length;
  console.log(`Overall average: ${overallAvg.toFixed(0)}ms`);

  const fastest = results.reduce((a, b) => (a.avg < b.avg ? a : b));
  const slowest = results.reduce((a, b) => (a.avg > b.avg ? a : b));

  console.log(`Fastest: ${fastest.label} (${fastest.avg.toFixed(0)}ms)`);
  console.log(`Slowest: ${slowest.label} (${slowest.avg.toFixed(0)}ms)`);
}

// Run if called directly
if (require.main === module) {
  runBenchmarks().catch((err) => {
    console.error('Benchmark error:', err);
    process.exit(1);
  });
}
