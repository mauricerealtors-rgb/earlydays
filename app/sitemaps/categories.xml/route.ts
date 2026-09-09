import { xmlResponse, xmlUrlset, BASE } from "@/lib/sitemap-helpers";
import { CATEGORIES } from "@/data/categories";
import { REGIONS } from "@/data/locations";
import { listingsByCategoryAndRegion } from "@/lib/query";

export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  const now = new Date().toISOString();
  const urls: {
    loc: string;
    lastmod: string;
    changefreq: "weekly";
    priority: number;
  }[] = [];

  for (const c of CATEGORIES) {
    urls.push({
      loc: `${BASE}/${c.slug}`,
      lastmod: now,
      changefreq: "weekly",
      priority: 0.8,
    });
    for (const r of REGIONS) {
      if (listingsByCategoryAndRegion(c.slug, r.slug).length > 0) {
        urls.push({
          loc: `${BASE}/${c.slug}/${r.slug}`,
          lastmod: now,
          changefreq: "weekly",
          priority: 0.7,
        });
      }
    }
  }

  return xmlResponse(xmlUrlset(urls));
}
