import { PropertyCardSkeleton } from "./components/PropertyCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertiesLoading() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-8 px-4 py-6 sm:px-6 sm:py-10 lg:px-8" aria-busy="true" aria-label="Loading properties">
      <div className="space-y-2"><Skeleton className="h-9 w-64" /><Skeleton className="h-4 w-96 max-w-full" /></div>
      <Skeleton className="h-16 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => <PropertyCardSkeleton key={index} />)}
      </div>
    </div>
  );
}
