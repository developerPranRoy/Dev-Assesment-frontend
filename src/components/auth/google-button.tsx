"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { authApi, getApiErrorMessage } from "@/lib/api";

export function GoogleButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    try {
      // Verify the backend actually has Google configured before redirecting.
      // The backend returns 501 if GOOGLE_CLIENT_ID isn't set.
      const testUrl = authApi.googleLoginUrl();
      const res = await fetch(testUrl, { method: "GET", redirect: "manual" });
      // A 3xx means the backend is redirecting to Google — that's success.
      // A non-3xx (e.g. 501 JSON) means Google isn't configured.
      if (res.type === "opaqueredirect" || (res.status >= 200 && res.status < 400)) {
        window.location.href = testUrl;
      } else {
        const json = await res.json().catch(() => null);
        const msg =
          json?.message ??
          "Google login is not configured on this server. Use email/password or a demo login instead.";
        toast.error(msg);
        setLoading(false);
      }
    } catch {
      // CORS or network — just navigate directly (the backend handles the redirect).
      window.location.href = authApi.googleLoginUrl();
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogle}
      disabled={loading}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent disabled:opacity-60",
        className,
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <GoogleIcon />
      )}
      Continue with Google
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}
