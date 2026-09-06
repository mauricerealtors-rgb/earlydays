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
    <div className="grid grid-cols-[minmax(120px,150px)_1fr] items-baseline gap-3 border-b border-[color:var(--color-line-2)] py-3 last:border-none">
      <dt className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
        {label}
      </dt>
      <dd className="text-[15px] font-semibold text-[color:var(--color-navy)]">
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
