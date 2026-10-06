"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import { Users as UsersIcon, Loader2 } from "lucide-react";
import { adminApi } from "@/lib/api";
import { ChangeRoleDialog } from "@/components/admin/change-role-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { RoleBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import type { Role } from "@/types";

const LIMIT = 10;

export function AdminUsersTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const role = (searchParams.get("role") as Role | null) ?? null;
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? LIMIT);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", { role, page, limit }],
    queryFn: () => adminApi.listUsers({ role: role ?? undefined, page, limit }),
  });

  function updateUrl(params: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    // changing the role resets pagination
    if ("role" in params) {
      next.set("page", "1");
    }
    router.push(`${pathname}?${next.toString()}`);
  }

  const rows = useMemo(() => data?.data ?? [], [data]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage platform users and their roles."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Role</span>
            <Select
              value={role ?? "ALL"}
              onValueChange={(v) => updateUrl({ role: v === "ALL" ? null : v })}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="COMPANY">Company</SelectItem>
                <SelectItem value="CANDIDATE">Candidate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="rounded-lg border bg-card">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState icon={UsersIcon} title="No users found" description="Try a different role filter." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <ChangeRoleDialog user={user} />
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
