import { xmlResponse, xmlUrlset, BASE } from "@/lib/sitemap-helpers";
import { curatedPairs } from "@/lib/comparisons";

export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  const now = new Date().toISOString();
  const urls = [
    {
      loc: `${BASE}/compare`,
      lastmod: now,
      changefreq: "weekly" as const,
      priority: 0.7,
    },
    ...curatedPairs().map((p) => ({
      loc: `${BASE}/compare/${p.slug}`,
      lastmod: now,
      changefreq: "weekly" as const,
      priority: 0.6,
    })),
  ];
  return xmlResponse(xmlUrlset(urls));
}
