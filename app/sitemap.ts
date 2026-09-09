import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Sitemap index — points to sub-sitemaps for each entity type.
 * Google prefers a sitemap index once you're serving more than a
 * handful of URL types.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();
  return [
    { url: `${SITE.url}/sitemaps/pages.xml`, lastModified: now },
    { url: `${SITE.url}/sitemaps/schools.xml`, lastModified: now },
    { url: `${SITE.url}/sitemaps/categories.xml`, lastModified: now },
    { url: `${SITE.url}/sitemaps/areas.xml`, lastModified: now },
    { url: `${SITE.url}/sitemaps/programme-areas.xml`, lastModified: now },
    { url: `${SITE.url}/sitemaps/guides.xml`, lastModified: now },
  ];
}
