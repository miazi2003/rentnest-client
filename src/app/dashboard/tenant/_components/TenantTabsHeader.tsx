"use client";

import React from "react";
import { GitPullRequest, CreditCard, Search, Filter } from "lucide-react";
import { TenantDashboardTab } from "../types/tenant.types";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TenantTabsHeaderProps {
  activeTab: TenantDashboardTab;
  setActiveTab: (tab: TenantDashboardTab) => void;
  requestsCount: number;
  paymentsCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export const TenantTabsHeader: React.FC<TenantTabsHeaderProps> = ({
  activeTab,
  requestsCount,
  paymentsCount,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="p-4 sm:p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/40">

      <TabsList className="h-auto p-1 bg-muted rounded-2xl">
        <TabsTrigger
          value="requests"
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl font-semibold text-sm cursor-pointer data-active:bg-background data-active:text-foreground data-active:shadow-xs"
        >
          <GitPullRequest className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Rental Request List</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "requests"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                : "bg-slate-300/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            }`}
          >
            {requestsCount}
          </span>
        </TabsTrigger>

        <TabsTrigger
          value="payments"
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl font-semibold text-sm cursor-pointer data-active:bg-background data-active:text-foreground data-active:shadow-xs"
        >
          <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Payment History List</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === "payments"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-slate-300/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            }`}
          >
            {paymentsCount}
          </span>
        </TabsTrigger>
      </TabsList>


      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full md:w-auto md:min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={
              activeTab === "requests"
                ? "Search property or landlord..."
                : "Search payments or txn ID..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-foreground"
          />
        </div>

        {activeTab === "requests" && (
          <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING (Yellow)</option>
              <option value="APPROVED">APPROVED (Blue)</option>
              <option value="ACTIVE">ACTIVE (Green)</option>
              <option value="REJECTED">REJECTED (Red)</option>
              <option value="COMPLETED">COMPLETED (Gray)</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
