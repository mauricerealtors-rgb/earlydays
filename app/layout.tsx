import type { Metadata, Viewport } from "next";
import { Archivo, Figtree } from "next/font/google";
import "./globals.css";

/**
 * Archivo ExtraBold over Figtree, from the Print Compare design system.
 *
 * Archivo carries its width axis, which is what gives the headlines their
 * wide, heavy voice; without `axes: ["wdth"]` the font-stretch: 118% in
 * globals.css does nothing. Loaded through next/font so both faces are
 * self-hosted and there is no render-blocking request to Google on first
 * paint, which the old <link> in <head> was.
 */
const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});
const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});
import { JsonLd } from "@/components/JsonLd";
import { AuthProvider } from "@/components/AuthProvider";
import { PublicChrome } from "@/components/PublicChrome";
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
    <html
      lang="en-GH"
      className={`${display.variable} ${body.variable} antialiased`}
    >
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
            logo: `${SITE.url}/brand/logo.png`,
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
        <AuthProvider>
          <PublicChrome>{children}</PublicChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
