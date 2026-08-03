import { z } from "zod";

export const entityIdSchema = z
  .string({ error: "ID is required" })
  .trim()
  .min(1, "ID is required")
  .max(128, "ID is too long")
  .regex(/^[A-Za-z0-9_-]+$/, "ID contains invalid characters");

export function validationMessage(error: z.ZodError) {
  return error.issues[0]?.message || "Invalid input";
}
