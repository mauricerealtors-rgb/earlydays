import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { LOCATIONS } from "@/data/locations";

export function SearchHero() {
  const accraLocations = LOCATIONS.filter((l) => l.region === "accra");
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden"
      style={{
        background:
          "var(--color-paper)",
      }}
    >
      <HeroDecor />
      <div className="container-page relative pt-10 pb-8 md:pt-20 md:pb-10">
        <div className="max-w-3xl">
          <h1
            id="hero-title"
            className="font-display text-[42px] leading-[1.02] tracking-tight md:text-[68px]"
          >
            {/*
              One colour, one accent phrase. This previously ran six colours
              through a single sentence via classes actually named
              "rainbow-word" — the clearest signal on the page that nobody had
              decided what the brand looked like.

              The accent uses the darker gold, not the button gold: #F2A20C on
              paper is about 1.9:1 and fails contrast even at display size.
            */}
            Find your child a place to{" "}
            <span className="text-[color:var(--color-coral)]">
              grow, play and learn.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg text-[color:var(--color-ink)]">
            You want a place where your little one feels safe, seen and gently
            stretched. We help you find it. creche, preschool, KG, primary or
            after-school. across Ghana.
          </p>
        </div>

        <form
          action="/schools"
          method="get"
          className="card mt-8 grid gap-3 p-3 md:mt-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center md:gap-2 md:p-2"
        >
          <div className="field rounded-2xl bg-[color:var(--color-cream)] p-3 md:p-4">
            <label htmlFor="q-category">You're looking for</label>
            <select id="q-category" name="category" defaultValue="">
              <option value="">Any programme</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.plural}
                </option>
              ))}
            </select>
          </div>
          <div className="field rounded-2xl bg-[color:var(--color-cream)] p-3 md:p-4">
            <label htmlFor="q-area">Near you</label>
            <select id="q-area" name="area" defaultValue="">
              <option value="">Anywhere in Accra</option>
              {accraLocations.map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field rounded-2xl bg-[color:var(--color-cream)] p-3 md:p-4">
            <label htmlFor="q-age">Your child's age</label>
            <select id="q-age" name="age" defaultValue="">
              <option value="">Any age</option>
              <option value="baby">Baby (0–1)</option>
              <option value="toddler">Toddler (1–3)</option>
              <option value="preschool">Preschool (3–5)</option>
              <option value="kg">KG (5–6)</option>
              <option value="primary">Primary (6+)</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-pink w-full text-base md:w-auto"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Find a place
          </button>
        </form>

        {/* Value chips under the search bar */}
        <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-[color:var(--color-navy)]">
          <FeatureChip color="var(--color-coral)" icon="heart">Made for parents</FeatureChip>
          <FeatureChip color="var(--color-ink-mute)" icon="cap">Honest profiles</FeatureChip>
          <FeatureChip color="var(--color-ink-mute)" icon="leaf">Verified where it counts</FeatureChip>
          <FeatureChip color="var(--color-coral)" icon="star">Free to search</FeatureChip>
        </ul>

        {/* Popular quick chips */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-[color:var(--color-ink-mute)]">
          <span className="mr-1 font-semibold text-[color:var(--color-navy)]">
            Popular right now:
          </span>
          {[
            { l: "Creches in Accra", href: "/creches/accra" },
            { l: "Preschools in East Legon", href: "/preschools/accra/east-legon" },
            { l: "Montessori schools", href: "/montessori-schools" },
            { l: "French for kids", href: "/french-classes-for-kids" },
            { l: "Primary in Tema", href: "/primary-schools/accra/tema" },
          ].map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="chip hover:bg-white"
            >
              {q.l}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureChip({
  color,
  icon,
  children,
}: {
  color: string;
  icon: "heart" | "cap" | "leaf" | "star";
  children: React.ReactNode;
}) {
  return (
    <li className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className="inline-flex h-6 w-6 items-center justify-center rounded-full"
        style={{ background: `${color}1A`, color }}
      >
        {icon === "heart" && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10Z" />
          </svg>
        )}
        {icon === "cap" && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3 1 8l11 5 9-4.1V15h2V8L12 3ZM5 12v3.5c0 1.4 3.13 3.5 7 3.5s7-2.1 7-3.5V12l-7 3.2L5 12Z" />
          </svg>
        )}
        {icon === "leaf" && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 20c9 0 15-6 15-15 0 0-3 0-6 1S6 9 5 20Z" />
          </svg>
        )}
        {icon === "star" && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="m12 2 3 7 7 .5-5.5 4.6L18 22l-6-4-6 4 1.5-7.9L2 9.5 9 9l3-7Z" />
          </svg>
        )}
      </span>
      {children}
    </li>
  );
}

function HeroDecor() {
  return (
    <>
      {/* Corner sunbeams */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-70"
        style={{ background: "var(--color-marigold-soft)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full opacity-60"
        style={{ background: "var(--color-paper-deep)" }}
      />

      {/* Scattered stars */}
      <StarSprite className="hidden md:block" style={{ top: "18%", right: "44%" }} size={20} />
      <StarSprite className="hidden md:block" style={{ top: "62%", right: "8%" }} size={16} />
      <StarSprite style={{ top: "8%", left: "62%" }} size={14} />

      {/* Sun icon top right */}
      <svg
        aria-hidden
        className="pointer-events-none absolute right-6 top-6 hidden md:block"
        width="64"
        height="64"
        viewBox="0 0 64 64"
      >
        <circle cx="32" cy="32" r="12" fill="#FFC845" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI * 2) / 8;
          const x1 = 32 + Math.cos(a) * 18;
          const y1 = 32 + Math.sin(a) * 18;
          const x2 = 32 + Math.cos(a) * 26;
          const y2 = 32 + Math.sin(a) * 26;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#FFC845"
              strokeWidth="4"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </>
  );
}

function StarSprite({
  size = 16,
  className = "",
  style,
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      aria-hidden
      className={`decor-star pointer-events-none ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={style}
    >
      <path d="m12 2 3 7 7 .5-5.5 4.6L18 22l-6-4-6 4 1.5-7.9L2 9.5 9 9l3-7Z" />
    </svg>
  );
}
