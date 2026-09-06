import Link from "next/link";
import { absoluteUrl } from "@/lib/site";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[color:var(--color-ink-mute)]">
          {items.map((c, i) => {
            const last = i === items.length - 1;
            return (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span aria-hidden className="text-[color:var(--color-line)]">/</span>
                )}
                {c.href && !last ? (
                  <Link
                    href={c.href}
                    className="rounded px-1 hover:text-[color:var(--color-navy)] hover:underline"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span
                    aria-current={last ? "page" : undefined}
                    className="rounded px-1 font-semibold text-[color:var(--color-navy)]"
                  >
                    {c.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: items.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.label,
              item: c.href ? absoluteUrl(c.href) : undefined,
            })),
          }),
        }}
      />
    </>
  );
}
