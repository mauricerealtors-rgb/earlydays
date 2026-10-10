import Link from "next/link";
import type { Location } from "@/lib/types";

export function LocationCard({ location, count }: { location: Location; count: number }) {
  return (
    <Link
      href={`/schools/${location.region}/${location.slug}`}
      className="card-soft group relative overflow-hidden rounded-2xl p-4 hover:border-[color:var(--color-navy)]/20"
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ background: "linear-gradient(135deg,#DDEEFF,#E4F5DF)" }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
            <path
              d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z"
              stroke="#0F2A4A"
              strokeWidth="1.6"
            />
            <circle cx="12" cy="10" r="2.5" stroke="#0F2A4A" strokeWidth="1.6" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[14px] leading-tight text-[color:var(--color-navy)]">
            {location.name}
          </h3>
          <p className="text-[10px] text-[color:var(--color-ink-mute)]">
            {location.regionName}
          </p>
        </div>
        <span className="text-[11px] font-bold text-[color:var(--color-navy)]/60">{count}</span>
      </div>
    </Link>
  );
}
