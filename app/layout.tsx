import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { JsonLd } from "@/components/JsonLd";
import { SITE, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "education",
  keywords: [
    "schools in Ghana",
    "preschool Accra",
    "creche Accra",
    "daycare Accra",
    "kindergarten Ghana",
    "primary schools Ghana",
    "Montessori Accra",
    "Cambridge schools Accra",
    "British curriculum Ghana",
    "children's learning centre Ghana",
    "French classes for kids Accra",
    "earlydays",
  ],
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    url: SITE.url,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    // Next.js auto-detects app/opengraph-image.tsx and generates the 1200x630
    // image for OG + Twitter cards. No manual images needed.
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter,
    creator: SITE.twitter,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  alternates: {
    canonical: SITE.url,
    languages: {
      "en-GH": SITE.url,
      "x-default": SITE.url,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#FFF8EF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GH">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Nunito:wght@400;600;700;800&display=swap"
        />
      </head>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": `${SITE.url}#website`,
            name: SITE.name,
            alternateName: "EarlyDays Ghana",
            url: SITE.url,
            inLanguage: "en-GH",
            publisher: { "@id": `${SITE.url}#org` },
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE.url}/schools?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${SITE.url}#org`,
            name: SITE.name,
            legalName: "EarlyDays",
            url: SITE.url,
            logo: `${SITE.url}/icon.svg`,
            description: SITE.description,
            areaServed: {
              "@type": "Country",
              name: SITE.region,
            },
            knowsAbout: [
              "Early years education",
              "Preschool",
              "Kindergarten",
              "Primary school",
              "Montessori",
              "Ghana education",
            ],
          }}
        />
        <Header />
        <main id="main" className="pb-24 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
