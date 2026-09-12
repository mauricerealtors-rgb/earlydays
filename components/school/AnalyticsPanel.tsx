"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

interface Stats {
  views: number;
  calls: number;
  whatsapps: number;
  websiteClicks: number;
  emails: number;
  enquiries: number;
  updatedAt?: string;
  daily?: Record<string, { views?: number; contacts?: number }>;
}

const empty: Stats = {
  views: 0,
  calls: 0,
  whatsapps: 0,
  websiteClicks: 0,
  emails: 0,
  enquiries: 0,
};

export function AnalyticsPanel({ slug }: { slug: string }) {
  const [stats, setStats] = useState<Stats>(empty);

  useEffect(() => {
    const unsub = onSnapshot(doc(firestore(), "stats", slug), (snap) => {
      const data = snap.data();
      if (!data) return;
      setStats({
        views: data.views ?? 0,
        calls: data.calls ?? 0,
        whatsapps: data.whatsapps ?? 0,
        websiteClicks: data.websiteClicks ?? 0,
        emails: data.emails ?? 0,
        enquiries: data.enquiries ?? 0,
        updatedAt: data.updatedAt,
        daily: data.daily ?? {},
      });
    });
    return () => unsub();
  }, [slug]);

  const totalContacts =
    stats.calls + stats.whatsapps + stats.websiteClicks + stats.emails;
  const conversion = stats.views ? (totalContacts / stats.views) * 100 : 0;

  // Last 14 days chart data
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
      <div>
        <h2 className="font-display text-xl text-[color:var(--color-navy)]">
          Analytics
        </h2>
        <p className="text-sm text-[color:var(--color-ink-mute)]">
          How parents are finding and interacting with your profile.
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPI label="Profile views" value={stats.views} accent="sky" />
        <KPI label="Contact clicks" value={totalContacts} accent="leaf" />
        <KPI label="Enquiries" value={stats.enquiries} accent="coral" />
        <KPI
          label="Conversion"
          value={`${conversion.toFixed(1)}%`}
          accent="sun"
          hint="Contacts ÷ views"
        />
      </div>

      {/* Contact breakdown */}
      <section>
        <h3 className="mb-2 font-display text-base text-[color:var(--color-navy)]">
          Contact channel breakdown
        </h3>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <MiniStat label="Calls" value={stats.calls} />
          <MiniStat label="WhatsApp" value={stats.whatsapps} />
          <MiniStat label="Website" value={stats.websiteClicks} />
          <MiniStat label="Email" value={stats.emails} />
        </div>
      </section>

      {/* 14-day chart */}
      <section>
        <h3 className="mb-2 font-display text-base text-[color:var(--color-navy)]">
          Last 14 days
        </h3>
        <div className="card-soft overflow-x-auto rounded-2xl p-4">
          <div className="flex items-end gap-2" style={{ height: 160 }}>
            {days.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full items-end justify-center gap-0.5" style={{ height: 120 }}>
                  <div
                    className="w-1/2 rounded-t-sm bg-[color:var(--color-sky-deep)]"
                    style={{ height: `${(d.views / maxDaily) * 100}%` }}
                    title={`${d.views} views`}
                  />
                  <div
                    className="w-1/2 rounded-t-sm bg-[color:var(--color-coral)]"
                    style={{ height: `${(d.contacts / maxDaily) * 100}%` }}
                    title={`${d.contacts} contacts`}
                  />
                </div>
                <div className="whitespace-nowrap text-[9px] text-[color:var(--color-ink-mute)]">
                  {d.label}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-center gap-4 text-xs text-[color:var(--color-ink-mute)]">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm bg-[color:var(--color-sky-deep)]" />
              Views
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2 w-3 rounded-sm bg-[color:var(--color-coral)]" />
              Contact clicks
            </span>
          </div>
        </div>
      </section>

      {stats.updatedAt && (
        <p className="text-xs text-[color:var(--color-ink-mute)]">
          Last event tracked: {new Date(stats.updatedAt).toLocaleString("en-GB")}
        </p>
      )}
    </div>
  );
}

function KPI({
  label,
  value,
  accent,
  hint,
}: {
  label: string;
  value: number | string;
  accent: "sky" | "leaf" | "coral" | "sun";
  hint?: string;
}) {
  const bg: Record<string, string> = {
    sky: "linear-gradient(160deg,#E4F1FF,#ffffff 65%)",
    leaf: "linear-gradient(160deg,#EAF6E5,#ffffff 65%)",
    coral: "linear-gradient(160deg,#FFE1D5,#ffffff 65%)",
    sun: "linear-gradient(160deg,#FFF3D1,#ffffff 65%)",
  };
  return (
    <div
      className="rounded-2xl border border-[color:var(--color-line-2)] p-4"
      style={{ background: bg[accent] }}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
        {label}
      </p>
      <p className="mt-1 font-display text-[26px] text-[color:var(--color-navy)]">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {hint && (
        <p className="text-[10px] text-[color:var(--color-ink-mute)]">{hint}</p>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[color:var(--color-line-2)] bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
        {label}
      </p>
      <p className="mt-1 font-display text-[18px] text-[color:var(--color-navy)]">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
