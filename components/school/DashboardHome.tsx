"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  collection,
  onSnapshot,
  query,
  where,
  type QuerySnapshot,
  type DocumentData,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

interface Row {
  id: string;
  slug: string;
  status: "pending" | "approved" | "rejected";
  submittedRole?: string;
  reviewNotes?: string;
  createdAt?: string;
}

export function DashboardHome() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [claims, setClaims] = useState<Row[] | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/school/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(firestore(), "claims"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snap: QuerySnapshot<DocumentData>) => {
      const rows: Row[] = [];
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

  if (loading || !user) {
    return <p className="text-sm text-[color:var(--color-ink-mute)]">Loading…</p>;
  }

  return (
    <div className="pb-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="chip chip-sky">School dashboard</span>
          <h1 className="mt-2 font-display text-[28px] leading-tight md:text-[36px]">
            Welcome{user.displayName ? `, ${user.displayName}` : ""}.
          </h1>
          <p className="text-sm text-[color:var(--color-ink-mute)]">
            {user.email}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {user.email === "stackflown@gmail.com" && (
            <Link href="/admin/claims" className="btn btn-pink text-sm">
              Admin console →
            </Link>
          )}
          <button onClick={() => signOut().then(() => router.push("/"))} className="btn btn-ghost text-sm">
            Sign out
          </button>
        </div>
      </div>

      {user.email === "stackflown@gmail.com" && (
        <div className="mb-6 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-blossom-soft)] p-4">
          <p className="text-sm text-[color:var(--color-navy)]">
            <strong>You're signed in as an admin.</strong>{" "}
            Go to the <Link href="/admin/claims" className="underline">admin console</Link> to approve pending school claims.
          </p>
        </div>
      )}

      <section className="mb-10">
        <h2 className="mb-3 font-display text-xl">Your schools</h2>
        {claims === null ? (
          <p className="text-sm text-[color:var(--color-ink-mute)]">Loading claims…</p>
        ) : claims.length === 0 ? (
          <div className="card-soft rounded-2xl p-6 text-center">
            <p className="font-semibold text-[color:var(--color-navy)]">
              You haven't claimed a school yet.
            </p>
            <p className="mt-1 text-sm text-[color:var(--color-ink-mute)]">
              Find your school on EarlyDays and hit "Claim your profile" on the listing.
            </p>
            <Link href="/schools" className="mt-4 inline-flex btn btn-pink">
              Browse schools
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {claims.map((c) => (
              <ClaimRow key={c.id} row={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ClaimRow({ row }: { row: Row }) {
  const badge =
    row.status === "approved"
      ? { label: "Approved", cls: "chip chip-leaf" }
      : row.status === "pending"
        ? { label: "Under review", cls: "chip chip-sun" }
        : { label: "Rejected", cls: "chip chip-coral" };
  return (
    <div className="card-soft flex items-center justify-between gap-3 rounded-2xl p-4">
      <div className="min-w-0">
        <p className="font-display text-base text-[color:var(--color-navy)]">
          {row.slug}
        </p>
        <p className="text-xs text-[color:var(--color-ink-mute)]">
          {row.submittedRole ? `Submitted as ${row.submittedRole} · ` : ""}
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-GB") : ""}
        </p>
        {row.status === "rejected" && row.reviewNotes && (
          <p className="mt-1 text-xs text-[color:var(--color-coral)]">
            Reason: {row.reviewNotes}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className={badge.cls}>{badge.label}</span>
        {row.status === "approved" && (
          <Link href={`/school/${row.slug}/edit`} className="btn btn-pink text-sm">
            Edit
          </Link>
        )}
      </div>
    </div>
  );
}
