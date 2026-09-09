import { xmlResponse, xmlUrlset, BASE } from "@/lib/sitemap-helpers";
import { allListings } from "@/lib/query";

export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  const urls = allListings().map((s) => ({
    loc: `${BASE}/schools/${s.slug}`,
    lastmod: s.updatedAt,
    changefreq: "weekly" as const,
    priority: 0.8,
  }));
  return xmlResponse(xmlUrlset(urls));
}
