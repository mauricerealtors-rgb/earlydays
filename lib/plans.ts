export type Tier = "free" | "verified" | "featured";

/**
 * Subscription plans — the one place prices live.
 *
 * Priced per month but charged for a year at a time, so the panel and the
 * Paystack call have to agree on both numbers. They used to be written out
 * separately in each file, which is how a price rise ends up charging the old
 * amount.
 */

export const BILLING_MONTHS = 12;

export interface Plan {
  tier: Tier;
  name: string;
  /** Headline price, per month. */
  monthly: number;
  features: string[];
  highlight?: boolean;
}

export const PLANS: Plan[] = [
  {
    tier: "free",
    name: "Free",
    monthly: 0,
    features: [
      "Editable profile (description, hours, contact)",
      "Up to 8 real photos",
      "Enquiries inbox",
      "Profile views and enquiry counts",
    ],
  },
  {
    tier: "verified",
    name: "Verified",
    monthly: 200,
    features: [
      "Everything in Free",
      "Verified badge on your profile",
      "Priority in area & category ordering",
      "Full analytics: contact clicks, channels and 14-day trends",
      "WhatsApp button unlocked",
    ],
    highlight: true,
  },
  {
    tier: "featured",
    name: "Featured",
    monthly: 500,
    features: [
      "Everything in Verified",
      "Featured slot on the EarlyDays homepage",
      "Priority response to new parent enquiries",
      "Sponsored placement in category pages (transparent)",
    ],
  },
];

export function findPlan(tier: Tier): Plan | undefined {
  return PLANS.find((p) => p.tier === tier);
}

/** What actually gets charged: twelve months up front. */
export function yearlyTotal(monthly: number): number {
  return monthly * BILLING_MONTHS;
}

/** Paystack takes pesewas, so the yearly total × 100. */
export function yearlyAmountPesewas(tier: Tier): number | null {
  const plan = findPlan(tier);
  if (!plan || plan.monthly <= 0) return null;
  return yearlyTotal(plan.monthly) * 100;
}

export const money = (n: number) => `GH₵${n.toLocaleString("en-GH")}`;

/**
 * Analytics beyond profile views and enquiries is a paid feature. Free
 * listings see those two and a blurred preview of the rest.
 */
export function hasFullAnalytics(tier: Tier): boolean {
  return tier === "verified" || tier === "featured";
}
