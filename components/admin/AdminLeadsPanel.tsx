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
import { dialable, whatsappLink } from "@/lib/crm";

/**
 * Schools who booked a call with us from /for-schools.
 *
 * Not to be confused with /admin/enquiries, which is the other direction:
 * parents enquiring about a school. These are schools enquiring about us, and
 * they went straight into Firestore for weeks with nothing in the product able
 * to read them. The rules were never the problem. There was no page.
 *
 * The booking carries a day and a time the school chose, so the default view
 * is the soonest call first rather than the newest submission. A lead that
 * arrived this morning for a call next Tuesday matters less today than one
 * from last week whose call is in an hour.
 */

interface Lead {
  id: string;
  mode: string;
  /** Renamed from `plan` when the tiers were removed; old docs still carry the
   *  old key, so both are read and the newer one wins. */
  service: string;
  schoolName: string;
  contactName: string;
  phone: string;
  email: string;
  message: string;
  date: string;
  time: string;
  status: string;
  createdAt: string;
  handledAt?: string | null;
}

const SERVICE_LABEL: Record<string, string> = {
  general: "General",
  listing: "Listing",
  website: "Website",
  management: "Management system",
  social: "Social media",
  seo: "Local SEO",
  ads: "Paid ads",
  // Pre-rename values, kept so old rows do not render as raw keys.
  starter: "Be Found (old plan)",
  professional: "Get Enquiries (old plan)",
  complete: "Run Your School (old plan)",
};

type View = "upcoming" | "new" | "done" | "all";

const VIEWS: { value: View; label: string }[] = [
  { value: "upcoming", label: "Upcoming calls" },
  { value: "new", label: "New" },
  { value: "done", label: "Done" },
  { value: "all", label: "All" },
];

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function AdminLeadsPanel() {
  const [rows, setRows] = useState<Lead[] | null>(null);
  const [view, setView] = useState<View>("upcoming");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const today = todayISO();

  useEffect(() => {
    const qy = query(
      collection(firestore(), "schoolServiceEnquiries"),
      orderBy("createdAt", "desc"),
    );
    const unsub = onSnapshot(
      qy,
      (snap) => {
        const out: Lead[] = [];
        snap.forEach((d) => {
          const v = d.data();
          out.push({
            id: d.id,
            mode: v.mode ?? "book",
            service: v.service ?? v.plan ?? "general",
            schoolName: v.schoolName ?? "",
            contactName: v.contactName ?? "",
            phone: v.phone ?? "",
            email: v.email ?? "",
            message: v.message ?? "",
            date: v.date ?? "",
            time: v.time ?? "",
            status: v.status ?? "new",
            createdAt: v.createdAt ?? "",
            handledAt: v.handledAt ?? null,
          });
        });
        setRows(out);
        setError(null);
      },
      (e) => {
        // A permission error here means the signed-in address is not in the
        // isAdmin() list inside firestore.rules, which is a separate list from
        // ADMIN_EMAILS on the API routes.
        setError(e.message);
        setRows([]);
      },
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = (rows ?? []).filter((r) => {
      if (
        term &&
        !(
          r.schoolName.toLowerCase().includes(term) ||
          r.contactName.toLowerCase().includes(term) ||
          r.phone.includes(term) ||
          r.message.toLowerCase().includes(term)
        )
      ) {
        return false;
      }
      switch (view) {
        case "upcoming":
          return r.status !== "done" && (!r.date || r.date >= today);
        case "new":
          return r.status === "new";
        case "done":
          return r.status === "done";
        default:
          return true;
      }
    });

    if (view === "upcoming") {
      // Soonest call first. A booking with no date sinks to the bottom.
      list = [...list].sort((a, b) => {
        const ad = `${a.date || "9999"} ${a.time}`;
        const bd = `${b.date || "9999"} ${b.time}`;
        return ad.localeCompare(bd);
      });
    }
    return list;
  }, [rows, view, q, today]);

  const stats = useMemo(() => {
    const all = rows ?? [];
    return {
      total: all.length,
      fresh: all.filter((r) => r.status === "new").length,
      todayCalls: all.filter((r) => r.date === today && r.status !== "done").length,
      overdue: all.filter(
        (r) => r.date && r.date < today && r.status !== "done",
      ).length,
    };
  }, [rows, today]);

  async function setStatus(id: string, status: string) {
    setBusy(id);
    setError(null);
    try {
      await updateDoc(doc(firestore(), "schoolServiceEnquiries", id), {
        status,
        handledAt: status === "done" ? new Date().toISOString() : null,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <header className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
          Sales
        </p>
        <h1 className="mt-1 font-display text-3xl md:text-4xl">Leads</h1>
        <p className="mt-1 text-sm text-white/60">
          Schools who booked a call with us from the for-schools page. Parent
          enquiries about a school live under Enquiries.
        </p>
      </header>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
          <p className="mt-1 text-xs text-red-200/70">
            If this says permission denied, the address you are signed in with
            is not in the isAdmin() list in firestore.rules.
          </p>
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi label="Total" value={stats.total} />
        <Kpi label="New" value={stats.fresh} tone={stats.fresh ? "text-pink-300" : undefined} />
        <Kpi
          label="Calls today"
          value={stats.todayCalls}
          tone={stats.todayCalls ? "text-violet-300" : undefined}
        />
        <Kpi
          label="Missed"
          value={stats.overdue}
          tone={stats.overdue ? "text-red-300" : undefined}
        />
      </div>

      <div className="admin-card mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search school, contact, phone, message…"
          className="min-w-[220px] flex-1 rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
        />
        <div className="flex flex-wrap gap-1">
          {VIEWS.map((v) => (
            <button
              key={v.value}
              onClick={() => setView(v.value)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                view === v.value
                  ? "bg-white text-black"
                  : "border border-white/10 text-white/70 hover:text-white"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {rows === null ? (
        <p className="text-sm text-white/40">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="admin-card rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/40">
          Nothing here yet.
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((r) => {
            const tel = dialable(r.phone);
            const wa = whatsappLink(r.phone);
            const missed = r.date && r.date < today && r.status !== "done";
            return (
              <li
                key={r.id}
                className={`admin-card rounded-2xl border p-4 ${
                  r.status === "done"
                    ? "border-white/10 bg-white/[0.02] opacity-60"
                    : missed
                      ? "border-red-500/30 bg-red-500/[0.04]"
                      : r.status === "new"
                        ? "border-pink-500/30 bg-pink-500/[0.03]"
                        : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium break-words">
                      {r.schoolName || "Unnamed school"}
                      <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/70">
                        {SERVICE_LABEL[r.service] ?? r.service}
                      </span>
                      {r.status === "new" && (
                        <span className="ml-2 rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-pink-300">
                          New
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-white/50 break-words">
                      {r.contactName}
                      {r.phone ? ` · ${r.phone}` : ""}
                      {r.email ? ` · ${r.email}` : ""}
                    </p>
                    {r.date && (
                      <p
                        className={`mt-1 text-xs font-semibold ${
                          missed ? "text-red-300" : "text-violet-300"
                        }`}
                      >
                        Call booked:{" "}
                        {new Date(`${r.date}T00:00:00`).toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        at {r.time}
                        {missed ? " · missed" : ""}
                      </p>
                    )}
                    {r.createdAt && (
                      <p className="mt-0.5 text-[11px] text-white/30">
                        Booked {new Date(r.createdAt).toLocaleString("en-GB")}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {tel && (
                      <a
                        href={`tel:${tel}`}
                        className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5"
                      >
                        Call
                      </a>
                    )}
                    {wa && (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5"
                      >
                        WhatsApp
                      </a>
                    )}
                    <button
                      disabled={busy === r.id}
                      onClick={() =>
                        setStatus(r.id, r.status === "done" ? "new" : "done")
                      }
                      className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5 disabled:opacity-50"
                    >
                      {busy === r.id
                        ? "Saving…"
                        : r.status === "done"
                          ? "Reopen"
                          : "Mark done"}
                    </button>
                  </div>
                </div>

                {r.message && (
                  <p className="mt-3 whitespace-pre-wrap break-words text-[14px] leading-relaxed text-white/85">
                    {r.message}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

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
