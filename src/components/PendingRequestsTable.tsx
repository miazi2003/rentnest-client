"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Clock, Building, User } from "lucide-react";

export interface PendingRequestItem {
  id: string;
  property: string;
  tenant: string;
  tenantEmail?: string;
  date: string;
  status: string;
}

const defaultPendingRequests: PendingRequestItem[] = [
  {
    id: "req-1",
    property: "Luxury Penthouse in Gulshan",
    tenant: "Yeasin Arafat",
    tenantEmail: "yeasin@example.com",
    date: "Aug 02, 2026",
    status: "Pending",
  },
  {
    id: "req-2",
    property: "Modern Studio Apartment",
    tenant: "Sarah Jenkins",
    tenantEmail: "sarah.j@example.com",
    date: "Aug 01, 2026",
    status: "Pending",
  },
  {
    id: "req-3",
    property: "Green Valley Duplex Villa",
    tenant: "Michael Chen",
    tenantEmail: "m.chen@example.com",
    date: "Jul 31, 2026",
    status: "Pending",
  },
  {
    id: "req-4",
    property: "Sunset Heights 3BR Apt",
    tenant: "Fatima Rahman",
    tenantEmail: "fatima.r@example.com",
    date: "Jul 30, 2026",
    status: "Pending",
  },
  {
    id: "req-5",
    property: "Downtown Commercial Space",
    tenant: "David Miller",
    tenantEmail: "david.m@example.com",
    date: "Jul 29, 2026",
    status: "Pending",
  },
];

interface PendingRequestsTableProps {
  rentals?: unknown;
  requests?: PendingRequestItem[];
  onView?: (id: string) => void;
}

interface RawPendingRequest {
  id?: string;
  _id?: string;
  status?: string;
  property?: string | { title?: string; name?: string };
  propertyTitle?: string;
  propertyAddress?: string;
  tenant?: string | { name?: string; email?: string };
  tenantName?: string;
  tenantEmail?: string;
  user?: { name?: string; email?: string };
  date?: string;
  createdAt?: string;
  startDate?: string;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" ? value as Record<string, unknown> : null;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function PendingRequestsTable({
  rentals,
  requests,
  onView,
}: PendingRequestsTableProps) {
  // Extract raw list from rentals prop (from rentalActions()) or requests prop
  const rawList = React.useMemo(() => {
    if (Array.isArray(requests) && requests.length > 0) return requests;

    if (Array.isArray(rentals)) return rentals as RawPendingRequest[];
    const rentalRecord = asRecord(rentals);
    if (rentalRecord) {
      if (Array.isArray(rentalRecord.data)) return rentalRecord.data as RawPendingRequest[];
      const d = asRecord(rentalRecord.data);
      if (d) {
        if (Array.isArray(d.data)) return d.data as RawPendingRequest[];
        if (Array.isArray(d.result)) return d.result as RawPendingRequest[];
        if (Array.isArray(d.rentals)) return d.rentals as RawPendingRequest[];
        if (Array.isArray(d.requests)) return d.requests as RawPendingRequest[];
      }
    }

    // Fallback if no props or empty data
    if (requests !== undefined) return requests;
    if (rentals === undefined) return defaultPendingRequests;

    return defaultPendingRequests;
  }, [rentals, requests]);

  // Filter strictly for pending items ONLY
  const pendingItems = React.useMemo(() => {
    if (!Array.isArray(rawList) || rawList.length === 0) return [];

    return rawList.filter((item: RawPendingRequest) => {
      const status = String(item.status || "").toUpperCase();
      return status === "PENDING";
    });
  }, [rawList]);

  // Map items into standard PendingRequestItem format
  const displayRequests = React.useMemo(() => {
    return pendingItems.slice(0, 5).map((item: RawPendingRequest, idx: number) => {
      const tenantRecord = typeof item.tenant === "object" ? item.tenant : undefined;
      const propTitle =
        typeof item.property === "string"
          ? item.property
          : typeof item.propertyTitle === "string"
          ? item.propertyTitle
          : item.property?.title || item.property?.name || item.propertyAddress || "Rental Property";

      const tenantName =
        typeof item.tenant === "string"
          ? item.tenant
          : typeof item.tenantName === "string"
          ? item.tenantName
          : tenantRecord?.name || item.user?.name || tenantRecord?.email || item.user?.email || "Applicant Tenant";

      const tenantEmail =
        typeof item.tenantEmail === "string"
          ? item.tenantEmail
          : tenantRecord?.email || item.user?.email || "";

      const formattedDate = item.date || formatDate(item.createdAt || item.startDate);

      return {
        id: item.id || item._id || `req-${idx}`,
        property: propTitle,
        tenant: tenantName,
        tenantEmail,
        date: formattedDate,
        status: item.status || "Pending",
      };
    });
  }, [pendingItems]);

  return (
    <Card className="rounded-xl border-none bg-white dark:bg-card shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Pending Rental Requests</CardTitle>
              <CardDescription className="text-xs">
                Applications awaiting admin or landlord approval
              </CardDescription>
            </div>
          </div>
          <Badge variant="warning" className="font-semibold border-none">
            {displayRequests.length} Pending
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="min-w-0 p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-slate-50/50 dark:bg-muted/30">
              <TableHead className="pl-6">Property</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRequests.length > 0 ? (
              displayRequests.map((item) => (
                <TableRow key={item.id} className="border-b border-muted/30 hover:bg-slate-50/60 dark:hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-6 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate max-w-[220px]" title={item.property}>
                        {item.property}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.tenant}</p>
                        {item.tenantEmail && (
                          <p className="text-[11px] text-muted-foreground">{item.tenantEmail}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground font-medium">
                    {item.date}
                  </TableCell>

                  <TableCell>
                    <Badge variant="warning" className="capitalize border-none">
                      {item.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 gap-1.5 text-xs font-medium bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => onView?.(item.id)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground text-xs font-medium">
                  No pending rental requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
