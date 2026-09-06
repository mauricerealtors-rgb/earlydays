import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms under which you may use EarlyDays.",
  alternates: { canonical: `${SITE.url}/terms` },
};

export default function Terms() {
  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms" }]} />
      <PageHeading eyebrow="Legal" title="Terms" />
      <div className="prose-content mx-auto max-w-2xl space-y-4 text-[color:var(--color-ink)]">
        <p>
          This is a placeholder terms notice while we complete our launch
          preparation. It will be replaced with our full terms before public
          launch.
        </p>
      </div>
    </div>
  );
}
