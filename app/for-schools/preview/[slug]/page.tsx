import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findListing, allListings } from "@/lib/query";
import { findLocation } from "@/data/locations";
import { findCategoryByType } from "@/data/categories";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export const revalidate = 60;

export async function generateStaticParams() {
  return allListings().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = findListing(slug);
  if (!listing) return {};
  return {
    title: `${listing.name} — website preview by EarlyDays`,
    description: `A Professional-tier website preview for ${listing.name}. This is what parents see when they land on your school's site.`,
    alternates: { canonical: `${SITE.url}/for-schools/preview/${listing.slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = findListing(slug);
  if (!listing) notFound();

  const loc = findLocation(listing.neighbourhood);
  const cat = findCategoryByType(listing.listingTypes[0]);
  const hero = listing.images?.[0];
  const gallery = (listing.images ?? []).slice(0, 6);

  const phoneClean = (listing.phone ?? "").replace(/[^0-9+]/g, "");
  const waNumber = (listing.whatsapp ?? listing.phone ?? "").replace(
    /[^0-9]/g,
    "",
  );

  const programmes = buildProgrammes(listing.listingTypes, listing.ageBlurb);

  return (
    <>
      {/* Preview ribbon */}
      <div className="sticky top-0 z-40 bg-[color:var(--color-navy)] text-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-2 text-[12px]">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-sun)]" />
            <strong className="font-semibold">Website preview</strong>
            <span className="hidden opacity-70 md:inline">
              — this is what a Professional plan would look like for{" "}
              {listing.name}.
            </span>
          </span>
          <Link
            href="/for-schools#pricing"
            className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white hover:bg-white/20"
          >
            View plans
          </Link>
        </div>
      </div>

      {/* Fake school header */}
      <header className="border-b border-[color:var(--color-line)] bg-white">
        <div className="container-page flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            {listing.logoUrl ? (
              <Image
                src={listing.logoUrl}
                alt={`${listing.name} logo`}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border border-[color:var(--color-line)] object-cover"
              />
            ) : (
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--color-navy)] font-display text-[16px] text-white">
                {listing.name.charAt(0)}
              </div>
            )}
            <div className="leading-tight">
              <p className="font-display text-[15px] text-[color:var(--color-navy)]">
                {listing.name}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[color:var(--color-ink-mute)]">
                {loc?.name ?? listing.region}
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-[13px] text-[color:var(--color-navy)] md:flex">
            <a href="#about" className="hover:text-[color:var(--color-sky-deep)]">
              About
            </a>
            <a
              href="#programmes"
              className="hover:text-[color:var(--color-sky-deep)]"
            >
              Programmes
            </a>
            <a
              href="#gallery"
              className="hover:text-[color:var(--color-sky-deep)]"
            >
              Gallery
            </a>
            <a
              href="#admissions"
              className="hover:text-[color:var(--color-sky-deep)]"
            >
              Admissions
            </a>
            <a
              href="#visit"
              className="hover:text-[color:var(--color-sky-deep)]"
            >
              Visit
            </a>
          </nav>
          <a href="#admissions" className="btn btn-primary text-sm">
            Enquire
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[color:var(--color-cream)]">
        <div className="container-page grid gap-8 py-12 md:grid-cols-2 md:py-20">
          <div className="flex flex-col justify-center">
            <span className="chip chip-leaf w-fit">
              Admissions open · {cat?.plural ?? "School"}
            </span>
            <h1 className="mt-4 font-display text-[36px] leading-tight text-[color:var(--color-navy)] md:text-[54px]">
              {heroTitle(listing.name)}
            </h1>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[color:var(--color-ink-mute)] md:text-[17px]">
              {listing.shortDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#admissions" className="btn btn-primary text-base">
                Start admission
              </a>
              {waNumber && (
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-ghost text-base"
                >
                  Chat on WhatsApp
                </a>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[color:var(--color-navy)]">
              <span>
                <strong>Ages:</strong> {listing.ageBlurb}
              </span>
              {listing.curriculum.length > 0 && (
                <span>
                  <strong>Curriculum:</strong> {listing.curriculum.join(", ")}
                </span>
              )}
              {listing.hours && (
                <span>
                  <strong>Hours:</strong> {listing.hours}
                </span>
              )}
            </div>
          </div>
          <div className="relative min-h-[280px] overflow-hidden rounded-3xl bg-[color:var(--color-cream-deep)] shadow-[0_20px_60px_rgba(15,42,74,0.12)] md:min-h-[440px]">
            {hero ? (
              <Image
                src={hero.url}
                alt={hero.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="grid h-full place-items-center text-[color:var(--color-ink-mute)]">
                <span className="text-sm">Hero image goes here</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-16 bg-white">
        <div className="container-page grid gap-8 py-14 md:grid-cols-3 md:py-20">
          <div className="md:col-span-1">
            <span className="chip chip-sky">About</span>
            <h2 className="mt-3 font-display text-[26px] leading-tight md:text-[36px]">
              Who we are.
            </h2>
          </div>
          <div className="md:col-span-2">
            <p className="text-[15px] leading-relaxed text-[color:var(--color-navy-2)] md:text-[17px]">
              {listing.description}
            </p>
            {listing.services.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {listing.services.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-[color:var(--color-cream-deep)] px-3 py-1 text-[12px] font-semibold text-[color:var(--color-navy)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section
        id="programmes"
        className="scroll-mt-16 bg-[color:var(--color-cream)]"
      >
        <div className="container-page py-14 md:py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="chip chip-sun">Programmes</span>
              <h2 className="mt-3 font-display text-[26px] leading-tight md:text-[36px]">
                What we offer.
              </h2>
            </div>
            <p className="max-w-md text-[13px] text-[color:var(--color-ink-mute)] md:text-[14px]">
              Programmes are grouped by age. On the real site, each links to a
              dedicated page with fees, curriculum detail and photos.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {programmes.map((p) => (
              <div
                key={p.name}
                className="rounded-3xl border border-[color:var(--color-line)] bg-white p-6"
              >
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full font-display text-[14px]"
                  style={{ background: p.accent.bg, color: p.accent.fg }}
                >
                  {p.n}
                </span>
                <h3 className="mt-4 font-display text-[20px] leading-tight">
                  {p.name}
                </h3>
                <p className="mt-1 text-[13px] font-semibold text-[color:var(--color-navy)]">
                  {p.ages}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--color-ink-mute)]">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section id="gallery" className="scroll-mt-16 bg-white">
          <div className="container-page py-14 md:py-20">
            <div className="mb-8">
              <span className="chip chip-leaf">Gallery</span>
              <h2 className="mt-3 font-display text-[26px] leading-tight md:text-[36px]">
                A day with us.
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {gallery.map((img, i) => (
                <div
                  key={img.url}
                  className={`relative overflow-hidden rounded-2xl bg-[color:var(--color-cream-deep)] ${
                    i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Admissions */}
      <section
        id="admissions"
        className="scroll-mt-16 bg-[color:var(--color-navy)] text-white"
      >
        <div className="container-page py-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
                Admissions
              </span>
              <h2 className="mt-3 font-display text-[26px] leading-tight text-white md:text-[38px]">
                Join our community.
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-white/80 md:text-[16px]">
                Send an enquiry and our admissions team will get back within
                two working days. You'll get a school tour, a place-availability
                update and the current fees for your child's age group.
              </p>
              <ul className="mt-6 space-y-3 text-[13px] text-white/85 md:text-[14px]">
                <li className="flex gap-2">
                  <Dot /> Step 1 · Fill the enquiry form
                </li>
                <li className="flex gap-2">
                  <Dot /> Step 2 · Book a school tour
                </li>
                <li className="flex gap-2">
                  <Dot /> Step 3 · Submit application
                </li>
                <li className="flex gap-2">
                  <Dot /> Step 4 · Placement decision & onboarding
                </li>
              </ul>
            </div>
            <div className="rounded-3xl bg-white p-6 text-[color:var(--color-navy)] md:p-8">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
                Enquiry form
              </p>
              <p className="mt-1 font-display text-[20px] leading-tight md:text-[24px]">
                Tell us about your child.
              </p>
              <form className="mt-5 space-y-3">
                <Field label="Parent name" placeholder="Your name" />
                <Field
                  label="Email"
                  placeholder="you@example.com"
                  type="email"
                />
                <Field
                  label="Phone / WhatsApp"
                  placeholder="+233 …"
                  type="tel"
                />
                <Field
                  label="Child's date of birth"
                  placeholder="dd / mm / yyyy"
                  type="text"
                />
                <Field label="Programme" placeholder="Not sure yet" />
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
                    Anything else
                  </label>
                  <textarea
                    className="mt-1 w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-sky-deep)]"
                    rows={3}
                    placeholder="Preferred start date, tour availability, siblings…"
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary w-full text-sm"
                  disabled
                >
                  Send enquiry (preview)
                </button>
                <p className="text-[11px] text-[color:var(--color-ink-mute)]">
                  Form is inactive in this preview. On the real site, enquiries
                  land in your admissions inbox and by WhatsApp.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Visit */}
      <section id="visit" className="scroll-mt-16 bg-white">
        <div className="container-page py-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <span className="chip chip-sky">Visit</span>
              <h2 className="mt-3 font-display text-[26px] leading-tight md:text-[36px]">
                Come and see us.
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--color-ink-mute)] md:text-[15px]">
                We welcome school tours by appointment. The team is happy to
                answer questions on WhatsApp before you visit.
              </p>
              <dl className="mt-6 space-y-4 text-[14px]">
                {listing.address && (
                  <Row label="Address" value={listing.address} />
                )}
                {listing.phone && (
                  <Row
                    label="Phone"
                    value={
                      <a
                        href={`tel:${phoneClean}`}
                        className="text-[color:var(--color-sky-deep)] hover:underline"
                      >
                        {listing.phone}
                      </a>
                    }
                  />
                )}
                {listing.email && (
                  <Row
                    label="Email"
                    value={
                      <a
                        href={`mailto:${listing.email}`}
                        className="text-[color:var(--color-sky-deep)] hover:underline"
                      >
                        {listing.email}
                      </a>
                    }
                  />
                )}
                {listing.hours && (
                  <Row label="Hours" value={listing.hours} />
                )}
              </dl>
            </div>
            <div className="relative min-h-[280px] overflow-hidden rounded-3xl bg-[color:var(--color-cream-deep)] md:min-h-[360px]">
              {listing.address ? (
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    listing.address,
                  )}&output=embed`}
                  loading="lazy"
                  className="h-full w-full border-0"
                />
              ) : (
                <div className="grid h-full place-items-center text-sm text-[color:var(--color-ink-mute)]">
                  Map appears here
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Fake footer */}
      <footer className="bg-[color:var(--color-navy)] py-10 text-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 text-[12px] text-white/70">
          <span>
            © {new Date().getFullYear()} {listing.name}. All rights reserved.
          </span>
          <span>
            Website preview by{" "}
            <Link
              href="/for-schools"
              className="text-white/90 underline underline-offset-4 hover:text-white"
            >
              EarlyDays for Schools
            </Link>
          </span>
        </div>
      </footer>
    </>
  );
}

function heroTitle(name: string) {
  return `Welcome to ${name}.`;
}

function buildProgrammes(types: string[], ageBlurb: string) {
  const palette = [
    { bg: "var(--color-sky-soft)", fg: "var(--color-sky-deep)" },
    { bg: "var(--color-leaf-soft)", fg: "#2F7C25" },
    { bg: "var(--color-sun-soft)", fg: "#7A5A00" },
    { bg: "var(--color-blossom-soft)", fg: "var(--color-pink-hot-deep)" },
    { bg: "var(--color-coral-soft)", fg: "var(--color-coral)" },
  ];
  const map: Record<
    string,
    { name: string; ages: string; body: string }
  > = {
    creche: {
      name: "Creche & Daycare",
      ages: "3 months – 2 years",
      body: "Nurturing full-day care with small ratios, structured play, sleep routines and warm relationships with familiar carers.",
    },
    preschool: {
      name: "Preschool",
      ages: "2 – 4 years",
      body: "Play-based learning that builds language, motor skills and confidence in a joyful, structured environment.",
    },
    kindergarten: {
      name: "Kindergarten",
      ages: "4 – 5 years",
      body: "Getting ready for Primary. Phonics, early numeracy, social skills and independence with plenty of outdoor time.",
    },
    primary: {
      name: "Primary",
      ages: "5 – 11 years",
      body: "A full academic programme balanced with sport, arts, service and character. Small class sizes and dedicated teachers.",
    },
    montessori: {
      name: "Montessori Community",
      ages: ageBlurb,
      body: "Authentic Montessori materials in mixed-age communities, guided by trained directresses in prepared environments.",
    },
    "learning-centre": {
      name: "Learning Centre",
      ages: ageBlurb,
      body: "After-school and holiday programmes, tuition and enrichment. Small groups, focused sessions, clear progress reports.",
    },
    "language-centre": {
      name: "Language Programme",
      ages: ageBlurb,
      body: "Structured language lessons for children with native and near-native speakers. Reading, writing, speaking, listening.",
    },
    stem: {
      name: "STEM Studio",
      ages: ageBlurb,
      body: "Hands-on robotics, coding and design projects for children who love building, tinkering and problem-solving.",
    },
    "activity-centre": {
      name: "Activities & Enrichment",
      ages: ageBlurb,
      body: "After-school clubs, dance, crafts, sports and edutainment programmes. Great for holidays and weekends too.",
    },
  };
  const items = types
    .map((t, i) => {
      const cfg = map[t];
      if (!cfg) return null;
      return {
        n: String(i + 1).padStart(2, "0"),
        accent: palette[i % palette.length],
        ...cfg,
      };
    })
    .filter(Boolean) as Array<{
    n: string;
    accent: { bg: string; fg: string };
    name: string;
    ages: string;
    body: string;
  }>;
  return items.length > 0
    ? items
    : [
        {
          n: "01",
          accent: palette[0],
          name: "Programme",
          ages: ageBlurb,
          body: "Learn more on the enquiry form or by contacting our admissions team.",
        },
      ];
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-[color:var(--color-ink-mute)]">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-[color:var(--color-line)] bg-white px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-sky-deep)]"
      />
    </div>
  );
}

function Dot() {
  return (
    <span
      aria-hidden
      className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-sun)]"
    />
  );
}
