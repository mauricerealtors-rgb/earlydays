"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBottomNav } from "./MobileBottomNav";

/**
 * Wraps the public Header/Footer/MobileBottomNav and hides them on any
 * route that owns its own chrome (the /admin and /school dashboards).
 *
 * Matched a whole segment at a time. A plain startsWith("/school") also
 * matches "/schools", which stripped the header and footer off the entire
 * public directory — /schools, every school profile and every area page under
 * it — while only the dashboard was meant to be affected.
 */
function inSection(pathname: string, base: string): boolean {
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const ownsChrome =
    inSection(pathname, "/admin") ||
    // The sign-in page is where schools land from our emails, so it keeps the
    // public chrome; everything else under /school is the dashboard shell.
    (inSection(pathname, "/school") && pathname !== "/school/login") ||
    inSection(pathname, "/for-schools/preview");
  if (ownsChrome) return <>{children}</>;
  return (
    <>
      <Header />
      <main id="main" className="pb-24 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
