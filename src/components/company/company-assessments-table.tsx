"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ClipboardList, Loader2, Plus } from "lucide-react";
import { assessmentApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { AssessmentStatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import type { AssessmentStatus } from "@/types";

const LIMIT = 9;

export function CompanyAssessmentsTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = (searchParams.get("status") as AssessmentStatus | null) ?? null;
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? LIMIT);

  const { data, isLoading } = useQuery({
    queryKey: ["assessments", { status, page, limit }],
    queryFn: () => assessmentApi.list({ status: status ?? undefined, page, limit }),
  });

  function updateUrl(params: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    if ("status" in params) next.set("page", "1");
    router.push(`${pathname}?${next.toString()}`);
  }

  const rows = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments"
        description="Build, publish, and manage your assessments."
        actions={
          <Button asChild>
            <Link href="/company/assessments/new">
              <Plus className="h-4 w-4" /> New assessment
            </Link>
          </Button>
        }
      />

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Status</span>
        <Select
          value={status ?? "ALL"}
          onValueChange={(v) => updateUrl({ status: v === "ALL" ? null : v })}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No assessments yet"
          description="Create your first assessment to invite candidates."
          action={
            <Button asChild>
              <Link href="/company/assessments/new">
                <Plus className="h-4 w-4" /> New assessment
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((a) => (
            <Link key={a.id} href={`/company/assessments/${a.id}`}>
              <Card className="h-full transition-colors hover:border-primary/50 hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{a.title}</CardTitle>
                    <AssessmentStatusBadge status={a.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {a.description && <p className="line-clamp-2">{a.description}</p>}
                  <div className="flex items-center justify-between">
                    <span>{a.durationMinutes} min · pass {a.passingScore}</span>
                    <span>{formatDate(a.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {data && <Pagination meta={data.meta} onPageChange={(p) => updateUrl({ page: String(p) })} />}
    </div>
  );
}
