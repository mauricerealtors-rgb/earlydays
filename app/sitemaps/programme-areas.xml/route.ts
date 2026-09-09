import { xmlResponse, xmlUrlset, BASE } from "@/lib/sitemap-helpers";
import { CATEGORIES } from "@/data/categories";
import { LOCATIONS } from "@/data/locations";
import { listingsByCategoryAndLocation } from "@/lib/query";

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

  // Programme + region + area — only where a real listing exists
  // (guide §16: no thin programmatic pages)
  for (const c of CATEGORIES) {
    for (const l of LOCATIONS) {
      if (listingsByCategoryAndLocation(c.slug, l.slug).length > 0) {
        urls.push({
          loc: `${BASE}/${c.slug}/${l.region}/${l.slug}`,
          lastmod: now,
          changefreq: "weekly",
          priority: 0.6,
        });
      }
    }
  }

  return xmlResponse(xmlUrlset(urls));
}
