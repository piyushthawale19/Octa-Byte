import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize production builds
  compress: true,
  poweredByHeader: false,

  // Production deployment settings
  generateEtags: true,

  // Logging
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
};

export default nextConfig;
