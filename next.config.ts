import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/en/modes/halloween-the-game-crossplay",
        destination: "/crossplay",
        statusCode: 301
      }
    ];
  },
  images: {
    unoptimized: true
  }
};

export default nextConfig;
