import type { Listing } from "./types";
import { allListings } from "./query";

export interface ComparisonPair {
  slug: string; // "school-a-vs-school-b" (alphabetically ordered)
  a: Listing;
  b: Listing;
  reason: string; // short editorial hook, e.g. "Two Montessori options in East Legon"
}

const RICH_ENOUGH = (l: Listing): boolean =>
  Boolean(
    l.address &&
      l.curriculum.length > 0 &&
      l.services.length > 0 &&
      l.ageBlurb &&
      l.phone,
  );

function orderedPair(a: Listing, b: Listing): [Listing, Listing] {
  return a.slug < b.slug ? [a, b] : [b, a];
}

function pairSlug(a: Listing, b: Listing): string {
  const [first, second] = orderedPair(a, b);
  return `${first.slug}-vs-${second.slug}`;
}

/**
 * Curated comparison pairs. We do not generate every possible pair
 * (45 * 44 would be too much thin content). We prioritize:
 *  - Two schools in the same neighbourhood parents realistically choose between.
 *  - Two schools with contrasting curriculum in the same catchment.
 *  - Two premium head-to-heads across neighbourhoods.
 */
export function curatedPairs(): ComparisonPair[] {
  const listings = allListings().filter(RICH_ENOUGH);
  const pairs = new Map<string, ComparisonPair>();

  // Rule 1: same neighbourhood, different curriculum
  for (const a of listings) {
    for (const b of listings) {
      if (a.slug === b.slug) continue;
      if (a.neighbourhood !== b.neighbourhood) continue;
      const [x, y] = orderedPair(a, b);
      const key = pairSlug(x, y);
      if (pairs.has(key)) continue;
      const differentCurriculum =
        x.curriculum.join(",") !== y.curriculum.join(",");
      if (!differentCurriculum) continue;
      pairs.set(key, {
        slug: key,
        a: x,
        b: y,
        reason: `Two options in ${prettyPlace(x.neighbourhood)} with different curriculum`,
      });
    }
  }

  // Rule 2: same category, contrasting neighbourhoods (top 1 school per neighbourhood)
  const byCatNeighbourhood = new Map<string, Listing>();
  for (const l of listings) {
    for (const t of l.listingTypes) {
      const key = `${t}::${l.neighbourhood}`;
      const prev = byCatNeighbourhood.get(key);
      if (!prev || tierRank(l) > tierRank(prev)) {
        byCatNeighbourhood.set(key, l);
      }
    }
  }
  const bestPerCatNeighbourhood = Array.from(byCatNeighbourhood.entries());
  for (const [keyA, a] of bestPerCatNeighbourhood) {
    for (const [keyB, b] of bestPerCatNeighbourhood) {
      if (keyA === keyB) continue;
      const [typeA] = keyA.split("::");
      const [typeB] = keyB.split("::");
      if (typeA !== typeB) continue;
      if (a.neighbourhood === b.neighbourhood) continue;
      const [x, y] = orderedPair(a, b);
      const key = pairSlug(x, y);
      if (pairs.has(key)) continue;
      pairs.set(key, {
        slug: key,
        a: x,
        b: y,
        reason: `${categoryLabel(typeA)} in ${prettyPlace(x.neighbourhood)} versus ${prettyPlace(y.neighbourhood)}`,
      });
    }
  }

  return Array.from(pairs.values()).sort((a, b) =>
    a.slug.localeCompare(b.slug),
  );
}

export function findPair(slug: string): ComparisonPair | undefined {
  return curatedPairs().find((p) => p.slug === slug);
}

function tierRank(l: Listing): number {
  if (l.featured) return 3;
  if (l.verification === "verified") return 2;
  if (l.verification === "info-confirmed") return 1;
  return 0;
}

function categoryLabel(t: string): string {
  const map: Record<string, string> = {
    creche: "Creche",
    preschool: "Preschool",
    kindergarten: "Kindergarten",
    primary: "Primary",
    montessori: "Montessori",
    "learning-centre": "Learning centre",
    "language-centre": "Language programme",
    stem: "STEM",
    "activity-centre": "Activity centre",
  };
  return map[t] ?? t;
}

function prettyPlace(slug: string): string {
  return slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
