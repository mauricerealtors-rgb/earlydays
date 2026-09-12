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
import { findListing } from "@/lib/query";

interface Row {
  id: string;
  slug: string;
  schoolName: string;
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  message: string;
  createdAt: string;
  readAt?: string | null;
}

export function AdminEnquiriesPanel() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    const qy = query(collection(firestore(), "enquiries"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(qy, (snap) => {
      const out: Row[] = [];
      snap.forEach((d) => {
        const data = d.data();
        out.push({
          id: d.id,
          slug: data.slug,
          schoolName: findListing(data.slug)?.name ?? data.slug,
          parentName: data.parentName ?? "",
          parentEmail: data.parentEmail ?? "",
          parentPhone: data.parentPhone,
          message: data.message ?? "",
          createdAt: data.createdAt,
          readAt: data.readAt,
        });
      });
      setRows(out);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return (rows ?? []).filter((r) => {
      if (filter === "unread" && r.readAt) return false;
      if (
        term &&
        !(
          r.schoolName.toLowerCase().includes(term) ||
          r.parentName.toLowerCase().includes(term) ||
          r.parentEmail.toLowerCase().includes(term) ||
          r.message.toLowerCase().includes(term)
        )
      )
        return false;
      return true;
    });
  }, [rows, q, filter]);

  const unread = (rows ?? []).filter((r) => !r.readAt).length;

  return (
    <>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
            CRM
          </p>
          <h1 className="mt-1 font-display text-3xl md:text-4xl">Enquiries</h1>
          <p className="mt-1 text-sm text-white/60">
            {rows?.length ?? 0} total · {unread} unread
          </p>
        </div>
      </header>

      <div className="admin-card mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search school, parent, email, message…"
          className="flex-1 min-w-[220px] rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30"
        />
        <div className="flex gap-1">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-2 text-xs capitalize ${
                filter === f
                  ? "bg-white text-black"
                  : "border border-white/10 text-white/70 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {rows === null ? (
        <p className="text-sm text-white/40">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="admin-card rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/40">
          No enquiries match those filters.
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((r) => (
            <li
              key={r.id}
              id={r.id}
              className={`admin-card rounded-2xl border p-4 ${
                r.readAt ? "border-white/10 bg-white/[0.02]" : "border-pink-500/30 bg-pink-500/[0.03]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium">
                    {r.parentName}{" "}
                    <span className="text-white/40">→</span>{" "}
                    <Link
                      href={`/schools/${r.slug}`}
                      target="_blank"
                      className="text-white/80 hover:underline"
                    >
                      {r.schoolName}
                    </Link>
                    {!r.readAt && (
                      <span className="ml-2 rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-pink-300">
                        New
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-white/40">
                    {r.parentEmail}
                    {r.parentPhone ? ` · ${r.parentPhone}` : ""}
                    {r.createdAt && ` · ${new Date(r.createdAt).toLocaleString("en-GB")}`}
                  </p>
                </div>
                <div className="flex gap-2 text-xs">
                  <a
                    href={`mailto:${r.parentEmail}`}
                    className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5"
                  >
                    Email
                  </a>
                  {r.parentPhone && (
                    <a
                      href={`https://wa.me/${r.parentPhone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-white/10 px-3 py-1.5 hover:bg-white/5"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed text-white/85">
                {r.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
