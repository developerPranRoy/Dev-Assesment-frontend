"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { History, Loader2, Play } from "lucide-react";
import { attemptApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { AttemptStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

export function CandidateHistory() {
  const { data: attempts, isLoading } = useQuery({
    queryKey: ["my-history"],
    queryFn: attemptApi.myHistory,
  });

  const list = attempts ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="History" description="All your assessment attempts and results." />

      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            icon={History}
            title="No attempts yet"
            description="Your completed and in-progress assessments will appear here."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-40">Score</TableHead>
                <TableHead>Started</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((a) => {
                const passScore = a.assessment?.passingScore ?? 0;
                const pct = a.score != null && passScore > 0 ? Math.min(100, (a.score / passScore) * 100) : 0;
                return (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.assessment?.title ?? "Assessment"}</TableCell>
                    <TableCell>
                      <AttemptStatusBadge status={a.status} />
                    </TableCell>
                    <TableCell>
                      {a.score != null ? (
                        <div className="space-y-1">
                          <span className="text-sm font-medium">{a.score}</span>
                          <Progress value={pct} className="h-1.5" />
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(a.startedAt ?? a.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {a.status === "IN_PROGRESS" ? (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/candidate/attempt/${a.id}`}>
                            <Play className="h-3.5 w-3.5" /> Resume
                          </Link>
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
