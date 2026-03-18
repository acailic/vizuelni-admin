#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.join(__dirname, '..');
const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'sr-Cyrl';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/vizuelni-admin';
const outDir = path.join(projectRoot, 'out');
const parkedRoot = path.join(projectRoot, '.static-export-disabled');
const disabledPaths = [
  path.join(projectRoot, 'src', 'app', 'api'),
  path.join(projectRoot, 'src', 'app', 'embed'),
  path.join(projectRoot, 'src', 'app', '[locale]', 'browse'),
  path.join(projectRoot, 'src', 'app', '[locale]', 'charts'),
  path.join(projectRoot, 'src', 'app', '[locale]', 'create'),
  path.join(projectRoot, 'src', 'app', '[locale]', 'dashboard'),
  path.join(projectRoot, 'src', 'app', '[locale]', 'gallery'),
  path.join(projectRoot, 'src', 'app', '[locale]', 'login'),
  path.join(projectRoot, 'src', 'app', '[locale]', 'profile'),
  path.join(projectRoot, 'src', 'app', '[locale]', 'statistics'),
  path.join(projectRoot, 'src', 'app', '[locale]', 'v'),
  path.join(projectRoot, 'src', 'app', '[locale]', 'browse', '[id]'),
  path.join(projectRoot, 'src', 'app', '[locale]', 'dashboard', '[id]'),
  path.join(projectRoot, 'src', 'app', '[locale]', 'gallery', '[id]'),
  path.join(projectRoot, 'src', 'app', '[locale]', 'v', '[id]'),
];

const renamedPaths = [];

function getParkedPath(active) {
  return path.join(parkedRoot, path.relative(projectRoot, active));
}

function parkPath(active) {
  if (!fs.existsSync(active)) {
    return;
  }

  const parked = getParkedPath(active);

  if (fs.existsSync(parked)) {
    throw new Error(`Temporary export path already exists: ${parked}`);
  }

  fs.mkdirSync(path.dirname(parked), { recursive: true });
  fs.renameSync(active, parked);
  renamedPaths.push({ active, parked });
}

function restorePaths() {
  for (const entry of renamedPaths.reverse()) {
    if (fs.existsSync(entry.parked)) {
      fs.mkdirSync(path.dirname(entry.active), { recursive: true });
      fs.renameSync(entry.parked, entry.active);
    }
  }

  fs.rmSync(parkedRoot, { recursive: true, force: true });
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

function writeNoJekyllMarker() {
  fs.writeFileSync(path.join(outDir, '.nojekyll'), '', 'utf8');
}

try {
  disabledPaths.forEach(parkPath);

  execSync('next build', {
    cwd: projectRoot,
    stdio: 'inherit',
    env: {
      ...process.env,
      BUILD_MODE: 'static',
      DEMO_MODE: 'true',
      NEXT_PUBLIC_BASE_PATH: basePath,
      NEXT_PUBLIC_STATIC_MODE: 'true',
      NEXT_PUBLIC_DEMO_MODE: 'true',
      NEXT_PUBLIC_AUTH_ENABLED: 'false',
      NEXT_PUBLIC_SAVE_ENABLED: 'false',
      NODE_ENV: 'production',
    },
  });

  if (fs.existsSync(outDir)) {
    writeRootRedirect();
    writeNoJekyllMarker();
  }
} catch (error) {
  console.error('\n❌ GitHub Pages build failed:', error.message);
  process.exitCode = 1;
} finally {
  restorePaths();
}
