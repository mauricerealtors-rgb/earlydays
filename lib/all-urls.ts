import { SITE } from "./site";
import { allListings } from "./query";
import { CATEGORIES } from "@/data/categories";
import { LOCATIONS, REGIONS } from "@/data/locations";
import { GUIDES } from "@/data/guides";
import { listingsByCategoryAndLocation } from "./query";
import { indexablePairs } from "./comparisons";

/**
 * Every canonical, indexable URL on the public site. Used by the
 * IndexNow submitter (also handy if we ever need a full URL audit).
 * Preview routes and admin/school-dashboard routes are excluded
 * because they're noindex.
 */
export function allSiteUrls(): string[] {
  const b = SITE.url;
  const urls = new Set<string>();

  // Static pages
  const staticPaths = [
    "/",
    "/schools",
    "/guides",
    "/for-schools",
    "/concierge",
    "/claim",
    "/about",
    "/contact",
    "/compare",
    "/saved",
    "/privacy",
    "/terms",
  ];
  for (const p of staticPaths) urls.add(`${b}${p}`);

  // Categories (top-level)
  for (const c of CATEGORIES) {
    urls.add(`${b}/${c.slug}`);
    // Categories per region root
    for (const r of REGIONS) {
      urls.add(`${b}/${c.slug}/${r.slug}`);
    }
  }

  // Region pages
  for (const r of REGIONS) urls.add(`${b}/schools/${r.slug}`);

  // Programme + region + area combos (only where listings exist)
  for (const c of CATEGORIES) {
    for (const l of LOCATIONS) {
      if (listingsByCategoryAndLocation(c.slug, l.slug).length > 0) {
        urls.add(`${b}/${c.slug}/${l.region}/${l.slug}`);
      }
    }
  }

  // Individual listings + their area sub-pages
  for (const s of allListings()) {
    urls.add(`${b}/schools/${s.slug}`);
    const loc = LOCATIONS.find((l) => l.slug === s.neighbourhood);
    if (loc) urls.add(`${b}/schools/${loc.region}/${loc.slug}`);
  }

  // Guides
  for (const g of GUIDES) urls.add(`${b}/guides/${g.slug}`);

  // School-vs-school comparisons
  for (const p of indexablePairs()) urls.add(`${b}/compare/${p.slug}`);

  return Array.from(urls);
}
