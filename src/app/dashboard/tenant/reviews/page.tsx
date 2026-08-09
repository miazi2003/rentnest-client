import TenantReviewsClient from "../_components/TenantReviewsClient";
import { handleGetMyReviewsAction } from "@/app/features/review/actions/reviewActions";

interface TenantReviewsPageProps {
  searchParams: Promise<{ page?: string | string[] }>;
}

export default async function TenantReviewsPage({ searchParams }: TenantReviewsPageProps) {
  const params = await searchParams;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const requestedPage = Number(rawPage || 1);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const result = await handleGetMyReviewsAction(page, 10);

  return (
    <TenantReviewsClient
      reviews={result.data?.data || []}
      meta={result.data?.meta || null}
      error={result.ok ? null : result.message}
    />
  );
}
