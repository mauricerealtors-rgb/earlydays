import Link from "next/link";

export function EmptyResults({
  title = "We couldn't find a close match.",
  nearby,
}: {
  title?: string;
  nearby?: { href: string; label: string }[];
}) {
  return (
    <div className="card-soft rounded-2xl p-6 md:p-10">
      <h2 className="font-display text-2xl text-[color:var(--color-navy)]">
        {title}
      </h2>
      <p className="mt-2 max-w-lg text-[color:var(--color-ink-mute)]">
        Try expanding your location, removing a filter, or browsing nearby
        areas. We only publish listings when we have enough information to be
        useful.
      </p>
      {nearby && nearby.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
            Try nearby
          </p>
          <div className="flex flex-wrap gap-2">
            {nearby.map((n) => (
              <Link key={n.href} href={n.href} className="chip chip-sky">
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
