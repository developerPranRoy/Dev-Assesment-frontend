"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-7 w-7 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred while rendering this page. You can try again.
        </p>
        {error?.message && (
          <p className="rounded-md bg-muted px-3 py-2 text-left font-mono text-xs text-muted-foreground">
            {error.message}
          </p>
        )}
        <Button onClick={reset}>
          <RotateCcw className="h-4 w-4" /> Try again
        </Button>
      </div>
    </div>
  );
}
