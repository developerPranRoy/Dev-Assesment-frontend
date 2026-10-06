import { Suspense } from "react";
import { AdminAuditLogs } from "@/components/admin/admin-audit-logs";

export const dynamic = 'force-dynamic';

export const metadata = { title: "Audit Logs — DevAssess Admin" };

export default function AdminAuditLogsPage() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-muted" />}>
      <AdminAuditLogs />
    </Suspense>
  );
}
