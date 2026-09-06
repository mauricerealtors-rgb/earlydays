import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, findCategory } from "@/data/categories";
import { LOCATIONS } from "@/data/locations";
import { listingsByCategory, listingsByCategoryAndLocation } from "@/lib/query";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { ListingCard } from "@/components/ListingCard";
import { EmptyResults } from "@/components/EmptyResults";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const c = findCategory(category);
  if (!c) return {};
  return {
    title: `${c.plural} in Ghana`,
    description: `Discover ${c.plural.toLowerCase()} across Ghana. ${c.blurb}`,
    alternates: { canonical: `${SITE.url}/${c.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const c = findCategory(category);
  if (!c) notFound();

  const results = listingsByCategory(c.slug);

  const areasWithCounts = LOCATIONS.filter((l) => l.region === "accra")
    .map((l) => ({
      loc: l,
      count: listingsByCategoryAndLocation(c.slug, l.slug).length,
    }))
    .filter((x) => x.count > 0);

  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Schools", href: "/schools" },
          { label: c.plural },
        ]}
      />
      <PageHeading
        eyebrow="Programme"
        title={`${c.plural} in Ghana`}
        subtitle={c.blurb}
      />

      {areasWithCounts.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-xl">
            {c.plural} by area
          </h2>
          <div className="flex flex-wrap gap-2">
            {areasWithCounts.map(({ loc, count }) => (
              <Link
                key={loc.slug}
                href={`/${c.slug}/${loc.region}/${loc.slug}`}
                className="chip chip-sky"
              >
                {loc.name} · {count}
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.length === 0 ? (
        <EmptyResults />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}

      <AnswerBlock category={c.plural} count={results.length} />
    </div>
  );
}

function AnswerBlock({ category, count }: { category: string; count: number }) {
  return (
    <section className="mt-14 card-soft rounded-2xl bg-white p-6 md:p-8">
      <h2 className="font-display text-2xl">About {category.toLowerCase()} on EarlyDays</h2>
      <p className="mt-2 text-[color:var(--color-ink)]">
        There {count === 1 ? "is" : "are"} <strong>{count}</strong>{" "}
        {category.toLowerCase()} currently listed on EarlyDays. We only publish
        a location page for a category when we have enough real, useful
        listings — so this list grows as more schools are verified and added.
      </p>
      <p className="mt-2 text-sm text-[color:var(--color-ink-mute)]">
        Contact details, fees and admissions windows are shown only when we can
        source them from the school itself.
      </p>
    </section>
  );
}
