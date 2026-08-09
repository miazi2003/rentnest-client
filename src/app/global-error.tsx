"use client";

import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-slate-950 text-white p-6 font-sans">
        <div className="max-w-md text-center space-y-6">
          <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
            ⚠️
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Critical System Error</h1>
          <p className="text-sm text-slate-400">
            An unhandled system error occurred. Click below to recover the application session.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
          >
            Reset Application
          </button>
        </div>
      </body>
    </html>
  );
}
