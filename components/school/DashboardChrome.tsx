"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { findListing } from "@/lib/query";

interface Approved {
  slug: string;
  name: string;
}

export function DashboardChrome({
  slug,
  children,
}: {
  slug?: string;
  children: ReactNode;
}) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [approvedListings, setApprovedListings] = useState<Approved[] | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/school/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(firestore(), "claims"),
      where("uid", "==", user.uid),
      where("status", "==", "approved")
    );
    const unsub = onSnapshot(q, (snap) => {
      const rows: Approved[] = [];
      snap.forEach((d) => {
        const s = d.data().slug as string;
        const listing = findListing(s);
        if (listing) rows.push({ slug: s, name: listing.name });
      });
      setApprovedListings(rows);
    });
    return () => unsub();
  }, [user]);

  useEffect(() => setMobileOpen(false), [pathname]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[color:var(--color-cream)] p-10 text-[color:var(--color-ink-mute)]">
        Loading…
      </div>
    );
  }

  const currentSlug = slug ?? approvedListings?.[0]?.slug ?? undefined;
  const currentListing = currentSlug
    ? approvedListings?.find((l) => l.slug === currentSlug)
    : undefined;

  const nav = currentSlug
    ? [
        { href: `/school/${currentSlug}`, label: "Overview", icon: OverviewIcon },
        { href: `/school/${currentSlug}/edit`, label: "Profile", icon: ProfileIcon },
        { href: `/school/${currentSlug}/enquiries`, label: "Enquiries", icon: MessagesIcon },
        { href: `/school/${currentSlug}/analytics`, label: "Analytics", icon: ChartIcon },
        { href: `/school/${currentSlug}/billing`, label: "Billing", icon: BillingIcon },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[color:var(--color-cream)]">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[color:var(--color-line)] bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/school" className="flex items-center gap-2">
          <BrandDot />
          <span className="font-display text-lg text-[color:var(--color-navy)]">EarlyDays</span>
          <span className="rounded-md bg-[color:var(--color-pink-hot)]/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-pink-hot)]">
            School
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="rounded-lg border border-[color:var(--color-line)] p-2 text-[color:var(--color-navy)]"
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      <div className="md:flex">
        {/* Sidebar */}
        <aside
          className={`${
            mobileOpen ? "block" : "hidden"
          } border-b border-[color:var(--color-line)] bg-white md:block md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r md:sticky md:top-0`}
        >
          <div className="hidden items-center gap-2 px-6 py-6 md:flex">
            <BrandDot />
            <span className="font-display text-lg text-[color:var(--color-navy)]">EarlyDays</span>
            <span className="rounded-md bg-[color:var(--color-pink-hot)]/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-pink-hot)]">
              School
            </span>
          </div>

          {/* School switcher */}
          {approvedListings && approvedListings.length > 0 && (
            <div className="px-4 pb-3">
              {approvedListings.length > 1 ? (
                <select
                  value={currentSlug ?? ""}
                  onChange={(e) => router.push(`/school/${e.target.value}`)}
                  className="w-full rounded-lg border border-[color:var(--color-line)] bg-white px-3 py-2 text-sm font-semibold text-[color:var(--color-navy)] outline-none"
                >
                  {approvedListings.map((l) => (
                    <option key={l.slug} value={l.slug}>
                      {l.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="rounded-lg bg-[color:var(--color-cream)] px-3 py-2 text-sm font-semibold text-[color:var(--color-navy)]">
                  {currentListing?.name}
                </div>
              )}
            </div>
          )}

          <nav className="px-3 pb-4">
            {nav.length > 0 ? (
              <ul className="space-y-0.5">
                {nav.map((n) => {
                  const active = pathname === n.href;
                  const Icon = n.icon;
                  return (
                    <li key={n.href}>
                      <Link
                        href={n.href}
                        className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                          active
                            ? "bg-[color:var(--color-pink-hot)] text-white shadow-sm"
                            : "text-[color:var(--color-navy)] hover:bg-[color:var(--color-cream)]"
                        }`}
                      >
                        <Icon active={active} />
                        <span>{n.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="mt-2 rounded-xl border border-dashed border-[color:var(--color-line)] p-4 text-xs text-[color:var(--color-ink-mute)]">
                You don't have any approved schools yet. When your claim is
                approved you'll see edit tools here.
              </div>
            )}

            <div className="mt-6 border-t border-[color:var(--color-line)] pt-4">
              <div className="rounded-lg bg-[color:var(--color-cream)] p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
                  Signed in
                </p>
                <p className="mt-1 truncate text-sm text-[color:var(--color-navy)]">{user.email}</p>
                <button
                  onClick={() => signOut().then(() => router.push("/"))}
                  className="mt-2 text-xs text-[color:var(--color-ink-mute)] hover:text-[color:var(--color-navy)]"
                >
                  Sign out
                </button>
              </div>
              {currentSlug && (
                <Link
                  href={`/schools/${currentSlug}`}
                  target="_blank"
                  className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[color:var(--color-ink-mute)] hover:text-[color:var(--color-navy)]"
                >
                  <span>View live profile</span>
                  <span aria-hidden>↗</span>
                </Link>
              )}
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <div className="admin-fade-in mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function BrandDot() {
  return (
    <span
      aria-hidden
      className="inline-flex h-7 w-7 items-center justify-center rounded-lg"
      style={{ background: "linear-gradient(135deg, #FFC845 0%, #FF7A59 55%, #FF9FC0 100%)" }}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
        <path
          d="M4 12c2 0 3-1.6 3-3.5S6 5 4 5v7Zm16 0c-2 0-3-1.6-3-3.5S18 5 20 5v7ZM6 15c0 2.8 2.7 5 6 5s6-2.2 6-5H6Z"
          fill="#0F2A4A"
        />
      </svg>
    </span>
  );
}

function iconClass(active: boolean) {
  return active
    ? "text-white"
    : "text-[color:var(--color-ink-mute)] group-hover:text-[color:var(--color-navy)]";
}

function OverviewIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={iconClass(active)}>
      <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={iconClass(active)}>
      <path
        d="m3 10 9-5 9 5-9 5-9-5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function MessagesIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={iconClass(active)}>
      <path
        d="M5 5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ChartIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={iconClass(active)}>
      <path
        d="M4 20V10M10 20V4M16 20v-6M22 20H2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function BillingIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={iconClass(active)}>
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18M7 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
