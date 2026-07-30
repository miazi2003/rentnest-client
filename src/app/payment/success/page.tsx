import { Suspense } from "react";
import PaymentSuccessClient from "@/app/dashboard/tenant/payments/success/_components/PaymentSuccessClient";

export default function RootPaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm font-semibold text-muted-foreground">
          Loading Payment Verification...
        </div>
      }
    >
      <PaymentSuccessClient />
    </Suspense>
  );
}
