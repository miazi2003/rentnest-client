import { getRentalRequest } from "@/app/features/api/rental.api";
import TenantDashboardClient from "../_components/TenantDashboardClient";
import type { IPaginationMeta } from "../types/tenant.types";

export const dynamic = "force-dynamic";

export default async function TenantRequestsPage({ searchParams }: { searchParams: Promise<{ page?: string | string[] }> }) {
  const params = await searchParams;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const requestedPage = Number(rawPage || 1);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const result = await getRentalRequest(page, 5);

  const rawRequests = result?.data?.data ?? result?.data;
  const rentalRequests = Array.isArray(rawRequests) ? rawRequests : [];

  const pagination = result?.data?.meta as IPaginationMeta | undefined;

  return (
    <TenantDashboardClient
      initialRequests={rentalRequests}
      defaultTab="requests"
      dataScope="requests"
      requestsMeta={result.ok ? pagination || null : null}
      errorMessage={!result.ok ? result.message || result.data?.message || "Unable to load rental requests." : undefined}
    />
  );
}
