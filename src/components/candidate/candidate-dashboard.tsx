"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  BookOpen,
  ClipboardCheck,
  Trophy,
  Loader2,
  Ticket,
  ArrowRight,
} from "lucide-react";
import { attemptApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { AttemptStatusBadge } from "@/components/shared/status-badge";
import { RedeemInvitation } from "@/components/candidate/redeem-invitation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";

export function CandidateDashboard() {
  const { data: attempts, isLoading } = useQuery({
    queryKey: ["my-history"],
    queryFn: attemptApi.myHistory,
  });

  const list = attempts ?? [];
  const inProgress = list.filter((a) => a.status === "IN_PROGRESS").length;
  const evaluated = list.filter((a) => a.status === "EVALUATED");
  const avgScore =
    evaluated.length > 0
      ? Math.round(
          evaluated.reduce((sum, a) => sum + (a.score ?? 0), 0) / evaluated.length,
        )
      : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Your assessments, results, and invitations."
        actions={
          <Button asChild variant="outline">
            <Link href="/candidate/assessments">
              <Ticket className="h-4 w-4" /> Redeem invitation
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total attempts" value={list.length} icon={BookOpen} />
        <StatCard label="In progress" value={inProgress} icon={ClipboardCheck} />
        <StatCard label="Avg score" value={avgScore} icon={Trophy} hint="evaluated attempts" />
      </div>

      <RedeemInvitation />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent attempts</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/candidate/history">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : list.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No attempts yet"
              description="Redeem an invitation above to take your first assessment."
            />
          ) : (
            list.slice(0, 5).map((a) => (
              <Link
                key={a.id}
                href={a.status === "IN_PROGRESS" ? `/candidate/attempt/${a.id}` : `/candidate/history`}
                className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {a.assessment?.title ?? "Assessment"}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(a.startedAt ?? a.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  {a.score != null && (
                    <span className="text-sm font-medium">{a.score}</span>
                  )}
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
