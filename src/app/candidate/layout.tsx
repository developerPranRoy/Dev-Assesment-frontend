export const dynamic = 'force-dynamic';

import { RouteGuard } from "@/components/auth/route-guard";
import { AppShell } from "@/components/layout/app-shell";
import { CANDIDATE_NAV } from "@/config/nav";

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={["CANDIDATE"]}>
      <AppShell navItems={CANDIDATE_NAV}>{children}</AppShell>
    </RouteGuard>
  );
}
