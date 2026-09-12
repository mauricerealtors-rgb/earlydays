"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { findListing } from "@/lib/query";

const ADMIN_EMAILS = new Set([
  "support@sellquic.com",
  "mauricerealtors@gmail.com",
]);

interface Claim {
  id: string;
  slug: string;
  uid: string;
  submittedName?: string;
  submittedRole?: string;
  submittedEmail?: string;
  submittedPhone?: string;
  proofUrl?: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
  reviewNotes?: string;
}

export function AdminClaimsPanel() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [claims, setClaims] = useState<Claim[] | null>(null);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = !!user?.email && ADMIN_EMAILS.has(user.email);

  useEffect(() => {
    if (!loading && !user) router.replace("/school/login?next=/admin/claims");
  }, [loading, user, router]);

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(firestore(), "claims"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const rows: Claim[] = [];
      snap.forEach((d) => rows.push({ id: d.id, ...(d.data() as Omit<Claim, "id">) }));
      setClaims(rows);
    });
    return () => unsub();
  }, [isAdmin]);

  async function act(claim: Claim, action: "approve" | "reject", notes?: string) {
    if (!user) return;
    setBusy(claim.id);
    setError(null);
    try {
      const res = await fetch("/api/admin/claims/decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          claimId: claim.id,
          slug: claim.slug,
          uid: claim.uid,
          action,
          notes: notes ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Action failed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusy(null);
    }
  }

  if (loading || !user) {
    return <p className="text-sm text-[color:var(--color-ink-mute)]">Loading…</p>;
  }
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md text-center">
        <span className="chip chip-coral">Access denied</span>
        <p className="mt-3 font-display text-xl text-[color:var(--color-navy)]">
          This page is for EarlyDays admins only.
        </p>
        <p className="mt-2 text-sm text-[color:var(--color-ink-mute)]">
          You're signed in as {user.email}.
        </p>
        <button onClick={() => signOut().then(() => router.push("/"))} className="btn btn-ghost mt-4 text-sm">
          Sign out
        </button>
      </div>
    );
  }

  const filtered =
    claims?.filter((c) => filter === "all" || c.status === filter) ?? [];

  return (
    <div className="pb-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="chip chip-blossom">Admin</span>
          <h1 className="mt-2 font-display text-[28px] leading-tight md:text-[36px]">
            School claims
          </h1>
          <p className="text-sm text-[color:var(--color-ink-mute)]">
            Approve or reject each claim. Approving unlocks editing for the
            claiming user.
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          {(["pending", "approved", "rejected", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 capitalize ${
                filter === f
                  ? "bg-[color:var(--color-navy)] text-white"
                  : "border border-[color:var(--color-line)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mb-3 rounded-lg bg-[color:var(--color-coral-soft)] p-3 text-sm text-[color:var(--color-coral)]">
          {error}
        </p>
      )}

      {claims === null ? (
        <p className="text-sm text-[color:var(--color-ink-mute)]">Loading claims…</p>
      ) : filtered.length === 0 ? (
        <div className="card-soft rounded-2xl p-6 text-center text-sm text-[color:var(--color-ink-mute)]">
          No {filter === "all" ? "" : filter} claims to show.
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((c) => {
            const listing = findListing(c.slug);
            const badge =
              c.status === "approved"
                ? "chip chip-leaf"
                : c.status === "pending"
                  ? "chip chip-sun"
                  : "chip chip-coral";
            return (
              <li key={c.id} className="card-soft rounded-2xl p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <p className="font-display text-base text-[color:var(--color-navy)]">
                      {listing?.name ?? c.slug}
                    </p>
                    <p className="text-xs text-[color:var(--color-ink-mute)]">
                      {c.submittedName} · {c.submittedRole} ·{" "}
                      {c.createdAt ? new Date(c.createdAt).toLocaleString("en-GB") : ""}
                    </p>
                    <p className="text-xs text-[color:var(--color-ink-mute)]">
                      {c.submittedEmail}
                      {c.submittedPhone ? ` · ${c.submittedPhone}` : ""}
                    </p>
                    {c.proofUrl && (
                      <a
                        href={c.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[color:var(--color-navy)] underline"
                      >
                        Proof link →
                      </a>
                    )}
                    {c.reviewNotes && (
                      <p className="mt-1 text-xs text-[color:var(--color-coral)]">
                        Notes: {c.reviewNotes}
                      </p>
                    )}
                  </div>
                  <span className={badge}>{c.status}</span>
                </div>

                {c.status === "pending" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => act(c, "approve")}
                      disabled={busy === c.id}
                      className="btn btn-pink text-sm"
                    >
                      {busy === c.id ? "Working…" : "Approve"}
                    </button>
                    <button
                      onClick={() => {
                        const notes = window.prompt(
                          "Reason for rejection (shown to the claimant)"
                        );
                        if (notes) act(c, "reject", notes);
                      }}
                      disabled={busy === c.id}
                      className="btn btn-ghost text-sm"
                    >
                      Reject
                    </button>
                    <Link
                      href={`/schools/${c.slug}`}
                      target="_blank"
                      className="btn btn-ghost text-sm"
                    >
                      View listing
                    </Link>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
