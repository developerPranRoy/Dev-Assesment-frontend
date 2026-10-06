import { Suspense } from "react";
import { CandidateAssessments } from "@/components/candidate/candidate-assessments";

export const dynamic = 'force-dynamic';

export const metadata = { title: "Assessments — DevAssess" };

export default function CandidateAssessmentsPage() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-muted" />}>
      <CandidateAssessments />
    </Suspense>
  );
}
