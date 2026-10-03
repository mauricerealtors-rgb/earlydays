import Link from "next/link";
import { SITE } from "@/lib/site";
import { OCCASIONS, KINDS } from "@/data/categories";
import { AREAS, REGIONS, areasInRegion } from "@/data/areas";
import { VENDORS } from "@/data/vendors";

export default function HomePage() {
  const count = VENDORS.length;
  const accraAreas = areasInRegion("accra");

  return (
    <main>
      <header className="border-b border-line bg-paper-deep">
        <div className="container-page flex items-center justify-between py-5">
          <Link href="/" className="font-display text-2xl font-bold text-berry">
            {SITE.name}
          </Link>
          <Link href="/for-bakers" className="chip">
            Are you a baker?
          </Link>
        </div>
      </header>

      <section className="container-page py-14 md:py-20">
        <h1 className="max-w-3xl text-4xl md:text-6xl">
          Find a cake maker you can actually trust
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-mute">
          Compare bakers across Ghana on their real work, their lead times and
          where they deliver. Then ask several for a quote at once. Free, and
          you deal with the baker directly.
        </p>

        {count === 0 ? (
          <div className="card mt-8 max-w-2xl p-6">
            <p className="font-bold text-cocoa">We are still verifying bakers.</p>
            <p className="mt-2 text-ink-mute">
              Every baker on {SITE.name} is checked against their own website or
              account before they appear, and their portfolio photos are traced
              to their own work. That takes longer than scraping a list, which
              is the point. The first bakers go live shortly.
            </p>
            <p className="mt-4 text-ink-mute">
              If you make cakes and want to be included,{" "}
              <Link href="/for-bakers" className="font-bold text-rose-deep underline">
                add your business
              </Link>
              . It is free.
            </p>
          </div>
        ) : (
          <p className="mt-6 font-bold text-cocoa">
            {count} bakers listed across {AREAS.length} areas.
          </p>
        )}
      </section>

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

      <section className="container-page pb-20">
        <h2 className="text-2xl md:text-3xl">Browse by area</h2>
        <p className="mt-2 max-w-2xl text-ink-mute">
          An area page shows bakers based there and bakers who deliver there,
          because what matters is whether the cake can reach you.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {accraAreas.map((a) => (
            <Link key={a.slug} href={`/cakes-in/${a.slug}`} className="chip">
              {a.name}
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {REGIONS.filter((r) => r.slug !== "accra").map((r) => (
            <Link key={r.slug} href={`/region/${r.slug}`} className="chip">
              {r.name}
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-line bg-paper-deep py-10">
        <div className="container-page text-sm text-ink-mute">
          <p className="font-bold text-cocoa">{SITE.name}</p>
          <p className="mt-1">{SITE.tagline}</p>
          <p className="mt-4">
            We do not take a commission on orders and we do not publish prices
            we were not given. Bakers are listed free.
          </p>
        </div>
      </footer>
    </main>
  );
}
