import Link from "next/link";

interface Row {
  label: string;
  value: number;
  slug?: string;
}

export function BarChart({ data }: { data: Row[] }) {
  if (data.length === 0) {
    return (
      <p className="py-6 text-sm text-white/40">
        No traffic data yet. Once parents visit schools, this will fill in.
      </p>
    );
  }
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <ul className="space-y-2">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const Row = (
          <div className="group flex items-center gap-3">
            <span className="flex-1 truncate text-sm text-white/80">{d.label}</span>
            <span className="w-10 text-right text-xs tabular-nums text-white/60">
              {d.value.toLocaleString()}
            </span>
          </div>
        );
        return (
          <li key={i}>
            {d.slug ? (
              <Link
                href={`/admin/schools/${d.slug}`}
                className="block rounded-lg px-2 py-1 hover:bg-white/5"
              >
                {Row}
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="chart-bar h-full rounded-full bg-gradient-to-r from-sky-500 to-pink-500"
                    style={{ width: `${pct}%`, animationDelay: `${i * 40}ms` }}
                  />
                </div>
              </Link>
            ) : (
              <div className="rounded-lg px-2 py-1">
                {Row}
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="chart-bar h-full rounded-full bg-gradient-to-r from-sky-500 to-pink-500"
                    style={{ width: `${pct}%`, animationDelay: `${i * 40}ms` }}
                  />
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
