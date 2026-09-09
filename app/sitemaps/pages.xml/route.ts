import { xmlResponse, xmlUrlset, BASE } from "@/lib/sitemap-helpers";

export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  const now = new Date().toISOString();
  const urls = [
    { loc: `${BASE}/`, lastmod: now, changefreq: "daily" as const, priority: 1.0 },
    { loc: `${BASE}/schools`, lastmod: now, changefreq: "daily" as const, priority: 0.9 },
    { loc: `${BASE}/guides`, lastmod: now, changefreq: "weekly" as const, priority: 0.8 },
    { loc: `${BASE}/for-schools`, lastmod: now, changefreq: "monthly" as const, priority: 0.6 },
    { loc: `${BASE}/claim`, lastmod: now, changefreq: "monthly" as const, priority: 0.5 },
    { loc: `${BASE}/about`, lastmod: now, changefreq: "monthly" as const, priority: 0.5 },
    { loc: `${BASE}/contact`, lastmod: now, changefreq: "monthly" as const, priority: 0.5 },
  ];
  return xmlResponse(xmlUrlset(urls));
}
