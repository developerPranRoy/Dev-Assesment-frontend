"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import { FileCheck2, Loader2, Search, ClipboardCheck } from "lucide-react";
import { attemptApi, submissionApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import {
  SubmissionStatusBadge,
  ProblemTypeBadge,
  AttemptStatusBadge,
} from "@/components/shared/status-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Submission } from "@/types";

export function CompanySubmissions() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId") ?? "";
  const [input, setInput] = useState(attemptId);

  const { data: attempt, isLoading } = useQuery({
    queryKey: ["attempt", attemptId],
    queryFn: () => attemptApi.get(attemptId),
    enabled: !!attemptId,
    retry: false,
  });

  function loadAttempt(id: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (id) next.set("attemptId", id);
    else next.delete("attemptId");
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evaluate submissions"
        description="Load an attempt to review and score candidate answers."
      />

      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loadAttempt(input.trim());
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter an attempt ID"
                className="pl-9 font-mono"
              />
            </div>
            <Button type="submit" disabled={!input.trim()}>
              Load
            </Button>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">
            Tip: attempt IDs are shared when a candidate submits an assessment.
          </p>
        </CardContent>
      </Card>

      {!attemptId && (
        <EmptyState
          icon={FileCheck2}
          title="Enter an attempt ID to begin"
          description="Submissions are reviewed per attempt. Load one above to see its questions and answers."
        />
      )}

      {attemptId && isLoading && (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {attempt && (
        <div className="space-y-4">
          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm font-medium">Attempt {attempt.id}</p>
                <p className="text-xs text-muted-foreground">
                  Assessment: {attempt.assessment?.title ?? attempt.assessmentId}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {attempt.assessment && <Badge variant="outline">{attempt.assessment.title}</Badge>}
                <AttemptStatusBadge status={attempt.status} />
                {attempt.score != null && (
                  <Badge variant="secondary">Score: {attempt.score}</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {(attempt.submissions ?? []).length === 0 ? (
            <EmptyState icon={ClipboardCheck} title="No submissions on this attempt" />
          ) : (
            (attempt.submissions ?? []).map((sub) => (
              <SubmissionCard key={sub.id} submission={sub} attemptId={attempt.id} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function SubmissionCard({ submission, attemptId }: { submission: Submission; attemptId: string }) {
  const qc = useQueryClient();
  const [score, setScore] = useState(
    submission.manualScore != null ? String(submission.manualScore) : "",
  );

  const evaluateMutation = useMutation({
    mutationFn: () => submissionApi.evaluate(submission.id, { manualScore: Number(score) }),
    onSuccess: () => {
      toast.success("Submission evaluated");
      qc.invalidateQueries({ queryKey: ["attempt", attemptId] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "Failed to evaluate")),
  });

  const answerText = (() => {
    if (typeof submission.answer === "string") return submission.answer;
    try {
      return JSON.stringify(submission.answer, null, 2);
    } catch {
      return String(submission.answer);
    }
  })();

  const isWritten = submission.problem?.type === "WRITTEN";
  const canEvaluate = isWritten || submission.status === "PENDING";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{submission.problem?.title ?? "Problem"}</CardTitle>
          <div className="flex items-center gap-2">
            {submission.problem && <ProblemTypeBadge type={submission.problem.type} />}
            <SubmissionStatusBadge status={submission.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {submission.problem?.statement && (
          <p className="text-sm text-muted-foreground">{submission.problem.statement}</p>
        )}
        <div className="rounded-md bg-muted/50 p-3">
          <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">Candidate answer</p>
          <pre className="whitespace-pre-wrap break-words font-mono text-sm">{answerText}</pre>
        </div>
        {(submission.autoScore != null || submission.manualScore != null) && (
          <div className="flex flex-wrap gap-2 text-sm">
            {submission.autoScore != null && (
              <Badge variant="outline">Auto: {submission.autoScore}</Badge>
            )}
            {submission.manualScore != null && (
              <Badge variant="outline">Manual: {submission.manualScore}</Badge>
            )}
          </div>
        )}
        {canEvaluate && (
          <div className="flex flex-col gap-2 rounded-md border bg-card p-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <label className="text-xs text-muted-foreground">
                Manual score (out of {submission.problem?.points ?? 100})
              </label>
              <Input
                type="number"
                min={0}
                max={submission.problem?.points ?? undefined}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="mt-1 w-32"
              />
            </div>
            <Button
              onClick={() => evaluateMutation.mutate()}
              disabled={evaluateMutation.isPending || score === ""}
            >
              {evaluateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save score"}
            </Button>
          </div>
        )}
        {!canEvaluate && (
          <p className="text-sm text-muted-foreground">
            This submission is already evaluated.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
