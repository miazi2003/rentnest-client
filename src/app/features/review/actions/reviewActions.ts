"use server";

import { createReview, getPropertyReviews } from "@/app/features/api/review.api";
import { createReviewValidation } from "@/app/features/review/validations";
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
