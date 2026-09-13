import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { curatedPairs } from "@/lib/comparisons";
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
  const pairs = curatedPairs();

  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Compare" }]}
      />
      <PageHeading
        eyebrow="Compare"
        title="School vs school"
        subtitle="Head-to-head comparisons of Ghanaian schools. Real facts, side by side. Neither is 'better' — they're different."
      />

      {pairs.length === 0 ? (
        <div className="rounded-2xl border border-[color:var(--color-line)] bg-white p-8 text-center text-sm text-[color:var(--color-ink-mute)]">
          Comparisons are being curated. Check back soon.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {pairs.map((p) => {
            const locA = findLocation(p.a.neighbourhood);
            const locB = findLocation(p.b.neighbourhood);
            return (
              <Link
                key={p.slug}
                href={`/compare/${p.slug}`}
                className="group rounded-2xl border border-[color:var(--color-line)] bg-white p-5 transition hover:shadow-lg"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
                  School vs school
                </p>
                <p className="mt-2 font-display text-[18px] leading-tight text-[color:var(--color-navy)] md:text-[20px]">
                  {p.a.name}{" "}
                  <span className="text-[color:var(--color-ink-mute)]">vs</span>{" "}
                  {p.b.name}
                </p>
                <p className="mt-2 text-[12px] text-[color:var(--color-ink-mute)]">
                  {p.reason}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="chip chip-sky">
                    {locA?.name ?? p.a.region}
                  </span>
                  <span className="chip chip-sun">
                    {locB?.name ?? p.b.region}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
