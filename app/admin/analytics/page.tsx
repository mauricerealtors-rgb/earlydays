import { getAdminOverview, getSchoolsCrm } from "@/lib/admin-data";
import { LineChart } from "@/components/admin/LineChart";
import { BarChart } from "@/components/admin/BarChart";
import { KpiCard } from "@/components/admin/KpiCard";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const [overview, schools] = await Promise.all([
    getAdminOverview(),
    getSchoolsCrm(),
  ]);
  const t = overview.totals;
  const totalContacts = schools.reduce((a, s) => a + s.contactClicks, 0);
  const conversion = t.viewsTotal ? (totalContacts / t.viewsTotal) * 100 : 0;

  // Aggregate views by area + by category from schools list.
  const byArea = groupTotals(schools, (s) => s.area);
  const byCategory = groupTotals(schools, (s) => s.primaryCategory);

  return (
    <>
      <header className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
          Insights
        </p>
        <h1 className="mt-1 font-display text-3xl md:text-4xl">Analytics</h1>
        <p className="mt-1 text-sm text-white/60">
          Site-wide traffic, engagement and where parents are looking.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Views (30 days)" value={sumSeries(overview.viewsSeries, "views")} tint="sky" />
        <KpiCard label="Contacts (30 days)" value={sumSeries(overview.viewsSeries, "contacts")} tint="coral" />
        <KpiCard label="All-time enquiries" value={t.enquiriesTotal} tint="pink" />
        <KpiCard label="Site conversion" value={`${conversion.toFixed(2)}%`} delta="Contacts ÷ views" tint="leaf" />
      </div>

      <div className="mt-6 admin-card rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="font-display text-lg">Traffic — last 30 days</h2>
        <p className="mb-3 text-xs text-white/50">Views (solid) and contact clicks (dashed).</p>
        <LineChart data={overview.viewsSeries} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="admin-card rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="font-display text-lg">Views by area</h2>
          <p className="mb-3 text-xs text-white/50">All-time.</p>
          <BarChart data={byArea} />
        </div>
        <div className="admin-card rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="font-display text-lg">Views by category</h2>
          <p className="mb-3 text-xs text-white/50">Based on each school's primary listing type.</p>
          <BarChart data={byCategory} />
        </div>
      </div>
    </>
  );
}

function sumSeries(rows: { views: number; contacts: number }[], key: "views" | "contacts") {
  return rows.reduce((a, r) => a + r[key], 0);
}

function groupTotals(
  rows: { views: number; area: string; primaryCategory: string }[],
  by: (r: { area: string; primaryCategory: string }) => string
) {
  const map = new Map<string, number>();
  for (const r of rows) {
    const key = by(r);
    map.set(key, (map.get(key) ?? 0) + r.views);
  }
  return Array.from(map.entries())
    .filter(([, v]) => v > 0)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}
