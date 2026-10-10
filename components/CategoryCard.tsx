import Link from "next/link";
import type { Category } from "@/lib/types";

/**
 * A category tile.
 *
 * Flat, bordered, one accent. It used to render a photo behind a dark scrim,
 * but those nine photos were AI-generated — invented words on the classroom
 * walls — which is the one thing we refuse to accept from schools. Borrowing a
 * real school's photo to stand for an entire category is a different
 * permission from showing it on that school's own listing, so the honest
 * version of this card has no photograph at all.
 *
 * It also drops nine image requests from the homepage.
 */
export function CategoryCard({
  category,
  count,
  href,
}: {
  category: Category;
  count?: number;
  href?: string;
}) {
  const to = href ?? `/${category.slug}`;

  return (
    <Link
      href={to}
      aria-label={`${category.plural}. explore`}
      className="group flex h-full min-h-[150px] flex-col justify-between rounded-lg border border-[color:var(--color-line)] bg-white p-4 transition-colors hover:border-[color:var(--color-marigold)] md:min-h-[170px] md:p-5"
    >
      <div>
        <h3 className="font-display text-[17px] font-extrabold leading-tight tracking-tight text-[color:var(--color-ink)] md:text-[20px]">
          {category.plural}
        </h3>
        <p className="mt-1.5 text-[12px] leading-snug text-[color:var(--color-ink-mute)] md:text-[13px]">
          {category.short}
        </p>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)] md:text-[11px]">
          {typeof count === "number" ? `${count} listed` : "Explore"}
        </span>
        <span
          aria-hidden
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-marigold-soft)] text-[color:var(--color-ink)] transition-transform group-hover:translate-x-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
