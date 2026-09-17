import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Robots policy (guide §21, §26):
 *  - Allow all public pages, CSS and JS by default.
 *  - Explicitly welcome AI search crawlers (OAI-SearchBot for ChatGPT,
 *    PerplexityBot, ClaudeBot, Google-Extended for AI Overviews, etc.) —
 *    guide §26 says don't accidentally block them if we want to be
 *    discoverable in AI answers.
 *  - Disallow /api and /admin paths and query-string crawls.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/", "/admin/", "/*?*"];

  // Next.js serves generated assets with a cache-busting query string
  // (/icon.png?477019…, /opengraph-image?fcdb…, /_next/image?url=…), which
  // "/*?*" above would otherwise block. Google requires the favicon to be
  // crawlable or it shows a blank globe in results, and Twitterbot honours
  // robots.txt for card images. Google picks the longest matching rule, so each
  // of these outranks the 4-character "/*?*"; they are listed before the
  // disallows for crawlers that take the first match instead.
  const assets = [
    "/favicon.ico",
    "/icon.png",
    "/apple-icon.png",
    "/opengraph-image",
    "/*/opengraph-image",
    "/_next/image",
  ];

  return {
    rules: [
      { userAgent: "*", allow: [...assets, "/"], disallow },

      // Explicit allowlist for major AI crawlers. Redundant with "*: allow /",
      // but stating the intent explicitly protects us if we ever tighten
      // the wildcard rules later.
      { userAgent: "OAI-SearchBot", allow: ["/"] },
      { userAgent: "ChatGPT-User", allow: ["/"] },
      { userAgent: "GPTBot", allow: ["/"] },
      { userAgent: "ClaudeBot", allow: ["/"] },
      { userAgent: "anthropic-ai", allow: ["/"] },
      { userAgent: "PerplexityBot", allow: ["/"] },
      { userAgent: "Perplexity-User", allow: ["/"] },
      { userAgent: "Google-Extended", allow: ["/"] },
      { userAgent: "Applebot-Extended", allow: ["/"] },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
