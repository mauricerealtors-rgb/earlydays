import type { Metadata } from "next";
import { GUIDES } from "@/data/guides";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { GuidesFilter } from "@/components/GuidesFilter";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Parent guides. choosing schools in Ghana",
  description:
    "Honest, plain-English guides for Ghanaian parents choosing creches, preschools, KG, primary schools and children's learning centres.",
  alternates: { canonical: `${SITE.url}/guides` },
};

export default function GuidesIndex() {
  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
      <PageHeading
        eyebrow="Parent guides"
        title="Read before you visit"
        subtitle="Short, honest guides for the decisions that actually keep parents up at night."
      />
      <GuidesFilter guides={GUIDES} />
    </div>
  );
}
