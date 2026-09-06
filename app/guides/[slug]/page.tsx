import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GUIDES, findGuide } from "@/data/guides";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.dek,
    alternates: { canonical: `${SITE.url}/guides/${g.slug}` },
    openGraph: {
      type: "article",
      title: g.title,
      description: g.dek,
      publishedTime: g.updatedAt,
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) notFound();
  const related = GUIDES.filter((x) => x.slug !== g.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.title,
          description: g.dek,
          datePublished: g.updatedAt,
          dateModified: g.updatedAt,
          author: { "@type": "Organization", name: SITE.name },
          publisher: { "@type": "Organization", name: SITE.name },
          mainEntityOfPage: `${SITE.url}/guides/${g.slug}`,
        }}
      />

      <article className="container-page pt-8 md:pt-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: g.title },
          ]}
        />
        <div className="mx-auto max-w-2xl">
          <span className="chip chip-sun">{g.tag}</span>
          <h1 className="mt-3 font-display text-[36px] leading-tight tracking-tight md:text-[52px]">
            {g.title}
          </h1>
          <p className="mt-3 text-lg text-[color:var(--color-ink-mute)]">{g.dek}</p>
          <p className="mt-3 text-xs uppercase tracking-widest text-[color:var(--color-ink-mute)]">
            {g.readingMinutes} min read · Updated {formatDate(g.updatedAt)}
          </p>

          <div className="prose-content mt-10 space-y-6">
            {g.body.map((section, i) => (
              <section key={i}>
                {section.heading && (
                  <h2 className="mb-2 mt-4 font-display text-2xl text-[color:var(--color-navy)]">
                    {section.heading}
                  </h2>
                )}
                {section.paragraphs.map((p, j) => (
                  <p key={j} className="text-[17px] leading-relaxed text-[color:var(--color-ink)]">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mx-auto mt-16 max-w-2xl">
            <h2 className="mb-3 font-display text-xl">More parent guides</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/guides/${r.slug}`} className="card-soft p-4 hover:border-[color:var(--color-navy)]/20">
                  <span className="chip">{r.tag}</span>
                  <p className="mt-2 font-display text-base leading-tight text-[color:var(--color-navy)]">
                    {r.title}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
