import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/data/guides";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Parent guides. choosing schools in Ghana",
  description:
    "Honest, plain-English guides for Ghanaian parents choosing creches, preschools, KG, primary schools and children's learning centres.",
  alternates: { canonical: `${SITE.url}/guides` },
};

export default function GuidesIndex() {
  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
      <PageHeading
        eyebrow="Parent guides"
        title="Read before you visit"
        subtitle="Short, honest guides for the decisions that actually keep parents up at night."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="card p-5 hover:shadow-lg">
            <span className="chip">{g.tag}</span>
            <h2 className="mt-3 font-display text-xl leading-tight text-[color:var(--color-navy)]">
              {g.title}
            </h2>
            <p className="mt-2 text-sm text-[color:var(--color-ink-mute)]">{g.dek}</p>
            <p className="mt-3 text-xs text-[color:var(--color-ink-mute)]">
              {g.readingMinutes} min read
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
