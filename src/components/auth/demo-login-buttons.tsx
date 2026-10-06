"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEMO_ACCOUNTS } from "@/config/demo";
import { authApi, getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

export function DemoLoginButtons() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  async function handleDemo(email: string, password: string, redirectPath: string, role: string) {
    setLoadingRole(role);
    try {
      const res = await authApi.login(email, password);
      setAuth(res);
      toast.success(`Logged in as ${res.user.role}`);
      const redirect = searchParams.get("redirect");
      router.push(redirect || redirectPath);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Demo login failed"));
    } finally {
      setLoadingRole(null);
    }
  }

  const iconMap = {
    ADMIN: ShieldCheck,
    COMPANY: Building2,
    CANDIDATE: User,
  } as const;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Quick demo access
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid gap-2.5">
        {DEMO_ACCOUNTS.map((acc) => {
          const Icon = iconMap[acc.role];
          const isLoading = loadingRole === acc.role;
          return (
            <button
              key={acc.role}
              type="button"
              disabled={loadingRole !== null}
              onClick={() => handleDemo(acc.email, acc.password, acc.redirectPath, acc.role)}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors disabled:opacity-60",
                acc.accent,
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Login as {acc.label}</p>
                <p className="truncate text-xs opacity-80">{acc.description}</p>
              </div>
              {isLoading ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              ) : (
                <span className="text-xs font-mono opacity-70">→</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
