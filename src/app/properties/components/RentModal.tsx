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
import { Building2, Calendar, Hash, CheckCircle2 } from "lucide-react";
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
        onClose(); // Automatically close modal
      } else {
        toast.error(result?.message || "Failed to submit rental request.");
      }
    };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Apply for Rent
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Submit your rental application period for this property.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Selected Property Details */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-2.5">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">
                Property Name
              </p>
              <p className="text-sm font-extrabold text-foreground">
                {property.title}
              </p>
            </div>
            {property.price && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                ${Number(property.price).toLocaleString()}/day
              </span>
            )}
          </div>

          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-emerald-600" /> Property ID:
            </span>
            <span className="font-bold text-foreground bg-background px-2 py-0.5 rounded border border-border">
              {property.id}
            </span>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Start Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Start Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="rounded-2xl text-xs"
            />
          </div>

          {/* End Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" /> End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="rounded-2xl text-xs"
            />
          </div>

          <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-1/2 rounded-2xl text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-1/2 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
