import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact EarlyDays",
  description: "Get in touch with the EarlyDays team.",
  alternates: { canonical: `${SITE.url}/contact` },
};

export default function Contact() {
  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <PageHeading
        eyebrow="Contact"
        title="Say hello."
        subtitle="Parents, schools and partners — we'd love to hear from you."
      />
      <form className="card mx-auto max-w-xl p-6 md:p-8">
        <div className="grid gap-4">
          <label className="grid gap-1 text-sm font-semibold">
            Name
            <input required className="rounded-xl border border-[color:var(--color-line)] px-3 py-2.5" />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Email
            <input required type="email" className="rounded-xl border border-[color:var(--color-line)] px-3 py-2.5" />
          </label>
          <label className="grid gap-1 text-sm font-semibold">
            Message
            <textarea rows={5} required className="rounded-xl border border-[color:var(--color-line)] px-3 py-2.5" />
          </label>
          <button className="btn btn-primary">Send</button>
        </div>
      </form>
    </div>
  );
}
