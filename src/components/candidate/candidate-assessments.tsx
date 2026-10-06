"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";
import { attemptApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { RedeemInvitation } from "@/components/candidate/redeem-invitation";
import { AttemptStatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";

export function CandidateAssessments() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? undefined;

  const { data: attempts, isLoading } = useQuery({
    queryKey: ["my-history"],
    queryFn: attemptApi.myHistory,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments"
        description="Redeem an invitation or resume an assessment in progress."
      />

      <RedeemInvitation initialToken={token} />

      <Card>
        <CardHeader>
          <CardTitle>Your assessments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (attempts ?? []).length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No assessments yet"
              description="Redeem an invitation token above to begin."
            />
          ) : (
            (attempts ?? []).map((a) => (
              <Link
                key={a.id}
                href={a.status === "IN_PROGRESS" ? `/candidate/attempt/${a.id}` : `/candidate/history`}
                className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {a.assessment?.title ?? "Assessment"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.assessment?.durationMinutes} min · {formatDate(a.startedAt ?? a.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {a.score != null && <span className="text-sm font-medium">{a.score}</span>}
                  <AttemptStatusBadge status={a.status} />
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
