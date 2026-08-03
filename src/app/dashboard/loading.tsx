import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="w-full space-y-8 pb-8" aria-label="Loading dashboard">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="hidden h-9 w-32 sm:block" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="space-y-4 rounded-xl bg-white p-5 dark:bg-card">
            <div className="flex items-center justify-between">
              <Skeleton className="size-10 rounded-xl" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-36" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[1, 2].map((item) => (
          <div key={item} className="space-y-5 rounded-xl bg-white p-6 dark:bg-card">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
