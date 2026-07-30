"use server";

import {
  createCheckoutSession,
  verifyPaymentSession,
  getRentalRequestById,
} from "@/app/features/auth/service/auth.service";
import {
  createCheckoutSessionValidation,
  verifyPaymentSessionValidation,
} from "@/app/features/payment/validations";

export async function handleCreateCheckoutSessionAction(rentalRequestId: string) {
  try {
    // 1. Zod schema validation
    const validation = createCheckoutSessionValidation.safeParse({ rentalRequestId });
    if (!validation.success) {
      return {
        ok: false,
        status: 400,
        data: null,
        message: validation.error.issues[0]?.message || "Invalid rental request ID",
      };
    }

    // 2. Validate request status on server before proceeding
    if (rentalRequestId) {
      const reqRes = await getRentalRequestById(rentalRequestId);
      const reqData = reqRes?.data?.data ?? reqRes?.data;
      const statusUpper = (reqData?.status || "").toUpperCase();

      if (statusUpper === "ACTIVE" || statusUpper === "COMPLETED") {
        return {
          ok: false,
          status: 400,
          data: null,
          message: "Rental request is already paid and active/completed. Double payment blocked.",
        };
      }
    }

    const result = await createCheckoutSession(rentalRequestId);
    return result;
  } catch (error) {
    console.error("Action error createCheckoutSession:", error);
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function handleVerifyPaymentSessionAction(sessionId: string) {
  try {
    // Zod schema validation
    const validation = verifyPaymentSessionValidation.safeParse({ sessionId });
    if (!validation.success) {
      return {
        ok: false,
        status: 400,
        data: null,
        message: validation.error.issues[0]?.message || "Invalid Stripe session ID",
      };
    }

    const result = await verifyPaymentSession(sessionId);
    return result;
  } catch (error) {
    console.error("Action error verifyPaymentSession:", error);
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
