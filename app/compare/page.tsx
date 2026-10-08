import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { ComparePairsGrid, type PairCard } from "@/components/ComparePairsGrid";
import { indexablePairs } from "@/lib/comparisons";
import { findLocation } from "@/data/locations";
import { SITE } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Compare Ghanaian schools side by side",
  description:
    "School vs school. Real facts on location, ages, curriculum, services and fees. See which of two Accra schools fits your family.",
  alternates: { canonical: `${SITE.url}/compare` },
};

export default function Compare() {
  // Same-area pairs only.
  //
  // curatedPairs() returns 411, and rendering them all made this page 5.8MB of
  // HTML. The cross-area ones are noindexed anyway — two schools an hour apart
  // in Accra traffic is not a comparison a parent is making — so listing them
  // here bought nothing and cost almost six megabytes. Google still reaches
  // every indexable pair through the sitemap.
  const pairs: PairCard[] = indexablePairs().map((p) => ({
    slug: p.slug,
    a: p.a.name,
    b: p.b.name,
    reason: p.reason,
    areaA: findLocation(p.a.neighbourhood)?.name ?? p.a.region,
    areaB: findLocation(p.b.neighbourhood)?.name ?? p.b.region,
  }));

  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Compare" }]}
      />
      <PageHeading
        eyebrow="Compare"
        title="School vs school"
        subtitle="Head-to-head comparisons of schools in the same area. Real facts, side by side. Neither is 'better' — they're different."
      />

      {pairs.length === 0 ? (
        <div className="rounded-2xl border border-[color:var(--color-line)] bg-white p-8 text-center text-sm text-[color:var(--color-ink-mute)]">
          Comparisons are being curated. Check back soon.
        </div>
      ) : (
        <ComparePairsGrid pairs={pairs} />
      )}
    </div>
  );
}
