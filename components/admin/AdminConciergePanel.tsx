"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

type Status = "new" | "contacted" | "shortlisted" | "closed-won" | "closed-lost";

interface Row {
  id: string;
  parentName: string;
  parentEmail: string;
  parentWhatsapp: string;
  country: string;
  city?: string;
  timeframe: string;
  areas: string[];
  priorities: string[];
  budgetBand: string;
  children: { age: string; notes: string }[];
  notes?: string;
  referral?: string;
  status: Status;
  createdAt: string;
  statusUpdatedAt?: string;
  internalNotes?: string;
}

const STATUS_META: Record<
  Status,
  { label: string; className: string; dot: string }
> = {
  new: {
    label: "New",
    className: "bg-pink-500/15 text-pink-300",
    dot: "bg-pink-400",
  },
  contacted: {
    label: "Contacted",
    className: "bg-sky-500/15 text-sky-300",
    dot: "bg-sky-400",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "bg-amber-500/15 text-amber-300",
    dot: "bg-amber-400",
  },
  "closed-won": {
    label: "Closed · Won",
    className: "bg-emerald-500/15 text-emerald-300",
    dot: "bg-emerald-400",
  },
  "closed-lost": {
    label: "Closed · Lost",
    className: "bg-white/5 text-white/50",
    dot: "bg-white/40",
  },
};

const BUDGET_LABEL: Record<string, string> = {
  "under-3k": "Under GH₵3k (~$250)",
  "3-8k": "GH₵3–8k (~$250–650)",
  "8-15k": "GH₵8–15k (~$650–1.2k)",
  "15-30k": "GH₵15–30k (~$1.2–2.4k)",
  "30k+": "GH₵30k+ (~$2.4k+)",
  flexible: "Flexible",
};

export function AdminConciergePanel() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    const qy = query(
      collection(firestore(), "conciergeRequests"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(qy, (snap) => {
      const out: Row[] = [];
      snap.forEach((d) => {
        const data = d.data();
        out.push({
          id: d.id,
          parentName: data.parentName ?? "",
          parentEmail: data.parentEmail ?? "",
          parentWhatsapp: data.parentWhatsapp ?? "",
          country: data.country ?? "",
          city: data.city,
          timeframe: data.timeframe ?? "",
          areas: Array.isArray(data.areas) ? data.areas : [],
          priorities: Array.isArray(data.priorities) ? data.priorities : [],
          budgetBand: data.budgetBand ?? "",
          children: Array.isArray(data.children) ? data.children : [],
          notes: data.notes,
          referral: data.referral,
          status: (data.status ?? "new") as Status,
          createdAt: data.createdAt ?? "",
          statusUpdatedAt: data.statusUpdatedAt,
          internalNotes: data.internalNotes,
        });
      });
      setRows(out);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return (rows ?? []).filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (
        term &&
        !(
          r.parentName.toLowerCase().includes(term) ||
          r.parentEmail.toLowerCase().includes(term) ||
          r.country.toLowerCase().includes(term) ||
          (r.city ?? "").toLowerCase().includes(term) ||
          (r.notes ?? "").toLowerCase().includes(term)
        )
      )
        return false;
      return true;
    });
  }, [rows, q, filter]);

  const counts = useMemo(() => {
    const c: Record<Status | "all", number> = {
      new: 0,
      contacted: 0,
      shortlisted: 0,
      "closed-won": 0,
      "closed-lost": 0,
      all: rows?.length ?? 0,
    };
    (rows ?? []).forEach((r) => (c[r.status] = (c[r.status] ?? 0) + 1));
    return c;
  }, [rows]);

  const wonCount = counts["closed-won"];
  // Rough revenue estimate: $350 average per closed-won
  const estRevenueUSD = wonCount * 350;

  async function updateStatus(row: Row, status: Status) {
    setBusy(row.id);
    try {
      await updateDoc(doc(firestore(), "conciergeRequests", row.id), {
        status,
        statusUpdatedAt: new Date().toISOString(),
      });
    } finally {
      setBusy(null);
    }
  }

  async function saveInternalNote(row: Row, note: string) {
    await updateDoc(doc(firestore(), "conciergeRequests", row.id), {
      internalNotes: note,
      statusUpdatedAt: new Date().toISOString(),
    });
  }

  return (
    <>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
            CRM · Concierge
          </p>
          <h1 className="mt-1 font-display text-3xl md:text-4xl">
            Concierge requests
          </h1>
          <p className="mt-1 text-sm text-white/60">
            {rows?.length ?? 0} total · {counts.new} new · Est. revenue closed{" "}
            ${estRevenueUSD.toLocaleString()}
          </p>
        </div>
      </header>

      {/* KPI strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        {(["new", "contacted", "shortlisted", "closed-won", "closed-lost"] as const).map(
          (s) => (
            <div
              key={s}
              className="admin-card rounded-2xl border border-white/10 bg-white/[0.02] p-4"
            >
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/50">
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${STATUS_META[s].dot}`}
                />
                {STATUS_META[s].label}
              </p>
              <p className="mt-1 font-display text-2xl">{counts[s]}</p>
            </div>
          )
        )}
      </div>

      {/* Toolbar */}
      <div className="admin-card mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, country, notes…"
          className="flex-1 min-w-[220px] rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30"
        />
        <div className="flex flex-wrap gap-1 text-xs">
          {(["all", "new", "contacted", "shortlisted", "closed-won", "closed-lost"] as const).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-2 capitalize ${
                  filter === f
                    ? "bg-white text-black"
                    : "border border-white/10 text-white/70 hover:text-white"
                }`}
              >
                {f === "all" ? "All" : STATUS_META[f].label}{" "}
                <span className="ml-1 opacity-60">{counts[f] ?? 0}</span>
              </button>
            )
          )}
        </div>
      </div>

      {rows === null ? (
        <p className="text-sm text-white/40">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="admin-card rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/40">
          {rows.length === 0
            ? "No concierge requests yet. When a parent submits at /concierge they'll appear here."
            : "No requests match those filters."}
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((r) => {
            const isOpen = openId === r.id;
            const meta = STATUS_META[r.status];
            return (
              <li
                key={r.id}
                className={`admin-card rounded-2xl border transition ${
                  isOpen ? "border-white/20 bg-white/[0.04]" : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : r.id)}
                  className="flex w-full flex-wrap items-start justify-between gap-3 p-4 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-baseline gap-2 font-medium">
                      {r.parentName}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${meta.className}`}
                      >
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </span>
                      <span className="text-xs text-white/40">
                        · {r.country}
                        {r.city ? `, ${r.city}` : ""}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-white/50">
                      {r.children.length} child{r.children.length === 1 ? "" : "ren"} ·{" "}
                      {r.timeframe} · {BUDGET_LABEL[r.budgetBand] ?? r.budgetBand}
                    </p>
                    <p className="text-xs text-white/40">
                      {r.parentEmail} · {r.parentWhatsapp}
                      {r.createdAt && ` · ${formatTime(r.createdAt)}`}
                    </p>
                  </div>
                  <span className="text-white/40 text-sm">{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen && (
                  <div className="border-t border-white/10 p-4">
                    {/* Reply channels */}
                    <div className="mb-4 flex flex-wrap gap-2 text-xs">
                      <a
                        href={`mailto:${r.parentEmail}?subject=${encodeURIComponent(
                          "Your EarlyDays concierge request"
                        )}`}
                        className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/5"
                      >
                        Email {r.parentEmail}
                      </a>
                      <a
                        href={`https://wa.me/${r.parentWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hi ${r.parentName}, thanks for reaching out to EarlyDays Concierge — we've received your request. I'll come back to you with a shortlist shortly.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/5"
                      >
                        WhatsApp {r.parentWhatsapp}
                      </a>
                    </div>

                    {/* Detail grid */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <Detail label="Children">
                        <ul className="space-y-1">
                          {r.children.map((c, i) => (
                            <li key={i}>
                              <span className="font-semibold">Child {i + 1}:</span>{" "}
                              {c.age}
                              {c.notes ? ` — ${c.notes}` : ""}
                            </li>
                          ))}
                        </ul>
                      </Detail>
                      <Detail label="Timeframe">{r.timeframe}</Detail>
                      <Detail label="Budget band">{BUDGET_LABEL[r.budgetBand] ?? r.budgetBand}</Detail>
                      <Detail label="Areas">
                        {r.areas.length ? r.areas.join(", ") : "Open to suggestions"}
                      </Detail>
                      <Detail label="Priorities">
                        {r.priorities.length ? (
                          <div className="flex flex-wrap gap-1">
                            {r.priorities.map((p) => (
                              <span
                                key={p}
                                className="rounded-full bg-white/10 px-2 py-0.5 text-[11px]"
                              >
                                {p}
                              </span>
                            ))}
                          </div>
                        ) : (
                          "None specified"
                        )}
                      </Detail>
                      {r.referral && <Detail label="How they heard">{r.referral}</Detail>}
                    </div>

                    {r.notes && (
                      <div className="mt-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                          Parent's notes
                        </p>
                        <p className="mt-1 whitespace-pre-wrap rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm text-white/85">
                          {r.notes}
                        </p>
                      </div>
                    )}

                    {/* Internal notes editor */}
                    <div className="mt-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                        Internal notes (private)
                      </p>
                      <InternalNoteEditor
                        rowId={r.id}
                        initial={r.internalNotes ?? ""}
                        onSave={(note) => saveInternalNote(r, note)}
                      />
                    </div>

                    {/* Status transitions */}
                    <div className="mt-4">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/50">
                        Update status
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(["new", "contacted", "shortlisted", "closed-won", "closed-lost"] as const).map(
                          (s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(r, s)}
                              disabled={busy === r.id || r.status === s}
                              className={`rounded-lg px-3 py-1.5 text-xs ${
                                r.status === s
                                  ? "bg-white text-black"
                                  : "border border-white/15 text-white/80 hover:bg-white/5"
                              } disabled:opacity-50`}
                            >
                              {STATUS_META[s].label}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">{label}</p>
      <div className="mt-1 text-sm text-white/85">{children}</div>
    </div>
  );
}

function InternalNoteEditor({
  initial,
  onSave,
}: {
  rowId: string;
  initial: string;
  onSave: (v: string) => Promise<void>;
}) {
  const [val, setVal] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <div className="mt-1">
      <textarea
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          setSaved(false);
        }}
        onBlur={async () => {
          if (val === initial) return;
          setSaving(true);
          await onSave(val);
          setSaving(false);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }}
        placeholder="Shortlist candidates, tour dates, deposit status…"
        className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30"
        rows={3}
      />
      <p className="mt-1 text-[10px] text-white/40">
        {saving ? "Saving…" : saved ? "Saved" : "Autosaves when you tab away"}
      </p>
    </div>
  );
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    const diffMs = Date.now() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    return d.toLocaleDateString("en-GB");
  } catch {
    return iso;
  }
}
