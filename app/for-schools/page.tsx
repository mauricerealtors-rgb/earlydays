import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "For schools. reach parents actively looking",
  description:
    "Claim your school's profile on EarlyDays, keep information up to date, and reach parents actively searching for a place for their child.",
  alternates: { canonical: `${SITE.url}/for-schools` },
};

export default function ForSchools() {
  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "For schools" }]} />
      <PageHeading
        eyebrow="For schools"
        title="Reach parents when they're actually looking."
        subtitle="EarlyDays is where Ghanaian parents come to find a place for their child. Claim your profile, keep it accurate, and let the right families discover you."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Free to claim",
            body: "Every legitimate school in Ghana can claim its profile at no cost. Keep contact details, ages, curriculum and services current.",
          },
          {
            title: "Qualified parent leads",
            body: "Parents send you targeted enquiries. with their child's age, preferred start date, and a message.",
          },
          {
            title: "Analytics that matter",
            body: "See which searches surfaced your school, how many parents viewed your profile, and which actions they took.",
          },
        ].map((b) => (
          <div key={b.title} className="card p-6">
            <h3 className="font-display text-xl">{b.title}</h3>
            <p className="mt-2 text-sm text-[color:var(--color-ink-mute)]">{b.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/claim" className="btn btn-primary">Claim your profile</Link>
        <Link href="/contact" className="btn btn-ghost">Talk to us</Link>
      </div>
    </div>
  );
}
