"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  LayoutDashboard,
  Building2,
  Receipt,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { handleVerifyPaymentSessionAction } from "@/app/features/payment/actions/paymentActions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type StripeSessionStatus = "open" | "complete" | "expired";
type StripePaymentStatus = "paid" | "unpaid" | "no_payment_required";

interface PaymentVerificationPayload {
  id?: string;
  status?: StripeSessionStatus;
  paymentStatus?: StripePaymentStatus;
  amountTotal?: number;
  amount?: number;
  currency?: string;
  transactionId?: string;
  date?: string;
  receiptUrl?: string;
  rentalRequestId?: string;
  propertyTitle?: string;
  landlordName?: string;
  rentalId?: string;
  requestId?: string;
  client_reference_id?: string;
  createdAt?: string;
  paymentIntentId?: string;
  receipt_url?: string;
  stripeReceiptUrl?: string;
  totalAmount?: number;
  price?: number;
  property?: { title?: string };
  landlord?: { name?: string };
  metadata?: { rentalRequestId?: string };
  data?: {
    rentalRequestId?: string;
    rentalId?: string;
    client_reference_id?: string;
  };
}

interface PaymentVerificationResult {
  stripePaymentStatus: StripePaymentStatus;
  stripeSessionStatus?: StripeSessionStatus;
  amount?: number;
  currency?: string;
  transactionId?: string;
  date?: string;
  receiptUrl?: string;
  rentalRequestId?: string;
  propertyTitle?: string;
  landlordName?: string;
}

const stripeSessionStatuses = new Set<StripeSessionStatus>(["open", "complete", "expired"]);
const stripePaymentStatuses = new Set<StripePaymentStatus>(["paid", "unpaid", "no_payment_required"]);

function parseStripePaymentStatus(value: unknown): StripePaymentStatus | null {
  return typeof value === "string" && stripePaymentStatuses.has(value.toLowerCase() as StripePaymentStatus)
    ? value.toLowerCase() as StripePaymentStatus
    : null;
}

function parseStripeSessionStatus(value: unknown): StripeSessionStatus | undefined {
  return typeof value === "string" && stripeSessionStatuses.has(value.toLowerCase() as StripeSessionStatus)
    ? value.toLowerCase() as StripeSessionStatus
    : undefined;
}

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || searchParams.get("sessionId");

  const [loading, setLoading] = useState(true);
  const [verifyingText, setVerifyingText] = useState("Verifying payment with Stripe...");
  const [paymentData, setPaymentData] = useState<PaymentVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorTitle, setErrorTitle] = useState("Verification Pending");

  const verifyPayment = useCallback(async () => {
    const verifyAttempt = async (attemptsRemaining: number): Promise<void> => {
    if (!sessionId) {
      setLoading(false);
      setError("No session_id parameter found in payment redirect URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setErrorTitle("Verification Pending");

    try {
      const res = await handleVerifyPaymentSessionAction(sessionId);

      if (res.ok && res.data) {
        const payload = (res.data.data || res.data) as PaymentVerificationPayload;
        const stripePaymentStatus = parseStripePaymentStatus(payload.paymentStatus);
        const stripeSessionStatus = parseStripeSessionStatus(payload.status);

        if (stripePaymentStatus === "unpaid" && stripeSessionStatus !== "expired" && attemptsRemaining > 1) {
          setVerifyingText(`Awaiting Stripe webhook confirmation... (Attempt ${6 - attemptsRemaining} of 5)`);
          setTimeout(() => {
            void verifyAttempt(attemptsRemaining - 1);
          }, 2000);
          return;
        }

        if (stripePaymentStatus !== "paid") {
          setLoading(false);
          if (stripeSessionStatus === "expired") {
            setErrorTitle("Payment Session Expired");
            setError("This Checkout Session expired before payment was confirmed.");
          } else if (stripePaymentStatus === "unpaid") {
            setErrorTitle("Verification Pending");
            setError("Payment confirmation is still pending. Please retry shortly.");
          } else {
            setErrorTitle("Verification Error");
            setError("Payment verification did not return a recognized Stripe payment status.");
          }
          return;
        }

        const urlRentalRequestId =
          searchParams.get("rentalRequestId") ||
          searchParams.get("rental_request_id") ||
          searchParams.get("requestId");

        let storedRentalRequestId: string | null = null;
        let storedPropertyTitle: string | null = null;
        let storedLandlordName: string | null = null;

        if (typeof window !== "undefined") {
          storedRentalRequestId =
            sessionStorage.getItem("lastRentalRequestId") ||
            localStorage.getItem("lastRentalRequestId");
          storedPropertyTitle = sessionStorage.getItem("lastPropertyTitle");
          storedLandlordName = sessionStorage.getItem("lastLandlordName");
        }

        const resolvedRentalRequestId =
          payload?.rentalRequestId ||
          payload?.rentalId ||
          payload?.requestId ||
          payload?.client_reference_id ||
          payload?.data?.rentalRequestId ||
          payload?.data?.rentalId ||
          payload?.data?.client_reference_id ||
          payload?.metadata?.rentalRequestId ||
          urlRentalRequestId ||
          storedRentalRequestId ||
          "N/A";

        const resolvedPropertyTitle =
          payload?.propertyTitle ||
          payload?.property?.title ||
          storedPropertyTitle ||
          "Property unavailable";

        const resolvedLandlordName =
          payload?.landlordName ||
          payload?.landlord?.name ||
          storedLandlordName ||
          "Not provided";

        setPaymentData({
          stripePaymentStatus,
          stripeSessionStatus,
          amount: Number(payload?.amountTotal ?? payload?.amount ?? payload?.totalAmount ?? payload?.price ?? 0),
          currency: (payload?.currency || "USD").toUpperCase(),
          transactionId: payload?.transactionId || payload?.paymentIntentId || payload?.id || sessionId,
          date: payload?.createdAt || payload?.date || "",
          receiptUrl: payload?.receiptUrl || payload?.receipt_url || payload?.stripeReceiptUrl,
          rentalRequestId: resolvedRentalRequestId,
          propertyTitle: resolvedPropertyTitle,
          landlordName: resolvedLandlordName,
        });

        setLoading(false);
        toast.success("Payment verified successfully!");
      } else {
        if (attemptsRemaining > 1) {
          setVerifyingText(`Confirming transaction with Stripe... (Attempt ${6 - attemptsRemaining} of 5)`);
          setTimeout(() => {
            void verifyAttempt(attemptsRemaining - 1);
          }, 2000);
        } else {
          setLoading(false);
          setError(res?.data?.message || res?.message || "Payment verification timed out or session expired.");
        }
      }
    } catch (err) {
      if (attemptsRemaining > 1) {
        setTimeout(() => {
          void verifyAttempt(attemptsRemaining - 1);
        }, 2000);
      } else {
        setLoading(false);
        setError(err instanceof Error ? err.message : "Error verifying payment session");
      }
    }
    };

    await verifyAttempt(5);
  }, [searchParams, sessionId]);

  useEffect(() => {
    void verifyPayment();
  }, [verifyPayment]);

  const formattedDate = paymentData?.date
    ? new Date(paymentData.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just now";

  return (
    <div className="max-w-xl mx-auto space-y-6 py-8 pb-16">
      <Card className="rounded-3xl border-border shadow-xl overflow-hidden bg-card text-card-foreground">
        {loading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/60 text-blue-600 rounded-full flex items-center justify-center mx-auto border-2 border-blue-200 animate-spin">
              <RefreshCw className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground">Payment Verification in Progress</h2>
              <p className="text-xs text-muted-foreground">{verifyingText}</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-full flex items-center justify-center mx-auto border border-rose-300">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground">{errorTitle}</h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">{error}</p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => void verifyPayment()}
                className="rounded-xl text-xs gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Verification
              </Button>
              <Link href="/dashboard/tenant/requests">
                <Button className="rounded-xl text-xs bg-blue-600 text-white">
                  Go to Rental Details
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>

            <CardHeader className="bg-emerald-500/10 border-b border-emerald-500/20 text-center pb-6 pt-8">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 mb-3">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <CardTitle className="text-2xl font-black text-foreground">
                Payment Successful!
              </CardTitle>
              <CardDescription className="text-xs text-emerald-700 dark:text-emerald-300 font-medium max-w-sm mx-auto mt-1">
                Your rent payment has been verified. Your rental request is now active.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-5">

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  Payment Receipt Summary
                </h4>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Payment Status:</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {paymentData?.stripePaymentStatus.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Amount Paid:</span>
                    <span className="font-extrabold text-foreground text-sm">
                      ${paymentData?.amount?.toLocaleString()} {paymentData?.currency}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Currency:</span>
                    <span className="font-bold text-foreground">{paymentData?.currency}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <span className="font-mono font-bold text-foreground text-[11px] bg-muted px-2 py-0.5 rounded border border-border">
                      {paymentData?.transactionId}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rental Request ID:</span>
                    <span className="font-mono font-bold text-foreground text-[11px]">
                      {paymentData?.rentalRequestId}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Payment Date:</span>
                    <span className="font-semibold text-foreground">{formattedDate}</span>
                  </div>

                  {paymentData?.propertyTitle && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Property:</span>
                      <span className="font-bold text-foreground">{paymentData.propertyTitle}</span>
                    </div>
                  )}
                </div>
              </div>


              {paymentData?.receiptUrl && (
                <div className="pt-1">
                  <a
                    href={paymentData.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
                  >
                    <Receipt className="w-4 h-4 text-emerald-600" />
                    View Official Stripe Receipt
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                  </a>
                </div>
              )}
            </CardContent>


            <CardFooter className="bg-muted/30 p-6 border-t border-border flex flex-col sm:flex-row items-center gap-3">
              <Link href="/dashboard/tenant/requests" className="w-full sm:w-1/2">
                <Button
                  variant="outline"
                  className="w-full rounded-2xl text-xs gap-2 border-border font-bold py-2.5"
                >
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Go to Rental Details
                </Button>
              </Link>

              <Link href="/dashboard/tenant" className="w-full sm:w-1/2">
                <Button className="w-full rounded-2xl text-xs gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 shadow-md shadow-blue-500/20">
                  <LayoutDashboard className="w-4 h-4" />
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
