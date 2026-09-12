"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

interface Stats {
  views: number;
  calls: number;
  whatsapps: number;
  websiteClicks: number;
  emails: number;
  enquiries: number;
  daily?: Record<string, { views?: number; contacts?: number; enquiries?: number }>;
}
interface Enquiry {
  id: string;
  parentName: string;
  createdAt: string;
  readAt?: string | null;
}

const empty: Stats = {
  views: 0,
  calls: 0,
  whatsapps: 0,
  websiteClicks: 0,
  emails: 0,
  enquiries: 0,
};

export function OverviewPanel({
  slug,
  listingName,
}: {
  slug: string;
  listingName: string;
}) {
  const [stats, setStats] = useState<Stats>(empty);
  const [tier, setTier] = useState<"free" | "verified" | "featured">("free");
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const unsubStats = onSnapshot(doc(firestore(), "stats", slug), (snap) => {
      const data = snap.data() ?? {};
      setStats({
        views: data.views ?? 0,
        calls: data.calls ?? 0,
        whatsapps: data.whatsapps ?? 0,
        websiteClicks: data.websiteClicks ?? 0,
        emails: data.emails ?? 0,
        enquiries: data.enquiries ?? 0,
        daily: data.daily ?? {},
      });
    });
    const unsubSub = onSnapshot(doc(firestore(), "subscriptions", slug), (snap) => {
      const t = snap.data()?.tier ?? "free";
      setTier(t as "free" | "verified" | "featured");
    });
    const unsubEnq = onSnapshot(
      query(
        collection(firestore(), "enquiries"),
        where("slug", "==", slug),
        orderBy("createdAt", "desc")
      ),
      (snap) => {
        const rows: Enquiry[] = [];
        let u = 0;
        snap.forEach((d) => {
          const data = d.data();
          if (!data.readAt) u++;
          rows.push({
            id: d.id,
            parentName: data.parentName ?? "",
            createdAt: data.createdAt ?? "",
            readAt: data.readAt,
          });
        });
        setRecentEnquiries(rows.slice(0, 6));
        setUnread(u);
      }
    );
    return () => {
      unsubStats();
      unsubSub();
      unsubEnq();
    };
  }, [slug]);

  const totalContacts =
    stats.calls + stats.whatsapps + stats.websiteClicks + stats.emails;
  const conversion = stats.views ? (totalContacts / stats.views) * 100 : 0;

  // 14-day chart
  const days: { label: string; views: number; contacts: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const entry = stats.daily?.[key];
    days.push({
      label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      views: entry?.views ?? 0,
      contacts: entry?.contacts ?? 0,
    });
  }
  const maxDaily = Math.max(1, ...days.map((d) => Math.max(d.views, d.contacts)));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
          Overview
        </p>
        <h1 className="mt-1 font-display text-3xl text-[color:var(--color-navy)] md:text-4xl">
          {listingName}
        </h1>
        <p className="mt-1 text-sm text-[color:var(--color-ink-mute)]">
          Everything happening on your profile.
        </p>
      </header>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Profile views" value={stats.views} tint="sky" />
        <Kpi label="Contact clicks" value={totalContacts} tint="leaf" />
        <Kpi label="Enquiries" value={stats.enquiries} tint="coral" />
        <Kpi
          label="Unread"
          value={unread}
          tint={unread > 0 ? "pink" : "slate"}
          delta={unread > 0 ? "Needs reply" : "All clear"}
          deltaMood={unread > 0 ? "warn" : "good"}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniKpi label="Calls" value={stats.calls} />
        <MiniKpi label="WhatsApp" value={stats.whatsapps} />
        <MiniKpi label="Website" value={stats.websiteClicks} />
        <MiniKpi label="Conversion" value={`${conversion.toFixed(1)}%`} />
      </div>

      {/* Plan callout */}
      <section className="admin-card rounded-2xl border border-[color:var(--color-line)] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
              Current plan
            </p>
            <p className="mt-1 font-display text-xl capitalize text-[color:var(--color-navy)]">
              {tier}
              {tier === "free" && (
                <span className="ml-2 text-sm font-normal text-[color:var(--color-ink-mute)]">
                  · Free listing
                </span>
              )}
            </p>
          </div>
          <Link href={`/school/${slug}/billing`} className={tier === "free" ? "btn btn-pink text-sm" : "btn btn-ghost text-sm"}>
            {tier === "free" ? "Upgrade to Verified" : "Manage plan"}
          </Link>
        </div>
      </section>

      {/* 14-day chart */}
      <section className="admin-card rounded-2xl border border-[color:var(--color-line)] bg-white p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg text-[color:var(--color-navy)]">
              Last 14 days
            </h2>
            <p className="text-xs text-[color:var(--color-ink-mute)]">
              Profile views and contact clicks per day.
            </p>
          </div>
          <div className="flex gap-3 text-[11px] text-[color:var(--color-ink-mute)]">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm bg-[color:var(--color-sky-deep)]" />
              Views
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm bg-[color:var(--color-coral)]" />
              Contacts
            </span>
          </div>
        </div>
        <div className="flex items-end gap-2 overflow-x-auto" style={{ height: 160 }}>
          {days.map((d, i) => (
            <div key={i} className="flex flex-1 min-w-[24px] flex-col items-center gap-1">
              <div className="flex w-full items-end justify-center gap-0.5" style={{ height: 120 }}>
                <div
                  className="chart-bar w-1/2 rounded-t-sm bg-[color:var(--color-sky-deep)]"
                  style={{ height: `${(d.views / maxDaily) * 100}%`, animationDelay: `${i * 30}ms` }}
                  title={`${d.views} views`}
                />
                <div
                  className="chart-bar w-1/2 rounded-t-sm bg-[color:var(--color-coral)]"
                  style={{ height: `${(d.contacts / maxDaily) * 100}%`, animationDelay: `${i * 30}ms` }}
                  title={`${d.contacts} contacts`}
                />
              </div>
              <div className="whitespace-nowrap text-[9px] text-[color:var(--color-ink-mute)]">
                {d.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity + quick actions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="admin-card rounded-2xl border border-[color:var(--color-line)] bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg text-[color:var(--color-navy)]">
              Recent enquiries
            </h2>
            <Link href={`/school/${slug}/enquiries`} className="text-xs text-[color:var(--color-ink-mute)] hover:text-[color:var(--color-navy)]">
              View all →
            </Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <p className="text-sm text-[color:var(--color-ink-mute)]">
              No enquiries yet. Parent messages from your profile will land here.
            </p>
          ) : (
            <ul className="divide-y divide-[color:var(--color-line-2)]">
              {recentEnquiries.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-[color:var(--color-navy)]">
                      {e.parentName}
                    </p>
                    <p className="truncate text-xs text-[color:var(--color-ink-mute)]">
                      {e.createdAt && formatTime(e.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${
                      e.readAt
                        ? "bg-[color:var(--color-cream)] text-[color:var(--color-ink-mute)]"
                        : "bg-[color:var(--color-blossom-soft)] text-[color:var(--color-pink-hot-deep)]"
                    }`}
                  >
                    {e.readAt ? "Read" : "New"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-card rounded-2xl border border-[color:var(--color-line)] bg-white p-5">
          <h2 className="mb-3 font-display text-lg text-[color:var(--color-navy)]">
            Quick actions
          </h2>
          <div className="grid gap-2">
            <Quick href={`/school/${slug}/edit`} title="Edit profile" body="Info, logo, photos — all in one place." />
            <Quick href={`/school/${slug}/enquiries`} title={`Enquiries${unread > 0 ? ` (${unread} new)` : ""}`} body="Reply to parent leads." />
            <Quick href={`/school/${slug}/analytics`} title="Analytics" body="How parents find and engage with your profile." />
            <Quick href={`/schools/${slug}`} title="View live profile ↗" body="See what parents see. Opens in a new tab." external />
          </div>
        </section>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  tint,
  delta,
  deltaMood,
}: {
  label: string;
  value: string | number;
  tint: "sky" | "leaf" | "coral" | "pink" | "sun" | "slate";
  delta?: string;
  deltaMood?: "good" | "warn";
}) {
  const bg: Record<string, string> = {
    sky: "linear-gradient(160deg,#E4F1FF,#ffffff 65%)",
    leaf: "linear-gradient(160deg,#EAF6E5,#ffffff 65%)",
    coral: "linear-gradient(160deg,#FFE1D5,#ffffff 65%)",
    pink: "linear-gradient(160deg,#FFE4EF,#ffffff 65%)",
    sun: "linear-gradient(160deg,#FFF3D1,#ffffff 65%)",
    slate: "linear-gradient(160deg,#F5F2EC,#ffffff 65%)",
  };
  return (
    <div
      className="admin-card rounded-2xl border border-[color:var(--color-line-2)] p-4"
      style={{ background: bg[tint] }}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
        {label}
      </p>
      <p className="mt-1 font-display text-[26px] leading-tight text-[color:var(--color-navy)]">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {delta && (
        <p
          className={`mt-0.5 text-[11px] ${
            deltaMood === "warn"
              ? "text-[color:var(--color-coral)]"
              : deltaMood === "good"
                ? "text-[#2F7C25]"
                : "text-[color:var(--color-ink-mute)]"
          }`}
        >
          {delta}
        </p>
      )}
    </div>
  );
}

function MiniKpi({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="admin-card rounded-xl border border-[color:var(--color-line-2)] bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
        {label}
      </p>
      <p className="mt-0.5 font-display text-[18px] text-[color:var(--color-navy)]">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

function Quick({
  href,
  title,
  body,
  external,
}: {
  href: string;
  title: string;
  body: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      className="rounded-xl border border-[color:var(--color-line-2)] p-3 hover:border-[color:var(--color-navy)]/20"
    >
      <p className="text-sm font-semibold text-[color:var(--color-navy)]">{title}</p>
      <p className="text-xs text-[color:var(--color-ink-mute)]">{body}</p>
    </Link>
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
