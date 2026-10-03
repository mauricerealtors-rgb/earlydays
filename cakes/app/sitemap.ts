import type { MetadataRoute } from "next";
import { AREAS, REGIONS } from "@/data/areas";
import { KINDS, OCCASIONS } from "@/data/categories";
import { VENDORS, areasWithVendors } from "@/data/vendors";
import { SITE } from "@/lib/site";

/**
 * Only pages with something on them.
 *
 * Areas with no baker are excluded rather than shipped as empty pages — that is
 * the "crawled, currently not indexed" trap EarlyDays fell into with its
 * comparison grid, and it costs crawl budget on the pages that do matter.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => `${SITE.url}${p}`;
  const now = new Date();

  const liveRegions = new Set(
    VENDORS.map((v) => AREAS.find((a) => a.slug === v.area)?.region),
  );

  return [
    { url: url("/"), lastModified: now, priority: 1 },
    { url: url("/prices"), lastModified: now, priority: 0.9 },
    { url: url("/for-bakers"), lastModified: now, priority: 0.6 },
    ...[...OCCASIONS, ...KINDS].map((c) => ({
      url: url(`/${c.slug}`),
      lastModified: now,
      priority: 0.8,
    })),
    ...areasWithVendors(AREAS.map((a) => a.slug)).map((slug) => ({
      url: url(`/cakes-in/${slug}`),
      lastModified: now,
      priority: 0.8,
    })),
    ...REGIONS.filter((r) => liveRegions.has(r.slug)).map((r) => ({
      url: url(`/region/${r.slug}`),
      lastModified: now,
      priority: 0.7,
    })),
    ...VENDORS.map((v) => ({
      url: url(`/bakers/${v.slug}`),
      lastModified: v.updatedAt ? new Date(v.updatedAt) : now,
      priority: 0.7,
    })),
  ];
}
