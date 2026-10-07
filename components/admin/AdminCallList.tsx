"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { allListings } from "@/lib/query";
import { auditPresence, presenceBand } from "@/lib/presence";
import {
  CALL_STATUSES,
  CLOSED,
  NEXT_ACTIONS,
  STATUS_LABEL,
  STATUS_TONE,
  dialable,
  isDue,
  isOverdue,
  todayISO,
  whatsappLink,
  type CallStatus,
  type CrmRecord,
  type NextAction,
} from "@/lib/crm";
import type { Listing } from "@/lib/types";

type Filter =
  | "due"
  | "todo"
  | "weak"
  | "interested"
  | "visits"
  | "contacted"
  | "all";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "due", label: "Due today" },
  { value: "todo", label: "Not called" },
  { value: "weak", label: "Weakest first" },
  { value: "interested", label: "Interested" },
  { value: "visits", label: "Visits" },
  { value: "contacted", label: "Contacted" },
  { value: "all", label: "All" },
];

const BAND_CLASS: Record<string, string> = {
  weak: "bg-red-500/15 text-red-300",
  partial: "bg-amber-500/15 text-amber-300",
  good: "bg-emerald-500/15 text-emerald-300",
};

function Kpi({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
        {label}
      </p>
      <p className={`mt-1 font-display text-3xl ${tone ?? "text-white"}`}>{value}</p>
    </div>
  );
}

/** What this school is missing — the whole reason the call is worth making. */
function Checklist({ listing }: { listing: Listing }) {
  const audit = auditPresence(listing);
  return (
    <div className="flex flex-wrap gap-1">
      {audit.checks.map((c) => (
        <span
          key={c.key}
          title={c.ok ? `${c.label}: on file` : c.finding}
          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
            c.ok ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-white/30"
          }`}
        >
          {c.ok ? "✓" : "✗"} {c.label}
        </span>
      ))}
    </div>
  );
}

export function AdminCallList() {
  const { user } = useAuth();
  const [records, setRecords] = useState<Record<string, CrmRecord>>({});
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<Filter>("due");
  const [region, setRegion] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  // Per-row draft state, so typing a note never touches the saved record.
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});
  const [nameDraft, setNameDraft] = useState<Record<string, string>>({});
  const [roleDraft, setRoleDraft] = useState<Record<string, string>>({});
  const [dateDraft, setDateDraft] = useState<Record<string, string>>({});
  const [actionDraft, setActionDraft] = useState<Record<string, NextAction>>({});

  const listings = useMemo(() => allListings(), []);
  const today = todayISO();

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(firestore(), "schoolContacts"), (snap) => {
      const next: Record<string, CrmRecord> = {};
      snap.forEach((d) => (next[d.id] = d.data() as CrmRecord));
      setRecords(next);
      setReady(true);
    });
    return () => unsub();
  }, [user]);

  const regions = useMemo(
    () => [...new Set(listings.map((l) => l.region))].sort(),
    [listings],
  );

  const stats = useMemo(() => {
    let due = 0, todo = 0, interested = 0, visits = 0, contacted = 0, callable = 0;
    for (const l of listings) {
      const r = records[l.slug];
      if (dialable(l.phone) || dialable(l.whatsapp)) callable++;
      if (isDue(r, today)) due++;
      if (!r || r.status === "not-contacted") todo++;
      if (r?.status === "interested") interested++;
      if (r?.status === "visit-booked") visits++;
      if (r?.lastContactedAt) contacted++;
    }
    return { due, todo, interested, visits, contacted, callable };
  }, [listings, records, today]);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = listings.filter((l) => {
      if (region !== "all" && l.region !== region) return false;
      if (
        term &&
        !l.name.toLowerCase().includes(term) &&
        !l.neighbourhood.toLowerCase().includes(term) &&
        !(l.phone ?? "").includes(term)
      ) {
        return false;
      }
      const r = records[l.slug];
      switch (filter) {
        case "due":
          return isDue(r, today);
        case "todo":
          return !r || r.status === "not-contacted";
        case "weak":
          return !r || !CLOSED.has(r.status);
        case "interested":
          return r?.status === "interested";
        case "visits":
          return r?.status === "visit-booked";
        case "contacted":
          return Boolean(r?.lastContactedAt);
        default:
          return true;
      }
    });

    if (filter === "weak") {
      // Least complete profile first: most to offer, easiest conversation.
      list = [...list].sort(
        (a, b) => auditPresence(a).percent - auditPresence(b).percent,
      );
    } else if (filter === "due") {
      list = [...list].sort((a, b) =>
        (records[a.slug]?.nextActionAt ?? "").localeCompare(
          records[b.slug]?.nextActionAt ?? "",
        ),
      );
    }
    return list;
  }, [listings, records, filter, region, q, today]);

  async function save(
    slug: string,
    patch: Record<string, unknown>,
    successMessage?: string,
  ) {
    if (!user) return;
    setBusy(slug);
    setError(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/crm", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slug, ...patch }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save");
      if (successMessage) {
        setFlash(successMessage);
        setTimeout(() => setFlash(null), 2500);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(null);
    }
  }

  if (!ready) {
    return <p className="p-6 text-white/50">Loading call list…</p>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">Calls</h1>
        <p className="mt-1 text-sm text-white/50">
          {stats.callable} of {listings.length} schools have a number you can
          dial. Log what happened so you never ring the same school twice.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Kpi label="Due today" value={stats.due} tone={stats.due ? "text-violet-300" : undefined} />
        <Kpi label="Not called" value={stats.todo} />
        <Kpi label="Contacted" value={stats.contacted} tone="text-sky-300" />
        <Kpi label="Interested" value={stats.interested} tone="text-emerald-300" />
        <Kpi label="Visits booked" value={stats.visits} tone="text-emerald-200" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
              filter === f.value
                ? "bg-white text-black"
                : "border border-white/15 text-white/70 hover:bg-white/5"
            }`}
          >
            {f.label}
          </button>
        ))}
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="rounded-lg border border-white/15 bg-transparent px-3 py-1.5 text-sm"
        >
          <option value="all">All regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, area or number"
          className="min-w-[220px] flex-1 rounded-lg border border-white/15 bg-transparent px-3 py-1.5 text-sm placeholder:text-white/30"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/15 px-4 py-2 text-sm text-red-300">{error}</p>
      )}
      {flash && (
        <p className="rounded-lg bg-emerald-500/15 px-4 py-2 text-sm text-emerald-300">
          {flash}
        </p>
      )}

      <p className="text-sm text-white/40">
        {rows.length} school{rows.length === 1 ? "" : "s"}
      </p>

      <div className="space-y-3">
        {rows.map((l) => {
          const rec = records[l.slug];
          const status: CallStatus = rec?.status ?? "not-contacted";
          const tel = dialable(l.phone);
          const wa = whatsappLink(l.whatsapp ?? l.phone);
          const audit = auditPresence(l);
          const band = presenceBand(audit.percent);
          const expanded = open === l.slug;
          const overdue = isOverdue(rec, today);

          return (
            <article
              key={l.slug}
              className={`rounded-xl border bg-white/[0.02] p-4 ${
                overdue ? "border-violet-400/40" : "border-white/10"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/schools/${l.slug}`}
                      target="_blank"
                      className="font-display text-lg hover:underline"
                    >
                      {l.name}
                    </Link>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_TONE[status]}`}>
                      {STATUS_LABEL[status]}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${BAND_CLASS[band]}`}>
                      {audit.percent}% complete
                    </span>
                    {audit.phoneOnly && (
                      <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-300">
                        Phone only
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-white/50">
                    {l.neighbourhood}, {l.region}
                    {rec?.contactName ? ` · ${rec.contactName}` : ""}
                    {rec?.contactRole ? ` (${rec.contactRole})` : ""}
                  </p>

                  {rec?.nextActionAt && !CLOSED.has(status) && (
                    <p className={`mt-1 text-sm font-semibold ${overdue ? "text-violet-300" : "text-white/60"}`}>
                      {overdue ? "Overdue: " : "Next: "}
                      {NEXT_ACTIONS.find((a) => a.value === rec.nextActionType)?.label ?? "Follow up"}{" "}
                      on {rec.nextActionAt}
                    </p>
                  )}

                  <div className="mt-2">
                    <Checklist listing={l} />
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  {tel ? (
                    <a
                      href={`tel:${tel}`}
                      className="rounded-lg bg-white px-4 py-2 font-display text-lg font-bold text-black"
                    >
                      {l.phone}
                    </a>
                  ) : (
                    <span className="text-sm text-white/30">No number</span>
                  )}
                  <div className="flex gap-2">
                    {wa && (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener"
                        className="rounded-lg border border-white/15 px-3 py-1 text-xs hover:bg-white/5"
                      >
                        WhatsApp
                      </a>
                    )}
                    <button
                      onClick={() => setOpen(expanded ? null : l.slug)}
                      className="rounded-lg border border-white/15 px-3 py-1 text-xs hover:bg-white/5"
                    >
                      {expanded ? "Close" : "Log call"}
                    </button>
                  </div>
                </div>
              </div>

              {expanded && (
                <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-xs font-semibold uppercase tracking-widest text-white/40">
                      Outcome
                      <select
                        value={status}
                        onChange={(e) =>
                          save(
                            l.slug,
                            { status: e.target.value as CallStatus, logContact: true },
                            `${l.name} marked ${STATUS_LABEL[e.target.value as CallStatus].toLowerCase()}`,
                          )
                        }
                        className="mt-1 w-full rounded-lg border border-white/15 bg-[#0A0A0B] px-3 py-2 text-sm font-normal normal-case tracking-normal text-white"
                      >
                        {CALL_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <label className="text-xs font-semibold uppercase tracking-widest text-white/40">
                        Spoke to
                        <input
                          value={nameDraft[l.slug] ?? rec?.contactName ?? ""}
                          onChange={(e) =>
                            setNameDraft({ ...nameDraft, [l.slug]: e.target.value })
                          }
                          placeholder="Name"
                          className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm font-normal normal-case tracking-normal placeholder:text-white/25"
                        />
                      </label>
                      <label className="text-xs font-semibold uppercase tracking-widest text-white/40">
                        Role
                        <input
                          value={roleDraft[l.slug] ?? rec?.contactRole ?? ""}
                          onChange={(e) =>
                            setRoleDraft({ ...roleDraft, [l.slug]: e.target.value })
                          }
                          placeholder="Head, admin…"
                          className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm font-normal normal-case tracking-normal placeholder:text-white/25"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                    <label className="text-xs font-semibold uppercase tracking-widest text-white/40">
                      Next action
                      <select
                        value={actionDraft[l.slug] ?? rec?.nextActionType ?? "call"}
                        onChange={(e) =>
                          setActionDraft({
                            ...actionDraft,
                            [l.slug]: e.target.value as NextAction,
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-white/15 bg-[#0A0A0B] px-3 py-2 text-sm font-normal normal-case tracking-normal text-white"
                      >
                        {NEXT_ACTIONS.map((a) => (
                          <option key={a.value} value={a.value}>
                            {a.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-xs font-semibold uppercase tracking-widest text-white/40">
                      On
                      <input
                        type="date"
                        value={dateDraft[l.slug] ?? rec?.nextActionAt ?? ""}
                        onChange={(e) =>
                          setDateDraft({ ...dateDraft, [l.slug]: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm font-normal normal-case tracking-normal"
                      />
                    </label>
                    {rec?.nextActionAt && (
                      <button
                        onClick={() =>
                          save(l.slug, { nextActionAt: null }, "Follow-up cleared")
                        }
                        className="self-end rounded-lg border border-white/15 px-3 py-2 text-xs hover:bg-white/5"
                      >
                        Clear date
                      </button>
                    )}
                  </div>

                  <label className="block text-xs font-semibold uppercase tracking-widest text-white/40">
                    What they said
                    <textarea
                      value={noteDraft[l.slug] ?? ""}
                      onChange={(e) =>
                        setNoteDraft({ ...noteDraft, [l.slug]: e.target.value })
                      }
                      rows={3}
                      placeholder="Asked for a WhatsApp with the link. Head teacher back Thursday."
                      className="mt-1 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm font-normal normal-case tracking-normal placeholder:text-white/25"
                    />
                  </label>

                  <div className="flex flex-wrap gap-2">
                    <button
                      disabled={busy === l.slug}
                      onClick={() => {
                        const patch: Record<string, unknown> = { logContact: true };
                        const note = noteDraft[l.slug]?.trim();
                        if (note) patch.note = note;
                        if (nameDraft[l.slug] !== undefined) patch.contactName = nameDraft[l.slug];
                        if (roleDraft[l.slug] !== undefined) patch.contactRole = roleDraft[l.slug];
                        if (dateDraft[l.slug]) {
                          patch.nextActionAt = dateDraft[l.slug];
                          patch.nextActionType = actionDraft[l.slug] ?? rec?.nextActionType ?? "call";
                        }
                        save(l.slug, patch, `Saved for ${l.name}`).then(() =>
                          setNoteDraft({ ...noteDraft, [l.slug]: "" }),
                        );
                      }}
                      className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
                    >
                      {busy === l.slug ? "Saving…" : "Save"}
                    </button>
                    <Link
                      href={`/admin/schools/${l.slug}`}
                      className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/5"
                    >
                      Edit listing
                    </Link>
                  </div>

                  {rec?.notes?.length ? (
                    <ol className="space-y-2 border-t border-white/10 pt-3">
                      {rec.notes.map((n, i) => (
                        <li key={i} className="text-sm">
                          <p className="text-[11px] uppercase tracking-widest text-white/35">
                            {n.at.slice(0, 16).replace("T", " ")}
                            {n.status ? ` · ${STATUS_LABEL[n.status]}` : ""}
                          </p>
                          <p className="text-white/80">{n.text}</p>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="border-t border-white/10 pt-3 text-sm text-white/35">
                      No calls logged yet.
                    </p>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
