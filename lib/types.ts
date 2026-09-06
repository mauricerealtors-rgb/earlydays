export type ListingType =
  | "creche"
  | "preschool"
  | "kindergarten"
  | "primary"
  | "learning-centre"
  | "language-centre"
  | "montessori"
  | "stem"
  | "activity-centre";

export type Curriculum =
  | "EYFS"
  | "Montessori"
  | "Ghana Education Service"
  | "British"
  | "Cambridge"
  | "International"
  | "Reggio Emilia"
  | "Play-based"
  | "Bilingual (French–English)";

export type Service =
  | "Daycare"
  | "Full day"
  | "Half day"
  | "After school"
  | "Meals"
  | "Transport"
  | "Outdoor play"
  | "Extracurriculars"
  | "Weekend programmes"
  | "Holiday programmes";

export type VerificationStatus =
  | "unverified"
  | "info-confirmed"
  | "claimed"
  | "verified";

export type AdmissionsStatus =
  | "open"
  | "waitlist"
  | "closed"
  | "unknown";

export interface Location {
  slug: string;                  // "east-legon"
  name: string;                  // "East Legon"
  region: string;                // "accra"
  regionName: string;            // "Greater Accra"
  parent?: string;               // optional parent area
  blurb: string;                 // 1-2 sentences of neutral context
}

export interface Category {
  slug: string;                  // "preschools"
  singular: string;              // "Preschool"
  plural: string;                // "Preschools"
  listingType: ListingType;
  short: string;                 // for cards
  blurb: string;                 // for category pages
  accent: "sky" | "leaf" | "sun" | "coral" | "blossom";
}

export interface ListingImage {
  url: string;                 // direct image URL
  alt: string;                 // descriptive alt text
  credit?: string;             // "Photo: <school>" — always attribute
  sourceUrl?: string;          // where we sourced it (for auditability)
  width?: number;
  height?: number;
}

export interface Listing {
  id: string;
  slug: string;
  name: string;
  alternateNames?: string[];
  shortDescription: string;      // 1 sentence
  description: string;           // 1–2 paragraphs, honest
  listingTypes: ListingType[];
  ageMin?: number;               // months, if known
  ageMax?: number;               // months, if known
  ageBlurb: string;              // human label e.g. "3 months – 6 years"
  curriculum: Curriculum[];
  services: Service[];
  address?: string;
  neighbourhood: string;         // location.slug
  city: string;                  // location.region
  region: string;                // regionName
  country: "Ghana";
  phone?: string;
  phones?: string[];               // additional numbers if listed
  whatsapp?: string;
  email?: string;
  website?: string;
  hours?: string;                  // human-readable, school-reported
  feesHint?: string;               // "from GH₵600 per term" — school-reported only
  admissions: AdmissionsStatus;
  verification: VerificationStatus;
  claimed: boolean;
  sourceUrls: string[];          // where the info came from
  lastVerifiedAt?: string;       // ISO date
  updatedAt: string;             // ISO date
  imageQuery?: string;           // seed alt hint (no fake images shipped)
  images?: ListingImage[];       // only real, sourced images — never fabricated
  featured?: boolean;
}
