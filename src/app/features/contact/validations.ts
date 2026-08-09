import { z } from "zod";

export const contactValidation = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  subject: z.string().trim().max(200, "Subject cannot exceed 200 characters").optional(),
  message: z.string().trim().min(5, "Message must contain at least 5 characters").max(2000, "Message cannot exceed 2000 characters"),
});
