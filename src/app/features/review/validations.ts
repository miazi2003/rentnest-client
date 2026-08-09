import { z } from "zod";
import { entityIdSchema } from "../shared-validations";

export const createReviewValidation = z.object({
  propertyId: entityIdSchema,
  rating: z
    .number()
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  comment: z
    .string().trim()
    .min(1, "Feedback comment is required")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

export const reviewHistoryQueryValidation = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateReviewInput = z.infer<typeof createReviewValidation>;
