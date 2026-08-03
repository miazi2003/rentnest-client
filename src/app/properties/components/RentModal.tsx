"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Hash,
} from "lucide-react";
import { createRentalAction } from "@/app/features/rental/actions/createRentalAction";
import { toast } from "sonner";

export interface RentModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: string;
    title: string;
    price?: number | string;
    location?: string;
  } | null;
  onSubmit?: (data: {
    propertyId: string;
    startDate: string;
    endDate: string;
  }) => void;
}

export default function RentModal({
  isOpen,
  onClose,
  property,
  onSubmit,
}: RentModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!property) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      propertyId: property.id,
      startDate,
      endDate,
    };

    const result = await createRentalAction(payload);

    if (result?.ok) {
      toast.success("Rental request submitted successfully!");
      onSubmit?.(payload);
      onClose();
    } else {
      toast.error(result?.message || "Failed to submit rental request.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton
        className="gap-0 overflow-hidden rounded-[2rem] border-0 bg-white p-0 shadow-[0_18px_55px_-28px_rgba(6,78,59,0.38)] sm:max-w-[470px] dark:bg-slate-950"
      >
        <DialogHeader className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50/70 px-6 pb-6 pt-7 dark:from-emerald-950/70 dark:via-slate-950 dark:to-teal-950/40 sm:px-7">
          <div className="pointer-events-none absolute -right-12 -top-16 size-40 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-700/10" />
          <div className="relative flex items-center gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-[0_8px_20px_-12px_rgba(4,120,87,0.8)] dark:bg-emerald-600">
              <Building2 className="size-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-xl font-extrabold tracking-[-0.025em] text-slate-950 dark:text-white">
                Apply for Rent
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Choose your rental period and submit your request.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-6 sm:px-7">
          <div className="rounded-2xl bg-emerald-50/80 p-4 dark:bg-emerald-950/35">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700/70 dark:text-emerald-300/70">
                  Selected property
                </p>
                <p className="mt-1 truncate text-sm font-extrabold text-slate-900 dark:text-white">
                  {property.title}
                </p>
              </div>
              {property.price !== undefined && property.price !== null && (
                <div className="shrink-0 text-right">
                  <p className="text-base font-black tracking-tight text-emerald-800 dark:text-emerald-300">
                    ${Number(property.price).toLocaleString()}
                  </p>
                  <p className="text-[10px] font-semibold text-emerald-700/60 dark:text-emerald-300/60">
                    per day
                  </p>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
              <Hash className="size-3 text-emerald-600" />
              <span>Property ID</span>
              <span className="min-w-0 truncate font-mono font-semibold text-slate-500 dark:text-slate-400">
                {property.id}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="rental-start-date" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <CalendarDays className="size-3.5 text-emerald-600" />
                  Start date
                </label>
                <Input
                  id="rental-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="h-11 rounded-xl border-0 bg-slate-100/80 px-3 text-xs shadow-none transition-colors focus-visible:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-600/20 dark:bg-slate-900 dark:focus-visible:bg-emerald-950/40"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="rental-end-date" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <CalendarDays className="size-3.5 text-emerald-600" />
                  End date
                </label>
                <Input
                  id="rental-end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="h-11 rounded-xl border-0 bg-slate-100/80 px-3 text-xs shadow-none transition-colors focus-visible:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-600/20 dark:bg-slate-900 dark:focus-visible:bg-emerald-950/40"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-[11px] leading-4 text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
              Your request will be sent to the landlord for approval.
            </div>

            <DialogFooter className="flex flex-col gap-2 pt-1 sm:flex-row">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="h-11 w-full rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900 sm:w-[38%] dark:hover:bg-slate-900 dark:hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-11 w-full gap-2 rounded-xl bg-emerald-700 text-xs font-bold text-white shadow-none hover:bg-emerald-800 sm:flex-1 dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                Submit Request
                <ArrowRight className="size-4" />
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
