"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Wallet,
  Building2,
  Lock,
  CheckCircle,
} from "lucide-react";
import { IRentalRequest, PayMethod } from "../types/tenant.types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PayNowModalProps {
  request: IRentalRequest | null;
  onClose: () => void;
  onConfirmPayment: (request: IRentalRequest, method: PayMethod) => void;
}

export const PayNowModal: React.FC<PayNowModalProps> = ({
  request,
  onClose,
  onConfirmPayment,
}) => {
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const isOpen = Boolean(request);
  if (!request) return null;

  const propertyTitle =
    request.property?.title || request.propertyTitle || "Rental Property";
  const rentAmount = Number(
    request.totalPrice ??
      request.property?.price ??
      request.price ??
      request.rentAmount ??
      request.amount ??
      0
  );

  const reqStatus = (request.status || "").toUpperCase();
  const isAlreadyPaid = reqStatus === "ACTIVE" || reqStatus === "COMPLETED";

  const handlePay = () => {
    if (isProcessing) return;
    if (isAlreadyPaid) {
      toast.error("This property rental is already active and paid.");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmPayment(request, payMethod);
    }, 1200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl p-6 gap-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 shadow-2xl">
        <DialogHeader className="gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900 shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Pay Rent Deposit
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                Instant secure payment via RentNest Checkout
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>


        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Target Property
          </p>
          <p className="font-bold text-slate-900 dark:text-white text-sm">
            {propertyTitle}
          </p>
          <div className="flex justify-between items-center pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Monthly Rent Amount:</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              ${rentAmount.toLocaleString()}
            </span>
          </div>
        </div>


        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Select Payment Gateway
          </label>
          <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-3">
            <button
              type="button"
              onClick={() => setPayMethod("card")}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                payMethod === "card"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold shadow-xs"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
              }`}
            >
              <CreditCard className="w-5 h-5 mx-auto mb-1" />
              <span className="text-[11px] block">Credit Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPayMethod("bkash")}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                payMethod === "bkash"
                  ? "border-pink-600 bg-pink-50 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 font-bold shadow-xs"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
              }`}
            >
              <Wallet className="w-5 h-5 mx-auto mb-1" />
              <span className="text-[11px] block">bKash / Wallet</span>
            </button>

            <button
              type="button"
              onClick={() => setPayMethod("bank")}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                payMethod === "bank"
                  ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
              }`}
            >
              <Building2 className="w-5 h-5 mx-auto mb-1" />
              <span className="text-[11px] block">Bank Wire</span>
            </button>
          </div>
        </div>


        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              readOnly
              value={
                payMethod === "card"
                  ? "•••• •••• •••• 4242"
                  : payMethod === "bkash"
                  ? "+880 1700-000000"
                  : "RentNest Escrow Account #99281"
              }
              className="w-full px-4 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-800 dark:text-slate-200"
            />
            <Lock className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>


        <DialogFooter className="flex-col-reverse items-stretch gap-3 pt-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-1/3 rounded-xl text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isProcessing}
            onClick={handlePay}
            className="w-2/3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <span className="animate-pulse">Processing Payment...</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Confirm & Pay ${rentAmount.toLocaleString()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
