import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";
import { allListings } from "@/lib/query";
import { CATEGORIES } from "@/data/categories";
import { LOCATIONS } from "@/data/locations";
import { GUIDES } from "@/data/guides";

export const dynamic = "force-static";
export const revalidate = 3600;

/**
 * llms.txt — supplementary machine-readable pointer for AI systems.
 *
 * Google says AI features rely on foundational SEO (see /robots.txt and
 * sitemap.xml). This file is optional per Google guidance, but a growing
 * number of LLM crawlers use it to build a compact, canonical index of
 * the site's important entities and content.
 *
 * We keep it terse, entity-first, and always in sync with the same source
 * of truth as the rest of the app.
 */
export function GET() {
  const listings = allListings();
  const lines: string[] = [];

  lines.push(`# ${SITE.name}`);
  lines.push("");
  lines.push(`> ${SITE.tagline}`);
  lines.push("");
  lines.push(
    "EarlyDays is a parent-first discovery platform for children's schools, learning centres and children's activities across Ghana. Every listing is source-traceable, verification-tagged and honest — we never invent fees, phone numbers, curriculum, or contact details."
  );
  lines.push("");
  lines.push("## Site");
  lines.push(`- Home: ${SITE.url}/`);
  lines.push(`- Search all schools: ${SITE.url}/schools`);
  lines.push(`- All programmes: ${SITE.url}/schools`);
  lines.push(`- Parent guides: ${SITE.url}/guides`);
  lines.push(`- For schools (claim your profile): ${SITE.url}/for-schools`);
  lines.push(`- About: ${SITE.url}/about`);
  lines.push("");

  lines.push("## Programmes");
  for (const c of CATEGORIES) {
    lines.push(`- ${c.plural}: ${SITE.url}/${c.slug}`);
  }
  lines.push("");

  lines.push("## Areas");
  const accraLocs = LOCATIONS.filter((l) => l.region === "accra");
  for (const l of accraLocs) {
    lines.push(`- Schools in ${l.name}: ${SITE.url}/schools/${l.region}/${l.slug}`);
  }
  lines.push("");

  lines.push("## Schools");
  for (const s of listings) {
    const short = s.shortDescription.replace(/\n+/g, " ").slice(0, 160);
    lines.push(
      `- ${s.name} (${s.neighbourhood.replace(/-/g, " ")}, ${s.region}): ${short} — ${SITE.url}/schools/${s.slug}`
    );
  }
  lines.push("");

  lines.push("## Guides");
  for (const g of GUIDES) {
    lines.push(`- ${g.title}: ${SITE.url}/guides/${g.slug}`);
  }
  lines.push("");

  lines.push("## Data honesty");
  lines.push(
    "Listings carry an explicit verification state: unverified, info-confirmed, claimed, or verified. Where a fact is unknown, the profile shows 'Not published' rather than a guess. Fees are shown only when the school itself has published a number."
  );
  lines.push("");

  lines.push("## Contact");
  lines.push(`- Website: ${SITE.url}`);
  lines.push(`- Sitemap: ${SITE.url}/sitemap.xml`);
  lines.push(`- Robots: ${SITE.url}/robots.txt`);
  lines.push("");

  return new NextResponse(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
