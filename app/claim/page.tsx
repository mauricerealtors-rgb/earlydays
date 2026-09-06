import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Claim your school's profile",
  description:
    "Claim your school's EarlyDays profile so you can keep your information accurate and receive parent enquiries directly.",
  alternates: { canonical: `${SITE.url}/claim` },
};

export default function Claim() {
  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Claim a listing" }]} />
      <PageHeading
        eyebrow="Claim"
        title="Claim your school's profile"
        subtitle="Tell us who you are and which school you represent. We'll verify and grant editing access."
      />
      <form className="card mx-auto max-w-xl p-6 md:p-8">
        <div className="grid gap-4">
          <label className="grid gap-1 text-sm font-semibold">
            Your name
            <input required className="rounded-xl border border-[color:var(--color-line)] px-3 py-2.5" />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Your role at the school
            <input required placeholder="e.g. Head, Admissions" className="rounded-xl border border-[color:var(--color-line)] px-3 py-2.5" />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            School name
            <input required className="rounded-xl border border-[color:var(--color-line)] px-3 py-2.5" />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            School email (matching school domain if possible)
            <input required type="email" className="rounded-xl border border-[color:var(--color-line)] px-3 py-2.5" />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Phone or WhatsApp
            <input required className="rounded-xl border border-[color:var(--color-line)] px-3 py-2.5" />
          </label>
          <button className="btn btn-primary">Submit claim</button>
        </div>
      </form>
    </div>
  );
}
