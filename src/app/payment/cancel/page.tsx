"use me";
"use client";

import React from "react";
import Link from "next/link";
import { XCircle, RefreshCw, LayoutDashboard, Building2 } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RootPaymentCancelPage() {
  return (
    <div className="max-w-md mx-auto space-y-6 py-12 pb-16">
      <Card className="rounded-3xl border-border shadow-xl overflow-hidden bg-card text-card-foreground">

        <CardHeader className="bg-rose-500/10 border-b border-rose-500/20 text-center pb-6 pt-8">
          <div className="w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-rose-500/30 mb-3">
            <XCircle className="w-9 h-9" />
          </div>
          <CardTitle className="text-2xl font-black text-foreground">
            Payment Cancelled
          </CardTitle>
          <CardDescription className="text-xs text-rose-700 dark:text-rose-300 font-medium max-w-xs mx-auto mt-1">
            You cancelled the Stripe checkout session before completing the payment. No charges were deducted.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-4 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            If you wish to complete your rental deposit or try a different payment method, you can retry checkout anytime from your approved requests list.
          </p>
        </CardContent>


        <CardFooter className="bg-muted/30 p-6 border-t border-border flex flex-col gap-3">
          <Link href="/dashboard/tenant/requests" className="w-full">
            <Button className="w-full rounded-2xl text-xs gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 shadow-md shadow-blue-500/20">
              <RefreshCw className="w-4 h-4" />
              Retry Payment
            </Button>
          </Link>

          <Link href="/dashboard/tenant/requests" className="w-full">
            <Button
              variant="outline"
              className="w-full rounded-2xl text-xs gap-2 border-border font-bold py-2.5"
            >
              <Building2 className="w-4 h-4" />
              Back to Rental Details
            </Button>
          </Link>

          <Link href="/dashboard/tenant" className="w-full">
            <Button
              variant="ghost"
              className="w-full rounded-2xl text-xs gap-2 font-bold py-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
