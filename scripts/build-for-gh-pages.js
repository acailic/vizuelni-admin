#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏗️  Building for GitHub Pages...\n');

const projectRoot = path.join(__dirname, '..');
const outDir = path.join(projectRoot, 'out');

try {
  console.log('1. Building static export with GitHub Pages base path...');
  execSync('npm run build:gh-pages', {
    cwd: projectRoot,
    stdio: 'inherit',
  });

  if (!fs.existsSync(outDir)) {
    throw new Error('Expected export output at ./out/');
  }

  console.log('\n✅ Build complete!');
  console.log('📁 Files ready at: ./out/');
  console.log('\n🚀 To test locally, run:');
  console.log('   npm run serve:gh-pages');
  console.log('   Then visit: http://localhost:3000/vizualni-admin/');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
