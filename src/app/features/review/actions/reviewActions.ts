"use server";

import { createReview, getMyReviews, getPropertyReviews } from "@/app/features/api/review.api";
import { createReviewValidation, reviewHistoryQueryValidation } from "@/app/features/review/validations";
import { entityIdSchema, validationMessage } from "../../shared-validations";

export async function handleCreateReviewAction(payload: {
  propertyId: string;
  rating: number;
  comment: string;
}) {
  try {
    const validated = createReviewValidation.safeParse(payload);
    if (!validated.success) {
      return {
        ok: false,
        status: 400,
        message: validated.error.issues[0]?.message || "Invalid review data",
        data: null,
      };
    }

    const result = await createReview(validated.data);
    return result;
  } catch (error) {
    console.error("Action error createReview:", error);
    return {
      ok: false,
      status: 500,
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null,
    };
  }
}

export async function handleGetPropertyReviewsAction(propertyId: string) {
  try {
    const validated = entityIdSchema.safeParse(propertyId);
    if (!validated.success) {
      return {
        ok: false,
        status: 400,
        message: validationMessage(validated.error),
        data: null,
      };
    }

    const result = await getPropertyReviews(validated.data);
    return result;
  } catch (error) {
    console.error("Action error getPropertyReviews:", error);
    return {
      ok: false,
      status: 500,
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null,
    };
  }
}

export async function handleGetMyReviewsAction(page = 1, limit = 10) {
  const validation = reviewHistoryQueryValidation.safeParse({ page, limit });
  if (!validation.success) {
    return {
      ok: false,
      status: 400,
      message: validation.error.issues[0]?.message || "Invalid review history query",
      data: null,
    };
  }

  return getMyReviews(validation.data.page, validation.data.limit);
}
