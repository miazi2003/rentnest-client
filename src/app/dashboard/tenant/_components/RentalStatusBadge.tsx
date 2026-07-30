"use client";

import React from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Check,
} from "lucide-react";
import { RentalStatus } from "../types/tenant.types";

interface RentalStatusBadgeProps {
  status: RentalStatus;
}

export const RentalStatusBadge: React.FC<RentalStatusBadgeProps> = ({ status }) => {
  const formattedStatus = (status || "PENDING").toUpperCase();

  switch (formattedStatus) {
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100/90 text-amber-800 border border-amber-300/80 shadow-xs dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700/60">
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          PENDING
        </span>
      );

    case "APPROVED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100/90 text-blue-800 border border-blue-300/80 shadow-xs dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-700/60">
          <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          APPROVED
        </span>
      );

    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100/90 text-rose-800 border border-rose-300/80 shadow-xs dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-700/60">
          <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          REJECTED
        </span>
      );

    case "ACTIVE":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/90 text-emerald-800 border border-emerald-300/80 shadow-xs dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-700/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          ACTIVE
        </span>
      );

    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-200/80 text-gray-700 border border-gray-300/80 shadow-xs dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
          <Check className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          COMPLETED
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
          {formattedStatus}
        </span>
      );
  }
};
