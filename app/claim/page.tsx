import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  ClaimSchoolPicker,
  type SchoolIndexEntry,
} from "@/components/ClaimSchoolPicker";
import { allListings } from "@/lib/query";
import { findLocation } from "@/data/locations";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Claim your school's profile",
  description:
    "Find your school on EarlyDays and take the page over: your own photographs, your fees, and every parent enquiry coming straight to you.",
  alternates: { canonical: `${SITE.url}/claim` },
};

export default function Claim() {
  // Name, area and slug only. The whole index is about 12KB, which is cheaper
  // than a round trip per keystroke and works with the connection dropping.
  const schools: SchoolIndexEntry[] = allListings()
    .map((l) => ({
      slug: l.slug,
      name: l.name,
      area: findLocation(l.neighbourhood)?.name ?? l.neighbourhood,
      region: l.region,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container-page pt-8 md:pt-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Claim a listing" }]}
      />

      <div className="mx-auto mb-8 max-w-2xl">
        <span className="chip chip-sun">Claim</span>
        <h1 className="mt-3 font-display text-[32px] leading-tight md:text-[46px]">
          Find your school and <span className="marker">take the page over</span>.
        </h1>
        <p className="mt-3 text-[17px] leading-relaxed text-[color:var(--color-text-body)]">
          Your school is almost certainly on EarlyDays already, and parents can
          already find it. Claiming is how it becomes yours: your words, your
          photographs, your fees, and every enquiry landing with you instead of
          nowhere.
        </p>
      </div>

      <ClaimSchoolPicker schools={schools} />

      <div className="mx-auto mt-8 max-w-2xl pb-16">
        <div className="rounded-2xl border-2 border-[color:var(--color-ink)] bg-[color:var(--color-cream)] p-5 md:p-6">
          <h2 className="font-display text-[18px] leading-tight md:text-[20px]">
            How claiming works
          </h2>
          <ol className="mt-4 space-y-4">
            <Step n={1} title="Pick your school and tell us who you are">
              Your name, your role, and a number we can reach you on. No
              password to invent today, and no account needed yet.
            </Step>
            <Step n={2} title="We ring the school, not you">
              Within one working day we call the school&rsquo;s own line and ask
              for you by name. That call is how we know the page goes to the
              right person, and why nobody can take it from you later.
            </Step>
            <Step n={3} title="Your account opens">
              We email your login, you set your own password, and you can edit
              the profile, add photographs and start taking enquiries the same
              day.
            </Step>
          </ol>
          <p className="mt-5 border-t-2 border-dashed border-[color:var(--color-line)] pt-4 text-[14px] leading-relaxed text-[color:var(--color-text-body)]">
            <strong className="font-bold text-[color:var(--color-ink)]">
              Being listed is free and stays free.
            </strong>{" "}
            Managing the page yourself is a yearly plan. We show you what the
            year costs once you have picked your school and filled the form, so
            you see the figure before you have paid anything or committed to
            anything.
          </p>
        </div>
      </div>
    </div>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-[color:var(--color-ink)] bg-[color:var(--color-sun)] font-display text-[13px] text-[color:var(--color-ink)]">
        {n}
      </span>
      <div className="min-w-0">
        <p className="font-display text-[15px] leading-tight md:text-[16px]">
          {title}
        </p>
        <p className="mt-1 text-[14px] leading-relaxed text-[color:var(--color-text-body)]">
          {children}
        </p>
      </div>
    </li>
  );
}
