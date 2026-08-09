"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  GitPullRequest,
  Building2,
  User,
  Calendar,
  CreditCard,
  Star,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { IRentalRequest } from "../types/tenant.types";
import { RentalStatusBadge } from "./RentalStatusBadge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface RentalRequestsTableProps {
  requests: IRentalRequest[];
  onOpenReviewModal: (request: IRentalRequest) => void;
}

export const RentalRequestsTable: React.FC<RentalRequestsTableProps> = ({
  requests,
  onOpenReviewModal,
}) => {
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(requests.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const paginatedRequests = useMemo(() => {
    const start = (validPage - 1) * pageSize;
    return requests.slice(start, start + pageSize);
  }, [requests, validPage]);

  const getPropertyTitle = (req: IRentalRequest) =>
    req.property?.title || req.propertyTitle || "Rental Property";

  const getPropertyLocation = (req: IRentalRequest) =>
    req.property?.location || req.property?.address || req.location || "Location N/A";

  const getLandlordName = (req: IRentalRequest) =>
    req.landlord?.name || req.landlordName || "Property Landlord";

  const getLandlordContact = (req: IRentalRequest) =>
    req.landlord?.email ||
    req.landlordPhone ||
    req.landlord?.phone ||
    "Contact via Nest";

  const getRentAmount = (req: IRentalRequest) => {
    const val = req.totalPrice ?? req.property?.price ?? 0;
    return Number(val) || 0;
  };

  if (requests.length === 0) {
    return (
      <div className="space-y-3 p-7 text-center sm:p-12">
        <div className="w-14 h-14 bg-muted text-muted-foreground rounded-2xl flex items-center justify-center mx-auto">
          <GitPullRequest className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-foreground">
          No Rental Requests Found
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          There are no rental applications matching your search or status filter.
        </p>
      </div>
    );
  }

  return (
    <>
    <div className="hidden md:block">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="py-4 px-6 font-bold uppercase text-[11px]">
            Property
          </TableHead>
          <TableHead className="py-4 px-6 font-bold uppercase text-[11px]">
            Landlord Info
          </TableHead>
          <TableHead className="py-4 px-6 font-bold uppercase text-[11px]">
            Rental Period
          </TableHead>
          <TableHead className="py-4 px-6 font-bold uppercase text-[11px]">
            Rent
          </TableHead>
          <TableHead className="py-4 px-6 font-bold uppercase text-[11px]">
            Request Status
          </TableHead>
          <TableHead className="py-4 px-6 text-right font-bold uppercase text-[11px]">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedRequests.map((req) => {
          const title = getPropertyTitle(req);
          const location = getPropertyLocation(req);
          const landlordName = getLandlordName(req);
          const landlordContact = getLandlordContact(req);
          const rent = getRentAmount(req);
          const status = (req.status || "PENDING").toUpperCase();

          return (
            <TableRow key={req.id}>

              <TableCell className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground leading-tight">
                      {title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {location}
                    </p>
                  </div>
                </div>
              </TableCell>


              <TableCell className="py-4 px-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-semibold text-foreground text-xs sm:text-sm">
                      {landlordName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {landlordContact}
                    </p>
                  </div>
                </div>
              </TableCell>


              <TableCell className="py-4 px-6">
                <div className="flex items-center gap-2 text-xs text-foreground font-medium">
                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>
                    {req.startDate ? req.startDate : "Flexible"}{" "}
                    {req.endDate ? `→ ${req.endDate}` : ""}
                  </span>
                </div>
              </TableCell>


              <TableCell className="py-4 px-6">
                <div className="font-bold text-foreground text-sm">
                  ${rent.toLocaleString()}{" "}
                </div>
              </TableCell>


              <TableCell className="py-4 px-6">
                <RentalStatusBadge status={status} />
              </TableCell>


              <TableCell className="py-4 px-6 text-right">
                {status === "APPROVED" && (
                  <Link href={`/dashboard/tenant/requests/${req.id}/pay`}>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 rounded-xl shadow-xs cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Pay Now
                    </Button>
                  </Link>
                )}

                {status === "ACTIVE" && (
                  <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Active Rental
                  </span>
                )}

                {status === "COMPLETED" && (
                  <Button
                    size="sm"
                    onClick={() => onOpenReviewModal(req)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 rounded-xl shadow-xs cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    Leave Review
                  </Button>
                )}

                {status === "PENDING" && (
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Under Review
                  </span>
                )}

                {status === "REJECTED" && (
                  <span className="text-xs text-muted-foreground font-medium">
                    No Actions
                  </span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    </div>

    <div className="space-y-3 p-3 md:hidden">
      {paginatedRequests.map((req) => {
        const status = (req.status || "PENDING").toUpperCase();
        return (
          <article key={req.id} className="rounded-2xl bg-muted/35 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-extrabold">{getPropertyTitle(req)}</h3>
                <p className="mt-1 truncate text-[11px] text-muted-foreground">{getPropertyLocation(req)}</p>
              </div>
              <RentalStatusBadge status={status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div><p className="text-[10px] text-muted-foreground">Landlord</p><p className="mt-1 truncate font-semibold">{getLandlordName(req)}</p></div>
              <div><p className="text-[10px] text-muted-foreground">Rent</p><p className="mt-1 font-extrabold">${getRentAmount(req).toLocaleString()}</p></div>
              <div className="col-span-2"><p className="text-[10px] text-muted-foreground">Rental period</p><p className="mt-1 font-semibold">{req.startDate || "Flexible"} {req.endDate ? `→ ${req.endDate}` : ""}</p></div>
            </div>
            <div className="mt-4 flex justify-end border-t border-border/60 pt-3">
              {status === "APPROVED" && <Link className="w-full" href={`/dashboard/tenant/requests/${req.id}/pay`}><Button size="sm" className="w-full rounded-xl bg-blue-600 text-xs font-bold text-white"><CreditCard className="size-3.5" /> Pay Now</Button></Link>}
              {status === "COMPLETED" && <Button size="sm" onClick={() => onOpenReviewModal(req)} className="w-full rounded-xl bg-emerald-600 text-xs font-bold text-white"><Star className="size-3.5" /> Leave Review</Button>}
              {status === "ACTIVE" && <span className="text-xs font-semibold text-emerald-600">Active rental</span>}
              {status === "PENDING" && <span className="text-xs font-semibold text-amber-600">Under review</span>}
              {status === "REJECTED" && <span className="text-xs text-muted-foreground">No actions available</span>}
            </div>
          </article>
        );
      })}
    </div>
    {requests.length > pageSize && (
      <div className="flex items-center justify-between border-t border-border px-4 py-3 sm:px-6">
        <p className="text-xs text-muted-foreground">
          Showing {(validPage - 1) * pageSize + 1}–{Math.min(validPage * pageSize, requests.length)} of {requests.length}
        </p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={validPage === 1} className="h-8 gap-1 text-xs">
            <ChevronLeft className="size-3.5" /> Previous
          </Button>
          <span className="text-xs font-semibold text-muted-foreground">{validPage} / {totalPages}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={validPage === totalPages} className="h-8 gap-1 text-xs">
            Next <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>
    )}
    </>
  );
};
