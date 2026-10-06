"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/lib/api";
import type { Role } from "@/types";

export const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin/dashboard",
  COMPANY: "/company/dashboard",
  CANDIDATE: "/candidate/dashboard",
};

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);
  const router = useRouter();

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login(email, password);
      setAuth(res);
      return res.user;
    },
    [setAuth],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Stateless JWT — logout is effectively client-side only.
    }
    clear();
    toast.success("Logged out");
    router.push("/login");
  }, [clear, router]);

  return {
    user,
    isAuthenticated,
    role: user?.role ?? null,
    login,
    logout,
    setUser,
    isAdmin: user?.role === "ADMIN",
    isCompany: user?.role === "COMPANY",
    isCandidate: user?.role === "CANDIDATE",
  };
}
