import { ProblemForm } from "@/components/company/problem-form";
import { PageHeader } from "@/components/shared/page-header";

export const dynamic = 'force-dynamic';

export const metadata = { title: "New Problem — DevAssess" };

export default function NewProblemPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="New problem" description="Create a new assessment problem." />
      <div className="mx-auto max-w-3xl">
        <ProblemForm />
      </div>
    </div>
  );
}
