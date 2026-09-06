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
          "radial-gradient(1200px 500px at 100% -10%, rgba(102,183,255,0.20), transparent 60%), radial-gradient(900px 500px at 0% 0%, rgba(255,159,192,0.25), transparent 60%)",
      }}
    >
      <BlobDecor />
      <div className="container-page relative pt-10 pb-14 md:pt-20 md:pb-20">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-line)] bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[color:var(--color-navy)]">
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-coral)]" />
            Made for parents in Ghana
          </span>
          <h1
            id="hero-title"
            className="mt-5 font-display text-[40px] leading-[1.02] tracking-tight md:text-[64px]"
          >
            Find a school or learning centre{" "}
            <span
              className="inline-block rounded-2xl px-2"
              style={{
                background: "linear-gradient(180deg, transparent 60%, #FFE9A3 60%)",
              }}
            >
              your child
            </span>{" "}
            will love.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-[color:var(--color-ink-mute)]">
            Discover creches, preschools, kindergartens, primary schools and
            children's learning centres — searchable by area, age and
            programme.
          </p>
        </div>

        <form
          action="/schools"
          method="get"
          className="card mt-8 grid gap-3 p-3 md:mt-10 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center md:gap-2 md:p-2"
        >
          <div className="field rounded-2xl bg-[color:var(--color-cream)] p-3 md:p-4">
            <label htmlFor="q-category">I'm looking for</label>
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
            <label htmlFor="q-area">Near</label>
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
            <label htmlFor="q-age">Child's age</label>
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
            className="btn btn-sun w-full text-base md:w-auto"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Search
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-[color:var(--color-ink-mute)]">
          <span className="mr-1 font-semibold text-[color:var(--color-navy)]">
            Popular:
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

function BlobDecor() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-70"
        style={{ background: "radial-gradient(circle at 30% 30%, #FFC845 0, transparent 60%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-32 h-64 w-64 rounded-full opacity-60"
        style={{ background: "radial-gradient(circle at 60% 60%, #66B7FF 0, transparent 60%)" }}
      />
    </>
  );
}
