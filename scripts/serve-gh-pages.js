#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuration
const PORT = process.env.PORT || 3000;
const BASE_PATH = '/vizualni-admin';
const OUT_DIR = path.join(__dirname, '..', 'out');

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json',
};

function findExistingPath(pathname) {
  const normalizedPath =
    pathname === '/' ? '' : pathname.replace(/^\/+/, '').replace(/\/+$/, '');

  const candidates =
    normalizedPath === ''
      ? [path.join(OUT_DIR, 'index.html')]
      : path.extname(normalizedPath)
        ? [path.join(OUT_DIR, normalizedPath)]
        : [
            path.join(OUT_DIR, normalizedPath, 'index.html'),
            path.join(OUT_DIR, `${normalizedPath}.html`),
            path.join(OUT_DIR, normalizedPath),
          ];

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

if (!fs.existsSync(OUT_DIR)) {
  console.error(
    'Missing ./out directory. Run `npm run build:gh-pages-local` first.'
  );
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname || '/';

  if (pathname.startsWith(BASE_PATH)) {
    pathname = pathname.slice(BASE_PATH.length) || '/';
  }

  const filePath = findExistingPath(pathname);
  const ext = path.extname(pathname);
  const isStaticAsset = ext in MIME_TYPES;

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(
      `<h1>404 - File Not Found</h1><p>URL: ${pathname}</p><p>Static asset: ${isStaticAsset}</p>`
    );
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end('<h1>500 - Unable to Read File</h1>');
      return;
    }

    const resolvedExt = path.extname(filePath);
    const contentType = MIME_TYPES[resolvedExt] || 'text/plain';
    const headers = {
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    };

    if (isStaticAsset || resolvedExt !== '.html') {
      headers['Cache-Control'] = 'public, max-age=31536000'; // 1 year
    }

    res.writeHead(200, headers);
    res.end(data);
  });
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nSIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 GitHub Pages Preview Server running at:`);
  console.log(`   Local:   http://localhost:${PORT}${BASE_PATH}/`);
  console.log(`   Network: http://localhost:${PORT}${BASE_PATH}/`);
  console.log(`\n💡 This simulates GitHub Pages deployment locally`);
  console.log(`\nPress Ctrl+C to stop\n`);
});
