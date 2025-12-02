/**
 * Working Next.js Configuration for Development
 * Simplified to avoid path resolution issues
 */

const pkg = require("./package.json");

// Populate build-time variables
process.env.NEXT_PUBLIC_VERSION = `v${pkg.version}`;
process.env.NEXT_PUBLIC_GITHUB_REPO = pkg.repository.url.replace(
  /(\/|\.git)$/,
  ""
);

module.exports = {
  // Basic Next.js config
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Basic optimizations
  swcMinify: true,
  productionBrowserSourceMaps: false,

  pageExtensions: ["js", "ts", "tsx", "mdx"],

  // Simple webpack config
  webpack(config, { dev, isServer }) {
    // Basic alias for mapbox
    config.resolve.alias = {
      ...config.resolve.alias,
      "mapbox-gl": "maplibre-gl",
    };

    // Basic fallbacks for browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
      };
    }

    return config;
  },

  // Disable eslint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript checking for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // Logging
  logging: {
    level: "error",
    fetches: {
      fullUrl: true,
    },
  },
};
