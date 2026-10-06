import { EditProblemPage } from "@/components/company/edit-problem-page";

export const dynamic = 'force-dynamic';

export const metadata = { title: "Edit Problem — DevAssess" };

export default function EditProblemPageRoute({ params }: { params: { id: string } }) {
  return <EditProblemPage problemId={params.id} />;
}
