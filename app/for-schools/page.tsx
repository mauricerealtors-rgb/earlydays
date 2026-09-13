import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ForSchoolsPricing } from "@/components/ForSchoolsPricing";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "For schools. Websites, admissions and management built for Ghana",
  description:
    "Claim your school profile on EarlyDays for free, or let us build the website and admin system that lets you stop chasing parents on WhatsApp.",
  alternates: { canonical: `${SITE.url}/for-schools` },
  openGraph: {
    title: "EarlyDays for schools",
    description:
      "Free directory profile. Professional websites. Full school management. Built for Ghanaian preschools and primaries.",
    type: "website",
    url: `${SITE.url}/for-schools`,
  },
};

export default function ForSchools() {
  return (
    <>
      {/* Hero */}
      <section className="container-page pt-8 md:pt-14">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "For schools" }]}
        />
        <div className="mx-auto mt-6 max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-sky-soft)] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-sky-deep)]">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-sky-deep)]" />
            For schools
          </span>
          <h1 className="mt-4 font-display text-[36px] leading-tight tracking-tight md:text-[56px]">
            The digital layer for your school.{" "}
            <span className="text-[color:var(--color-sky-deep)]">
              Website, admissions and operations.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[color:var(--color-ink-mute)] md:text-[17px]">
            Every school in Ghana can claim a free profile on EarlyDays. When
            you are ready to look more professional online, or to stop chasing
            fees on WhatsApp, we also build the website and the system that
            runs behind it.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="#pricing" className="btn btn-primary text-base">
              See plans
            </a>
            <Link href="/claim" className="btn btn-ghost text-base">
              Claim free profile
            </Link>
          </div>
        </div>
      </section>

      {/* Free tier callout */}
      <section className="container-page mt-14 md:mt-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[color:var(--color-line)] bg-white p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="chip chip-leaf">Free forever</span>
              <h2 className="mt-3 font-display text-[24px] leading-tight md:text-[32px]">
                Start with your free EarlyDays profile.
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--color-ink-mute)] md:text-[15px]">
                Every real school in Ghana can claim its EarlyDays profile at
                no cost. Keep your contact details, ages, curriculum and
                photos up to date. Receive enquiries from parents who are
                already looking for a place.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/claim" className="btn btn-primary text-sm">
                  Claim your profile
                </Link>
                <Link href="/schools" className="btn btn-ghost text-sm">
                  See how listings look
                </Link>
              </div>
            </div>
            <ul className="min-w-[200px] space-y-2 text-[13px] text-[color:var(--color-navy)]">
              <li className="flex items-center gap-2">
                <Tick /> Verified profile
              </li>
              <li className="flex items-center gap-2">
                <Tick /> Parent enquiries by email
              </li>
              <li className="flex items-center gap-2">
                <Tick /> Photos and programmes
              </li>
              <li className="flex items-center gap-2">
                <Tick /> Basic analytics
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="container-page mt-14 scroll-mt-20 md:mt-20"
      >
        <div className="mx-auto max-w-3xl text-center">
          <span className="chip chip-sun">Websites and management</span>
          <h2 className="mt-3 font-display text-[26px] leading-tight md:text-[38px]">
            Three plans. Pick where you are today.
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--color-ink-mute)] md:text-[15px]">
            All plans include your EarlyDays profile, your own domain, hosting
            and the secure padlock.
          </p>
        </div>
        <ForSchoolsPricing />
      </section>

      {/* Why it works */}
      <section className="container-page mt-14 md:mt-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 text-center">
            <span className="chip chip-sky">Why schools work with us</span>
            <h2 className="mt-2 font-display text-[24px] leading-tight md:text-[34px]">
              Built for Ghanaian schools, not template shops abroad.
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Benefit
              title="Parents already looking"
              body="Your website plus an EarlyDays profile. Parents find you on Google and on EarlyDays, then land on a site that actually turns them into enquiries."
            />
            <Benefit
              title="MoMo first"
              body="Built for how Ghanaian parents pay. MoMo, bank and cash. Receipts sent automatically. No more chasing balances on WhatsApp."
            />
            <Benefit
              title="Live in weeks"
              body="Three templates you can start from, customised with your name, colours and photos. Professional plans usually go live in 3 to 5 weeks."
            />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="container-page mt-14 md:mt-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 text-center">
            <span className="chip chip-leaf">How it works</span>
            <h2 className="mt-2 font-display text-[24px] leading-tight md:text-[34px]">
              Simple, honest process.
            </h2>
          </div>
          <ol className="grid gap-3 md:grid-cols-4">
            <Step
              n={1}
              title="Discovery call"
              body="30 minutes. We understand your school, your parents and what you actually need."
            />
            <Step
              n={2}
              title="Scope and concept"
              body="You get a written scope and a visual concept before you commit. Fixed price. No surprises."
            />
            <Step
              n={3}
              title="Build and review"
              body="We build against the scope. You review at two checkpoints. Your feedback lands within 48 hours."
            />
            <Step
              n={4}
              title="Launch and train"
              body="Your site goes live. We train your team on the website editor and on the management system if you took the Complete plan."
            />
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page mt-14 mb-16 md:mt-24 md:mb-24">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-navy)] p-8 text-center text-white md:p-12">
          <h2 className="font-display text-[26px] leading-tight text-white md:text-[36px]">
            Let us look at your school online.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-relaxed text-white/80 md:text-[16px]">
            A short call, no pressure. We look at where parents currently find
            your school, what is working and what is leaking, and which plan
            actually fits.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="#pricing" className="btn btn-pink text-base">
              Book a call
            </a>
            <Link href="/claim" className="btn btn-ghost text-base">
              Or claim free profile
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Benefit({ title, body }: { title: string; body: string }) {
  return (
    <div className="card p-5">
      <h3 className="font-display text-[17px] leading-tight md:text-[19px]">
        {title}
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[color:var(--color-ink-mute)]">
        {body}
      </p>
    </div>
  );
}

function Step({
  n,
  title,
  body,
}: {
  n: number;
  title: string;
  body: string;
}) {
  return (
    <li className="rounded-2xl border border-[color:var(--color-line)] bg-white p-5">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--color-sky-soft)] text-[13px] font-bold text-[color:var(--color-sky-deep)]">
        {n}
      </span>
      <h3 className="mt-3 font-display text-[16px] leading-tight md:text-[18px]">
        {title}
      </h3>
      <p className="mt-1.5 text-[12px] leading-relaxed text-[color:var(--color-ink-mute)] md:text-[13px]">
        {body}
      </p>
    </li>
  );
}

function Tick() {
  return (
    <svg
      aria-hidden
      className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-leaf)]"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M4 10.5l4 4 8-9"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
