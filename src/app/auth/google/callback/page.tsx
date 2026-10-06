import { Suspense } from "react";
import { GoogleCallbackHandler } from "@/components/auth/google-callback-handler";

export const dynamic = 'force-dynamic';

export const metadata = { title: "Google sign-in — DevAssess" };

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-muted-foreground">
          Loading…
        </div>
      }
    >
      <GoogleCallbackHandler />
    </Suspense>
  );
}
