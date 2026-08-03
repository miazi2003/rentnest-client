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

export type CreateReviewInput = z.infer<typeof createReviewValidation>;
