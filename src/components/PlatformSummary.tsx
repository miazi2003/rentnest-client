"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users, Home, FileText, CheckCircle2, Clock, XCircle, PlayCircle, CheckCheck } from "lucide-react";

export interface PlatformSummaryData {
  users: {
    total: number;
    active: number;
    blocked: number;
  };
  properties: {
    total: number;
    available: number;
    unavailable: number;
  };
}

export interface RentalSummaryData {
  pending: number;
  approved: number;
  rejected: number;
  active: number;
  completed: number;
}

interface PlatformSummaryProps {
  platformData?: PlatformSummaryData;
  rentalData?: RentalSummaryData;
}

const defaultPlatformData: PlatformSummaryData = {
  users: {
    total: 1248,
    active: 1180,
    blocked: 68,
  },
  properties: {
    total: 450,
    available: 362,
    unavailable: 88,
  },
};

const defaultRentalData: RentalSummaryData = {
  pending: 24,
  approved: 142,
  rejected: 18,
  active: 95,
  completed: 210,
};

export function PlatformSummary({
  platformData = defaultPlatformData,
  rentalData = defaultRentalData,
}: PlatformSummaryProps) {
  const userActivePercent = Math.round((platformData.users.active / platformData.users.total) * 100);
  const userBlockedPercent = Math.round((platformData.users.blocked / platformData.users.total) * 100);

  const propAvailablePercent = Math.round((platformData.properties.available / platformData.properties.total) * 100);
  const propUnavailablePercent = Math.round((platformData.properties.unavailable / platformData.properties.total) * 100);

  const totalRentals = rentalData.pending + rentalData.approved + rentalData.rejected + rentalData.active + rentalData.completed;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <Card className="rounded-xl border-none bg-white dark:bg-card shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Platform Summary</CardTitle>
                <CardDescription className="text-xs">User and property status distribution</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-normal border-none bg-muted/60">
              Overview
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="space-y-3 p-4 rounded-xl bg-slate-50/70 dark:bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Total Users</span>
              </div>
              <span className="text-base font-bold text-foreground">
                {platformData.users.total.toLocaleString()}
              </span>
            </div>

            <Progress value={userActivePercent} className="h-2 bg-rose-100 dark:bg-rose-950/50" indicatorClassName="bg-emerald-500" />

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Active Users
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {platformData.users.active} ({userActivePercent}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  Blocked Users
                </span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  {platformData.users.blocked} ({userBlockedPercent}%)
                </span>
              </div>
            </div>
          </div>


          <div className="space-y-3 p-4 rounded-xl bg-slate-50/70 dark:bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Total Properties</span>
              </div>
              <span className="text-base font-bold text-foreground">
                {platformData.properties.total.toLocaleString()}
              </span>
            </div>

            <Progress value={propAvailablePercent} className="h-2 bg-amber-100 dark:bg-amber-950/50" indicatorClassName="bg-indigo-500" />

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  Available
                </span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {platformData.properties.available} ({propAvailablePercent}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Unavailable
                </span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {platformData.properties.unavailable} ({propUnavailablePercent}%)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      <Card className="rounded-xl border-none bg-white dark:bg-card shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Rental Summary</CardTitle>
                <CardDescription className="text-xs">Rental request status & lifecycle</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-normal border-none bg-muted/60">
              {totalRentals} Total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">

            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20">
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-foreground">Pending Requests</span>
              </div>
              <Badge variant="warning" className="font-semibold">
                {rentalData.pending}
              </Badge>
            </div>


            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-foreground">Approved</span>
              </div>
              <Badge variant="success" className="font-semibold">
                {rentalData.approved}
              </Badge>
            </div>


            <div className="flex items-center justify-between p-3 rounded-lg bg-rose-50/60 dark:bg-rose-950/20">
              <div className="flex items-center gap-2.5">
                <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                <span className="text-sm font-medium text-foreground">Rejected</span>
              </div>
              <Badge variant="destructive" className="font-semibold">
                {rentalData.rejected}
              </Badge>
            </div>


            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/20">
              <div className="flex items-center gap-2.5">
                <PlayCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-foreground">Active Rentals</span>
              </div>
              <Badge variant="info" className="font-semibold">
                {rentalData.active}
              </Badge>
            </div>


            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50/60 dark:bg-purple-950/20">
              <div className="flex items-center gap-2.5">
                <CheckCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-foreground">Completed Rentals</span>
              </div>
              <Badge variant="purple" className="font-semibold">
                {rentalData.completed}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
