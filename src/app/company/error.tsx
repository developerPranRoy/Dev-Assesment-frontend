"use client";
import { ErrorView } from "@/components/shared/error-view";
export default function CompanyError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorView error={error} reset={reset} title="Workspace error" description="We couldn't load this company page." />;
}
