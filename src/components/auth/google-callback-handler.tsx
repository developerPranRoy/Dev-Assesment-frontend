"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import { authApi, getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";

export function GoogleCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setError("Missing Google login code. Please try signing in again.");
      return;
    }
    let active = true;
    authApi
      .exchangeGoogleCode(code)
      .then((res) => {
        if (!active) return;
        setAuth(res);
        const home =
          res.user.role === "ADMIN"
            ? "/admin/dashboard"
            : res.user.role === "COMPANY"
              ? "/company/dashboard"
              : "/candidate/dashboard";
        router.replace(home);
      })
      .catch((err) => {
        if (!active) return;
        setError(getApiErrorMessage(err, "Google login failed"));
      });
    return () => {
      active = false;
    };
  }, [searchParams, setAuth, router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="text-xl font-bold">Google login failed</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => router.push("/login")}>Back to login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm">Completing Google sign-in…</p>
      </div>
    </div>
  );
}
