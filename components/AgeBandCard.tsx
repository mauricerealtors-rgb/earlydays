import Link from "next/link";

export interface AgeBand {
  slug: string;
  label: string;              // "Baby Care"
  ages: string;               // "6 months – 2 years"
  accent: "sky" | "blossom" | "sun" | "leaf";
  href: string;
  icon: "baby" | "toddler" | "nursery" | "kg";
}

const styles: Record<AgeBand["accent"], { bg: string; ink: string; art: string; arrow: string }> = {
  sky: {
    bg: "#DDEEFF",
    ink: "#1F7AD6",
    art: "#66B7FF",
    arrow: "#1F7AD6",
  },
  blossom: {
    bg: "#FFE4EF",
    ink: "#C4155F",
    art: "#EC1E7A",
    arrow: "#C4155F",
  },
  sun: {
    bg: "#FFF3D1",
    ink: "#7A5A00",
    art: "#E5A800",
    arrow: "#7A5A00",
  },
  leaf: {
    bg: "#E4F5DF",
    ink: "#2F7C25",
    art: "#7AC66B",
    arrow: "#2F7C25",
  },
};

export function AgeBandCard({ band }: { band: AgeBand }) {
  const s = styles[band.accent];
  return (
    <Link
      href={band.href}
      className="group relative flex items-center gap-3 overflow-hidden rounded-3xl p-4 pr-3 transition-transform hover:-translate-y-0.5"
      style={{ background: s.bg }}
      aria-label={`${band.label} — ages ${band.ages}`}
    >
      <span
        aria-hidden
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
        style={{ background: "rgba(255,255,255,0.55)" }}
      >
        <BandIcon icon={band.icon} color={s.art} />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className="font-display text-[22px] leading-tight tracking-tight"
          style={{ color: s.ink }}
        >
          {band.label}
        </p>
        <p className="text-sm font-semibold text-[color:var(--color-navy-2)]/85">
          {band.ages}
        </p>
      </div>
      <span
        aria-hidden
        className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:translate-x-1"
        style={{ background: "rgba(255,255,255,0.7)", color: s.arrow }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}

function BandIcon({
  icon,
  color,
}: {
  icon: AgeBand["icon"];
  color: string;
}) {
  const common = { fill: color };
  switch (icon) {
    case "baby":
      return (
        <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden>
          <circle cx="32" cy="24" r="12" {...common} />
          <path
            d="M14 54c0-10 8-16 18-16s18 6 18 16H14Z"
            {...common}
          />
          <circle cx="27" cy="22" r="2" fill="#fff" />
          <circle cx="37" cy="22" r="2" fill="#fff" />
        </svg>
      );
    case "toddler":
      return (
        <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden>
          <circle cx="32" cy="20" r="10" {...common} />
          <path
            d="M22 32h20l4 16c0 3-4 5-4 5H22s-4-2-4-5l4-16Z"
            {...common}
          />
          <circle cx="28" cy="19" r="1.6" fill="#fff" />
          <circle cx="36" cy="19" r="1.6" fill="#fff" />
        </svg>
      );
    case "nursery":
      return (
        <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden>
          <circle cx="32" cy="20" r="9" {...common} />
          <path
            d="M18 54c2-12 8-20 14-20s12 8 14 20H18Z"
            {...common}
          />
          <rect x="24" y="40" width="16" height="10" rx="2" fill="#fff" opacity=".85" />
          <path d="M24 40h16v2H24z" fill={color} opacity=".2" />
        </svg>
      );
    case "kg":
      return (
        <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden>
          <circle cx="32" cy="18" r="8" {...common} />
          <path
            d="M20 54c0-8 5-16 12-16s12 8 12 16H20Z"
            {...common}
          />
          <path
            d="M18 34l14-6 14 6-14 6-14-6Z"
            {...common}
          />
          <path d="M46 36v6" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
  }
}

export const AGE_BANDS: AgeBand[] = [
  {
    slug: "babies",
    label: "Baby Care",
    ages: "6 months – 2 years",
    accent: "sky",
    href: "/creches",
    icon: "baby",
  },
  {
    slug: "toddlers",
    label: "Toddlers",
    ages: "2 – 3 years",
    accent: "blossom",
    href: "/creches",
    icon: "toddler",
  },
  {
    slug: "nursery",
    label: "Nursery",
    ages: "3 – 4 years",
    accent: "sun",
    href: "/preschools",
    icon: "nursery",
  },
  {
    slug: "kg",
    label: "KG & Primary",
    ages: "4 – 6 years",
    accent: "leaf",
    href: "/kindergartens",
    icon: "kg",
  },
];
