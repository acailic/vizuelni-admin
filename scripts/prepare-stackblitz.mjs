#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync, copyFileSync } from 'fs';
import { fileURLToPath } from 'url';

console.log('🚀 Preparing StackBlitz environment...');

// 1. Create .env.local if it doesn't exist
if (!existsSync('.env.local')) {
  if (existsSync('.env.example')) {
    copyFileSync('.env.example', '.env.local');
    console.log('✅ Created .env.local from .env.example');
  } else {
    // Create minimal .env.local for demo
    const minimalEnv = `# Minimal StackBlitz environment
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_APP_NAME="Vizuelni Admin Srbije"
NEXT_PUBLIC_DEFAULT_LOCALE="sr-Cyrl"
NEXT_PUBLIC_ENABLE_DARK_MODE="false"
`;
    writeFileSync('.env.local', minimalEnv);
    console.log('✅ Created minimal .env.local');
  }
}

// 2. Skip husky installation
console.log('⏭ Skipping husky installation in StackBlitz...');

// 3. Create empty prisma/dev.db for SQLite
if (!existsSync('prisma')) {
  mkdirSync('prisma', { recursive: true });
}
if (!existsSync('prisma/dev.db')) {
  writeFileSync('prisma/dev.db', '');
  console.log('✅ Created empty SQLite database file');
}

// 4. Create .next directory if needed
if (!existsSync('.next')) {
  mkdirSync('.next', { recursive: true });
}

console.log('✅ StackBlitz environment ready!');
