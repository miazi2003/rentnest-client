import React from "react";
import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center text-center px-4 py-12">
      <div className="flex size-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-6">
        <FileQuestion className="size-10" />
      </div>

      <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
        404 Error
      </span>

      <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-slate-950 dark:text-white font-heading">
        Page Not Found
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        Sorry, the page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700 font-semibold">
            <Home className="size-4" />
            Go to Homepage
          </Button>
        </Link>
        <Link href="/properties">
          <Button variant="outline" className="gap-2 border-slate-200 dark:border-white/15">
            <ArrowLeft className="size-4" />
            Browse Properties
          </Button>
        </Link>
      </div>
    </div>
  );
}
