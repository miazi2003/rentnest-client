import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailsLoading() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-8 px-4 py-8 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading property details">
      <Skeleton className="h-4 w-64" />
      <div className="grid gap-8 lg:grid-cols-[1.55fr_0.75fr]">
        <div className="space-y-6"><Skeleton className="aspect-[16/9] w-full rounded-3xl" /><Skeleton className="h-10 w-2/3" /><Skeleton className="h-32 w-full rounded-3xl" /></div>
        <Skeleton className="h-[420px] w-full rounded-3xl" />
      </div>
    </div>
  );
}
