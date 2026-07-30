"use me";
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  User,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  Receipt,
  Tag,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { IRentalRequest } from "@/app/dashboard/tenant/types/tenant.types";
import { RentalStatusBadge } from "@/app/dashboard/tenant/_components/RentalStatusBadge";
import { handleCreateCheckoutSessionAction } from "@/app/(auth)/_action/paymentActions";

// Shadcn UI components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface PaymentPageClientProps {
  request: IRentalRequest;
}

export default function PaymentPageClient({ request }: PaymentPageClientProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Safely extract database fields
  const requestId = request?.id || (request as any)?._id || "";
  const propertyTitle = request?.title || request?.property?.title || "Rental Property";
  const propertyAddress = request?.address || request?.property?.address || request?.location || "Location N/A";
  const categoryName = request?.category?.name || request?.property?.category?.name || "Property";

  const landlordName = request?.landlord?.name || request?.property?.landlord?.name || "Landlord Contact";
  const landlordEmail = request?.landlord?.email || request?.property?.landlord?.email || "landlord@rentnest.com";
  const landlordPhone = request?.landlord?.phone || request?.property?.landlord?.phone || "N/A";

  // Parse price cleanly from DB without hardcoded fallbacks
  const rawPrice =
    request?.totalPrice ??
    request?.property?.price ??
    request?.price ??
    request?.rentAmount ??
    request?.amount;
  const price = rawPrice ? Number(rawPrice) : 0;

  // Check if rental request is already paid/active to prevent double purchase
  const reqStatus = (request?.status || "").toUpperCase();
  const isAlreadyPaid = reqStatus === "ACTIVE" || reqStatus === "COMPLETED";

  // Initiate Stripe Hosted Checkout (POST /api/payments/checkout)
  const handlePay = async () => {
    if (!requestId) {
      toast.error("Invalid rental request ID. Cannot initiate checkout.");
      return;
    }

    if (isAlreadyPaid) {
      toast.error("This rental request has already been paid and purchased.");
      return;
    }

    setIsProcessing(true);

    try {
      // Store rental request info in session storage so success page can display the exact ID
      if (typeof window !== "undefined") {
        sessionStorage.setItem("lastRentalRequestId", requestId);
        sessionStorage.setItem("lastPropertyTitle", propertyTitle);
        sessionStorage.setItem("lastLandlordName", landlordName);
        localStorage.setItem("lastRentalRequestId", requestId);
      }

      // Send ONLY rentalRequestId to backend. Never trust client amounts.
      const res = await handleCreateCheckoutSessionAction(requestId);

      if (!res.ok) {
        const errorMsg = res?.data?.message || res?.message || "Failed to initiate Stripe Checkout session";
        toast.error(errorMsg);
        setIsProcessing(false);
        return;
      }

      // Extract Checkout Session URL from backend response
      const sessionUrl =
        res?.data?.data?.url ||
        res?.data?.url ||
        res?.data?.data?.sessionUrl ||
        res?.data?.sessionUrl;

      if (sessionUrl) {
        toast.success("Redirecting to Stripe Hosted Checkout...");
        // Redirect to Stripe Hosted Checkout Page
        window.location.href = sessionUrl;
      } else {
        toast.error("Stripe session URL not returned from server.");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Stripe checkout initiation error:", err);
      toast.error(err instanceof Error ? err.message : "Network error during checkout initiation");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-4">
        <Link href="/dashboard/tenant/requests">
          <Button variant="outline" size="sm" className="gap-2 rounded-xl border-border">
            <ArrowLeft className="w-4 h-4" />
            Back to Requests
          </Button>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Stripe Secure Checkout
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1 z-10 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            Payment Checkout
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Confirm & Pay Rent
          </h1>
          <p className="text-blue-100/80 text-xs sm:text-sm">
            Review your rental request details and click Pay Now to proceed to Stripe Hosted Checkout.
          </p>
        </div>
      </div>

      {/* Main Payment Card */}
      <Card className="rounded-3xl border-border shadow-md overflow-hidden bg-card text-card-foreground">
        <CardHeader className="bg-muted/50 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Rental Request Summary
            </CardTitle>
            <RentalStatusBadge status={request?.status || "APPROVED"} />
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Request ID: <span className="font-mono font-bold text-foreground">{requestId}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-5">
          {/* Property Details */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/40 border border-border/80">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="space-y-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                <Tag className="w-3 h-3" />
                {categoryName}
              </span>
              <h3 className="font-bold text-base text-foreground leading-snug">
                {propertyTitle}
              </h3>
              <p className="text-xs text-muted-foreground">
                Address: {propertyAddress}
              </p>
            </div>
          </div>

          {/* Landlord Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Landlord Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-muted/30 border border-border/60 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Name</p>
                  <p className="font-semibold text-foreground">{landlordName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Email</p>
                  <p className="font-semibold text-foreground truncate">{landlordEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Phone</p>
                  <p className="font-semibold text-foreground">{landlordPhone}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Already Paid Warning Alert */}
          {isAlreadyPaid && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Property Already Purchased & Active
              </div>
              <p className="text-emerald-800 dark:text-emerald-300">
                You have already paid for this rental request. Duplicate payments are blocked for your security.
              </p>
            </div>
          )}

          {/* Amount Display */}
          <div className="flex justify-between items-center p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Rent Amount
              </p>
              <p className="text-xs text-muted-foreground">Calculated by backend</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                ${price.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/40 p-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-[11px] text-muted-foreground">Total Payable</p>
            <p className="text-2xl font-black text-foreground">
              ${price.toLocaleString()}
            </p>
          </div>

          {/* Single Pay Now Button initiating Stripe Checkout Session */}
          <Button
            disabled={isProcessing || isAlreadyPaid}
            onClick={handlePay}
            className={`w-full sm:w-auto px-8 py-3 rounded-2xl font-extrabold text-sm shadow-lg gap-2 transition-all ${
              isAlreadyPaid
                ? "bg-slate-400 dark:bg-slate-700 text-white cursor-not-allowed opacity-80"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 cursor-pointer active:scale-95"
            }`}
          >
            {isAlreadyPaid ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Already Purchased
              </>
            ) : isProcessing ? (
              <span className="animate-pulse">Connecting Stripe...</span>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Pay Now
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
