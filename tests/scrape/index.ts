// tests/scrape/index.ts
import { runSmokeTests } from './smoke/health-check';
import { runBenchmarks } from './benchmarks/performance';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

async function main() {
  console.log('Lightpanda Scrape Test Runner');
  console.log('='.repeat(50));
  console.log(`Base URL: ${BASE_URL}\n`);

  const args = process.argv.slice(2);
  const runAll = args.length === 0 || args.includes('--all');
  const runSmoke = args.includes('--smoke') || runAll;
  const runPerf = args.includes('--perf') || runAll;

  let hasErrors = false;

  // Run smoke tests
  if (runSmoke) {
    console.log('\n📋 Running Smoke Tests...\n');
    try {
      const passed = await runSmokeTests();
      if (!passed) {
        console.error('❌ Smoke tests failed');
        hasErrors = true;
      } else {
        console.log('✅ Smoke tests passed');
      }
    } catch (error) {
      console.error('❌ Smoke tests error:', error);
      hasErrors = true;
    }
  }

  // Run performance benchmarks
  if (runPerf) {
    console.log('\n📊 Running Performance Benchmarks...\n');
    try {
      await runBenchmarks();
      console.log('✅ Performance benchmarks completed');
    } catch (error) {
      console.error('❌ Performance benchmarks error:', error);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  console.log('\n✅ All scrape tests completed successfully!');
}

main().catch((err) => {
  console.error('Scrape test runner error:', err);
  process.exit(1);
});
