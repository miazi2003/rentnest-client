"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled Application Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4 py-12">
      <div className="flex size-16 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-6">
        <AlertCircle className="size-8" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white font-heading">
        Something Went Wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        We encountered an unexpected error processing your request. Please try refreshing or return home.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={() => reset()}
          className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold"
        >
          <RefreshCw className="size-4" />
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" className="gap-2 border-slate-200 dark:border-white/15">
            <Home className="size-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
