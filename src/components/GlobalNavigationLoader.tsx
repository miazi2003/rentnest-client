"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export function GlobalNavigationLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsLoading(false));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname) return;

      setIsLoading(true);
    };

    const showLoader = () => setIsLoading(true);
    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("popstate", showLoader);
    window.addEventListener("beforeunload", showLoader);
    window.addEventListener("rentnest:navigation-start", showLoader);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", showLoader);
      window.removeEventListener("beforeunload", showLoader);
      window.removeEventListener("rentnest:navigation-start", showLoader);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#FAFAFA] px-4 py-8 dark:bg-background sm:px-6 lg:px-8"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-xl" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-8 w-64 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        <Skeleton className="aspect-[16/5] min-h-48 w-full rounded-2xl" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="space-y-4 rounded-2xl border border-slate-200/70 bg-white p-5 dark:border-border dark:bg-card">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-2/3" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading content, please wait.</span>
    </div>
  );
}
