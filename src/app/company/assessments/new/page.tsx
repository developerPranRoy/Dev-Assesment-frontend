import { AssessmentForm } from "@/components/company/assessment-form";
import { PageHeader } from "@/components/shared/page-header";

export const dynamic = 'force-dynamic';

export const metadata = { title: "New Assessment — DevAssess" };

export default function NewAssessmentPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="New assessment" description="Create a timed assessment for candidates." />
      <div className="mx-auto max-w-2xl">
        <AssessmentForm />
      </div>
    </div>
  );
}
