import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Compare schools",
  description: "Compare up to 4 schools side by side — location, ages, curriculum, services and contact.",
  alternates: { canonical: `${SITE.url}/compare` },
  robots: { index: false, follow: true },
};

export default function Compare() {
  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare" }]} />
      <PageHeading
        eyebrow="Compare"
        title="Compare schools side by side."
        subtitle="Add up to 4 schools to compare programmes, ages, curriculum, services and contact — all in one view."
      />
      <div className="card-soft rounded-2xl bg-white p-6 md:p-10">
        <p className="text-[color:var(--color-ink-mute)]">
          You haven't added any schools yet.{" "}
          <Link href="/schools" className="underline">Start browsing</Link>{" "}
          and use the compare button on a school card.
        </p>
      </div>
    </div>
  );
}
