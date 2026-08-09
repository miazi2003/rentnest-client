import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card p-2.5 shadow-xs space-y-4">
      <div className="flex flex-1 flex-col px-3 pt-3 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full shrink-0" />
        </div>
        <Skeleton className="h-10 w-full rounded-md" />
        <div className="pt-4 flex items-center justify-between mt-auto">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>
      <Skeleton className="aspect-[1.08] w-full rounded-[1.35rem]" />
    </div>
  );
}
