import { Suspense } from "react";
import { CompanyProblemsTable } from "@/components/company/company-problems-table";

export const dynamic = 'force-dynamic';

export const metadata = { title: "Problems — DevAssess" };

export default function CompanyProblemsPage() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-muted" />}>
      <CompanyProblemsTable />
    </Suspense>
  );
}
