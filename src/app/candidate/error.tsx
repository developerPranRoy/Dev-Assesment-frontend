"use client";
import { ErrorView } from "@/components/shared/error-view";
export default function CandidateError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorView error={error} reset={reset} title="Error" description="We couldn't load this page." />;
}
