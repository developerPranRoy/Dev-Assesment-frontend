"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ScrollText, Loader2 } from "lucide-react";
import { adminApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

const LIMIT = 10;

export function AdminAuditLogs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? LIMIT);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-audit-logs", { page, limit }],
    queryFn: () => adminApi.auditLogs({ page, limit }),
  });

  function updateUrl(params: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(params)) {
      next.set(key, value);
    }
    router.push(`${pathname}?${next.toString()}`);
  }

  const rows = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" description="A trail of every state-changing action on the platform." />

      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState icon={ScrollText} title="No audit logs yet" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs font-medium">{log.action}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <Badge variant="outline" className="w-fit">{log.entityType}</Badge>
                      <span className="font-mono text-xs text-muted-foreground">
                        {log.entityId}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {log.actor ? (
                      <span className="text-sm">
                        {log.actor.name}
                        <span className="block text-xs text-muted-foreground">{log.actor.email}</span>
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-muted-foreground">
                        {log.actorId ?? "system"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(log.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {data && <Pagination meta={data.meta} onPageChange={(p) => updateUrl({ page: String(p) })} />}
    </div>
  );
}
