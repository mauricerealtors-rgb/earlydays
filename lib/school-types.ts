/**
 * Firestore data-model types for the school-side (claim + dashboard + subscriptions).
 * These mirror the collections defined in firestore.rules.
 */

export type ClaimStatus = "pending" | "approved" | "rejected";

export interface Claim {
  id: string;
  slug: string;                     // listing slug being claimed
  uid: string;                      // Firebase Auth uid of the submitter
  submittedName: string;
  submittedRole: string;            // "Head", "Owner", "Admissions Officer", etc.
  submittedEmail: string;
  submittedPhone?: string;
  proofUrl?: string;                // optional evidence link (school website, LinkedIn)
  status: ClaimStatus;
  createdAt: string;                // ISO
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface ListingOwner {
  slug: string;
  uid: string;                      // owning school user's uid
  approvedAt: string;
  approvedBy: string;
}

/**
 * The editable subset of a listing. All fields optional — an override document
 * only stores what the school has actually changed. Anything left blank falls
 * back to the TS baseline via mergeListing().
 */
export interface ListingOverride {
  shortDescription?: string;
  description?: string;
  phone?: string;
  phones?: string[];
  whatsapp?: string;
  email?: string;
  website?: string;
  hours?: string;
  feesHint?: string;
  admissions?: "open" | "waitlist" | "closed" | "unknown";
  address?: string;
  photos?: ListingOverridePhoto[];
  updatedAt: string;
  updatedBy: string;                // uid
}

export interface ListingOverridePhoto {
  url: string;
  alt: string;
  sortOrder: number;
  uploadedAt: string;
}

export type SubscriptionTier = "free" | "verified" | "featured";

export interface Subscription {
  slug: string;
  tier: SubscriptionTier;
  paystackReference?: string;
  paystackCustomerCode?: string;
  paystackSubscriptionCode?: string;
  startedAt?: string;
  expiresAt?: string;               // ISO — when the current paid period ends
  status: "active" | "past-due" | "cancelled";
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  slug: string;
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  message: string;
  createdAt: string;
  readAt?: string;
}
