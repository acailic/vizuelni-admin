#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.join(__dirname, '..');
const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'sr-Cyrl';
const basePath = '/vizualni-admin';
const outDir = path.join(projectRoot, 'out');
const disabledPaths = [
  {
    active: path.join(projectRoot, 'src', 'app', 'api'),
    parked: path.join(
      projectRoot,
      'src',
      'app',
      '__api-static-export-disabled'
    ),
  },
  {
    active: path.join(projectRoot, 'src', 'app', 'embed'),
    parked: path.join(
      projectRoot,
      'src',
      'app',
      '__embed-static-export-disabled'
    ),
  },
  {
    active: path.join(projectRoot, 'src', 'app', '[locale]', 'browse'),
    parked: path.join(
      projectRoot,
      'src',
      'app',
      '[locale]',
      '__browse-static-export-disabled'
    ),
  },
  {
    active: path.join(projectRoot, 'src', 'app', '[locale]', 'charts'),
    parked: path.join(
      projectRoot,
      'src',
      'app',
      '[locale]',
      '__charts-static-export-disabled'
    ),
  },
  {
    active: path.join(projectRoot, 'src', 'app', '[locale]', 'create'),
    parked: path.join(
      projectRoot,
      'src',
      'app',
      '[locale]',
      '__create-static-export-disabled'
    ),
  },
  {
    active: path.join(projectRoot, 'src', 'app', '[locale]', 'dashboard'),
    parked: path.join(
      projectRoot,
      'src',
      'app',
      '[locale]',
      '__dashboard-static-export-disabled'
    ),
  },
  {
    active: path.join(projectRoot, 'src', 'app', '[locale]', 'v'),
    parked: path.join(
      projectRoot,
      'src',
      'app',
      '[locale]',
      '__visualization-static-export-disabled'
    ),
  },
  {
    active: path.join(projectRoot, 'src', 'app', '[locale]', 'browse', '[id]'),
    parked: path.join(
      projectRoot,
      'src',
      'app',
      '[locale]',
      'browse',
      '__detail-static-export-disabled'
    ),
  },
  {
    active: path.join(
      projectRoot,
      'src',
      'app',
      '[locale]',
      'dashboard',
      '[id]'
    ),
    parked: path.join(
      projectRoot,
      'src',
      'app',
      '[locale]',
      'dashboard',
      '__detail-static-export-disabled'
    ),
  },
  {
    active: path.join(projectRoot, 'src', 'app', '[locale]', 'gallery', '[id]'),
    parked: path.join(
      projectRoot,
      'src',
      'app',
      '[locale]',
      'gallery',
      '__detail-static-export-disabled'
    ),
  },
  {
    active: path.join(projectRoot, 'src', 'app', '[locale]', 'v', '[id]'),
    parked: path.join(
      projectRoot,
      'src',
      'app',
      '[locale]',
      'v',
      '__detail-static-export-disabled'
    ),
  },
];

const renamedPaths = [];

function parkPath({ active, parked }) {
  if (!fs.existsSync(active)) {
    return;
  }

  if (fs.existsSync(parked)) {
    throw new Error(`Temporary export path already exists: ${parked}`);
  }

  fs.renameSync(active, parked);
  renamedPaths.push({ active, parked });
}

function restorePaths() {
  for (const entry of renamedPaths.reverse()) {
    if (fs.existsSync(entry.parked)) {
      fs.renameSync(entry.parked, entry.active);
    }
  }
}

function writeRootRedirect() {
  const targetPath = `${basePath}/${defaultLocale}/`;
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=${targetPath}" />
    <link rel="canonical" href="${targetPath}" />
    <title>Vizualni Admin</title>
  </head>
  <body>
    <p>Redirecting to <a href="${targetPath}">${targetPath}</a>...</p>
  </body>
</html>
`;

  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
}

try {
  disabledPaths.forEach(parkPath);

  execSync('next build', {
    cwd: projectRoot,
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_PUBLIC_BASE_PATH: basePath,
      NODE_ENV: 'production',
    },
  });

  if (fs.existsSync(outDir)) {
    writeRootRedirect();
  }
} catch (error) {
  console.error('\n❌ GitHub Pages build failed:', error.message);
  process.exitCode = 1;
} finally {
  restorePaths();
}
