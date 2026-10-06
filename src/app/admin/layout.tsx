export const dynamic = 'force-dynamic';

import { RouteGuard } from "@/components/auth/route-guard";
import { AppShell } from "@/components/layout/app-shell";
import { ADMIN_NAV } from "@/config/nav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={["ADMIN"]}>
      <AppShell navItems={ADMIN_NAV}>{children}</AppShell>
    </RouteGuard>
  );
}
