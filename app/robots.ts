import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Robots policy (guide §21, §26):
 *  - Allow all public pages, CSS and JS by default.
 *  - Do NOT block OAI-SearchBot (ChatGPT search discovery).
 *  - Disallow query/filter parameter URLs to avoid crawl waste.
 *  - Disallow /api and /admin paths.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/api/", "/admin/", "/*?*"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
