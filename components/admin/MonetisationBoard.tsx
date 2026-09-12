"use client";

import { useMemo, useState } from "react";

type Status = "live" | "building" | "planned" | "idea";
type Tier = "T1 · Fastest cash" | "T2 · Services" | "T3 · Non-obvious";

interface Play {
  id: string;
  title: string;
  tier: Tier;
  status: Status;
  price: string;
  effort: "Low" | "Medium" | "High";
  hook: string; // one line pitch
  detail: string; // 2-3 lines depth
  next?: string; // what's the next action
}

const PLAYS: Play[] = [
  // ─── Tier 1 ────────────────────────────────────────────────
  {
    id: "claim-freemium",
    title: "Freemium claimable listings",
    tier: "T1 · Fastest cash",
    status: "live",
    price: "GH₵200/mo Verified · GH₵500/mo Featured",
    effort: "Low",
    hook: "Schools claim their profile — free tier + two paid tiers via Paystack.",
    detail:
      "Verified: badge + priority in area/category ordering + WhatsApp unlocked. Featured: everything + homepage rotation. Both via Paystack MoMo/card checkout.",
    next: "Manually approach 5 already-listed schools and offer them the Verified tier.",
  },
  {
    id: "pay-per-lead",
    title: "Pay-per-lead",
    tier: "T1 · Fastest cash",
    status: "planned",
    price: "GH₵50–200 per delivered lead",
    effort: "Medium",
    hook: "School pays each time a parent enquiry is delivered — aligns incentives.",
    detail:
      "Booking.com model. Layer on top of subscriptions or as a standalone plan. Requires: enquiry-attribution logic + monthly invoicing (Paystack recurring or manual invoice).",
    next: "Ship after 3+ paid subscriptions to validate lead volume first.",
  },
  {
    id: "featured-rotation",
    title: "Featured homepage slot",
    tier: "T1 · Fastest cash",
    status: "building",
    price: "Included in GH₵500/mo Featured",
    effort: "Low",
    hook: "Rotating 'Featured this month' block on the homepage.",
    detail:
      "Featured subscribers rotate through a homepage slot. Fully transparent (marked as sponsored). Doesn't break the honest-brand.",
    next: "Add the rotating block to app/page.tsx pulling Featured-tier subscriptions.",
  },
  {
    id: "sponsored-guides",
    title: "Sponsored guide sponsorship",
    tier: "T1 · Fastest cash",
    status: "idea",
    price: "GH₵1,000–3,000 per guide",
    effort: "Low",
    hook: "'This guide is sponsored by [School]' at the top of a relevant guide.",
    detail:
      "Only ever accept sponsors that don't distort the content. Sponsor doesn't get editorial control. Disclosed at top of the article.",
    next: "Wait until guide traffic passes ~500 monthly readers before selling.",
  },

  // ─── Tier 2 ────────────────────────────────────────────────
  {
    id: "school-websites",
    title: "School websites — productized",
    tier: "T2 · Services",
    status: "planned",
    price: "GH₵5,000–10,000 setup + GH₵500/mo hosting",
    effort: "Medium",
    hook: "Most Ghanaian school sites are genuinely bad. You have credibility.",
    detail:
      "3 clean templates. You install, populate from their existing content, hand over. Bundle a domain. Aim for 5 sales in 90 days.",
    next: "Design the 3 templates. Cold-call 5 warmest schools in your directory first.",
  },
  {
    id: "hiring-board",
    title: "Hiring board — schools hire teachers",
    tier: "T2 · Services",
    status: "planned",
    price: "GH₵100–300 per job post · GH₵50/mo for candidates (premium)",
    effort: "Medium",
    hook: "A dedicated job board for early years / primary teachers in Ghana.",
    detail:
      "Schools post open roles (teacher, teaching assistant, admin, nanny, driver). Candidates browse free, apply free. Two revenue lines: schools pay per post (or bundle in Featured tier), candidates pay for premium features (job alerts, CV boost, save searches). Uses the same auth system already built. Zero new marketing needed — every school on EarlyDays sees the tab. Sits at /jobs on the public site + /school/[slug]/jobs in dashboard.",
    next: "Build /jobs public route + /school/[slug]/jobs manager. New Firestore collection: jobs. Fees + payment on top later.",
  },
  {
    id: "admissions-manager",
    title: "Admissions Manager (narrow SMS module)",
    tier: "T2 · Services",
    status: "idea",
    price: "GH₵500–2,000/mo per school",
    effort: "High",
    hook: "The one SMS module that solves a real chaotic pain.",
    detail:
      "Application form + document upload + applicant tracker + offer letters + MoMo deposit collection. Ties directly to your inbound leads. Sticky recurring revenue. Skip a full SMS build.",
    next: "Ship school websites first (bankrolls this). Then build.",
  },
  {
    id: "sms-reseller",
    title: "SMS reseller / integrator",
    tier: "T2 · Services",
    status: "idea",
    price: "20–30% margin on partner SMS licenses",
    effort: "Low",
    hook: "Don't build a School Management System. Resell one.",
    detail:
      "Partner with an existing GH-friendly SMS (RadixHub, Sallix, ClassSaver). You bring distribution, they bring product. Take a margin. Skip the crushing build cost + slow sales cycle.",
    next: "Reach out to 3 GH SMS providers to negotiate reseller terms.",
  },

  // ─── Tier 3 ────────────────────────────────────────────────
  {
    id: "diaspora-concierge",
    title: "Diaspora concierge (USD-priced)",
    tier: "T3 · Non-obvious",
    status: "idea",
    price: "$200–500 USD per family",
    effort: "Low",
    hook: "Ghanaians abroad relocating home need help picking a school.",
    detail:
      "Sell 'give us your requirements, we shortlist 3 + arrange tours'. USD revenue in a Cedi business. Low volume, huge margin. You already have the directory — this monetizes your expertise.",
    next: "Landing page /concierge with a form. Try one client. Iterate.",
  },
  {
    id: "application-marketplace",
    title: "Applications marketplace",
    tier: "T3 · Non-obvious",
    status: "idea",
    price: "2–3% transaction fee on deposits",
    effort: "Medium",
    hook: "Take a cut when a parent pays a school admission deposit through you.",
    detail:
      "Requires MoMo/Paystack integration (you have Paystack ✓). Compounds beautifully once volume exists. Requires trust with schools to be the intermediary.",
    next: "Wait until Admissions Manager module is live. Layer on top.",
  },
  {
    id: "uniforms",
    title: "Uniform & supplies commissions",
    tier: "T3 · Non-obvious",
    status: "idea",
    price: "10–15% commission per sale",
    effort: "Low",
    hook: "Partner with 2–3 uniform makers, parent buys through EarlyDays.",
    detail:
      "Ancillary but real. Parents already trust EarlyDays for the school choice — trusting them for the uniform is a short step.",
    next: "Approach 3 established GH uniform makers. Simple referral link at first.",
  },
  {
    id: "data-insights",
    title: "Data & insights for developers",
    tier: "T3 · Non-obvious",
    status: "idea",
    price: "GH₵5,000–20,000 per report",
    effort: "Medium",
    hook: "Real-estate developers pay to understand young-family catchments.",
    detail:
      "One-off market reports: 'Which Accra neighbourhoods are underserved for preschools? Growth trajectory? Fees?' No competition in Ghana. Sell to Devtraco, Real, Broll, etc.",
    next: "Once you have 60+ listings across all Accra areas, one pilot report.",
  },
  {
    id: "group-licensing",
    title: "PTA / church-school-group licensing",
    tier: "T3 · Non-obvious",
    status: "idea",
    price: "Multi-year contracts, GH₵50,000+ annual",
    effort: "High",
    hook: "Sell a private-labeled EarlyDays to Presby/Methodist/Catholic school networks.",
    detail:
      "Ghana has strong denominational school networks. A group-wide branded portal for their member schools. Long sales cycle but big anchor deals.",
    next: "After you have paying subscribers as proof, warm intro via a network head.",
  },
];

const STATUS_META: Record<
  Status,
  { label: string; dot: string; className: string; sort: number }
> = {
  live: {
    label: "Live",
    dot: "bg-emerald-400",
    className: "bg-emerald-500/15 text-emerald-400",
    sort: 0,
  },
  building: {
    label: "Building",
    dot: "bg-sky-400",
    className: "bg-sky-500/15 text-sky-400",
    sort: 1,
  },
  planned: {
    label: "Planned",
    dot: "bg-amber-400",
    className: "bg-amber-500/15 text-amber-400",
    sort: 2,
  },
  idea: {
    label: "Idea",
    dot: "bg-white/40",
    className: "bg-white/5 text-white/50",
    sort: 3,
  },
};

const EFFORT_META: Record<Play["effort"], string> = {
  Low: "text-emerald-400",
  Medium: "text-amber-400",
  High: "text-red-400",
};

export function MonetisationBoard() {
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [tier, setTier] = useState<"all" | Tier>("all");

  const grouped = useMemo(() => {
    const rows = PLAYS.filter(
      (p) =>
        (filter === "all" || p.status === filter) &&
        (tier === "all" || p.tier === tier)
    );
    const byTier: Record<string, Play[]> = {};
    for (const p of rows) {
      (byTier[p.tier] ??= []).push(p);
    }
    // Sort within each tier by status priority.
    for (const t of Object.keys(byTier)) {
      byTier[t].sort((a, b) => STATUS_META[a.status].sort - STATUS_META[b.status].sort);
    }
    return byTier;
  }, [filter, tier]);

  const counts = PLAYS.reduce(
    (acc, p) => {
      acc[p.status]++;
      acc.total++;
      return acc;
    },
    { live: 0, building: 0, planned: 0, idea: 0, total: 0 }
  );

  return (
    <>
      <header className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
          Roadmap
        </p>
        <h1 className="mt-1 font-display text-3xl md:text-4xl">Monetisation</h1>
        <p className="mt-1 text-sm text-white/60">
          Every revenue play, so you never forget. Status tracked by hand for now.
        </p>
      </header>

      {/* Summary strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        {(["live", "building", "planned", "idea"] as const).map((s) => (
          <div
            key={s}
            className="admin-card rounded-2xl border border-white/10 bg-white/[0.02] p-4"
          >
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/50">
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${STATUS_META[s].dot}`} />
              {STATUS_META[s].label}
            </p>
            <p className="mt-1 font-display text-2xl">{counts[s]}</p>
          </div>
        ))}
        <div className="admin-card rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
            Total plays
          </p>
          <p className="mt-1 font-display text-2xl">{counts.total}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
        <span className="mr-2 text-xs text-white/50">Status</span>
        {(["all", "live", "building", "planned", "idea"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs capitalize ${
              filter === f
                ? "bg-white text-black"
                : "border border-white/10 text-white/70 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="mx-2 h-4 w-px bg-white/10" />
        <span className="mr-2 text-xs text-white/50">Tier</span>
        {(["all", "T1 · Fastest cash", "T2 · Services", "T3 · Non-obvious"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTier(t)}
            className={`rounded-lg px-3 py-1.5 text-xs ${
              tier === t
                ? "bg-white text-black"
                : "border border-white/10 text-white/70 hover:text-white"
            }`}
          >
            {t === "all" ? "All" : t}
          </button>
        ))}
      </div>

      {/* Grouped list */}
      <div className="space-y-8">
        {(["T1 · Fastest cash", "T2 · Services", "T3 · Non-obvious"] as const).map((t) => {
          const rows = grouped[t];
          if (!rows || rows.length === 0) return null;
          return (
            <section key={t}>
              <h2 className="mb-3 flex items-baseline gap-3 font-display text-xl">
                <span>{t}</span>
                <span className="text-xs font-normal text-white/40">{rows.length} plays</span>
              </h2>
              <ul className="space-y-2">
                {rows.map((p) => (
                  <li
                    key={p.id}
                    className="admin-card rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-lg">{p.title}</h3>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${STATUS_META[p.status].className}`}
                          >
                            <span
                              className={`inline-block h-1.5 w-1.5 rounded-full ${STATUS_META[p.status].dot}`}
                            />
                            {STATUS_META[p.status].label}
                          </span>
                          <span className={`text-[10px] uppercase tracking-widest ${EFFORT_META[p.effort]}`}>
                            {p.effort} effort
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-white/85">{p.hook}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                          Pricing
                        </p>
                        <p className="mt-0.5 text-sm text-white/80">{p.price}</p>
                      </div>
                    </div>

                    <p className="mt-3 border-l-2 border-white/10 pl-3 text-sm text-white/60">
                      {p.detail}
                    </p>

                    {p.next && (
                      <p className="mt-3 flex items-start gap-2 text-sm">
                        <span className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                          Next
                        </span>
                        <span className="text-white/80">{p.next}</span>
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {Object.keys(grouped).length === 0 && (
          <div className="admin-card rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/40">
            No plays match those filters.
          </div>
        )}
      </div>

      <footer className="mt-10 border-t border-white/10 pt-4 text-xs text-white/40">
        Status is edited by hand in <code className="rounded bg-white/10 px-1">components/admin/MonetisationBoard.tsx</code>. Once we have &gt;20 plays or want history, move to a Firestore doc.
      </footer>
    </>
  );
}
