import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "www.javbus.com",
      },
      {
        protocol: "https",
        hostname: "pics.dmm.co.jp",
      },
    ],
  },
};

export default nextConfig;
