"use client";

import React from "react";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { IPaymentItem } from "../types/tenant.types";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface PaymentHistoryTableProps {
  payments: IPaymentItem[];
}

export const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({
  payments,
}) => {
  if (payments.length === 0) {
    return (
      <div className="space-y-3 p-7 text-center sm:p-12">
        <div className="w-14 h-14 bg-muted text-muted-foreground rounded-2xl flex items-center justify-center mx-auto">
          <CreditCard className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-foreground">
          No Payment History Found
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          You have not completed any rent payments yet.
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
            Transaction Ref
          </TableHead>
          <TableHead className="py-4 px-6 font-bold uppercase text-[11px]">
            Property & Landlord
          </TableHead>
          <TableHead className="py-4 px-6 font-bold uppercase text-[11px]">
            Amount Paid
          </TableHead>
          <TableHead className="py-4 px-6 font-bold uppercase text-[11px]">
            Payment Method
          </TableHead>
          <TableHead className="py-4 px-6 font-bold uppercase text-[11px]">
            Payment Date
          </TableHead>
          <TableHead className="py-4 px-6 text-right font-bold uppercase text-[11px]">
            Status
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((pay) => {
          const txn = pay.transactionId || pay.id;
          const propTitle =
            pay.propertyTitle || pay.property?.title || "Rent Payment";
          const landlordName = pay.landlordName || "Landlord";
          const dateStr = pay.createdAt
            ? new Date(pay.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Recent";

          return (
            <TableRow key={pay.id}>
              {/* Transaction ID */}
              <TableCell className="py-4 px-6">
                <span className="font-mono text-xs font-bold text-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
                  {txn}
                </span>
              </TableCell>

              {/* Property & Landlord */}
              <TableCell className="py-4 px-6">
                <div>
                  <p className="font-bold text-foreground leading-tight">
                    {propTitle}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Landlord: {landlordName}
                  </p>
                </div>
              </TableCell>

              {/* Amount */}
              <TableCell className="py-4 px-6">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">
                  ${Number(pay.amount).toLocaleString()}
                </span>
              </TableCell>

              {/* Method */}
              <TableCell className="py-4 px-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CreditCard className="w-3.5 h-3.5 text-blue-500" />
                  {pay.paymentMethod || "Online Transfer"}
                </div>
              </TableCell>

              {/* Date */}
              <TableCell className="py-4 px-6">
                <span className="text-xs font-medium text-muted-foreground">
                  {dateStr}
                </span>
              </TableCell>

              {/* Status */}
              <TableCell className="py-4 px-6 text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {pay.status || "COMPLETED"}
                </span>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    </div>

    <div className="space-y-3 p-3 md:hidden">
      {payments.map((pay) => {
        const transaction = pay.transactionId || pay.id;
        const title = pay.propertyTitle || pay.property?.title || "Rent Payment";
        const date = pay.createdAt ? new Date(pay.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Recent";
        return (
          <article key={pay.id} className="rounded-2xl bg-muted/35 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0"><h3 className="truncate text-sm font-extrabold">{title}</h3><p className="mt-1 text-[11px] text-muted-foreground">{date}</p></div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">{pay.status || "COMPLETED"}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div><p className="text-[10px] text-muted-foreground">Amount paid</p><p className="mt-1 text-base font-black text-emerald-600">${Number(pay.amount).toLocaleString()}</p></div>
              <div><p className="text-[10px] text-muted-foreground">Method</p><p className="mt-1 truncate font-semibold">{pay.paymentMethod || "Online Transfer"}</p></div>
            </div>
            <p className="mt-4 truncate rounded-xl bg-background/70 px-3 py-2 font-mono text-[10px] text-muted-foreground">Ref: {transaction}</p>
          </article>
        );
      })}
    </div>
    </>
  );
};
