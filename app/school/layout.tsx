import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "School dashboard",
  description: "Manage your school listing on EarlyDays.",
  robots: { index: false, follow: false },
};

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  // Each /school/* page renders its own DashboardChrome (full-screen
  // layout with sidebar). The parent PublicChrome already hides the
  // public site's Header/Footer/MobileNav on any /school route.
  return <>{children}</>;
}
