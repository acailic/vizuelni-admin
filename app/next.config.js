/**
 * Minimal Next.js Configuration for GitHub Pages Static Export
 */

const withMDX = require("@next/mdx")();

const isGitHubPages = process.env.NEXT_PUBLIC_BASE_PATH !== undefined;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

module.exports = withMDX({
  output: "export",
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  pageExtensions: ["js", "ts", "tsx", "mdx"],
});
