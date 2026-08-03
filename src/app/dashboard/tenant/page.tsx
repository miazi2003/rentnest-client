import { getRentalRequest } from "@/app/features/api/rental.api";
import { getPaymentHistory } from "@/app/features/api/payment.api";
import TenantDashboardClient from "./_components/TenantDashboardClient";

const TenantDashboardPage = async () => {
  const [result, payment] = await Promise.all([
    getRentalRequest(),
    getPaymentHistory(),
  ]);

  const rawRequests = result?.data?.data ?? result?.data;
  const rentalRequests = Array.isArray(rawRequests) ? rawRequests : [];

  const rawPayments = payment?.data?.data ?? payment?.data;
  const paymentHistory = Array.isArray(rawPayments) ? rawPayments : [];

  return (
    <TenantDashboardClient
      initialRequests={rentalRequests}
      initialPayments={paymentHistory}
    />
  );
};

export default TenantDashboardPage;

