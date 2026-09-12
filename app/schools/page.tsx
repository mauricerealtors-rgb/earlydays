import type { Metadata } from "next";
import Link from "next/link";
import { allListings, findCategory, findLocation } from "@/lib/query";
import { CATEGORIES } from "@/data/categories";
import { LOCATIONS } from "@/data/locations";
import { ListingCard } from "@/components/ListingCard";
import { PageHeading } from "@/components/PageHeading";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmptyResults } from "@/components/EmptyResults";
import { mergeManyListings } from "@/lib/listing-overrides";
import { SITE } from "@/lib/site";

type SP = { category?: string; area?: string; age?: string; q?: string };

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const parts: string[] = [];
  const cat = sp.category ? findCategory(sp.category) : undefined;
  const loc = sp.area ? findLocation(sp.area) : undefined;
  if (cat) parts.push(cat.plural);
  else parts.push("Schools & learning centres");
  if (loc) parts.push(`in ${loc.name}`);
  parts.push("Ghana");
  const title = parts.join(" ");
  return {
    title,
    description: `Search ${cat?.plural.toLowerCase() ?? "schools and children's learning centres"} across Ghana${loc ? `, focused on ${loc.name}` : ""}. Compare programmes, ages, curriculum and location.`,
    alternates: { canonical: `${SITE.url}/schools` },
  };
}

export default async function SchoolsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const cat = sp.category ? findCategory(sp.category) : undefined;
  const loc = sp.area ? findLocation(sp.area) : undefined;

  const baseline = allListings().filter((l) => {
    if (cat && !l.listingTypes.includes(cat.listingType)) return false;
    if (loc && l.neighbourhood !== loc.slug) return false;
    if (sp.q) {
      const q = sp.q.toLowerCase();
      if (
        !l.name.toLowerCase().includes(q) &&
        !l.description.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
  const results = await mergeManyListings(baseline);

  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Schools & centres" },
        ]}
      />
      <PageHeading
        eyebrow="Search"
        title="Schools & learning centres"
        subtitle={
          <>
            Filter by programme, area or age. Only pages with real, useful
            information are shown.
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card-soft rounded-2xl bg-white p-5">
            <form method="get" className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
                  Programme
                </label>
                <select
                  name="category"
                  defaultValue={sp.category ?? ""}
                  className="w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm font-semibold"
                >
                  <option value="">Any</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.plural}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
                  Area
                </label>
                <select
                  name="area"
                  defaultValue={sp.area ?? ""}
                  className="w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm font-semibold"
                >
                  <option value="">Anywhere</option>
                  {LOCATIONS.map((l) => (
                    <option key={l.slug} value={l.slug}>{l.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
                  Keyword
                </label>
                <input
                  name="q"
                  defaultValue={sp.q ?? ""}
                  placeholder="e.g. Montessori"
                  className="w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm font-semibold"
                />
              </div>
              <button className="btn btn-primary w-full">Apply filters</button>
              <Link href="/schools" className="btn btn-ghost w-full text-sm">
                Clear
              </Link>
            </form>
          </div>
        </aside>

        <div>
          <p className="mb-4 text-sm text-[color:var(--color-ink-mute)]">
            <strong className="text-[color:var(--color-navy)]">{results.length}</strong>{" "}
            {results.length === 1 ? "place" : "places"} match your search
            {cat ? ` in ${cat.plural.toLowerCase()}` : ""}
            {loc ? ` near ${loc.name}` : ""}.
          </p>
          {results.length === 0 ? (
            <EmptyResults
              nearby={[
                { href: "/schools/accra/east-legon", label: "East Legon" },
                { href: "/schools/accra/spintex", label: "Spintex" },
                { href: "/schools/accra/airport", label: "Airport" },
              ]}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
