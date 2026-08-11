import { getPaymentHistory } from "@/app/features/api/payment.api";
import TenantDashboardClient from "../_components/TenantDashboardClient";
import type { IPaginationMeta } from "../types/tenant.types";

export default async function TenantPaymentsPage({ searchParams }: { searchParams: Promise<{ page?: string | string[] }> }) {
  const params = await searchParams;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const requestedPage = Number(rawPage || 1);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const payment = await getPaymentHistory(page, 5);

  const rawPayments = payment?.data?.data ?? payment?.data;
  const paymentHistory = Array.isArray(rawPayments) ? rawPayments : [];
  const pagination = payment?.data?.meta as IPaginationMeta | undefined;

  return (
    <TenantDashboardClient
      initialPayments={paymentHistory}
      defaultTab="payments"
      dataScope="payments"
      paymentsMeta={payment.ok ? pagination || null : null}
      errorMessage={!payment.ok ? payment.message || payment.data?.message || "Unable to load payment history." : undefined}
    />
  );
}
