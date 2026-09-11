import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "School dashboard",
  description: "Manage your school listing on EarlyDays.",
  robots: { index: false, follow: false },
};

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  return <div className="container-page pt-8 md:pt-10">{children}</div>;
}
