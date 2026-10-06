"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Code2,
  ClipboardList,
  CreditCard,
  Loader2,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useCompany } from "@/hooks/use-company";
import { assessmentApi, problemApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { CompanySetupCard } from "@/components/company/company-setup-card";
import { CompanyCard } from "@/components/shared/company-card";
import { AssessmentStatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export function CompanyDashboard() {
  const { company, isLoading, needsSetup } = useCompany();

  const problemsQ = useQuery({
    queryKey: ["problems", { page: 1, limit: 5 }],
    queryFn: () => problemApi.list({ page: 1, limit: 5 }),
  });
  const assessmentsQ = useQuery({
    queryKey: ["assessments", { page: 1, limit: 5 }],
    queryFn: () => assessmentApi.list({ page: 1, limit: 5 }),
  });

  if (needsSetup) return <CompanySetupCard />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={company ? `Managing ${company.name}` : "Welcome back."}
        actions={
          <Button asChild>
            <Link href="/company/assessments/new">
              <Plus className="h-4 w-4" /> New assessment
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Credits"
              value={company?.credits ?? 0}
              icon={CreditCard}
              hint="1 credit per invited candidate"
            />
            <StatCard label="Problems" value={problemsQ.data?.meta.total ?? 0} icon={Code2} />
            <StatCard label="Assessments" value={assessmentsQ.data?.meta.total ?? 0} icon={ClipboardList} />
            <StatCard
              label="Members"
              value={company?.members?.length ?? 0}
              icon={CreditCard}
            />
          </div>

          {company && <CompanyCard company={company} />}

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent assessments</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/company/assessments">
                    View all <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {(assessmentsQ.data?.data ?? []).length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No assessments yet.
                  </p>
                ) : (
                  (assessmentsQ.data?.data ?? []).map((a) => (
                    <Link
                      key={a.id}
                      href={`/company/assessments/${a.id}`}
                      className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{a.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(a.createdAt)}</p>
                      </div>
                      <AssessmentStatusBadge status={a.status} />
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent problems</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/company/problems">
                    View all <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {(problemsQ.data?.data ?? []).length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No problems yet.
                  </p>
                ) : (
                  (problemsQ.data?.data ?? []).map((p) => (
                    <Link
                      key={p.id}
                      href={`/company/problems/${p.id}/edit`}
                      className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.type} · {p.difficulty}</p>
                      </div>
                      <span className="text-sm font-medium">{p.points} pts</span>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
