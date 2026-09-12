import Link from "next/link";
import { getSchoolsCrm } from "@/lib/admin-data";
import { KpiCard } from "@/components/admin/KpiCard";

export const dynamic = "force-dynamic";

const PLAN_MRR: Record<string, number> = { verified: 200, featured: 500 };

export default async function AdminSubscriptionsPage() {
  const rows = await getSchoolsCrm();
  const paying = rows.filter((r) => r.tier !== "free");
  const featured = paying.filter((r) => r.tier === "featured");
  const verified = paying.filter((r) => r.tier === "verified");
  const mrr = paying.reduce((a, r) => a + (PLAN_MRR[r.tier] ?? 0), 0);
  const arr = mrr * 12;

  return (
    <>
      <header className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
          Revenue
        </p>
        <h1 className="mt-1 font-display text-3xl md:text-4xl">Subscriptions</h1>
        <p className="mt-1 text-sm text-white/60">
          Paying schools, MRR, and renewal status.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="MRR" value={`GH₵${mrr.toLocaleString()}`} tint="pink" />
        <KpiCard label="ARR" value={`GH₵${arr.toLocaleString()}`} tint="sun" />
        <KpiCard label="Verified" value={verified.length} tint="sky" />
        <KpiCard label="Featured" value={featured.length} tint="coral" />
      </div>

      <div className="mt-8 admin-card overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="border-b border-white/10 px-4 py-3">
          <h2 className="font-display text-lg">Active subscriptions</h2>
        </div>
        {paying.length === 0 ? (
          <p className="p-8 text-center text-sm text-white/40">
            No paying subscriptions yet. When a school upgrades via Paystack, they'll appear here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40">
                <tr>
                  <th className="px-3 py-2 text-left">School</th>
                  <th className="px-3 py-2 text-left">Plan</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-right">MRR</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paying.map((r) => (
                  <tr key={r.slug} className="hover:bg-white/[0.03]">
                    <td className="px-3 py-2.5">
                      <p className="font-medium">{r.name}</p>
                      <p className="text-[10px] text-white/40">/{r.slug}</p>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${
                          r.tier === "featured"
                            ? "bg-gradient-to-r from-pink-500/25 to-amber-500/25 text-pink-300"
                            : "bg-sky-500/15 text-sky-300"
                        }`}
                      >
                        {r.tier}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${
                          r.subscriptionStatus === "active"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : r.subscriptionStatus === "past-due"
                              ? "bg-amber-500/15 text-amber-400"
                              : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {r.subscriptionStatus ?? "active"}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      GH₵{(PLAN_MRR[r.tier] ?? 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <Link
                        href={`/schools/${r.slug}`}
                        target="_blank"
                        className="text-[11px] text-white/50 hover:text-white"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
