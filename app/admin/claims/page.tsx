import type { Metadata } from "next";
import { AdminClaimsPanel } from "@/components/school/AdminClaimsPanel";

export const metadata: Metadata = {
  title: "Admin — Claims",
  robots: { index: false, follow: false },
};

export default function AdminClaimsPage() {
  return (
    <div className="container-page pt-8 md:pt-12">
      <AdminClaimsPanel />
    </div>
  );
}
