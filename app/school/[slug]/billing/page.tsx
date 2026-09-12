import { notFound } from "next/navigation";
import { findListing } from "@/lib/query";
import { DashboardChrome } from "@/components/school/DashboardChrome";
import { BillingPanel } from "@/components/school/BillingPanel";

export default async function BillingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = findListing(slug);
  if (!listing) notFound();
  return (
    <DashboardChrome slug={slug}>
      <BillingPanel slug={slug} />
    </DashboardChrome>
  );
}
