import React from "react";
import { Clock, CheckCircle2, XCircle, Check } from "lucide-react";

interface RentalStatusBadgeProps {
  status:
    | "PENDING"
    | "APPROVED"
    | "ACTIVE"
    | "REJECTED"
    | "COMPLETED"
    | string;
}

export function RentalStatusBadge({ status }: RentalStatusBadgeProps) {
  const s = status.toUpperCase();

  switch (s) {
    case "APPROVED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          APPROVED
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
          <XCircle className="w-3 h-3 text-rose-600" />
          REJECTED
        </span>
      );
    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800">
          <Check className="w-3 h-3 text-purple-600" />
          COMPLETED
        </span>
      );
      case "ACTIVE":
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800">
      <CheckCircle2 className="w-3 h-3 text-blue-600" />
      ACTIVE
    </span>
  );
    case "PENDING":
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800">
          <Clock className="w-3 h-3 text-amber-600" />
          PENDING
        </span>
      );
  }
}
