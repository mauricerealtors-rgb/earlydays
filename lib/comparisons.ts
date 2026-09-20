import type { Listing } from "./types";
import { allListings } from "./query";

export interface ComparisonPair {
  slug: string; // "school-a-vs-school-b" (alphabetically ordered)
  a: Listing;
  b: Listing;
  reason: string; // short editorial hook, e.g. "Two Montessori options in East Legon"
  /**
   * Both schools are in the same neighbourhood, so this is a choice a parent
   * actually faces. Cross-area pairs stay on the site for anyone who lands on
   * one, but they are noindex and kept out of the sitemap: Google crawled them
   * and declined to index, and at 90% of our URLs that verdict was being read
   * as a judgement on the whole site.
   */
  sameArea: boolean;
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
        sameArea: true,
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
        sameArea: false,
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

/**
 * The pairs worth putting in front of Google: same-neighbourhood choices a
 * parent is really weighing up. Sitemaps and IndexNow submit these only; the
 * cross-area pairs still render and still work, they are just noindex.
 */
export function indexablePairs(): ComparisonPair[] {
  return curatedPairs().filter((p) => p.sameArea);
}

/**
 * Pick a verdict block that reflects the actual contrast axis
 * between two schools, so the closing line doesn't read like the
 * same paragraph on every page.
 */
export function verdictFor(a: Listing, b: Listing): {
  headline: string;
  body: string;
} {
  const sameArea = a.neighbourhood === b.neighbourhood;
  const curriculumA = a.curriculum.join(", ") || "no set method";
  const curriculumB = b.curriculum.join(", ") || "no set method";
  const differentCurriculum =
    a.curriculum.join(",") !== b.curriculum.join(",");
  const differentAgeSpan =
    (a.ageMin ?? 0) !== (b.ageMin ?? 0) ||
    (a.ageMax ?? 0) !== (b.ageMax ?? 0);
  const bothPublishFees = Boolean(a.feesHint && b.feesHint);
  const onePublishesFees = Boolean(a.feesHint) !== Boolean(b.feesHint);

  if (sameArea && differentCurriculum) {
    return {
      headline: "Same street, different approach.",
      body: `Both are in the same catchment. ${a.name} follows ${curriculumA}. ${b.name} follows ${curriculumB}. The right one depends on how you want your child's day to look, not which name sounds better.`,
    };
  }

  if (!sameArea && !differentCurriculum) {
    return {
      headline: "Same programme, different daily reality.",
      body: `Curriculum is similar. Location is not. ${a.name} sits in ${prettyPlace(a.neighbourhood)}, ${b.name} in ${prettyPlace(b.neighbourhood)}. Traffic, drop-off routine and your daily commute usually decide this one more than the brochure does.`,
    };
  }

  if (differentAgeSpan) {
    return {
      headline: "Different age spans. Different next step.",
      body: `${a.name} covers ${a.ageBlurb}. ${b.name} covers ${b.ageBlurb}. Pick based on where your child is right now, and how far ahead the school takes you before the next transition.`,
    };
  }

  if (onePublishesFees) {
    return {
      headline: "One school publishes fees. One does not.",
      body: `${a.feesHint ? a.name : b.name} shares a fees hint publicly. The other does not. That is often the honest first signal of how easy the school is to work with as a parent.`,
    };
  }

  if (bothPublishFees) {
    return {
      headline: "Two published prices. Two different offers.",
      body: `Both are transparent about fees. What you actually get for the money is the harder question. Use the services table and a school visit to decide which is worth it for your family.`,
    };
  }

  return {
    headline: "Two solid options. Different chemistry.",
    body: `The fact table can only take you so far. The rest is chemistry, how your child feels at the gate on morning 1. Visit both. You will know within 15 minutes which one your child settles into.`,
  };
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
