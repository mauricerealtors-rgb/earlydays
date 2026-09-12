import { adminDb } from "./firebase-admin";
import { allListings } from "./query";
import type { Listing } from "./types";

export interface AdminOverview {
  totals: {
    schools: number;
    claimed: number;
    pendingClaims: number;
    approvedSubscriptions: number;
    mrrGhs: number; // in cedis (not pesewas)
    viewsWeek: number;
    enquiriesWeek: number;
    viewsTotal: number;
    enquiriesTotal: number;
  };
  viewsSeries: { day: string; views: number; contacts: number }[]; // last 30 days
  topSchools: { slug: string; name: string; views: number; enquiries: number }[]; // by views last 7 days
  recentClaims: {
    id: string;
    slug: string;
    schoolName: string;
    submittedName: string;
    submittedEmail: string;
    status: string;
    createdAt: string;
  }[];
  recentEnquiries: {
    id: string;
    slug: string;
    schoolName: string;
    parentName: string;
    createdAt: string;
    read: boolean;
  }[];
}

const PLAN_MRR: Record<string, number> = {
  verified: 200,
  featured: 500,
};

/**
 * Assemble everything the /admin overview needs in one call. Safe fallback
 * to empty data if Firebase Admin isn't configured yet (first deploy).
 */
export async function getAdminOverview(): Promise<AdminOverview> {
  const listings = allListings();
  const listingBySlug = new Map(listings.map((l) => [l.slug, l]));

  const empty: AdminOverview = {
    totals: {
      schools: listings.length,
      claimed: 0,
      pendingClaims: 0,
      approvedSubscriptions: 0,
      mrrGhs: 0,
      viewsWeek: 0,
      enquiriesWeek: 0,
      viewsTotal: 0,
      enquiriesTotal: 0,
    },
    viewsSeries: buildLastNDays(30),
    topSchools: [],
    recentClaims: [],
    recentEnquiries: [],
  };

  try {
    const db = adminDb();
    const [
      ownersSnap,
      claimsSnap,
      subsSnap,
      statsSnap,
      enquiriesSnap,
    ] = await Promise.all([
      db.collection("listingOwners").get(),
      db.collection("claims").orderBy("createdAt", "desc").limit(20).get(),
      db.collection("subscriptions").where("status", "==", "active").get(),
      db.collection("stats").get(),
      db.collection("enquiries").orderBy("createdAt", "desc").limit(20).get(),
    ]);

    const claimed = ownersSnap.size;
    let pendingClaims = 0;
    claimsSnap.forEach((d) => {
      if (d.data().status === "pending") pendingClaims++;
    });

    let mrrGhs = 0;
    const paidTiers = new Map<string, string>();
    subsSnap.forEach((d) => {
      const data = d.data();
      const tier = data.tier ?? "free";
      const mrr = PLAN_MRR[tier] ?? 0;
      mrrGhs += mrr;
      paidTiers.set(data.slug ?? d.id, tier);
    });

    // Views series + week totals from stats.daily buckets.
    const viewsSeries = buildLastNDays(30);
    let viewsWeek = 0;
    let viewsTotal = 0;
    let enquiriesTotal = 0;
    const perSchoolWeekViews = new Map<string, number>();
    const perSchoolWeekEnq = new Map<string, number>();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().slice(0, 10);

    statsSnap.forEach((d) => {
      const data = d.data();
      const slug = data.slug ?? d.id;
      viewsTotal += Number(data.views ?? 0);
      enquiriesTotal += Number(data.enquiries ?? 0);
      const daily = (data.daily ?? {}) as Record<
        string,
        { views?: number; contacts?: number; enquiries?: number }
      >;
      for (const [day, entry] of Object.entries(daily)) {
        const seriesRow = viewsSeries.find((r) => r.day === day);
        if (seriesRow) {
          seriesRow.views += Number(entry.views ?? 0);
          seriesRow.contacts += Number(entry.contacts ?? 0);
        }
        if (day >= weekAgoStr) {
          viewsWeek += Number(entry.views ?? 0);
          perSchoolWeekViews.set(
            slug,
            (perSchoolWeekViews.get(slug) ?? 0) + Number(entry.views ?? 0)
          );
          perSchoolWeekEnq.set(
            slug,
            (perSchoolWeekEnq.get(slug) ?? 0) + Number(entry.enquiries ?? 0)
          );
        }
      }
    });

    const enquiriesWeek = Array.from(perSchoolWeekEnq.values()).reduce(
      (a, b) => a + b,
      0
    );

    const topSchools = Array.from(perSchoolWeekViews.entries())
      .map(([slug, views]) => ({
        slug,
        name: listingBySlug.get(slug)?.name ?? slug,
        views,
        enquiries: perSchoolWeekEnq.get(slug) ?? 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);

    const recentClaims = claimsSnap.docs.slice(0, 8).map((d) => {
      const data = d.data();
      return {
        id: d.id,
        slug: data.slug,
        schoolName: listingBySlug.get(data.slug)?.name ?? data.slug,
        submittedName: data.submittedName ?? "",
        submittedEmail: data.submittedEmail ?? "",
        status: data.status ?? "pending",
        createdAt: data.createdAt ?? "",
      };
    });

    const recentEnquiries = enquiriesSnap.docs.slice(0, 8).map((d) => {
      const data = d.data();
      return {
        id: d.id,
        slug: data.slug,
        schoolName: listingBySlug.get(data.slug)?.name ?? data.slug,
        parentName: data.parentName ?? "",
        createdAt: data.createdAt ?? "",
        read: Boolean(data.readAt),
      };
    });

    return {
      totals: {
        schools: listings.length,
        claimed,
        pendingClaims,
        approvedSubscriptions: subsSnap.size,
        mrrGhs,
        viewsWeek,
        enquiriesWeek,
        viewsTotal,
        enquiriesTotal,
      },
      viewsSeries,
      topSchools,
      recentClaims,
      recentEnquiries,
    };
  } catch {
    return empty;
  }
}

function buildLastNDays(n: number): { day: string; views: number; contacts: number }[] {
  const rows: { day: string; views: number; contacts: number }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    rows.push({ day: d.toISOString().slice(0, 10), views: 0, contacts: 0 });
  }
  return rows;
}

/**
 * All schools with joined stats/subscription/ownership rows for the CRM.
 */
export interface SchoolRow {
  slug: string;
  name: string;
  area: string;
  region: string;
  primaryCategory: string;
  claimed: boolean;
  tier: "free" | "verified" | "featured";
  subscriptionStatus?: "active" | "past-due" | "cancelled";
  views: number;
  enquiries: number;
  contactClicks: number;
  updatedAt?: string;
  hasImages: boolean;
  featured: boolean;
}

export async function getSchoolsCrm(): Promise<SchoolRow[]> {
  const listings = allListings();
  const rows: SchoolRow[] = listings.map((l) => baselineRow(l));

  try {
    const db = adminDb();
    const [ownersSnap, subsSnap, statsSnap] = await Promise.all([
      db.collection("listingOwners").get(),
      db.collection("subscriptions").get(),
      db.collection("stats").get(),
    ]);

    const owned = new Set<string>();
    ownersSnap.forEach((d) => owned.add(d.data().slug ?? d.id));

    const subMap = new Map<string, { tier: string; status: string }>();
    subsSnap.forEach((d) => {
      const data = d.data();
      subMap.set(data.slug ?? d.id, {
        tier: data.tier ?? "free",
        status: data.status ?? "active",
      });
    });

    const statsMap = new Map<
      string,
      { views: number; enquiries: number; contactClicks: number; updatedAt?: string }
    >();
    statsSnap.forEach((d) => {
      const data = d.data();
      statsMap.set(data.slug ?? d.id, {
        views: Number(data.views ?? 0),
        enquiries: Number(data.enquiries ?? 0),
        contactClicks:
          Number(data.calls ?? 0) +
          Number(data.whatsapps ?? 0) +
          Number(data.websiteClicks ?? 0) +
          Number(data.emails ?? 0),
        updatedAt: data.updatedAt,
      });
    });

    for (const row of rows) {
      row.claimed = row.claimed || owned.has(row.slug);
      const sub = subMap.get(row.slug);
      if (sub && sub.status === "active") {
        row.tier = (sub.tier === "featured" ? "featured" : sub.tier === "verified" ? "verified" : "free") as SchoolRow["tier"];
      }
      row.subscriptionStatus = sub?.status as SchoolRow["subscriptionStatus"];
      const st = statsMap.get(row.slug);
      if (st) {
        row.views = st.views;
        row.enquiries = st.enquiries;
        row.contactClicks = st.contactClicks;
        row.updatedAt = st.updatedAt;
      }
    }
  } catch {
    // Fall back to baseline rows only.
  }

  return rows;
}

function baselineRow(l: Listing): SchoolRow {
  return {
    slug: l.slug,
    name: l.name,
    area: l.neighbourhood,
    region: l.region,
    primaryCategory: l.listingTypes[0] ?? "school",
    claimed: l.claimed,
    tier: "free",
    views: 0,
    enquiries: 0,
    contactClicks: 0,
    hasImages: Boolean(l.images && l.images.length > 0),
    featured: Boolean(l.featured),
  };
}
