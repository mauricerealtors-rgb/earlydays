import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "For schools — websites, admissions & management built for Ghana",
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
              Website, admissions, operations.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[color:var(--color-ink-mute)] md:text-[17px]">
            Every school in Ghana can claim a free profile on EarlyDays. When
            you're ready to look serious online — or to stop chasing fees on
            WhatsApp — we also build the websites and management system
            underneath.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="#pricing" className="btn btn-primary text-base">
              See plans →
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
              <span className="chip chip-leaf">Free · Forever</span>
              <h2 className="mt-3 font-display text-[24px] leading-tight md:text-[32px]">
                Start with your free EarlyDays profile.
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--color-ink-mute)] md:text-[15px]">
                Every legitimate school in Ghana can claim its EarlyDays
                profile at no cost. Keep contact details, ages, curriculum and
                photos current. Get direct enquiries from parents already
                searching for a place.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/claim" className="btn btn-primary text-sm">
                  Claim your profile
                </Link>
                <Link
                  href="/schools"
                  className="btn btn-ghost text-sm"
                >
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
                <Tick /> Photos & programmes
              </li>
              <li className="flex items-center gap-2">
                <Tick /> Basic analytics
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container-page mt-14 md:mt-20 scroll-mt-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="chip chip-sun">Websites & management</span>
          <h2 className="mt-3 font-display text-[26px] leading-tight md:text-[38px]">
            Three plans. Pick where you are today.
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--color-ink-mute)] md:text-[15px]">
            All plans include your EarlyDays profile, domain, hosting and
            SSL. Pricing in Ghana cedis, VAT exclusive.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <PlanCard
            name="Starter"
            tag="Informational"
            price="GH₵3,500"
            priceNote="one-time"
            recurring="No monthly fee for year 1"
            summary="A clean, mobile-friendly home for schools that just need to look credible online."
            features={[
              "Up to 3 pages (Home, About, Contact)",
              "Mobile-responsive design",
              "WhatsApp enquiry button",
              "Google Maps location",
              "Photo gallery (up to 10 photos)",
              "Custom domain + hosting (12 months)",
              "SSL certificate",
              "Google indexing setup",
              "Linked EarlyDays profile",
            ]}
            limits={[
              "No online admissions form",
              "No programme detail pages",
              "No content editor",
            ]}
            cta={{ label: "Get started", href: "/contact?plan=starter" }}
          />
          <PlanCard
            name="Professional"
            tag="Most popular"
            highlighted
            price="GH₵8,500"
            priceNote="setup"
            recurring="+ GH₵500/month hosting & support"
            summary="A proper school website: admissions online, programme pages, gallery, forms — the works."
            features={[
              "Everything in Starter, plus:",
              "Unlimited pages",
              "Online admissions form (enquiry → application)",
              "Programme / curriculum pages by age group",
              "Photo & video gallery",
              "News / blog section",
              "Google Analytics",
              "Advanced on-page SEO",
              "Self-serve content editor (no code)",
              "Featured EarlyDays profile",
              "Priority email support",
            ]}
            cta={{ label: "Start Professional", href: "/contact?plan=pro" }}
            preview={{
              label: "See a live preview →",
              href: "/for-schools/preview/minime-montessori-school",
            }}
          />
          <PlanCard
            name="Complete"
            tag="Website + Management"
            price="From GH₵15,000"
            priceNote="tailored to your school"
            recurring="Custom monthly · book a call"
            summary="Website plus a full digital system for children, admissions, attendance, fees and parent communication."
            features={[
              "Everything in Professional, plus:",
              "Child & parent records",
              "Admissions workflow (enquiry → offer → onboard)",
              "Attendance (daily check-in / check-out)",
              "Fees & invoicing (MoMo · card · bank · cash)",
              "Automatic receipts",
              "Staff accounts & roles",
              "Parent portal (fees, updates, receipts)",
              "SMS / WhatsApp notifications",
              "Admin dashboard & reports",
            ]}
            cta={{ label: "Book a call", href: "/contact?plan=complete" }}
          />
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-[12px] text-[color:var(--color-ink-mute)] md:text-[13px]">
          Not sure which plan fits? Start with your free EarlyDays profile.
          We'll help you upgrade only when the timing is right.
        </p>
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
              body="Your website plus an EarlyDays profile: parents find you on Google and on EarlyDays, then land on a site that actually converts."
            />
            <Benefit
              title="MoMo-first payments"
              body="We build for how Ghanaian parents actually pay. MoMo, bank and cash — receipts sent automatically. No chasing balances on WhatsApp."
            />
            <Benefit
              title="Ships in weeks, not months"
              body="Three templates you can start from, customised with your name, colours and photos. Professional plans typically go live in 3 to 5 weeks."
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
              title="Concept & scope"
              body="You get a written scope and a visual concept before you commit. Fixed price. No surprises."
            />
            <Step
              n={3}
              title="Build & review"
              body="We build against the scope. You review at two checkpoints. Feedback lands within 48 hours."
            />
            <Step
              n={4}
              title="Launch & train"
              body="Site goes live. We train your team on the CMS and (for Complete) the management system."
            />
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page mt-14 md:mt-24 mb-16 md:mb-24">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-navy)] p-8 text-center text-white md:p-12">
          <h2 className="font-display text-[26px] leading-tight text-white md:text-[36px]">
            Let's look at your school's online presence.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-relaxed text-white/80 md:text-[16px]">
            A short call, no pressure. We'll walk through where parents
            currently find your school, what's working and what's leaking, and
            which plan actually fits.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact?intent=schools-website"
              className="btn btn-pink text-base"
            >
              Book a discovery call
            </Link>
            <Link href="/claim" className="btn btn-ghost text-base">
              Or claim free profile
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PlanCard({
  name,
  tag,
  price,
  priceNote,
  recurring,
  summary,
  features,
  limits,
  cta,
  preview,
  highlighted,
}: {
  name: string;
  tag: string;
  price: string;
  priceNote: string;
  recurring: string;
  summary: string;
  features: string[];
  limits?: string[];
  cta: { label: string; href: string };
  preview?: { label: string; href: string };
  highlighted?: boolean;
}) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl border p-6 md:p-8 ${
        highlighted
          ? "border-[color:var(--color-pink-hot)] bg-white shadow-[0_20px_60px_rgba(236,30,122,0.12)] ring-1 ring-[color:var(--color-pink-hot)]/30"
          : "border-[color:var(--color-line)] bg-white"
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-6 rounded-full bg-[color:var(--color-pink-hot)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
          {tag}
        </span>
      )}
      {!highlighted && (
        <span className="mb-3 inline-flex w-fit items-center rounded-full bg-[color:var(--color-cream-deep)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-navy)]">
          {tag}
        </span>
      )}
      <h3 className="font-display text-[22px] leading-tight md:text-[26px]">
        {name}
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--color-ink-mute)]">
        {summary}
      </p>
      <div className="mt-5">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[28px] leading-none text-[color:var(--color-navy)] md:text-[32px]">
            {price}
          </span>
          <span className="text-[12px] text-[color:var(--color-ink-mute)]">
            {priceNote}
          </span>
        </div>
        <p className="mt-1 text-[12px] text-[color:var(--color-ink-mute)]">
          {recurring}
        </p>
      </div>
      <ul className="mt-6 space-y-2 text-[13px]">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Tick />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {limits && limits.length > 0 && (
        <ul className="mt-4 space-y-1.5 border-t border-dashed border-[color:var(--color-line)] pt-4 text-[12px] text-[color:var(--color-ink-mute)]">
          {limits.map((l) => (
            <li key={l} className="flex items-start gap-2">
              <span aria-hidden className="mt-0.5">·</span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex-1" />
      <Link
        href={cta.href}
        className={`btn text-sm ${highlighted ? "btn-pink" : "btn-primary"}`}
      >
        {cta.label}
      </Link>
      {preview && (
        <Link
          href={preview.href}
          className="mt-3 text-center text-[12px] font-semibold text-[color:var(--color-sky-deep)] hover:underline"
        >
          {preview.label}
        </Link>
      )}
    </div>
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
