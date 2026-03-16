const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const isStaticExport = Boolean(basePath);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: isStaticExport,

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@tanstack/react-query',
      'recharts',
    ],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'data.gov.rs',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'stats.data.gov.rs',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    unoptimized: isStaticExport,
  },

  async headers() {
    if (isStaticExport) {
      return [];
    }

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value:
              'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
          },
          {
            key: 'Content-Security-Policy',
            value:
              process.env.NODE_ENV === 'development'
                ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://data.gov.rs https://stats.data.gov.rs; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
                : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://data.gov.rs https://stats.data.gov.rs; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
          },
        ],
      },
    ];
  },

  async redirects() {
    if (isStaticExport) {
      return [];
    }

    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/dataset/:slug',
        destination: '/datasets/:slug',
        permanent: true,
      },
      {
        source: '/organization/:slug',
        destination: '/organizations/:slug',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    if (isStaticExport) {
      return [];
    }

    return {
      beforeFiles: [
        {
          source: '/api/datasets',
          destination: '/api/v1/datasets',
        },
        {
          source: '/api/organizations',
          destination: '/api/v1/organizations',
        },
      ],
    };
  },

  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_DATA_GOV_API_URL ||
      process.env.NEXT_PUBLIC_DATA_GOV_RS_API_URL,
    NEXT_PUBLIC_DEFAULT_LOCALE:
      process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'sr-Cyrl',
    NEXT_PUBLIC_ENABLE_DARK_MODE:
      process.env.NEXT_PUBLIC_ENABLE_DARK_MODE || 'true',
  },

  webpack: (config) => {
    return config;
  },

  eslint: {
    dirs: ['src'],
  },

  output: isStaticExport ? 'export' : 'standalone',
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = withNextIntl(nextConfig);
