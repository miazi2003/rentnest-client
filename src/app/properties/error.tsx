"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PropertiesError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Properties error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-600 dark:text-rose-400"><AlertCircle className="size-8" /></div>
      <h1 className="font-heading text-2xl font-black tracking-tight text-slate-950 dark:text-white">Properties could not be loaded</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">Please try again or return home.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset} className="gap-2 bg-emerald-600 font-semibold text-white hover:bg-emerald-700"><RefreshCw className="size-4" /> Try Again</Button>
        <Link href="/"><Button variant="outline" className="gap-2 border-slate-200 dark:border-white/15"><Home className="size-4" /> Back to Home</Button></Link>
      </div>
    </div>
  );
}
