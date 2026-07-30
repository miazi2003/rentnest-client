import { Suspense } from "react";
import PaymentSuccessClient from "./_components/PaymentSuccessClient";

export default function PaymentSuccessPage() {
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
