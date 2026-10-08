import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  agentRules: false,
  // firebase-admin resolves its sub-packages through lazy internal requires.
  // Bundled, firebase-admin/auth fails to initialise and the function dies
  // before the handler runs — an empty 500 with no body, which is why
  // /api/admin/* returned "Unexpected end of JSON input" on the client while
  // routes touching only firestore were fine. Loaded natively it works.
  serverExternalPackages: ["firebase-admin"],
  images: {
    // Custom loader, because remotePatterns caps at 50 hosts and our photos
    // come from 126 — nearly all of them a school's own domain. A loader
    // sidesteps the allowlist completely.
    //
    // It is inert until NEXT_PUBLIC_CLOUDINARY_FETCH=1, and that must not be
    // set before remote fetch is enabled in the Cloudinary console, or every
    // image 401s. Off, the loader returns the URL untouched.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
  // www served the entire site on a 200 alongside the apex, so every page
  // existed at two hosts. Canonical tags pointed at the apex, which is a hint
  // rather than a rule, and Search Console treats a sitemap on a different host
  // from the property as cross-host and refuses to read it.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.earlydays.cc" }],
        destination: "https://earlydays.cc/:path*",
        permanent: true,
      },
    ];
  },
};

export default config;
