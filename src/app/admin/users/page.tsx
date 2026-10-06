import { Suspense } from "react";
import { AdminUsersTable } from "@/components/admin/admin-users-table";

export const dynamic = 'force-dynamic';

export const metadata = { title: "Users — DevAssess Admin" };

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-muted" />}>
      <AdminUsersTable />
    </Suspense>
  );
}
