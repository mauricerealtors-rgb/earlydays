import type { Listing } from "./types";
import { SITE } from "./site";
import { findLocation } from "@/data/locations";
import { findCategoryByType } from "@/data/categories";

/**
 * Build an ItemList JSON-LD block for a collection page (category, area,
 * or category+area). Google treats these as ranked curated lists — a
 * strong signal for both the SERP list result and AI-mode citation.
 */
export function itemListJsonLd(
  listings: Listing[],
  name: string,
  url: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}#itemlist`,
    name,
    url,
    numberOfItems: listings.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: listings.map((l, i) => {
      const loc = findLocation(l.neighbourhood);
      return {
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE.url}/schools/${l.slug}`,
        name: l.name,
        item: {
          "@type": educationalTypeFor(l),
          "@id": `${SITE.url}/schools/${l.slug}`,
          name: l.name,
          description: l.shortDescription,
          url: `${SITE.url}/schools/${l.slug}`,
          image: l.images?.[0]?.url,
          address: {
            "@type": "PostalAddress",
            streetAddress: l.address,
            addressLocality: loc?.name ?? l.neighbourhood,
            addressRegion: l.region,
            addressCountry: "GH",
          },
          telephone: l.phone,
        },
      };
    }),
  };
}

/**
 * Pick the most specific EducationalOrganization subtype for a listing.
 * Google recommends the most specific applicable subtype (guide §19).
 */
export function educationalTypeFor(listing: Listing): string {
  if (listing.listingTypes.includes("preschool")) return "Preschool";
  if (listing.listingTypes.includes("kindergarten")) return "Preschool";
  if (listing.listingTypes.includes("primary")) return "ElementarySchool";
  if (listing.listingTypes.includes("creche")) return "ChildCare";
  if (listing.listingTypes.includes("language-centre")) return "EducationalOrganization";
  return "EducationalOrganization";
}

/**
 * Build a FAQPage entity from question/answer pairs. Only include
 * questions we can answer honestly from real data.
 */
export function faqJsonLd(qs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qs.map((q) => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: { "@type": "Answer", text: q.a },
    })),
  };
}

/** Course schema for a language-centre programme. */
export function courseJsonLd(listing: Listing) {
  const loc = findLocation(listing.neighbourhood);
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: listing.name,
    description: listing.shortDescription,
    provider: {
      "@type": "Organization",
      name: listing.name,
      url: listing.website,
    },
    inLanguage: listing.curriculum.includes("Bilingual (French–English)")
      ? ["fr", "en"]
      : "en",
    educationalLevel:
      listing.ageBlurb || "Early years and children",
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: listing.services.includes("Weekend programmes")
        ? "onsite"
        : "onsite",
      location: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: loc?.name ?? listing.neighbourhood,
          addressRegion: listing.region,
          addressCountry: "GH",
        },
      },
    },
  };
}
