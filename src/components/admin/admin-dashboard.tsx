"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Users, Building2, ClipboardList, FileCheck2, CreditCard, Loader2 } from "lucide-react";
import { adminApi } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "hsl(var(--chart-5))",
  COMPANY: "hsl(var(--chart-1))",
  CANDIDATE: "hsl(var(--chart-2))",
};

export function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminApi.dashboardStats,
  });

  // Role breakdown for the chart — each returns total via meta.
  const adminQ = useQuery({
    queryKey: ["admin-users-count", "ADMIN"],
    queryFn: () => adminApi.listUsers({ role: "ADMIN", limit: 1, page: 1 }),
  });
  const companyQ = useQuery({
    queryKey: ["admin-users-count", "COMPANY"],
    queryFn: () => adminApi.listUsers({ role: "COMPANY", limit: 1, page: 1 }),
  });
  const candidateQ = useQuery({
    queryKey: ["admin-users-count", "CANDIDATE"],
    queryFn: () => adminApi.listUsers({ role: "CANDIDATE", limit: 1, page: 1 }),
  });

  const roleData = [
    { role: "Admin", count: adminQ.data?.meta.total ?? 0 },
    { role: "Company", count: companyQ.data?.meta.total ?? 0 },
    { role: "Candidate", count: candidateQ.data?.meta.total ?? 0 },
  ];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Platform-wide overview of users, assessments, and payments."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Users" value={stats?.totalUsers ?? 0} icon={Users} />
        <StatCard label="Total Companies" value={stats?.totalCompanies ?? 0} icon={Building2} />
        <StatCard label="Total Assessments" value={stats?.totalAssessments ?? 0} icon={ClipboardList} />
        <StatCard label="Total Attempts" value={stats?.totalAttempts ?? 0} icon={FileCheck2} />
        <StatCard label="Completed Payments" value={stats?.completedPayments ?? 0} icon={CreditCard} />
        <StatCard
          label="Assessments per User"
          value={
            stats && stats.totalUsers > 0
              ? (stats.totalAssessments / stats.totalUsers).toFixed(2)
              : "0"
          }
          icon={ClipboardList}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users by Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <XAxis dataKey="role" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))" }}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--popover))",
                    color: "hsl(var(--popover-foreground))",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={80}>
                  {roleData.map((entry) => (
                    <Cell
                      key={entry.role}
                      fill={
                        entry.role === "Admin"
                          ? ROLE_COLORS.ADMIN
                          : entry.role === "Company"
                            ? ROLE_COLORS.COMPANY
                            : ROLE_COLORS.CANDIDATE
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
