export const SITE = {
  name: "EarlyDays",
  tagline: "Find the right place for your child in Ghana.",
  description:
    "Discover creches, preschools, kindergartens, primary schools and children's learning centres across Ghana. Parent-first search, honest profiles, made for busy families.",
  // Canonical production URL. All canonicals, JSON-LD @id, sitemap URLs,
  // OG tags and metadataBase derive from this — override in Vercel with
  // NEXT_PUBLIC_SITE_URL if you point another domain at the app.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://earlydays.cc").replace(/\/$/, ""),
  domain: "earlydays.cc",
  locale: "en_GH",
  region: "Ghana",
  twitter: "@earlydays",
};

export function absoluteUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${p}`;
}
