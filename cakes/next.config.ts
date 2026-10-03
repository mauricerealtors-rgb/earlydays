import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Portfolio photos are hotlinked from vendors' own sites and Instagram, where
  // the host list is effectively unbounded. remotePatterns caps at 50 entries,
  // so every render point passes `unoptimized` and bypasses the allowlist
  // instead of us maintaining a losing list. Same decision as EarlyDays.
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.cakesghana.com" }],
        destination: "https://cakesghana.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
