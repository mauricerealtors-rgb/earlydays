import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeading } from "@/components/PageHeading";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About EarlyDays",
  description:
    "EarlyDays is a parent-first directory for children's schools and learning centres in Ghana. We build honest, useful profiles that help families find the right fit.",
  alternates: { canonical: `${SITE.url}/about` },
};

export default function About() {
  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <PageHeading
        eyebrow="About"
        title="A parent-first directory for Ghanaian families."
        subtitle="We started EarlyDays because finding the right creche, preschool, KG or primary school for a child in Ghana is harder than it should be."
      />
      <div className="prose-content mx-auto max-w-2xl space-y-4 text-[17px] leading-relaxed text-[color:var(--color-ink)]">
        <p>
          Most existing directories were built for advertisers, not parents.
          We're building the opposite. a calm, honest place where families
          can search by area, age and programme, compare a few real options,
          and contact schools directly.
        </p>
        <p>
          Every profile shows its verification state. We never invent fees,
          curriculum, or contact details. If a school hasn't published
          something yet, we say so. clearly.
        </p>
        <p>
          EarlyDays is an independent directory. We are not a government
          body, not a regulator, and not a certification authority.
        </p>
      </div>
    </div>
  );
}
