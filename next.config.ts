import type { NextConfig } from "next";

// Static export so the site can be served by GitHub Pages (maneet7805.github.io).
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
