import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 group"
      aria-label="EarlyDays — home"
    >
      <span
        aria-hidden
        className="inline-flex h-9 w-9 items-center justify-center rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #FFC845 0%, #FF7A59 55%, #FF9FC0 100%)",
          boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.06)",
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
          <path
            d="M4 12c2 0 3-1.6 3-3.5S6 5 4 5v7Zm16 0c-2 0-3-1.6-3-3.5S18 5 20 5v7ZM6 15c0 2.8 2.7 5 6 5s6-2.2 6-5H6Z"
            fill="#0F2A4A"
          />
        </svg>
      </span>
      {!compact && (
        <span className="font-display text-[19px] font-semibold tracking-tight text-[color:var(--color-navy)]">
          Early<span className="text-[color:var(--color-coral)]">Days</span>
        </span>
      )}
    </Link>
  );
}
