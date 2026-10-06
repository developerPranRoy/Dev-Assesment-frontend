export const dynamic = 'force-dynamic';

import { RouteGuard } from "@/components/auth/route-guard";
import { AppShell } from "@/components/layout/app-shell";
import { COMPANY_NAV } from "@/config/nav";

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={["COMPANY"]}>
      <AppShell navItems={COMPANY_NAV}>{children}</AppShell>
    </RouteGuard>
  );
}
