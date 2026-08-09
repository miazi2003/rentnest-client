"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, PieChart as PieIcon, DollarSign, Layers } from "lucide-react";

interface StatusDistributionItem {
  status: string;
  count: number;
  color: string;
}

interface CategoryBreakdownItem {
  name: string;
  count: number;
  color: string;
}

interface AnalyticsChartsProps {
  rentalStatusData?: StatusDistributionItem[];
  categoryData?: CategoryBreakdownItem[];
  monthlyRevenueData?: { month: string; amount: number; count: number }[];
  title?: string;
  subtitle?: string;
}

const DEFAULT_STATUS_DATA: StatusDistributionItem[] = [
  { status: "Approved", count: 142, color: "bg-emerald-500 text-emerald-500" },
  { status: "Active", count: 95, color: "bg-blue-500 text-blue-500" },
  { status: "Completed", count: 210, color: "bg-purple-500 text-purple-500" },
  { status: "Pending", count: 24, color: "bg-amber-500 text-amber-500" },
  { status: "Rejected", count: 18, color: "bg-rose-500 text-rose-500" },
];

const DEFAULT_CATEGORY_DATA: CategoryBreakdownItem[] = [
  { name: "Apartments & Suites", count: 180, color: "bg-emerald-500" },
  { name: "Luxury Villas", count: 110, color: "bg-purple-500" },
  { name: "Studio Flats", count: 95, color: "bg-blue-500" },
  { name: "Commercial & Office", count: 65, color: "bg-amber-500" },
];

const DEFAULT_MONTHLY_REVENUE = [
  { month: "Mar", amount: 14200, count: 12 },
  { month: "Apr", amount: 18500, count: 15 },
  { month: "May", amount: 22400, count: 19 },
  { month: "Jun", amount: 28900, count: 24 },
  { month: "Jul", amount: 35100, count: 28 },
  { month: "Aug", amount: 42850, count: 34 },
];

export function AnalyticsCharts({
  rentalStatusData = DEFAULT_STATUS_DATA,
  categoryData = DEFAULT_CATEGORY_DATA,
  monthlyRevenueData = DEFAULT_MONTHLY_REVENUE,
  title = "Analytics & Performance",
  subtitle = "Real-time insights and business metrics",
}: AnalyticsChartsProps) {
  const totalStatusCount = useMemo(
    () => rentalStatusData.reduce((acc, item) => acc + item.count, 0) || 1,
    [rentalStatusData]
  );

  const totalCategoryCount = useMemo(
    () => categoryData.reduce((acc, item) => acc + item.count, 0) || 1,
    [categoryData]
  );

  const maxRevenue = useMemo(
    () => Math.max(...monthlyRevenueData.map((d) => d.amount), 1),
    [monthlyRevenueData]
  );

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight text-foreground font-heading">
            {title}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <Badge variant="outline" className="border-border text-xs font-bold gap-1 py-1">
          <TrendingUp className="size-3 text-emerald-600 dark:text-emerald-400" /> Live Data
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Monthly Revenue & Rental Activity Chart */}
        <Card className="lg:col-span-2 rounded-[1.5rem] border-0 bg-white shadow-sm dark:border dark:border-white/15 dark:bg-transparent dark:shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-950 dark:text-white font-heading">Monthly Revenue & Transactions</CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Rental earnings over recent months</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="border-slate-200 dark:border-white/15 text-[11px] font-semibold">
                6-Month Trend
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2 space-y-6">
            {/* Visual Bar Chart */}
            <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 pt-6 px-2 border-b border-slate-100 dark:border-white/10">
              {monthlyRevenueData.map((item) => {
                const heightPercent = Math.max(15, Math.round((item.amount / maxRevenue) * 100));
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-[10px] font-bold py-1 px-2 rounded-lg shadow-md pointer-events-none mb-1 text-center whitespace-nowrap">
                      ${item.amount.toLocaleString()} ({item.count} rentals)
                    </div>

                    {/* Bar Pill */}
                    <div className="w-full max-w-[48px] bg-slate-100 dark:bg-white/10 rounded-2xl h-full flex items-end p-1">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-xl transition-all duration-500 group-hover:from-emerald-500 group-hover:to-emerald-300"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 transition-colors">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>Peak Month: ${maxRevenue.toLocaleString()}</span>
              <span>Average Monthly: ${Math.round(maxRevenue * 0.7).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* 2. Rental Request Status Distribution */}
        <Card className="rounded-[1.5rem] border-0 bg-white shadow-sm dark:border dark:border-white/15 dark:bg-transparent dark:shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <PieIcon className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-950 dark:text-white font-heading">Request Status</CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Application status breakdown</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {rentalStatusData.map((item) => {
              const percent = Math.round((item.count / totalStatusCount) * 100);
              return (
                <div key={item.status} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-950 dark:text-white flex items-center gap-2">
                      <span className={`size-2 rounded-full ${item.color.split(" ")[0]}`} />
                      {item.status}
                    </span>
                    <span className="font-semibold text-slate-500 dark:text-slate-400">
                      {item.count} ({percent}%)
                    </span>
                  </div>
                  <Progress value={percent} className="h-2 bg-slate-100 dark:bg-white/10" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* 3. Property Category Breakdown Bar */}
      {categoryData.length > 0 && (
        <Card className="rounded-[1.5rem] border-0 bg-white shadow-sm dark:border dark:border-white/15 dark:bg-transparent dark:shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Layers className="size-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-950 dark:text-white font-heading">Property Category Distribution</CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Listings ratio across available categories</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryData.map((cat) => {
                const percent = Math.round((cat.count / totalCategoryCount) * 100);
                return (
                  <div
                    key={cat.name}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-white/15 bg-slate-50/50 dark:bg-transparent space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-950 dark:text-white truncate">{cat.name}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{cat.count}</span>
                    </div>
                    <Progress value={percent} className="h-2 bg-slate-200 dark:bg-white/10" />
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 text-right">{percent}% of total</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
