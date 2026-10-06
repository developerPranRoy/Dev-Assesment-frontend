import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-primary lg:block" />
      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-md space-y-6">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
