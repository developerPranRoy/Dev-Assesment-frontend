import { CandidateAssessmentDetail } from "@/components/candidate/candidate-assessment-detail";

export const dynamic = 'force-dynamic';

export const metadata = { title: "Assessment — DevAssess" };

export default function CandidateAssessmentDetailRoute({ params }: { params: { id: string } }) {
  return <CandidateAssessmentDetail assessmentId={params.id} />;
}
