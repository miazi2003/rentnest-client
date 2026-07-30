"use client";

import React from "react";
import {
  GitPullRequest,
  Clock,
  ShieldCheck,
  Wallet,
  FileText,
  Building2,
  CreditCard,
} from "lucide-react";
import { ITenantStats } from "../types/tenant.types";

interface TenantStatsCardsProps {
  stats: ITenantStats;
}

export const TenantStatsCards: React.FC<TenantStatsCardsProps> = ({ stats }) => {
  const {
    totalRequests,
    pendingRequests,
    activeRentals,
    approvedRequests,
    totalPaymentAmount,
    totalPaymentsCount,
  } = stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Card 1: Total Requests */}
      <div className="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Requests
          </span>
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/50 group-hover:scale-105 transition-transform">
            <GitPullRequest className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900 dark:text-white">
            {totalRequests}
          </span>
          <span className="text-xs font-medium text-slate-500">Applications</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
          <FileText className="w-3.5 h-3.5" />
          All submitted rental requests
        </div>
      </div>

      {/* Card 2: Pending Requests */}
      <div className="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Pending Requests
          </span>
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/50 group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900 dark:text-white">
            {pendingRequests}
          </span>
          <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-md font-semibold">
            Awaiting Approval
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
          <Clock className="w-3.5 h-3.5" />
          Under review by landlord
        </div>
      </div>

      {/* Card 3: Active Rentals */}
      <div className="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Active Rentals
          </span>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900 dark:text-white">
            {activeRentals}
          </span>
          {approvedRequests > 0 && (
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-md">
              +{approvedRequests} Ready to Pay
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <Building2 className="w-3.5 h-3.5" />
          Current active tenancies
        </div>
      </div>

      {/* Card 4: Total Payment Amount */}
      <div className="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Payments
          </span>
          <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-100 dark:border-teal-900/50 group-hover:scale-105 transition-transform">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-slate-900 dark:text-white">
            ${totalPaymentAmount.toLocaleString()}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-medium">
          <CreditCard className="w-3.5 h-3.5" />
          {totalPaymentsCount} transactions processed
        </div>
      </div>
    </div>
  );
};
