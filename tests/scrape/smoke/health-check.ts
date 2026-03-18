import { fetchPage, smokeTest } from '../lightpanda';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

export async function runSmokeTests(): Promise<boolean> {
  console.log('Running Lightpanda smoke tests...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  // Test 1: Basic page health
  console.log('1. Testing basic page health...');
  const result = await smokeTest(BASE_URL);

  for (const pageResult of result.results) {
    const status = pageResult.success ? '✅' : '❌';
    console.log(`   ${status} ${pageResult.url} (${pageResult.timing}ms)`);
  }

  if (!result.passed) {
    console.error(
      '\n❌ Smoke tests failed: Some pages did not load successfully'
    );
    return false;
  }

  // Test 2: API health
  console.log('\n2. Testing API endpoints...');
  const apiResult = await fetchPage(`${BASE_URL}/api/browse?page=1&limit=1`);
  const apiStatus = apiResult.success ? '✅' : '❌';
  console.log(`   ${apiStatus} /api/browse (${apiResult.timing}ms)`);

  if (!apiResult.success) {
    console.error('\n❌ API health check failed');
    return false;
  }

  // Test 3: Response time check
  console.log('\n3. Testing response times...');
  const slowPages = result.results.filter((r) => r.timing > 5000);
  if (slowPages.length > 0) {
    console.warn(
      '   ⚠️  Slow pages detected:',
      slowPages.map((p) => `${p.url} (${p.timing}ms)`).join(', ')
    );
  } else {
    console.log('   ✅ All pages responded within 5 seconds');
  }

  console.log('\n✅ All smoke tests passed!');
  return true;
}

// Run if called directly
if (require.main === module) {
  runSmokeTests().then((passed) => {
    process.exit(passed ? 0 : 1);
  });
}
