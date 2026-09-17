import { SITE } from "./site";

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

// Note the slash: "sitemap/0.9". Google rejects a sitemap whose namespace is
// wrong, so a typo here silently invalidates every sitemap on the site.
const SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9";

export function xmlUrlset(urls: SitemapUrl[]): string {
  const now = new Date().toISOString();
  const items = urls
    .map(
      (u) =>
        `  <url><loc>${escapeXml(u.loc)}</loc>` +
        `<lastmod>${u.lastmod ?? now}</lastmod>` +
        (u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : "") +
        (u.priority !== undefined ? `<priority>${u.priority.toFixed(1)}</priority>` : "") +
        `</url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="${SITEMAP_NS}">\n${items}\n</urlset>\n`;
}

// A sitemap index lists other sitemaps. It is a different document from a
// urlset — <sitemapindex>/<sitemap> rather than <urlset>/<url> — and Google only
// opens the children when it receives the former.
export function xmlSitemapIndex(locs: string[], lastmod?: string): string {
  const stamp = lastmod ?? new Date().toISOString();
  const items = locs
    .map((loc) => `  <sitemap><loc>${escapeXml(loc)}</loc><lastmod>${stamp}</lastmod></sitemap>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="${SITEMAP_NS}">\n${items}\n</sitemapindex>\n`;
}

export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const BASE = SITE.url;
