"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
        <AlertCircle className="size-8" />
      </div>
      <h1 className="font-heading text-2xl font-black tracking-tight text-slate-950 dark:text-white">Dashboard data could not be loaded</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">Please check your connection and try loading this dashboard again.</p>
      <Button onClick={reset} className="mt-8 gap-2 bg-emerald-600 font-semibold text-white hover:bg-emerald-700">
        <RefreshCw className="size-4" /> Try Again
      </Button>
    </div>
  );
}
