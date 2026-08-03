import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalLoading() {
  return (
    <div
      className="flex min-h-[calc(100vh-4rem)] w-full flex-col bg-[#FAFAFA] px-4 py-8 dark:bg-background sm:px-6 lg:px-8"
      aria-label="Loading page"
      aria-busy="true"
    >
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-3">
            <Skeleton className="h-8 w-56 sm:w-72" />
            <Skeleton className="h-4 w-72 max-w-full sm:w-96" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        <Skeleton className="aspect-[16/5] min-h-52 w-full rounded-2xl" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="space-y-4 rounded-2xl border border-slate-200/70 bg-white p-5 dark:border-border dark:bg-card"
            >
              <Skeleton className="aspect-video w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-2/3" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-9 w-24 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading content, please wait.</span>
    </div>
  );
}
