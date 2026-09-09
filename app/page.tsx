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

      {/* Who are you looking for? — age bands, big and bright, first thing */}
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
        subtitle="From Montessori to French classes to weekend coding — find the right kind of place."
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
        subtitle="Start with your neighbourhood — most parents want somewhere they can pick up in ten minutes."
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
            <p className="mt-2 text-[13px] leading-snug text-[color:var(--color-ink-mute)] md:text-sm">
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

function HowItWorks() {
  const steps = [
    {
      title: "Search.",
      body: "Filter by programme, area and age. Only what actually fits your family.",
      accent: "sky",
      gradient: "linear-gradient(160deg,#E4F1FF 0%,#C7E1FF 100%)",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2.2" />
          <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "Compare.",
      body: "Line up your favourites — location, ages, curriculum, services — side by side.",
      accent: "leaf",
      gradient: "linear-gradient(160deg,#EAF6E5 0%,#C9EABD 100%)",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="5" width="7" height="14" rx="2" stroke="currentColor" strokeWidth="2.2" />
          <rect x="14" y="5" width="7" height="14" rx="2" stroke="currentColor" strokeWidth="2.2" />
          <path d="M6.5 10h1M6.5 13.5h1M17.5 10h1M17.5 13.5h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "Reach out.",
      body: "Message, call or WhatsApp the schools you like. When it's a fit, you'll know.",
      accent: "coral",
      gradient: "linear-gradient(160deg,#FFE1D5 0%,#FFC5B0 100%)",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M8 10h8M8 13h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
  ];
  const accentInk: Record<string, string> = {
    sky: "#1F7AD6",
    leaf: "#2F7C25",
    coral: "#B23A1A",
  };
  return (
    <section className="container-page mt-16 md:mt-24">
      <div className="mb-8 text-center md:mb-10">
        <span className="chip chip-sky">How it works</span>
        <h2 className="mt-3 font-display text-[28px] leading-tight tracking-tight md:text-[44px]">
          <span className="rainbow-word-sky">Three steps.</span>{" "}
          <span className="rainbow-word-navy">Then you visit.</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-[color:var(--color-ink-mute)] md:text-base">
          The best decision still happens in person — but EarlyDays gets you to
          the right doorstep faster.
        </p>
      </div>
      <ol className="relative grid gap-4 md:grid-cols-3 md:gap-6">
        <span
          aria-hidden
          className="pointer-events-none absolute left-[8%] right-[8%] top-16 hidden h-0.5 rounded-full opacity-70 md:block"
          style={{
            background:
              "linear-gradient(90deg,#66B7FF 0%,#7AC66B 50%,#FF7A59 100%)",
          }}
        />
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="how-step group relative flex flex-col items-center rounded-3xl border border-[color:var(--color-line-2)] bg-white p-6 text-center shadow-[0_1px_2px_rgba(15,42,74,0.04),0_8px_24px_rgba(15,42,74,0.06)] transition-transform duration-300 hover:-translate-y-1 md:p-7"
            style={{ animationDelay: `${i * 140}ms` }}
          >
            <span
              aria-hidden
              className="how-step-badge absolute -top-3 right-5 inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[11px] font-black uppercase tracking-widest text-white shadow-md"
              style={{ background: accentInk[s.accent] }}
            >
              0{i + 1}
            </span>
            <span
              aria-hidden
              className="how-step-icon relative flex h-16 w-16 items-center justify-center rounded-2xl md:h-20 md:w-20"
              style={{ background: s.gradient, color: accentInk[s.accent] }}
            >
              {s.icon}
            </span>
            <h3 className="mt-4 font-display text-[22px] leading-tight md:text-[26px]">
              {s.title}
            </h3>
            <p className="mt-2 max-w-[28ch] text-sm text-[color:var(--color-ink-mute)] md:text-[15px]">
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
      dek: "The 12 things you should notice on your first visit.",
      tag: "Starting out",
    },
    {
      slug: "montessori-vs-eyfs",
      title: "Montessori vs EYFS — what's the difference?",
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
            The ones you'd ask your friend who's been through it — written for
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
            Run a school? Let parents find you.
          </h2>
          <p className="mt-3 text-white/85">
            Claim your profile in a minute. Keep your ages, programmes and
            contact details current — and reach the parents who are actively
            looking for a place like yours.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/claim" className="btn btn-pink">
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
