"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/lib/api";

/**
 * Validates a persisted session on app load by calling /auth/me.
 * If the access token is invalid/expired the auto-refresh interceptor
 * handles renewal; if that also fails we clear the store.
 */
export function AuthHydrator() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);

  useEffect(() => {
    if (!accessToken) return;
    let active = true;
    authApi
      .me()
      .then((user) => {
        if (active) setUser(user);
      })
      .catch(() => {
        // If the interceptor already refreshed the token, /me may still
        // succeed on retry; only clear on a hard failure.
        if (active && !useAuthStore.getState().accessToken) clear();
      });
    return () => {
      active = false;
    };
  }, [accessToken, setUser, clear]);

  return null;
}
