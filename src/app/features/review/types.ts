export interface TenantReviewProperty {
  id: string;
  title: string;
  address: string;
  images: string[];
  price: number;
}

export interface TenantReview {
  id: string;
  propertyId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  property: TenantReviewProperty;
}

export interface ReviewPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TenantReviewsResponse {
  success: boolean;
  message: string;
  data: TenantReview[];
  meta: ReviewPaginationMeta;
}
