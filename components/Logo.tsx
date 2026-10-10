import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 group"
      aria-label="EarlyDays — home"
    >
      <Image
        src="/brand/mark.png"
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 shrink-0 object-contain"
        priority
        unoptimized
      />
      {!compact && (
        <span className="font-display text-[19px] font-semibold tracking-tight text-[color:var(--color-navy)]">
          Early<span className="text-[color:var(--color-coral)]">Days</span>
        </span>
      )}
    </Link>
  );
}
