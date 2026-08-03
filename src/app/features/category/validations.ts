import { z } from "zod";

import { entityIdSchema } from "../shared-validations";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Category name must contain at least 2 characters").max(60, "Category name cannot exceed 60 characters"),
  description: z.string().trim().min(5, "Description must contain at least 5 characters").max(500, "Description cannot exceed 500 characters"),
});

export const categoryIdSchema = entityIdSchema;
export type CategoryInput = z.infer<typeof categorySchema>;
