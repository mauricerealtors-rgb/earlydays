import { LISTINGS } from "@/data/listings";
import { CATEGORIES, findCategory, findCategoryByType } from "@/data/categories";
import {
  LOCATIONS,
  REGIONS,
  findLocation,
  findRegion,
  locationsInRegion,
} from "@/data/locations";
import type { Category, Listing, Location, ListingType } from "./types";

export {
  CATEGORIES,
  LOCATIONS,
  REGIONS,
  findCategory,
  findCategoryByType,
  findLocation,
  findRegion,
  locationsInRegion,
};

export function allListings(): Listing[] {
  return LISTINGS;
}

export function findListing(slug: string): Listing | undefined {
  return LISTINGS.find((l) => l.slug === slug);
}

/**
 * Schools for the "worth a closer look" rail.
 *
 * Only 16 listings carry the hand-set `featured` flag, which is not enough to
 * fill a paged grid. So those come first, and the rest of the pool is ranked
 * by the two things the section actually claims to sort on: how complete the
 * profile is, and how recently it was checked. A school with photos, fees and
 * a website is genuinely more useful to a parent than one with a phone number,
 * so this ordering is the honest version of the copy above the grid.
 */
export function featuredListings(limit = 6): Listing[] {
  const flagged = LISTINGS.filter((l) => l.featured);
  if (flagged.length >= limit) return flagged.slice(0, limit);

  const seen = new Set(flagged.map((l) => l.slug));
  const rest = LISTINGS.filter((l) => !seen.has(l.slug))
    .map((l) => ({ l, rank: usefulness(l) }))
    .filter((x) => x.rank > 0)
    .sort((a, b) => b.rank - a.rank || (b.l.updatedAt ?? "").localeCompare(a.l.updatedAt ?? ""))
    .map((x) => x.l);

  return [...flagged, ...rest].slice(0, limit);
}

/** How much a parent can learn from this profile without phoning. */
function usefulness(l: Listing): number {
  let n = 0;
  if (l.images?.length) n += 4;
  if (l.feesHint) n += 3;
  if (l.website) n += 2;
  if (l.hours) n += 2;
  if (l.curriculum.length) n += 1;
  if (l.email) n += 1;
  if (l.address) n += 1;
  if (l.description && l.description.length > 220) n += 1;
  return n;
}

export function listingsByCategory(slug: string): Listing[] {
  const cat = findCategory(slug);
  if (!cat) return [];
  return LISTINGS.filter((l) => l.listingTypes.includes(cat.listingType));
}

export function listingsByType(type: ListingType): Listing[] {
  return LISTINGS.filter((l) => l.listingTypes.includes(type));
}

export function listingsByLocation(locationSlug: string): Listing[] {
  return LISTINGS.filter((l) => l.neighbourhood === locationSlug);
}

export function listingsByRegion(regionSlug: string): Listing[] {
  return LISTINGS.filter((l) => l.city === regionSlug);
}

export function listingsByCategoryAndLocation(
  categorySlug: string,
  locationSlug: string
): Listing[] {
  const cat = findCategory(categorySlug);
  if (!cat) return [];
  return LISTINGS.filter(
    (l) =>
      l.listingTypes.includes(cat.listingType) &&
      l.neighbourhood === locationSlug
  );
}

export function listingsByCategoryAndRegion(
  categorySlug: string,
  regionSlug: string
): Listing[] {
  const cat = findCategory(categorySlug);
  if (!cat) return [];
  return LISTINGS.filter(
    (l) => l.listingTypes.includes(cat.listingType) && l.city === regionSlug
  );
}

/**
 * A category+area page should only be indexed if it has meaningful content.
 * Per the guide's programmatic SEO rules: no thin, empty pages.
 */
export function hasMeaningfulResults(count: number): boolean {
  return count >= 1;
}

export function relatedListings(listing: Listing, limit = 4): Listing[] {
  return LISTINGS.filter(
    (l) =>
      l.id !== listing.id &&
      (l.neighbourhood === listing.neighbourhood ||
        l.listingTypes.some((t) => listing.listingTypes.includes(t)))
  ).slice(0, limit);
}

export function locationsWithListings(): Location[] {
  const set = new Set(LISTINGS.map((l) => l.neighbourhood));
  return LOCATIONS.filter((l) => set.has(l.slug));
}

export function categoriesWithListings(): Category[] {
  return CATEGORIES.filter((c) =>
    LISTINGS.some((l) => l.listingTypes.includes(c.listingType))
  );
}

export function categoryCounts(): Record<string, number> {
  return Object.fromEntries(
    CATEGORIES.map((c) => [c.slug, listingsByCategory(c.slug).length])
  );
}

export function locationCounts(): Record<string, number> {
  return Object.fromEntries(
    LOCATIONS.map((l) => [l.slug, listingsByLocation(l.slug).length])
  );
}
