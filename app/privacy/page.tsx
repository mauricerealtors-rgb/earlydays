import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How EarlyDays handles personal information.",
  alternates: { canonical: `${SITE.url}/privacy` },
};

export default function Privacy() {
  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />
      <PageHeading eyebrow="Legal" title="Privacy" />
      <div className="prose-content mx-auto max-w-2xl space-y-4 text-[color:var(--color-ink)]">
        <p>
          This is a placeholder privacy notice while we complete our launch
          preparation. It will be replaced with our full policy before
          collecting parent enquiries at scale.
        </p>
      </div>
    </div>
  );
}
