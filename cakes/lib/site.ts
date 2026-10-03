export const SITE = {
  name: "CakesGhana",
  tagline: "Find and compare cake makers across Ghana.",
  description:
    "Browse cake makers in Accra, Kumasi, Takoradi and across Ghana. Compare real portfolios, lead times and delivery areas, then request quotes from several bakers at once — free.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://cakesghana.com").replace(/\/$/, ""),
  domain: "cakesghana.com",
  locale: "en_GH",
  region: "Ghana",
  email: "hello@cakesghana.com",
  instagram: "cakesghana",
  instagramUrl: "https://instagram.com/cakesghana",
};

export function absoluteUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${p}`;
}

/** Ghana cedi, no decimals — nobody quotes a cake in pesewas. */
export function money(cedis: number): string {
  return `GH₵${cedis.toLocaleString("en-GH")}`;
}
