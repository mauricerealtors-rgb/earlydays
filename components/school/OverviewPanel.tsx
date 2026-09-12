"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
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
  const [unreadEnquiries, setUnreadEnquiries] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(doc(firestore(), "stats", slug), (snap) => {
      const data = snap.data() ?? {};
      setStats({
        views: data.views ?? 0,
        calls: data.calls ?? 0,
        whatsapps: data.whatsapps ?? 0,
        websiteClicks: data.websiteClicks ?? 0,
        emails: data.emails ?? 0,
        enquiries: data.enquiries ?? 0,
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
        where("readAt", "==", null)
      ),
      (snap) => setUnreadEnquiries(snap.size)
    );
    return () => {
      unsub();
      unsubSub();
      unsubEnq();
    };
  }, [slug]);

  return (
    <div className="space-y-6">
      {/* Snapshot cards */}
      <section>
        <h2 className="mb-3 font-display text-lg text-[color:var(--color-navy)]">
          At a glance
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card label="Profile views" value={stats.views} accent="sky" />
          <Card label="Contact clicks" value={stats.calls + stats.whatsapps + stats.websiteClicks + stats.emails} accent="leaf" />
          <Card label="Parent enquiries" value={stats.enquiries} accent="coral" />
          <Card label="Unread enquiries" value={unreadEnquiries} accent="sun" />
        </div>
      </section>

      {/* Plan card */}
      <section>
        <div className="card-soft flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
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
          {tier === "free" ? (
            <Link href={`/school/${slug}/billing`} className="btn btn-pink text-sm">
              Upgrade to Verified
            </Link>
          ) : (
            <Link href={`/school/${slug}/billing`} className="btn btn-ghost text-sm">
              Manage plan
            </Link>
          )}
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="mb-3 font-display text-lg text-[color:var(--color-navy)]">
          Quick actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Action href={`/school/${slug}/edit`} title="Edit profile" body="Description, hours, phone, WhatsApp, admissions status." />
          <Action href={`/school/${slug}/photos`} title="Manage photos" body="Upload, reorder or remove images shown on your profile." />
          <Action href={`/school/${slug}/enquiries`} title={`Enquiries${unreadEnquiries ? ` (${unreadEnquiries} new)` : ""}`} body="Parent leads that came in through your profile." />
          <Action href={`/school/${slug}/analytics`} title="Analytics" body="How parents are finding and interacting with your profile." />
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg text-[color:var(--color-navy)]">
          Your public profile
        </h2>
        <Link
          href={`/schools/${slug}`}
          className="card-soft flex items-center justify-between rounded-2xl p-4 hover:border-[color:var(--color-navy)]/20"
        >
          <div>
            <p className="font-display text-base text-[color:var(--color-navy)]">
              {listingName}
            </p>
            <p className="text-xs text-[color:var(--color-ink-mute)]">
              earlydays.cc/schools/{slug}
            </p>
          </div>
          <span aria-hidden className="text-[color:var(--color-coral)]">→</span>
        </Link>
      </section>
    </div>
  );
}

function Card({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "sky" | "leaf" | "coral" | "sun";
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
      <p className="mt-1 font-display text-[24px] text-[color:var(--color-navy)]">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function Action({
  href,
  title,
  body,
}: {
  href: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="card-soft rounded-2xl p-4 hover:border-[color:var(--color-navy)]/20"
    >
      <p className="font-display text-base text-[color:var(--color-navy)]">{title}</p>
      <p className="mt-1 text-[13px] text-[color:var(--color-ink-mute)]">{body}</p>
    </Link>
  );
}
