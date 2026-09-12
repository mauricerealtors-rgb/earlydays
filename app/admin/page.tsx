import Link from "next/link";
import { getAdminOverview } from "@/lib/admin-data";
import { KpiCard } from "@/components/admin/KpiCard";
import { LineChart } from "@/components/admin/LineChart";
import { BarChart } from "@/components/admin/BarChart";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const data = await getAdminOverview();
  const t = data.totals;
  const claimRate = t.schools ? Math.round((t.claimed / t.schools) * 100) : 0;

  return (
    <>
      <header className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
          Dashboard
        </p>
        <h1 className="mt-1 font-display text-3xl md:text-4xl">Overview</h1>
        <p className="mt-2 text-sm text-white/60">
          Everything happening on EarlyDays, in one place.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Schools listed" value={t.schools} tint="sky" />
        <KpiCard
          label="Claimed"
          value={t.claimed}
          delta={`${claimRate}% of listings`}
          tint="leaf"
        />
        <KpiCard
          label="Pending claims"
          value={t.pendingClaims}
          delta={t.pendingClaims ? "Needs action" : "All clear"}
          deltaMood={t.pendingClaims ? "warn" : "good"}
          tint="sun"
        />
        <KpiCard
          label="MRR"
          value={`GH₵${t.mrrGhs.toLocaleString()}`}
          delta={`${t.approvedSubscriptions} active`}
          tint="pink"
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Views this week" value={t.viewsWeek} tint="sky" small />
        <KpiCard label="Enquiries this week" value={t.enquiriesWeek} tint="coral" small />
        <KpiCard label="All-time views" value={t.viewsTotal} tint="slate" small />
        <KpiCard label="All-time enquiries" value={t.enquiriesTotal} tint="slate" small />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="admin-card rounded-2xl border border-white/10 bg-white/[0.02] p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg">Traffic — last 30 days</h2>
              <p className="text-xs text-white/50">
                Views and contact clicks across all schools.
              </p>
            </div>
            <div className="flex gap-3 text-[11px] text-white/60">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-3 rounded-sm bg-[#66B7FF]" />
                Views
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-3 rounded-sm bg-[#FF7A59]" />
                Contacts
              </span>
            </div>
          </div>
          <LineChart data={data.viewsSeries} />
        </div>

        <div className="admin-card rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="font-display text-lg">Top schools (7 days)</h2>
          <p className="mb-3 text-xs text-white/50">By profile views.</p>
          <BarChart
            data={data.topSchools.map((s) => ({
              label: s.name.length > 22 ? s.name.slice(0, 22) + "…" : s.name,
              value: s.views,
              slug: s.slug,
            }))}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <ActivityCard
          title="Recent claims"
          href="/admin/claims"
          empty="No claims yet."
          rows={data.recentClaims.map((c) => ({
            id: c.id,
            title: c.schoolName,
            sub: `${c.submittedName} · ${c.submittedEmail}`,
            time: c.createdAt,
            badge: c.status,
            badgeClass:
              c.status === "approved"
                ? "bg-emerald-500/15 text-emerald-400"
                : c.status === "rejected"
                  ? "bg-red-500/15 text-red-400"
                  : "bg-amber-500/15 text-amber-400",
            href: `/admin/claims`,
          }))}
        />
        <ActivityCard
          title="Recent enquiries"
          href="/admin/enquiries"
          empty="No parent enquiries yet."
          rows={data.recentEnquiries.map((e) => ({
            id: e.id,
            title: `${e.parentName} → ${e.schoolName}`,
            sub: e.read ? "Read" : "Unread",
            time: e.createdAt,
            badge: e.read ? "read" : "new",
            badgeClass: e.read
              ? "bg-white/5 text-white/40"
              : "bg-pink-500/15 text-pink-400",
            href: `/admin/enquiries`,
          }))}
        />
      </div>
    </>
  );
}

function ActivityCard({
  title,
  href,
  empty,
  rows,
}: {
  title: string;
  href: string;
  empty: string;
  rows: {
    id: string;
    title: string;
    sub: string;
    time: string;
    badge: string;
    badgeClass: string;
    href: string;
  }[];
}) {
  return (
    <div className="admin-card rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg">{title}</h2>
        <Link href={href} className="text-xs text-white/50 hover:text-white">
          View all →
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-white/40">{empty}</p>
      ) : (
        <ul className="divide-y divide-white/5">
          {rows.map((r) => (
            <li key={r.id}>
              <Link
                href={r.href}
                className="flex items-center justify-between gap-3 py-3 hover:bg-white/[0.02]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm">{r.title}</p>
                  <p className="truncate text-xs text-white/40">
                    {r.sub}
                    {r.time && ` · ${formatTime(r.time)}`}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${r.badgeClass}`}>
                  {r.badge}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    const diffMs = Date.now() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    return d.toLocaleDateString("en-GB");
  } catch {
    return iso;
  }
}
