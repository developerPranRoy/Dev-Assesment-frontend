import { Building2, CreditCard, Users2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PermissionBadge } from "@/components/shared/status-badge";
import { getInitials } from "@/lib/utils";
import type { Company } from "@/types";

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          {company.name}
        </CardTitle>
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <CreditCard className="h-4 w-4" />
          {company.credits} credits
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Users2 className="h-4 w-4" /> {company.members?.length ?? 0} member
          {(company.members?.length ?? 0) === 1 ? "" : "s"}
        </p>
        <div className="flex flex-wrap gap-2">
          {(company.members ?? []).map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-2 rounded-lg border bg-card p-2 pr-3"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback>{getInitials(m.user?.name ?? "?")}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">{m.user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{m.user?.email}</p>
              </div>
              <PermissionBadge level={m.permissionLevel} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
