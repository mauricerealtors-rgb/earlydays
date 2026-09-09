import { xmlResponse, xmlUrlset, BASE } from "@/lib/sitemap-helpers";
import { GUIDES } from "@/data/guides";

export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  const urls = [
    {
      loc: `${BASE}/guides`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly" as const,
      priority: 0.8,
    },
    ...GUIDES.map((g) => ({
      loc: `${BASE}/guides/${g.slug}`,
      lastmod: g.updatedAt,
      changefreq: "monthly" as const,
      priority: 0.7,
    })),
  ];
  return xmlResponse(xmlUrlset(urls));
}
