"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  CheckCircle2,
  Building2,
  CreditCard,
  ShieldAlert,
  FolderPlus,
  LucideIcon,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ActivityIconType =
  | "check"
  | "building"
  | "card"
  | "shield"
  | "folder"
  | LucideIcon;

export interface ActivityItem {
  id: string;
  description: string;
  time: string;
  icon?: ActivityIconType;
  iconBgColor?: string;
  iconColor?: string;
}

const iconMap: Record<string, LucideIcon> = {
  check: CheckCircle2,
  building: Building2,
  card: CreditCard,
  shield: ShieldAlert,
  folder: FolderPlus,
};

const defaultActivities: ActivityItem[] = [
  {
    id: "1",
    description: "Yeasin approved a rental request",
    time: "5 mins ago",
    icon: "check",
    iconBgColor: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    id: "2",
    description: "Alex created a property",
    time: "42 mins ago",
    icon: "building",
    iconBgColor: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    id: "3",
    description: "John completed a payment",
    time: "2 hours ago",
    icon: "card",
    iconBgColor: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  },
  {
    id: "4",
    description: "Admin blocked a user",
    time: "5 hours ago",
    icon: "shield",
    iconBgColor: "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
  },
  {
    id: "5",
    description: "New category created",
    time: "1 day ago",
    icon: "folder",
    iconBgColor: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  },
];

interface ActivityListProps {
  activities?: ActivityItem[];
}

export function ActivityList({ activities = defaultActivities }: ActivityListProps) {
  const displayActivities = activities.slice(0, 5);

  return (
    <Card className="rounded-[1.5rem] border-0 bg-white shadow-sm dark:border dark:border-white/15 dark:bg-transparent dark:shadow-none transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Recent Activities</CardTitle>
              <CardDescription className="text-xs">
                Real-time audit log of system events
              </CardDescription>
            </div>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Latest 5 events
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
          {displayActivities.map((activity) => {
            const IconComponent: LucideIcon =
              typeof activity.icon === "string"
                ? iconMap[activity.icon] || Activity
                : activity.icon || Activity;

            return (
              <div
                key={activity.id}
                className="relative flex items-center justify-between gap-4 group"
              >

                <div
                  className={cn(
                    "absolute -left-6 top-0.5 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full shadow-xs transition-transform group-hover:scale-110",
                    activity.iconBgColor || "bg-muted text-muted-foreground"
                  )}
                >
                  <IconComponent className="h-3.5 w-3.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.description}
                  </p>
                </div>

                <time className="text-xs text-muted-foreground shrink-0 font-medium">
                  {activity.time}
                </time>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
