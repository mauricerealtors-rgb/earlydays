import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

const gradients: Record<Category["accent"], { bg: string; ring: string; art: string }> = {
  sky: {
    bg: "var(--color-paper-deep)",
    ring: "rgba(31,122,214,0.15)",
    art: "#66B7FF",
  },
  leaf: {
    bg: "var(--color-paper-deep)",
    ring: "rgba(47,124,37,0.15)",
    art: "#7AC66B",
  },
  sun: {
    bg: "var(--color-marigold-soft)",
    ring: "rgba(122,90,0,0.15)",
    art: "#FFC845",
  },
  coral: {
    bg: "var(--color-paper-deep)",
    ring: "rgba(178,58,26,0.15)",
    art: "#FF7A59",
  },
  blossom: {
    bg: "var(--color-marigold-soft)",
    ring: "rgba(168,48,106,0.15)",
    art: "#FF9FC0",
  },
};

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
  const useImage = Boolean(category.image);

  if (useImage) {
    return (
      <Link
        href={to}
        className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-4 min-h-[170px] md:p-5 md:min-h-[200px]"
        aria-label={`${category.plural}. explore`}
      >
        <Image
          src={category.image!}
          alt={category.imageAlt ?? ""}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {/* Dark overlay for legibility. heavier at bottom where text sits */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(16,36,59,0.35) 0%, rgba(16,36,59,0.55) 45%, rgba(16,36,59,0.86) 100%)",
          }}
        />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <h3 className="font-display text-[18px] leading-tight tracking-tight text-white md:text-[22px]">
              {category.plural}
            </h3>
            <p className="mt-1 max-w-[18ch] text-[12px] leading-snug text-white/90 md:text-[13px]">
              {category.short}
            </p>
          </div>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/85 md:text-[11px]">
              {typeof count === "number" ? `${count} listed` : "Explore"}
            </span>
            <span
              aria-hidden
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[color:var(--color-navy)] transition-transform group-hover:translate-x-1 md:h-9 md:w-9"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Gradient fallback (no image supplied yet)
  const s = gradients[category.accent];
  return (
    <Link
      href={to}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-4 min-h-[170px] md:p-5 md:min-h-[200px]"
      style={{
        background: s.bg,
        boxShadow: `inset 0 0 0 1px ${s.ring}`,
      }}
    >
      <div>
        <h3 className="font-display text-[18px] leading-tight tracking-tight text-[color:var(--color-navy)] md:text-[22px]">
          {category.plural}
        </h3>
        <p className="mt-1 max-w-[18ch] text-[12px] leading-snug text-[color:var(--color-navy-2)]/85 md:text-[13px]">
          {category.short}
        </p>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-navy)]/70 md:text-[11px]">
          {typeof count === "number" ? `${count} listed` : "Explore"}
        </span>
        <span
          aria-hidden
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-[color:var(--color-navy)] transition-transform group-hover:translate-x-1 md:h-9 md:w-9"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full opacity-70 md:h-24 md:w-24"
        style={{ background: s.art, filter: "blur(0.5px)" }}
      />
    </Link>
  );
}
