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
      { protocol: "https", hostname: "stgilespreschool.com" },
      { protocol: "https", hostname: "charischool.org" },
      { protocol: "https", hostname: "greenhavenschool.com" },
      { protocol: "https", hostname: "galaxy.edu.gh" },
      { protocol: "https", hostname: "eais-edu.com" },
      { protocol: "https", hostname: "noblesmontessori.com" },
      { protocol: "https", hostname: "afaccra.com" },
      { protocol: "https", hostname: "afaccra.org" },
      { protocol: "https", hostname: "themaverickschool.edu.gh" },
      { protocol: "https", hostname: "www.themaverickschool.edu.gh" },
      { protocol: "https", hostname: "merryjourneymontessorischool.com" },
      { protocol: "https", hostname: "www.merryjourneymontessorischool.com" },
      { protocol: "https", hostname: "kasadelengua.com" },
    ],
  },
};

export default config;
