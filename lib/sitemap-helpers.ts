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
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap-0.9">\n${items}\n</urlset>\n`;
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
