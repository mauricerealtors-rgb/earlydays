import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms under which you may use EarlyDays.",
  alternates: { canonical: `${SITE.url}/terms` },
};

export default function Terms() {
  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Terms" }]}
      />
      <PageHeading eyebrow="Legal" title="Terms of use" />

      <div className="mx-auto max-w-2xl space-y-6 text-[15px] leading-relaxed text-[color:var(--color-navy-2)]">
        <p className="text-[13px] text-[color:var(--color-ink-mute)]">
          Last updated 13 September 2026.
        </p>

        <Section title="Who we are">
          <p>
            EarlyDays is an independent parent-facing directory of creches,
            preschools, kindergartens, primary schools and children's learning
            centres in Ghana. It is operated by the EarlyDays team and reached
            at{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="text-[color:var(--color-sky-deep)] hover:underline"
            >
              {SITE.email}
            </a>{" "}
            or on Instagram{" "}
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--color-sky-deep)] hover:underline"
            >
              @{SITE.instagram}
            </a>
            .
          </p>
          <p>
            EarlyDays is not a government body, regulator, or accreditor of any
            school. Listing on EarlyDays is not an endorsement, and absence
            from EarlyDays is not a criticism.
          </p>
        </Section>

        <Section title="How you may use EarlyDays">
          <p>By using the site, you agree to the following:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>You will use the site for personal, non-commercial purposes.</li>
            <li>
              You will not scrape or bulk-copy listings, guides or comparisons
              for republication.
            </li>
            <li>
              You will not use the site to send unsolicited communications to
              schools or parents.
            </li>
            <li>
              You will not misrepresent yourself when claiming a school profile
              or submitting an enquiry.
            </li>
          </ul>
        </Section>

        <Section title="Accuracy of listings">
          <p>
            Every listing on EarlyDays is either sourced from the school's own
            publicly available materials (marked <em>Info confirmed</em>) or
            claimed and verified by the school itself (marked <em>Claimed</em>{" "}
            or <em>Verified</em>). We do not invent information. Where a
            school has not published a detail such as fees, curriculum or
            hours, we leave that field blank.
          </p>
          <p>
            Details can still change. Fees, admissions windows, curriculum and
            contact information should always be confirmed with the school
            directly before enrolling.
          </p>
        </Section>

        <Section title="Enquiries and Concierge">
          <p>
            When you send an enquiry to a school through EarlyDays, we pass
            your details to that school's owner or their approved
            representative so they can respond to you. We do not sell or share
            enquiries with third parties.
          </p>
          <p>
            The EarlyDays Diaspora Concierge is a separate, paid service.
            Concierge fees are shown before you complete the form and are
            payable upfront. If we cannot deliver the agreed shortlist within
            the agreed timeframe, we will refund the fee.
          </p>
        </Section>

        <Section title="School accounts and website plans">
          <p>
            A school can claim its free EarlyDays profile at any time from the{" "}
            <Link
              href="/claim"
              className="text-[color:var(--color-sky-deep)] hover:underline"
            >
              claim
            </Link>{" "}
            page. Paid website and management plans are described on the{" "}
            <Link
              href="/for-schools"
              className="text-[color:var(--color-sky-deep)] hover:underline"
            >
              for-schools
            </Link>{" "}
            page. Fees, deliverables and timelines for those plans are agreed
            in writing before work starts.
          </p>
        </Section>

        <Section title="Content and attribution">
          <p>
            Text, guides, area descriptions and comparison tables on EarlyDays
            are our copyright. Photos remain the copyright of their original
            creators and are used with attribution to the source school or
            photographer as noted on each listing.
          </p>
          <p>
            If you are the owner of any content that appears on EarlyDays and
            would like it removed or corrected, contact us at{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="text-[color:var(--color-sky-deep)] hover:underline"
            >
              {SITE.email}
            </a>{" "}
            and we will respond within one working day.
          </p>
        </Section>

        <Section title="No warranty">
          <p>
            The site is provided as-is. Information is offered in good faith
            but without warranty. EarlyDays is not liable for decisions made
            based on directory content, or for any dispute between a parent
            and a school.
          </p>
        </Section>

        <Section title="Changes to these terms">
          <p>
            We may update these terms as the product evolves. When we do, we
            will change the &ldquo;last updated&rdquo; date at the top. Continued use of
            the site after a change means you accept the new terms.
          </p>
        </Section>

        <Section title="Governing law">
          <p>
            These terms are governed by the laws of the Republic of Ghana.
            Any dispute is subject to the exclusive jurisdiction of the Ghanaian
            courts.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-[20px] leading-tight text-[color:var(--color-navy)] md:text-[24px]">
        {title}
      </h2>
      <div className="mt-2 space-y-2">{children}</div>
    </section>
  );
}
