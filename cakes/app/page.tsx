import Link from "next/link";
import { Footer, Header } from "@/components/Chrome";
import { VendorCard } from "@/components/VendorCard";
import { OCCASIONS, KINDS } from "@/data/categories";
import { AREAS, REGIONS, areasInRegion, findArea } from "@/data/areas";
import { VENDORS, areasWithVendors, sortForDisplay } from "@/data/vendors";

export default function HomePage() {
  const count = VENDORS.length;
  const priced = VENDORS.filter((v) => v.priceList?.length);
  const live = areasWithVendors(AREAS.map((a) => a.slug));
  const accraAreas = areasWithVendors(
    areasInRegion("accra").map((a) => a.slug),
  );
  const liveRegions = REGIONS.filter(
    (r) =>
      r.slug !== "accra" &&
      live.some((slug) => findArea(slug)?.region === r.slug),
  );

  return (
    <>
      <Header />

      <main>
        <section className="container-page py-14 md:py-20">
          <h1 className="max-w-3xl text-4xl md:text-6xl">
            Find a cake maker you can actually trust
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-mute">
            Compare bakers across Ghana on their real work, how much notice they
            need and where they deliver. Where they publish prices, you see the
            prices.
          </p>

          <div className="card mt-8 max-w-2xl p-6">
            <p className="font-bold text-cocoa">
              {count} bakers across {live.length} areas, {priced.length} with
              published prices.
            </p>
            <p className="mt-2 text-ink-mute">
              Every baker here was checked against their own website or account
              before being listed, and every portfolio photo marked as their own
              work was traced back to them. Where a baker publishes prices we
              show the figures and the date we read them, rather than making you
              ask. Where they do not, we say so.
            </p>
            <p className="mt-4 text-ink-mute">
              If you make cakes and want to be listed,{" "}
              <Link
                href="/for-bakers"
                className="font-bold text-rose-deep underline"
              >
                add your business
              </Link>
              . It is free.
            </p>
          </div>
        </section>

        {priced.length > 0 && (
          <section className="container-page pb-16">
            <h2 className="text-2xl md:text-3xl">Bakers who publish prices</h2>
            <p className="mt-2 max-w-2xl text-ink-mute">
              The rarest thing in this market. No Ghanaian directory carries a
              price field at all, so these bakers are the only ones you can
              compare before you call.{" "}
              <Link href="/prices" className="font-bold text-rose-deep underline">
                See every price we have
              </Link>
              .
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sortForDisplay(priced)
                .slice(0, 6)
                .map((v) => (
                  <VendorCard key={v.slug} vendor={v} />
                ))}
            </div>
          </section>
        )}

        <section className="container-page pb-16">
          <h2 className="text-2xl md:text-3xl">Browse by occasion</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OCCASIONS.map((o) => (
              <Link
                key={o.slug}
                href={`/${o.slug}`}
                className="card p-5 transition-transform hover:-translate-y-0.5"
              >
                <h3 className="text-lg">{o.plural}</h3>
                <p className="mt-1 text-sm text-ink-mute">{o.short}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="container-page pb-16">
          <h2 className="text-2xl md:text-3xl">Browse by type of cake</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {KINDS.map((k) => (
              <Link key={k.slug} href={`/${k.slug}`} className="chip">
                {k.plural}
              </Link>
            ))}
          </div>
        </section>

        <section className="container-page pb-8">
          <h2 className="text-2xl md:text-3xl">Browse by area</h2>
          <p className="mt-2 max-w-2xl text-ink-mute">
            An area page shows bakers based there and bakers who deliver there,
            because what matters is whether the cake can reach you.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {accraAreas.map((slug) => (
              <Link key={slug} href={`/cakes-in/${slug}`} className="chip">
                {findArea(slug)?.name ?? slug}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {liveRegions.map((r) => (
              <Link key={r.slug} href={`/region/${r.slug}`} className="chip">
                {r.name}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
