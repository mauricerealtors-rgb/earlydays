"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { allListings } from "@/lib/query";
import { auditPresence, presenceBand } from "@/lib/presence";
import { OutreachTemplateEditor } from "./OutreachTemplateEditor";

/** Matches BULK_MAX on the route. A batch bigger than this is refused there. */
const BULK_MAX = 25;

interface BulkResult {
  slug: string;
  name: string;
  ok: boolean;
  email?: string;
  reason?: string;
}

type Status = "pending" | "sent" | "skipped" | "failed";

interface OutreachDoc {
  email?: string;
  status?: Status;
  sentAt?: string;
  error?: string;
}

type Filter = "todo" | "weak" | "no-email" | "sent" | "failed" | "all";

const BAND_CLASS: Record<string, string> = {
  weak: "bg-red-500/15 text-red-300",
  partial: "bg-amber-500/15 text-amber-300",
  good: "bg-emerald-500/15 text-emerald-300",
};

const STATUS_CLASS: Record<Status, string> = {
  pending: "bg-white/10 text-white/60",
  sent: "bg-emerald-500/15 text-emerald-400",
  skipped: "bg-white/10 text-white/40",
  failed: "bg-red-500/15 text-red-400",
};

export function AdminOutreachDark() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<Record<string, OutreachDoc>>({});
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<Filter>("todo");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkResults, setBulkResults] = useState<BulkResult[] | null>(null);

  const listings = useMemo(() => allListings(), []);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(firestore(), "outreach"), (snap) => {
      const next: Record<string, OutreachDoc> = {};
      snap.forEach((d) => (next[d.id] = d.data() as OutreachDoc));
      setDocs(next);
      setReady(true);
    });
    return () => unsub();
  }, [user]);

  // The school's own listing email is the default; an address the admin typed
  // in here overrides it.
  const emailFor = (slug: string) =>
    drafts[slug] ?? docs[slug]?.email ?? listings.find((l) => l.slug === slug)?.email ?? "";

  const rows = useMemo(() => {
    const term = q.toLowerCase();
    return listings
      .map((l) => {
        const d = docs[l.slug] ?? {};
        const email = d.email ?? l.email ?? "";
        const status: Status = d.status ?? "pending";
        // The audit is the pitch: a school missing a website and photos has a
        // far stronger reason to care than one already online.
        const audit = auditPresence(l);
        return { listing: l, email, status, sentAt: d.sentAt, error: d.error, audit };
      })
      .filter((r) => {
        if (term && !r.listing.name.toLowerCase().includes(term) && !r.email.toLowerCase().includes(term))
          return false;
        if (filter === "todo") return r.status === "pending" && Boolean(r.email);
        if (filter === "weak")
          return r.status === "pending" && Boolean(r.email) && presenceBand(r.audit.percent) === "weak";
        if (filter === "no-email") return !r.email;
        if (filter === "sent") return r.status === "sent";
        if (filter === "failed") return r.status === "failed";
        return true;
      });
  }, [listings, docs, filter, q]);

  const counts = useMemo(() => {
    let todo = 0, noEmail = 0, sent = 0, failed = 0, weak = 0;
    listings.forEach((l) => {
      const d = docs[l.slug] ?? {};
      const email = d.email ?? l.email ?? "";
      const status = d.status ?? "pending";
      if (!email) noEmail++;
      if (status === "sent") sent++;
      else if (status === "failed") failed++;
      else if (status === "pending" && email) { todo++; if (presenceBand(auditPresence(l).percent) === "weak") weak++; }
    });
    return { todo, weak, "no-email": noEmail, sent, failed, all: listings.length };
  }, [listings, docs]);

  async function call(slug: string, action: string, extra: Record<string, unknown> = {}) {
    if (!user) return null;
    setBusy(slug);
    setError(null);
    setNote(null);
    try {
      const res = await fetch("/api/admin/outreach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({ slug, action, ...extra }),
      });
      // A route that dies during startup returns an empty body, and res.json()
      // then throws "Unexpected end of JSON input" — hiding the status that
      // would have explained it. Read the text and report what actually came
      // back.
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
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      return null;
    } finally {
      setBusy(null);
    }
  }

  async function send(slug: string, name: string, email: string) {
    if (!window.confirm(`Send the outreach email to ${name}?\n\n${email}\n\nThis goes to a real school.`))
      return;
    const ok = await call(slug, "send", { email });
    if (ok) setNote(`Sent to ${name}.`);
  }

  async function sendTest(slug: string, name: string) {
    const to = window.prompt("Send a test copy of this email to:", user?.email ?? "");
    if (!to) return;
    const ok = await call(slug, "send", { testTo: to });
    if (ok) setNote(`Test copy of the ${name} email sent to ${to}.`);
  }

  function toggle(slug: string) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(slug)) n.delete(slug);
      else n.add(slug);
      return n;
    });
  }

  /**
   * Select everything in view that can actually be sent to, capped at the
   * batch limit. Selecting rows with no email, or already sent, would only
   * produce a list of skips in the results.
   */
  function selectAllSendable() {
    const sendable = rows
      .filter((r) => (drafts[r.listing.slug] ?? r.email) && r.status !== "sent")
      .slice(0, BULK_MAX)
      .map((r) => r.listing.slug);
    setSelected(new Set(sendable));
  }

  async function sendSelected() {
    if (!user || selected.size === 0) return;
    const slugs = [...selected];
    const names = rows
      .filter((r) => selected.has(r.listing.slug))
      .map((r) => r.listing.name);

    if (
      !window.confirm(
        `Send the outreach email to ${slugs.length} school${slugs.length === 1 ? "" : "s"}?\n\n` +
          `${names.slice(0, 8).join("\n")}${names.length > 8 ? `\n…and ${names.length - 8} more` : ""}\n\n` +
          "These are real schools. There is no undo.",
      )
    ) {
      return;
    }

    setBulkBusy(true);
    setError(null);
    setNote(null);
    setBulkResults(null);
    try {
      const res = await fetch("/api/admin/outreach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({ action: "send-bulk", slugs }),
      });
      const raw = await res.text();
      let data: { error?: string; sent?: number; failed?: number; results?: BulkResult[] } = {};
      if (raw) {
        try {
          data = JSON.parse(raw);
        } catch {
          throw new Error(`HTTP ${res.status}: ${raw.slice(0, 200)}`);
        }
      }
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setBulkResults(data.results ?? []);
      setNote(`Sent ${data.sent ?? 0}. Skipped or failed ${data.failed ?? 0}.`);
      // Clear only the ones that went, so a retry does not double-send and
      // the failures stay selected and visible.
      const sentOk = new Set((data.results ?? []).filter((r) => r.ok).map((r) => r.slug));
      setSelected((s) => new Set([...s].filter((x) => !sentOk.has(x))));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bulk send failed");
    } finally {
      setBulkBusy(false);
    }
  }

  async function saveEmail(slug: string) {
    const email = drafts[slug]?.trim();
    if (!email) return;
    const ok = await call(slug, "save-email", { email });
    if (ok) {
      setDrafts((d) => {
        const n = { ...d };
        delete n[slug];
        return n;
      });
      setNote("Email saved.");
    }
  }

  return (
    <>
      <header className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Growth</p>
        <h1 className="mt-1 font-display text-3xl md:text-4xl">Outreach</h1>
        <p className="mt-1 text-sm text-white/60">
          Invite unclaimed schools to claim their profile. Send a batch or two
          a day rather than the whole list at once, so a new sending domain
          isn&apos;t treated as spam. {BULK_MAX} per batch.
        </p>
      </header>

      <OutreachTemplateEditor />

      {selected.size > 0 && (
        <div className="admin-card sticky top-2 z-20 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 backdrop-blur">
          <p className="text-sm font-semibold">
            {selected.size} selected
            {selected.size >= BULK_MAX && (
              <span className="ml-2 font-normal text-white/60">
                (batch limit)
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setSelected(new Set())}
              className="rounded-lg border border-white/15 px-3 py-2 hover:bg-white/5"
            >
              Clear
            </button>
            <button
              onClick={sendSelected}
              disabled={bulkBusy}
              className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-black hover:bg-emerald-400 disabled:opacity-40"
            >
              {bulkBusy
                ? `Sending ${selected.size}…`
                : `Send to ${selected.size} school${selected.size === 1 ? "" : "s"}`}
            </button>
          </div>
        </div>
      )}

      {bulkResults && bulkResults.length > 0 && (
        <div className="admin-card mb-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="font-display text-base">Batch result</p>
            <button
              onClick={() => setBulkResults(null)}
              className="text-xs text-white/40 hover:text-white"
            >
              Dismiss
            </button>
          </div>
          <ul className="space-y-1 text-[13px]">
            {bulkResults.map((r) => (
              <li key={r.slug} className="flex flex-wrap items-baseline gap-2">
                <span className={r.ok ? "text-emerald-400" : "text-amber-400"}>
                  {r.ok ? "sent" : "skipped"}
                </span>
                <span className="min-w-0 break-words text-white/80">{r.name}</span>
                {r.email && <span className="text-white/35">{r.email}</span>}
                {r.reason && <span className="text-white/50">· {r.reason}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="admin-card mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search school or email…"
          className="flex-1 min-w-[200px] rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30"
        />
        <div className="flex flex-wrap gap-1 text-xs">
          {(["todo", "weak", "no-email", "sent", "failed", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-2 ${
                filter === f ? "bg-white text-black" : "border border-white/10 text-white/70 hover:text-white"
              }`}
            >
              {f === "no-email" ? "No email" : f} <span className="ml-1 opacity-60">{counts[f] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>
      )}
      {note && (
        <p className="mb-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
          {note}
        </p>
      )}

      {ready && rows.length > 0 && (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-white/50">
          <span>
            {rows.length} school{rows.length === 1 ? "" : "s"} in view
          </span>
          <button
            onClick={selectAllSendable}
            className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/5 hover:text-white"
          >
            Select first {BULK_MAX} that can be sent
          </button>
        </div>
      )}

      {!ready ? (
        <p className="text-sm text-white/40">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="admin-card rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/40">
          Nothing here.
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map(({ listing, email, status, sentAt, error: rowError, audit }) => {
            const draft = drafts[listing.slug];
            const current = draft ?? email;
            const isBusy = busy === listing.slug;
            const isSelected = selected.has(listing.slug);
            return (
              <li
                key={listing.slug}
                className={`admin-card rounded-2xl border p-4 ${
                  isSelected
                    ? "border-emerald-500/40 bg-emerald-500/[0.06]"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggle(listing.slug)}
                    aria-label={`Select ${listing.name}`}
                    className="mt-1 h-4 w-4 shrink-0 accent-emerald-500"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {listing.name}
                      <span
                        className={`ml-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${STATUS_CLASS[status]}`}
                      >
                        {status}
                      </span>
                    </p>
                    <p className="text-xs text-white/50">
                      {listing.neighbourhood} · {listing.region}
                      {sentAt && ` · sent ${new Date(sentAt).toLocaleDateString("en-GB")}`}
                    </p>
                    {/* The audit is what the email will actually say to them. */}
                    <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span
                        className={`rounded px-1.5 py-0.5 font-bold uppercase tracking-wide ${BAND_CLASS[presenceBand(audit.percent)]}`}
                        title="How much of this school a parent can find online, from what we could source"
                      >
                        {audit.percent}% online
                      </span>
                      {audit.phoneOnly && (
                        <span className="rounded bg-red-500/15 px-1.5 py-0.5 font-bold uppercase tracking-wide text-red-300">
                          phone only
                        </span>
                      )}
                      {audit.missing.slice(0, 4).map((m) => (
                        <span key={m.key} className="rounded bg-white/5 px-1.5 py-0.5 text-white/45">
                          no {m.label.toLowerCase()}
                        </span>
                      ))}
                    </p>
                    {rowError && <p className="mt-1 text-xs text-red-300">{rowError}</p>}

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <input
                        value={current}
                        onChange={(e) =>
                          setDrafts((d) => ({ ...d, [listing.slug]: e.target.value }))
                        }
                        placeholder="no email on file — add one"
                        className={`min-w-[240px] flex-1 rounded-lg border px-3 py-1.5 text-xs text-white placeholder:text-white/30 outline-none focus:border-white/30 ${
                          email ? "border-white/10 bg-transparent" : "border-amber-500/40 bg-amber-500/5"
                        }`}
                      />
                      {draft !== undefined && draft !== email && (
                        <button
                          onClick={() => saveEmail(listing.slug)}
                          disabled={isBusy}
                          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:bg-white/5"
                        >
                          Save
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      onClick={() => send(listing.slug, listing.name, current)}
                      disabled={isBusy || !current}
                      className="rounded-lg bg-emerald-500 px-3 py-1.5 font-semibold text-black hover:bg-emerald-400 disabled:opacity-40"
                    >
                      {isBusy ? "…" : status === "sent" ? "Send again" : "Send"}
                    </button>
                    <button
                      onClick={() => sendTest(listing.slug, listing.name)}
                      disabled={isBusy}
                      className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/5"
                    >
                      Test
                    </button>
                    {status === "sent" ? (
                      <button
                        onClick={() => call(listing.slug, "reset")}
                        disabled={isBusy}
                        className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/5"
                      >
                        Reset
                      </button>
                    ) : (
                      <button
                        onClick={() => call(listing.slug, "skip")}
                        disabled={isBusy}
                        className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/5"
                      >
                        Skip
                      </button>
                    )}
                    <Link
                      href={`/schools/${listing.slug}`}
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
