"use client";

import { useEffect, useMemo, useState } from "react";
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

type Status = "pending" | "verified" | "approved" | "rejected";
type Action = "verify" | "approve" | "reject";

interface Claim {
  id: string;
  slug: string;
  uid?: string | null;
  submittedName?: string;
  submittedRole?: string;
  submittedEmail?: string;
  submittedPhone?: string;
  schoolPhone?: string;
  schoolEmail?: string;
  assignedEmail?: string;
  status: Status;
  createdAt?: string;
  verifiedAt?: string;
  reviewNotes?: string;
}

const STATUS_CLASS: Record<Status, string> = {
  pending: "bg-amber-500/15 text-amber-400",
  verified: "bg-sky-500/15 text-sky-400",
  approved: "bg-emerald-500/15 text-emerald-400",
  rejected: "bg-red-500/15 text-red-400",
};

export function AdminClaimsDark() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<Claim[] | null>(null);
  const [filter, setFilter] = useState<Status | "all">("pending");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const qy = query(collection(firestore(), "claims"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(qy, (snap) => {
      const rows: Claim[] = [];
      snap.forEach((d) => rows.push({ id: d.id, ...(d.data() as Omit<Claim, "id">) }));
      setClaims(rows);
    });
    return () => unsub();
  }, [user]);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return (claims ?? []).filter((c) => {
      if (filter !== "all" && c.status !== filter) return false;
      if (
        term &&
        !(
          (c.slug ?? "").toLowerCase().includes(term) ||
          (c.submittedName ?? "").toLowerCase().includes(term) ||
          (c.submittedEmail ?? "").toLowerCase().includes(term)
        )
      )
        return false;
      return true;
    });
  }, [claims, filter, q]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      pending: 0,
      verified: 0,
      approved: 0,
      rejected: 0,
      all: claims?.length ?? 0,
    };
    (claims ?? []).forEach((cl) => {
      c[cl.status] = (c[cl.status] ?? 0) + 1;
    });
    return c;
  }, [claims]);

  async function act(
    claim: Claim,
    action: Action,
    extra?: { notes?: string; assignEmail?: string }
  ) {
    if (!user) return;
    setBusy(claim.id);
    setError(null);
    setNote(null);
    try {
      const res = await fetch("/api/admin/claims/decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          claimId: claim.id,
          action,
          notes: extra?.notes ?? "",
          assignEmail: extra?.assignEmail,
        }),
      });
      // An empty body means the route failed to start; res.json() would throw
      // "Unexpected end of JSON input" and bury the status.
      const raw = await res.text();
      let data: { error?: string; code?: string } = {};
      if (raw) {
        try {
          data = JSON.parse(raw);
        } catch {
          throw new Error(`HTTP ${res.status}: ${raw.slice(0, 200)}`);
        }
      } else if (!res.ok) {
        throw new Error(
          `HTTP ${res.status} with an empty response — the server route failed to start. Check the Vercel function logs.`
        );
      }
      if (!res.ok) {
        // Registered with Firebase but with no profile record, so the address
        // cannot be matched — offer to assign to a different one instead.
        if (data.code === "ORPHAN_ACCOUNT" || data.code === "NO_ACCOUNT") {
          const retry = window.prompt(
            `${data.error}\n\nOr enter a different email to assign to:`,
            claim.submittedEmail ?? ""
          );
          if (retry && retry.trim()) {
            await act(claim, "approve", { assignEmail: retry.trim() });
            return;
          }
        }
        throw new Error(data.error ?? "Action failed");
      }
      if (action === "approve") {
        const r = data as {
          accountCreated?: boolean;
          emailed?: boolean;
          emailError?: string | null;
        };
        setNote(
          r.emailed
            ? r.accountCreated
              ? "Assigned. Account created and login details emailed."
              : "Assigned. Sign-in details emailed to their existing account."
            : `Assigned${r.accountCreated ? " and account created" : ""}, but the email failed: ${r.emailError ?? "unknown error"}`
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
            Onboarding
          </p>
          <h1 className="mt-1 font-display text-3xl md:text-4xl">Claims</h1>
          <p className="mt-1 text-sm text-white/60">
            Call the school to verify, then assign. Assigning creates their
            account if they don&apos;t have one and emails them the login.
          </p>
        </div>
      </header>

      {/* Toolbar */}
      <div className="admin-card mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search school, name, email…"
          className="flex-1 min-w-[220px] rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30"
        />
        <div className="flex flex-wrap gap-1 text-xs">
          {(["pending", "verified", "approved", "rejected", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-2 capitalize ${
                filter === f
                  ? "bg-white text-black"
                  : "border border-white/10 text-white/70 hover:text-white"
              }`}
            >
              {f} <span className="ml-1 opacity-60">{counts[f] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}
      {note && (
        <p className="mb-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
          {note}
        </p>
      )}

      {claims === null ? (
        <p className="text-sm text-white/40">Loading claims…</p>
      ) : filtered.length === 0 ? (
        <div className="admin-card rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/40">
          No {filter === "all" ? "" : filter} claims to show.
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((c) => {
            const listing = findListing(c.slug);
            return (
              <li
                key={c.id}
                id={c.id}
                className="admin-card rounded-2xl border border-white/10 bg-white/[0.02] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {listing?.name ?? c.slug}
                      <span
                        className={`ml-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${STATUS_CLASS[c.status]}`}
                      >
                        {c.status}
                      </span>
                    </p>
                    <p className="text-xs text-white/50">
                      {c.submittedName} · {c.submittedRole ?? "—"}
                      {c.createdAt && ` · ${new Date(c.createdAt).toLocaleString("en-GB")}`}
                    </p>
                    <p className="text-xs text-white/50">
                      Contact: {c.submittedEmail}
                      {c.submittedPhone ? ` · ${c.submittedPhone}` : ""}
                    </p>
                    {(c.schoolPhone || c.schoolEmail) && (
                      <p className="text-xs text-emerald-400">
                        Call to verify:
                        {c.schoolPhone ? ` ${c.schoolPhone}` : ""}
                        {c.schoolPhone && c.schoolEmail ? " · " : ""}
                        {c.schoolEmail ?? ""}
                      </p>
                    )}
                    {c.status === "verified" && (
                      <p className="mt-1 text-xs text-sky-300">
                        Phone check done. Assign to hand over the profile and
                        email them their login.
                      </p>
                    )}
                    {c.status === "approved" && (
                      <p className="mt-1 text-xs text-emerald-300">
                        Assigned to {c.assignedEmail ?? c.submittedEmail}
                      </p>
                    )}
                    {c.reviewNotes && (
                      <p className="mt-1 text-xs text-red-300">Notes: {c.reviewNotes}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {c.status === "pending" && (
                      <button
                        onClick={() => act(c, "verify")}
                        disabled={busy === c.id}
                        className="rounded-lg bg-sky-500 px-3 py-1.5 font-semibold text-black hover:bg-sky-400 disabled:opacity-50"
                      >
                        {busy === c.id ? "…" : "Mark verified"}
                      </button>
                    )}
                    {(c.status === "pending" || c.status === "verified") && (
                      <>
                        <button
                          onClick={() => act(c, "approve")}
                          disabled={busy === c.id}
                          className="rounded-lg bg-emerald-500 px-3 py-1.5 font-semibold text-black hover:bg-emerald-400 disabled:opacity-50"
                        >
                          {busy === c.id ? "…" : "Assign school"}
                        </button>
                        <button
                          onClick={() => {
                            const notes = window.prompt(
                              "Reason for rejection (shown to claimant)"
                            );
                            if (notes) act(c, "reject", { notes });
                          }}
                          disabled={busy === c.id}
                          className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/5"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <Link
                      href={`/schools/${c.slug}`}
                      target="_blank"
                      className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/5"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
