"use server";

import { createReview, getPropertyReviews } from "@/app/features/auth/service/auth.service";
import { createReviewValidation } from "@/app/features/review/validations";

export async function handleCreateReviewAction(payload: {
  propertyId: string;
  rating: number;
  comment: string;
}) {
  try {
    // Zod schema validation
    const validation = createReviewValidation.safeParse(payload);
    if (!validation.success) {
      return {
        ok: false,
        status: 400,
        data: null,
        message: validation.error.issues[0]?.message || "Invalid review payload",
      };
    }

    const result = await createReview(payload);
    return result;
  } catch (error) {
    console.error("Action error createReview:", error);
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function handleGetPropertyReviewsAction(propertyId: string) {
  try {
    const result = await getPropertyReviews(propertyId);
    return result;
  } catch (error) {
    console.error("Action error getPropertyReviews:", error);
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
