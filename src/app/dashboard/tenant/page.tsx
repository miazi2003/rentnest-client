import { getRentalRequest } from "@/app/features/api/rental.api";
import { getPaymentHistory } from "@/app/features/api/payment.api";
import TenantDashboardClient from "./_components/TenantDashboardClient";
import type { IPaginationMeta } from "./types/tenant.types";

const TenantDashboardPage = async () => {
  const [result, payment] = await Promise.all([
    getRentalRequest(1, 100),
    getPaymentHistory(1, 100),
  ]);

  const rawRequests = result?.data?.data ?? result?.data;
  const rentalRequests = Array.isArray(rawRequests) ? rawRequests : [];

  const rawPayments = payment?.data?.data ?? payment?.data;
  const paymentHistory = Array.isArray(rawPayments) ? rawPayments : [];
  const errors = [
    !result?.ok ? result?.message || result?.data?.message || "Unable to load rental requests." : null,
    !payment?.ok ? payment?.message || payment?.data?.message || "Unable to load payment history." : null,
  ].filter((message): message is string => Boolean(message));

  return (
    <TenantDashboardClient
      initialRequests={rentalRequests}
      initialPayments={paymentHistory}
      requestsMeta={(result?.data?.meta as IPaginationMeta | undefined) || null}
      paymentsMeta={(payment?.data?.meta as IPaginationMeta | undefined) || null}
      errorMessage={errors.join(" ") || undefined}
    />
  );
};

export default TenantDashboardPage;
