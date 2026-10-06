import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function CandidateDashboardLoading() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <Skeleton className="h-48 w-full" />
      </Card>
    </div>
  );
}
