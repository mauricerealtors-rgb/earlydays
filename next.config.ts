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
      // Second-batch schools (Sep 2026 launch expansion).
      { protocol: "https", hostname: "safarischool.edu.gh" },
      { protocol: "https", hostname: "www.littlehandsgh.com" },
      { protocol: "https", hostname: "theromanridgeschool.org" },
      { protocol: "http", hostname: "theromanridgeschool.org" },
      { protocol: "https", hostname: "gis.edu.gh" },
      { protocol: "https", hostname: "lbisonline.com" },
      { protocol: "https", hostname: "images.squarespace-cdn.com" },
      { protocol: "https", hostname: "www.twinkletotsgh.com" },
      { protocol: "https", hostname: "rcs.edu.gh" },
      { protocol: "https", hostname: "hcagh.com" },
      { protocol: "https", hostname: "www.tis.edu.gh" },
      { protocol: "https", hostname: "www.gams.edu.gh" },
      { protocol: "https", hostname: "alphabeta.edu.gh" },
      { protocol: "https", hostname: "kentinternationaledu.com" },
      { protocol: "https", hostname: "makersplacegh.com" },
      // Third-batch schools (Sep 2026 expansion 2).
      { protocol: "https", hostname: "www.lincoln.edu.gh" },
      { protocol: "https", hostname: "lincoln.edu.gh" },
      { protocol: "https", hostname: "citylightsinternational.edu.gh" },
      { protocol: "https", hostname: "www.citylightsinternational.edu.gh" },
      { protocol: "https", hostname: "minimemontessorischool.com" },
      { protocol: "https", hostname: "www.minimemontessorischool.com" },
      { protocol: "https", hostname: "healthymindschool.net" },
      { protocol: "https", hostname: "www.healthymindschool.net" },
      { protocol: "https", hostname: "wonderworldinternationalschool.com" },
      { protocol: "https", hostname: "www.wonderworldinternationalschool.com" },
      // East Legon rank-boost batch.
      { protocol: "https", hostname: "lotus.edu.gh" },
      { protocol: "https", hostname: "www.lotus.edu.gh" },
      { protocol: "https", hostname: "littlelegends.edu.gh" },
      { protocol: "https", hostname: "www.littlelegends.edu.gh" },
      { protocol: "https", hostname: "oneheart.academy" },
      { protocol: "https", hostname: "www.oneheart.academy" },
      // Cloudinary — school-uploaded photos from the dashboard.
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  // www served the entire site on a 200 alongside the apex, so every page
  // existed at two hosts. Canonical tags pointed at the apex, which is a hint
  // rather than a rule, and Search Console treats a sitemap on a different host
  // from the property as cross-host and refuses to read it.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.earlydays.cc" }],
        destination: "https://earlydays.cc/:path*",
        permanent: true,
      },
    ];
  },
};

export default config;
