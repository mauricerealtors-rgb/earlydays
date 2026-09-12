const TINT: Record<string, string> = {
  sky: "bg-gradient-to-br from-sky-500/20 to-transparent border-sky-500/20",
  leaf: "bg-gradient-to-br from-emerald-500/20 to-transparent border-emerald-500/20",
  sun: "bg-gradient-to-br from-amber-500/20 to-transparent border-amber-500/20",
  coral: "bg-gradient-to-br from-orange-500/20 to-transparent border-orange-500/20",
  pink: "bg-gradient-to-br from-pink-500/20 to-transparent border-pink-500/20",
  slate: "bg-gradient-to-br from-white/10 to-transparent border-white/10",
};

export function KpiCard({
  label,
  value,
  delta,
  deltaMood,
  tint = "slate",
  small = false,
}: {
  label: string;
  value: string | number;
  delta?: string;
  deltaMood?: "good" | "warn" | "neutral";
  tint?: keyof typeof TINT | string;
  small?: boolean;
}) {
  const deltaClass =
    deltaMood === "good"
      ? "text-emerald-400"
      : deltaMood === "warn"
        ? "text-amber-400"
        : "text-white/40";
  return (
    <div
      className={`admin-card rounded-2xl border p-4 ${TINT[tint] ?? TINT.slate}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
        {label}
      </p>
      <p
        className={`mt-1 font-display text-white ${
          small ? "text-[22px]" : "text-[30px]"
        } leading-tight`}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {delta && (
        <p className={`mt-1 text-[11px] ${deltaClass}`}>{delta}</p>
      )}
    </div>
  );
}
