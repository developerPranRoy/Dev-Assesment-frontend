import { Suspense } from "react";
import { CompanyAssessmentsTable } from "@/components/company/company-assessments-table";

export const dynamic = 'force-dynamic';

export const metadata = { title: "Assessments — DevAssess" };

export default function CompanyAssessmentsPage() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-muted" />}>
      <CompanyAssessmentsTable />
    </Suspense>
  );
}
