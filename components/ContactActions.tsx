import type { Listing } from "@/lib/types";

export function ContactActions({ listing }: { listing: Listing }) {
  const hasPhone = Boolean(listing.phone);
  const hasWhatsapp = Boolean(listing.whatsapp);
  const hasWebsite = Boolean(listing.website);

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <a
        href="#enquire"
        className="btn btn-sun w-full"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 5h16v11H8l-4 4V5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        Request information
      </a>
      <button
        type="button"
        className="btn btn-primary w-full"
        aria-label="Save this school to your shortlist"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 3h12v18l-6-4-6 4V3Z" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        Save
      </button>
      {hasPhone ? (
        <a href={`tel:${listing.phone}`} className="btn btn-ghost w-full">
          Call {listing.phone}
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="btn btn-ghost w-full opacity-60"
          title="This school hasn't published a phone number yet."
        >
          Phone not published
        </button>
      )}
      {hasWhatsapp ? (
        <a
          href={`https://wa.me/${listing.whatsapp?.replace(/[^\d]/g, "")}`}
          className="btn btn-ghost w-full"
        >
          WhatsApp
        </a>
      ) : hasWebsite ? (
        <a
          href={listing.website}
          rel="nofollow noopener"
          target="_blank"
          className="btn btn-ghost w-full"
        >
          Visit website
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="btn btn-ghost w-full opacity-60"
          title="No public contact channel available yet."
        >
          Contact not published
        </button>
      )}
    </div>
  );
}
