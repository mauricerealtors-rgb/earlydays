"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SchoolRow } from "@/lib/admin-data";

type SortKey = "name" | "area" | "views" | "enquiries" | "tier";

export function SchoolsTable({ rows }: { rows: SchoolRow[] }) {
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<"all" | "free" | "verified" | "featured">("all");
  const [claimStatus, setClaimStatus] = useState<"all" | "claimed" | "unclaimed">("all");
  const [sortKey, setSortKey] = useState<SortKey>("views");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    const list = rows.filter((r) => {
      if (tier !== "all" && r.tier !== tier) return false;
      if (claimStatus === "claimed" && !r.claimed) return false;
      if (claimStatus === "unclaimed" && r.claimed) return false;
      if (
        term &&
        !(
          r.name.toLowerCase().includes(term) ||
          r.slug.toLowerCase().includes(term) ||
          r.area.toLowerCase().includes(term)
        )
      )
        return false;
      return true;
    });
    const dir = sortDir === "asc" ? 1 : -1;
    return list.slice().sort((a, b) => {
      switch (sortKey) {
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "area":
          return a.area.localeCompare(b.area) * dir;
        case "views":
          return (a.views - b.views) * dir;
        case "enquiries":
          return (a.enquiries - b.enquiries) * dir;
        case "tier":
          return tierRank(a.tier) - tierRank(b.tier) === 0
            ? a.name.localeCompare(b.name)
            : (tierRank(a.tier) - tierRank(b.tier)) * dir;
      }
    });
  }, [rows, q, tier, claimStatus, sortKey, sortDir]);

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("desc");
    }
  }

  return (
    <>
      {/* Toolbar */}
      <div className="admin-card mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, slug, area…"
          className="flex-1 min-w-[200px] rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30"
        />
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value as typeof tier)}
          className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
        >
          <option value="all" className="bg-black">All plans</option>
          <option value="free" className="bg-black">Free</option>
          <option value="verified" className="bg-black">Verified</option>
          <option value="featured" className="bg-black">Featured</option>
        </select>
        <select
          value={claimStatus}
          onChange={(e) => setClaimStatus(e.target.value as typeof claimStatus)}
          className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
        >
          <option value="all" className="bg-black">All statuses</option>
          <option value="claimed" className="bg-black">Claimed</option>
          <option value="unclaimed" className="bg-black">Unclaimed</option>
        </select>
        <span className="ml-auto text-xs text-white/50">
          {filtered.length} of {rows.length}
        </span>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40">
              <tr>
                <Th onClick={() => toggleSort("name")} active={sortKey === "name"} dir={sortDir}>
                  School
                </Th>
                <Th onClick={() => toggleSort("area")} active={sortKey === "area"} dir={sortDir}>
                  Area
                </Th>
                <th className="px-3 py-2 text-left">Status</th>
                <Th onClick={() => toggleSort("tier")} active={sortKey === "tier"} dir={sortDir}>
                  Plan
                </Th>
                <Th onClick={() => toggleSort("views")} active={sortKey === "views"} dir={sortDir} align="right">
                  Views
                </Th>
                <Th onClick={() => toggleSort("enquiries")} active={sortKey === "enquiries"} dir={sortDir} align="right">
                  Enq.
                </Th>
                <th className="px-3 py-2 text-right">Contacts</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((r) => (
                <tr key={r.slug} className="hover:bg-white/[0.03]">
                  <td className="px-3 py-2.5">
                    <Link href={`/schools/${r.slug}`} target="_blank" className="font-medium hover:underline">
                      {r.name}
                    </Link>
                    <div className="text-[10px] text-white/40">/{r.slug}</div>
                  </td>
                  <td className="px-3 py-2.5 text-white/70">
                    {r.area}
                    <div className="text-[10px] text-white/40">{r.region}</div>
                  </td>
                  <td className="px-3 py-2.5">
                    {r.claimed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
                        <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Claimed
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/50">
                        Unclaimed
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <TierPill tier={r.tier} />
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    {r.views.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    {r.enquiries.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-white/70">
                    {r.contactClicks.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <Link
                      href={`/schools/${r.slug}`}
                      target="_blank"
                      className="text-[11px] text-white/50 hover:text-white"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-10 text-center text-sm text-white/40">
                    No schools match those filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Th({
  children,
  onClick,
  active,
  dir,
  align = "left",
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  dir: "asc" | "desc";
  align?: "left" | "right";
}) {
  return (
    <th className={`px-3 py-2 ${align === "right" ? "text-right" : "text-left"}`}>
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-1 uppercase tracking-widest ${
          active ? "text-white" : "hover:text-white/70"
        }`}
      >
        {children}
        {active && <span className="text-[8px]">{dir === "asc" ? "▲" : "▼"}</span>}
      </button>
    </th>
  );
}

function TierPill({ tier }: { tier: "free" | "verified" | "featured" }) {
  if (tier === "featured") {
    return (
      <span className="inline-flex rounded-full bg-gradient-to-r from-pink-500/25 to-amber-500/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-pink-300">
        Featured
      </span>
    );
  }
  if (tier === "verified") {
    return (
      <span className="inline-flex rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-sky-300">
        Verified
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/50">
      Free
    </span>
  );
}

function tierRank(t: "free" | "verified" | "featured") {
  return t === "featured" ? 0 : t === "verified" ? 1 : 2;
}
