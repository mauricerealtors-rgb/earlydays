import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, Footer, Header } from "@/components/Chrome";
import { PriceTable } from "@/components/PriceTable";
import { TrustBadges } from "@/components/VendorCard";
import { findArea } from "@/data/areas";
import { OCCASIONS, KINDS, STYLE_LABELS, DIETARY_LABELS } from "@/data/categories";
import { VENDORS, findVendor } from "@/data/vendors";
import { telUrl, whatsappUrl } from "@/lib/contact";
import { SITE, money } from "@/lib/site";

export function generateStaticParams() {
  return VENDORS.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = findVendor(slug);
  if (!v) return {};
  const area = findArea(v.area)?.name ?? v.area;
  const priced = v.priceFrom
    ? ` Prices from ${money(v.priceFrom)}.`
    : "";
  return {
    title: `${v.name} — cakes in ${area}`,
    description: `${v.shortDescription}${priced}`,
    alternates: { canonical: `/bakers/${v.slug}` },
    openGraph: {
      title: `${v.name} — cakes in ${area}`,
      description: v.shortDescription,
      url: `${SITE.url}/bakers/${v.slug}`,
      images: v.images?.[0]?.url ? [v.images[0].url] : undefined,
    },
  };
}

export default async function BakerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = findVendor(slug);
  if (!v) notFound();

  const area = findArea(v.area);
  const wa = whatsappUrl(v);
  const tel = telUrl(v.phone);
  const occasions = OCCASIONS.filter((o) => v.occasions.includes(o.occasion));
  const kinds = KINDS.filter((k) => v.kinds.includes(k.kind));
  const delivers = (v.deliversTo ?? [])
    .map((s) => findArea(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <>
      <Header />
      <Breadcrumb
        trail={[
          { href: "/", label: "Home" },
          ...(area ? [{ href: `/cakes-in/${area.slug}`, label: area.name }] : []),
          { label: v.name },
        ]}
      />

      <main className="container-page pb-10">
        <div className="mt-4 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h1 className="text-3xl md:text-5xl">{v.name}</h1>
            <p className="mt-2 text-lg text-ink-mute">
              {area?.name ?? v.area}
              {area && area.region !== "accra" ? `, ${v.city}` : ""} ·{" "}
              {area?.regionName ?? v.region}
            </p>

            <div className="mt-4">
              <TrustBadges vendor={v} />
            </div>

            <p className="mt-6 text-lg">{v.description}</p>

            {v.images?.length ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {v.images.map((img) => (
                  <figure key={img.url}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.alt}
                      loading="lazy"
                      className="w-full rounded-lg object-cover"
                    />
                    {img.credit && (
                      <figcaption className="mt-1 text-xs text-ink-mute">
                        {img.credit}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            ) : (
              <p className="card mt-8 p-5 text-sm text-ink-mute">
                We have not found photos we can attribute to {v.name}&rsquo;s own
                work. Rather than fill this space with someone else&rsquo;s
                cakes, we have left it empty. Ask them for recent photos when you
                get in touch.
              </p>
            )}

            <PriceTable vendor={v} />

            {(v.leadTimeNote || v.leadTimeDays !== undefined) && (
              <section className="mt-10">
                <h2 className="text-2xl">How much notice they need</h2>
                <p className="mt-2">
                  {v.leadTimeNote ??
                    (v.leadTimeDays === 0
                      ? "Same-day orders."
                      : `${v.leadTimeDays} days.`)}
                </p>
              </section>
            )}

            {(delivers.length || v.deliveryNote) && (
              <section className="mt-10">
                <h2 className="text-2xl">Delivery</h2>
                {v.deliveryNote && <p className="mt-2">{v.deliveryNote}</p>}
                {delivers.length > 0 && (
                  <>
                    <p className="mt-3 text-sm text-ink-mute">
                      Areas they deliver to:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {delivers.map((a) => (
                        <Link
                          key={a.slug}
                          href={`/cakes-in/${a.slug}`}
                          className="chip"
                        >
                          {a.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}

            {(occasions.length > 0 || kinds.length > 0) && (
              <section className="mt-10">
                <h2 className="text-2xl">What they make</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {occasions.map((o) => (
                    <Link key={o.slug} href={`/${o.slug}`} className="chip">
                      {o.plural}
                    </Link>
                  ))}
                  {kinds.map((k) => (
                    <Link key={k.slug} href={`/${k.slug}`} className="chip">
                      {k.plural}
                    </Link>
                  ))}
                </div>
                {(v.styles.length > 0 || v.dietary.length > 0) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {v.styles.map((s) => (
                      <span key={s} className="chip">
                        {STYLE_LABELS[s]}
                      </span>
                    ))}
                    {v.dietary.map((d) => (
                      <span key={d} className="chip">
                        {DIETARY_LABELS[d]}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            )}

            <section className="mt-10">
              <h2 className="text-2xl">Where this came from</h2>
              <p className="mt-2 text-sm text-ink-mute">
                We compiled this profile from the baker&rsquo;s own pages, listed
                below. We have not yet spoken to them to confirm it, so treat the
                details as a starting point and check anything that matters when
                you order.
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                {v.sourceUrls.map((u) => (
                  <li key={u}>
                    <a
                      href={u}
                      rel="nofollow noopener"
                      className="break-all text-ink-mute underline hover:text-rose-deep"
                    >
                      {u}
                    </a>
                  </li>
                ))}
              </ul>
              {v.lastVerifiedAt && (
                <p className="mt-3 text-sm text-ink-mute">
                  Last checked {v.lastVerifiedAt}.
                </p>
              )}
            </section>
          </div>

          {/* Contact rail */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="card p-6">
              <h2 className="text-xl">Get in touch</h2>

              {v.orderStatus === "unknown" && (
                <p className="mt-3 rounded-sm bg-gold-soft p-3 text-sm text-cocoa">
                  We are not certain this baker is currently taking orders. Check
                  before you plan around them.
                </p>
              )}

              <div className="mt-4 space-y-3">
                {wa && (
                  <a
                    href={wa}
                    rel="nofollow noopener"
                    className="btn btn-primary w-full"
                  >
                    Message on WhatsApp
                  </a>
                )}
                {tel && (
                  <a href={tel} className="btn btn-ghost w-full">
                    Call {v.phone}
                  </a>
                )}
                {v.instagram && (
                  <a
                    href={`https://instagram.com/${v.instagram}`}
                    rel="nofollow noopener"
                    className="btn btn-ghost w-full"
                  >
                    @{v.instagram} on Instagram
                  </a>
                )}
                {v.facebook && (
                  <a
                    href={v.facebook}
                    rel="nofollow noopener"
                    className="btn btn-ghost w-full"
                  >
                    Facebook page
                  </a>
                )}
                {v.website && (
                  <a
                    href={v.website}
                    rel="nofollow noopener"
                    className="btn btn-ghost w-full"
                  >
                    Their website
                  </a>
                )}
              </div>

              {!wa && !tel && (
                <p className="mt-4 text-sm text-ink-mute">
                  We have not been able to confirm a phone number for{" "}
                  {v.name} from the business itself, so we are not publishing
                  one. The links above are the channels we could verify.
                </p>
              )}

              <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
                {v.address && (
                  <div>
                    <dt className="font-bold text-cocoa">Address</dt>
                    <dd className="text-ink-mute">{v.address}</dd>
                  </div>
                )}
                {v.hours && (
                  <div>
                    <dt className="font-bold text-cocoa">Hours</dt>
                    <dd className="text-ink-mute">{v.hours}</dd>
                  </div>
                )}
                {v.email && (
                  <div>
                    <dt className="font-bold text-cocoa">Email</dt>
                    <dd className="break-all text-ink-mute">{v.email}</dd>
                  </div>
                )}
                {v.phones && v.phones.length > 1 && (
                  <div>
                    <dt className="font-bold text-cocoa">Other numbers</dt>
                    <dd className="text-ink-mute">
                      {v.phones.slice(1).join(" · ")}
                    </dd>
                  </div>
                )}
              </dl>

              <p className="mt-5 border-t border-line pt-5 text-sm text-ink-mute">
                You deal with the baker directly. We take no commission and add
                nothing to the price.
              </p>
            </div>

            {!v.claimed && (
              <div className="card mt-5 p-6">
                <h2 className="text-lg">Is this your business?</h2>
                <p className="mt-2 text-sm text-ink-mute">
                  Claim this profile to correct the details, add your own photos
                  and publish your prices. It is free.
                </p>
                <Link
                  href={`/claim/${v.slug}`}
                  className="btn btn-ghost mt-4 w-full"
                >
                  Claim {v.name}
                </Link>
              </div>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
