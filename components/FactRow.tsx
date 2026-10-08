export function FactRow({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    // minmax(0,1fr) rather than 1fr: a bare fr column has min-width:auto, so a
    // long unbroken string — an email, a URL, a street address — forces the
    // column wider than the phone and the whole page scrolls sideways. The
    // label column also narrows on small screens to leave the value room.
    <div className="grid grid-cols-[minmax(96px,120px)_minmax(0,1fr)] items-baseline gap-3 border-b border-[color:var(--color-line-2)] py-3 last:border-none sm:grid-cols-[minmax(120px,150px)_minmax(0,1fr)]">
      <dt className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
        {label}
      </dt>
      <dd className="min-w-0 break-words text-[15px] font-semibold text-[color:var(--color-navy)]">
        {value}
        {hint && (
          <span className="ml-2 text-xs font-normal text-[color:var(--color-ink-mute)]">
            {hint}
          </span>
        )}
      </dd>
    </div>
  );
}
