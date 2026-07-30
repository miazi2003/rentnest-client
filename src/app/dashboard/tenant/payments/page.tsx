import { getPaymentHistory, getRentalRequest } from "@/app/features/auth/service/auth.service";
import TenantDashboardClient from "../_components/TenantDashboardClient";

export default async function TenantPaymentsPage() {
  const result = await getRentalRequest();
  const rawRequests = result?.data?.data ?? result?.data;
  const rentalRequests = Array.isArray(rawRequests) ? rawRequests : [];

  const payment = await getPaymentHistory();
  const rawPayments = payment?.data?.data ?? payment?.data;
  const paymentHistory = Array.isArray(rawPayments) ? rawPayments : [];

  return (
    <TenantDashboardClient
      initialRequests={rentalRequests}
      initialPayments={paymentHistory}
      defaultTab="payments"
    />
  );
}
