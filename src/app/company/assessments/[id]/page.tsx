import { AssessmentDetail } from "@/components/company/assessment-detail";

export const dynamic = 'force-dynamic';

export const metadata = { title: "Assessment — DevAssess" };

export default function AssessmentDetailRoute({ params }: { params: { id: string } }) {
  return <AssessmentDetail assessmentId={params.id} />;
}
