import { ActiveAttempt } from "@/components/candidate/active-attempt";

export const dynamic = 'force-dynamic';

export const metadata = { title: "Attempt — DevAssess" };

export default function ActiveAttemptRoute({ params }: { params: { attemptId: string } }) {
  return <ActiveAttempt attemptId={params.attemptId} />;
}
