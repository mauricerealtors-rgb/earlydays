import Link from "next/link";
import { SearchHero } from "@/components/SearchHero";
import { CategoryCard } from "@/components/CategoryCard";
import { LocationCard } from "@/components/LocationCard";
import { ListingCard } from "@/components/ListingCard";
import { AgeBandCard, AGE_BANDS } from "@/components/AgeBandCard";
import {
  categoriesWithListings,
  categoryCounts,
  featuredListings,
  locationCounts,
  locationsWithListings,
} from "@/lib/query";

export default function HomePage() {
  const categories = categoriesWithListings();
  const catCounts = categoryCounts();
  const locations = locationsWithListings().filter((l) => l.region === "accra");
  const locCounts = locationCounts();
  const featured = featuredListings(6);

  return (
    <>
      <SearchHero />

      {/* Who are you looking for — age bands, big and bright, first thing */}
      <Section
        eyebrow="Who are you looking for?"
        title="Tell us about your child."
        subtitle="Every age needs a different kind of place. Pick where your little one is right now."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {AGE_BANDS.map((b) => (
            <AgeBandCard key={b.slug} band={b} />
          ))}
        </div>
      </Section>

      {/* Explore by programme */}
      <Section
        eyebrow="Something specific in mind?"
        title="Explore by programme."
        subtitle="From Montessori to French classes to weekend coding."
        seeAllHref="/schools"
        seeAllLabel="See all programmes"
      >
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} count={catCounts[c.slug]} />
          ))}
        </div>
      </Section>

      {/* Explore by area */}
      <Section
        eyebrow="Close to home"
        title="Where do you live in Accra?"
        subtitle="Most parents want somewhere they can pick up in ten minutes."
        seeAllHref="/schools/accra"
        seeAllLabel="See all Accra areas"
      >
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
          {locations.slice(0, 8).map((l) => (
            <LocationCard key={l.slug} location={l} count={locCounts[l.slug] ?? 0} />
          ))}
        </div>
      </Section>

      {/* Featured */}
      <Section
        eyebrow="Fresh this month"
        title="A few places worth a closer look."
        subtitle="Profiles our team highlighted based on completeness, freshness and useful information for parents."
        seeAllHref="/schools"
        seeAllLabel="Browse all schools"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </Section>

      {/* Popular searches — direct authority pass to top combo pages */}
      <PopularSearches />

      {/* Guides */}
      <GuidesTeaser />

      {/* For schools */}
      <ForSchoolsCTA />
    </>
  );
}

function Section({
  eyebrow,
  title,
  subtitle,
  children,
  seeAllHref,
  seeAllLabel,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  seeAllHref?: string;
  seeAllLabel?: string;
}) {
  return (
    <section className="container-page mt-16 md:mt-24">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
        <div className="max-w-2xl">
          {eyebrow && (
            <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-line)] bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-navy)]">
              {eyebrow}
            </span>
          )}
          <h2 className="font-display text-[28px] leading-tight tracking-tight md:text-[40px]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-[11px] leading-snug text-[color:var(--color-ink-mute)] md:text-[12px]">
              {subtitle}
            </p>
          )}
        </div>
        {seeAllHref && (
          <Link href={seeAllHref} className="btn btn-ghost text-sm">
            {seeAllLabel ?? "See all"} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function PopularSearches() {
  const links = [
    { label: "Preschools in Adjiringanor", href: "/preschools/accra/adjiringanor" },
    { label: "Preschools in East Legon", href: "/preschools/accra/east-legon" },
    { label: "Creches in East Legon Hills", href: "/creches/accra/east-legon-hills" },
    { label: "Montessori schools in East Legon", href: "/montessori-schools/accra/east-legon" },
    { label: "Primary schools in East Airport", href: "/primary-schools/accra/east-airport" },
    { label: "Montessori schools in Adjiringanor", href: "/montessori-schools/accra/adjiringanor" },
    { label: "French classes in Central Accra", href: "/french-classes-for-kids/accra/accra-central" },
    { label: "Preschools in Adenta", href: "/preschools/accra/adenta" },
  ];
  return (
    <section className="container-page mt-16 md:mt-24">
      <div className="mb-5">
        <span className="chip chip-coral">Popular searches</span>
        <h2 className="mt-2 font-display text-[24px] tracking-tight md:text-[32px]">
          What other parents are searching for
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="chip hover:bg-[color:var(--color-sky-soft)] hover:text-[color:var(--color-sky-deep)]"
          >
            {l.label} →
          </Link>
        ))}
      </div>
    </section>
  );
}

function GuidesTeaser() {
  const guides = [
    {
      slug: "how-to-choose-a-creche-in-accra",
      title: "How to choose a creche in Accra",
      dek: "The 12 things you should notice on your first visit.",
      tag: "Starting out",
    },
    {
      slug: "montessori-vs-eyfs",
      title: "Montessori vs EYFS: what's the difference?",
      dek: "Plain-English comparison, so you can ask better questions.",
      tag: "Curriculum",
    },
    {
      slug: "questions-to-ask-before-enrolling",
      title: "Questions to ask before you enrol",
      dek: "A printable checklist for your school visits.",
      tag: "Visits",
    },
  ];
  return (
    <section className="container-page mt-16 md:mt-24">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <span className="chip chip-sun">Read before you visit</span>
          <h2 className="mt-2 font-display text-[28px] tracking-tight md:text-[40px]">
            Short guides. Real questions.
          </h2>
          <p className="mt-2 max-w-xl text-[color:var(--color-ink-mute)]">
            The ones you'd ask your friend who's been through it. Written for
            Ghanaian parents.
          </p>
        </div>
        <Link href="/guides" className="btn btn-ghost text-sm">All guides →</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="card p-5 hover:shadow-lg"
          >
            <span className="chip">{g.tag}</span>
            <h3 className="mt-3 font-display text-xl leading-tight text-[color:var(--color-navy)]">
              {g.title}
            </h3>
            <p className="mt-1 text-sm text-[color:var(--color-ink-mute)]">
              {g.dek}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--color-navy)]">
              Read the guide →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ForSchoolsCTA() {
  return (
    <section className="container-page mt-16 md:mt-24">
      <div
        className="card relative overflow-hidden p-8 md:p-14"
        style={{
          background:
            "linear-gradient(120deg,#081A33 0%,#0F2A4A 40%,#1B355A 100%)",
          color: "white",
        }}
      >
        {/* Decorative pops. pushed to the edges so they don't sit behind text */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-60"
          style={{ background: "radial-gradient(circle,#FFC845 0%,transparent 65%)" }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-20 h-80 w-80 rounded-full opacity-40"
          style={{ background: "radial-gradient(circle,#EC1E7A 0%,transparent 65%)" }}
        />
        {/* Contrast underlay behind the copy so text stays legible on the bright gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg,rgba(8,26,51,0.75) 0%,rgba(8,26,51,0.55) 55%,rgba(8,26,51,0) 100%)",
          }}
        />

        <div className="relative max-w-2xl">
          <span
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-navy)]"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-pink-hot)]" />
            For schools
          </span>
          <h2 className="mt-4 font-display text-3xl leading-tight text-white md:text-[44px]">
            Run a school? <span className="text-[color:var(--color-sun)]">Let parents find you.</span>
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white md:text-[17px]">
            Claim your profile in a minute. Keep your ages, programmes and
            contact details current. and reach the parents who are actively
            looking for a place like yours.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/claim" className="btn btn-pink shadow-lg">
              Claim your profile
            </Link>
            <Link
              href="/for-schools"
              className="btn bg-white text-[color:var(--color-navy)] hover:bg-white/90"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
