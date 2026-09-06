import Link from "next/link";
import { SearchHero } from "@/components/SearchHero";
import { CategoryCard } from "@/components/CategoryCard";
import { LocationCard } from "@/components/LocationCard";
import { ListingCard } from "@/components/ListingCard";
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

      {/* Explore by need */}
      <Section
        eyebrow="Explore by programme"
        title="What are you looking for?"
        subtitle="From daycare for a 1-year-old to Montessori primary — pick a starting point."
        seeAllHref="/schools"
        seeAllLabel="See all programmes"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} count={catCounts[c.slug]} />
          ))}
        </div>
      </Section>

      {/* Explore by location */}
      <Section
        eyebrow="Explore by area"
        title="Popular areas in Accra"
        subtitle="Start with the areas where families are actively searching."
        seeAllHref="/schools/accra"
        seeAllLabel="See all Accra areas"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {locations.slice(0, 8).map((l) => (
            <LocationCard key={l.slug} location={l} count={locCounts[l.slug] ?? 0} />
          ))}
        </div>
      </Section>

      {/* Featured */}
      <Section
        eyebrow="Featured this month"
        title="Some places worth a closer look"
        subtitle="Profiles our team highlighted based on completeness and recency."
        seeAllHref="/schools"
        seeAllLabel="Browse all schools"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </Section>

      {/* Parent intent — "I need a place for..." */}
      <ParentIntent />

      {/* How it works */}
      <HowItWorks />

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
            <p className="mt-2 text-[15px] text-[color:var(--color-ink-mute)] md:text-base">
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

function ParentIntent() {
  const intents = [
    { label: "My baby (0–1)", href: "/creches", icon: "👶" },
    { label: "My toddler (1–3)", href: "/creches", icon: "🧸" },
    { label: "Preschool (3–5)", href: "/preschools", icon: "🎨" },
    { label: "KG (5–6)", href: "/kindergartens", icon: "📚" },
    { label: "Primary (6+)", href: "/primary-schools", icon: "🎒" },
    { label: "French classes", href: "/french-classes-for-kids", icon: "🇫🇷" },
    { label: "Coding & STEM", href: "/stem-and-coding", icon: "🤖" },
    { label: "After school", href: "/learning-centres", icon: "⏰" },
    { label: "Holiday programmes", href: "/activity-centres", icon: "☀️" },
  ];
  return (
    <section className="container-page mt-16 md:mt-24">
      <div className="card overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[280px_1fr]">
          <div
            className="p-6 md:p-8"
            style={{ background: "linear-gradient(160deg,#FFE1D5 0%,#FFC5B0 100%)" }}
          >
            <span className="chip">Parent shortcut</span>
            <h2 className="mt-3 font-display text-2xl leading-tight md:text-3xl">
              I need a place for…
            </h2>
            <p className="mt-2 text-sm text-[color:var(--color-navy-2)]/85">
              Tell us who you're looking for. We'll jump you to a useful list.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-1 p-3 sm:grid-cols-3">
            {intents.map((i) => (
              <li key={i.label}>
                <Link
                  href={i.href}
                  className="flex h-full items-center gap-3 rounded-2xl px-3 py-3 hover:bg-[color:var(--color-cream-deep)]"
                >
                  <span aria-hidden className="text-xl">{i.icon}</span>
                  <span className="text-sm font-semibold text-[color:var(--color-navy)]">
                    {i.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "Search",
      body: "Filter by programme, area and age. See only what matches.",
      accent: "sky",
    },
    {
      title: "Compare",
      body: "Side-by-side facts — location, ages, curriculum, services.",
      accent: "leaf",
    },
    {
      title: "Contact",
      body: "Request information, call or WhatsApp when it's the right fit.",
      accent: "coral",
    },
  ];
  return (
    <section className="container-page mt-16 md:mt-24">
      <div className="mb-6">
        <h2 className="font-display text-[28px] tracking-tight md:text-[40px]">
          How EarlyDays works
        </h2>
        <p className="mt-2 max-w-2xl text-[color:var(--color-ink-mute)]">
          A calmer way to find the right early years or primary programme for
          your child.
        </p>
      </div>
      <ol className="grid gap-3 md:grid-cols-3">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="card-soft rounded-2xl p-6"
            style={{
              background:
                s.accent === "sky"
                  ? "linear-gradient(160deg,#E4F1FF,#ffffff 60%)"
                  : s.accent === "leaf"
                    ? "linear-gradient(160deg,#EAF6E5,#ffffff 60%)"
                    : "linear-gradient(160deg,#FFE1D5,#ffffff 60%)",
            }}
          >
            <span className="chip">Step {i + 1}</span>
            <h3 className="mt-3 font-display text-xl">{s.title}</h3>
            <p className="mt-1 text-sm text-[color:var(--color-ink-mute)]">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function GuidesTeaser() {
  const guides = [
    {
      slug: "how-to-choose-a-creche-in-accra",
      title: "How to choose a creche in Accra",
      dek: "The 12 things to check on your first visit.",
      tag: "Starting out",
    },
    {
      slug: "montessori-vs-eyfs",
      title: "Montessori vs EYFS — what's the difference?",
      dek: "Plain-English comparison for parents.",
      tag: "Curriculum",
    },
    {
      slug: "questions-to-ask-before-enrolling",
      title: "Questions to ask before enrolling your child",
      dek: "A printable checklist for school visits.",
      tag: "Visits",
    },
  ];
  return (
    <section className="container-page mt-16 md:mt-24">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <span className="chip chip-sun">Parent guides</span>
          <h2 className="mt-2 font-display text-[28px] tracking-tight md:text-[40px]">
            Read before you visit
          </h2>
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
        className="card relative overflow-hidden p-8 md:p-12"
        style={{
          background:
            "linear-gradient(120deg,#0F2A4A 0%,#1F3A5F 55%,#3F5A80 100%)",
          color: "white",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full opacity-40"
          style={{ background: "radial-gradient(circle,#FFC845 0,transparent 60%)" }}
        />
        <div className="relative max-w-2xl">
          <span
            className="chip"
            style={{ background: "rgba(255,255,255,0.1)", color: "white", borderColor: "transparent" }}
          >
            For schools
          </span>
          <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">
            Is your school listed?
          </h2>
          <p className="mt-3 text-white/85">
            Claim your profile, keep your information up to date, and help
            parents in Ghana discover you when it matters. Free to claim.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/claim" className="btn btn-sun">
              Claim your profile
            </Link>
            <Link
              href="/for-schools"
              className="btn"
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
