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

export function featuredListings(limit = 6): Listing[] {
  return LISTINGS.filter((l) => l.featured).slice(0, limit);
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
