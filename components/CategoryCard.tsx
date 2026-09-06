import Link from "next/link";
import type { Category } from "@/lib/types";

const styles: Record<Category["accent"], { bg: string; ring: string; ink: string; art: string }> = {
  sky: {
    bg: "linear-gradient(160deg, #E4F1FF 0%, #C7E1FF 100%)",
    ring: "rgba(31,122,214,0.15)",
    ink: "#0F2A4A",
    art: "#66B7FF",
  },
  leaf: {
    bg: "linear-gradient(160deg, #EAF6E5 0%, #C9EABD 100%)",
    ring: "rgba(47,124,37,0.15)",
    ink: "#0F2A4A",
    art: "#7AC66B",
  },
  sun: {
    bg: "linear-gradient(160deg, #FFF3D1 0%, #FFE39B 100%)",
    ring: "rgba(122,90,0,0.15)",
    ink: "#0F2A4A",
    art: "#FFC845",
  },
  coral: {
    bg: "linear-gradient(160deg, #FFE1D5 0%, #FFC5B0 100%)",
    ring: "rgba(178,58,26,0.15)",
    ink: "#0F2A4A",
    art: "#FF7A59",
  },
  blossom: {
    bg: "linear-gradient(160deg, #FFE8F1 0%, #FFC5DC 100%)",
    ring: "rgba(168,48,106,0.15)",
    ink: "#0F2A4A",
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
  const s = styles[category.accent];
  const to = href ?? `/${category.slug}`;
  return (
    <Link
      href={to}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-5 transition-shadow"
      style={{
        background: s.bg,
        boxShadow: `inset 0 0 0 1px ${s.ring}`,
        minHeight: 170,
      }}
    >
      <div>
        <h3
          className="font-display text-[22px] leading-tight tracking-tight"
          style={{ color: s.ink }}
        >
          {category.plural}
        </h3>
        <p className="mt-1 max-w-[16ch] text-sm text-[color:var(--color-navy-2)]/85">
          {category.short}
        </p>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-navy)]/70">
          {typeof count === "number"
            ? `${count} listed`
            : "Explore"}
        </span>
        <span
          aria-hidden
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-[color:var(--color-navy)] transition-transform group-hover:translate-x-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full opacity-70"
        style={{ background: s.art, filter: "blur(0.5px)" }}
      />
    </Link>
  );
}
