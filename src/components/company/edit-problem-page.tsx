"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { problemApi } from "@/lib/api";
import { ProblemForm } from "@/components/company/problem-form";
import { PageHeader } from "@/components/shared/page-header";

export function EditProblemPage({ problemId }: { problemId: string }) {
  const { data: problem, isLoading } = useQuery({
    queryKey: ["problem", problemId],
    queryFn: () => problemApi.get(problemId),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!problem) {
    return <p className="text-sm text-muted-foreground">Problem not found.</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit problem" description="Update your assessment problem." />
      <div className="mx-auto max-w-3xl">
        <ProblemForm problem={problem} />
      </div>
    </div>
  );
}
