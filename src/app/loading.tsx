import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm">Loading…</span>
      </div>
    </div>
  );
}
