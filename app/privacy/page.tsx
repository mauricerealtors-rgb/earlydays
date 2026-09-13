import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How EarlyDays collects, uses and protects personal information.",
  alternates: { canonical: `${SITE.url}/privacy` },
};

export default function Privacy() {
  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Privacy" }]}
      />
      <PageHeading eyebrow="Legal" title="Privacy policy" />

      <div className="mx-auto max-w-2xl space-y-6 text-[15px] leading-relaxed text-[color:var(--color-navy-2)]">
        <p className="text-[13px] text-[color:var(--color-ink-mute)]">
          Last updated 13 September 2026.
        </p>

        <Section title="What we collect">
          <p>We only collect the information we need to run the service:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Parent enquiries:</strong> name, email, phone number,
              child's age or year group and any message you type. We use this
              to pass your enquiry to the school you contacted.
            </li>
            <li>
              <strong>Concierge applications:</strong> the details you fill in
              on <em>/concierge</em>, including your country, preferred
              areas, children's ages, timeframe and payment reference.
            </li>
            <li>
              <strong>School accounts:</strong> email address and password
              (managed by Firebase Authentication) plus any information a
              school representative adds to their profile.
            </li>
            <li>
              <strong>Basic analytics:</strong> pages visited, referrer, device
              type and city-level location. We do not collect precise location
              and we do not build advertising profiles.
            </li>
          </ul>
        </Section>

        <Section title="How we use it">
          <ul className="list-disc space-y-1 pl-5">
            <li>To route parent enquiries to the correct school.</li>
            <li>
              To respond to concierge, claim and support requests you send
              us.
            </li>
            <li>
              To improve the site &mdash; which areas parents search, which
              guides are read, which comparisons are shared.
            </li>
            <li>
              To detect abuse of the site, such as fake claims or spam
              enquiries.
            </li>
          </ul>
        </Section>

        <Section title="Who we share it with">
          <p>
            <strong>Schools:</strong> your enquiry details are shared with the
            approved owner of the school you enquire about. Nothing else.
          </p>
          <p>
            <strong>Service providers:</strong> we rely on Google Firebase
            (Auth and Firestore), Cloudinary (for school-uploaded photos),
            Paystack (for payments) and Vercel (for hosting). These providers
            process data on our behalf under their own privacy terms.
          </p>
          <p>
            We do not sell your personal information. We do not share your
            details with advertisers.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            EarlyDays uses a small number of essential cookies for signed-in
            school sessions and a first-party analytics cookie so we can see
            page-level traffic. We do not run third-party advertising cookies.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            Parent enquiries are retained for as long as the school account
            exists, so the school can respond and track its own leads.
            Concierge applications are retained for as long as we are working
            with you, plus 12 months for reference. Analytics data is retained
            for 26 months.
          </p>
          <p>
            You can ask us to delete your data at any time by emailing{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="text-[color:var(--color-sky-deep)] hover:underline"
            >
              {SITE.email}
            </a>
            . We will action the request within 30 days.
          </p>
        </Section>

        <Section title="Children's data">
          <p>
            EarlyDays is a directory used by parents and guardians. It is not
            directed at children. We do not knowingly collect data from
            children under 13. When a parent submits an enquiry for a child,
            we treat that data with the same protection as any other personal
            information.
          </p>
        </Section>

        <Section title="Security">
          <p>
            The site runs on HTTPS. Database access is protected by Firebase
            Security Rules. School accounts require a password managed by
            Firebase Authentication. Payments are processed by Paystack; card
            details never touch our servers.
          </p>
          <p>
            No online service is completely secure. If you notice something
            that could be a security issue, contact{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="text-[color:var(--color-sky-deep)] hover:underline"
            >
              {SITE.email}
            </a>{" "}
            immediately.
          </p>
        </Section>

        <Section title="Your rights">
          <p>You have the right to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>See a copy of the personal data we hold about you.</li>
            <li>Correct anything that is wrong or out of date.</li>
            <li>
              Ask us to delete your data, subject to legitimate reasons for us
              to keep it (such as fraud prevention).
            </li>
            <li>
              Withdraw consent for any optional processing at any time.
            </li>
          </ul>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy?{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="text-[color:var(--color-sky-deep)] hover:underline"
            >
              {SITE.email}
            </a>{" "}
            or DM{" "}
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
