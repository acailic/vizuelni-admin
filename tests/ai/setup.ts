// Load environment variables FIRST before any other imports
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from project root - must happen before any other module imports
const envPath = resolve(process.cwd(), '.env');
const envResult = config({ path: envPath });

// Now import other modules
import { beforeAll, afterAll } from 'vitest';

// Set BASE_URL globally if not set
if (!process.env.BASE_URL) {
  process.env.BASE_URL = 'http://localhost:3000';
}

// Global setup for AI tests
beforeAll(async () => {
  console.log('Starting AI test suite...');
  console.log('BASE_URL:', process.env.BASE_URL);
  console.log('GLM_API_KEY:', process.env.GLM_API_KEY ? 'loaded' : 'NOT FOUND');
  console.log('GLM_API_BASE:', process.env.GLM_API_BASE || 'NOT FOUND');
  console.log('LEARNER_MODEL:', process.env.LEARNER_MODEL || 'NOT FOUND');
});

afterAll(async () => {
  console.log('AI test suite completed');
});
