import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true
  },
  transpilePackages: ["@travel-health/ui", "@travel-health/types"]
};

export default nextConfig;
