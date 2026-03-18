import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const isStaticExport =
  process.env.NEXT_PUBLIC_STATIC_MODE === 'true' || Boolean(basePath);

const nextConfig = {
  reactStrictMode: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: isStaticExport,
  output: isStaticExport ? 'export' : 'standalone',
  poweredByHeader: false,
  compress: true,

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
      {
        protocol: 'https',
        hostname: 'opendata.stat.gov.rs',
        pathname: '/**',
      },
    ],
    unoptimized: isStaticExport,
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  experimental: {
    optimizePackageImports: [
      '@tanstack/react-query',
      'd3',
      'lucide-react',
      'recharts',
    ],
  },

  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_DATA_GOV_API_URL,
    NEXT_PUBLIC_DEFAULT_LOCALE:
      process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'sr-Cyrl',
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
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
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
    ];
  },

  async rewrites() {
    if (isStaticExport) {
      return [];
    }

    return [];
  },
};

export default withNextIntl(nextConfig);
