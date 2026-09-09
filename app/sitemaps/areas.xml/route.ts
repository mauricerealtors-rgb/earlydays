import { xmlResponse, xmlUrlset, BASE } from "@/lib/sitemap-helpers";
import { REGIONS, LOCATIONS } from "@/data/locations";
import { listingsByRegion, listingsByLocation } from "@/lib/query";

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

  for (const r of REGIONS) {
    if (listingsByRegion(r.slug).length > 0) {
      urls.push({
        loc: `${BASE}/schools/${r.slug}`,
        lastmod: now,
        changefreq: "weekly",
        priority: 0.7,
      });
    }
  }

  for (const l of LOCATIONS) {
    if (listingsByLocation(l.slug).length > 0) {
      urls.push({
        loc: `${BASE}/schools/${l.region}/${l.slug}`,
        lastmod: now,
        changefreq: "weekly",
        priority: 0.7,
      });
    }
  }

  return xmlResponse(xmlUrlset(urls));
}
