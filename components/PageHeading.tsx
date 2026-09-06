export function PageHeading({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
      <div className="max-w-2xl">
        {eyebrow && (
          <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-line)] bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-navy)]">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display text-[32px] leading-tight tracking-tight md:text-[46px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--color-ink-mute)] md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
