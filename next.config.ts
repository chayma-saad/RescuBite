import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Allow external fonts in CSP
  async headers() {
    return [];
  },
};

export default nextConfig;
