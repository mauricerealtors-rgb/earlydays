import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { BookCallButton } from "@/components/for-schools/BookCall";
import {
  BeforeAfterMock,
  ProfileMock,
  SearchMock,
} from "@/components/for-schools/Mocks";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "For schools. Get found by the parents already searching",
  description:
    "Your EarlyDays listing is free forever. We also build school websites, custom school management systems, social media, local SEO and paid ads. Book a call.",
  alternates: { canonical: `${SITE.url}/for-schools` },
  openGraph: {
    title: "EarlyDays for schools",
    description:
      "Parents search, compare two or three schools, and call the one that made it easy. We make sure that school is yours.",
    type: "website",
    url: `${SITE.url}/for-schools`,
  },
};

/* The questions school owners actually ask, in the order they ask them. Shared
   by the page and the FAQPage markup, so the two cannot drift apart. */
const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Do I have to pay to be listed on EarlyDays?",
    a: "No. Your listing is free and it stays free. You can claim your profile today, add your photos and your fees, and never speak to us about money. We make nothing from your listing and we are not going to start.",
  },
  {
    q: "So what does the rest of it cost?",
    a: "It depends on your school, and we will not pretend otherwise. A one page site for a small creche and a management system for a six hundred pupil school are not the same job. We look at your school on the call, then send you a written scope with a fixed price. If it is more than you want to spend, we tell you what to do first and what can wait.",
  },
  {
    q: "Will this fill my classrooms?",
    a: "It will put your school in front of parents who are already searching, and make it easy for them to reach you. What it cannot do is promise you a number of enrolments, because that depends on your fees, your location and your school. Anyone who gives you a guaranteed number is guessing, and you should ask them how they arrived at it.",
  },
  {
    q: "How long before parents start finding me?",
    a: "Your EarlyDays listing can start showing you to parents within days, because the directory pages already rank on Google. A brand new website of your own is slower, usually a few months before Google trusts it. That is exactly why we do both. The listing works while the website grows.",
  },
  {
    q: "I already have a website. Can you work with it?",
    a: "Yes. Sometimes it needs rebuilding and sometimes it only needs fixing, and those cost very different amounts. We will tell you which on the call, including when the answer is that your site is fine and you do not need us yet.",
  },
  {
    q: "Do I need to be technical to run any of this?",
    a: "No. You get a dashboard you can edit yourself, with no code anywhere in it. If you would rather send us a WhatsApp message saying the fees changed, that works too. Most heads do it that way.",
  },
  {
    q: "We already have someone handling our social media.",
    a: "Good. Keep them if they are working. We will look at your account before the call and tell you honestly whether we would do better, and in what way. If the answer is no, that is a short call and you have lost nothing.",
  },
  {
    q: "Our parents are all on WhatsApp. Is a website not a waste?",
    a: "WhatsApp is how parents talk to you after they have decided. A website is how they decide. The parent who already has your number was never the problem. The one comparing three schools on her phone at night has never heard of you, and WhatsApp cannot reach her.",
  },
  {
    q: "Do you only work with schools in Accra?",
    a: "No. The directory covers schools across Ghana and we work remotely for most things. For a photography day we travel to you, so we group those trips by region.",
  },
  {
    q: "What actually happens on the call?",
    a: "Thirty minutes on the phone. We pull your school up while you are talking to us and tell you what a parent sees today. Then we tell you what we would fix first, and what we would leave alone. You are not obliged to buy anything and we will not chase you afterwards.",
  },
];

const SERVICES = [
  {
    key: "listing" as const,
    kicker: "Free forever",
    title: "Your school on the directory parents already search",
    body: "Photos, programmes, hours, location and your fees if you want them shown, on a page built to be found. A button that rings your phone and a button that opens WhatsApp. You never pay for this and there is no upgrade we are waiting to sell you.",
    cta: "Claim it yourself",
    href: "/claim",
  },
  {
    key: "website" as const,
    kicker: "Websites",
    title: "A website that brings enquiries, not just one that exists",
    body: "Not a template with your logo dropped into it. Your programmes on their own pages, your admissions process written plainly, your real photographs, and one tap to WhatsApp from every screen. Built to load on a phone on mobile data, because that is what your parents are using.",
  },
  {
    key: "management" as const,
    kicker: "School management",
    title: "A management system built around your school",
    body: "Custom, not off the shelf. Admissions from the first enquiry through to enrolment, pupil and parent records, fees and invoices, receipts, who has paid and who has not, staff access by role, and a portal where parents can see it themselves. We build it around how your school already runs, which is why we scope it with you rather than hand you a package and ask you to adapt.",
  },
  {
    key: "social" as const,
    kicker: "Social media",
    title: "We come to your school and shoot it ourselves",
    body: "A photography day at your school, your classrooms, your compound, your teachers and the children at work, with permission handled properly. Then we post consistently, so a parent who checks your Instagram finds a school that is alive instead of an account that stopped posting two years ago.",
  },
  {
    key: "seo" as const,
    kicker: "Local SEO",
    title: "Be the school Google shows in your area",
    body: "Your Google Business Profile set up properly, with your real location, hours, photos and reviews. Then the pages that make you come up for what parents in your area actually type, which is almost never your school's name.",
  },
  {
    key: "ads" as const,
    kicker: "Paid ads",
    title: "When you need the term filled, not next year",
    body: "Google, Instagram and Facebook, aimed at parents inside your catchment area. Useful when admissions open and you need enquiries in weeks. We will tell you plainly if your school is not ready for ads yet, because spending on traffic to a weak page wastes your money and our time.",
  },
];

export default function ForSchools() {
  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      {/* ---------------------------------------------------------------- Hero */}
      <section className="border-b border-[color:var(--color-line)] bg-[color:var(--color-cream-deep)]">
        <div className="container-page pt-6 pb-12 md:pt-10 md:pb-20">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "For schools" }]}
          />
          <div className="mt-6 grid items-center gap-10 md:mt-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-12">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-md bg-[color:var(--color-ink)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                EarlyDays for schools
              </span>
              <h1 className="mt-4 text-[34px] leading-[1.05] md:text-[56px]">
                A parent is comparing schools tonight.{" "}
                <span className="text-[color:var(--color-coral)]">
                  Is yours one of them?
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[color:var(--color-ink-mute)] md:text-[18px]">
                She searches on her phone, opens two or three schools, and calls
                the one that made it easy. Not the best school. The one she
                could find, see and reach. We make sure that is yours.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <BookCallButton
                  service="general"
                  label="Book a call"
                  variant="primary"
                  className="text-base"
                />
                <Link href="/claim" className="btn btn-ghost btn-wrap text-base">
                  Claim your free listing
                </Link>
              </div>
              <p className="mt-4 text-[13px] text-[color:var(--color-ink-mute)]">
                Your listing is free and stays free. Everything else we quote
                after we have seen your school.
              </p>
            </div>

            <div className="min-w-0">
              <ProfileMock />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- The problem */}
      <section className="container-page py-14 md:py-20">
        <div className="max-w-3xl">
          <SectionKicker>What you are missing</SectionKicker>
          <h2 className="mt-3 text-[26px] leading-tight md:text-[40px]">
            By the time your phone rings, the decision is nearly made.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--color-ink-mute)] md:text-[17px]">
            Parents do not call ten schools any more. They search, they look,
            they shortlist, and then they call. Everything that matters happens
            before you ever speak to them, which means the schools you are
            losing to are not beating you on teaching. They are beating you on
            being findable.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Problem
            n="1"
            title="They start on Google"
            body="More than nine in ten searches in Ghana go through Google. If your school does not come up when a parent types what she is looking for, you were never in the running and you will never know it happened."
          />
          <Problem
            n="2"
            title="They need to see the place"
            body="Photographs decide more than words do. A school with real pictures of its classrooms and its compound gets opened. A school with none gets scrolled past, because an empty profile reads as a school that has closed."
          />
          <Problem
            n="3"
            title="They are looking for your fees"
            body="Only about one school in seventeen publishes what it charges. Parents call the ones that do, because every other call has to start with an awkward question they would rather not ask a stranger."
          />
        </div>

        <div className="mt-10">
          <BeforeAfterMock />
        </div>
      </section>

      {/* --------------------------------------------------------------- Why us: rank */}
      <section className="border-y border-[color:var(--color-line)] bg-[color:var(--color-ink)] py-14 text-white md:py-20">
        <div className="container-page grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-14">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-md bg-[color:var(--color-sun)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-ink)]">
              Why we are different
            </span>
            <h2 className="mt-4 text-[26px] leading-tight text-white md:text-[40px]">
              We are already the page parents land on.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-white/75 md:text-[17px]">
              EarlyDays is the directory parents use to compare schools across
              Ghana. When someone searches for a preschool in East Legon, our
              page comes up on the first page of Google, and your school sits on
              that page.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-white/75 md:text-[17px]">
              This is the part an agency cannot sell you. They can build you a
              website and then wait months for Google to trust it. We can put
              you in front of parents this week, and build the website while
              that runs.
            </p>
            <div className="mt-7">
              <BookCallButton
                service="general"
                label="Book a call"
                variant="primary"
                className="text-base"
              />
            </div>
          </div>
          <div className="min-w-0">
            <SearchMock />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- Services */}
      <section className="container-page py-14 md:py-20">
        <div className="max-w-3xl">
          <SectionKicker>What we do</SectionKicker>
          <h2 className="mt-3 text-[26px] leading-tight md:text-[40px]">
            Everything your school needs to be found, in one place.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--color-ink-mute)] md:text-[17px]">
            Start with the listing, which costs nothing. Add the rest when you
            are ready, in whatever order makes sense for your school. There is
            no bundle you have to take.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {SERVICES.map((s) => (
            <article
              key={s.key}
              className="flex min-w-0 flex-col rounded-2xl border border-[color:var(--color-line)] bg-white p-5 md:p-7"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-coral)]">
                {s.kicker}
              </span>
              <h3 className="mt-2 text-[19px] leading-tight md:text-[23px]">
                {s.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--color-ink-mute)] md:text-[15px]">
                {s.body}
              </p>
              <div className="mt-5 flex-1" />
              {s.href ? (
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-1.5 self-start text-[13px] font-bold text-[color:var(--color-coral)] underline decoration-[color:var(--color-sun)] decoration-2 underline-offset-4"
                >
                  {s.cta}
                  <Arrow />
                </Link>
              ) : (
                <BookCallButton
                  service={s.key}
                  label="Talk to us about this"
                  variant="quiet"
                />
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------- Why us */}
      <section className="bg-[color:var(--color-cream-deep)] py-14 md:py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <SectionKicker>Why schools pick us</SectionKicker>
            <h2 className="mt-3 text-[26px] leading-tight md:text-[40px]">
              Why us and not an agency.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Reason
              title="We own the audience"
              body="No agency in Ghana can put your school on a page that already ranks for what parents search. We can, because we built it and we maintain it every week."
            />
            <Reason
              title="We are actually here"
              body="Accra based. We come to your school, meet you, walk the compound and take the photographs ourselves. You are not emailing a team in another country about a school they have never seen."
            />
            <Reason
              title="Built for how Ghana works"
              body="Mobile money, WhatsApp, phones on patchy data and parents who would rather call than fill in a form. Everything we build assumes that, because it is true."
            />
            <Reason
              title="Custom, never a package"
              body="Your management system is built around how your school already runs. We do not hand you foreign software and ask you to change your school to fit it."
            />
            <Reason
              title="You speak to the person building it"
              body="No account manager relaying your messages to someone else. The person who picks up your call is the person doing the work."
            />
            <Reason
              title="We will tell you to wait"
              body="If your site is fine and your Instagram is working, we will say so and end the call. We would rather have a school that trusts us next year than one invoice this month."
            />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- FAQ */}
      <section className="container-page py-14 md:py-20">
        <div className="max-w-3xl">
          <SectionKicker>Straight answers</SectionKicker>
          <h2 className="mt-3 text-[26px] leading-tight md:text-[40px]">
            What school owners ask us first.
          </h2>
        </div>
        <div className="mt-8 max-w-3xl divide-y divide-[color:var(--color-line)] border-y border-[color:var(--color-line)]">
          {FAQS.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex w-full cursor-pointer list-none items-start justify-between gap-4 py-4 text-left">
                <span className="min-w-0 break-words text-[15px] font-bold leading-snug text-[color:var(--color-ink)] md:text-[17px]">
                  {f.q}
                </span>
                <span
                  aria-hidden
                  className="chev mt-0.5 shrink-0 text-[color:var(--color-brand)] transition-transform"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </summary>
              <p className="min-w-0 break-words pb-5 pr-8 text-[14px] leading-relaxed text-[color:var(--color-ink-mute)] md:text-[15px]">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- How it works */}
      <section className="border-t border-[color:var(--color-line)] bg-[color:var(--color-cream-deep)] py-14 md:py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <SectionKicker>How it works</SectionKicker>
            <h2 className="mt-3 text-[26px] leading-tight md:text-[40px]">
              Three steps, and the first one is free.
            </h2>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            <Step
              n={1}
              title="Book the call"
              body="Pick a day and a time that suits you. Thirty minutes on the phone, with the person who would do the work."
            />
            <Step
              n={2}
              title="We look, then we tell you"
              body="We go through your school the way a parent would and tell you what we see. You get it in writing afterwards, with a fixed price and the order we would do it in."
            />
            <Step
              n={3}
              title="We build it"
              body="You review as it goes, not at the end. When it goes live we train your team, and we stay reachable on the same number you called."
            />
          </ol>
        </div>
      </section>

      {/* -------------------------------------------------------------------- CTA */}
      <section className="container-page py-14 md:py-20">
        <div className="rounded-2xl bg-[color:var(--color-ink)] p-7 text-center md:p-14">
          <h2 className="mx-auto max-w-2xl text-[26px] leading-tight text-white md:text-[40px]">
            Let us look at your school the way a parent does.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/75 md:text-[17px]">
            Thirty minutes. We tell you what a parent finds today, what we would
            fix first and what it would cost. If the answer is that you do not
            need us, we will say that too.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <BookCallButton
              service="general"
              label="Book a call"
              variant="primary"
              className="text-base"
            />
            <Link href="/claim" className="btn btn-ghost btn-wrap text-base">
              Claim your free listing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-coral)]">
      <span aria-hidden className="h-[2px] w-6 bg-[color:var(--color-sun)]" />
      {children}
    </span>
  );
}

function Problem({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-[color:var(--color-line)] bg-white p-5 md:p-6">
      <span className="grid h-8 w-8 place-items-center rounded-md bg-[color:var(--color-sun-soft)] text-[13px] font-extrabold text-[color:var(--color-coral)]">
        {n}
      </span>
      <h3 className="mt-3 text-[18px] leading-tight md:text-[20px]">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--color-ink-mute)]">
        {body}
      </p>
    </div>
  );
}

function Reason({ title, body }: { title: string; body: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-white p-5 md:p-6">
      <h3 className="text-[17px] leading-tight md:text-[19px]">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--color-ink-mute)]">
        {body}
      </p>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="min-w-0 rounded-2xl border border-[color:var(--color-line)] bg-white p-5 md:p-6">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-[color:var(--color-ink)] text-[14px] font-extrabold text-white">
        {n}
      </span>
      <h3 className="mt-3 text-[18px] leading-tight md:text-[20px]">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--color-ink-mute)]">
        {body}
      </p>
    </li>
  );
}

function Arrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
