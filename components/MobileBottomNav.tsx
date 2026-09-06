import Link from "next/link";

const items: { href: string; label: string; icon: React.ReactNode }[] = [
  {
    href: "/",
    label: "Discover",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
        <path d="M4 12 12 4l8 8v8h-5v-6h-6v6H4v-8Z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    href: "/schools",
    label: "Search",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
        <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/saved",
    label: "Saved",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
        <path d="M6 3h12v18l-6-4-6 4V3Z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    href: "/guides",
    label: "Guides",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
        <path d="M5 4h9a4 4 0 0 1 4 4v12H9a4 4 0 0 1-4-4V4Z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    href: "/for-schools",
    label: "Schools",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
        <path d="M4 11 12 5l8 6v9H4v-9Z" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
];

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Primary mobile"
      className="mobile-nav fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{
        background: "rgba(255,248,239,0.96)",
        borderTop: "1px solid var(--color-line-2)",
        backdropFilter: "blur(10px)",
      }}
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5 px-2 pt-2">
        {items.map((it) => (
          <li key={it.href} className="flex">
            <Link
              href={it.href}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[11px] font-semibold text-[color:var(--color-navy)]"
            >
              {it.icon}
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
