import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact EarlyDays",
  description:
    "Reach EarlyDays by email or Instagram. Parents, schools and partners are all welcome.",
  alternates: { canonical: `${SITE.url}/contact` },
};

export default function Contact() {
  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <PageHeading
        eyebrow="Contact"
        title="Say hello."
        subtitle="Parents, schools and partners. We would love to hear from you."
      />

      <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
        <div className="card p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
            Email
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-1 block font-display text-[20px] leading-tight text-[color:var(--color-navy)] hover:underline"
          >
            {SITE.email}
          </a>
          <p className="mt-2 text-[13px] text-[color:var(--color-ink-mute)]">
            Best for schools, partners and press. Reply within one working day.
          </p>
        </div>

        <div className="card p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
            Instagram
          </p>
          <a
            href={SITE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block font-display text-[20px] leading-tight text-[color:var(--color-navy)] hover:underline"
          >
            @{SITE.instagram}
          </a>
          <p className="mt-2 text-[13px] text-[color:var(--color-ink-mute)]">
            Best for parents, quick questions and school tips. DM us anytime.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-3xl grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-dashed border-[color:var(--color-line)] bg-white p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
            Are you a school?
          </p>
          <p className="mt-2 text-[14px] text-[color:var(--color-navy)]">
            Claim your free profile, or book a call to talk about a website and
            management system built for your school.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="/claim" className="btn btn-primary text-sm">
              Claim profile
            </a>
            <a href="/for-schools" className="btn btn-ghost text-sm">
              See plans
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-[color:var(--color-line)] bg-white p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
            Moving from abroad?
          </p>
          <p className="mt-2 text-[14px] text-[color:var(--color-navy)]">
            Our diaspora concierge shortlists Accra schools that fit your child
            and arranges the visits around your trip.
          </p>
          <div className="mt-4">
            <a href="/concierge" className="btn btn-pink text-sm">
              Start concierge
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
