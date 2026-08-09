import { z } from "zod";

export const contactValidation = z.object({
  name: z.string().trim().min(1, "Name is required").max(80, "Name cannot exceed 80 characters"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(254, "Email is too long"),
  subject: z.string().trim().max(150, "Subject cannot exceed 150 characters").optional(),
  message: z.string().trim().min(1, "Message is required").max(5000, "Message cannot exceed 5000 characters"),
});
