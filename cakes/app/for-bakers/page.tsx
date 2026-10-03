import type { Metadata } from "next";
import { Breadcrumb, Footer, Header } from "@/components/Chrome";
import { VENDORS } from "@/data/vendors";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "For bakers",
  description:
    "List your cake business on CakesGhana for free. Publish your prices, your lead time and your own photos, and reach buyers searching for a baker in your area.",
  alternates: { canonical: "/for-bakers" },
  openGraph: { title: `For bakers | ${SITE.name}`, url: `${SITE.url}/for-bakers` },
};

export default function ForBakersPage() {
  const priced = VENDORS.filter((v) => v.priceList?.length).length;

  return (
    <>
      <Header />
      <Breadcrumb trail={[{ href: "/", label: "Home" }, { label: "For bakers" }]} />

      <main className="container-page pb-10">
        <h1 className="mt-4 max-w-3xl text-3xl md:text-5xl">
          Get found by people who already want to buy a cake
        </h1>
        <p className="mt-5 max-w-2xl text-lg">
          Listing on {SITE.name} is free. We take no commission, we do not sit
          between you and the customer, and enquiries come straight to your own
          WhatsApp.
        </p>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl">Why we ask for your prices</h2>
          <p className="mt-3">
            Of {VENDORS.length} bakers listed, {priced} publish a price list. The
            people searching hardest are searching for prices, and right now
            almost nothing in Ghana answers them — so the bakers who publish get
            the enquiries.
          </p>
          <p className="mt-3">
            Publishing a starting price is not the same as quoting every job. A
            figure like &ldquo;from GH&#8373;450 for a six-inch single tier&rdquo;
            filters out people whose budget was never going to work and brings
            you the ones who are ready. It also protects you from the most common
            argument in this trade, which is a customer expecting a cake to serve
            twice as many people as it does.
          </p>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl">How a listing works</h2>
          <ol className="mt-4 space-y-4">
            <li>
              <strong className="text-cocoa">We build your profile.</strong> If
              you are already listed, we compiled it from your own Instagram,
              Facebook or website, and every source is shown at the bottom of
              your page so you can see exactly what we used.
            </li>
            <li>
              <strong className="text-cocoa">You claim it.</strong> Give us your
              name, email and phone number. No password to set up.
            </li>
            <li>
              <strong className="text-cocoa">We call you.</strong> One short call
              to confirm the business is yours. That call is the whole point: it
              is why a buyer can trust the number on your page.
            </li>
            <li>
              <strong className="text-cocoa">You take it from there.</strong>{" "}
              Correct the details, add your own photos, set your prices, your
              lead time and the areas you deliver to.
            </li>
          </ol>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-2xl">Photos must be your own work</h2>
          <p className="mt-3">
            We mark a photo as a baker&rsquo;s own work only when we have traced
            it to their own site or account. Cakes taken from someone
            else&rsquo;s gallery are the reason buyers arrive suspicious, and
            that badge is worth more to you than an extra picture.
          </p>
        </section>

        <section className="card mt-12 max-w-3xl p-6">
          <h2 className="text-2xl">Add or correct your listing</h2>
          <p className="mt-3 text-ink-mute">
            Email us the name of your business and the Instagram or Facebook page
            it trades under, and we will build the profile and call you to
            confirm it.
          </p>
          <p className="mt-4">
            <a
              href={`mailto:${SITE.email}?subject=My%20cake%20business`}
              className="btn btn-primary"
            >
              {SITE.email}
            </a>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
