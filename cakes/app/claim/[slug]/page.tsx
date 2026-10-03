import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, Footer, Header } from "@/components/Chrome";
import { VENDORS, findVendor } from "@/data/vendors";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return VENDORS.filter((v) => !v.claimed).map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = findVendor(slug);
  if (!v) return {};
  return {
    title: `Claim ${v.name}`,
    description: `Claim the ${v.name} listing on ${SITE.name} to correct the details, add your own photos and publish your prices.`,
    robots: { index: false, follow: true },
  };
}

export default async function ClaimPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = findVendor(slug);
  if (!v) notFound();

  const subject = encodeURIComponent(`Claiming ${v.name} on ${SITE.name}`);
  const body = encodeURIComponent(
    `I would like to claim the listing for ${v.name}.\n\n` +
      `My name:\nMy role at the business:\nBest number to call:\n` +
      `Instagram or Facebook page:\n\nAnything on the profile that is wrong:\n`,
  );

  return (
    <>
      <Header />
      <Breadcrumb
        trail={[
          { href: "/", label: "Home" },
          { href: `/bakers/${v.slug}`, label: v.name },
          { label: "Claim" },
        ]}
      />

      <main className="container-page pb-10">
        <h1 className="mt-4 max-w-3xl text-3xl md:text-5xl">
          Claim {v.name}
        </h1>
        <p className="mt-5 max-w-2xl text-lg">
          Claiming is free and gives you control of the profile: your own photos,
          your prices, your lead time, your delivery areas, and enquiries
          straight to your WhatsApp.
        </p>

        <div className="card mt-8 max-w-2xl p-6">
          <h2 className="text-xl">What happens next</h2>
          <p className="mt-3">
            There is no password to set up. Send us your name, your role at the
            business and the best number to reach you on. We call that number
            within one working day to confirm the business is yours, then hand
            over access.
          </p>
          <p className="mt-3 text-ink-mute">
            We call rather than just emailing because that call is what lets a
            buyer trust the number on your page. Fake vendors impersonating real
            businesses are a growing problem in Ghana, and the call is how we
            keep you out of that company.
          </p>
          <p className="mt-5">
            <a
              href={`mailto:${SITE.email}?subject=${subject}&body=${body}`}
              className="btn btn-primary"
            >
              Email us to claim this listing
            </a>
          </p>
          <p className="mt-4 text-sm text-ink-mute">
            Would rather the listing came down? Say so in the same email and we
            will remove it.
          </p>
        </div>

        <p className="mt-8">
          <Link href={`/bakers/${v.slug}`} className="font-bold text-rose-deep underline">
            Back to the {v.name} profile
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
