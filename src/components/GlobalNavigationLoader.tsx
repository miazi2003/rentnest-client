"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function GlobalNavigationLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 0);
    return () => window.clearTimeout(timer);
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
    window.addEventListener("rentnest:navigation-start", showLoader);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", showLoader);
      window.removeEventListener("rentnest:navigation-start", showLoader);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 animate-pulse transition-all duration-300"
      role="status"
      aria-label="Loading page"
    />
  );
}
