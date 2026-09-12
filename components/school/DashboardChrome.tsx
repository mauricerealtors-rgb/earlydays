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

  if (loading || !user) {
    return <p className="text-sm text-[color:var(--color-ink-mute)]">Loading…</p>;
  }

  const currentSlug =
    slug ?? approvedListings?.[0]?.slug ?? undefined;
  const currentListing = currentSlug
    ? approvedListings?.find((l) => l.slug === currentSlug)
    : undefined;

  const nav = currentSlug
    ? [
        { href: `/school/${currentSlug}`, label: "Overview" },
        { href: `/school/${currentSlug}/edit`, label: "Profile" },
        { href: `/school/${currentSlug}/photos`, label: "Photos" },
        { href: `/school/${currentSlug}/enquiries`, label: "Enquiries" },
        { href: `/school/${currentSlug}/analytics`, label: "Analytics" },
        { href: `/school/${currentSlug}/billing`, label: "Billing" },
      ]
    : [{ href: "/school", label: "Dashboard" }];

  return (
    <div className="pb-16">
      {/* Top bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--color-line)] pb-4">
        <div className="min-w-0">
          <span className="chip chip-sky">School dashboard</span>
          <div className="mt-2 flex flex-wrap items-baseline gap-3">
            {approvedListings && approvedListings.length > 1 ? (
              <select
                value={currentSlug ?? ""}
                onChange={(e) =>
                  router.push(`/school/${e.target.value}`)
                }
                className="font-display text-[22px] leading-tight text-[color:var(--color-navy)] outline-none md:text-[28px]"
              >
                {approvedListings.map((l) => (
                  <option key={l.slug} value={l.slug}>
                    {l.name}
                  </option>
                ))}
              </select>
            ) : (
              <h1 className="font-display text-[22px] leading-tight text-[color:var(--color-navy)] md:text-[28px]">
                {currentListing?.name ?? "Your dashboard"}
              </h1>
            )}
          </div>
          <p className="text-xs text-[color:var(--color-ink-mute)]">
            {user.email}
          </p>
        </div>
        <button onClick={() => signOut().then(() => router.push("/"))} className="btn btn-ghost text-sm">
          Sign out
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        {/* Side nav */}
        <nav className="md:sticky md:top-24 md:self-start">
          <ul className="flex flex-row gap-1 overflow-x-auto md:flex-col">
            {nav.map((n) => {
              const active = pathname === n.href;
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className={`block whitespace-nowrap rounded-xl px-3 py-2 text-sm ${
                      active
                        ? "bg-[color:var(--color-navy)] text-white"
                        : "text-[color:var(--color-navy)] hover:bg-[color:var(--color-cream)]"
                    }`}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {approvedListings && approvedListings.length === 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-[color:var(--color-line)] p-3 text-xs text-[color:var(--color-ink-mute)]">
              You don't have any approved schools yet. When your claim is
              approved you'll see edit tools here.
            </div>
          )}
        </nav>

        {/* Body */}
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
