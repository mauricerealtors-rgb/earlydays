import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CATEGORIES,
  findCategory,
} from "@/data/categories";
import {
  LOCATIONS,
  findLocation,
  findRegion,
  listingsByCategoryAndLocation,
} from "@/lib/query";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { ListingCard } from "@/components/ListingCard";
import { EmptyResults } from "@/components/EmptyResults";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { itemListJsonLd, faqJsonLd } from "@/lib/schema";
import { computeAreaStats, formatList, type AreaStats } from "@/lib/insights";
import type { Listing } from "@/lib/types";

export const dynamicParams = false;
export const revalidate = 3600;

/**
 * Programmatic SEO rule (guide §16):
 * only generate a category+area page if it has at least one useful listing.
 */
export async function generateStaticParams() {
  const combos: { category: string; region: string; area: string }[] = [];
  for (const c of CATEGORIES) {
    for (const l of LOCATIONS) {
      const count = listingsByCategoryAndLocation(c.slug, l.slug).length;
      if (count >= 1) {
        combos.push({ category: c.slug, region: l.region, area: l.slug });
      }
    }
  }
  return combos;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; region: string; area: string }>;
}): Promise<Metadata> {
  const { category, region, area } = await params;
  const c = findCategory(category);
  const r = findRegion(region);
  const l = findLocation(area);
  if (!c || !r || !l) return {};
  const count = listingsByCategoryAndLocation(c.slug, l.slug).length;
  return {
    title: `${c.plural} in ${l.name}, ${r.name} (${count} listed)`,
    description: `${count} ${count === 1 ? c.singular.toLowerCase() : c.plural.toLowerCase()} in ${l.name}, ${r.name} on EarlyDays. ${c.blurb}`,
    alternates: { canonical: `${SITE.url}/${c.slug}/${r.slug}/${l.slug}` },
    openGraph: {
      title: `${c.plural} in ${l.name}, ${r.name}`,
      description: `${c.plural} in ${l.name}. ${c.blurb}`,
      url: `${SITE.url}/${c.slug}/${r.slug}/${l.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryAreaPage({
  params,
}: {
  params: Promise<{ category: string; region: string; area: string }>;
}) {
  const { category, region, area } = await params;
  const c = findCategory(category);
  const r = findRegion(region);
  const l = findLocation(area);
  if (!c || !r || !l) notFound();

  const results = listingsByCategoryAndLocation(c.slug, l.slug);
  const canonical = `${SITE.url}/${c.slug}/${r.slug}/${l.slug}`;
  const nearby = LOCATIONS.filter(
    (x) => x.region === r.slug && x.slug !== l.slug
  ).slice(0, 6);
  const otherCatsHere = CATEGORIES.filter((cc) => cc.slug !== c.slug).filter(
    (cc) => listingsByCategoryAndLocation(cc.slug, l.slug).length > 0
  );

  const stats = computeAreaStats(results);
  const faq = buildComboFaq({
    plural: c.plural,
    singular: c.singular,
    area: l.name,
    region: r.name,
    stats,
    results,
    nearby: nearby.slice(0, 3).map((n) => n.name),
  });
  const lastUpdated = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          results,
          `${c.plural} in ${l.name}, ${r.name}`,
          canonical
        )}
      />
      <JsonLd data={faqJsonLd(faq)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${canonical}#page`,
          name: `${c.plural} in ${l.name}, ${r.name}`,
          url: canonical,
          isPartOf: { "@id": `${SITE.url}#website` },
          about: {
            "@type": "Place",
            name: l.name,
            containedInPlace: {
              "@type": "AdministrativeArea",
              name: r.name,
              containedInPlace: { "@type": "Country", name: "Ghana" },
            },
          },
          inLanguage: "en-GH",
        }}
      />

      <div className="container-page pt-8 md:pt-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: c.plural, href: `/${c.slug}` },
            { label: r.name, href: `/schools/${r.slug}` },
            { label: l.name },
          ]}
        />
        <PageHeading
          eyebrow={`${c.singular} · ${r.name}`}
          title={`${c.plural} in ${l.name}`}
          subtitle={<>{l.blurb} {c.blurb}</>}
        />

        {/* Answer-first snippet */}
        <div className="card-soft mb-6 rounded-2xl bg-white p-5 md:p-6">
          <p className="text-[15px] leading-relaxed text-[color:var(--color-ink)]">
            <strong className="text-[color:var(--color-navy)]">
              {c.plural} in {l.name}:
            </strong>{" "}
            {results.length === 0
              ? `EarlyDays has no ${c.plural.toLowerCase()} listed in ${l.name} yet.`
              : results.length === 1
                ? `EarlyDays lists 1 ${c.singular.toLowerCase()} in ${l.name}, ${r.name}.`
                : `EarlyDays lists ${results.length} ${c.plural.toLowerCase()} in ${l.name}, ${r.name}.`}{" "}
            Fees, curriculum and admissions windows are shown only when the
            school has published them.
          </p>
          <p className="mt-2 text-[12px] text-[color:var(--color-ink-mute)]">
            Last updated: {lastUpdated}.
          </p>
        </div>

        {/* At-a-glance data panel — auto-computed from listings */}
        {results.length > 0 && (
          <AtAGlance stats={stats} plural={c.plural.toLowerCase()} area={l.name} />
        )}

        {/* Neighbourhood-specific intro (only if the area has one written) */}
        {l.intro && (
          <section className="mb-8" aria-label={`About ${l.name}`}>
            <h2 className="mb-2 font-display text-xl text-[color:var(--color-navy)]">
              About {c.plural.toLowerCase()} in {l.name}
            </h2>
            <p className="text-[15px] leading-relaxed text-[color:var(--color-ink)]">
              {l.intro}
            </p>
          </section>
        )}

        {results.length === 0 ? (
          <EmptyResults
            title={`No ${c.plural.toLowerCase()} in ${l.name} yet.`}
            nearby={nearby.map((n) => ({
              href: `/${c.slug}/${r.slug}/${n.slug}`,
              label: `${c.plural} in ${n.name}`,
            }))}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((x) => (
              <ListingCard key={x.id} listing={x} />
            ))}
          </div>
        )}

        {/* Cross-linking to other programmes in the same area */}
        {otherCatsHere.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-3 font-display text-xl">
              Other programmes in {l.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherCatsHere.map((cc) => (
                <Link
                  key={cc.slug}
                  href={`/${cc.slug}/${r.slug}/${l.slug}`}
                  className="chip chip-sky"
                >
                  {cc.plural} in {l.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Same programme in nearby areas */}
        {nearby.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-3 font-display text-xl">
              {c.plural} in nearby areas
            </h2>
            <div className="flex flex-wrap gap-2">
              {nearby.map((n) => (
                <Link
                  key={n.slug}
                  href={`/${c.slug}/${r.slug}/${n.slug}`}
                  className="chip"
                >
                  {c.plural} in {n.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mt-14" aria-labelledby="combo-faq">
          <h2 id="combo-faq" className="mb-3 font-display text-2xl">
            Parent questions
          </h2>
          <div className="card-soft rounded-2xl bg-white p-2">
            {faq.map((f) => (
              <details
                key={f.q}
                className="group border-b border-[color:var(--color-line-2)] p-4 last:border-none"
              >
                <summary className="cursor-pointer list-none font-semibold text-[color:var(--color-navy)]">
                  <span className="mr-2 text-[color:var(--color-coral)] group-open:hidden">＋</span>
                  <span className="mr-2 hidden text-[color:var(--color-coral)] group-open:inline">−</span>
                  {f.q}
                </summary>
                <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--color-ink)]">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function AtAGlance({
  stats,
  plural,
  area,
}: {
  stats: AreaStats;
  plural: string;
  area: string;
}) {
  const items: { label: string; value: string; accent: string }[] = [
    {
      label: `${plural} listed`,
      value: `${stats.count}`,
      accent: "sky",
    },
  ];
  if (stats.ageLabel) {
    items.push({ label: "Ages covered", value: stats.ageLabel, accent: "leaf" });
  }
  if (stats.curricula.length) {
    items.push({
      label: "Approaches",
      value: formatList(stats.curricula, 3),
      accent: "coral",
    });
  }
  if (stats.services.length) {
    const priority = ["Full day", "Half day", "Meals", "Transport", "Outdoor play"];
    const ordered = [
      ...priority.filter((s) => stats.services.includes(s)),
      ...stats.services.filter((s) => !priority.includes(s)),
    ];
    items.push({
      label: "Services",
      value: formatList(ordered, 3),
      accent: "sun",
    });
  }
  const accentBg: Record<string, string> = {
    sky: "linear-gradient(160deg,#E4F1FF,#ffffff 65%)",
    leaf: "linear-gradient(160deg,#EAF6E5,#ffffff 65%)",
    coral: "linear-gradient(160deg,#FFE1D5,#ffffff 65%)",
    sun: "linear-gradient(160deg,#FFF3D1,#ffffff 65%)",
  };
  return (
    <section
      className="mb-8"
      aria-label={`At a glance: ${plural} in ${area}`}
    >
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {items.map((it) => (
          <div
            key={it.label}
            className="rounded-2xl border border-[color:var(--color-line-2)] p-4"
            style={{ background: accentBg[it.accent] }}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
              {it.label}
            </div>
            <div className="mt-1 font-display text-[18px] leading-tight text-[color:var(--color-navy)]">
              {it.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function buildComboFaq(args: {
  plural: string;
  singular: string;
  area: string;
  region: string;
  stats: AreaStats;
  results: Listing[];
  nearby: string[];
}) {
  const { plural, singular, area, region, stats, results, nearby } = args;
  const p = plural.toLowerCase();
  const s = singular.toLowerCase();
  const qs: { q: string; a: string }[] = [];

  qs.push({
    q: `How many ${p} are there in ${area}?`,
    a:
      results.length === 0
        ? `EarlyDays currently has no ${p} listed in ${area}, ${region} — we're still adding schools in this catchment.`
        : `EarlyDays lists ${results.length} ${results.length === 1 ? s : p} in ${area}, ${region}: ${results
            .slice(0, 6)
            .map((r) => r.name)
            .join(", ")}${results.length > 6 ? " and more" : ""}.`,
  });

  if (stats.ageLabel) {
    const youngest = stats.youngestListing;
    qs.push({
      q: `From what age do ${p} in ${area} accept children?`,
      a:
        youngest && typeof stats.ageMinMonths === "number"
          ? `The youngest starting age we see for ${p} in ${area} is ${
              stats.ageMinMonths < 12
                ? `${stats.ageMinMonths} months`
                : `${Math.floor(stats.ageMinMonths / 12)} years`
            } at ${youngest.name}. Across all listed ${p} in ${area}, ages served range from ${stats.ageLabel}.`
          : `Across ${p} listed in ${area}, ages served range from ${stats.ageLabel}.`,
    });
  }

  if (stats.curricula.length) {
    const items = stats.curricula
      .slice(0, 4)
      .map((c) => {
        const names = (stats.namesByCurriculum[c] ?? []).slice(0, 3).join(", ");
        return names ? `${c} (${names})` : c;
      })
      .join("; ");
    qs.push({
      q: `What curricula do ${p} in ${area} follow?`,
      a: `The ${p} we list in ${area} follow a mix of pathways: ${items}. Curriculum matters most from kindergarten upwards — for creches and early nurseries, look at daily rhythm, outdoor time and staff-to-child ratio first.`,
    });
  }

  qs.push({
    q: `How much does a ${s} cost in ${area}?`,
    a:
      stats.listingsWithFees.length > 0
        ? `Fees vary widely. Among ${p} in ${area} that have published a fee guide on EarlyDays: ${stats.listingsWithFees
            .slice(0, 3)
            .map((l) => `${l.name} — ${l.feesHint}`)
            .join("; ")}. Other listed schools have not published fees; use the Request information button on each profile to ask directly.`
        : `None of the ${p} we currently list in ${area} have published a fee guide on EarlyDays. Fees are set individually per school and change each academic year — use the Request information button on any profile to ask directly. As a general reference, private early years fees in Greater Accra typically span GH₵1,500–GH₵15,000+ per term depending on curriculum and services.`,
  });

  if (stats.transportListings.length) {
    qs.push({
      q: `Do ${p} in ${area} offer school transport?`,
      a: `Yes — ${stats.transportListings
        .slice(0, 3)
        .map((l) => l.name)
        .join(", ")} ${stats.transportListings.length === 1 ? "lists" : "list"} school transport as a service. Routes and pick-up areas vary; confirm directly with each school.`,
    });
  }

  qs.push({
    q: `When should I start looking for a ${s} place in ${area}?`,
    a: `Most schools in Greater Accra work on three-term academic years (January, May and September starts). Popular ${p} in and around ${area} — especially those offering EYFS, Montessori or Cambridge — fill up 6–9 months in advance for the September intake. If you're moving into ${area} or expecting a January start, begin visits 3–4 months out.`,
  });

  qs.push({
    q: `What should I look for on a school visit in ${area}?`,
    a: `The essentials to check in person: staff-to-child ratio (especially under-3s), how children are being spoken to when nobody is watching, outdoor and shaded play space, meal setup, toilet and nap facilities, safeguarding at pick-up, and how transparently the school answers about fees and hours. Almost all listed schools welcome visits — how they respond is itself a strong signal.`,
  });

  if (results.length > 0 && nearby.length > 0) {
    qs.push({
      q: `What if I can't find the right ${s} in ${area}?`,
      a: `The nearest areas with additional ${p} on EarlyDays are ${nearby.join(", ")}. Many families in and around ${area} end up at a school in an adjacent catchment — pick-up distance and traffic on your specific route usually matter more than a strict area boundary.`,
    });
  }

  return qs;
}
