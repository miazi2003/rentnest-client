"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Building2,
  User,
  Calendar,
  Check,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  Inbox,
  Loader2,
  Mail,
  Phone,
  Tag,
  CreditCard,
} from "lucide-react";
import { ILandlordRentalRequest } from "../types/landlord.types";
import { handleRequestAction } from "@/app/features/landlord/actions/handleRequestAction";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface RequestListTableProps {
  requests: ILandlordRentalRequest[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  loadingId?: string | null;
}

export function RequestListTable({
  requests,
  onApprove,
  onReject,
  loadingId: externalLoadingId,
}: RequestListTableProps) {
  const router = useRouter();
  const [internalLoadingId, setInternalLoadingId] = useState<string | null>(null);

  const activeLoadingId = externalLoadingId ?? internalLoadingId;

  const handleApprove = async (id: string) => {
    if (onApprove) {
      onApprove(id);
      return;
    }
    try {
      setInternalLoadingId(id);
      const res = await handleRequestAction(id, "APPROVED");
      if (res?.ok) {
        toast.success("Rental request approved successfully!");
        router.refresh();
      } else {
        toast.error(res?.message || res?.data?.message || "Failed to approve request.");
      }
    } catch {
      toast.error("An error occurred while approving request.");
    } finally {
      setInternalLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (onReject) {
      onReject(id);
      return;
    }
    try {
      setInternalLoadingId(id);
      const res = await handleRequestAction(id, "REJECTED");
      if (res?.ok) {
        toast.success("Rental request rejected.");
        router.refresh();
      } else {
        toast.error(res?.message || res?.data?.message || "Failed to reject request.");
      }
    } catch {
      toast.error("An error occurred while rejecting request.");
    } finally {
      setInternalLoadingId(null);
    }
  };

  const getPropertyTitle = (req: ILandlordRentalRequest) =>
    req.property?.title || req.propertyTitle || "Rental Property";

  const getPropertyAddress = (req: ILandlordRentalRequest) =>
    req.property?.address || "Location N/A";

  const getCategoryName = (req: ILandlordRentalRequest) =>
    req.property?.category?.name;

  const getTenantName = (req: ILandlordRentalRequest) =>
    req.tenant?.name || req.tenantName || "Applicant Tenant";

  const getTenantEmail = (req: ILandlordRentalRequest) =>
    req.tenant?.email || req.tenantEmail || "Email N/A";

  const getTenantPhone = (req: ILandlordRentalRequest) =>
    req.tenant?.phone || req.tenantPhone || "Phone N/A";

  const getTotalPrice = (req: ILandlordRentalRequest) => {
    const val = req.totalPrice ?? req.price ?? req.property?.price ?? 0;
    return Number(val) || 0;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime())
        ? dateStr
        : d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (statusStr?: string) => {
    const status = (statusStr || "PENDING").toUpperCase();

    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Check className="w-3.5 h-3.5" />
            Active Rental
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            Pending Review
          </span>
        );
    }
  };

  const getPaymentStatusBadge = (paymentStatusStr?: string) => {
    if (!paymentStatusStr) return null;
    const status = paymentStatusStr.toUpperCase();

    if (status === "PAID" || status === "COMPLETED") {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          <CreditCard className="w-3 h-3" /> Paid
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20">
        <CreditCard className="w-3 h-3" /> Unpaid
      </span>
    );
  };

  if (requests.length === 0) {
    return (
      <div className="p-12 text-center space-y-4 border border-dashed border-border rounded-3xl bg-muted/20">
        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <Inbox className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground">
            No Rental Requests Found
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You currently have no incoming rental applications for your properties.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
            <TableHead className="py-4 px-6 font-bold uppercase text-[11px] tracking-wider">
              Property Details
            </TableHead>
            <TableHead className="py-4 px-6 font-bold uppercase text-[11px] tracking-wider">
              Tenant Info
            </TableHead>
            <TableHead className="py-4 px-6 font-bold uppercase text-[11px] tracking-wider">
              Rental Period
            </TableHead>
            <TableHead className="py-4 px-6 font-bold uppercase text-[11px] tracking-wider">
              Total Rent
            </TableHead>
            <TableHead className="py-4 px-6 font-bold uppercase text-[11px] tracking-wider">
              Status & Payment
            </TableHead>
            <TableHead className="py-4 px-6 text-right font-bold uppercase text-[11px] tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((req) => {
            const title = getPropertyTitle(req);
            const address = getPropertyAddress(req);
            const categoryName = getCategoryName(req);
            const tenantName = getTenantName(req);
            const tenantEmail = getTenantEmail(req);
            const tenantPhone = getTenantPhone(req);
            const totalPrice = getTotalPrice(req);
            const status = (req.status || "PENDING").toUpperCase();
            const isLoadingThis = activeLoadingId === req.id;

            return (
              <TableRow
                key={req.id}
                className="hover:bg-muted/30 transition-colors border-b border-border/60"
              >
                {/* Property Column */}
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-bold text-sm text-foreground leading-tight">
                        {title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {address}
                        </span>
                        {categoryName && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                            <Tag className="w-2.5 h-2.5 text-emerald-600" />
                            {categoryName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Tenant Info Column */}
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs sm:text-sm text-foreground">
                        {tenantName}
                      </p>
                      <div className="flex flex-col text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-muted-foreground/70" />
                          {tenantEmail}
                        </span>
                        {tenantPhone !== "Phone N/A" && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-muted-foreground/70" />
                            {tenantPhone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Rental Period */}
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2 text-xs text-foreground font-medium">
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {formatDate(req.startDate)} → {formatDate(req.endDate)}
                    </span>
                  </div>
                </TableCell>

                {/* Rent Amount */}
                <TableCell className="py-4 px-6">
                  <div className="font-extrabold text-foreground text-sm">
                    ${totalPrice.toLocaleString()}
                  </div>
                </TableCell>

                {/* Status & Payment Status */}
                <TableCell className="py-4 px-6">
                  <div className="flex flex-col gap-1.5 items-start">
                    {getStatusBadge(status)}
                    {getPaymentStatusBadge(req.paymentStatus)}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="py-4 px-6 text-right">
                  {status === "PENDING" ? (
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        disabled={isLoadingThis}
                        onClick={() => handleApprove(req.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
                      >
                        {isLoadingThis ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isLoadingThis}
                        onClick={() => handleReject(req.id)}
                        className="border-rose-500/30 text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 font-bold text-xs gap-1.5 rounded-xl cursor-pointer transition-all active:scale-95"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">
                      No actions
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
