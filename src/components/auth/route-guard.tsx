"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { ROLE_HOME } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import type { Role } from "@/types";

const ROLE_HOME_MAP: Record<Role, string> = {
  ADMIN: ROLE_HOME.ADMIN,
  COMPANY: ROLE_HOME.COMPANY,
  CANDIDATE: ROLE_HOME.CANDIDATE,
};

export function RouteGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: Role[];
  children: ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user && !allowedRoles.includes(user.role)) {
      router.replace(ROLE_HOME_MAP[user.role]);
    }
  }, [hydrated, isAuthenticated, user, allowedRoles, router]);

  if (!hydrated || !isAuthenticated || (user && !allowedRoles.includes(user.role))) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
