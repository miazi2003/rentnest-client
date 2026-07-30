import { z } from "zod";

export const createCheckoutSessionValidation = z.object({
  rentalRequestId: z.string().min(1, "Rental request ID is required"),
});

export const verifyPaymentSessionValidation = z.object({
  sessionId: z.string().min(1, "Stripe session ID is required"),
});

export type CreateCheckoutSessionInput = z.infer<
  typeof createCheckoutSessionValidation
>;
export type VerifyPaymentSessionInput = z.infer<
  typeof verifyPaymentSessionValidation
>;
