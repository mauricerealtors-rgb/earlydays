import type { Metadata } from "next";
import Link from "next/link";
import { ConciergeApplication } from "@/components/ConciergeApplication";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Diaspora concierge — we shortlist your child's Accra school",
  description:
    "Moving your family to Ghana? Our concierge shortlists Accra schools that actually match your child and arranges the tours. Fits a Detty December visit.",
  alternates: { canonical: `${SITE.url}/concierge` },
  openGraph: {
    title: "EarlyDays Diaspora Concierge",
    description:
      "We shortlist Accra schools that match your child and arrange the tours.",
    type: "website",
    url: `${SITE.url}/concierge`,
  },
};

export default function ConciergePage() {
  return (
    <>
      {/* Hero */}
      <section className="container-page pt-8 md:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-blossom-soft)] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-pink-hot-deep)]">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-pink-hot)]" />
            Diaspora concierge
          </span>
          <h1 className="mt-4 font-display text-[36px] leading-tight tracking-tight md:text-[56px]">
            Moving the family to Accra? <br className="hidden md:block" />
            <span className="text-[color:var(--color-pink-hot)]">We'll shortlist the school for you.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-[color:var(--color-ink-mute)] md:text-[17px]">
            Tell us about your child, your budget and when you're coming.
            Within a few days we come back with a shortlist that actually
            fits, and we arrange the tours. Transparent pricing shown as you go. No hidden fees.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="#apply" className="btn btn-pink text-base">
              Start my shortlist →
            </a>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[color:var(--color-navy)] shadow-sm">
              From $200 · Pay after we deliver
            </span>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="container-page mt-14 md:mt-20">
        <div className="mx-auto grid max-w-4xl gap-3 md:grid-cols-3">
          <Persona
            title="Detty December visitors"
            body="You're back for the holidays and want to leave with a school picked. We fit 3 real school visits into your existing trip."
            accent="pink"
          />
          <Persona
            title="Diaspora relocating"
            body="UK, US, Canada, Nigeria, UAE. You've decided to move. We handle the school choice so you can focus on housing and logistics."
            accent="sky"
          />
          <Persona
            title="First-time in Accra"
            body="You don't know East Legon from Airport Residential. We match your child to the right area and school, not just what sounds fancy."
            accent="leaf"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="container-page mt-14 md:mt-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 text-center">
            <span className="chip chip-sky">How it works</span>
            <h2 className="mt-2 font-display text-[26px] leading-tight md:text-[36px]">
              Three steps. Then you visit.
            </h2>
          </div>
          <ol className="grid gap-3 md:grid-cols-3">
            <Step
              n="01"
              title="You tell us"
              body="Fill in the form below. About 90 seconds. Kids, timeframe, budget, what matters."
              accent="pink"
            />
            <Step
              n="02"
              title="We shortlist"
              body="Within a few days we send you 3 schools, honest notes on each, and next steps."
              accent="sky"
            />
            <Step
              n="03"
              title="We arrange tours"
              body="Book the visits, chase the schools, hand you a clean itinerary. You just turn up."
              accent="leaf"
            />
          </ol>
        </div>
      </section>

      {/* Trust strip */}
      <section className="container-page mt-14 md:mt-20">
        <div className="mx-auto grid max-w-4xl gap-2 rounded-3xl bg-[color:var(--color-cream)] p-6 md:grid-cols-3 md:p-8">
          <Trust title="Real Ghana schools" body="We only recommend from our directory of verified, cross-checked schools." />
          <Trust title="No pay-to-play" body="Schools can't buy a slot on your shortlist. We work for you." />
          <Trust title="One flat fee" body="No hidden commission from schools. What you pay us is what it costs." />
        </div>
      </section>

      {/* Form */}
      <section id="apply" className="container-page mt-14 pb-24 md:mt-20 scroll-mt-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 text-center">
            <span className="chip chip-blossom">Apply now</span>
            <h2 className="mt-2 font-display text-[26px] leading-tight md:text-[34px]">
              Start your shortlist. See your fee instantly.
            </h2>
            <p className="mt-2 text-sm text-[color:var(--color-ink-mute)]">
              Takes about 90 seconds. Price updates as you go.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,42,74,0.08)] md:p-10">
            <ConciergeApplication />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page pb-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 font-display text-2xl">Common questions</h2>
          <Faq q="How much does it cost?">
            The base fee starts at $200 for one child (3-school shortlist) and
            scales with the number of children plus how deep a shortlist you
            want (3, 5 or 7 schools). You'll see a live estimate as you fill
            in the form, and the final quoted price on the confirmation page
            before we start. School fees themselves are paid directly to the school.
          </Faq>
          <Faq q="How quickly do you respond?">
            We reply within one working day. Full shortlist within 3–5 working
            days, or faster if you're on a tight window (like a December visit).
          </Faq>
          <Faq q="Do you take a commission from the schools?">
            No. That's the whole point. Schools can't pay to be on your
            shortlist, which is why we can be honest with you about which one
            is actually the right fit.
          </Faq>
          <Faq q="What if I can't visit the schools in person?">
            Most schools will do a video walkthrough or a live tour on
            WhatsApp. We arrange that too. Some parents pick and enrol
            entirely remotely.
          </Faq>
          <Faq q="Do you cover schools outside Accra?">
            Right now we're strongest in Greater Accra. Tema, Kumasi and
            Takoradi are on the roadmap. If your target isn't Accra, mention
            it in the form and we'll tell you honestly if we can help.
          </Faq>
        </div>
      </section>
    </>
  );
}

function Persona({
  title,
  body,
  accent,
}: {
  title: string;
  body: string;
  accent: "pink" | "sky" | "leaf";
}) {
  const bg: Record<string, string> = {
    pink: "linear-gradient(160deg,#FFE4EF,#ffffff 65%)",
    sky: "linear-gradient(160deg,#E4F1FF,#ffffff 65%)",
    leaf: "linear-gradient(160deg,#EAF6E5,#ffffff 65%)",
  };
  return (
    <div
      className="rounded-2xl border border-[color:var(--color-line-2)] p-5"
      style={{ background: bg[accent] }}
    >
      <p className="font-display text-lg text-[color:var(--color-navy)]">{title}</p>
      <p className="mt-2 text-sm text-[color:var(--color-ink-mute)]">{body}</p>
    </div>
  );
}

function Step({
  n,
  title,
  body,
  accent,
}: {
  n: string;
  title: string;
  body: string;
  accent: "pink" | "sky" | "leaf";
}) {
  const color: Record<string, string> = {
    pink: "var(--color-pink-hot)",
    sky: "var(--color-sky-deep)",
    leaf: "#2F7C25",
  };
  return (
    <li className="rounded-3xl border border-[color:var(--color-line-2)] bg-white p-6 text-center">
      <span
        className="inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-xs font-black uppercase tracking-widest text-white"
        style={{ background: color[accent] }}
      >
        {n}
      </span>
      <h3 className="mt-3 font-display text-xl leading-tight">{title}</h3>
      <p className="mt-2 text-sm text-[color:var(--color-ink-mute)]">{body}</p>
    </li>
  );
}

function Trust({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="font-display text-base text-[color:var(--color-navy)]">{title}</p>
      <p className="mt-1 text-xs text-[color:var(--color-ink-mute)]">{body}</p>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-[color:var(--color-line-2)] py-4 last:border-none">
      <summary className="cursor-pointer list-none font-semibold text-[color:var(--color-navy)]">
        <span className="mr-2 text-[color:var(--color-pink-hot)] group-open:hidden">＋</span>
        <span className="mr-2 hidden text-[color:var(--color-pink-hot)] group-open:inline">−</span>
        {q}
      </summary>
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-ink)]">
        {children}
      </p>
    </details>
  );
}
