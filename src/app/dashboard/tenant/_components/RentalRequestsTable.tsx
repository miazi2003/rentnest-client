"use client";

import React from "react";
import {
  GitPullRequest,
  Building2,
  User,
  Calendar,
  CreditCard,
  Star,
  Clock,
  Check,
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
  onOpenPayModal: (request: IRentalRequest) => void;
  onOpenReviewModal: (request: IRentalRequest) => void;
}

export const RentalRequestsTable: React.FC<RentalRequestsTableProps> = ({
  requests,
  onOpenPayModal,
  onOpenReviewModal,
}) => {
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

  const getRentAmount = (req: IRentalRequest) =>
    req.rentAmount ?? req.amount ?? req.property?.rent ?? 0;

  if (requests.length === 0) {
    return (
      <div className="p-12 text-center space-y-3">
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
            Monthly Rent
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
        {requests.map((req) => {
          const title = getPropertyTitle(req);
          const location = getPropertyLocation(req);
          const landlordName = getLandlordName(req);
          const landlordContact = getLandlordContact(req);
          const rent = getRentAmount(req);
          const status = (req.status || "PENDING").toUpperCase();

          return (
            <TableRow key={req.id}>
              {/* Property Column */}
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

              {/* Landlord Info */}
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

              {/* Rental Period */}
              <TableCell className="py-4 px-6">
                <div className="flex items-center gap-2 text-xs text-foreground font-medium">
                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>
                    {req.startDate ? req.startDate : "Flexible"}{" "}
                    {req.endDate ? `→ ${req.endDate}` : ""}
                  </span>
                </div>
              </TableCell>

              {/* Rent Amount */}
              <TableCell className="py-4 px-6">
                <div className="font-bold text-foreground text-sm">
                  ${rent.toLocaleString()}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    / mo
                  </span>
                </div>
              </TableCell>

              {/* Request Status Badge */}
              <TableCell className="py-4 px-6">
                <RentalStatusBadge status={status} />
              </TableCell>

              {/* Actions Column */}
              <TableCell className="py-4 px-6 text-right">
                {status === "APPROVED" && (
                  <Button
                    size="sm"
                    onClick={() => onOpenPayModal(req)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 rounded-xl shadow-xs"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Pay Now
                  </Button>
                )}

                {status === "ACTIVE" && (
                  <Button
                    size="sm"
                    onClick={() => onOpenReviewModal(req)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 rounded-xl shadow-xs"
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

                {status === "COMPLETED" && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Fulfilled
                  </span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
