"use client";
import { ErrorView } from "@/components/shared/error-view";
export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorView error={error} reset={reset} title="Admin error" description="We couldn't load this admin page." />;
}
