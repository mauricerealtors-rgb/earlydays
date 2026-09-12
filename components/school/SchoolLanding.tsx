"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { findListing } from "@/lib/query";

interface ClaimRow {
  id: string;
  slug: string;
  status: "pending" | "approved" | "rejected";
  submittedRole?: string;
  reviewNotes?: string;
  createdAt?: string;
}

const ADMIN_EMAIL = "stackflown@gmail.com";

export function SchoolLanding() {
  const { user } = useAuth();
  const router = useRouter();
  const [claims, setClaims] = useState<ClaimRow[] | null>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(firestore(), "claims"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const rows: ClaimRow[] = [];
      snap.forEach((d) => {
        const data = d.data();
        rows.push({
          id: d.id,
          slug: data.slug,
          status: data.status,
          submittedRole: data.submittedRole,
          reviewNotes: data.reviewNotes,
          createdAt: data.createdAt,
        });
      });
      setClaims(rows);
    });
    return () => unsub();
  }, [user]);

  // Auto-redirect to first approved school
  useEffect(() => {
    if (!claims) return;
    const approved = claims.find((c) => c.status === "approved");
    if (approved) router.replace(`/school/${approved.slug}`);
  }, [claims, router]);

  if (!user) return null;

  const isAdmin = user.email === ADMIN_EMAIL;

  return (
    <>
      <header className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
          School dashboard
        </p>
        <h1 className="mt-1 font-display text-3xl text-[color:var(--color-navy)] md:text-4xl">
          Welcome{user.displayName ? `, ${user.displayName}` : ""}.
        </h1>
        <p className="mt-1 text-sm text-[color:var(--color-ink-mute)]">
          {user.email}
        </p>
      </header>

      {isAdmin && (
        <div className="mb-6 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-blossom-soft)] p-4">
          <p className="text-sm text-[color:var(--color-navy)]">
            <strong>You're signed in as admin.</strong>{" "}
            <Link href="/admin" className="underline">
              Go to the admin console →
            </Link>
          </p>
        </div>
      )}

      <section>
        <h2 className="mb-3 font-display text-xl text-[color:var(--color-navy)]">
          Your schools
        </h2>
        {claims === null ? (
          <p className="text-sm text-[color:var(--color-ink-mute)]">Loading…</p>
        ) : claims.length === 0 ? (
          <div className="rounded-2xl border border-[color:var(--color-line)] bg-white p-8 text-center">
            <p className="font-display text-lg text-[color:var(--color-navy)]">
              You haven't claimed a school yet.
            </p>
            <p className="mt-1 text-sm text-[color:var(--color-ink-mute)]">
              Find your school on EarlyDays and hit "Claim your profile" on the listing.
            </p>
            <Link href="/schools" className="btn btn-pink mt-4 inline-flex">
              Browse schools
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {claims.map((c) => {
              const listing = findListing(c.slug);
              const badge =
                c.status === "approved"
                  ? "bg-[color:var(--color-leaf-soft)] text-[#2F7C25]"
                  : c.status === "pending"
                    ? "bg-[color:var(--color-sun-soft)] text-[#7A5A00]"
                    : "bg-[color:var(--color-coral-soft)] text-[color:var(--color-coral)]";
              return (
                <li
                  key={c.id}
                  className="rounded-2xl border border-[color:var(--color-line)] bg-white p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-display text-base text-[color:var(--color-navy)]">
                        {listing?.name ?? c.slug}
                      </p>
                      <p className="text-xs text-[color:var(--color-ink-mute)]">
                        {c.submittedRole ? `Submitted as ${c.submittedRole}` : ""}
                        {c.createdAt &&
                          ` · ${new Date(c.createdAt).toLocaleDateString("en-GB")}`}
                      </p>
                      {c.status === "rejected" && c.reviewNotes && (
                        <p className="mt-1 text-xs text-[color:var(--color-coral)]">
                          Reason: {c.reviewNotes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${badge}`}
                      >
                        {c.status}
                      </span>
                      {c.status === "approved" && (
                        <Link
                          href={`/school/${c.slug}`}
                          className="btn btn-pink text-sm"
                        >
                          Open
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
