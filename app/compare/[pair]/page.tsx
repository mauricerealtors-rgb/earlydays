import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CompareTable } from "@/components/CompareTable";
import { ShareRow } from "@/components/ShareRow";
import { curatedPairs, findPair, verdictFor } from "@/lib/comparisons";
import { findLocation } from "@/data/locations";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export const revalidate = 60;

export async function generateStaticParams() {
  return curatedPairs().map((p) => ({ pair: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const p = findPair(pair);
  if (!p) return {};
  const title = `${p.a.name} vs ${p.b.name}. Which school suits your family?`;
  const description = `Side-by-side comparison of ${p.a.name} and ${p.b.name}: location, ages, curriculum, services and fees. Neither is better. They're different.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE.url}/compare/${p.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE.url}/compare/${p.slug}`,
      type: "article",
    },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const p = findPair(pair);
  if (!p) notFound();
  const { a, b, reason } = p;

  const heroA = a.images?.[0];
  const heroB = b.images?.[0];
  const locA = findLocation(a.neighbourhood);
  const locB = findLocation(b.neighbourhood);
  const shareUrl = `${SITE.url}/compare/${p.slug}`;
  const shareText = `${a.name} vs ${b.name} — which would you choose?`;

  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Compare", href: "/compare" },
          { label: `${a.name} vs ${b.name}` },
        ]}
      />

      {/* Hero */}
      <div className="mt-6 text-center">
        <span className="chip chip-sun">School vs school</span>
        <h1 className="mt-3 font-display text-[30px] leading-tight tracking-tight md:text-[46px]">
          {a.name}{" "}
          <span className="text-[color:var(--color-ink-mute)]">vs</span>{" "}
          {b.name}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-relaxed text-[color:var(--color-ink-mute)] md:text-[16px]">
          {reason}. Same facts, side by side, no opinions on which is
          &ldquo;better&rdquo;.
        </p>
      </div>

      {/* Photo strip */}
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        <PhotoTile
          src={heroA?.url}
          alt={heroA?.alt ?? a.name}
          name={a.name}
          area={locA?.name ?? a.region}
          href={`/schools/${a.slug}`}
          accent="sky"
        />
        <PhotoTile
          src={heroB?.url}
          alt={heroB?.alt ?? b.name}
          name={b.name}
          area={locB?.name ?? b.region}
          href={`/schools/${b.slug}`}
          accent="coral"
        />
      </div>

      {/* Comparison table */}
      <div className="mt-8">
        <CompareTable a={a} b={b} />
      </div>

      {/* Verdict block */}
      <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-[color:var(--color-line)] bg-white p-6 text-center md:p-10">
        <h2 className="font-display text-[24px] leading-tight md:text-[32px]">
          {verdictFor(a, b).headline}
        </h2>
        <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--color-ink-mute)] md:text-[15px]">
          {verdictFor(a, b).body}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={`/schools/${a.slug}`}
            className="btn btn-primary text-sm"
          >
            See {a.name}
          </Link>
          <Link
            href={`/schools/${b.slug}`}
            className="btn btn-primary text-sm"
          >
            See {b.name}
          </Link>
        </div>
        <div className="mt-6">
          <ShareRow url={shareUrl} text={shareText} />
        </div>
      </div>

      {/* Related comparisons */}
      <RelatedPairs currentSlug={p.slug} />
    </div>
  );
}

function PhotoTile({
  src,
  alt,
  name,
  area,
  href,
  accent,
}: {
  src?: string;
  alt: string;
  name: string;
  area: string;
  href: string;
  accent: "sky" | "coral";
}) {
  const ring =
    accent === "sky"
      ? "ring-[color:var(--color-sky-deep)]"
      : "ring-[color:var(--color-coral)]";
  const chip =
    accent === "sky"
      ? "bg-[color:var(--color-sky-soft)] text-[color:var(--color-sky-deep)]"
      : "bg-[color:var(--color-coral-soft)] text-[color:var(--color-coral)]";
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-3xl bg-[color:var(--color-cream-deep)] ring-2 ${ring}`}
    >
      <div className="relative aspect-[4/3]">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <InitialTile name={name} accent={accent} />
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 text-white">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${chip}`}
        >
          {area}
        </span>
        <p className="mt-1 font-display text-[18px] leading-tight md:text-[22px]">
          {name}
        </p>
      </div>
    </Link>
  );
}

function InitialTile({
  name,
  accent,
}: {
  name: string;
  accent: "sky" | "coral";
}) {
  const initials = name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  const bg =
    accent === "sky"
      ? "linear-gradient(135deg, #DDEEFF 0%, #66B7FF 70%, #1F7AD6 100%)"
      : "linear-gradient(135deg, #FFDED2 0%, #FF9FC0 60%, #FF7A59 100%)";
  return (
    <div
      className="grid h-full place-items-center"
      style={{ background: bg }}
    >
      <span
        className="font-display text-white/95"
        style={{
          fontSize: "5rem",
          fontWeight: 700,
          letterSpacing: "-2px",
          textShadow: "0 4px 20px rgba(15,42,74,0.25)",
        }}
      >
        {initials || "•"}
      </span>
    </div>
  );
}

function RelatedPairs({ currentSlug }: { currentSlug: string }) {
  const others = curatedPairs()
    .filter((p) => p.slug !== currentSlug)
    .slice(0, 6);
  if (others.length === 0) return null;
  return (
    <section className="mt-14 mb-16 md:mt-20">
      <h2 className="mb-4 font-display text-[22px] leading-tight md:text-[28px]">
        More school-vs-school comparisons
      </h2>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {others.map((p) => (
          <Link
            key={p.slug}
            href={`/compare/${p.slug}`}
            className="rounded-2xl border border-[color:var(--color-line)] bg-white p-5 hover:shadow-lg"
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
              School vs school
            </p>
            <p className="mt-1 font-display text-[16px] leading-tight text-[color:var(--color-navy)] md:text-[18px]">
              {p.a.name} vs {p.b.name}
            </p>
            <p className="mt-2 text-[12px] text-[color:var(--color-ink-mute)]">
              {p.reason}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
