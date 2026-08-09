"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FolderPlus, Users, Building2, FileText, ArrowUpRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuickActionItem {
  id: string;
  title: string;
  description?: string;
  href: string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
}

const defaultQuickActions: QuickActionItem[] = [
  {
    id: "action-1",
    title: "Create Category",
    description: "Add new rental category or type",
    href: "/dashboard/admin/categories/new",
    icon: FolderPlus,
    bgColor: "bg-purple-50 group-hover:bg-purple-100 dark:bg-purple-950/60 dark:group-hover:bg-purple-900/60",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "action-2",
    title: "Manage Users",
    description: "Review tenants, landlords & status",
    href: "/dashboard/admin/users",
    icon: Users,
    bgColor: "bg-blue-50 group-hover:bg-blue-100 dark:bg-blue-950/60 dark:group-hover:bg-blue-900/60",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "action-3",
    title: "View Properties",
    description: "Browse & manage all listings",
    href: "/dashboard/admin/properties",
    icon: Building2,
    bgColor: "bg-emerald-50 group-hover:bg-emerald-100 dark:bg-emerald-950/60 dark:group-hover:bg-emerald-900/60",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "action-4",
    title: "Rental Requests",
    description: "Approve or review pending requests",
    href: "/dashboard/admin/requests",
    icon: FileText,
    bgColor: "bg-amber-50 group-hover:bg-amber-100 dark:bg-amber-950/60 dark:group-hover:bg-amber-900/60",
    textColor: "text-amber-600 dark:text-amber-400",
  },
];

interface QuickActionsProps {
  actions?: QuickActionItem[];
}

export function QuickActions({ actions = defaultQuickActions }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.id} href={action.href} className="group block">
            <Card className="rounded-[1.5rem] border-0 bg-white shadow-sm dark:border dark:border-white/15 dark:bg-transparent dark:shadow-none transition-all duration-200 h-full">
              <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200",
                      action.bgColor,
                      action.textColor
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="h-8 w-8 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  {action.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {action.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
