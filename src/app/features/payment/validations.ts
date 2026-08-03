import { z } from "zod";
import { entityIdSchema } from "../shared-validations";

export const createCheckoutSessionValidation = z.object({
  rentalRequestId: entityIdSchema,
});

export const verifyPaymentSessionValidation = z.object({
  sessionId: z.string().trim().min(1, "Stripe session ID is required").max(255, "Stripe session ID is too long").regex(/^cs_[A-Za-z0-9_]+$/, "Invalid Stripe session ID"),
});

export type CreateCheckoutSessionInput = z.infer<
  typeof createCheckoutSessionValidation
>;
export type VerifyPaymentSessionInput = z.infer<
  typeof verifyPaymentSessionValidation
>;
