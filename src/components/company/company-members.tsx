"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, UserPlus, Users2 } from "lucide-react";
import { useCompany } from "@/hooks/use-company";
import { useAuthStore } from "@/store/auth-store";
import { addMemberSchema, type AddMemberValues } from "@/lib/validations";
import { companyApi, getApiErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { CompanySetupCard } from "@/components/company/company-setup-card";
import { PermissionBadge } from "@/components/shared/status-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getInitials } from "@/lib/utils";

export function CompanyMembers() {
  const { company, isLoading, needsSetup } = useCompany();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);

  const isOwner = company?.ownerId === currentUserId;

  const form = useForm<AddMemberValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: { email: "", permissionLevel: "EVALUATOR" },
  });

  async function onSubmit(values: AddMemberValues) {
    if (!company) return;
    setLoading(true);
    try {
      await companyApi.addMember(company.id, values);
      toast.success(`Invited ${values.email} as ${values.permissionLevel}`);
      form.reset({ email: "", permissionLevel: "EVALUATOR" });
      qc.invalidateQueries({ queryKey: ["company", company.id] });
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to add member"));
    } finally {
      setLoading(false);
    }
  }

  if (needsSetup) return <CompanySetupCard />;

  return (
    <div className="space-y-6">
      <PageHeader title="Members" description="Manage who belongs to your company and their permission level." />

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users2 className="h-5 w-5" /> {company?.members?.length ?? 0} member
                  {(company?.members?.length ?? 0) === 1 ? "" : "s"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Permission</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(company?.members ?? []).map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getInitials(m.user?.name ?? "?")}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{m.user?.name}</p>
                              <p className="text-xs text-muted-foreground">{m.user?.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <PermissionBadge level={m.permissionLevel} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" /> Add member
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isOwner ? (
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" placeholder="teammate@acme.dev" {...form.register("email")} />
                      {form.formState.errors.email && (
                        <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Permission level</Label>
                      <Select
                        value={form.watch("permissionLevel")}
                        onValueChange={(v) =>
                          form.setValue("permissionLevel", v as "CREATOR" | "EVALUATOR")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CREATOR">Creator — manage problems & assessments</SelectItem>
                          <SelectItem value="EVALUATOR">Evaluator — evaluate submissions only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add member"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      The teammate must already have a COMPANY account.
                    </p>
                  </form>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Only the company owner can add members. You are an{" "}
                    {company?.members?.find((m) => m.userId === currentUserId)?.permissionLevel}.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
