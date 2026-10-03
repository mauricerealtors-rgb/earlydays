/**
 * CakesGhana data model.
 *
 * Deliberately not a copy of the EarlyDays Listing. A school is a fixed place a
 * parent visits; a cake is a commissioned object with a date, a serving count
 * and a budget. So the fields that matter here are lead time, delivery reach,
 * portfolio and a price floor — not opening hours and curriculum.
 *
 * Two conventions carried over from EarlyDays because they earned their place:
 * every vendor keeps its sourceUrls, and we never ship an image we cannot
 * attribute to the vendor's own work.
 */

/** What the cake is for. These are the pages people actually search for. */
export type Occasion =
  | "wedding"
  | "engagement"          // traditional marriage — a distinct Ghanaian occasion
  | "birthday"
  | "kids-birthday"
  | "baby-shower"
  | "naming-ceremony"     // outdooring
  | "graduation"
  | "anniversary"
  | "corporate"
  | "bridal-shower";

/** Product shape, which cuts across occasion. */
export type CakeKind =
  | "tiered-cake"
  | "sheet-cake"
  | "bento-cake"          // small single-serve, currently very popular
  | "number-cake"
  | "sculpted-cake"       // 3D / character
  | "cupcakes"
  | "cake-pops"
  | "dessert-table"
  | "pastries";

/** How it is finished — the vocabulary vendors themselves use. */
export type Style =
  | "fondant"
  | "buttercream"
  | "naked"
  | "drip"
  | "sugar-flowers"
  | "airbrush"
  | "edible-print"        // photo cakes
  | "hand-painted";

export type Flavour =
  | "vanilla"
  | "chocolate"
  | "red-velvet"
  | "carrot"
  | "fruit-cake"
  | "coconut"
  | "lemon"
  | "marble"
  | "strawberry"
  | "oreo"
  | "banana";

/** Dietary claims. Only recorded when the vendor states them. */
export type Dietary =
  | "eggless"
  | "vegan"
  | "halal"
  | "sugar-free"
  | "gluten-free"
  | "nut-free";

export type VendorService =
  | "Delivery"
  | "Setup on site"
  | "Cake stand hire"
  | "Tasting session"
  | "Pickup only"
  | "Same-day orders"
  | "Nationwide delivery";

/** Mirrors EarlyDays so the claim-then-call-then-activate flow transfers. */
export type VerificationStatus =
  | "unverified"
  | "info-confirmed"
  | "claimed"
  | "verified";

export type OrderStatus = "taking-orders" | "fully-booked" | "paused" | "unknown";

export interface Area {
  slug: string;           // "east-legon"
  name: string;           // "East Legon"
  region: string;         // "accra"
  regionName: string;     // "Greater Accra"
  blurb: string;
  intro?: string;
}

export interface VendorImage {
  url: string;
  alt: string;
  credit?: string;
  sourceUrl?: string;
  /**
   * True only when we traced the photo to the vendor's own site or account and
   * it depicts their own work. Never set this on a guess.
   */
  ownWork?: boolean;
  width?: number;
  height?: number;
}

/**
 * One row of a vendor's published price list.
 *
 * This is the most valuable field on the site. No Ghanaian directory publishes
 * cake prices at all — GhanaYello, BusinessGhana and GoAfricaOnline have no
 * price field, and the one wedding directory that shows ranges has no cake
 * category. Meanwhile "cake price list Ghana" is exactly what buyers search.
 *
 * `servesFrom`/`servesTo` are as important as the price. A documented Accra
 * complaint reads "ordered a cake of 8 people serving, we got a cake that can
 * serve maximum 2" — publishing servings next to the price is the direct answer
 * to it, and nobody else does it.
 *
 * Recorded only from a price the vendor themselves published or gave us.
 */
export interface PriceRow {
  label: string;            // '8" round, 2 layers'
  cedis: number;
  sizeInches?: number;
  layers?: number;
  tiers?: number;
  servesFrom?: number;
  servesTo?: number;
  note?: string;            // "elaborate designs quoted separately"
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  alternateNames?: string[];
  shortDescription: string;       // 1 sentence
  description: string;            // 1-2 honest paragraphs

  occasions: Occasion[];
  kinds: CakeKind[];
  styles: Style[];
  flavours: Flavour[];
  dietary: Dietary[];
  services: VendorService[];

  /** Where they are based. */
  address?: string;
  area: string;                   // Area.slug
  city: string;
  region: string;                 // Area.regionName
  country: "Ghana";

  /** Where they will deliver. Area slugs; empty means pickup only. */
  deliversTo?: string[];
  deliveryNote?: string;          // "GH₵50 within Accra, quoted beyond"

  /**
   * Prices, where the vendor publishes them.
   *
   * Hitched hides every price behind "Request pricing", because its revenue is
   * the lead and a visible price lets the couple go direct. We publish instead:
   * in Ghana the price is the unanswered question and the open SEO slot, and
   * several bakers already publish full grids on their own sites. A quote
   * request stays available for custom work, but it is not a paywall on a
   * number the baker already made public.
   *
   * priceFrom is the floor shown on cards. priceList is the full grid when we
   * have one. Both are vendor-stated only; never estimated.
   */
  priceFrom?: number;             // Ghana cedis, vendor-stated
  priceNote?: string;             // "from GH₵450 for a 6-inch single tier"
  priceList?: PriceRow[];
  priceListSourceUrl?: string;    // the page we read it from, for auditability
  priceListSeenAt?: string;       // ISO date — prices go stale, say when
  depositNote?: string;           // deposit policy, vendor-stated

  /** Minimum notice in days, vendor-stated. A top filter and a top complaint. */
  leadTimeDays?: number;
  leadTimeNote?: string;

  maxTiers?: number;
  servesUpTo?: number;

  phone?: string;
  phones?: string[];
  whatsapp?: string;              // the real contact channel in Ghana
  email?: string;
  website?: string;
  instagram?: string;             // handle, no @ — often the entire shopfront
  facebook?: string;
  tiktok?: string;
  hours?: string;

  orderStatus: OrderStatus;
  verification: VerificationStatus;
  claimed: boolean;

  /**
   * The date we last reached this baker on the number shown, and confirmed the
   * business is theirs.
   *
   * This is the single most defensible thing the site can offer. Ghana's Cyber
   * Security Authority recorded GH₵296,084 lost to fake food-vendor scams in
   * the first half of 2026, up from GH₵84,592 a year earlier, with fraudsters
   * editing real businesses' contact details on Google Maps and then taking
   * mobile-money prepayment. Google Maps is currently how most people find a
   * baker. "We called this number and reached this baker on this date" answers
   * a quantified, growing problem that no competitor addresses.
   *
   * Set only from an actual contact attempt. Never inferred.
   */
  contactVerifiedAt?: string;

  sourceUrls: string[];
  lastVerifiedAt?: string;
  updatedAt: string;

  imageQuery?: string;
  logoUrl?: string;
  images?: VendorImage[];
  featured?: boolean;
}

/**
 * A quote request. The product of the whole site: we do not publish prices, so
 * the enquiry is what vendors pay for and what we must be able to count.
 */
export interface QuoteRequest {
  id: string;
  vendorSlugs: string[];          // one request may go to a shortlist
  occasion?: Occasion;
  eventDate?: string;             // ISO
  servings?: number;
  budgetFrom?: number;
  budgetTo?: number;
  deliveryArea?: string;          // Area.slug
  details?: string;
  inspirationUrls?: string[];
  customerName: string;
  customerPhone: string;          // required: WhatsApp is how this gets answered
  customerEmail?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  vendorSlug: string;
  rating: number;                 // 1-5
  title?: string;
  body: string;
  occasion?: Occasion;
  authorName: string;
  /** Only true where we saw evidence of a real order. Shown on the review. */
  orderVerified?: boolean;
  createdAt: string;
  published: boolean;
}
