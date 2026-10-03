import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, Footer, Header } from "@/components/Chrome";
import { VendorGrid } from "@/components/VendorCard";
import { findArea } from "@/data/areas";
import { KINDS, OCCASIONS, findKind, findOccasion } from "@/data/categories";
import { vendorsForKind, vendorsForOccasion } from "@/data/vendors";
import { SITE, money } from "@/lib/site";
import type { Vendor } from "@/lib/types";

/**
 * One route serves both browse axes — occasion ("wedding-cakes") and product
 * kind ("bento-cakes") — because to a buyer they are the same kind of page and
 * splitting the URL space would only add a segment nobody types.
 */
function resolve(slug: string):
  | { kind: "occasion"; title: string; blurb: string; lead: string; vendors: Vendor[] }
  | { kind: "kind"; title: string; blurb: string; lead: null; vendors: Vendor[] }
  | null {
  const o = findOccasion(slug);
  if (o) {
    return {
      kind: "occasion",
      title: o.plural,
      blurb: o.blurb,
      lead: o.typicalLeadTimeNote,
      vendors: vendorsForOccasion(o.occasion),
    };
  }
  const k = findKind(slug);
  if (k) {
    return {
      kind: "kind",
      title: k.plural,
      blurb: k.blurb,
      lead: null,
      vendors: vendorsForKind(k.kind),
    };
  }
  return null;
}

export function generateStaticParams() {
  return [...OCCASIONS, ...KINDS].map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const c = resolve(category);
  if (!c) return {};
  return {
    title: `${c.title} in Ghana`,
    description: `${c.vendors.length} cake makers across Ghana making ${c.title.toLowerCase()}. Compare portfolios, lead times and published prices.`,
    alternates: { canonical: `/${category}` },
    openGraph: { title: `${c.title} in Ghana`, url: `${SITE.url}/${category}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const c = resolve(category);
  if (!c) notFound();

  const cheapest = c.vendors
    .map((v) => v.priceFrom)
    .filter((n): n is number => typeof n === "number")
    .sort((x, y) => x - y)[0];
  const priced = c.vendors.filter((v) => v.priceList?.length);

  // Areas where this is actually available, for onward browsing.
  const areas = [...new Set(c.vendors.map((v) => v.area))]
    .map((s) => findArea(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <Header />
      <Breadcrumb
        trail={[{ href: "/", label: "Home" }, { label: c.title }]}
      />

      <main className="container-page pb-10">
        <h1 className="mt-4 text-3xl md:text-5xl">{c.title} in Ghana</h1>
        <p className="mt-4 max-w-3xl text-lg">{c.blurb}</p>

        <p className="mt-4 max-w-3xl text-ink-mute">
          {c.vendors.length} baker{c.vendors.length === 1 ? "" : "s"} listed.
          {cheapest ? ` Prices start at ${money(cheapest)}.` : ""}
          {priced.length
            ? ` ${priced.length} publish a full price list.`
            : ""}
        </p>

        {c.lead && (
          <p className="card mt-6 max-w-3xl p-5">
            <strong className="text-cocoa">How much notice to give.</strong>{" "}
            {c.lead}
          </p>
        )}

        <VendorGrid vendors={c.vendors} />

        {areas.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl">By area</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {areas.map((a) => (
                <Link key={a.slug} href={`/cakes-in/${a.slug}`} className="chip">
                  {a.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
