import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Your shortlist",
  description:
    "Save schools and learning centres to compare later, without creating an account.",
  alternates: { canonical: `${SITE.url}/saved` },
  robots: { index: false, follow: true },
};

export default function Saved() {
  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Saved" }]} />
      <PageHeading
        eyebrow="Your shortlist"
        title="Save schools as you browse."
        subtitle="Tap the save button on any school profile. you don't need an account to build a shortlist."
      />
      <div className="card-soft rounded-2xl bg-white p-6 text-center md:p-10">
        <p className="text-[color:var(--color-ink-mute)]">
          Your shortlist is empty. Browse{" "}
          <Link className="underline" href="/schools">
            schools
          </Link>{" "}
          or{" "}
          <Link className="underline" href="/preschools">
            preschools
          </Link>{" "}
          to add your first place.
        </p>
      </div>
    </div>
  );
}
