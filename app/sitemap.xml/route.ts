import { xmlResponse, xmlSitemapIndex, BASE } from "@/lib/sitemap-helpers";

export const dynamic = "force-static";
export const revalidate = 3600;

/**
 * Sitemap index — points to sub-sitemaps for each entity type.
 *
 * This is a route handler rather than app/sitemap.ts because Next's metadata
 * convention can only emit a <urlset>. Served as a urlset, these seven links
 * read to Google as ordinary pages and the sitemaps behind them are never
 * opened, so no school, area or guide URL is discovered through here.
 */
const CHILDREN = [
  "pages",
  "schools",
  "categories",
  "areas",
  "programme-areas",
  "guides",
  "comparisons",
];

export function GET() {
  return xmlResponse(
    xmlSitemapIndex(CHILDREN.map((name) => `${BASE}/sitemaps/${name}.xml`))
  );
}
