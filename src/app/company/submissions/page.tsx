import { Suspense } from "react";
import { CompanySubmissions } from "@/components/company/company-submissions";

export const dynamic = 'force-dynamic';

export const metadata = { title: "Submissions — DevAssess" };

export default function CompanySubmissionsPage() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-muted" />}>
      <CompanySubmissions />
    </Suspense>
  );
}
