import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only the Cloudflare backup build uses static export.
  ...(process.env.CF_STATIC_EXPORT === '1' ? { output: 'export' } : {}),
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
