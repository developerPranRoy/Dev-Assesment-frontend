"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Play, ArrowLeft, Clock, Target, ListChecks } from "lucide-react";
import { assessmentApi, attemptApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { AssessmentStatusBadge, ProblemTypeBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Attempt } from "@/types";

export function CandidateAssessmentDetail({ assessmentId }: { assessmentId: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [starting, setStarting] = useState(false);

  const { data: assessment, isLoading } = useQuery({
    queryKey: ["assessment", assessmentId],
    queryFn: () => assessmentApi.get(assessmentId),
  });

  const { data: myAttempts } = useQuery({
    queryKey: ["my-history"],
    queryFn: attemptApi.myHistory,
  });

  const existing = (myAttempts ?? []).find((a: Attempt) => a.assessmentId === assessmentId);

  async function handleStart() {
    setStarting(true);
    try {
      const attempt = await attemptApi.start(assessmentId);
      qc.invalidateQueries({ queryKey: ["my-history"] });
      router.push(`/candidate/attempt/${attempt.id}`);
    } catch (err) {
      const msg = getApiErrorMessage(err, "Failed to start");
      // 409 → already has an attempt; jump to it if we can find it.
      if (existing && /already|409|conflict/i.test(msg)) {
        toast.info("You already have an attempt for this assessment.");
        router.push(`/candidate/attempt/${existing.id}`);
      } else {
        toast.error(msg);
      }
    } finally {
      setStarting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!assessment) {
    return <p className="text-sm text-muted-foreground">Assessment not found.</p>;
  }

  const canStart = assessment.status === "PUBLISHED" && !existing;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <PageHeader title={assessment.title} description={assessment.description ?? undefined} />

      <div className="flex flex-wrap items-center gap-3">
        <AssessmentStatusBadge status={assessment.status} />
        <Badge variant="outline" className="gap-1.5">
          <Clock className="h-3.5 w-3.5" /> {assessment.durationMinutes} min
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <Target className="h-3.5 w-3.5" /> Pass {assessment.passingScore}
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <ListChecks className="h-3.5 w-3.5" /> {(assessment.problems ?? []).length} questions
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Once you start, the timer counts down from {assessment.durationMinutes} minutes. Your answers are submitted per question.</p>
          <p>Switching tabs or leaving the window is logged as a flagged event. The attempt auto-submits when time expires.</p>
          <p>You need a passing score of {assessment.passingScore} to pass.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Questions in this assessment</CardTitle>
        </CardHeader>
        <CardContent>
          {(assessment.problems ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No questions attached yet.</p>
          ) : (
            <div className="space-y-2">
              {(assessment.problems ?? []).map((ap, i) => (
                <div key={ap.id} className="flex items-center justify-between rounded-md border p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {i + 1}. {ap.problem?.title ?? "Problem"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {ap.problem && <ProblemTypeBadge type={ap.problem.type} />}
                    <Badge variant="secondary">{ap.points} pts</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {existing ? (
          <Button
            size="lg"
            onClick={() =>
              router.push(
                existing.status === "IN_PROGRESS"
                  ? `/candidate/attempt/${existing.id}`
                  : `/candidate/history`,
              )
            }
          >
            {existing.status === "IN_PROGRESS" ? "Continue attempt" : "View result"}
          </Button>
        ) : canStart ? (
          <Button size="lg" onClick={handleStart} disabled={starting}>
            {starting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Start attempt
          </Button>
        ) : (
          <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
            This assessment isn&apos;t available to start right now.
          </p>
        )}
      </div>
    </div>
  );
}
