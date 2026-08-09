"use client";

import * as React from "react";
import {
  LucideIcon,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  FileText,
  CreditCard,
  Star,
  FolderKanban,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type IconType =
  | "users"
  | "properties"
  | "rentals"
  | "payments"
  | "reviews"
  | "categories"
  | LucideIcon;

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: IconType;
  iconBgColor?: string;
  iconColor?: string;
}

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  properties: Building2,
  rentals: FileText,
  payments: CreditCard,
  reviews: Star,
  categories: FolderKanban,
};

export function StatsCard({
  title,
  value,
  subtitle = "Updated today",
  trend,
  icon,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
}: StatsCardProps) {
  const IconComponent: LucideIcon =
    typeof icon === "string" ? iconMap[icon] || Users : icon;

  return (
    <Card className="rounded-[1.5rem] border-0 bg-white shadow-sm dark:border dark:border-white/15 dark:bg-transparent dark:shadow-none transition-all duration-200">
      <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
              iconBgColor,
              iconColor
            )}
          >
            <IconComponent className="h-5 w-5 shrink-0" />
          </div>

          {trend && (
            <Badge
              variant={trend.isPositive ? "success" : "destructive"}
              className="gap-1 text-[11px] font-semibold py-0.5 px-2 rounded-full border-none"
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{trend.value}</span>
            </Badge>
          )}
        </div>

        <div>
          <p className="text-2xl font-black tracking-tight text-slate-950 dark:text-white font-heading">
            {value}
          </p>
          <div className="flex items-center justify-between mt-1">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
              {title}
            </h3>
          </div>
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1">
            {subtitle}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
