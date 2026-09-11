import type { Listing } from "./types";

export interface AreaStats {
  count: number;
  ageMinMonths?: number;
  ageMaxMonths?: number;
  ageLabel?: string;
  curricula: string[];
  services: string[];
  listingsWithFees: Listing[];
  transportListings: Listing[];
  mealsListings: Listing[];
  namesByCurriculum: Record<string, string[]>;
  youngestListing?: Listing;
  oldestListing?: Listing;
}

const MONTHS_PER_YEAR = 12;

function monthsToLabel(m: number): string {
  if (m < 12) return `${m} months`;
  const years = Math.floor(m / MONTHS_PER_YEAR);
  const months = m % MONTHS_PER_YEAR;
  if (months === 0) return `${years} years`;
  return `${years} years ${months} months`;
}

export function computeAreaStats(listings: Listing[]): AreaStats {
  const stats: AreaStats = {
    count: listings.length,
    curricula: [],
    services: [],
    listingsWithFees: [],
    transportListings: [],
    mealsListings: [],
    namesByCurriculum: {},
  };
  if (listings.length === 0) return stats;

  const curriculaSet = new Set<string>();
  const servicesSet = new Set<string>();
  let minAge: number | undefined;
  let maxAge: number | undefined;
  let youngest: Listing | undefined;
  let oldest: Listing | undefined;

  for (const l of listings) {
    if (typeof l.ageMin === "number") {
      if (minAge === undefined || l.ageMin < minAge) {
        minAge = l.ageMin;
        youngest = l;
      }
    }
    if (typeof l.ageMax === "number") {
      if (maxAge === undefined || l.ageMax > maxAge) {
        maxAge = l.ageMax;
        oldest = l;
      }
    }
    for (const c of l.curriculum) {
      curriculaSet.add(c);
      if (!stats.namesByCurriculum[c]) stats.namesByCurriculum[c] = [];
      stats.namesByCurriculum[c].push(l.name);
    }
    for (const s of l.services) servicesSet.add(s);
    if (l.feesHint) stats.listingsWithFees.push(l);
    if (l.services.includes("Transport")) stats.transportListings.push(l);
    if (l.services.includes("Meals")) stats.mealsListings.push(l);
  }

  stats.ageMinMonths = minAge;
  stats.ageMaxMonths = maxAge;
  if (minAge !== undefined && maxAge !== undefined) {
    stats.ageLabel = `${monthsToLabel(minAge)} – ${monthsToLabel(maxAge)}`;
  }
  stats.curricula = Array.from(curriculaSet);
  stats.services = Array.from(servicesSet);
  stats.youngestListing = youngest;
  stats.oldestListing = oldest;

  return stats;
}

export function formatList(items: string[], max = 3): string {
  if (items.length === 0) return "";
  const trimmed = items.slice(0, max);
  if (items.length > max) trimmed.push(`+${items.length - max} more`);
  if (trimmed.length === 1) return trimmed[0];
  if (trimmed.length === 2) return trimmed.join(" and ");
  return `${trimmed.slice(0, -1).join(", ")} and ${trimmed[trimmed.length - 1]}`;
}
