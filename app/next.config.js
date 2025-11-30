/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration for testing
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Disable any experimental features that might cause issues
  },
  // Disable webpack optimizations that might cause issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};

module.exports = nextConfig;