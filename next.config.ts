import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  agentRules: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      // School websites — direct image URLs from official school sites,
      // used with attribution while we transition to first-party storage.
      { protocol: "https", hostname: "justlikemamadaycare.com" },
      { protocol: "https", hostname: "www.justlikemamadaycare.com" },
      { protocol: "https", hostname: "static.wixstatic.com" },
    ],
  },
};

export default config;
